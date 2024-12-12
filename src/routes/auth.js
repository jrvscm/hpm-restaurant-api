const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const { authenticate } = require('../middleware/auth'); // Middleware to verify JWT
const { authorize } = require('../middleware/authorize'); // Middleware for role-based access

const router = express.Router();

/**
 * User login endpoint
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = generateToken({ id: user.id, role: user.role });

        // Respond with token
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * Admin-only user creation endpoint
 */
router.post('/register', 
    authenticate, // Ensure the user is logged in
    authorize(['admin']), // Ensure only admins can create new users
    async (req, res) => {
        const { email, password, role } = req.body;

        try {
            // Validate role
            if (!['admin', 'user'].includes(role)) {
                return res.status(400).json({ error: 'Invalid role' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the user
            const user = await User.create({ email, password: hashedPassword, role });

            res.status(201).json({ message: 'User registered successfully!', user: { id: user.id, email, role } });
        } catch (err) {
            res.status(400).json({ error: 'Email already in use or invalid data' });
        }
    }
);

/**
 * Public tenant registration endpoint
 */
router.post('/register/tenant', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the tenant user with a default 'user' role
        const user = await User.create({ email, password: hashedPassword, role: 'user' });

        // Generate JWT for the new tenant
        const token = generateToken({ id: user.id, role: user.role });

        res.status(201).json({ message: 'Tenant registered successfully!', token });
    } catch (err) {
        res.status(400).json({ error: 'Email already in use or invalid data' });
    }
});

module.exports = router;
