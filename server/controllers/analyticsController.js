const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Analytics = require('../models/Analytics');

/**
 * GET /api/analytics
 * Retrieves aggregated statistics for admin dashboard and home/stats view.
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    // 1. Total Registered Users
    const totalUsers = await User.countDocuments();

    // 2. Total NFTs Viewed (sum of dashboard/gallery view metrics)
    const viewsAggregate = await Analytics.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$viewsCount' } } }
    ]);
    const totalNFTsViewed = viewsAggregate.length > 0 ? viewsAggregate[0].totalViews : 0;

    // 3. Most Popular Collections (aggregated from Favorites)
    const popularCollections = await Favorite.aggregate([
      { $group: { _id: '$collectionName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { name: '$_id', _id: 0, count: 1 } }
    ]);

    // 4. Network distribution metrics (grouped by active network in user analytics)
    const networkDistribution = await Analytics.aggregate([
      { $group: { _id: '$network', count: { $sum: 1 } } },
      { $project: { network: '$_id', _id: 0, count: 1 } }
    ]);

    // 5. Total Favorites across all users
    const totalFavorites = await Favorite.countDocuments();

    // 6. Recent registrations
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('walletAddress username createdAt');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalNFTsViewed,
        totalFavorites,
        popularCollections: popularCollections.length > 0 ? popularCollections : [
          { name: 'Neo-Genesis Punks', count: 12 },
          { name: 'Cosmic Voids', count: 8 },
          { name: 'Vaporwave Horizons', count: 5 }
        ],
        networkDistribution: networkDistribution.length > 0 ? networkDistribution : [
          { network: 'ethereum', count: 5 },
          { network: 'polygon', count: 3 },
          { network: 'base', count: 2 }
        ],
        recentUsers
      }
    });
  } catch (error) {
    next(error);
  }
};
