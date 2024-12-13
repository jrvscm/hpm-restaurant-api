const childProcess = require('child_process');
const express = require('express'); // Import Express
const cors = require('cors'); // Import CORS middleware
const protectedRoutes = require('./src/routes/protected'); // Import protected routes
const announcementRoutes = require('./src/routes/announcement'); // Import announcement routes
const authRoutes = require('./src/routes/auth'); // Import auth routes
const userManagementRoutes = require('./src/routes/userManagement');
const messageRoutes = require('./src/routes/messages');
const paymentRoutes = require('./src/routes/payment');
const hoaInfoRoutes = require('./src/routes/hoaInfo');
const dashboardRoutes = require('./src/routes/dashboard');
const supportRoutes = require('./src/routes/support');
const sequelize = require('./src/config/db'); 
const User = require('./src/models/User'); 
const bcrypt = require('bcrypt'); 
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/config/swagger');
dotenv.config();

// Conditionally check and start PostgreSQL in development
if (process.env.NODE_ENV === 'development') {
    try {
        // Check if PostgreSQL is running
        childProcess.execSync('pg_ctl -D /usr/local/var/postgresql@14 status', { stdio: 'ignore' });
        console.log('PostgreSQL is already running.');
    } catch {
        try {
            // Start PostgreSQL if not running
            childProcess.execSync('pg_ctl -D /usr/local/var/postgresql@14 start', { stdio: 'ignore' });
            console.log('Starting PostgreSQL...');
        } catch (err) {
            console.error('Failed to start PostgreSQL:', err.message);
            process.exit(1); // Exit the app if PostgreSQL cannot start
        }
    }
}

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
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes); 
app.use('/announcements', announcementRoutes); 
app.use('/users', userManagementRoutes);
app.use('/messages', messageRoutes);
app.use('/payments', paymentRoutes);
app.use('/info', hoaInfoRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/support', supportRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
