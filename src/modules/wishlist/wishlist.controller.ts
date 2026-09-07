import { Request, Response, NextFunction } from 'express';
import * as wishlistService from './wishlist.service';
import { sendSuccess } from '../../utils/response';

export async function getWishlistController(req: Request, res: Response, next: NextFunction) {
  try {
    const wishlist = await wishlistService.getWishlist(req.user!.userId);
    sendSuccess(res, wishlist);
  } catch (err) { next(err); }
}

export async function addToWishlistController(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await wishlistService.addToWishlist(req.user!.userId, req.params.variantId);
    sendSuccess(res, item, 201, 'Added to wishlist');
  } catch (err) { next(err); }
}

export async function removeFromWishlistController(req: Request, res: Response, next: NextFunction) {
  try {
    await wishlistService.removeFromWishlist(req.user!.userId, req.params.variantId);
    sendSuccess(res, null, 200, 'Removed from wishlist');
  } catch (err) { next(err); }
}
