/**
 * @swagger
 * tags:
 *   name: Protected
 *   description: Protected routes requiring authentication.
 */

/**
 * @swagger
 * /protected/dashboard:
 *   get:
 *     summary: Get the user dashboard
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome back, user 1!"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     role:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /protected/admin-dashboard:
 *   get:
 *     summary: Admin-only dashboard
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved admin dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome back, Admin 1!"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
