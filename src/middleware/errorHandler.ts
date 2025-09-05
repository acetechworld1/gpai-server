import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

/**
 * Global error handling middleware
 * Catches and handles all errors in a consistent manner
 */
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let err = { ...error };
  err.message = error.message;

  // Log error for debugging
  console.error('Error:', error);

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    const message = 'Resource not found';
    err = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if ((error as any).code === 11000) {
    const message = 'Duplicate field value entered';
    err = new AppError(message, 400);
  }

  // Mongoose validation error
  if (error.name === 'ValidationError' && (error as any).errors) {
    const message = Object.values((error as any).errors).map((val: any) => val.message);
    err = new AppError(message.join(', '), 400);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    timestamp: new Date().toISOString()
  });
};