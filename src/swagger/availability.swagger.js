/**
 * @swagger
 * tags:
 *   name: Availability
 *   description: Manage availability slots for reservations.
 */

/**
 * @swagger
 * /availability:
 *   get:
 *     summary: Retrieve all availability slots for the organization.
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved availability slots.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "456e7890-e12d-34a4-b567-876543210000"
 *                   organizationId:
 *                     type: string
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-12-30"
 *                   startTime:
 *                     type: string
 *                     example: "10:00"
 *                   endTime:
 *                     type: string
 *                     example: "12:00"
 *                   maxGuests:
 *                     type: integer
 *                     example: 20
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /availability:
 *   post:
 *     summary: Create a new availability slot.
 *     tags: [Availability]
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
 *                 example: "2024-12-30"
 *               startTime:
 *                 type: string
 *                 example: "10:00"
 *               endTime:
 *                 type: string
 *                 example: "12:00"
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
 *                   example: "789e0123-f45d-67b8-c678-987654321000"
 *                 organizationId:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2024-12-30"
 *                 startTime:
 *                   type: string
 *                   example: "10:00"
 *                 endTime:
 *                   type: string
 *                   example: "12:00"
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
 * /availability/{id}:
 *   put:
 *     summary: Update an availability slot.
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Availability ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *               startTime:
 *                 type: string
 *                 example: "11:00"
 *               endTime:
 *                 type: string
 *                 example: "13:00"
 *               maxGuests:
 *                 type: integer
 *                 example: 25
 *     responses:
 *       200:
 *         description: Availability slot updated successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Availability not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /availability/{id}:
 *   delete:
 *     summary: Delete an availability slot.
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Availability ID.
 *     responses:
 *       200:
 *         description: Availability slot deleted successfully.
 *       404:
 *         description: Availability not found.
 *       500:
 *         description: Server error.
 */
