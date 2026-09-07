import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
  createRazorpayOrderController,
  verifyPaymentController,
  handleWebhookController,
  getPaymentByOrderController,
} from './payments.controller';

const router = Router();

/**
 * @swagger
 * /payments/create:
 *   post:
 *     tags: [Payments]
 *     summary: Create a Razorpay payment order for an existing order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId]
 *             properties:
 *               orderId: { type: string }
 *     responses:
 *       201:
 *         description: Razorpay order created, returns razorpayOrderId and amount
 */
router.post('/create', authenticate, createRazorpayOrderController);

/**
 * @swagger
 * /payments/verify:
 *   post:
 *     tags: [Payments]
 *     summary: Verify Razorpay payment signature after frontend payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature]
 *             properties:
 *               orderId: { type: string }
 *               razorpayPaymentId: { type: string }
 *               razorpayOrderId: { type: string }
 *               razorpaySignature: { type: string }
 *     responses:
 *       200:
 *         description: Payment verified, order confirmed
 *       400:
 *         description: Invalid payment signature
 */
router.post('/verify', authenticate, verifyPaymentController);

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     tags: [Payments]
 *     summary: Razorpay webhook endpoint (server-to-server)
 *     description: |
 *       This endpoint is called by Razorpay servers. Do NOT call manually.
 *       Uses raw body for signature verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post('/webhook', handleWebhookController);

/**
 * @swagger
 * /payments/order/{orderId}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment details for an order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Payment record
 */
router.get('/order/:orderId', authenticate, getPaymentByOrderController);

export default router;
