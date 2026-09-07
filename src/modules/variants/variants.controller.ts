import { Request, Response, NextFunction } from 'express';
import * as variantsService from './variants.service';
import { sendSuccess } from '../../utils/response';

export async function createVariantController(req: Request, res: Response, next: NextFunction) {
  try {
    const variant = await variantsService.createVariant(req.body);
    sendSuccess(res, variant, 201, 'Variant created');
  } catch (err) { next(err); }
}

export async function getVariantsByProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const variants = await variantsService.getVariantsByProduct(req.params.productId);
    sendSuccess(res, variants);
  } catch (err) { next(err); }
}

export async function getSkinsForModelController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await variantsService.getSkinsForDeviceModel(req.params.brandSlug, req.params.modelSlug);
    sendSuccess(res, result);
  } catch (err) { next(err); }
}

export async function getVariantByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const variant = await variantsService.getVariantById(req.params.id);
    sendSuccess(res, variant);
  } catch (err) { next(err); }
}

export async function updateVariantController(req: Request, res: Response, next: NextFunction) {
  try {
    const variant = await variantsService.updateVariant(req.params.id, req.body);
    sendSuccess(res, variant, 200, 'Variant updated');
  } catch (err) { next(err); }
}
