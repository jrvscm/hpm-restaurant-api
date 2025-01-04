/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Manage HOA dues, rent, and other payments.
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a new payment request
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - amount
 *               - dueDate
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user.
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *               amount:
 *                 type: number
 *                 description: Amount due.
 *                 example: 150.75
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: Due date of the payment.
 *                 example: "2025-01-15T00:00:00Z"
 *     responses:
 *       201:
 *         description: Payment request created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment request created!"
 *                 payment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "789e0123-f45d-67b8-c678-987654321000"
 *                     userId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174001"
 *                     amount:
 *                       type: number
 *                       example: 150.75
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-15T00:00:00Z"
 *       500:
 *         description: Failed to create payment request.
 *
 *   get:
 *     summary: Get all payments for the logged-in user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all payments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "789e0123-f45d-67b8-c678-987654321000"
 *                       userId:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174001"
 *                       amount:
 *                         type: number
 *                         example: 150.75
 *                       dueDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-15T00:00:00Z"
 *                       status:
 *                         type: string
 *                         example: "unpaid"
 *       500:
 *         description: Failed to fetch payments.
 *
 * /payments/{id}:
 *   get:
 *     summary: Get details of a specific payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment.
 *     responses:
 *       200:
 *         description: Successfully fetched payment details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "789e0123-f45d-67b8-c678-987654321000"
 *                     userId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174001"
 *                     amount:
 *                       type: number
 *                       example: 150.75
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-15T00:00:00Z"
 *                     status:
 *                       type: string
 *                       example: "unpaid"
 *       404:
 *         description: Payment not found.
 *       500:
 *         description: Failed to fetch payment details.
 *
 *   delete:
 *     summary: Delete a payment request
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment.
 *     responses:
 *       200:
 *         description: Payment request deleted successfully.
 *       404:
 *         description: Payment not found.
 *       500:
 *         description: Failed to delete payment request.
 *
 * /payments/{id}/pay:
 *   post:
 *     summary: Pay a specific payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment.
 *     responses:
 *       200:
 *         description: Payment completed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment completed successfully!"
 *                 payment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "789e0123-f45d-67b8-c678-987654321000"
 *                     userId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174001"
 *                     amount:
 *                       type: number
 *                       example: 150.75
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-15T00:00:00Z"
 *                     status:
 *                       type: string
 *                       example: "paid"
 *       404:
 *         description: Payment not found.
 *       500:
 *         description: Failed to complete payment.
 */
