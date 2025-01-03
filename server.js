const express = require('express'); // Import Express
const cors = require('cors'); // Import CORS middleware
const rateLimit = require('express-rate-limit'); // Import rate limiter
const dotenv = require('dotenv'); // Import dotenv for environment variables
const swaggerUi = require('swagger-ui-express'); // Swagger for API documentation
const swaggerSpecs = require('./src/config/swagger'); // Swagger configuration
const sequelize = require('./src/config/db'); // Sequelize database connection
const childProcess = require('child_process'); // For managing PostgreSQL process
const seedDatabase = require('./seed'); // Database seeding function
const { Server } = require('socket.io'); // Socket.IO for real-time updates
const http = require('http'); // For creating the HTTP server
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
const reservationRoutes = require('./src/routes/reservation');
const availabilityRoutes = require('./src/routes/availability');

require('./src/jobs');

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

// Initialize the Express app and HTTP server
const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: [process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''], // Replace with your frontend URL in production
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true, 
    },
});

// Attach Socket.IO to app for access in routes
app.set('io', io);
//assign to the correct organization
io.on('connection', (socket) => {
    const organizationId = socket.handshake.query.organizationId;

    if (organizationId) {
        socket.join(`organization:${organizationId}`);
        console.log(`Socket ${socket.id} joined room organization:${organizationId}`);
    } else {
        console.warn(`Socket ${socket.id} connected without an organizationId.`);
    }
});

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
    origin: [process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''], // TODO: Replace with your frontend's URL once integration!!!
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'apiKey', 'credentials', 'organizationId'],
    credentials: true,
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
app.use('/reservation', reservationRoutes);
app.use('/availability', availabilityRoutes);

// Sync database and seed data
if(process.env.NODE_ENV === 'development') {
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
}

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
