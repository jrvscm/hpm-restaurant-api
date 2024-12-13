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
 *               amount:
 *                 type: number
 *                 description: Amount due.
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: Due date of the payment.
 *     responses:
 *       201:
 *         description: Payment request created successfully.
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
 *       404:
 *         description: Payment not found.
 *       500:
 *         description: Failed to complete payment.
 */
