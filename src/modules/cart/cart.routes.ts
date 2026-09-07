import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
  getCartController,
  addItemController,
  updateItemController,
  removeItemController,
  clearCartController,
} from './cart.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get current user's cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart with items and totals
 */
router.get('/', getCartController);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [variantId]
 *             properties:
 *               variantId: { type: string }
 *               quantity: { type: integer, default: 1 }
 *     responses:
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Insufficient stock
 */
router.post('/items', addItemController);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   put:
 *     tags: [Cart]
 *     summary: Update cart item quantity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Cart item updated
 */
router.put('/items/:itemId', updateItemController);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove item from cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Item removed
 */
router.delete('/items/:itemId', removeItemController);

/**
 * @swagger
 * /cart:
 *   delete:
 *     tags: [Cart]
 *     summary: Clear entire cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete('/', clearCartController);

export default router;
