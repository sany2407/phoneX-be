import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

export async function validateCoupon(code: string, userId: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) throw new AppError('Invalid coupon code', 400);
  if (coupon.validFrom > new Date()) throw new AppError('Coupon is not yet active', 400);
  if (coupon.validUntil < new Date()) throw new AppError('Coupon has expired', 400);
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError('Coupon usage limit reached', 400);
  }
  if (Number(coupon.minOrderValue) > subtotal) {
    throw new AppError(`Minimum order value of ₹${coupon.minOrderValue} required`, 400);
  }

  // Check if user has already used this coupon
  const used = await prisma.couponUsage.findFirst({ where: { couponId: coupon.id, userId } });
  if (used) throw new AppError('You have already used this coupon', 400);

  let discountAmount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
    if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
      discountAmount = Number(coupon.maxDiscount);
    }
  } else {
    discountAmount = Number(coupon.discountValue);
  }

  discountAmount = Math.min(discountAmount, subtotal);

  return {
    coupon,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  };
}

export async function applyCoupon(couponId: string, userId: string, orderId: string) {
  await prisma.$transaction([
    prisma.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } }),
    prisma.couponUsage.create({ data: { couponId, userId, orderId } }),
  ]);
}

export async function listCoupons(query: { page?: string; limit?: string; isActive?: string }) {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, parseInt(query.limit || '20', 10));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (query.isActive !== undefined) where.isActive = query.isActive === 'true';

  const [total, coupons] = await prisma.$transaction([
    prisma.coupon.count({ where }),
    prisma.coupon.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
  ]);
  return { coupons, total };
}

export async function createCoupon(data: {
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
}) {
  return prisma.coupon.create({
    data: {
      ...data,
      code: data.code.toUpperCase(),
      discountValue: new Decimal(data.discountValue),
      minOrderValue: data.minOrderValue ? new Decimal(data.minOrderValue) : new Decimal(0),
      maxDiscount: data.maxDiscount ? new Decimal(data.maxDiscount) : null,
      validFrom: new Date(data.validFrom),
      validUntil: new Date(data.validUntil),
    },
  });
}

export async function updateCoupon(id: string, data: Partial<{ isActive: boolean; validUntil: string; usageLimit: number }>) {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new AppError('Coupon not found', 404);
  return prisma.coupon.update({
    where: { id },
    data: {
      ...data,
      validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
    },
  });
}

export async function deactivateCoupon(id: string) {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new AppError('Coupon not found', 404);
  return prisma.coupon.update({ where: { id }, data: { isActive: false } });
}
