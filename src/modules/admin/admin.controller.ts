import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';
import { sendSuccess } from '../../utils/response';

export async function getDashboardStatsController(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, stats);
  } catch (err) { next(err); }
}

export async function getOrderStatusBreakdownController(req: Request, res: Response, next: NextFunction) {
  try {
    const breakdown = await adminService.getOrderStatusBreakdown();
    sendSuccess(res, breakdown);
  } catch (err) { next(err); }
}

export async function getTopProductsController(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string || '10', 10);
    const products = await adminService.getTopProducts(limit);
    sendSuccess(res, products);
  } catch (err) { next(err); }
}

export async function getSalesAnalyticsController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getSalesAnalytics(req.query as Record<string, string>);
    sendSuccess(res, data);
  } catch (err) { next(err); }
}

export async function getCustomerStatsController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getCustomerStats(req.query as Record<string, string>);
    sendSuccess(res, data);
  } catch (err) { next(err); }
}

export async function listUsersController(req: Request, res: Response, next: NextFunction) {
  try {
    const { users, pagination } = await adminService.listUsers(req.query as Record<string, string>);
    sendSuccess(res, users, 200, undefined, pagination);
  } catch (err) { next(err); }
}

export async function getUserByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await adminService.getUserById(req.params.id);
    sendSuccess(res, user);
  } catch (err) { next(err); }
}

export async function updateUserStatusController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await adminService.updateUserStatus(req.params.id, req.body.isActive);
    sendSuccess(res, user, 200, 'User status updated');
  } catch (err) { next(err); }
}

export async function updateUserRoleController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await adminService.updateUserRole(req.params.id, req.body.role);
    sendSuccess(res, user, 200, 'User role updated');
  } catch (err) { next(err); }
}
