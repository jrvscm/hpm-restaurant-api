const express = require('express'); // Import Express
const cors = require('cors'); // Import CORS middleware
const rateLimit = require('express-rate-limit'); // Import rate limiter
const dotenv = require('dotenv'); // Import dotenv for environment variables
const swaggerUi = require('swagger-ui-express'); // Swagger for API documentation
const swaggerSpecs = require('./src/config/swagger'); // Swagger configuration
const sequelize = require('./src/config/db'); // Sequelize database connection
const childProcess = require('child_process'); // For managing PostgreSQL process
const seedDatabase = require('./seed'); // Database seeding function

// Import routes
const protectedRoutes = require('./src/routes/protected');
const announcementRoutes = require('./src/routes/announcement');
const authRoutes = require('./src/routes/auth');
const userManagementRoutes = require('./src/routes/userManagement');
const messageRoutes = require('./src/routes/messages');
const paymentRoutes = require('./src/routes/payment');
const hoaInfoRoutes = require('./src/routes/hoaInfo');
const dashboardRoutes = require('./src/routes/dashboard');
const supportRoutes = require('./src/routes/support');

// Initialize dotenv for environment configuration
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

// Initialize the Express app
const app = express();

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
    origin: ['http://localhost:3000'], // TODO: Replace with your frontend's URL once integration!!!
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true
};
app.use(cors(corsOptions)); // Apply CORS middleware

// Register API documentation route
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Register routes
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/announcements', announcementRoutes);
app.use('/users', userManagementRoutes);
app.use('/messages', messageRoutes);
app.use('/payments', paymentRoutes);
app.use('/info', hoaInfoRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/support', supportRoutes);

// Sync database and seed data
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully!');
        await sequelize.sync({ force: true }); // Sync and drop existing tables
        console.log('Database synced successfully!');
        await seedDatabase(); // Seed the database
        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1); // Exit if there is an error
    }
})();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
