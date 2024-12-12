const express = require('express');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', authenticate, (req, res) => {
    res.json({ message: `Welcome back, user ${req.user.id}!`, user: req.user });
});

module.exports = router;
