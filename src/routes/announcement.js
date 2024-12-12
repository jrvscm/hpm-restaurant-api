const express = require('express');
const Announcement = require('../models/Announcement');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

/**
 * Create an announcement (Admin only)
 */
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    const { title, content } = req.body;

    try {
        const announcement = await Announcement.create({ title, content });
        res.status(201).json({ message: 'Announcement created!', announcement });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create announcement' });
    }
});

/**
 * Fetch all announcements (Accessible to all logged-in users)
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const announcements = await Announcement.findAll();
        res.json({ announcements });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

module.exports = router;
