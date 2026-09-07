import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import devicesRoutes from '../modules/devices/devices.routes';
import categoriesRoutes from '../modules/categories/categories.routes';
import productsRoutes from '../modules/products/products.routes';
import variantsRoutes from '../modules/variants/variants.routes';
import cartRoutes from '../modules/cart/cart.routes';
import wishlistRoutes from '../modules/wishlist/wishlist.routes';
import addressesRoutes from '../modules/addresses/addresses.routes';
import ordersRoutes from '../modules/orders/orders.routes';
import paymentsRoutes from '../modules/payments/payments.routes';
import couponsRoutes from '../modules/coupons/coupons.routes';
import reviewsRoutes from '../modules/reviews/reviews.routes';
import inventoryRoutes from '../modules/inventory/inventory.routes';
import adminRoutes from '../modules/admin/admin.routes';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     description: Check if the API server is running
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

router.use('/auth', authRoutes);
router.use('/devices', devicesRoutes);
router.use('/categories', categoriesRoutes);
router.use('/products', productsRoutes);
router.use('/variants', variantsRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/addresses', addressesRoutes);
router.use('/orders', ordersRoutes);
router.use('/payments', paymentsRoutes);
router.use('/coupons', couponsRoutes);
router.use('/', reviewsRoutes);
router.use('/admin/inventory', inventoryRoutes);
router.use('/admin', adminRoutes);

export default router;
