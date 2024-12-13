const express = require('express');
const SupportTicket = require('../models/SupportTicket'); // Model for support tickets
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

/**
 * Submit a support ticket (any logged-in user)
 */
router.post('/', authenticate, async (req, res) => {
    const { title, description } = req.body;

    try {
        const ticket = await SupportTicket.create({
            userId: req.user.id,
            title,
            description,
            status: 'open',
        });

        res.status(201).json({ message: 'Support ticket created successfully!', ticket });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create support ticket.' });
    }
});

/**
 * Get all support tickets for the logged-in user
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const tickets = await SupportTicket.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ tickets });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch support tickets.' });
    }
});

/**
 * Update a support ticket (admin only)
 */
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    const { status, description } = req.body;

    try {
        const ticket = await SupportTicket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Support ticket not found.' });
        }

        // Update the ticket
        ticket.status = status || ticket.status;
        ticket.description = description || ticket.description;
        await ticket.save();

        res.status(200).json({ message: 'Support ticket updated successfully!', ticket });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update support ticket.' });
    }
});

/**
 * Delete a support ticket (admin only)
 */
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await SupportTicket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Support ticket not found.' });
        }

        await ticket.destroy();
        res.status(200).json({ message: 'Support ticket deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete support ticket.' });
    }
});

module.exports = router;
