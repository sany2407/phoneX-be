import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { getInventoryReportController, updateInventoryController } from './inventory.controller';

const router = Router();

/**
 * @swagger
 * /admin/inventory:
 *   get:
 *     tags: [Admin]
 *     summary: Get inventory report for all variants
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lowStock
 *         schema: { type: boolean }
 *         description: Filter to only low stock items
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Inventory report
 */
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), getInventoryReportController);

/**
 * @swagger
 * /admin/inventory/{variantId}:
 *   patch:
 *     tags: [Admin]
 *     summary: Update stock for a variant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stock]
 *             properties:
 *               stock: { type: integer }
 *               note: { type: string }
 *     responses:
 *       200:
 *         description: Inventory updated
 */
router.patch('/:variantId', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateInventoryController);

export default router;
