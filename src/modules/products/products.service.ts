import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../../config/database';
import type { Prisma } from '@prisma/client';
import { AppError } from '../../middleware/error.middleware';
import { generateSlug } from '../../utils/slug';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination';

const variantInclude = {
  deviceModel: {
    include: { brand: true },
  },
};

const productInclude = {
  category: true,
  variants: {
    where: { isActive: true },
    include: variantInclude,
  },
};

export async function listProducts(query: {
  page?: string;
  limit?: string;
  categoryId?: string;
  search?: string;
  sort?: string;
  isFeatured?: string;
  material?: string;
  finish?: string;
  minRating?: string;
  maxPrice?: string;
  inStock?: string;
  deviceType?: string;
  onSale?: string;
}) {
  const { page, limit, skip } = parsePagination(query);

  const where: Record<string, unknown> = { isActive: true };
  if (query.categoryId) {
    const ids = query.categoryId.split(',').map((s) => s.trim()).filter(Boolean);
    if (ids.length === 1) where.categoryId = ids[0];
    else if (ids.length > 1) where.categoryId = { in: ids };
  }
  if (query.isFeatured === 'true') where.isFeatured = true;
  if (query.material) {
    const values = query.material.split(',').map((s) => s.trim()).filter(Boolean);
    if (values.length === 1) where.material = values[0];
    else if (values.length > 1) where.material = { in: values };
  }
  if (query.finish) {
    const values = query.finish.split(',').map((s) => s.trim()).filter(Boolean);
    if (values.length === 1) where.finish = values[0];
    else if (values.length > 1) where.finish = { in: values };
  }
  if (query.minRating) {
    const min = Number(query.minRating);
    if (Number.isFinite(min)) where.rating = { gte: min };
  }

  // Variant-level conditions share one `some` so a single variant
  // satisfies device type + price + stock together.
  const variantAnd: Record<string, unknown>[] = [];
  if (query.deviceType) {
    variantAnd.push({
      isActive: true,
      deviceModel: { deviceType: { slug: query.deviceType } },
    });
  }
  if (query.maxPrice) {
    const max = Number(query.maxPrice);
    if (Number.isFinite(max)) variantAnd.push({ price: { lte: max } });
  }
  if (query.inStock === 'true') variantAnd.push({ stock: { gt: 0 } });
  if (query.onSale === 'true') {
    // A product is "on sale" when any active variant carries a compare-at price
    variantAnd.push({ isActive: true, comparePrice: { not: null } });
  }
  if (variantAnd.length > 0) where.variants = { some: { AND: variantAnd } };
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
  switch (query.sort) {
    case 'name_asc': orderBy.push({ name: 'asc' }); break;
    case 'name_desc': orderBy.push({ name: 'desc' }); break;
    case 'newest': orderBy.push({ createdAt: 'desc' }); break;
    case 'rating': orderBy.push({ rating: 'desc' }); break;
    case 'popular': orderBy.push({ reviewCount: 'desc' }); break;
    case 'featured': orderBy.push({ isFeatured: 'desc' }, { updatedAt: 'desc' }); break;
    default: orderBy.push({ updatedAt: 'desc' });
  }

  // Price lives on variants (no product column), so price sorts run in
  // memory: fetch the full filtered set (capped), sort, then slice the page.
  // Counts stay exact; revisit with a stored price column if the catalog
  // grows past a few thousand products.
  const isPriceSort = query.sort === 'price-asc' || query.sort === 'price-desc';

  const findArgs: {
    where: Record<string, unknown>;
    skip?: number;
    take: number;
    orderBy: Prisma.ProductOrderByWithRelationInput[];
    include: typeof productInclude;
  } = isPriceSort
    ? { where, take: 2000, orderBy: [{ updatedAt: 'desc' }], include: productInclude }
    : { where, skip, take: limit, orderBy, include: productInclude };

  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany(findArgs),
  ]);

  let items = products;
  if (isPriceSort) {
    const dir = query.sort === 'price-asc' ? 1 : -1;
    items = [...products]
      .sort((a, b) => (minVariantPrice(a) - minVariantPrice(b)) * dir)
      .slice(skip, skip + limit);
  }

  return { products: items, pagination: buildPaginationMeta(total, page, limit) };
}

