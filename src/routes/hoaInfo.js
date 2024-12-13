// routes/hoaInfo.js
const express = require('express');
const HOAInfo = require('../models/HOAInfo');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

/**
 * Get all HOA-related information (accessible to all users)
 */
router.get('/info', authenticate, async (req, res) => {
    try {
        const info = await HOAInfo.findAll();
        res.json({ info });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch HOA information.' });
    }
});

/**
 * Add a new HOA information entry (admin only)
 */
router.post('/info', authenticate, authorize(['admin']), async (req, res) => {
    const { title, content } = req.body;

    try {
        const newInfo = await HOAInfo.create({
            title,
            content,
            createdBy: req.user.id,
        });
        res.status(201).json({ message: 'HOA information added successfully!', newInfo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add HOA information.' });
    }
});

/**
 * Update an HOA information entry (admin only)
 */
router.put('/info/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const info = await HOAInfo.findByPk(id);
        if (!info) {
            return res.status(404).json({ error: 'HOA information not found.' });
        }

        info.title = title || info.title;
        info.content = content || info.content;

        await info.save();
        res.json({ message: 'HOA information updated successfully!', info });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update HOA information.' });
    }
});

/**
 * Delete an HOA information entry (admin only)
 */
router.delete('/info/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const info = await HOAInfo.findByPk(id);
        if (!info) {
            return res.status(404).json({ error: 'HOA information not found.' });
        }

        await info.destroy();
        res.json({ message: 'HOA information deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete HOA information.' });
    }
});

module.exports = router;
