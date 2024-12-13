/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messaging between users and admins.
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: integer
 *                 example: 2
 *               content:
 *                 type: string
 *                 example: "This is a message content."
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       404:
 *         description: Recipient not found
 *       500:
 *         description: Failed to send message
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Get all messages for the logged-in user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       sender:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           email:
 *                             type: string
 *                           role:
 *                             type: string
 *                             example: "admin"
 *                       recipient:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           email:
 *                             type: string
 *                           role:
 *                             type: string
 *                             example: "user"
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Failed to fetch messages
 */

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Get details of a specific message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the message to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     sender:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                     recipient:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                     content:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Message not found
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Failed to fetch message
 */

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the message to delete
 *     responses:
 *       200:
 *         description: Successfully deleted message
 *       404:
 *         description: Message not found
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Failed to delete message
 */
