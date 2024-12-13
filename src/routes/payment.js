const express = require('express');
const Payment = require('../models/Payment');
const User = require('../models/User');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

/**
 * Create a payment request (Admin only)
 */
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    const { userId, amount, dueDate } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const payment = await Payment.create({ userId, amount, dueDate });
        res.status(201).json({ message: 'Payment request created!', payment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create payment request' });
    }
});

/**
 * Get all payments for the logged-in user
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const payments = await Payment.findAll({ where: { userId: req.user.id } });
        res.json({ payments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

/**
 * Get details of a specific payment
 */
router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findByPk(id);
        if (!payment || payment.userId !== req.user.id) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json({ payment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch payment details' });
    }
});

/**
 * Pay a specific payment (User only)
 */
router.post('/:id/pay', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findByPk(id);
        if (!payment || payment.userId !== req.user.id) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        if (payment.status === 'paid') {
            return res.status(400).json({ error: 'Payment is already completed' });
        }

        payment.status = 'paid';
        await payment.save();

        res.json({ message: 'Payment completed successfully!', payment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to complete payment' });
    }
});

/**
 * Delete a payment request (Admin only)
 */
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        await payment.destroy();
        res.json({ message: 'Payment request deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete payment request' });
    }
});

module.exports = router;
