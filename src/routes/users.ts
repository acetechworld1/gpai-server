import { Router } from "express";
import { userAuth, saveResult, getHistory, forecast, getAIContext } from "../controllers/usersController";

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

/**
 * @swagger
 * /api/user/save-result:
 *   post:
 *     summary: Save GPA result for user
 *     tags:
 *       - Results
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - gpa
 *               - semester
 *               - academic_session
 *               - courses
 *               - total_credit_units
 *               - total_grade_points
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: User ID from authentication
 *                 example: "user123"
 *               gpa:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 4.0
 *                 example: 3.5
 *               semester:
 *                 type: string
 *                 example: "First Semester"
 *               academic_session:
 *                 type: string
 *                 example: "2023/2024"
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - course_code
 *                     - course_title
 *                     - credit_unit
 *                     - grade
 *                     - grade_point
 *                   properties:
 *                     course_code:
 *                       type: string
 *                       example: "CSC 101"
 *                     course_title:
 *                       type: string
 *                       example: "Introduction to Computer Science"
 *                     credit_unit:
 *                       type: number
 *                       example: 3
 *                     grade:
 *                       type: string
 *                       example: "A"
 *                     grade_point:
 *                       type: number
 *                       example: 5.0
 *               total_credit_units:
 *                 type: number
 *                 example: 18
 *               total_grade_points:
 *                 type: number
 *                 example: 63
 *     responses:
 *       201:
 *         description: Result saved successfully
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
 *                   example: "Result saved successfully"
 *                 result:
 *                   type: object
 *       400:
 *         description: Invalid input data
 */
router.post("/save-result", saveResult);

/**
 * @swagger
 * /api/user/history:
 *   get:
 *     summary: Get result history for user
 *     tags:
 *       - Results
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to fetch results for
 *       - in: query
 *         name: semester
 *         schema:
 *           type: string
 *         description: Filter by semester
 *       - in: query
 *         name: academic_session
 *         schema:
 *           type: string
 *         description: Filter by academic session
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: Results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     total:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *       400:
 *         description: User ID required
 */
router.get("/history", getHistory);

/**
 * @swagger
 * /api/user/forecast:
 *   post:
 *     summary: Calculate projected GPA based on current GPA and planned grades
 *     tags:
 *       - Results
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_gpa
 *               - total_credit_units
 *               - planned_courses
 *             properties:
 *               current_gpa:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5.0
 *                 example: 3.5
 *               total_credit_units:
 *                 type: number
 *                 example: 72
 *               planned_courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - credit_unit
 *                     - expected_grade
 *                   properties:
 *                     credit_unit:
 *                       type: number
 *                       example: 3
 *                     expected_grade:
 *                       type: string
 *                       enum: [A, B, C, D, E, F]
 *                       example: "A"
 *     responses:
 *       200:
 *         description: Forecast calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 forecast:
 *                   type: object
 *                   properties:
 *                     projected_gpa:
 *                       type: number
 *                     total_credit_units:
 *                       type: number
 *                     total_grade_points:
 *                       type: number
 *                     existing_grade_points:
 *                       type: number
 *                     planned_grade_points:
 *                       type: number
 *       400:
 *         description: Invalid input data
 */
router.post("/forecast", forecast);

/**
 * @swagger
 * /api/ai/context:
 *   get:
 *     summary: Get user profile and GPA history for AI personalization
 *     tags:
 *       - AI
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to fetch context for
 *     responses:
 *       200:
 *         description: Context retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 context:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         school_name:
 *                           type: string
 *                         department:
 *                           type: string
 *                         program:
 *                           type: string
 *                         matric_number:
 *                           type: string
 *                     academic_summary:
 *                       type: object
 *                       properties:
 *                         cumulative_gpa:
 *                           type: number
 *                         total_credit_units:
 *                           type: number
 *                         total_results:
 *                           type: number
 *                     recent_results:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: User ID required
 *       404:
 *         description: User not found
 */
router.get("/ai/context", getAIContext);

export default router;