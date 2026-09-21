import { Router } from 'express';
import {
  getAllCategoriesController,
  getCategoryBySlugController,
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

export default router;
