import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

// Admin controllers
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

// Categories controllers
import {
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from '../categories/categories.controller';

// Coupons controllers
import {
  listCouponsController,
  createCouponController,
  updateCouponController,
  deactivateCouponController,
} from '../coupons/coupons.controller';

// Products controllers
import {
  createProductController,
  updateProductController,
  deleteProductController,
  addProductImagesController,
} from '../products/products.controller';

// Variants controllers
import {
  createVariantController,
  updateVariantController,
} from '../variants/variants.controller';

// Devices controllers
import {
  createBrandController,
  updateBrandController,
  deleteBrandController,
  createModelController,
  updateModelController,
  deleteModelController,
  listDeviceTypesController,
  createDeviceTypeController,
  updateDeviceTypeController,
  deleteDeviceTypeController,
} from '../devices/devices.controller';

// Orders controllers
import {
  adminListOrdersController,
  adminGetOrderByIdController,
  adminUpdateOrderStatusController,
} from '../orders/orders.controller';

// Reviews controllers
import {
  listPendingReviewsController,
  approveReviewController,
  rejectReviewController,
} from '../reviews/reviews.controller';

// Inventory controllers
import {
  getInventoryReportController,
  updateInventoryController,
} from '../inventory/inventory.controller';

const router = Router();

// All admin routes require authentication + ADMIN or SUPER_ADMIN role
router.use(authenticate, authorize('ADMIN', 'SUPER_ADMIN'));

// ─── Dashboard & Analytics ───────────────────────────────────

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

// ─── Users ───────────────────────────────────────────────────

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

// ─── Categories ──────────────────────────────────────────────

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
 *               name: { type: string }
 *               description: { type: string }
 *               imageUrl: { type: string }
 *               parentId: { type: string }
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/categories', createCategoryController);

/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a category
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
 *               name: { type: string }
 *               description: { type: string }
 *               imageUrl: { type: string }
 *               parentId: { type: string }
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put('/categories/:id', updateCategoryController);

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete('/categories/:id', deleteCategoryController);

// ─── Coupons ─────────────────────────────────────────────────

/**
 * @swagger
 * /admin/coupons:
 *   get:
 *     tags: [Admin]
 *     summary: List all coupons
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of coupons
 */
router.get('/coupons', listCouponsController);

/**
 * @swagger
 * /admin/coupons:
 *   post:
 *     tags: [Admin]
 *     summary: Create a coupon
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, discountType, discountValue, validFrom, validUntil]
 *             properties:
 *               code: { type: string }
 *               discountType: { type: string, enum: [PERCENTAGE, FLAT] }
 *               discountValue: { type: number }
 *               minOrderValue: { type: number }
 *               maxDiscount: { type: number }
 *               validFrom: { type: string, format: date-time }
 *               validUntil: { type: string, format: date-time }
 *               usageLimit: { type: integer }
 *     responses:
 *       201:
 *         description: Coupon created
 */
router.post('/coupons', createCouponController);

/**
 * @swagger
 * /admin/coupons/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a coupon
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Coupon updated
 */
router.put('/coupons/:id', updateCouponController);

/**
 * @swagger
 * /admin/coupons/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Deactivate a coupon
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Coupon deactivated
 */
router.delete('/coupons/:id', deactivateCouponController);

// ─── Products ────────────────────────────────────────────────

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
router.post('/products', createProductController);

/**
 * @swagger
 * /admin/products/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put('/products/:id', updateProductController);

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/products/:id', deleteProductController);

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
router.post('/products/:id/images', addProductImagesController);

// ─── Variants ────────────────────────────────────────────────

/**
 * @swagger
 * /admin/variants:
 *   post:
 *     tags: [Admin]
 *     summary: Create a product variant (skin + device model combination)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, deviceModelId, sku, price, stock]
 *             properties:
 *               productId: { type: string }
 *               deviceModelId: { type: string }
 *               sku: { type: string }
 *               price: { type: number }
 *               comparePrice: { type: number }
 *               stock: { type: integer }
 *               images: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Variant created
 */
router.post('/variants', createVariantController);

/**
 * @swagger
 * /admin/variants/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a product variant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Variant updated
 */
router.put('/variants/:id', updateVariantController);

// ─── Device Types ─────────────────────────────────────────

/**
 * @swagger
 * /admin/devices/types:
 *   get:
 *     tags: [Admin]
 *     summary: List all device types including inactive ones
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Device types with model counts
 */
router.get('/devices/types', listDeviceTypesController);

/**
 * @swagger
 * /admin/devices/types:
 *   post:
 *     tags: [Admin]
 *     summary: Create a device type (e.g. Smartphone, Laptop, Tablet)
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
 *               name: { type: string, example: Smartphone }
 *     responses:
 *       201:
 *         description: Device type created
 */
router.post('/devices/types', createDeviceTypeController);

/**
 * @swagger
 * /admin/devices/types/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a device type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Device type updated
 */
router.put('/devices/types/:id', updateDeviceTypeController);

/**
 * @swagger
 * /admin/devices/types/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Deactivate a device type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Device type deactivated
 */
router.delete('/devices/types/:id', deleteDeviceTypeController);

// ─── Devices ─────────────────────────────────────────────────

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
 *               name: { type: string }
 *               logoUrl: { type: string }
 *     responses:
 *       201:
 *         description: Brand created
 */
router.post('/devices/brands', createBrandController);

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
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Brand updated
 */
router.put('/devices/brands/:id', updateBrandController);

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
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Brand deactivated
 */
router.delete('/devices/brands/:id', deleteBrandController);

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
 *             required: [brandId, deviceTypeId, name]
 *             properties:
 *               brandId: { type: string }
 *               deviceTypeId: { type: string }
 *               name: { type: string }
 *               imageUrl: { type: string }
 *     responses:
 *       201:
 *         description: Model created
 */
router.post('/devices/models', createModelController);

/**
 * @swagger
 * /admin/devices/models/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a device model
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Model updated
 */
router.put('/devices/models/:id', updateModelController);

/**
 * @swagger
 * /admin/devices/models/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a device model
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Model deleted
 */
router.delete('/devices/models/:id', deleteModelController);

// ─── Orders ──────────────────────────────────────────────────

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     tags: [Admin]
 *     summary: List all orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated orders list
 */
router.get('/orders', adminListOrdersController);

/**
 * @swagger
 * /admin/orders/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get order detail by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order detail
 */
router.get('/orders/:id', adminGetOrderByIdController);

/**
 * @swagger
 * /admin/orders/{id}/status:
 *   patch:
 *     tags: [Admin]
 *     summary: Update order status
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CONFIRMED, PROCESSING, PACKED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, REFUNDED]
 *               note: { type: string }
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.patch('/orders/:id/status', adminUpdateOrderStatusController);

// ─── Reviews ─────────────────────────────────────────────────

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
router.get('/reviews/pending', listPendingReviewsController);

/**
 * @swagger
 * /admin/reviews/{id}/approve:
 *   patch:
 *     tags: [Admin]
 *     summary: Approve a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review approved
 */
router.patch('/reviews/:id/approve', approveReviewController);

/**
 * @swagger
 * /admin/reviews/{id}/reject:
 *   patch:
 *     tags: [Admin]
 *     summary: Reject a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review rejected
 */
router.patch('/reviews/:id/reject', rejectReviewController);

// ─── Inventory ───────────────────────────────────────────────

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
router.get('/inventory', getInventoryReportController);

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
router.patch('/inventory/:variantId', updateInventoryController);

export default router;
