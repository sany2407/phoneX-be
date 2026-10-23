import { Router } from 'express';
import {
  listProductsController,
  getProductBySlugController,
  getFeaturedProductsController,
  getProductFacetsController,
  searchProductsController,
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
 *         name: material
 *         schema: { type: string }
 *         description: Comma-separated materials
 *       - in: query
 *         name: finish
 *         schema: { type: string }
 *         description: Comma-separated finishes
 *       - in: query
 *         name: minRating
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *         description: Only products with a variant at or under this price
 *       - in: query
 *         name: inStock
 *         schema: { type: boolean }
 *         description: Only products with a stocked variant
 *       - in: query
 *         name: deviceType
 *         schema: { type: string, example: smartphone }
 *         description: Filter by device type slug (via variants)
 *       - in: query
 *         name: onSale
 *         schema: { type: boolean }
 *         description: Only products with a discount
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [newest, name_asc, name_desc, featured, popular, price-asc, price-desc, rating] }
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
 * /products/facets:
 *   get:
 *     tags: [Products]
 *     summary: Distinct materials and finishes across active products
 *     responses:
 *       200:
 *         description: Filter facet values
 */
router.get('/facets', getProductFacetsController);

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

export default router;
