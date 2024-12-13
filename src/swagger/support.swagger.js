/**
 * @swagger
 * tags:
 *   name: Support
 *   description: Endpoints for managing support tickets.
 */

/**
 * @swagger
 * /support:
 *   post:
 *     summary: Submit a support ticket
 *     tags: [Support]
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
 *                 example: "Issue with billing"
 *               description:
 *                 type: string
 *                 example: "I was charged twice for this month's dues."
 *     responses:
 *       201:
 *         description: Support ticket created successfully.
 *       500:
 *         description: Failed to create support ticket.
 */

/**
 * @swagger
 * /support:
 *   get:
 *     summary: Get all support tickets for the logged-in user
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved support tickets.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Failed to fetch support tickets.
 */

/**
 * @swagger
 * /support/{id}:
 *   put:
 *     summary: Update a support ticket
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the support ticket to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "resolved"
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Support ticket updated successfully.
 *       404:
 *         description: Support ticket not found.
 *       500:
 *         description: Failed to update support ticket.
 */

/**
 * @swagger
 * /support/{id}:
 *   delete:
 *     summary: Delete a support ticket
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the support ticket to delete.
 *     responses:
 *       200:
 *         description: Support ticket deleted successfully.
 *       404:
 *         description: Support ticket not found.
 *       500:
 *         description: Failed to delete support ticket.
 */
