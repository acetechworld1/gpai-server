// src/models/NewsletterSubscriber.ts
import mongoose, { Document, Schema } from 'mongoose';
import { INewsletterSubscriber } from '../interfaces/INewsLetter';

// Simple document interface - Mongoose Document already provides save(), etc.
export interface INewsletterSubscriberDocument extends INewsletterSubscriber, Document {}

const newsletterSubscriberSchema: Schema<INewsletterSubscriberDocument> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ],
      index: true
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    source: {
      type: String,
      default: 'website',
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'newsletter_subscribers'
  }
);

// Compound index for better query performance
newsletterSubscriberSchema.index({ email: 1, isActive: 1 });

export default mongoose.model<INewsletterSubscriberDocument>('NewsletterSubscriber', newsletterSubscriberSchema);