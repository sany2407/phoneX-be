import { Request, Response, NextFunction } from 'express';
import * as ordersService from './orders.service';
import { sendSuccess } from '../../utils/response';

export async function checkoutController(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.checkout(req.user!.userId, req.body);
    sendSuccess(res, order, 201, 'Order created successfully');
  } catch (err) { next(err); }
}

export async function getUserOrdersController(req: Request, res: Response, next: NextFunction) {
  try {
    const { orders, pagination } = await ordersService.getUserOrders(req.user!.userId, req.query as Record<string, string>);
    sendSuccess(res, orders, 200, undefined, pagination);
  } catch (err) { next(err); }
}

export async function getOrderByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.getOrderById(req.user!.userId, req.params.id);
    sendSuccess(res, order);
  } catch (err) { next(err); }
}

export async function cancelOrderController(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.cancelOrder(req.user!.userId, req.params.id);
    sendSuccess(res, order, 200, 'Order cancelled');
  } catch (err) { next(err); }
}

// Admin
export async function adminListOrdersController(req: Request, res: Response, next: NextFunction) {
  try {
    const { orders, pagination } = await ordersService.adminListOrders(req.query as Record<string, string>);
    sendSuccess(res, orders, 200, undefined, pagination);
  } catch (err) { next(err); }
}

export async function adminGetOrderByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.adminGetOrderById(req.params.id);
    sendSuccess(res, order);
  } catch (err) { next(err); }
}

export async function adminUpdateOrderStatusController(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, note } = req.body;
    const order = await ordersService.adminUpdateOrderStatus(req.params.id, status, note);
    sendSuccess(res, order, 200, 'Order status updated');
  } catch (err) { next(err); }
}
