const cron = require('node-cron');
const { Op } = require('sequelize');
const Reservation = require('./models/Reservation'); 

// Scheduled cron job to run daily at midnight to archive 24h old reservations
cron.schedule('0 0 * * *', async () => { 
  try {
    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Perform the update operation
    const [updatedCount] = await Reservation.update(
      { archived: true },
      {
        where: {
          date: {
            [Op.lt]: twentyFourHoursAgo,  // Reservations older than 24 hours
          },
          status: { [Op.not]: 'cancelled' },  // Do not archive cancelled reservations
          archived: false,  // Only archive non-archived reservations
        },
      }
    );

    console.log(`Archived ${updatedCount} reservations older than 24 hours.`);
  } catch (error) {
    console.error('Error archiving reservations:', error);
  }
});
