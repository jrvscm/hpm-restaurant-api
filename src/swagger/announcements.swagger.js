/**
 * @swagger
 * tags:
 *   name: Announcements
 *   description: Announcement management.
 */

/**
 * @swagger
 * /announcements:
 *   post:
 *     summary: Create a new announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Important Update"
 *               content:
 *                 type: string
 *                 example: "This is an announcement from the admin."
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Failed to create announcement
 */

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Fetch all announcements
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved announcements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 announcements:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *       500:
 *         description: Failed to fetch announcements
 */
