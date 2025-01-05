const express = require('express');
const { UserPoints, PointsHistory, Organization } = require('../models');
const authenticate = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /loyalty/points/:userId
 * @desc Fetch loyalty points and history for a user
 * @access Private
 */
router.get(
  '/points/:userId',
  authenticate, // Ensure the user is authenticated
  async (req, res) => {
    const { userId } = req.params;
    const { apikey: apiKey, organizationid: organizationId } = req.headers;

    try {
      // Check if API key and organization ID are provided
      if (!apiKey || !organizationId) {
        return res.status(401).json({ error: 'Missing API key or organization ID.' });
      }

      // Validate the API key
      const organization = await Organization.findOne({
        where: { id: organizationId, apiKey },
      });

      if (!organization) {
        return res.status(401).json({ error: 'Invalid API key or organization ID.' });
      }

      // Ensure the user belongs to the validated organization
      const userPoints = await UserPoints.findOne({
        where: { userId, organizationId },
      });

      if (!userPoints) {
        return res.status(404).json({ error: 'User points not found.' });
      }

      // Fetch points history
      const history = await PointsHistory.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']], // Most recent first
      });

      res.status(200).json({
        totalPoints: userPoints.totalPoints,
        history,
      });
    } catch (error) {
      console.error('Error fetching user loyalty points:', error);
      res.status(500).json({ error: 'Failed to fetch user loyalty points.' });
    }
  }
);

module.exports = router;
