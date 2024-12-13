/**
 * @swagger
 * tags:
 *   name: HOA Information
 *   description: Manage HOA-related information
 */

/**
 * @swagger
 * /hoa/info:
 *   get:
 *     summary: Get all HOA-related information
 *     tags: [HOA Information]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved HOA information.
 *       500:
 *         description: Failed to fetch HOA information.
 */

/**
 * @swagger
 * /hoa/info:
 *   post:
 *     summary: Add a new HOA information entry
 *     tags: [HOA Information]
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
 *                 example: "Pool Hours"
 *               content:
 *                 type: string
 *                 example: "The pool is open from 9 AM to 9 PM."
 *     responses:
 *       201:
 *         description: Successfully created HOA information.
 *       500:
 *         description: Failed to create HOA information.
 */

/**
 * @swagger
 * /hoa/info/{id}:
 *   put:
 *     summary: Update an HOA information entry
 *     tags: [HOA Information]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the HOA information entry to update.
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
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated HOA information.
 *       404:
 *         description: HOA information not found.
 *       500:
 *         description: Failed to update HOA information.
 */

/**
 * @swagger
 * /hoa/info/{id}:
 *   delete:
 *     summary: Delete an HOA information entry
 *     tags: [HOA Information]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the HOA information entry to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted HOA information.
 *       404:
 *         description: HOA information not found.
 *       500:
 *         description: Failed to delete HOA information.
 */
