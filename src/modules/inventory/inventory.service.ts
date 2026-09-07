import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

export async function adjustStock(
  variantId: string,
  quantity: number,
  type: 'RESTOCK' | 'SALE' | 'RETURN' | 'ADJUSTMENT',
  note?: string
) {
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) throw new AppError('Variant not found', 404);

  const newStock = variant.stock + quantity;
  if (newStock < 0) throw new AppError('Insufficient stock', 400);

  const [updated] = await prisma.$transaction([
    prisma.productVariant.update({ where: { id: variantId }, data: { stock: newStock } }),
    prisma.inventoryTransaction.create({ data: { variantId, type, quantity, note } }),
  ]);
  return updated;
}

export async function reserveStock(variantId: string, quantity: number) {
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) throw new AppError('Variant not found', 404);

  const available = variant.stock - variant.reservedStock;
  if (available < quantity) throw new AppError(`Insufficient stock for variant ${variantId}`, 400);

  return prisma.productVariant.update({
    where: { id: variantId },
    data: { reservedStock: { increment: quantity } },
  });
}

export async function releaseReservation(variantId: string, quantity: number) {
  return prisma.productVariant.update({
    where: { id: variantId },
    data: { reservedStock: { decrement: quantity } },
  });
}

export async function confirmSale(variantId: string, quantity: number) {
  await prisma.$transaction([
    prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: { decrement: quantity }, reservedStock: { decrement: quantity } },
    }),
    prisma.inventoryTransaction.create({
      data: { variantId, type: 'SALE', quantity: -quantity, note: 'Order confirmed' },
    }),
  ]);
}

export async function getInventoryReport(query: { page?: string; limit?: string; lowStock?: string }) {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, parseInt(query.limit || '50', 10));
  const skip = (page - 1) * limit;
  const where = { isActive: true };

  const [total, variants] = await prisma.$transaction([
    prisma.productVariant.count({ where }),
    prisma.productVariant.findMany({
      where,
      skip,
      take: limit,
      include: {
        product: { select: { name: true, slug: true } },
        deviceModel: { include: { brand: { select: { name: true } } } },
      },
      orderBy: { stock: 'asc' },
    }),
  ]);

  type VariantRow = typeof variants[number];
  const enriched = variants.map((v: VariantRow) => ({
    ...v,
    availableStock: v.stock - v.reservedStock,
    isLowStock: v.stock - v.reservedStock < 5,
  }));

  type EnrichedRow = VariantRow & { availableStock: number; isLowStock: boolean };
  if (query.lowStock === 'true') {
    const lowOnly = enriched.filter((v: EnrichedRow) => v.isLowStock);
    return { variants: lowOnly, total: lowOnly.length };
  }

  return { variants: enriched, total };
}

export async function updateInventory(variantId: string, stock: number, note?: string) {
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) throw new AppError('Variant not found', 404);

  const diff = stock - variant.stock;
  const type: 'RESTOCK' | 'ADJUSTMENT' = diff >= 0 ? 'RESTOCK' : 'ADJUSTMENT';

  return prisma.$transaction([
    prisma.productVariant.update({ where: { id: variantId }, data: { stock } }),
    prisma.inventoryTransaction.create({
      data: { variantId, type, quantity: diff, note: note || 'Manual adjustment' },
    }),
  ]);
}
