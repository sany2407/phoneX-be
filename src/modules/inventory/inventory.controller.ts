import { Request, Response, NextFunction } from 'express';
import * as inventoryService from './inventory.service';
import { sendSuccess } from '../../utils/response';

export async function getInventoryReportController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await inventoryService.getInventoryReport(req.query as Record<string, string>);
    sendSuccess(res, result.variants, 200, undefined, {
      page: parseInt(req.query.page as string || '1', 10),
      limit: parseInt(req.query.limit as string || '50', 10),
      total: result.total,
      totalPages: Math.ceil(result.total / parseInt(req.query.limit as string || '50', 10)),
      hasNext: false,
      hasPrev: false,
    });
  } catch (err) { next(err); }
}

export async function updateInventoryController(req: Request, res: Response, next: NextFunction) {
  try {
    await inventoryService.updateInventory(req.params.variantId, req.body.stock, req.body.note);
    sendSuccess(res, null, 200, 'Inventory updated');
  } catch (err) { next(err); }
}
