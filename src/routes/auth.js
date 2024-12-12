const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');

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

router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, role });

        // Generate token for the newly registered user
        const token = generateToken({ id: user.id, role: user.role });

        res.status(201).json({ message: 'User registered successfully!', token });
    } catch (err) {
        res.status(400).json({ error: 'Email already in use or invalid data' });
    }
});

module.exports = router;
