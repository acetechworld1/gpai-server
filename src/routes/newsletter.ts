import { Router } from 'express';
import { NewsletterController } from '../controllers/newsLetterController';

/**
 * Newsletter routes configuration
 * Defines API endpoints for newsletter functionality
 */
const router = Router();
const newsletterController = new NewsletterController();

/**
 * @swagger
 * /api/newsletter/subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               source:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully subscribed
 *       400:
 *         description: Bad request
 *       409:
 *         description: Email already subscribed
 */
router.post('/subscribe', newsletterController.subscribe);

/**
 * @swagger
 * /api/newsletter/unsubscribe:
 *   post:
 *     summary: Unsubscribe from newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Successfully unsubscribed
 *       400:
 *         description: Bad request
 *       404:
 *         description: Email not found
 */
router.post('/unsubscribe', newsletterController.unsubscribe);

// TODO: Add Authentication & Authorization(So that only admin can access this endpoint)

/**
 * @swagger
 * /api/newsletter/subscribers:
 *   get:
 *     summary: Get subscribers (Admin only)
 *     tags: [Newsletter]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: List of subscribers
 */
router.get('/subscribers', newsletterController.getSubscribers);

// TODO: Add Authentication & Authorization(So that only admin can access this endpoint)

/**
 * @swagger
 * /api/newsletter/stats:
 *   get:
 *     summary: Get subscription stats (Admin only)
 *     tags: [Newsletter]
 *     responses:
 *       200:
 *         description: Subscription statistics
 */
router.get('/stats', newsletterController.getStats);

export default router;