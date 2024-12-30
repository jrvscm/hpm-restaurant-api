const express = require('express');
const { Availability, Reservation, Organization, User } = require('../models');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();
const nodemailer = require('nodemailer');

/**
 * Get all reservations for an organization (Admin only).
 */
router.get('/reservations', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const organizationId = req?.user?.organizationId; // Extracted from session
        console.log('organizationId:', organizationId)
        if (!organizationId) {
            return res.status(400).json({ error: 'Organization ID is missing in session.' });
        }

        const reservations = await Reservation.findAll({
            where: { organizationId },
            include: [{ model: User, attributes: ['fullName', 'email', 'phone'] }],
        });

        res.status(200).json(reservations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve reservations.' });
    }
});
 
/**
 * Create a reservation (User).
 */
router.post('/reservations', authenticate, async (req, res) => {
    // Extract relevant fields from the request body
    const { date, time, guests, notes } = req.body;

    // Validate required fields
    if (!date || !time || !guests) {
        return res.status(400).json({
            error: 'Date, time, and guests are required.',
        });
    }

    try {
        // Use `req.user` for organizationId and userId
        const reservation = await Reservation.create({
            organizationId: req.user.organizationId, // Set by authenticate middleware
            userId: req.user.id, // Set by authenticate middleware
            date,
            time,
            guests,
            notes,
            status: 'pending', // Default status
        });

        const io = req.app.get('io'); 
        const organizationRoom = `organization:${req.user.organizationId}`;
        console.log('organizationRoom', organizationRoom)
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

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({
            error: 'Status must be one of: pending, confirmed, or cancelled.',
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
    const { date, time, guests, notes, organizationId, apiKey, customerEmail } = req.body;

    // Validate required fields
    if (!date || !time || !guests || !organizationId || !apiKey) {
        return res.status(400).json({
            error: 'Date, time, guests, organizationId, apiKey, and customerEmail are required.',
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
            status: 'pending', // Default status
        });

        const io = req.app.get('io');
        const organizationRoom = `organization:${organizationId}`;

        // Emit real-time updates to the organization room
        io.to(organizationRoom).emit('reservation:created', reservation);

        // Set up Nodemailer transporter for production
        const transporter = process.env.NODE_ENV === 'development' ? {} : nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER, // SMTP username
                pass: process.env.SMTP_PASS, // SMTP password
            },
        });

        // Construct the pending reservation email
        const mailOptions = {
            from: '"My App" <noreply@myapp.com>', // Sender address
            to: customerEmail, // Recipient email (the customer's email)
            subject: 'Your Reservation is Pending',
            text: `Your reservation for ${guests} guests on ${date} at ${time} is pending confirmation. We will notify you once it has been confirmed.`,
            html: `<p>Your reservation for ${guests} guests on ${date} at ${time} is pending confirmation.</p>
                <p>We will notify you once it has been confirmed.</p>`,
        };

        // Send the email
        if (process.env.NODE_ENV !== 'development') {
            await transporter.sendMail(mailOptions);
        }

        res.status(201).json(reservation);
    } catch (err) {
        console.error('Failed to create reservation:', err);
        res.status(500).json({ error: 'Failed to create reservation.' });
    }
});


module.exports = router;
