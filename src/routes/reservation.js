const express = require('express');
const { Reservation, Organization, User } = require('../models');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();
const nodemailer = require('nodemailer');

/**
 * Get all reservations for an organization (Admin only).
 */
router.get('/reservations', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const organizationId = req?.user?.organizationId;
  
      if (!organizationId) {
        return res.status(400).json({ error: 'Organization ID is missing in session.' });
      }
  
      const reservations = await Reservation.findAll({
        where: {
          organizationId,
          archived: false, // Exclude archived reservations
        },
        include: [{ model: User, attributes: ['fullName', 'email', 'phone'] }],
        order: [
          ['date', 'ASC'], // Sort by date (most recent first)
          ['time', 'ASC']   // Then sort by time (earliest first)
        ]
      });
  
      res.status(200).json(reservations);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve reservations.' });
    }
});

/**
 * Get all archived reservations for an organization (Admin only).
 */
router.get('/archived', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const organizationId = req?.user?.organizationId;
  
      if (!organizationId) {
        return res.status(400).json({ error: 'Organization ID is missing in session.' });
      }
  
      const reservations = await Reservation.findAll({
        where: {
          organizationId,
          archived: true,
        },
        include: [{ model: User, attributes: ['fullName', 'email', 'phone'] }],
        order: [
          ['date', 'ASC'],
          ['time', 'ASC']
        ]
      });
  
      res.status(200).json(reservations);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve archived reservations.' });
    }
});
 
/**
 * Create a reservation (User).
 */
router.post('/reservations', authenticate, async (req, res) => {
    // Extract relevant fields from the request body
    const { date, time, guests, notes, phoneNumber, contactName } = req.body;

    // Validate required fields
    if (!date || !time || !guests, !phoneNumber, !contactName) {
        return res.status(400).json({
            error: 'Date, time, and guests are required.',
        });
    }

    try {
        // Use `req.user` for organizationId and userId
        const reservation = await Reservation.create({
            organizationId: req.user.organizationId, 
            userId: req.user.id, 
            date,
            time,
            guests,
            notes,
            phoneNumber,
            contactName,
            status: 'pending',
        });

        const io = req.app.get('io'); 
        const organizationRoom = `organization:${req.user.organizationId}`;

        // Emit events to the organizations clients
        io.to(organizationRoom).emit('reservation:created', reservation);

        // Respond with the created reservation
        res.status(201).json(reservation);
    } catch (err) {
        console.error('Failed to create reservation:', err);
        res.status(500).json({ error: 'Failed to create reservation.' });
    }
});


/**
 * Update a reservation's status (Admin only).
 */
router.put('/reservations/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'canceled'].includes(status)) {
        return res.status(400).json({
            error: 'Status must be one of: pending, confirmed, or canceled.',
        });
    }

    try {
        const reservation = await Reservation.findByPk(id);

        if (!reservation || reservation.organizationId !== req.user.organizationId) {
            return res.status(404).json({ error: 'Reservation not found.' });
        }

        reservation.status = status;
        await reservation.save();

        res.status(200).json(reservation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update reservation status.' });
    }
});

/**
 * Get reservations for a specific user.
 */
router.get('/reservations/user', authenticate, async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            where: { userId: req.user.id },
        });

        res.status(200).json(reservations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve reservations.' });
    }
});

/**
 * Public-facing endpoint to create a reservation.
 */
router.post('/reservations/public', async (req, res) => {
    const { date, time, guests, notes, organizationId, apiKey, phoneNumber, contactName } = req.body;

    // Validate required fields
    if (!date || !time || !guests || !organizationId || !apiKey || !phoneNumber || !contactName) {
        return res.status(400).json({
            error: 'Missing required fields.',
        });
    }

    try {
        // Validate the API key
        const organization = await Organization.findOne({
            where: { id: organizationId, apiKey },
        });

        if (!organization) {
            return res.status(403).json({
                error: 'Invalid API key or organization ID.',
            });
        }

        // Create the reservation
        const reservation = await Reservation.create({
            organizationId,
            date,
            time,
            guests,
            notes,
            phoneNumber,
            contactName,
            status: 'pending', 
        });

        const io = req.app.get('io');
        const organizationRoom = `organization:${organizationId}`;
        if(process.env.NODE_ENV === 'development') {
            //TODO
            console.log('TODO: hook up messaging here for transactional messaging between customers')
        }
        // Emit real-time updates to the organization room
        io.to(organizationRoom).emit('reservation:created', reservation);

        res.status(201).json(reservation);
    } catch (err) {
        console.error('Failed to create reservation:', err);
        res.status(500).json({ error: 'Failed to create reservation.' });
    }
});

/**
 * Archive a reservation (Admin only).
 */
router.put('/reservations/:id/archive', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const reservation = await Reservation.findByPk(id);

        if (!reservation || reservation.organizationId !== req.user.organizationId) {
            return res.status(404).json({ error: 'Reservation not found.' });
        }

        reservation.archived = true;
        await reservation.save();

        res.status(200).json(reservation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to archive reservation.' });
    }
});


module.exports = router;
