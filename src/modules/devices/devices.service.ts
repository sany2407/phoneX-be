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

export async function createBrand(data: { name: string; slug?: string; logoUrl?: string | null }) {
  const name = data.name?.trim();
  if (!name) throw new AppError('Brand name is required', 400);

  const slug = await resolveBrandSlug(data.slug || generateSlug(name));

  return prisma.deviceBrand.create({
    data: { name, slug, logoUrl: normalizeImageUrl(data.logoUrl) },
  });
}

export async function updateBrand(
  id: string,
  data: { name?: string; slug?: string; logoUrl?: string | null; isActive?: boolean }
) {
  await findBrandById(id);
  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) {
    const name = data.name.trim();
    if (!name) throw new AppError('Brand name is required', 400);
    updateData.name = name;
    // Keep the slug stable unless the admin explicitly supplies a new one.
    if (data.slug === undefined) updateData.slug = await resolveBrandSlug(generateSlug(name), id);
  }
  if (data.slug !== undefined) updateData.slug = await resolveBrandSlug(data.slug, id);
  if (data.logoUrl !== undefined) updateData.logoUrl = normalizeImageUrl(data.logoUrl);
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

  return prisma.deviceBrand.update({ where: { id }, data: updateData });
}

/** Normalise a slug and reject collisions (including deactivated brands). */
async function resolveBrandSlug(raw: string, excludeId?: string) {
  const slug = generateSlug(raw);
  if (!slug) throw new AppError('A valid slug is required', 400);

  const clash = await prisma.deviceBrand.findFirst({
    where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true },
  });
  if (clash) throw new AppError(`Slug "${slug}" is already in use`, 409);

  return slug;
}

/** Empty string / whitespace clears the field; anything else must be an http(s) URL. */
function normalizeImageUrl(value?: string | null): string | null {
  if (value === undefined || value === null) return null;
  const url = value.trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) {
    throw new AppError('Image URL must start with http:// or https://', 400);
  }
  return url;
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
  imageUrl?: string | null;
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
      imageUrl: normalizeImageUrl(data.imageUrl),
    },
    include: { brand: true, deviceType: true },
  });
}

export async function updateModel(
  id: string,
  data: { name?: string; deviceTypeId?: string; imageUrl?: string | null; isActive?: boolean }
) {
  await findModelById(id);
  if (data.deviceTypeId) await findDeviceTypeById(data.deviceTypeId);
  const updateData: Record<string, unknown> = { ...data };
  if (data.name) updateData.slug = generateSlug(data.name);
  if (data.imageUrl !== undefined) updateData.imageUrl = normalizeImageUrl(data.imageUrl);
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

// ─── Categories with skins on real devices ───────────────

/**
 * Design categories that actually have skins available for the given device
 * scope, each carrying the device models it covers. The storefront device
 * pages use this so category filtering reflects live inventory instead of
 * listing every category in the catalogue.
 *
 * Exactly one of `typeSlug` and `brandSlug` must be provided.
 */
export async function getAvailableCategories(filter: { typeSlug?: string; brandSlug?: string }) {
  if (Boolean(filter.typeSlug) === Boolean(filter.brandSlug)) {
    throw new AppError('Provide exactly one of ?type or ?brand', 400);
  }

  const deviceModelWhere: Record<string, unknown> = { isActive: true };
  if (filter.typeSlug) {
    const type = await prisma.deviceType.findUnique({ where: { slug: filter.typeSlug } });
    if (!type) throw new AppError('Device type not found', 404);
    deviceModelWhere.deviceTypeId = type.id;
  } else {
    const brand = await prisma.deviceBrand.findUnique({ where: { slug: filter.brandSlug as string } });
    if (!brand) throw new AppError('Device brand not found', 404);
    deviceModelWhere.brandId = brand.id;
  }

  const variants = await prisma.productVariant.findMany({
    where: {
      isActive: true,
      deviceModel: deviceModelWhere,
      product: { isActive: true, category: { isActive: true } },
    },
    select: {
      deviceModelId: true,
      product: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  type CategoryCoverage = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    modelIds: string[];
  };
  const byCategory = new Map<string, CategoryCoverage>();
  for (const variant of variants) {
    const category = variant.product.category;
    if (!category) continue;
    let entry = byCategory.get(category.id);
    if (!entry) {
      entry = { ...category, modelIds: [] };
      byCategory.set(category.id, entry);
    }
    if (!entry.modelIds.includes(variant.deviceModelId)) {
      entry.modelIds.push(variant.deviceModelId);
    }
  }

  return [...byCategory.values()].sort((a, b) => a.name.localeCompare(b.name));
}
