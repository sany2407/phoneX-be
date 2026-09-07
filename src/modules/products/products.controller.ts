import { Request, Response, NextFunction } from 'express';
import * as productsService from './products.service';
import { sendSuccess } from '../../utils/response';

export async function listProductsController(req: Request, res: Response, next: NextFunction) {
  try {
    const { products, pagination } = await productsService.listProducts(req.query as Record<string, string>);
    sendSuccess(res, products, 200, undefined, pagination);
  } catch (err) { next(err); }
}

export async function getProductBySlugController(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productsService.getProductBySlug(req.params.slug);
    sendSuccess(res, product);
  } catch (err) { next(err); }
}

export async function getFeaturedProductsController(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await productsService.getFeaturedProducts();
    sendSuccess(res, products);
  } catch (err) { next(err); }
}

export async function searchProductsController(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await productsService.searchProducts(req.query.q as string);
    sendSuccess(res, products);
  } catch (err) { next(err); }
}

export async function createProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productsService.createProduct(req.body);
    sendSuccess(res, product, 201, 'Product created');
  } catch (err) { next(err); }
}

export async function updateProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productsService.updateProduct(req.params.id, req.body);
    sendSuccess(res, product, 200, 'Product updated');
  } catch (err) { next(err); }
}

export async function deleteProductController(req: Request, res: Response, next: NextFunction) {
  try {
    await productsService.deleteProduct(req.params.id);
    sendSuccess(res, null, 200, 'Product deactivated');
  } catch (err) { next(err); }
}

export async function addProductImagesController(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productsService.addProductImages(req.params.id, req.body.images);
    sendSuccess(res, product, 200, 'Images added');
  } catch (err) { next(err); }
}
