const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Analytics = require('../models/Analytics');
const logger = require('../utils/logger');

/**
 * GET /api/user/:walletAddress
 * Fetches user profile data, favorites count, and active analytics.
 */
exports.getUser = async (req, res, next) => {
  try {
    const walletAddress = req.params.walletAddress.toLowerCase();

    if (!walletAddress || !walletAddress.startsWith('0x')) {
      res.status(400);
      return next(new Error('Invalid wallet address format'));
    }

    const user = await User.findOne({ walletAddress });
    const favoritesCount = await Favorite.countDocuments({ walletAddress });
    const analytics = await Analytics.findOne({ walletAddress });

    const defaultProfile = {
      walletAddress,
      username: user ? user.username : `Guest_${walletAddress.slice(2, 8)}`,
      avatar: user ? user.avatar : '',
      joinedDate: user ? user.createdAt : new Date(),
      isGuest: !user
    };

    res.json({
      success: true,
      user: defaultProfile,
      stats: {
        favoritesCount,
        totalNFTs: analytics ? analytics.totalNFTs : 0,
        totalCollections: analytics ? analytics.totalCollections : 0,
        lastNetwork: analytics ? analytics.network : 'ethereum',
        lastVisit: analytics ? analytics.lastVisit : new Date(),
        viewsCount: analytics ? analytics.viewsCount : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/user/profile
 * Updates username and avatar preferences. Protected by JWT.
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const walletAddress = req.user.walletAddress;
    const { username, avatar } = req.body;

    const user = await User.findOne({ walletAddress });
    if (!user) {
      res.status(404);
      return next(new Error('User profile not found'));
    }

    if (username !== undefined) {
      user.username = username.trim();
    }
    
    if (avatar !== undefined) {
      user.avatar = avatar.trim();
    }

    await user.save();
    logger.info(`User profile updated: ${walletAddress}`);

    res.json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        username: user.username,
        avatar: user.avatar,
        joinedDate: user.createdAt
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
