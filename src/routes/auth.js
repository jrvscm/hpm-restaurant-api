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

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, role });

        res.status(201).json({ message: 'User registered successfully!', user: { id: user.id, email, role } });
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
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, role: 'user' });

        const token = generateToken({ id: user.id, role: user.role });
        res.status(201).json({ message: 'Tenant registered successfully!', token });
    } catch (err) {
        res.status(400).json({ error: 'Email already in use or invalid data' });
    }
});

/**
 * User logout endpoint (optional: token blacklisting)
 */
router.post('/logout', authenticate, async (req, res) => {
    try {
        // If implementing token blacklisting, invalidate the token here.
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
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = await bcrypt.hash(resetToken, 10);

        // Save the hashed token to the user record with an expiration (optional)
        user.resetToken = hashedResetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        // Send the token via email (mock implementation)
        console.log(`Reset link: http://localhost:5000/auth/reset/${resetToken}`);

        res.status(200).json({ message: 'Password reset link sent to email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
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
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        // Validate the token
        const isValidToken = await bcrypt.compare(token, user.resetToken);
        if (!isValidToken) {
            return res.status(400).json({ error: 'Invalid token.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        // Clear the reset token fields
        user.resetToken = null;
        user.resetTokenExpiry = null;

        await user.save();
        res.status(200).json({ message: 'Password reset successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * Get the logged-in user's profile
 */
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'role'],
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
