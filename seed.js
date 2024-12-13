const sequelize = require('./src/config/db');
const User = require('./src/models/User');
const Message = require('./src/models/Message');
const Announcement = require('./src/models/Announcement');
const Support = require('./src/models/Support');
const Payment = require('./src/models/Payment');
const HOAInfo = require('./src/models/HOAInfo');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Drops and recreates tables

        // Seed Users
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        const hashedUserPassword = await bcrypt.hash('user123', 10);

        const users = await User.bulkCreate([
            { email: 'admin@example.com', password: hashedAdminPassword, role: 'admin' },
            { email: 'user@example.com', password: hashedUserPassword, role: 'user' },
        ]);
        console.log('Users seeded successfully!');

        // Seed Messages
        await Message.bulkCreate([
            {
                senderId: users[0].id,
                recipientId: users[1].id,
                content: 'Hello, how can I help you today?',
            },
            {
                senderId: users[1].id,
                recipientId: users[0].id,
                content: 'I need help with my account.',
            },
        ]);
        console.log('Messages seeded successfully!');

        // Seed Announcements
        await Announcement.bulkCreate([
            {
                title: 'HOA Meeting Reminder',
                content: 'The next HOA meeting is scheduled for December 20th.',
            },
            {
                title: 'Trash Collection Update',
                content: 'Trash collection will now occur on Mondays.',
            },
        ]);
        console.log('Announcements seeded successfully!');

        // Seed Support Tickets
        await Support.bulkCreate([
            {
                userId: users[1].id,
                title: 'Issue with payment',
                description: 'I was charged twice for my HOA dues.',
                status: 'open',
            },
            {
                userId: users[1].id,
                title: 'Account Access Problem',
                description: 'I cannot log into my account.',
                status: 'open',
            },
        ]);
        console.log('Support tickets seeded successfully!');

        // Seed Payments
        await Payment.bulkCreate([
            {
                userId: users[1].id,
                amount: 50.0,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 10)), // Due in 10 days
                status: 'pending',
            },
            {
                userId: users[1].id,
                amount: 75.0,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 20)), // Due in 20 days
                status: 'pending',
            },
        ]);
        console.log('Payments seeded successfully!');

        // Seed HOA Info
        await HOAInfo.bulkCreate([
            {
                title: 'New Parking Rules',
                content: 'Parking is not allowed on the streets overnight.',
            },
            {
                title: 'Community BBQ Event',
                content: 'Join us for a BBQ event on December 25th at the community park.',
            },
        ]);
        console.log('HOA Info seeded successfully!');

        console.log('Database seeded with all required data!');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        process.exit();
    }
};

seedDatabase();
