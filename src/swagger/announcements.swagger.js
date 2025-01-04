/**
 * @swagger
 * tags:
 *   name: Announcements
 *   description: Manage announcements, including creation, retrieval, updating, and deletion.
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
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the announcement.
 *                 example: "Maintenance Update"
 *               content:
 *                 type: string
 *                 description: The content of the announcement.
 *                 example: "Our system will be down for maintenance from 12 AM to 2 AM."
 *     responses:
 *       201:
 *         description: Announcement created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Announcement created!
 *                 announcement:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *       500:
 *         description: Failed to create announcement.
 *
 *   get:
 *     summary: Get all announcements
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all announcements.
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
 *                         type: string
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *       500:
 *         description: Failed to fetch announcements.
 */

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     summary: Get details of a specific announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the announcement.
 *     responses:
 *       200:
 *         description: Successfully fetched the announcement.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 announcement:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *       404:
 *         description: Announcement not found.
 *       500:
 *         description: Failed to fetch the announcement.
 *
 *   put:
 *     summary: Update an announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the announcement.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the announcement.
 *                 example: "Updated Title"
 *               content:
 *                 type: string
 *                 description: The new content of the announcement.
 *                 example: "Updated content for the announcement."
 *     responses:
 *       200:
 *         description: Announcement updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Announcement updated!
 *                 announcement:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *       404:
 *         description: Announcement not found.
 *       500:
 *         description: Failed to update announcement.
 *
 *   delete:
 *     summary: Delete an announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the announcement.
 *     responses:
 *       200:
 *         description: Announcement deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Announcement deleted!
 *       404:
 *         description: Announcement not found.
 *       500:
 *         description: Failed to delete announcement.
 */
