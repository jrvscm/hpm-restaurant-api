const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

/**
 * User login endpoint
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.status !== 'verified') {
            return res.status(403).json({ error: 'Account not verified. Please check your email.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({ id: user.id, role: user.role });
        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * Admin-only user registration endpoint
 */
router.post('/register/admin', authenticate, authorize(['admin']), async (req, res) => {
    const { email, password, role } = req.body;

    try {
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, role: 'pending_admin', verificationToken });

        console.log(`Verification email sent: http://your-frontend-url.com/verify/${verificationToken}`);
        res.status(201).json({ message: 'Admin registered successfully. Verification email sent!' });
    } catch (err) {
        res.status(400).json({ error: 'Email already in use or invalid data' });
    }
});

/**
 * Tenant registration endpoint
 */
router.post('/register/tenant', async (req, res) => {
    const { email, password } = req.body;

    try {
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, role: 'user', verificationToken });

        console.log(`Verification email sent: http://your-frontend-url.com/verify/${verificationToken}`);
        res.status(201).json({ message: 'Tenant registered successfully. Verification email sent!' });
    } catch (err) {
        res.status(400).json({ error: 'Email already in use or invalid data' });
    }
});

/**
 * Verify account endpoint
 */
router.get('/verify/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ where: { verificationToken: token } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token.' });
        }

        user.status = 'verified';
        user.verificationToken = null;
        if (user.role === 'pending_admin') user.role = 'admin';
        await user.save();

        res.status(200).json({ message: 'Account verified successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during verification.' });
    }
});

/**
 * Resend verification email
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
        res.status(500).json({ error: 'Failed to resend verification email.' });
    }
});

/**
 * User logout endpoint (optional: token blacklisting)
 */
router.post('/logout', authenticate, async (req, res) => {
    try {
        res.status(200).json({ message: 'User logged out successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * Password reset request endpoint
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
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        console.log(`Password reset link: http://your-frontend-url.com/reset/${resetToken}`);
        res.status(200).json({ message: 'Password reset email sent.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send reset email.' });
    }
});

/**
 * Password reset endpoint
 */
router.put('/reset/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({ where: { resetToken: token } });

        if (!user || Date.now() > user.resetTokenExpiry) {
            return res.status(400).json({ error: 'Invalid or expired reset token.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;

        await user.save();
        res.status(200).json({ message: 'Password reset successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to reset password.' });
    }
});

/**
 * Get the logged-in user's profile
 */
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'role', 'status'],
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch profile.' });
    }
});

module.exports = router;
