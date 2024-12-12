const express = require('express');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

/**
 * Dashboard route for all authenticated users
 */
router.get('/dashboard', authenticate, (req, res) => {
    res.json({ message: `Welcome back, user ${req.user.id}!`, user: req.user });
});

/**
 * Admin-only example route
 */
router.get('/admin-dashboard', authenticate, authorize(['admin']), (req, res) => {
    res.json({ message: `Welcome back, Admin ${req.user.id}!` });
});

module.exports = router;
