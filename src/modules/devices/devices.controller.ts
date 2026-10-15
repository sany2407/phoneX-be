import { Request, Response, NextFunction } from 'express';
import * as devicesService from './devices.service';
import { sendSuccess } from '../../utils/response';

// ─── Device Types ─────────────────────────────────────────

export async function getAllDeviceTypesController(req: Request, res: Response, next: NextFunction) {
  try {
    const types = await devicesService.getAllDeviceTypes();
    sendSuccess(res, types);
  } catch (err) { next(err); }
}

export async function createDeviceTypeController(req: Request, res: Response, next: NextFunction) {
  try {
    const type = await devicesService.createDeviceType(req.body);
    sendSuccess(res, type, 201, 'Device type created');
  } catch (err) { next(err); }
}

export async function updateDeviceTypeController(req: Request, res: Response, next: NextFunction) {
  try {
    const type = await devicesService.updateDeviceType(req.params.id, req.body);
    sendSuccess(res, type, 200, 'Device type updated');
  } catch (err) { next(err); }
}

export async function deleteDeviceTypeController(req: Request, res: Response, next: NextFunction) {
  try {
    await devicesService.deleteDeviceType(req.params.id);
    sendSuccess(res, null, 200, 'Device type deactivated');
  } catch (err) { next(err); }
}

export async function getModelsByDeviceTypeController(req: Request, res: Response, next: NextFunction) {
  try {
    const models = await devicesService.getModelsByDeviceType(req.params.typeSlug);
    sendSuccess(res, models);
  } catch (err) { next(err); }
}

// ─── Brands ───────────────────────────────────────────────

export async function getAllBrandsController(req: Request, res: Response, next: NextFunction) {
  try {
    const brands = await devicesService.getAllBrands();
    sendSuccess(res, brands);
  } catch (err) { next(err); }
}

export async function getBrandBySlugController(req: Request, res: Response, next: NextFunction) {
  try {
    const brand = await devicesService.getBrandBySlug(req.params.brandSlug);
    sendSuccess(res, brand);
  } catch (err) { next(err); }
}

export async function getModelsByBrandController(req: Request, res: Response, next: NextFunction) {
  try {
    // optional ?type=smartphone filter
    const models = await devicesService.getModelsByBrand(
      req.params.brandSlug,
      req.query.type as string | undefined
    );
    sendSuccess(res, models);
  } catch (err) { next(err); }
}

export async function getModelBySlugController(req: Request, res: Response, next: NextFunction) {
  try {
    const model = await devicesService.getModelBySlug(req.params.brandSlug, req.params.modelSlug);
    sendSuccess(res, model);
  } catch (err) { next(err); }
}

// ─── Admin — Brands ───────────────────────────────────────

export async function createBrandController(req: Request, res: Response, next: NextFunction) {
  try {
    const brand = await devicesService.createBrand(req.body);
    sendSuccess(res, brand, 201, 'Brand created');
  } catch (err) { next(err); }
}

export async function updateBrandController(req: Request, res: Response, next: NextFunction) {
  try {
    const brand = await devicesService.updateBrand(req.params.id, req.body);
    sendSuccess(res, brand, 200, 'Brand updated');
  } catch (err) { next(err); }
}

export async function deleteBrandController(req: Request, res: Response, next: NextFunction) {
  try {
    await devicesService.deleteBrand(req.params.id);
    sendSuccess(res, null, 200, 'Brand deactivated');
  } catch (err) { next(err); }
}

// ─── Admin — Models ───────────────────────────────────────

export async function createModelController(req: Request, res: Response, next: NextFunction) {
  try {
    const model = await devicesService.createModel(req.body);
    sendSuccess(res, model, 201, 'Model created');
  } catch (err) { next(err); }
}

export async function updateModelController(req: Request, res: Response, next: NextFunction) {
  try {
    const model = await devicesService.updateModel(req.params.id, req.body);
    sendSuccess(res, model, 200, 'Model updated');
  } catch (err) { next(err); }
}

export async function deleteModelController(req: Request, res: Response, next: NextFunction) {
  try {
    await devicesService.deleteModel(req.params.id);
    sendSuccess(res, null, 200, 'Model deactivated');
  } catch (err) { next(err); }
}
