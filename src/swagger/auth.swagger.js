/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and organization management.
 */

/**
 * @swagger
 * /auth/register/organization:
 *   post:
 *     summary: Create a new organization and register the first admin user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationName
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               organizationName:
 *                 type: string
 *                 example: Example Organization
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: admin123
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: Organization and admin registered successfully. Verification email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Organization and admin registered successfully. Verification email sent!
 *                 token:
 *                   type: string
 *                   description: JWT token for the admin user.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Admin user ID.
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     email:
 *                       type: string
 *                       description: Admin user email.
 *                       example: admin@example.com
 *                     role:
 *                       type: string
 *                       description: User role.
 *                       example: admin
 *                     organizationId:
 *                       type: string
 *                       description: ID of the registered organization.
 *                       example: 987e6543-e21d-12d3-a456-426614174001
 *       400:
 *         description: Validation error or organization name already in use.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Organization name already in use.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to register organization and admin.
 */

/**
 * @swagger
 * /auth/register/invite:
 *   post:
 *     summary: Register a user using an invitation token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *               - token
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               fullName:
 *                 type: string
 *                 example: Jane Doe
 *               token:
 *                 type: string
 *                 example: abc123inviteToken
 *     responses:
 *       201:
 *         description: User registered successfully. Verification email sent.
 *       400:
 *         description: Validation error or invalid/expired token.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /auth/invite:
 *   post:
 *     summary: Admin invites a user to their organization.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: user
 *     responses:
 *       201:
 *         description: Invitation sent successfully.
 *       400:
 *         description: Validation error.
 *       403:
 *         description: Only admins can invite users.
 *       500:
 *         description: Server error.
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
 *                 organizationId:
 *                   type: string
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *       404:
 *         description: User not found.
 *       401:
 *         description: Invalid credentials.
 *       403:
 *         description: Account not verified.
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
 *                     organizationId:
 *                       type: string
 *                     organization:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
