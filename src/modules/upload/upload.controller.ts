import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middleware/error.middleware';

/**
 * Upload a single image
 * POST /upload/single?folder=products
 * Form field: image
 */
export async function uploadSingleController(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file;
    if (!file) throw new AppError('No image file provided', 400);

    const folder = (req.query.folder as string) || 'general';
    const { url, publicId } = await uploadToCloudinary(file.buffer, folder);

    sendSuccess(res, { url, publicId }, 200, 'Image uploaded successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * Upload multiple images
 * POST /upload/multiple?folder=products
 * Form field: images (up to 10 files)
 */
export async function uploadMultipleController(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) throw new AppError('No image files provided', 400);

    const folder = (req.query.folder as string) || 'general';

    const uploads = await Promise.all(
      files.map(file => uploadToCloudinary(file.buffer, folder))
    );

    const urls = uploads.map(u => u.url);

    sendSuccess(res, { urls, count: urls.length }, 200, 'Images uploaded successfully');
  } catch (err) {
    next(err);
  }
}
