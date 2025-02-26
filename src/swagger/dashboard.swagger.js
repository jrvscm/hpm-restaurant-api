/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Admin dashboard overview of users, payments, and messages.
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get overall dashboard data for the authenticated user.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   description: Summary of dashboard data.
 *       403:
 *         description: Forbidden - Requires authentication.
 *       500:
 *         description: Failed to fetch dashboard data.
 */

/**
 * @swagger
 * /dashboard/users:
 *   get:
 *     summary: Get an overview of registered users.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user overview.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 100
 *                 totalAdmins:
 *                   type: integer
 *                   example: 10
 *                 totalTenants:
 *                   type: integer
 *                   example: 90
 *       403:
 *         description: Forbidden - Requires admin privileges.
 *       500:
 *         description: Failed to fetch user overview.
 */

/**
 * @swagger
 * /dashboard/payments:
 *   get:
 *     summary: Get an overview of payment statuses.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved payment overview.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPayments:
 *                   type: integer
 *                   example: 50
 *                 paidPayments:
 *                   type: integer
 *                   example: 30
 *                 unpaidPayments:
 *                   type: integer
 *                   example: 20
 *       403:
 *         description: Forbidden - Requires admin privileges.
 *       500:
 *         description: Failed to fetch payment overview.
 */

/**
 * @swagger
 * /dashboard/messages:
 *   get:
 *     summary: Get an overview of recent messages.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved recent messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMessages:
 *                   type: integer
 *                   example: 25
 *                 recentMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       senderId:
 *                         type: integer
 *                         example: 101
 *                       recipientId:
 *                         type: integer
 *                         example: 102
 *                       content:
 *                         type: string
 *                         example: "This is a sample message content."
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-30T12:00:00Z"
 *       403:
 *         description: Forbidden - Requires admin privileges.
 *       500:
 *         description: Failed to fetch message overview.
 */
