import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

const variantInclude = {
  product: { include: { category: true } },
  deviceModel: { include: { brand: true } },
};

export async function createVariant(data: {
  productId: string;
  deviceModelId: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images?: string[];
}) {
  return prisma.productVariant.create({
    data: {
      productId: data.productId,
      deviceModelId: data.deviceModelId,
      sku: data.sku,
      price: new Decimal(data.price),
      comparePrice: data.comparePrice ? new Decimal(data.comparePrice) : null,
      stock: data.stock,
      images: data.images || [],
    },
    include: variantInclude,
  });
}

export async function getVariantsByProduct(productId: string) {
  return prisma.productVariant.findMany({
    where: { productId, isActive: true },
    include: variantInclude,
    orderBy: { deviceModel: { name: 'asc' } },
  });
}

export async function getVariantsByDeviceModel(deviceModelId: string) {
  return prisma.productVariant.findMany({
    where: { deviceModelId, isActive: true },
    include: {
      product: { include: { category: true } },
      deviceModel: { include: { brand: true } },
    },
    orderBy: { product: { name: 'asc' } },
  });
}

export async function getVariantById(id: string) {
  const variant = await prisma.productVariant.findUnique({
    where: { id },
    include: variantInclude,
  });
  if (!variant) throw new AppError('Variant not found', 404);
  return variant;
}

export async function updateVariant(
  id: string,
  data: {
    price?: number;
    comparePrice?: number | null;
    stock?: number;
    images?: string[];
    isActive?: boolean;
  }
) {
  await getVariantById(id);
  const updateData: Record<string, unknown> = {};
  if (data.price !== undefined) updateData.price = new Decimal(data.price);
  if (data.comparePrice !== undefined) updateData.comparePrice = data.comparePrice ? new Decimal(data.comparePrice) : null;
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.images !== undefined) updateData.images = data.images;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  return prisma.productVariant.update({
    where: { id },
    data: updateData,
    include: variantInclude,
  });
}

export async function getSkinsForDeviceModel(brandSlug: string, modelSlug: string) {
  const model = await prisma.deviceModel.findFirst({
    where: { slug: modelSlug, isActive: true, brand: { slug: brandSlug, isActive: true } },
    include: { brand: true },
  });
  if (!model) throw new AppError('Device model not found', 404);

  const variants = await prisma.productVariant.findMany({
    where: { deviceModelId: model.id, isActive: true },
    include: {
      product: { include: { category: true } },
    },
    orderBy: { product: { name: 'asc' } },
  });

  return { model, variants };
}
