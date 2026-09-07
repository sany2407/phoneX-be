import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import {
  getDashboardStatsController,
  getOrderStatusBreakdownController,
  getTopProductsController,
  getSalesAnalyticsController,
  getCustomerStatsController,
  listUsersController,
  getUserByIdController,
  updateUserStatusController,
  updateUserRoleController,
} from './admin.controller';

const router = Router();

router.use(authenticate, authorize('ADMIN', 'SUPER_ADMIN'));

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard stats
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalOrders: { type: integer }
 *                     todayOrders: { type: integer }
 *                     pendingOrders: { type: integer }
 *                     totalCustomers: { type: integer }
 *                     lowStockProducts: { type: integer }
 *                     totalRevenue: { type: number }
 *                     todayRevenue: { type: number }
 */
router.get('/dashboard', getDashboardStatsController);

/**
 * @swagger
 * /admin/analytics/orders:
 *   get:
 *     tags: [Admin]
 *     summary: Get order status breakdown
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order count by status
 */
router.get('/analytics/orders', getOrderStatusBreakdownController);

/**
 * @swagger
 * /admin/analytics/products:
 *   get:
 *     tags: [Admin]
 *     summary: Get top selling products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Top products by sales
 */
router.get('/analytics/products', getTopProductsController);

/**
 * @swagger
 * /admin/analytics/sales:
 *   get:
 *     tags: [Admin]
 *     summary: Get sales analytics (daily revenue)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Daily revenue and order count
 */
router.get('/analytics/sales', getSalesAnalyticsController);

/**
 * @swagger
 * /admin/analytics/customers:
 *   get:
 *     tags: [Admin]
 *     summary: Get new customer signups over time
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Daily new customer counts
 */
router.get('/analytics/customers', getCustomerStatsController);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [CUSTOMER, ADMIN, SUPER_ADMIN] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated user list
 */
router.get('/users', listUsersController);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get user by ID with order history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User detail
 */
router.get('/users/:id', getUserByIdController);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     tags: [Admin]
 *     summary: Activate or deactivate a user account
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
 *             required: [isActive]
 *             properties:
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: User status updated
 */
router.patch('/users/:id/status', updateUserStatusController);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     tags: [Admin]
 *     summary: Update user role (SUPER_ADMIN only)
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
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [CUSTOMER, ADMIN, SUPER_ADMIN] }
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch('/users/:id/role', authorize('SUPER_ADMIN'), updateUserRoleController);

export default router;
