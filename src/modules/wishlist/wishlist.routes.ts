import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { getWishlistController, addToWishlistController, removeFromWishlistController } from './wishlist.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get current user's wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist with items
 */
router.get('/', getWishlistController);

/**
 * @swagger
 * /wishlist/{variantId}:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add variant to wishlist (idempotent)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Added to wishlist
 */
router.post('/:variantId', addToWishlistController);

/**
 * @swagger
 * /wishlist/{variantId}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Remove variant from wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Removed from wishlist
 */
router.delete('/:variantId', removeFromWishlistController);

export default router;
