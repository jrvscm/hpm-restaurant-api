const {
    User,
    Organization,
    Reservation,
    UserPoints,
    Payment,
} = require('./src/models'); // Import the models
require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sequelize = require('./src/config/db');

const seedDatabase = async () => {
    try {
        console.log('Starting database seeding...');
        await sequelize.sync({ force: true }); // Recreate tables
        console.log('Database synced successfully!');

        const staticOrganizationId = process.env.SEED_ORGANIZATION_ID;

        // Check if the organization already exists
        let organization = await Organization.findOne({
            where: { id: staticOrganizationId },
        });

        if (!organization) {
            organization = await Organization.create({
                id: staticOrganizationId,
                name: 'Restaurant Saas Api',
                apiKey: process.env.SEED_API_KEY,
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
                rewardsNumber: '100001', // Add rewards number
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
                rewardsNumber: '100002', // Add rewards number
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
                rewardsNumber: '100003', // Add rewards number
            },
        ]);

        console.log('Users seeded successfully');

        // Seed Loyalty Points for "Regular User"
        const regularUser = users.find(user => user.email === 'user@example.com');
        await UserPoints.create({
            organizationId: organization.id,
            userId: regularUser.id,
            totalPoints: 100,
        });

        console.log('Loyalty points seeded successfully!');

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
        ]);

        console.log('Reservations seeded successfully!');

        // Seed Test Payment
        await Payment.create({
            userId: regularUser.id,
            organizationId: organization.id, // Link to the organization
            amount: 5000, // $50.00
            paymentIntentId: 'pi_test_123456',
            pointsEarned: 50,
        });

        console.log('Test payment seeded successfully!');
        console.log('Organization ID:', organization.id);
    } catch (err) {
        console.error('Error seeding data:', err);
        throw err;
    }
};

// Call the seed function when executing the script
(async () => {
    try {
        await seedDatabase();
        console.log('Seeding completed successfully!');
        process.exit(0); // Exit the process when seeding is done
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1); // Exit with error status
    }
})();