// Lowest active-variant price — products without variants sort last.
function minVariantPrice(p: { variants?: { price: unknown }[] }): number {
  const prices = (p.variants ?? [])
    .map((v) => Number(v.price))
    .filter((n) => Number.isFinite(n) && n > 0);
  return prices.length ? Math.min(...prices) : Number.POSITIVE_INFINITY;
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
        include: {
          deviceModel: { include: { brand: true } },
        },
        orderBy: { deviceModel: { name: 'asc' } },
      },
      reviews: {
        where: { isApproved: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
      },
    },
  });
  if (!product) throw new AppError('Product not found', 404);
  return product;
}

export async function getProductFacets() {
  const [materials, finishes] = await prisma.$transaction([
    prisma.product.findMany({
      where: { isActive: true },
      select: { material: true },
      distinct: ['material'],
      orderBy: { material: 'asc' },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { finish: true },
      distinct: ['finish'],
      orderBy: { finish: 'asc' },
    }),
  ]);
  return {
    materials: materials.map((m) => m.material),
    finishes: finishes.map((f) => f.finish),
  };
}

/** Recompute a product's stored rating average + count from approved reviews. */
export async function recomputeProductRating(productId: string) {
  const agg = await prisma.review.aggregate({
    where: { productId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: agg._avg.rating ?? 0,
      reviewCount: agg._count.rating,
    },
  });
}
export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: productInclude,
    take: 12,
    orderBy: { updatedAt: 'desc' },
  });
}

export async function searchProducts(query: string) {
  if (!query || query.trim().length < 2) throw new AppError('Search query must be at least 2 characters', 400);
  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: productInclude,
    take: 20,
  });
}

export async function createProductWithVariants(data: {
  name: string;
  description?: string;
  categoryId: string;
  images?: string[];
  isFeatured?: boolean;
  variants: Array<{
    deviceModelId: string;
    price: number;
    comparePrice?: number;
    stock: number;
    images?: string[];
  }>;
}) {
  const slug = generateSlug(data.name);

  // Check for duplicate deviceModelIds in the request itself
  const modelIds = data.variants.map(v => v.deviceModelId);
  const uniqueModelIds = new Set(modelIds);
  if (uniqueModelIds.size !== modelIds.length) {
    throw new AppError('Duplicate device models in variants list', 400);
  }

  return prisma.$transaction(async (tx) => {
    // 1. Create the product
    const product = await tx.product.create({
      data: {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        slug,
        images: data.images || [],
        isFeatured: data.isFeatured || false,
      },
    });

    // 2. Create all variants
    await tx.productVariant.createMany({
      data: data.variants.map(v => ({
        productId: product.id,
        deviceModelId: v.deviceModelId,
        sku: `${slug}-${v.deviceModelId}`.slice(0, 100),
        price: new Decimal(v.price),
        comparePrice: v.comparePrice ? new Decimal(v.comparePrice) : null,
        stock: v.stock,
        images: v.images || [],
      })),
    });

    // 3. Return the product with all variants
    return tx.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        variants: {
          include: {
            deviceModel: { include: { brand: true, deviceType: true } },
          },
        },
      },
    });
  });
}

export async function createProduct(data: {
  name: string;
  description?: string;
  categoryId: string;
  material?: string;
  finish?: string;
  tags?: string[];
  isNew?: boolean;
  images?: string[];
  isFeatured?: boolean;
}) {
  const slug = generateSlug(data.name);
  return prisma.product.create({
    data: { ...data, slug, images: data.images || [] },
    include: productInclude,
  });
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    categoryId?: string;
    material?: string;
    finish?: string;
    tags?: string[];
    isNew?: boolean;
    images?: string[];
    isFeatured?: boolean;
    isActive?: boolean;
  }
) {
  await findProductById(id);
  const updateData: Record<string, unknown> = { ...data };
  if (data.name) updateData.slug = generateSlug(data.name);
  return prisma.product.update({ where: { id }, data: updateData, include: productInclude });
}

export async function deleteProduct(id: string) {
  await findProductById(id);
  return prisma.product.update({ where: { id }, data: { isActive: false } });
}

export async function addProductImages(id: string, imageUrls: string[]) {
  const product = await findProductById(id);
  return prisma.product.update({
    where: { id },
    data: { images: [...product.images, ...imageUrls] },
  });
}

async function findProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError('Product not found', 404);
  return product;
}
