import { Decimal } from '@prisma/client/runtime/library';
import type { Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { validateCoupon, applyCoupon } from '../coupons/coupons.service';
import { reserveStock, releaseReservation } from '../inventory/inventory.service';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination';

const SHIPPING_THRESHOLD = 499;
const SHIPPING_COST = 49;
const TAX_RATE = 0.18;

const orderInclude = {
  address: true,
  items: {
    include: {
      variant: {
        include: {
          product: { select: { name: true, slug: true, images: true } },
          deviceModel: { include: { brand: { select: { name: true } } } },
        },
      },
    },
  },
  payment: true,
  statusHistory: { orderBy: { createdAt: 'desc' as const } },
};

export async function checkout(
  userId: string,
  data: { addressId: string; couponCode?: string; notes?: string }
) {
  const address = await prisma.address.findFirst({ where: { id: data.addressId, userId } });
  if (!address) throw new AppError('Address not found', 404);

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { variant: true } } },
  });

  if (!cart || cart.items.length === 0) throw new AppError('Your cart is empty', 400);

  for (const item of cart.items) {
    if (!item.variant.isActive) {
      throw new AppError(`Product variant ${item.variant.sku} is no longer available`, 400);
    }
    const available = item.variant.stock - item.variant.reservedStock;
    if (available < item.quantity) {
      throw new AppError(`Insufficient stock for ${item.variant.sku}. Available: ${available}`, 400);
    }
  }

  // Calculate subtotal from DB prices - never trust frontend
  const subtotal = cart.items.reduce(
    (sum: number, item: { variant: { price: Decimal }; quantity: number }) =>
      sum + Number(item.variant.price) * item.quantity,
    0
  );

  let discount = 0;
  let couponId: string | null = null;
  let couponResult = null;
  if (data.couponCode) {
    couponResult = await validateCoupon(data.couponCode, userId, subtotal);
    discount = couponResult.discountAmount;
    couponId = couponResult.coupon.id;
  }

  const discountedSubtotal = subtotal - discount;
  const shipping = discountedSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = parseFloat((discountedSubtotal * TAX_RATE).toFixed(2));
  const total = parseFloat((discountedSubtotal + shipping + tax).toFixed(2));

  const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId: data.addressId,
        subtotal: new Decimal(subtotal),
        discount: new Decimal(discount),
        shipping: new Decimal(shipping),
        tax: new Decimal(tax),
        total: new Decimal(total),
        couponId,
        couponCode: data.couponCode?.toUpperCase() || null,
        notes: data.notes,
        items: {
          create: cart.items.map(
            (item: { variantId: string; quantity: number; variant: { price: Decimal } }) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.variant.price,
              totalPrice: new Decimal(Number(item.variant.price) * item.quantity),
            })
          ),
        },
        statusHistory: {
          create: { status: 'PENDING_PAYMENT', note: 'Order created' },
        },
      },
      include: orderInclude,
    });
    return newOrder;
  });

  for (const item of cart.items) {
    await reserveStock(item.variantId, item.quantity);
  }

  if (couponId && couponResult) {
    await applyCoupon(couponId, userId, order.id);
  }

  return order;
}

export async function getUserOrders(userId: string, query: { page?: string; limit?: string }) {
  const { page, limit, skip } = parsePagination(query);
  const [total, orders] = await prisma.$transaction([
    prisma.order.count({ where: { userId } }),
    prisma.order.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: { select: { name: true, slug: true, images: true } },
                deviceModel: { include: { brand: { select: { name: true } } } },
              },
            },
          },
        },
        payment: { select: { status: true, razorpayPaymentId: true } },
      },
    }),
  ]);
  return { orders, pagination: buildPaginationMeta(total, page, limit) };
}

export async function getOrderById(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: orderInclude,
  });
  if (!order) throw new AppError('Order not found', 404);
  return order;
}

export async function cancelOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });
  if (!order) throw new AppError('Order not found', 404);
  if (!['PENDING_PAYMENT', 'CONFIRMED'].includes(order.status)) {
    throw new AppError(`Order cannot be cancelled in ${order.status} status`, 400);
  }

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: 'CANCELLED' } }),
    prisma.orderStatusHistory.create({
      data: { orderId, status: 'CANCELLED', note: 'Cancelled by customer' },
    }),
  ]);

  for (const item of order.items) {
    await releaseReservation(item.variantId, item.quantity);
  }

  return prisma.order.findUnique({ where: { id: orderId }, include: orderInclude });
}

export async function adminListOrders(query: {
  page?: string;
  limit?: string;
  status?: string;
  userId?: string;
}) {
  const { page, limit, skip } = parsePagination(query);
  const where: Record<string, unknown> = {};
  if (query.status) where.status = query.status;
  if (query.userId) where.userId = query.userId;

  const [total, orders] = await prisma.$transaction([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        payment: { select: { status: true } },
        _count: { select: { items: true } },
      },
    }),
  ]);
  return { orders, pagination: buildPaginationMeta(total, page, limit) };
}

export async function adminGetOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      ...orderInclude,
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
  if (!order) throw new AppError('Order not found', 404);
  return order;
}

export async function adminUpdateOrderStatus(orderId: string, status: string, note?: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError('Order not found', 404);

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: status as never } }),
    prisma.orderStatusHistory.create({ data: { orderId, status: status as never, note } }),
  ]);

  return prisma.order.findUnique({ where: { id: orderId }, include: orderInclude });
}
