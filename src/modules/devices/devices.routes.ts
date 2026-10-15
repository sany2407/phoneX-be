import { Router } from 'express';
import {
  getAllBrandsController,
  getBrandBySlugController,
  getModelsByBrandController,
  getModelBySlugController,
  getAllDeviceTypesController,
  getModelsByDeviceTypeController,
} from './devices.controller';

const router = Router();

/**
 * @swagger
 * /devices/types:
 *   get:
 *     tags: [Devices]
 *     summary: Get all device types (smartphone, laptop, tablet, etc.)
 *     responses:
 *       200:
 *         description: List of device types with model count
 */
router.get('/types', getAllDeviceTypesController);

/**
 * @swagger
 * /devices/types/{typeSlug}/models:
 *   get:
 *     tags: [Devices]
 *     summary: Get all models for a device type across all brands
 *     parameters:
 *       - in: path
 *         name: typeSlug
 *         required: true
 *         schema: { type: string, example: smartphone }
 *     responses:
 *       200:
 *         description: Models grouped with brand info
 */
router.get('/types/:typeSlug/models', getModelsByDeviceTypeController);

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
 */
router.get('/brands/:brandSlug', getBrandBySlugController);

/**
 * @swagger
 * /devices/brands/{brandSlug}/models:
 *   get:
 *     tags: [Devices]
 *     summary: Get all models for a brand, optionally filtered by device type
 *     parameters:
 *       - in: path
 *         name: brandSlug
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, example: smartphone }
 *         description: Filter by device type slug
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
 *         description: Device model detail with brand and type
 */
router.get('/brands/:brandSlug/models/:modelSlug', getModelBySlugController);

export default router;
