/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Admin dashboard overview of users, payments, and messages.
 */

/**
 * @swagger
 * /dashboard/users:
 *   get:
 *     summary: Get an overview of registered users
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
 *                 totalAdmins:
 *                   type: integer
 *                 totalTenants:
 *                   type: integer
 *       403:
 *         description: Forbidden - Requires admin privileges.
 *       500:
 *         description: Failed to fetch user overview.
 */

/**
 * @swagger
 * /dashboard/payments:
 *   get:
 *     summary: Get an overview of payment statuses
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
 *                 paidPayments:
 *                   type: integer
 *                 unpaidPayments:
 *                   type: integer
 *       403:
 *         description: Forbidden - Requires admin privileges.
 *       500:
 *         description: Failed to fetch payment overview.
 */

/**
 * @swagger
 * /dashboard/messages:
 *   get:
 *     summary: Get an overview of recent messages
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
 *                 recentMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       senderId:
 *                         type: integer
 *                       recipientId:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       403:
 *         description: Forbidden - Requires admin privileges.
 *       500:
 *         description: Failed to fetch message overview.
 */
