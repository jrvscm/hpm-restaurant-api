/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and management.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user and return a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 role:
 *                   type: string
 *                   example: user
 *       404:
 *         description: User not found.
 *       401:
 *         description: Invalid credentials.
 *       403:
 *         description: Account not verified.
 */

/**
 * @swagger
 * /auth/register/admin:
 *   post:
 *     summary: Register a new admin user (admin only).
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: admin123
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: Admin registered successfully.
 *       400:
 *         description: Invalid role or email in use.
 */

/**
 * @swagger
 * /auth/register/tenant:
 *   post:
 *     summary: Register a new tenant user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: tenant@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Tenant registered successfully.
 *       400:
 *         description: Invalid email or already in use.
 */

/**
 * @swagger
 * /auth/verify/{token}:
 *   get:
 *     summary: Verify a user's account using a token.
 *     tags: [Authentication]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent to the user's email.
 *     responses:
 *       200:
 *         description: Account verified successfully.
 *       400:
 *         description: Invalid or expired token.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend the verification email.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification email resent successfully.
 *       400:
 *         description: User not found or already verified.
 *       500:
 *         description: Failed to resend email.
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /auth/reset:
 *   post:
 *     summary: Request a password reset.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent to email.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /auth/reset/{token}:
 *   put:
 *     summary: Reset password using a reset token.
 *     tags: [Authentication]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Invalid or expired token.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get the logged-in user's profile.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     status:
 *                       type: string
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
