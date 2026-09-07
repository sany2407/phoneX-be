import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import {
  getAllCategoriesController,
  getCategoryBySlugController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from './categories.controller';

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all active categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', getAllCategoriesController);

/**
 * @swagger
 * /categories/{slug}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category detail
 *       404:
 *         description: Not found
 */
router.get('/:slug', getCategoryBySlugController);

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     tags: [Admin]
 *     summary: Create a category
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
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               parentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/admin', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), createCategoryController);
router.put('/admin/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateCategoryController);
router.delete('/admin/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), deleteCategoryController);

export default router;
