/**
 * @swagger
 * tags:
 *   name: Organization
 *   description: Manage organization details and settings.
 */

/**
 * @swagger
 * /organization/hours:
 *   put:
 *     summary: Update the organization's open and close hours for reservations.
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - openTime
 *               - closeTime
 *             properties:
 *               openTime:
 *                 type: string
 *                 description: Organization opening time (HH:MM format).
 *                 example: "09:00"
 *               closeTime:
 *                 type: string
 *                 description: Organization closing time (HH:MM format).
 *                 example: "21:00"
 *     responses:
 *       200:
 *         description: Hours updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hours updated successfully.
 *       400:
 *         description: Validation error (missing fields).
 *       404:
 *         description: Organization not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /organization/details:
 *   get:
 *     summary: Retrieve organization details.
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved organization details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: "Neighborhood HQ"
 *                 openTime:
 *                   type: string
 *                   example: "09:00"
 *                 closeTime:
 *                   type: string
 *                   example: "21:00"
 *                 active:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Organization not found.
 *       500:
 *         description: Server error.
 */
