import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { generateSlug } from '../../utils/slug';

export async function getAllCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      children: { where: { isActive: true } },
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: { name: 'asc' },
  });
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findFirst({
    where: { slug, isActive: true },
    include: {
      children: { where: { isActive: true } },
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
  if (!category) throw new AppError('Category not found', 404);
  return category;
}

export async function createCategory(data: {
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
}) {
  const slug = generateSlug(data.name);
  return prisma.category.create({ data: { ...data, slug } });
}

export async function updateCategory(
  id: string,
  data: { name?: string; description?: string; imageUrl?: string; isActive?: boolean }
) {
  await findCategoryById(id);
  const updateData: Record<string, unknown> = { ...data };
  if (data.name) updateData.slug = generateSlug(data.name);
  return prisma.category.update({ where: { id }, data: updateData });
}

export async function deleteCategory(id: string) {
  await findCategoryById(id);
  return prisma.category.update({ where: { id }, data: { isActive: false } });
}

async function findCategoryById(id: string) {
  const cat = await prisma.category.findUnique({ where: { id } });
  if (!cat) throw new AppError('Category not found', 404);
  return cat;
}
