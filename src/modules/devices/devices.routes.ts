import { Router } from 'express';
import {
  getAllBrandsController,
  getBrandBySlugController,
  getModelsByBrandController,
  getModelBySlugController,
} from './devices.controller';

const router = Router();

/**
 * @swagger
 * /devices/brands:
 *   get:
 *     tags: [Devices]
 *     summary: Get all active device brands
 *     responses:
 *       200:
 *         description: List of device brands
 */
router.get('/brands', getAllBrandsController);

/**
 * @swagger
 * /devices/brands/{brandSlug}:
 *   get:
 *     tags: [Devices]
 *     summary: Get brand by slug with its models
 *     parameters:
 *       - in: path
 *         name: brandSlug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Brand with models
 *       404:
 *         description: Brand not found
 */
router.get('/brands/:brandSlug', getBrandBySlugController);

/**
 * @swagger
 * /devices/brands/{brandSlug}/models:
 *   get:
 *     tags: [Devices]
 *     summary: Get all models for a brand
 *     parameters:
 *       - in: path
 *         name: brandSlug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of device models
 */
router.get('/brands/:brandSlug/models', getModelsByBrandController);

/**
 * @swagger
 * /devices/brands/{brandSlug}/models/{modelSlug}:
 *   get:
 *     tags: [Devices]
 *     summary: Get a specific device model
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
 *         description: Device model detail
 *       404:
 *         description: Not found
 */
router.get('/brands/:brandSlug/models/:modelSlug', getModelBySlugController);

export default router;
