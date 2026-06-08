const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const nftRoutes = require('./routes/nftRoutes');
const userRoutes = require('./routes/userRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Initialize express app
const app = express();

// Set security headers, allow CORS, parse incoming JSON
app.use(helmet());
app.use(cors({
  origin: '*', // Allow all origins for simplicity in testing, lock down in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Log HTTP requests
app.use(morgan('dev', {
  stream: {
    write: (message) => logger.debug(message.trim())
  }
}));

// API Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the NFT Gallery API',
    version: '1.0.0',
    status: 'Operational'
  });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/nfts', nftRoutes);
app.use('/api/user', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/analytics', analyticsRoutes);

// Catch-all 404 route for APIs
app.use('*', (req, res, next) => {
  res.status(404);
  next(new Error(`API endpoint not found: ${req.originalUrl}`));
});

// Custom error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to DB
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer();
