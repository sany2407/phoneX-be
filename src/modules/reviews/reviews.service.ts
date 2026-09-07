import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination';

export async function createReview(
  userId: string,
  productId: string,
  data: { orderId: string; rating: number; title?: string; body?: string }
) {
  if (data.rating < 1 || data.rating > 5) throw new AppError('Rating must be between 1 and 5', 400);

  const orderItem = await prisma.orderItem.findFirst({
    where: {
      orderId: data.orderId,
      order: { userId, status: 'DELIVERED' },
      variant: { productId },
    },
  });
  if (!orderItem) throw new AppError('You can only review products from delivered orders', 403);

  const existing = await prisma.review.findFirst({ where: { productId, userId } });
  if (existing) throw new AppError('You have already reviewed this product', 409);

  return prisma.review.create({
    data: {
      productId, userId, orderId: data.orderId,
      rating: data.rating, title: data.title, body: data.body,
      isVerifiedPurchase: true, isApproved: false,
    },
    include: { user: { select: { name: true } } },
  });
}

export async function getProductReviews(productId: string, query: { page?: string; limit?: string }) {
  const { page, limit, skip } = parsePagination(query);

  const [total, reviews] = await prisma.$transaction([
    prisma.review.count({ where: { productId, isApproved: true } }),
    prisma.review.findMany({
      where: { productId, isApproved: true },
      skip, take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    }),
  ]);

  const ratingData = await prisma.review.groupBy({
    by: ['rating'],
    where: { productId, isApproved: true },
    _count: true,
  });

  type RatingRow = { rating: number; _count: number };
  const ratingSummary: Record<string | number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, average: 0, total: 0 };

  ratingData.forEach((r: RatingRow) => {
    ratingSummary[r.rating] = r._count;
    ratingSummary['total'] = (ratingSummary['total'] || 0) + r._count;
  });
  if (ratingSummary['total'] > 0) {
    const sum = ratingData.reduce((s: number, r: RatingRow) => s + r.rating * r._count, 0);
    ratingSummary['average'] = parseFloat((sum / ratingSummary['total']).toFixed(1));
  }

  return { reviews, ratingSummary, pagination: buildPaginationMeta(total, page, limit) };
}

export async function updateReview(
  userId: string,
  reviewId: string,
  data: { rating?: number; title?: string; body?: string }
) {
  const review = await prisma.review.findFirst({ where: { id: reviewId, userId } });
  if (!review) throw new AppError('Review not found', 404);
  if (data.rating && (data.rating < 1 || data.rating > 5)) throw new AppError('Rating must be 1-5', 400);

  return prisma.review.update({
    where: { id: reviewId },
    data: { ...data, isApproved: false },
    include: { user: { select: { name: true } } },
  });
}

export async function deleteReview(userId: string, reviewId: string) {
  const review = await prisma.review.findFirst({ where: { id: reviewId, userId } });
  if (!review) throw new AppError('Review not found', 404);
  await prisma.review.delete({ where: { id: reviewId } });
}

export async function listPendingReviews(query: { page?: string; limit?: string }) {
  const { page, limit, skip } = parsePagination(query);
  const [total, reviews] = await prisma.$transaction([
    prisma.review.count({ where: { isApproved: false } }),
    prisma.review.findMany({
      where: { isApproved: false },
      skip, take: limit,
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true } },
      },
    }),
  ]);
  return { reviews, pagination: buildPaginationMeta(total, page, limit) };
}

export async function approveReview(reviewId: string) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError('Review not found', 404);
  return prisma.review.update({ where: { id: reviewId }, data: { isApproved: true } });
}

export async function rejectReview(reviewId: string) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError('Review not found', 404);
  await prisma.review.delete({ where: { id: reviewId } });
}
