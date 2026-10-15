import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { uploadSingle, uploadMultiple } from '../../middleware/upload.middleware';
import { uploadSingleController, uploadMultipleController } from './upload.controller';

const router = Router();

// All upload routes require ADMIN or SUPER_ADMIN
router.use(authenticate, authorize('ADMIN', 'SUPER_ADMIN'));

/**
 * @swagger
 * /upload/single:
 *   post:
 *     tags: [Upload]
 *     summary: Upload a single image to Cloudinary
 *     description: |
 *       Use the `folder` query param to organise uploads:
 *       - `products` — skin design images
 *       - `variants` — variant-specific images
 *       - `categories` — category cover images
 *       - `brands` — brand logos
 *       - `models` — device model images
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *           enum: [products, variants, categories, brands, models]
 *         description: Cloudinary subfolder to upload into
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: JPEG, PNG or WebP — max 5 MB
 *     responses:
 *       200:
 *         description: Image uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/image/upload/v1/phonex/products/abc123.webp
 *                 publicId:
 *                   type: string
 *                   example: phonex/products/abc123
 *       400:
 *         description: No file provided or invalid file type
 */
router.post('/single', uploadSingle, uploadSingleController);

/**
 * @swagger
 * /upload/multiple:
 *   post:
 *     tags: [Upload]
 *     summary: Upload multiple images to Cloudinary (max 10)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *           enum: [products, variants, categories, brands, models]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [images]
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: JPEG, PNG or WebP — max 5 MB each, up to 10 files
 *     responses:
 *       200:
 *         description: Images uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 urls:
 *                   type: array
 *                   items: { type: string }
 *                 count:
 *                   type: integer
 */
router.post('/multiple', uploadMultiple, uploadMultipleController);

export default router;
