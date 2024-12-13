const express = require('express');
const User = require('../models/User');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

/**
 * Get all users (Admin only)
 */
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'email', 'role', 'createdAt'] });
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

/**
 * Get details of a specific user (Admin only)
 */
router.get('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id, { attributes: ['id', 'email', 'role', 'createdAt'] });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
});

/**
 * Update a user's details (Admin only)
 */
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    const { email, role } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user details
        if (email) user.email = email;
        if (role && ['admin', 'user'].includes(role)) {
            user.role = role;
        } else if (role) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        await user.save();
        res.json({ message: 'User updated successfully', user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

/**
 * Delete a user (Admin only)
 */
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
