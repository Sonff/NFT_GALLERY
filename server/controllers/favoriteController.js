const Favorite = require('../models/Favorite');
const logger = require('../utils/logger');

/**
 * POST /api/favorites
 * Adds an NFT to user's favorites. Protected by JWT.
 */
exports.addFavorite = async (req, res, next) => {
  try {
    const { nftId, contractAddress, tokenId, name, image, description, collectionName, network, value } = req.body;
    const walletAddress = req.user.walletAddress; // From protect middleware

    if (!nftId || !contractAddress || !tokenId || !network) {
      res.status(400);
      return next(new Error('Missing required fields: nftId, contractAddress, tokenId, or network'));
    }

    // Check if already favorited
    const existing = await Favorite.findOne({ walletAddress, nftId });
    if (existing) {
      res.status(400);
      return next(new Error('NFT is already in your favorites'));
    }

    const favorite = new Favorite({
      walletAddress,
      nftId,
      contractAddress,
      tokenId,
      name,
      image,
      description,
      collectionName,
      network,
      value
    });

    await favorite.save();
    logger.info(`NFT favorited: user=${walletAddress}, nft=${nftId}`);

    res.status(210).json({
      success: true,
      data: favorite,
      message: 'NFT added to favorites'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/favorites/:nftId
 * Removes an NFT from favorites. Protected by JWT.
 * Supporting deleting by both NFT composite ID (contractAddress-tokenId-network) or MongoDB ID
 */
exports.removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params; // Can be composite nftId or mongoId
    const walletAddress = req.user.walletAddress;

    let result;
    if (id.includes('-')) {
      // Deleting by composite nftId
      result = await Favorite.findOneAndDelete({ walletAddress, nftId: id });
    } else {
      // Deleting by MongoDB object ID
      result = await Favorite.findOneAndDelete({ _id: id, walletAddress });
    }

    if (!result) {
      res.status(404);
      return next(new Error('Favorite not found or unauthorized'));
    }

    logger.info(`NFT removed from favorites: user=${walletAddress}, nft=${id}`);
    res.json({
      success: true,
      message: 'NFT removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/favorites/:walletAddress
 * Fetches all saved favorites for a given wallet address.
 */
exports.getFavorites = async (req, res, next) => {
  try {
    const walletAddress = req.params.walletAddress.toLowerCase();

    if (!walletAddress || !walletAddress.startsWith('0x')) {
      res.status(400);
      return next(new Error('Invalid wallet address format'));
    }

    const favorites = await Favorite.find({ walletAddress }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: favorites.length,
      nfts: favorites
    });
  } catch (error) {
    next(error);
  }
};
