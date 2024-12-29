const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { Organization } = require('../models');

const router = express.Router();

// Put organization hours route
router.put('/organization/hours', authenticate, authorize(['admin']), async (req, res) => {
    const { openTime, closeTime } = req.body;

    if (!openTime || !closeTime) {
        return res.status(400).json({ error: 'Open and close times are required.' });
    }

    try {
        const organization = await Organization.findByPk(req.user.organizationId);
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found.' });
        }

        organization.openTime = openTime;
        organization.closeTime = closeTime;
        await organization.save();

        res.status(200).json({ message: 'Hours updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update hours.' });
    }
});

module.exports = router;
