import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { generateSlug } from '../../utils/slug';

// ─── Device Types (Master) ────────────────────────────────

export async function getAllDeviceTypes() {
  return prisma.deviceType.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: { _count: { select: { models: { where: { isActive: true } } } } },
  });
}

/** Admin list — includes inactive types so they can be managed/reactivated. */
export async function getAllDeviceTypesAdmin() {
  return prisma.deviceType.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { models: { where: { isActive: true } } } } },
  });
}

export async function createDeviceType(data: { name: string }) {
  const slug = generateSlug(data.name);
  const existing = await prisma.deviceType.findUnique({ where: { slug } });
  if (existing) throw new AppError('Device type already exists', 409);
  return prisma.deviceType.create({ data: { name: data.name, slug } });
}

export async function updateDeviceType(id: string, data: { name?: string; isActive?: boolean }) {
  await findDeviceTypeById(id);
  const updateData: Record<string, unknown> = { ...data };
  if (data.name) updateData.slug = generateSlug(data.name);
  return prisma.deviceType.update({ where: { id }, data: updateData });
}

export async function deleteDeviceType(id: string) {
  await findDeviceTypeById(id);
  return prisma.deviceType.update({ where: { id }, data: { isActive: false } });
}

async function findDeviceTypeById(id: string) {
  const type = await prisma.deviceType.findUnique({ where: { id } });
  if (!type) throw new AppError('Device type not found', 404);
  return type;
}

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
        include: { deviceType: true },
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

export async function getModelsByBrand(brandSlug: string, deviceTypeSlug?: string) {
  const brand = await prisma.deviceBrand.findFirst({ where: { slug: brandSlug, isActive: true } });
  if (!brand) throw new AppError('Brand not found', 404);

  const where: Record<string, unknown> = { brandId: brand.id, isActive: true };
  if (deviceTypeSlug) {
    const type = await prisma.deviceType.findUnique({ where: { slug: deviceTypeSlug } });
    if (!type) throw new AppError('Device type not found', 404);
    where.deviceTypeId = type.id;
  }

  return prisma.deviceModel.findMany({
    where,
    orderBy: { name: 'asc' },
    include: { deviceType: true },
  });
}

export async function getModelBySlug(brandSlug: string, modelSlug: string) {
  const brand = await prisma.deviceBrand.findFirst({ where: { slug: brandSlug, isActive: true } });
  if (!brand) throw new AppError('Brand not found', 404);

  const model = await prisma.deviceModel.findFirst({
    where: { brandId: brand.id, slug: modelSlug, isActive: true },
    include: { brand: true, deviceType: true },
  });
  if (!model) throw new AppError('Model not found', 404);
  return model;
}

export async function createModel(data: {
  brandId: string;
  deviceTypeId?: string;
  name: string;
  imageUrl?: string;
}) {
  await findBrandById(data.brandId);
  if (data.deviceTypeId) await findDeviceTypeById(data.deviceTypeId);
  const slug = generateSlug(data.name);
  return prisma.deviceModel.create({
    data: {
      brandId: data.brandId,
      deviceTypeId: data.deviceTypeId,
      name: data.name,
      slug,
      imageUrl: data.imageUrl,
    },
    include: { brand: true, deviceType: true },
  });
}

export async function updateModel(
  id: string,
  data: { name?: string; deviceTypeId?: string; imageUrl?: string; isActive?: boolean }
) {
  await findModelById(id);
  if (data.deviceTypeId) await findDeviceTypeById(data.deviceTypeId);
  const updateData: Record<string, unknown> = { ...data };
  if (data.name) updateData.slug = generateSlug(data.name);
  return prisma.deviceModel.update({
    where: { id },
    data: updateData,
    include: { brand: true, deviceType: true },
  });
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

// ─── List models by device type (cross-brand) ────────────

export async function getModelsByDeviceType(deviceTypeSlug: string) {
  const type = await prisma.deviceType.findUnique({
    where: { slug: deviceTypeSlug },
  });
  if (!type) throw new AppError('Device type not found', 404);

  return prisma.deviceModel.findMany({
    where: { deviceTypeId: type.id, isActive: true },
    orderBy: [{ brand: { name: 'asc' } }, { name: 'asc' }],
    include: { brand: true, deviceType: true },
  });
}
