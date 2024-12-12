const sequelize = require('./src/config/db');
const User = require('./src/models/User');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Drops and recreates tables

        const hashedAdminPassword = await bcrypt.hash('admin123', 10); // Hash the admin password
        const hashedUserPassword = await bcrypt.hash('user123', 10);   // Hash the user password

        await User.bulkCreate([
            { email: 'admin@example.com', password: hashedAdminPassword, role: 'admin' },
            { email: 'user@example.com', password: hashedUserPassword, role: 'user' },
        ]);

        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        process.exit();
    }
};

seedDatabase();
