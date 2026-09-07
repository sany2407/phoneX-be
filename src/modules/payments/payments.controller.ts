import { Request, Response, NextFunction } from 'express';
import * as paymentsService from './payments.service';
import { sendSuccess } from '../../utils/response';

export async function createRazorpayOrderController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await paymentsService.createRazorpayOrder(req.body.orderId, req.user!.userId);
    sendSuccess(res, result, 201, 'Payment order created');
  } catch (err) { next(err); }
}

export async function verifyPaymentController(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await paymentsService.verifyPayment(req.user!.userId, req.body);
    sendSuccess(res, order, 200, 'Payment verified successfully');
  } catch (err) { next(err); }
}

export async function handleWebhookController(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    await paymentsService.handleWebhook(req.body as Buffer, signature);
    res.status(200).json({ status: 'ok' });
  } catch (err) { next(err); }
}

export async function getPaymentByOrderController(req: Request, res: Response, next: NextFunction) {
  try {
    const payment = await paymentsService.getPaymentByOrder(req.user!.userId, req.params.orderId);
    sendSuccess(res, payment);
  } catch (err) { next(err); }
}
