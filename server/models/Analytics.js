const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true, // Each connected wallet has one consolidated statistics document
    lowercase: true,
    trim: true,
    index: true
  },
  totalNFTs: {
    type: Number,
    default: 0
  },
  totalCollections: {
    type: Number,
    default: 0
  },
  network: {
    type: String,
    default: 'ethereum'
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  viewsCount: {
    type: Number,
    default: 1 // Tracks how many times they visited the dashboard / gallery
  }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
