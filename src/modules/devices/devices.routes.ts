import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import {
  getAllBrandsController,
  getBrandBySlugController,
  getModelsByBrandController,
  getModelBySlugController,
  createBrandController,
  updateBrandController,
  deleteBrandController,
  createModelController,
  updateModelController,
  deleteModelController,
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
 *         schema:
 *           type: string
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
 *         schema:
 *           type: string
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
 *         schema:
 *           type: string
 *       - in: path
 *         name: modelSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Device model detail
 *       404:
 *         description: Not found
 */
router.get('/brands/:brandSlug/models/:modelSlug', getModelBySlugController);

// Admin routes
/**
 * @swagger
 * /admin/devices/brands:
 *   post:
 *     tags: [Admin]
 *     summary: Create a device brand
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Brand created
 */
router.post('/admin/brands', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), createBrandController);

/**
 * @swagger
 * /admin/devices/brands/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a device brand
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand updated
 */
router.put('/admin/brands/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateBrandController);

/**
 * @swagger
 * /admin/devices/brands/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Deactivate a device brand
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand deactivated
 */
router.delete('/admin/brands/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), deleteBrandController);

/**
 * @swagger
 * /admin/devices/models:
 *   post:
 *     tags: [Admin]
 *     summary: Create a device model
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [brandId, name]
 *             properties:
 *               brandId:
 *                 type: string
 *               name:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Model created
 */
router.post('/admin/models', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), createModelController);
router.put('/admin/models/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateModelController);
router.delete('/admin/models/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), deleteModelController);

export default router;
