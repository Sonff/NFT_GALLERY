const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  nftId: {
    type: String,
    required: true, // composite id: contractAddress-tokenId-network
  },
  contractAddress: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  tokenId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'Unnamed NFT'
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  collectionName: {
    type: String,
    default: 'Unknown Collection'
  },
  network: {
    type: String,
    required: true,
    enum: ['ethereum', 'polygon', 'base'],
    lowercase: true
  },
  value: {
    type: String,
    default: '0.00'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user cannot favorite the same NFT twice
FavoriteSchema.index({ walletAddress: 1, nftId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
