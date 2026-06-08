const { verifyMessage } = require('ethers');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Generate random numeric nonce
const generateNonce = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * GET /api/auth/nonce/:walletAddress
 * Retrieves the verification challenge nonce for a wallet.
 */
exports.getNonce = async (req, res, next) => {
  try {
    const walletAddress = req.params.walletAddress.toLowerCase();
    
    if (!walletAddress || !walletAddress.startsWith('0x')) {
      res.status(400);
      return next(new Error('Invalid wallet address format'));
    }

    let user = await User.findOne({ walletAddress });
    const newNonce = generateNonce();

    if (!user) {
      // Create new user with temporary nonce
      user = new User({
        walletAddress,
        nonce: newNonce,
        username: `Web3User_${walletAddress.slice(2, 8)}`
      });
      await user.save();
      logger.info(`Registered new user: ${walletAddress}`);
    } else {
      // Rotate nonce for existing user
      user.nonce = newNonce;
      await user.save();
      logger.info(`Rotated nonce for user: ${walletAddress}`);
    }

    res.json({
      success: true,
      nonce: user.nonce,
      message: `Sign this message to authenticate: Welcome to NFT Gallery! Nonce: ${user.nonce}`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify
 * Cryptographically verifies signature and returns JWT access token.
 */
exports.verifySignature = async (req, res, next) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      res.status(400);
      return next(new Error('Missing walletAddress, signature, or message'));
    }

    const lowerWallet = walletAddress.toLowerCase();
    const user = await User.findOne({ walletAddress: lowerWallet });

    if (!user) {
      res.status(404);
      return next(new Error('User not found. Request nonce first.'));
    }

    // Verify that the message includes user's current active nonce to prevent replay attacks
    if (!message.includes(user.nonce)) {
      res.status(400);
      return next(new Error('Invalid nonce in signature request message'));
    }

    let recoveredAddress;
    try {
      // Verify signature using ethers
      recoveredAddress = verifyMessage(message, signature);
    } catch (err) {
      logger.warn(`Signature parsing failed: ${err.message}`);
      res.status(400);
      return next(new Error('Cryptographic signature verification failed'));
    }

    if (recoveredAddress.toLowerCase() !== lowerWallet) {
      res.status(401);
      return next(new Error('Signature address mismatch'));
    }

    // Auth succeeded! Rotate nonce for next authentication
    user.nonce = generateNonce();
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { walletAddress: user.walletAddress },
      process.env.JWT_SECRET || 'supersecretjwtkey12345',
      { expiresIn: '24h' }
    );

    logger.info(`User authenticated successfully: ${user.walletAddress}`);

    res.json({
      success: true,
      token,
      user: {
        walletAddress: user.walletAddress,
        username: user.username,
        avatar: user.avatar,
        joinedDate: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
