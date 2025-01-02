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
        // Use a static organization ID to avoid updating the environment each time
        const staticOrganizationId = process.env.SEED_ORGANIZATION_ID; // Replace with a UUID

        // Check if the organization already exists
        let organization = await Organization.findOne({
            where: { id: staticOrganizationId }
        });

        // If the organization doesn't exist, create it
        if (!organization) {
            organization = await Organization.create({
                id: staticOrganizationId, // Set the static organization ID
                name: 'Neighborhood HQ',
                apiKey: 'cef28041fc38b29016053080a46cc28b1fa8ae3b25c0eb67762fa2ec5c3fda35', // Static API key for local testing
            });
        }

        // Seed Users
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        const hashedUserPassword = await bcrypt.hash('user123', 10);

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

        // Seed other models (Messages, Announcements, SupportTickets, Payments, etc.)

        // Seed Reservations (with archived reservations for testing)
        await Reservation.bulkCreate([
            {
                organizationId: organization.id,
                userId: users[2].id,
                date: '2024-12-26',
                time: '19:00',
                guests: 4,
                notes: 'First-time visitors',
                status: 'confirmed',
                phoneNumber: '2223334444',
                contactName: 'jack',
                archived: false,
            },
            {
                organizationId: organization.id,
                userId: users[2].id,
                date: '2024-12-27',
                time: '13:00',
                guests: 2,
                notes: 'Birthday celebration',
                status: 'pending',
                phoneNumber: '2223334444',
                contactName: 'jack',
                archived: false,
            },
            {
                organizationId: organization.id,
                userId: users[2].id,
                date: '2024-12-24',
                time: '18:00',
                guests: 3,
                notes: 'Meeting with clients',
                status: 'confirmed',
                phoneNumber: '2223334444',
                contactName: 'jack',
                archived: true, // Archived reservation
            },
            {
                organizationId: organization.id,
                userId: users[2].id,
                date: '2024-12-23',
                time: '17:00',
                guests: 5,
                notes: 'Anniversary celebration',
                status: 'canceled',
                phoneNumber: '2223334444',
                contactName: 'jack',
                archived: true, // Archived reservation
            },
        ]);
        console.log('Reservations seeded successfully!');
        console.log('Organization ID:', organization.id);
    } catch (err) {
        console.error('Error seeding data:', err);
        throw err;
    }
};

module.exports = seedDatabase;
