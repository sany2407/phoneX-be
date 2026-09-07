import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { razorpayInstance, verifyPaymentSignature, verifyWebhookSignature } from '../../utils/razorpay';
import { confirmSale, releaseReservation } from '../inventory/inventory.service';
import { env } from '../../config/env';

export async function createRazorpayOrder(orderId: string, userId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });
  if (!order) throw new AppError('Order not found', 404);
  if (order.status !== 'PENDING_PAYMENT') {
    throw new AppError('Order is not in PENDING_PAYMENT status', 400);
  }

  // Amount in paise (multiply by 100)
  const amountInPaise = Math.round(Number(order.total) * 100);

  const razorpayOrder = await razorpayInstance.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: orderId.slice(0, 40),
    notes: { orderId, userId },
  });

  // Create or update payment record
  const payment = await prisma.payment.upsert({
    where: { orderId },
    create: {
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: order.total,
      currency: 'INR',
      status: 'CREATED',
    },
    update: {
      razorpayOrderId: razorpayOrder.id,
      status: 'CREATED',
    },
  });

  return {
    razorpayOrderId: razorpayOrder.id,
    amount: amountInPaise,
    currency: 'INR',
    keyId: env.RAZORPAY_KEY_ID,
    orderId,
    paymentId: payment.id,
  };
}

export async function verifyPayment(
  userId: string,
  data: {
    orderId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }
) {
  const order = await prisma.order.findFirst({
    where: { id: data.orderId, userId },
    include: { items: true, payment: true },
  });
  if (!order) throw new AppError('Order not found', 404);
  if (!order.payment) throw new AppError('Payment record not found', 404);

  // Verify signature
  const isValid = verifyPaymentSignature(
    data.razorpayOrderId,
    data.razorpayPaymentId,
    data.razorpaySignature
  );

  if (!isValid) {
    // Mark payment as failed
    await prisma.payment.update({
      where: { orderId: data.orderId },
      data: { status: 'FAILED', failureReason: 'Signature verification failed' },
    });
    // Release inventory
    for (const item of order.items) {
      await releaseReservation(item.variantId, item.quantity);
    }
    throw new AppError('Payment signature verification failed', 400);
  }

  // Confirm payment
  await confirmPaymentSuccess(order, data.razorpayPaymentId, data.razorpaySignature);

  return prisma.order.findUnique({
    where: { id: data.orderId },
    include: { payment: true, items: true },
  });
}

async function confirmPaymentSuccess(
  order: { id: string; items: Array<{ variantId: string; quantity: number }> },
  razorpayPaymentId: string,
  razorpaySignature?: string
) {
  await prisma.$transaction([
    prisma.payment.update({
      where: { orderId: order.id },
      data: {
        razorpayPaymentId,
        razorpaySignature: razorpaySignature || null,
        status: 'SUCCESS',
      },
    }),
    prisma.order.update({
      where: { id: order.id },
      data: { status: 'CONFIRMED', paymentStatus: 'PAID' },
    }),
    prisma.orderStatusHistory.create({
      data: { orderId: order.id, status: 'CONFIRMED', note: 'Payment confirmed' },
    }),
  ]);

  // Confirm inventory sale (deduct reserved stock)
  for (const item of order.items) {
    await confirmSale(item.variantId, item.quantity);
  }

  // Clear cart
  const userOrder = await prisma.order.findUnique({ where: { id: order.id } });
  if (userOrder) {
    const cart = await prisma.cart.findUnique({ where: { userId: userOrder.userId } });
    if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}

export async function handleWebhook(rawBody: Buffer, signature: string) {
  const isValid = verifyWebhookSignature(rawBody, signature);
  if (!isValid) throw new AppError('Invalid webhook signature', 400);

  const event = JSON.parse(rawBody.toString());
  const { event: eventType, payload } = event;

  if (eventType === 'payment.captured') {
    const razorpayPaymentId = payload.payment.entity.id;
    const razorpayOrderId = payload.payment.entity.order_id;

    // Find payment by razorpayOrderId
    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId },
      include: { order: { include: { items: true } } },
    });

    if (!payment || payment.status === 'SUCCESS') return; // Idempotent

    await confirmPaymentSuccess(payment.order, razorpayPaymentId);
  }

  if (eventType === 'payment.failed') {
    const razorpayOrderId = payload.payment.entity.order_id;
    const errorDescription = payload.payment.entity.error_description;

    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId },
      include: { order: { include: { items: true } } },
    });

    if (!payment || payment.status === 'FAILED') return; // Idempotent

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', failureReason: errorDescription },
      }),
      prisma.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: 'FAILED' },
      }),
    ]);

    // Release inventory reservations
    for (const item of payment.order.items) {
      await releaseReservation(item.variantId, item.quantity);
    }
  }
}

export async function getPaymentByOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({ where: { id: orderId, userId } });
  if (!order) throw new AppError('Order not found', 404);

  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment) throw new AppError('Payment not found', 404);
  return payment;
}
