import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
  getUserAddressesController,
  createAddressController,
  getAddressByIdController,
  updateAddressController,
  deleteAddressController,
  setDefaultAddressController,
} from './addresses.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /addresses:
 *   get:
 *     tags: [Addresses]
 *     summary: Get all addresses for the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 */
router.get('/', getUserAddressesController);

/**
 * @swagger
 * /addresses:
 *   post:
 *     tags: [Addresses]
 *     summary: Add a new address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, line1, city, state, postalCode]
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               line1: { type: string }
 *               line2: { type: string }
 *               city: { type: string }
 *               state: { type: string }
 *               postalCode: { type: string }
 *               country: { type: string, default: India }
 *     responses:
 *       201:
 *         description: Address created
 */
router.post('/', createAddressController);

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     tags: [Addresses]
 *     summary: Get address by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Address detail
 *       404:
 *         description: Not found
 */
router.get('/:id', getAddressByIdController);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     tags: [Addresses]
 *     summary: Update an address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Address updated
 */
router.put('/:id', updateAddressController);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     tags: [Addresses]
 *     summary: Delete an address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Address deleted
 */
router.delete('/:id', deleteAddressController);

/**
 * @swagger
 * /addresses/{id}/default:
 *   patch:
 *     tags: [Addresses]
 *     summary: Set address as default
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Default address set
 */
router.patch('/:id/default', setDefaultAddressController);

export default router;
