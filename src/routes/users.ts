import { Router } from "express";
import { userAuth } from "../controllers/usersController";

const router = Router();

/**
 * @swagger
 * /api/user/auth:
 *   post:
 *     summary: Authenticate user with Google token
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google ID token
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User authenticated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     google_id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Token required
 *       401:
 *         description: Invalid or expired Google token
 */
router.post("/auth", userAuth);

export default router;
