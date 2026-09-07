import prisma from '../../config/database';
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
}) {
  const { page, limit, skip } = parsePagination(query);

  const where: Record<string, unknown> = { isActive: true };
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.isFeatured === 'true') where.isFeatured = true;
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const orderBy: Record<string, string> = {};
  switch (query.sort) {
    case 'name_asc': orderBy.name = 'asc'; break;
    case 'name_desc': orderBy.name = 'desc'; break;
    case 'newest': orderBy.createdAt = 'desc'; break;
    default: orderBy.createdAt = 'desc';
  }

  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: productInclude,
    }),
  ]);

  return { products, pagination: buildPaginationMeta(total, page, limit) };
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

export async function createProduct(data: {
  name: string;
  description?: string;
  categoryId: string;
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
