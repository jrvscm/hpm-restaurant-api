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
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the announcement.
 *               content:
 *                 type: string
 *                 description: The content of the announcement.
 *     responses:
 *       201:
 *         description: Announcement created successfully.
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
 *       500:
 *         description: Failed to fetch announcements.
 *
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
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Announcement updated successfully.
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
 *       404:
 *         description: Announcement not found.
 *       500:
 *         description: Failed to delete announcement.
 */
