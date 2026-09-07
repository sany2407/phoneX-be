import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  message?: string,
  pagination?: PaginationMeta
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    pagination,
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: unknown
): void {
  const response: ApiResponse = {
    success: false,
    message,
    data: errors || null,
  };
  res.status(statusCode).json(response);
}
