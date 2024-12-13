const express = require('express');
const Message = require('../models/Message'); // Assuming you have a Message model
const User = require('../models/User');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

/**
 * Send a message (admin to user or user to admin)
 */
router.post('/', authenticate, async (req, res) => {
    const { recipientId, content } = req.body;

    try {
        // Ensure recipient exists
        const recipient = await User.findByPk(recipientId);
        if (!recipient) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        // Create the message
        const message = await Message.create({
            senderId: req.user.id,
            recipientId,
            content,
        });

        res.status(201).json({ message: 'Message sent successfully', message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

/**
 * Get all messages for the logged-in user
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: {
                [req.user.role === 'admin' ? 'recipientId' : 'senderId']: req.user.id,
            },
            include: [
                { model: User, as: 'sender', attributes: ['id', 'email', 'role'] },
                { model: User, as: 'recipient', attributes: ['id', 'email', 'role'] },
            ],
        });

        res.json({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

/**
 * Get details of a specific message
 */
router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const message = await Message.findByPk(id, {
            include: [
                { model: User, as: 'sender', attributes: ['id', 'email', 'role'] },
                { model: User, as: 'recipient', attributes: ['id', 'email', 'role'] },
            ],
        });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Ensure the logged-in user has access to the message
        if (
            message.senderId !== req.user.id &&
            message.recipientId !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        res.json({ message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch message' });
    }
});

/**
 * Delete a message
 */
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const message = await Message.findByPk(id);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Ensure the logged-in user has access to delete the message
        if (
            message.senderId !== req.user.id &&
            message.recipientId !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await message.destroy();
        res.json({ message: 'Message deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

module.exports = router;
