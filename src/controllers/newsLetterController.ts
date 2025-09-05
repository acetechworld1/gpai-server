import { Request, Response } from 'express';
import { NewsletterService } from '../services/newsLetterService';
import { AppError } from '../utils/appError';
import { ResponseHelper } from '../utils/responseHelper';

/**
 * Newsletter controller handling HTTP requests
*/
export class NewsletterController {
  private newsletterService: NewsletterService;

  constructor() {
    this.newsletterService = new NewsletterService();
  }

  /**
   * Handle newsletter subscription request
   * POST /api/newsletter/subscribe
   */
  subscribe = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, source } = req.body;

      // Input validation at controller level
      if (!email) {
        ResponseHelper.error(res, 'Email is required', 400);
        return;
      }

      const subscriber = await this.newsletterService.subscribeUser(email, source);
      
      ResponseHelper.success(
        res,
        {
          id: subscriber._id,
          email: subscriber.email,
          subscribedAt: subscriber.subscribedAt,
          source: subscriber.source
        },
        'Successfully subscribed to newsletter',
        201
      );
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Handle newsletter unsubscription request
   * POST /api/newsletter/unsubscribe
   */
  unsubscribe = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        ResponseHelper.error(res, 'Email is required', 400);
        return;
      }

      const success = await this.newsletterService.unsubscribeUser(email);
      
      if (success) {
        ResponseHelper.success(res, null, 'Successfully unsubscribed from newsletter');
      } else {
        ResponseHelper.error(res, 'Email not found or already unsubscribed', 404);
      }
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Get active subscribers (admin endpoint)
   * GET /api/newsletter/subscribers
   */
  getSubscribers = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await this.newsletterService.getActiveSubscribers(page, limit);
      
      ResponseHelper.success(res, result, 'Subscribers retrieved successfully');
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Get subscription statistics (admin endpoint)
   * GET /api/newsletter/stats
   */
  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.newsletterService.getSubscriptionStats();
      
      ResponseHelper.success(res, stats, 'Statistics retrieved successfully');
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Centralized error handling for controller
   * @param res - Express response object
   * @param error - Error object
   */
  private handleError(res: Response, error: any): void {
    if (error instanceof AppError) {
      ResponseHelper.error(res, error.message, error.statusCode);
    } else {
      console.error('Unexpected error:', error);
      ResponseHelper.error(res, 'Internal server error', 500);
    }
  }
}