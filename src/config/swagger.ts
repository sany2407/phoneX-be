import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Phonex API',
      version: '1.0.0',
      description: 'Phonex Mobile Skin Brand — E-Commerce Backend API',
      contact: {
        name: 'Phonex Team',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Health check' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Devices', description: 'Device brands and models' },
      { name: 'Categories', description: 'Product categories' },
      { name: 'Products', description: 'Skin design products' },
      { name: 'Variants', description: 'Product variants (skin + device model)' },
      { name: 'Cart', description: 'Shopping cart' },
      { name: 'Wishlist', description: 'Wishlist' },
      { name: 'Addresses', description: 'User addresses' },
      { name: 'Orders', description: 'Orders' },
      { name: 'Payments', description: 'Razorpay payments' },
      { name: 'Coupons', description: 'Discount coupons' },
      { name: 'Reviews', description: 'Product reviews' },
      { name: 'Admin', description: 'Admin endpoints' },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Phonex API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  }));
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}
