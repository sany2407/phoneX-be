import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

const wishlistItemInclude = {
  variant: {
    include: {
      product: { select: { id: true, name: true, slug: true, images: true } },
      deviceModel: { include: { brand: { select: { name: true } } } },
    },
  },
};

export async function getWishlist(userId: string) {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: { items: { include: wishlistItemInclude, orderBy: { createdAt: 'desc' } } },
  });
  if (!wishlist) throw new AppError('Wishlist not found', 404);
  return wishlist;
}

export async function addToWishlist(userId: string, variantId: string) {
  const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
  if (!wishlist) throw new AppError('Wishlist not found', 404);

  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant || !variant.isActive) throw new AppError('Variant not found', 404);

  // Upsert — idempotent
  return prisma.wishlistItem.upsert({
    where: { wishlistId_variantId: { wishlistId: wishlist.id, variantId } },
    create: { wishlistId: wishlist.id, variantId },
    update: {},
    include: wishlistItemInclude,
  });
}

export async function removeFromWishlist(userId: string, variantId: string) {
  const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
  if (!wishlist) throw new AppError('Wishlist not found', 404);

  await prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.id, variantId },
  });
}
