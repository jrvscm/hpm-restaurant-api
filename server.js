const express = require('express'); // Import Express
const cors = require('cors'); // Import CORS middleware
const rateLimit = require('express-rate-limit'); // Import rate limiter
const dotenv = require('dotenv'); // Import dotenv for environment variables
const swaggerUi = require('swagger-ui-express'); // Swagger for API documentation
const swaggerSpecs = require('./src/config/swagger'); // Swagger configuration
const childProcess = require('child_process'); // For managing PostgreSQL process
const { Server } = require('socket.io'); // Socket.IO for real-time updates
const http = require('http'); // For creating the HTTP server

// Import routes
const announcementRoutes = require('./src/routes/announcement');
const authRoutes = require('./src/routes/auth');
const userManagementRoutes = require('./src/routes/userManagement');
const messageRoutes = require('./src/routes/messages');
const paymentRoutes = require('./src/routes/payment');
const dashboardRoutes = require('./src/routes/dashboard');
const supportRoutes = require('./src/routes/support');
const reservationRoutes = require('./src/routes/reservation');
const availabilityRoutes = require('./src/routes/availability');
const webhooks = require('./src/routes/webhooks');
const loyalty = require('./src/routes/loyalty');

require('./src/jobs');

dotenv.config();

if (process.env.NODE_ENV === 'development') {
    try {
        // Check if PostgreSQL is running
        childProcess.execSync('pg_ctl -D /usr/local/var/postgresql@14 status', { stdio: 'ignore' });
        console.log('PostgreSQL is already running.');
    } catch {
        try {
            childProcess.execSync('pg_ctl -D /usr/local/var/postgresql@14 start', { stdio: 'ignore' });
            console.log('Starting PostgreSQL...');
        } catch (err) {
            console.error('Failed to start PostgreSQL:', err.message);
            process.exit(1); 
        }
    }
}

// Initialize the Express app and HTTP server
const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO

// Trust Heroku's proxy
app.set('trust proxy', 1);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: [process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://pizzalander.netlify.app'], // Replace with your frontend URL in production
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true, 
    },
    path: '/socket.io', 
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

app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));

app.use(
    express.json({
      verify: (req, res, buf) => {
        if (req.originalUrl.startsWith('/webhooks/stripe')) {
          req.rawBody = buf.toString(); // Preserve raw body for Stripe
        }
      },
    })
  );

// Configure rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: {
        error: 'Too many requests from this IP, please try again after 15 minutes.',
    },
    keyGenerator: (req) => req.ip,
});

app.use(limiter);

// CORS Configuration
const corsOptions = {
    origin: [process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://pizzalander.netlify.app'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'apiKey', 'credentials', 'organizationId'],
    credentials: true,
};
app.use(cors(corsOptions)); // Apply CORS middleware

// Register API documentation route
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Register routes
app.use('/auth', authRoutes);
app.use('/announcements', announcementRoutes);
app.use('/users', userManagementRoutes);
app.use('/messages', messageRoutes);
app.use('/payments', paymentRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/support', supportRoutes);
app.use('/reservation', reservationRoutes);
app.use('/availability', availabilityRoutes);
app.use('/loyalty', loyalty);
app.use('/webhooks', webhooks);

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
