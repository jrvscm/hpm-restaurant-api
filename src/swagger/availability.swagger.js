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
 *     summary: Retrieve availability slots for the authenticated user's organization.
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
 *                   dayOfWeek:
 *                     type: string
 *                     example: "Monday"
 *                   startTime:
 *                     type: string
 *                     example: "08:00"
 *                   endTime:
 *                     type: string
 *                     example: "16:00"
 *       404:
 *         description: Availability not found.
 *       500:
 *         description: Failed to retrieve availability.
 */

/**
 * @swagger
 * /availability/public:
 *   get:
 *     summary: Retrieve public availability slots for an organization using an API key.
 *     tags: [Availability]
 *     parameters:
 *       - in: header
 *         name: apikey
 *         required: true
 *         schema:
 *           type: string
 *         description: The API key of the organization.
 *       - in: header
 *         name: organizationid
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the organization.
 *     responses:
 *       200:
 *         description: Successfully retrieved public availability slots.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dayOfWeek:
 *                     type: string
 *                     example: "Monday"
 *                   startTime:
 *                     type: string
 *                     example: "08:00"
 *                   endTime:
 *                     type: string
 *                     example: "16:00"
 *       401:
 *         description: Unauthorized access or missing API key.
 *       404:
 *         description: Organization or availability not found.
 *       500:
 *         description: Failed to retrieve availability.
 */

/**
 * @swagger
 * /availability:
 *   post:
 *     summary: Create new availability slots for the authenticated user's organization.
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - dayOfWeek
 *                 - startTime
 *                 - endTime
 *               properties:
 *                 dayOfWeek:
 *                   type: string
 *                   example: "Monday"
 *                 startTime:
 *                   type: string
 *                   example: "08:00"
 *                 endTime:
 *                   type: string
 *                   example: "16:00"
 *     responses:
 *       201:
 *         description: Successfully created availability slots.
 *       400:
 *         description: Validation error or missing fields.
 *       500:
 *         description: Failed to create availability.
 */

/**
 * @swagger
 * /availability:
 *   put:
 *     summary: Update availability slots for the authenticated user's organization.
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availabilityData:
 *                 type: object
 *                 additionalProperties:
 *                   type: object
 *                   properties:
 *                     startTime:
 *                       type: string
 *                       example: "08:00"
 *                     endTime:
 *                       type: string
 *                       example: "16:00"
 *     responses:
 *       200:
 *         description: Successfully updated availability slots.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 availability:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       startTime:
 *                         type: string
 *                         example: "08:00"
 *                       endTime:
 *                         type: string
 *                         example: "16:00"
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Availability not found.
 *       500:
 *         description: Failed to update availability.
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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the availability slot.
 *     responses:
 *       200:
 *         description: Successfully deleted availability slot.
 *       404:
 *         description: Availability slot not found.
 *       500:
 *         description: Failed to delete availability slot.
 */
