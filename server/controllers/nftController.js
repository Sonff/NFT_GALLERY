const alchemyService = require('../services/alchemyService');
const Analytics = require('../models/Analytics');
const logger = require('../utils/logger');

/**
 * GET /api/nfts/:walletAddress
 * Fetches, filters, and paginates NFTs owned by the user. Updates analytics.
 */
exports.getNfts = async (req, res, next) => {
  try {
    const walletAddress = req.params.walletAddress.toLowerCase();
    const network = req.query.network || 'ethereum';
    const search = req.query.search || '';
    const collectionFilter = req.query.collection || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;

    if (!walletAddress || !walletAddress.startsWith('0x')) {
      res.status(400);
      return next(new Error('Invalid wallet address format'));
    }

    // Fetch from Alchemy (supports all networks in parallel or single network)
    let allNfts = [];
    if (network === 'all') {
      const networks = ['ethereum', 'polygon', 'base', 'bnb'];
      const results = await Promise.all(
        networks.map(net => 
          alchemyService.fetchNftsForOwner(walletAddress, net)
            .catch(err => {
              logger.error(`Error fetching for ${net} in multi-fetch: ${err.message}`);
              return [];
            })
        )
      );
      allNfts = results.flat();
    } else {
      allNfts = await alchemyService.fetchNftsForOwner(walletAddress, network);
    }

    // Compute unique collections for filtering list
    const collectionsSet = new Set();
    allNfts.forEach(nft => {
      if (nft.collectionName) {
        collectionsSet.add(nft.collectionName);
      }
    });
    const uniqueCollections = Array.from(collectionsSet);

    // Apply memory filters (Search and Collection)
    let filteredNfts = [...allNfts];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredNfts = filteredNfts.filter(nft => 
        (nft.name && nft.name.toLowerCase().includes(searchLower)) ||
        (nft.contractAddress && nft.contractAddress.toLowerCase() === searchLower)
      );
    }

    if (collectionFilter) {
      filteredNfts = filteredNfts.filter(nft => 
        nft.collectionName && nft.collectionName.toLowerCase() === collectionFilter.toLowerCase()
      );
    }

    // Paginate results
    const total = filteredNfts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedNfts = filteredNfts.slice(startIndex, endIndex);

    // Update user analytics record asynchronously
    try {
      const uniqueCollectionsCount = uniqueCollections.length;
      await Analytics.findOneAndUpdate(
        { walletAddress },
        {
          totalNFTs: allNfts.length,
          totalCollections: uniqueCollectionsCount,
          network: network,
          lastVisit: new Date(),
          $inc: { viewsCount: 1 }
        },
        { upsert: true, new: true }
      );
    } catch (analyticsError) {
      logger.error(`Error updating analytics for ${walletAddress}: ${analyticsError.message}`);
    }

    res.json({
      success: true,
      nfts: paginatedNfts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      collections: uniqueCollections
    });
  } catch (error) {
    next(error);
  }
};
