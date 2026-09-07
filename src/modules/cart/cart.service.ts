import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

const cartItemInclude = {
  variant: {
    include: {
      product: { select: { id: true, name: true, slug: true, images: true } },
      deviceModel: { include: { brand: { select: { name: true } } } },
    },
  },
};

export async function getCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: cartItemInclude } },
  });
  if (!cart) throw new AppError('Cart not found', 404);

  const totals = calculateCartTotals(cart.items);
  return { ...cart, ...totals };
}

export async function addItem(userId: string, variantId: string, quantity: number) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError('Cart not found', 404);

  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant || !variant.isActive) throw new AppError('Product variant not found or unavailable', 404);

  const available = variant.stock - variant.reservedStock;
  if (available < quantity) throw new AppError(`Only ${available} item(s) in stock`, 400);

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  });

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (available < newQty) throw new AppError(`Only ${available} item(s) in stock`, 400);
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQty },
      include: cartItemInclude,
    });
  }

  return prisma.cartItem.create({
    data: { cartId: cart.id, variantId, quantity },
    include: cartItemInclude,
  });
}

export async function updateItem(userId: string, cartItemId: string, quantity: number) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError('Cart not found', 404);

  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cartId: cart.id },
    include: { variant: true },
  });
  if (!item) throw new AppError('Cart item not found', 404);

  const available = item.variant.stock - item.variant.reservedStock;
  if (available < quantity) throw new AppError(`Only ${available} item(s) in stock`, 400);

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: cartItemInclude,
  });
}

export async function removeItem(userId: string, cartItemId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError('Cart not found', 404);

  const item = await prisma.cartItem.findFirst({ where: { id: cartItemId, cartId: cart.id } });
  if (!item) throw new AppError('Cart item not found', 404);

  await prisma.cartItem.delete({ where: { id: cartItemId } });
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError('Cart not found', 404);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

export function calculateCartTotals(items: Array<{ quantity: number; variant: { price: Decimal } }>) {
  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.variant.price) * item.quantity;
  }, 0);
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
