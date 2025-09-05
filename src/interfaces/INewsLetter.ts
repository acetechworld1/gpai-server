export interface INewsletterSubscriber {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  source?: string;
}