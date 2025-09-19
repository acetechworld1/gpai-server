import { Router } from 'express';
import usersRouter from './users';
import newsletterRouter from './newsletter';

const router = Router();

router.use('/newsletter', newsletterRouter);
router.use('/user', usersRouter);

// Health check endpoint

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'GPAi API is healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

/**
 * @swagger
 * /api/home:
 *   get:
 *     summary: Welcome message
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Welcome message
 */
router.use('/home', (req, res) => {
    res.send('Welcome to gpai!');
});

export default router;