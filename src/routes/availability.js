const express = require('express');
const { Availability, Organization } = require('../models');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();

router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
      const availability = await Availability.findOne({
          where: { organizationId: req.user.organizationId },
      });

      if (!availability) {
        return res.status(404).json({ error: 'Availability not found' });
      }

      // Access the availability data directly (no need for JSON.parse)
      const availabilityData = availability.availabilityData;

      // Sort the availability by day of the week (Monday to Sunday)
      const sortedAvailability = Object.entries(availabilityData)
        .sort(([dayA], [dayB]) => {
          const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          return dayOrder.indexOf(dayA) - dayOrder.indexOf(dayB);
        })
        .map(([day, times]) => ({
          dayOfWeek: day,
          startTime: times.startTime,
          endTime: times.endTime,
        }));

      res.status(200).json(sortedAvailability);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve availability.' });
  }
});

/**
 * Create availability slots (Admin only).
 */
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    const { availabilityData } = req.body; 

    if (!availabilityData || !Array.isArray(availabilityData) || availabilityData.length === 0) {
        return res.status(400).json({
            error: 'Availability data is required.',
        });
    }

    try {
        const { organizationId } = req.user;
        // Validate each entry for the required fields (e.g., day, startTime, endTime)
        const availabilityPromises = availabilityData.map((data) => {
            const { dayOfWeek, startTime, endTime } = data;

            if (!dayOfWeek || !startTime || !endTime) {
                throw new Error(`Missing required fields for day: ${dayOfWeek}`);
            }

            // Create availability record for each day
            return Availability.create({
                organizationId,
                dayOfWeek,
                startTime,
                endTime,
            });
        });

        // Wait for all availability slots to be created
        const availability = await Promise.all(availabilityPromises);

        res.status(201).json({ availability });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create availability.' });
    }
});


// Update availability for an entire week (Admin only)
router.put('/', authenticate, authorize(['admin']), async (req, res) => {
  const { availabilityData } = req.body;

  if (!availabilityData || typeof availabilityData !== 'object') {
    return res.status(400).json({
      error: 'Availability data is required and must be an object.',
    });
  }

  try {
    const { organizationId } = req.user;

    // Step 1: Find current availability for the organization
    const currentAvailability = await Availability.findOne({
      where: { organizationId },
    });

    if (!currentAvailability) {
      // If no availability exists, create a new entry for the entire week
      await Availability.create({
        organizationId,
        availabilityData: availabilityData, // Store the entire week as an object directly
      });
    } else {
      // Step 2: Update the existing availability for the organization
      currentAvailability.availabilityData = availabilityData; // Store as an object directly
      await currentAvailability.save();
    }

    // Step 3: Fetch the updated availability and send it back to the frontend
    const updatedAvailability = await Availability.findOne({
      where: { organizationId },
    });

    // Parse the availabilityData back to an object if needed
    const parsedAvailabilityData = updatedAvailability.availabilityData;

    res.status(200).json({
      availability: parsedAvailabilityData, // Send the availability data as an object
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update availability.' });
  }
});


/**
 * Delete availability (Admin only).
 */
router.delete('/availability/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const availability = await Availability.findByPk(id);

        if (!availability || availability.organizationId !== req.user.organizationId) {
            return res.status(404).json({ error: 'Availability not found.' });
        }

        await availability.destroy();
        res.status(200).json({ message: 'Availability deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete availability.' });
    }
});

module.exports = router;
