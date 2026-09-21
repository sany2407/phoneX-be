import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { getActiveCouponsController, validateCouponController } from './coupons.controller';

const router = Router();

/**
 * @swagger
 * /coupons:
 *   get:
 *     tags: [Coupons]
 *     summary: Get all active coupons available to users
 *     responses:
 *       200:
 *         description: List of active coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       code: { type: string }
 *                       discountType: { type: string, enum: [PERCENTAGE, FLAT] }
 *                       discountValue: { type: number }
 *                       minOrderValue: { type: number }
 *                       maxDiscount: { type: number }
 *                       validUntil: { type: string, format: date-time }
 */
router.get('/', getActiveCouponsController);

/**
 * @swagger
 * /coupons/validate:
 *   post:
 *     tags: [Coupons]
 *     summary: Validate a coupon code
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, subtotal]
 *             properties:
 *               code: { type: string, example: PHONEX10 }
 *               subtotal: { type: number, example: 999 }
 *     responses:
 *       200:
 *         description: Coupon is valid, returns discount amount
 *       400:
 *         description: Invalid, expired, or already used coupon
 */
router.post('/validate', authenticate, validateCouponController);

export default router;
