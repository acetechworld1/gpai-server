import { Response } from 'express';

/**
 * Standardized API response helper
 * Ensures consistent response format across all endpoints
 */
export class ResponseHelper {
  /**
   * Send success response
   * @param res - Express response object
   * @param data - Response data
   * @param message - Success message
   * @param statusCode - HTTP status code
   */
  static success(res: Response, data: any = null, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send error response
   * @param res - Express response object
   * @param message - Error message
   * @param statusCode - HTTP status code
   * @param error - Additional error details
   */
  static error(res: Response, message: string, statusCode: number = 500, error: any = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
      timestamp: new Date().toISOString()
    });
  }
}