const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nft_gallery';
    
    // Setup mongoose connection options
    const options = {
      autoIndex: true, // Build indexes in dev
    };

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    await mongoose.connect(connStr, options);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    // Do not crash the application instantly, but log the error
  }
};

module.exports = connectDB;
