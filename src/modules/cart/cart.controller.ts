import { Request, Response, NextFunction } from 'express';
import * as cartService from './cart.service';
import { sendSuccess } from '../../utils/response';

export async function getCartController(req: Request, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.getCart(req.user!.userId);
    sendSuccess(res, cart);
  } catch (err) { next(err); }
}

export async function addItemController(req: Request, res: Response, next: NextFunction) {
  try {
    const { variantId, quantity } = req.body;
    const item = await cartService.addItem(req.user!.userId, variantId, quantity || 1);
    sendSuccess(res, item, 201, 'Item added to cart');
  } catch (err) { next(err); }
}

export async function updateItemController(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await cartService.updateItem(req.user!.userId, req.params.itemId, req.body.quantity);
    sendSuccess(res, item, 200, 'Cart item updated');
  } catch (err) { next(err); }
}

export async function removeItemController(req: Request, res: Response, next: NextFunction) {
  try {
    await cartService.removeItem(req.user!.userId, req.params.itemId);
    sendSuccess(res, null, 200, 'Item removed from cart');
  } catch (err) { next(err); }
}

export async function clearCartController(req: Request, res: Response, next: NextFunction) {
  try {
    await cartService.clearCart(req.user!.userId);
    sendSuccess(res, null, 200, 'Cart cleared');
  } catch (err) { next(err); }
}
