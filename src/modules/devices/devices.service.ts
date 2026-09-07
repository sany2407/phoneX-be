import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { generateSlug } from '../../utils/slug';

// ─── Brands ──────────────────────────────────────────────

export async function getAllBrands() {
  return prisma.deviceBrand.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: { _count: { select: { models: { where: { isActive: true } } } } },
  });
}

export async function getBrandBySlug(slug: string) {
  const brand = await prisma.deviceBrand.findFirst({
    where: { slug, isActive: true },
    include: {
      models: {
        where: { isActive: true },
        orderBy: { name: 'asc' },
      },
    },
  });
  if (!brand) throw new AppError('Brand not found', 404);
  return brand;
}

export async function createBrand(data: { name: string; logoUrl?: string }) {
  const slug = generateSlug(data.name);
  return prisma.deviceBrand.create({ data: { name: data.name, slug, logoUrl: data.logoUrl } });
}

export async function updateBrand(id: string, data: { name?: string; logoUrl?: string; isActive?: boolean }) {
  await findBrandById(id);
  const updateData: Record<string, unknown> = { ...data };
  if (data.name) updateData.slug = generateSlug(data.name);
  return prisma.deviceBrand.update({ where: { id }, data: updateData });
}

export async function deleteBrand(id: string) {
  await findBrandById(id);
  return prisma.deviceBrand.update({ where: { id }, data: { isActive: false } });
}

async function findBrandById(id: string) {
  const brand = await prisma.deviceBrand.findUnique({ where: { id } });
  if (!brand) throw new AppError('Brand not found', 404);
  return brand;
}

// ─── Models ──────────────────────────────────────────────

export async function getModelsByBrand(brandSlug: string) {
  const brand = await prisma.deviceBrand.findFirst({ where: { slug: brandSlug, isActive: true } });
  if (!brand) throw new AppError('Brand not found', 404);

  return prisma.deviceModel.findMany({
    where: { brandId: brand.id, isActive: true },
    orderBy: { name: 'asc' },
  });
}

export async function getModelBySlug(brandSlug: string, modelSlug: string) {
  const brand = await prisma.deviceBrand.findFirst({ where: { slug: brandSlug, isActive: true } });
  if (!brand) throw new AppError('Brand not found', 404);

  const model = await prisma.deviceModel.findFirst({
    where: { brandId: brand.id, slug: modelSlug, isActive: true },
    include: { brand: true },
  });
  if (!model) throw new AppError('Model not found', 404);
  return model;
}

export async function createModel(data: { brandId: string; name: string; imageUrl?: string }) {
  const brand = await findBrandById(data.brandId);
  const slug = generateSlug(data.name);
  return prisma.deviceModel.create({
    data: { brandId: brand.id, name: data.name, slug, imageUrl: data.imageUrl },
    include: { brand: true },
  });
}

export async function updateModel(id: string, data: { name?: string; imageUrl?: string; isActive?: boolean }) {
  await findModelById(id);
  const updateData: Record<string, unknown> = { ...data };
  if (data.name) updateData.slug = generateSlug(data.name);
  return prisma.deviceModel.update({ where: { id }, data: updateData, include: { brand: true } });
}

export async function deleteModel(id: string) {
  await findModelById(id);
  return prisma.deviceModel.update({ where: { id }, data: { isActive: false } });
}

async function findModelById(id: string) {
  const model = await prisma.deviceModel.findUnique({ where: { id } });
  if (!model) throw new AppError('Model not found', 404);
  return model;
}
