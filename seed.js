const { User, Message, Announcement, SupportTicket, Payment, HOAInfo, Organization } = require('./src/models');
const bcrypt = require('bcrypt'); 
const sequelize = require('./src/config/db');

const seedDatabase = async () => {
    try {
        // Seed Organizations
        const organization = await Organization.create({ name: 'Neighborhood HQ' });

        // Seed Users
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        const hashedUserPassword = await bcrypt.hash('user123', 10);

        const users = await User.bulkCreate([
            {
                fullName: 'Admin User',
                email: 'admin@example.com',
                password: hashedAdminPassword,
                role: 'admin',
                organizationId: organization.id,
                verificationToken: null,
                resetToken: null,
                resetTokenExpiry: null,
            },
            {
                fullName: 'Regular User',
                email: 'user@example.com',
                password: hashedUserPassword,
                role: 'user',
                organizationId: organization.id,
                verificationToken: null,
                resetToken: null,
                resetTokenExpiry: null,
            },
        ]);
    
        console.log('Users seeded successfully');

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
        await SupportTicket.bulkCreate([
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
                dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
                status: 'pending',
            },
            {
                userId: users[1].id,
                amount: 75.0,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 20)),
                status: 'pending',
            },
        ]);
        console.log('Payments seeded successfully!');

        // Seed HOA Info
        await HOAInfo.bulkCreate([
            {
                title: 'New Parking Rules',
                content: 'Parking is not allowed on the streets overnight.',
                createdBy: users[0].id,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Community BBQ Event',
                content: 'Join us for a BBQ event on December 25th at the community park.',
                createdBy: users[1].id,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
        console.log('HOA Info seeded successfully!');
    } catch (err) {
        console.error('Error seeding data:', err);
        throw err;
    }
};

module.exports = seedDatabase; // Export the function only
