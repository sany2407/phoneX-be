import { Router } from 'express';
import {
  getVariantsByProductController,
  getSkinsForModelController,
  getVariantByIdController,
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
 * /variants/by-product/{productId}:
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
 * /variants/skins/{brandSlug}/{modelSlug}:
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

export default router;
