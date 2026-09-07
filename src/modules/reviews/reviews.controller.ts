import { Request, Response, NextFunction } from 'express';
import * as reviewsService from './reviews.service';
import { sendSuccess } from '../../utils/response';

export async function createReviewController(req: Request, res: Response, next: NextFunction) {
  try {
    const review = await reviewsService.createReview(req.user!.userId, req.params.productId, req.body);
    sendSuccess(res, review, 201, 'Review submitted, pending approval');
  } catch (err) { next(err); }
}

export async function getProductReviewsController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await reviewsService.getProductReviews(req.params.productId, req.query as Record<string, string>);
    sendSuccess(res, { reviews: result.reviews, ratingSummary: result.ratingSummary }, 200, undefined, result.pagination);
  } catch (err) { next(err); }
}

export async function updateReviewController(req: Request, res: Response, next: NextFunction) {
  try {
    const review = await reviewsService.updateReview(req.user!.userId, req.params.id, req.body);
    sendSuccess(res, review, 200, 'Review updated');
  } catch (err) { next(err); }
}

export async function deleteReviewController(req: Request, res: Response, next: NextFunction) {
  try {
    await reviewsService.deleteReview(req.user!.userId, req.params.id);
    sendSuccess(res, null, 200, 'Review deleted');
  } catch (err) { next(err); }
}

export async function listPendingReviewsController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await reviewsService.listPendingReviews(req.query as Record<string, string>);
    sendSuccess(res, result.reviews, 200, undefined, result.pagination);
  } catch (err) { next(err); }
}

export async function approveReviewController(req: Request, res: Response, next: NextFunction) {
  try {
    const review = await reviewsService.approveReview(req.params.id);
    sendSuccess(res, review, 200, 'Review approved');
  } catch (err) { next(err); }
}

export async function rejectReviewController(req: Request, res: Response, next: NextFunction) {
  try {
    await reviewsService.rejectReview(req.params.id);
    sendSuccess(res, null, 200, 'Review rejected and deleted');
  } catch (err) { next(err); }
}
