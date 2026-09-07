import { Request, Response, NextFunction } from 'express';
import * as couponsService from './coupons.service';
import { sendSuccess } from '../../utils/response';

export async function validateCouponController(req: Request, res: Response, next: NextFunction) {
  try {
    const { code, subtotal } = req.body;
    const result = await couponsService.validateCoupon(code, req.user!.userId, subtotal);
    sendSuccess(res, result, 200, 'Coupon valid');
  } catch (err) { next(err); }
}

export async function listCouponsController(req: Request, res: Response, next: NextFunction) {
  try {
    const { coupons, total } = await couponsService.listCoupons(req.query as Record<string, string>);
    sendSuccess(res, coupons, 200, undefined, {
      page: parseInt(req.query.page as string || '1', 10),
      limit: parseInt(req.query.limit as string || '20', 10),
      total,
      totalPages: Math.ceil(total / parseInt(req.query.limit as string || '20', 10)),
      hasNext: false,
      hasPrev: false,
    });
  } catch (err) { next(err); }
}

export async function createCouponController(req: Request, res: Response, next: NextFunction) {
  try {
    const coupon = await couponsService.createCoupon(req.body);
    sendSuccess(res, coupon, 201, 'Coupon created');
  } catch (err) { next(err); }
}

export async function updateCouponController(req: Request, res: Response, next: NextFunction) {
  try {
    const coupon = await couponsService.updateCoupon(req.params.id, req.body);
    sendSuccess(res, coupon, 200, 'Coupon updated');
  } catch (err) { next(err); }
}

export async function deactivateCouponController(req: Request, res: Response, next: NextFunction) {
  try {
    await couponsService.deactivateCoupon(req.params.id);
    sendSuccess(res, null, 200, 'Coupon deactivated');
  } catch (err) { next(err); }
}
