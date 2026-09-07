import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import {
  validateCouponController,
  listCouponsController,
  createCouponController,
  updateCouponController,
  deactivateCouponController,
} from './coupons.controller';

const router = Router();

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

// Admin
/**
 * @swagger
 * /admin/coupons:
 *   get:
 *     tags: [Admin]
 *     summary: List all coupons
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of coupons
 */
router.get('/admin', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), listCouponsController);

/**
 * @swagger
 * /admin/coupons:
 *   post:
 *     tags: [Admin]
 *     summary: Create a coupon
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, discountType, discountValue, validFrom, validUntil]
 *             properties:
 *               code: { type: string }
 *               discountType: { type: string, enum: [PERCENTAGE, FLAT] }
 *               discountValue: { type: number }
 *               minOrderValue: { type: number }
 *               maxDiscount: { type: number }
 *               validFrom: { type: string, format: date-time }
 *               validUntil: { type: string, format: date-time }
 *               usageLimit: { type: integer }
 *     responses:
 *       201:
 *         description: Coupon created
 */
router.post('/admin', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), createCouponController);
router.put('/admin/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateCouponController);
router.delete('/admin/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), deactivateCouponController);

export default router;
