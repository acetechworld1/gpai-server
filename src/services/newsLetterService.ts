// src/services/NewsletterService.ts
import { INewsletterSubscriber } from '../interfaces/INewsLetter';
import NewsletterSubscriber, { INewsletterSubscriberDocument } from '../models/NewsletterSubscriber';
import { AppError } from '../utils/appError';
import { validateEmail } from '../utils/validation';

export class NewsletterService {
  async subscribeUser(email: string, source?: string): Promise<INewsletterSubscriberDocument> {
    try {
      if (!email) {
        throw new AppError('Email is required', 400);
      }

      if (!validateEmail(email)) {
        throw new AppError('Please provide a valid email address', 400);
      }

      const existingSubscriber = await this.findSubscriberByEmail(email);
      
      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          throw new AppError('Email is already subscribed to newsletter', 409);
        }
        
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        if (source) existingSubscriber.source = source;
        
        return await existingSubscriber.save();
      }

      const newSubscriber = new NewsletterSubscriber({
        email: email.toLowerCase().trim(),
        source: source || 'website',
        subscribedAt: new Date(),
        isActive: true
      });

      return await newSubscriber.save();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 11000) {
        throw new AppError('Email is already subscribed to newsletter', 409);
      }
      
      console.error('NewsletterService.subscribeUser error:', error);      
      throw new AppError('Failed to subscribe to newsletter', 500);
    }
  }

  async unsubscribeUser(email: string): Promise<boolean> {
    try {
      if (!email || !validateEmail(email)) {
        throw new AppError('Please provide a valid email address', 400);
      }

      const result = await NewsletterSubscriber.findOneAndUpdate(
        { email: email.toLowerCase().trim(), isActive: true },
        { isActive: false, unsubscribedAt: new Date() },
        { new: true }
      );

      return !!result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to unsubscribe from newsletter', 500);
    }
  }

  async getActiveSubscribers(page: number = 1, limit: number = 50) {
    try {
      const skip = (page - 1) * limit;
      
      const [subscribers, total] = await Promise.all([
        NewsletterSubscriber.find({ isActive: true })
          .sort({ subscribedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        NewsletterSubscriber.countDocuments({ isActive: true })
      ]);

      return {
        subscribers,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new AppError('Failed to retrieve subscribers', 500);
    }
  }

  private async findSubscriberByEmail(email: string): Promise<INewsletterSubscriberDocument | null> {
    return await NewsletterSubscriber.findOne({ email: email.toLowerCase().trim() });
  }

  async getSubscriptionStats() {
    try {
      const [total, active, inactive, recentSubscriptions] = await Promise.all([
        NewsletterSubscriber.countDocuments({}),
        NewsletterSubscriber.countDocuments({ isActive: true }),
        NewsletterSubscriber.countDocuments({ isActive: false }),
        NewsletterSubscriber.countDocuments({
          subscribedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
      ]);

      return {
        total,
        active,
        inactive,
        recentSubscriptions
      };
    } catch (error) {
      throw new AppError('Failed to retrieve subscription statistics', 500);
    }
  }
}