const express = require('express');
const Announcement = require('../models/Announcement');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Create an announcement (Admin only)
router.post('/', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { title, content } = req.body;
    try {
        const announcement = await Announcement.create({ title, content });
        res.status(201).json({ message: 'Announcement created!', announcement });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create announcement' });
    }
});

// Fetch all announcements
router.get('/', authenticate, async (req, res) => {
    try {
        const announcements = await Announcement.findAll();
        res.json({ announcements });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

module.exports = router;
