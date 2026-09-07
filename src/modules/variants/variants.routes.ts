import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import {
  createVariantController,
  getVariantsByProductController,
  getSkinsForModelController,
  getVariantByIdController,
  updateVariantController,
} from './variants.controller';

const router = Router();

/**
 * @swagger
 * /variants/{id}:
 *   get:
 *     tags: [Variants]
 *     summary: Get variant by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Variant detail
 */
router.get('/:id', getVariantByIdController);

/**
 * @swagger
 * /products/{productId}/variants:
 *   get:
 *     tags: [Variants]
 *     summary: Get all variants for a product (across all device models)
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of variants
 */
router.get('/by-product/:productId', getVariantsByProductController);

/**
 * @swagger
 * /devices/brands/{brandSlug}/models/{modelSlug}/skins:
 *   get:
 *     tags: [Variants]
 *     summary: Get all available skins for a specific device model
 *     parameters:
 *       - in: path
 *         name: brandSlug
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: modelSlug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Device model with available skin variants
 */
router.get('/skins/:brandSlug/:modelSlug', getSkinsForModelController);

// Admin
/**
 * @swagger
 * /admin/variants:
 *   post:
 *     tags: [Admin]
 *     summary: Create a product variant (skin + device model combination)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, deviceModelId, sku, price, stock]
 *             properties:
 *               productId: { type: string }
 *               deviceModelId: { type: string }
 *               sku: { type: string }
 *               price: { type: number }
 *               comparePrice: { type: number }
 *               stock: { type: integer }
 *               images: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Variant created
 */
router.post('/admin', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), createVariantController);
router.put('/admin/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateVariantController);

export default router;
