const express = require('express');
const Announcement = require('../models/Announcement');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

/**
 * Create a new announcement (Admin only)
 */
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    const { title, content } = req.body;

    try {
        const announcement = await Announcement.create({ title, content });
        res.status(201).json({ message: 'Announcement created!', announcement });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create announcement' });
    }
});

/**
 * Get all announcements (Accessible to all users)
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const announcements = await Announcement.findAll();
        res.json({ announcements });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

/**
 * Get details of a specific announcement
 */
router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const announcement = await Announcement.findByPk(id);
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }
        res.json({ announcement });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch the announcement' });
    }
});

/**
 * Update an announcement (Admin only)
 */
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const announcement = await Announcement.findByPk(id);
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        announcement.title = title || announcement.title;
        announcement.content = content || announcement.content;
        await announcement.save();

        res.json({ message: 'Announcement updated!', announcement });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update the announcement' });
    }
});

/**
 * Delete an announcement (Admin only)
 */
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const announcement = await Announcement.findByPk(id);
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        await announcement.destroy();
        res.json({ message: 'Announcement deleted!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete the announcement' });
    }
});

module.exports = router;
