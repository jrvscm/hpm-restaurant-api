const {
    User,
    Message,
    Announcement,
    SupportTicket,
    Payment,
    HOAInfo,
    Organization,
    Availability,
    Reservation,
} = require('./src/models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const seedDatabase = async () => {
    try {
        // Generate an API key
        let apiKey = crypto.randomBytes(32).toString('hex');
        //TODO: overwrite for local testing, remove before launch
        apiKey = 'cef28041fc38b29016053080a46cc28b1fa8ae3b25c0eb67762fa2ec5c3fda35';
        // Seed Organizations
        const organization = await Organization.create({
            name: 'Neighborhood HQ',
            apiKey, // Add API key to the organization
        });
        console.log('ORGANIZATION ID:', organization.id)
        console.log('Organization seeded successfully with API key:', apiKey);

        // Seed Users
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        const hashedUserPassword = await bcrypt.hash('user123', 10);

        // Generate a verification token for testing
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const users = await User.bulkCreate([
            {
                fullName: 'Admin User',
                email: 'admin@example.com',
                password: hashedAdminPassword,
                role: 'admin',
                organizationId: organization.id,
                status: 'verified',
                verificationToken: null,
                phone: '3334445555',
                resetToken: null,
                resetTokenExpiry: null,
            },
            {
                fullName: 'Unverified Admin',
                email: 'unverified-admin@example.com',
                password: hashedAdminPassword,
                role: 'admin',
                organizationId: organization.id,
                status: 'pending',
                verificationToken,
                phone: '3334445555',
                resetToken: null,
                resetTokenExpiry: null,
            },
            {
                fullName: 'Regular User',
                email: 'user@example.com',
                password: hashedUserPassword,
                role: 'user',
                organizationId: organization.id,
                status: 'verified',
                verificationToken: null,
                phone: '2223334444',
                resetToken: null,
                resetTokenExpiry: null,
            },
        ]);

        console.log('Users seeded successfully');

        // Seed Messages
        await Message.bulkCreate([
            {
                senderId: users[0].id,
                recipientId: users[2].id,
                content: 'Welcome to the Neighborhood HQ!',
            },
            {
                senderId: users[2].id,
                recipientId: users[0].id,
                content: 'Thank you! Excited to be here.',
            },
        ]);
        console.log('Messages seeded successfully!');

        // Seed Announcements
        await Announcement.bulkCreate([
            {
                organizationId: organization.id,
                title: 'HOA Meeting Reminder',
                content: 'The next HOA meeting is scheduled for December 20th.',
            },
            {
                organizationId: organization.id,
                title: 'Trash Collection Update',
                content: 'Trash collection will now occur on Mondays.',
            },
        ]);
        console.log('Announcements seeded successfully!');

        // Seed Support Tickets
        await SupportTicket.bulkCreate([
            {
                userId: users[2].id,
                title: 'Issue with payment',
                description: 'I was charged twice for my HOA dues.',
                status: 'open',
            },
            {
                userId: users[2].id,
                title: 'Account Access Problem',
                description: 'I cannot log into my account.',
                status: 'open',
            },
        ]);
        console.log('Support tickets seeded successfully!');

        // Seed Payments
        await Payment.bulkCreate([
            {
                userId: users[2].id,
                organizationId: organization.id,
                amount: 50.0,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
                status: 'pending',
            },
            {
                userId: users[2].id,
                organizationId: organization.id,
                amount: 75.0,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 20)),
                status: 'pending',
            },
        ]);
        console.log('Payments seeded successfully!');

        // Seed HOA Info
        await HOAInfo.bulkCreate([
            {
                organizationId: organization.id,
                title: 'New Parking Rules',
                content: 'Parking is not allowed on the streets overnight.',
                createdBy: users[0].id,
            },
            {
                organizationId: organization.id,
                title: 'Community BBQ Event',
                content: 'Join us for a BBQ event on December 25th at the community park.',
                createdBy: users[1].id,
            },
        ]);
        console.log('HOA Info seeded successfully!');

        // Seed Availability for all days of the week (now as a single object)
        const availabilityData = {
            Monday: { startTime: '09:00', endTime: '17:00' },
            Tuesday: { startTime: '09:00', endTime: '17:00' },
            Wednesday: { startTime: '09:00', endTime: '17:00' },
            Thursday: { startTime: '09:00', endTime: '17:00' },
            Friday: { startTime: '09:00', endTime: '17:00' },
            Saturday: { startTime: '09:00', endTime: '17:00' },
            Sunday: { startTime: '09:00', endTime: '17:00' }
        };

        await Availability.create({
            organizationId: organization.id,
            availabilityData: availabilityData, // Storing the availability data as JSON
        });
        console.log('Availability seeded successfully!');

        // Seed Reservations
        await Reservation.bulkCreate([
            {
                organizationId: organization.id,
                userId: users[2].id,
                date: '2024-12-26',
                time: '19:00',
                guests: 4,
                notes: 'First-time visitors',
                status: 'confirmed',
            },
            {
                organizationId: organization.id,
                userId: users[2].id,
                date: '2024-12-27',
                time: '13:00',
                guests: 2,
                notes: 'Birthday celebration',
                status: 'pending',
            },
        ]);
        console.log('Reservations seeded successfully!');

    } catch (err) {
        console.error('Error seeding data:', err);
        throw err;
    }
};

module.exports = seedDatabase;
