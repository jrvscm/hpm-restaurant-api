const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User, Organization, SupportTicket } = require('../models');
const { generateToken } = require('../utils/auth');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

/**
 * Create an organization and register the first admin user.
 */
/**
 * Create an organization and register the first admin user.
 */
router.post('/register/organization', async (req, res) => {
    const { organizationName, email, password, fullName } = req.body;

    // Validate required fields
    if (!organizationName || !email || !password || !fullName) {
        return res.status(400).json({
            error: 'Organization name, email, password, and full name are required.',
        });
    }

    try {
        // Check if the organization already exists
        const existingOrganization = await Organization.findOne({ where: { name: organizationName } });
        if (existingOrganization) {
            return res.status(400).json({ error: 'Organization name already in use.' });
        }

        // Create the organization
        const organization = await Organization.create({ name: organizationName });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create the admin user
        const admin = await User.create({
            email,
            password: hashedPassword,
            fullName,
            role: 'admin',
            status: 'pending',
            organizationId: organization.id,
            verificationToken,
        });

        // Generate a JWT token for the new admin
        const token = generateToken(admin);

        // Optionally set the token as a cookie (if server-side sessions are used)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // Send response with the token
        console.log(`Verification email sent: http://your-frontend-url.com/verify/${verificationToken}`);
        res.status(201).json({
            message: 'Organization and admin registered successfully. Verification email sent!',
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to register organization and admin.' });
    }
});

/**
 * Register a tenant or invited admin to an existing organization.
 */
router.post('/register/invite', async (req, res) => {
    const { email, password, fullName, token } = req.body;

    if (!email || !password || !fullName || !token) {
        return res.status(400).json({ error: 'Email, password, full name, and invite token are required.' });
    }

    try {
        const invitingUser = await User.findOne({ where: { verificationToken: token } });
        if (!invitingUser || invitingUser.status !== 'invited') {
            return res.status(400).json({ error: 'Invalid or expired invitation token.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email,
            password: hashedPassword,
            fullName,
            role: 'user',
            organizationId: invitingUser.organizationId,
            status: 'pending',
        });

        invitingUser.verificationToken = null;
        await invitingUser.save();

        res.status(201).json({ message: 'User registered successfully. Verification email sent!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to register user.' });
    }
});

/**
 * Admin invites users to join their organization.
 */
router.post('/invite', authenticate, authorize(['admin']), async (req, res) => {
    const { email, role } = req.body;

    if (!email || !['admin', 'user'].includes(role)) {
        return res.status(400).json({ error: 'Valid email and role are required.' });
    }

    try {
        const adminUser = await User.findByPk(req.user.id);

        const verificationToken = crypto.randomBytes(32).toString('hex');
        await User.create({
            email,
            role: role === 'admin' ? 'pending_admin' : 'user',
            status: 'invited',
            organizationId: adminUser.organizationId,
            verificationToken,
        });

        console.log(`Invitation email sent: http://your-frontend-url.com/register/invite/${verificationToken}`);

        res.status(201).json({ message: `Invitation sent to ${email}.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to invite user.' });
    }
});

/**
 * Log in a user and return a JWT token.
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        if (user.status === 'pending') {
            return res.status(403).json({ error: 'Account not verified.' });
        }

        const token = generateToken(user);

        res.status(200).json({ token, role: user.role, organizationId: user.organizationId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to log in user.' });
    }
});

/**
 * Verify a user's account using a token.
 */
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ where: { verificationToken: token } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        user.status = 'verified';
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ message: 'Account verified successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to verify account.' });
    }
});

/**
 * Resend the verification email.
 */
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || user.status === 'verified') {
            return res.status(400).json({ error: 'User not found or already verified.' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        await user.save();

        console.log(`Verification email resent: http://your-frontend-url.com/verify/${verificationToken}`);

        res.status(200).json({ message: 'Verification email resent successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to resend email.' });
    }
});

/**
 * Log out a user.
 */
router.post('/logout', authenticate, (req, res) => {
    res.status(200).json({ message: 'User logged out successfully.' });
});

/**
 * Request a password reset.
 */
router.post('/reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        console.log(`Password reset link: http://your-frontend-url.com/reset/${resetToken}`);

        res.status(200).json({ message: 'Password reset link sent to email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send password reset link.' });
    }
});

/**
 * Reset password using a reset token.
 */
router.put('/reset/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({ where: { resetToken: token, resetTokenExpiry: { [Op.gt]: Date.now() } } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to reset password.' });
    }
});

/**
 * Get the logged-in user's profile.
 */
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { include: Organization });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve profile.' });
    }
});

module.exports = router;
