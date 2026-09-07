import { Request, Response, NextFunction } from 'express';
import * as addressesService from './addresses.service';
import { sendSuccess } from '../../utils/response';

export async function getUserAddressesController(req: Request, res: Response, next: NextFunction) {
  try {
    const addresses = await addressesService.getUserAddresses(req.user!.userId);
    sendSuccess(res, addresses);
  } catch (err) { next(err); }
}

export async function createAddressController(req: Request, res: Response, next: NextFunction) {
  try {
    const address = await addressesService.createAddress(req.user!.userId, req.body);
    sendSuccess(res, address, 201, 'Address added');
  } catch (err) { next(err); }
}

export async function getAddressByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const address = await addressesService.getAddressById(req.user!.userId, req.params.id);
    sendSuccess(res, address);
  } catch (err) { next(err); }
}

export async function updateAddressController(req: Request, res: Response, next: NextFunction) {
  try {
    const address = await addressesService.updateAddress(req.user!.userId, req.params.id, req.body);
    sendSuccess(res, address, 200, 'Address updated');
  } catch (err) { next(err); }
}

export async function deleteAddressController(req: Request, res: Response, next: NextFunction) {
  try {
    await addressesService.deleteAddress(req.user!.userId, req.params.id);
    sendSuccess(res, null, 200, 'Address deleted');
  } catch (err) { next(err); }
}

export async function setDefaultAddressController(req: Request, res: Response, next: NextFunction) {
  try {
    const address = await addressesService.setDefaultAddress(req.user!.userId, req.params.id);
    sendSuccess(res, address, 200, 'Default address updated');
  } catch (err) { next(err); }
}
