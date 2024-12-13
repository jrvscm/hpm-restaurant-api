const express = require('express');
const User = require('../models/User');
const Message = require('../models/Message');
const Payment = require('../models/Payment');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.get('/users', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalAdmins = await User.count({ where: { role: 'admin' } });
        const totalTenants = await User.count({ where: { role: 'user' } });

        res.status(200).json({ totalUsers, totalAdmins, totalTenants });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user overview.' });
    }
});

router.get('/payments', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const totalPayments = await Payment.count();
        const paidPayments = await Payment.count({ where: { status: 'paid' } });
        const unpaidPayments = await Payment.count({ where: { status: 'unpaid' } });

        res.status(200).json({ totalPayments, paidPayments, unpaidPayments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch payment overview.' });
    }
});

router.get('/messages', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const totalMessages = await Message.count();
        const recentMessages = await Message.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({ totalMessages, recentMessages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch message overview.' });
    }
});

module.exports = router;
