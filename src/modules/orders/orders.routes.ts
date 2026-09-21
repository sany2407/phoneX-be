import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
  checkoutController,
  getUserOrdersController,
  getOrderByIdController,
  cancelOrderController,
} from './orders.controller';

const router = Router();

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     tags: [Orders]
 *     summary: Create an order from the current cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [addressId]
 *             properties:
 *               addressId: { type: string }
 *               couponCode: { type: string }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Order created with PENDING_PAYMENT status
 *       400:
 *         description: Empty cart, insufficient stock, or invalid coupon
 */
router.post('/checkout', authenticate, checkoutController);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get current user's orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated list of orders
 */
router.get('/', authenticate, getUserOrdersController);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order detail with items, payment, and status history
 */
router.get('/:id', authenticate, getOrderByIdController);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   post:
 *     tags: [Orders]
 *     summary: Cancel an order (PENDING_PAYMENT or CONFIRMED only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order cancelled and inventory released
 *       400:
 *         description: Order cannot be cancelled in current status
 */
router.post('/:id/cancel', authenticate, cancelOrderController);

export default router;
