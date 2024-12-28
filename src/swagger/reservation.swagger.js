/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Manage reservations and availability.
 */

/**
 * @swagger
 * /reservations/availability:
 *   get:
 *     summary: Get all availability for the organization.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of availability slots.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 123e4567-e89b-12d3-a456-426614174000
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: 2024-01-01
 *                   startTime:
 *                     type: string
 *                     example: 18:00
 *                   endTime:
 *                     type: string
 *                     example: 20:00
 *                   maxGuests:
 *                     type: integer
 *                     example: 20
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /reservations/availability:
 *   post:
 *     summary: Create availability slots.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - startTime
 *               - endTime
 *               - maxGuests
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-01
 *               startTime:
 *                 type: string
 *                 example: 18:00
 *               endTime:
 *                 type: string
 *                 example: 20:00
 *               maxGuests:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       201:
 *         description: Availability slot created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *                 date:
 *                   type: string
 *                   example: 2024-01-01
 *                 startTime:
 *                   type: string
 *                   example: 18:00
 *                 endTime:
 *                   type: string
 *                   example: 20:00
 *                 maxGuests:
 *                   type: integer
 *                   example: 20
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /reservations/availability/{id}:
 *   delete:
 *     summary: Delete or block an availability slot.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the availability slot.
 *     responses:
 *       200:
 *         description: Availability slot deleted successfully.
 *       404:
 *         description: Availability slot not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations for the organization.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 123e4567-e89b-12d3-a456-426614174000
 *                   userId:
 *                     type: string
 *                     example: 987e6543-e21d-12d3-a456-426614174001
 *                   date:
 *                     type: string
 *                     example: 2024-01-01
 *                   time:
 *                     type: string
 *                     example: 19:00
 *                   guests:
 *                     type: integer
 *                     example: 4
 *                   notes:
 *                     type: string
 *                     example: "Birthday celebration"
 *                   status:
 *                     type: string
 *                     example: pending
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a reservation.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - time
 *               - guests
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-01
 *               time:
 *                 type: string
 *                 example: 19:00
 *               guests:
 *                 type: integer
 *                 example: 4
 *               notes:
 *                 type: string
 *                 example: "Birthday celebration"
 *     responses:
 *       201:
 *         description: Reservation created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *                 date:
 *                   type: string
 *                   example: 2024-01-01
 *                 time:
 *                   type: string
 *                   example: 19:00
 *                 guests:
 *                   type: integer
 *                   example: 4
 *                 notes:
 *                   type: string
 *                   example: "Birthday celebration"
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update a reservation's status.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reservation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Reservation status updated successfully.
 *       400:
 *         description: Invalid status.
 *       404:
 *         description: Reservation not found.
 *       500:
 *         description: Server error.
 */
