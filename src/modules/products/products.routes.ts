import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import {
  listProductsController,
  getProductBySlugController,
  getFeaturedProductsController,
  searchProductsController,
  createProductController,
  updateProductController,
  deleteProductController,
  addProductImagesController,
} from './products.controller';

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List all products with optional filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [newest, name_asc, name_desc] }
 *     responses:
 *       200:
 *         description: Paginated list of products
 */
router.get('/', listProductsController);

/**
 * @swagger
 * /products/featured:
 *   get:
 *     tags: [Products]
 *     summary: Get featured products
 *     responses:
 *       200:
 *         description: List of featured products
 */
router.get('/featured', getFeaturedProductsController);

/**
 * @swagger
 * /products/search:
 *   get:
 *     tags: [Products]
 *     summary: Search products
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', searchProductsController);

/**
 * @swagger
 * /products/{slug}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product detail with variants and reviews
 *       404:
 *         description: Not found
 */
router.get('/:slug', getProductBySlugController);

// Admin
/**
 * @swagger
 * /admin/products:
 *   post:
 *     tags: [Admin]
 *     summary: Create a product (skin design)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, categoryId]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               categoryId: { type: string }
 *               images: { type: array, items: { type: string } }
 *               isFeatured: { type: boolean }
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/admin', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), createProductController);
router.put('/admin/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateProductController);
router.delete('/admin/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), deleteProductController);

/**
 * @swagger
 * /admin/products/{id}/images:
 *   post:
 *     tags: [Admin]
 *     summary: Add images to a product
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
 *             properties:
 *               images: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Images added
 */
router.post('/admin/:id/images', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), addProductImagesController);

export default router;
