import { Request, Response, NextFunction } from 'express';
import * as categoriesService from './categories.service';
import { sendSuccess } from '../../utils/response';

export async function getAllCategoriesController(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await categoriesService.getAllCategories();
    sendSuccess(res, categories);
  } catch (err) { next(err); }
}

export async function getCategoryBySlugController(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoriesService.getCategoryBySlug(req.params.slug);
    sendSuccess(res, category);
  } catch (err) { next(err); }
}

export async function createCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoriesService.createCategory(req.body);
    sendSuccess(res, category, 201, 'Category created');
  } catch (err) { next(err); }
}

export async function updateCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoriesService.updateCategory(req.params.id, req.body);
    sendSuccess(res, category, 200, 'Category updated');
  } catch (err) { next(err); }
}

export async function deleteCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    await categoriesService.deleteCategory(req.params.id);
    sendSuccess(res, null, 200, 'Category deactivated');
  } catch (err) { next(err); }
}
