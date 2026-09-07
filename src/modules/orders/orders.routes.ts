import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import {
  checkoutController,
  getUserOrdersController,
  getOrderByIdController,
  cancelOrderController,
  adminListOrdersController,
  adminGetOrderByIdController,
  adminUpdateOrderStatusController,
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

// Admin routes
/**
 * @swagger
 * /admin/orders:
 *   get:
 *     tags: [Admin]
 *     summary: List all orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated orders list
 */
router.get('/admin/list', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), adminListOrdersController);
router.get('/admin/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), adminGetOrderByIdController);

/**
 * @swagger
 * /admin/orders/{id}/status:
 *   patch:
 *     tags: [Admin]
 *     summary: Update order status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CONFIRMED, PROCESSING, PACKED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, REFUNDED]
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.patch('/admin/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), adminUpdateOrderStatusController);

export default router;
