import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import {
  createReviewController,
  getProductReviewsController,
  updateReviewController,
  deleteReviewController,
  listPendingReviewsController,
  approveReviewController,
  rejectReviewController,
} from './reviews.controller';

const router = Router();

/**
 * @swagger
 * /products/{productId}/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get approved reviews for a product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Reviews with rating summary
 */
router.get('/products/:productId/reviews', getProductReviewsController);

/**
 * @swagger
 * /products/{productId}/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Submit a review for a product (verified purchase required)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, rating]
 *             properties:
 *               orderId: { type: string }
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               title: { type: string }
 *               body: { type: string }
 *     responses:
 *       201:
 *         description: Review submitted, pending approval
 *       403:
 *         description: Not a verified purchaser
 *       409:
 *         description: Already reviewed
 */
router.post('/products/:productId/reviews', authenticate, createReviewController);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update your review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review updated
 */
router.put('/reviews/:id', authenticate, updateReviewController);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete your review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.delete('/reviews/:id', authenticate, deleteReviewController);

// Admin
/**
 * @swagger
 * /admin/reviews/pending:
 *   get:
 *     tags: [Admin]
 *     summary: List all pending reviews
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending reviews
 */
router.get('/admin/reviews/pending', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), listPendingReviewsController);
router.patch('/admin/reviews/:id/approve', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), approveReviewController);
router.patch('/admin/reviews/:id/reject', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), rejectReviewController);

export default router;
