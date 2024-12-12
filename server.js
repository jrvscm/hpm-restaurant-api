const express = require('express'); // Import Express
const cors = require('cors'); // Import CORS middleware
const protectedRoutes = require('./src/routes/protected'); // Import protected routes
const announcementRoutes = require('./src/routes/announcement'); // Import announcement routes
const authRoutes = require('./src/routes/auth'); // Import auth routes
const sequelize = require('./src/config/db'); // Import Sequelize instance
const User = require('./src/models/User'); // Import User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Seed data
const seedDatabase = async () => {
    try {
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        const hashedUserPassword = await bcrypt.hash('user123', 10);

        await User.bulkCreate([
            { email: 'admin@example.com', password: hashedAdminPassword, role: 'admin' },
            { email: 'user@example.com', password: hashedUserPassword, role: 'user' },
        ]);

        console.log('Seed data added successfully!');
    } catch (err) {
        console.error('Error adding seed data:', err);
    }
};

// Sync database and seed data
sequelize
    .sync({ force: true }) // Drops and recreates tables
    .then(async () => {
        console.log('Database synced successfully!');
        await seedDatabase(); // Add seed data
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });

const app = express(); // Initialize Express app

// Middleware to parse JSON requests
app.use(express.json());

// Configure rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: {
        error: 'Too many requests from this IP, please try again after 15 minutes.',
    },
});
app.use(limiter);

// CORS Configuration
const corsOptions = {
    origin: ['*'], // TODO: Replace with your frontend's URL once integration!!!
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions)); // Apply CORS middleware

// Register routes
app.use('/auth', authRoutes); // Register authentication routes
app.use('/protected', protectedRoutes); // Register protected routes
app.use('/announcements', announcementRoutes); // Register announcements routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
