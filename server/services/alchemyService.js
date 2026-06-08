const axios = require('axios');
const logger = require('../utils/logger');

// Map network name to Alchemy API subdomains
const ALCHEMY_SUBDOMAINS = {
  ethereum: 'eth-mainnet.g.alchemy.com',
  polygon: 'polygon-mainnet.g.alchemy.com',
  base: 'base-mainnet.g.alchemy.com',
  bnb: 'bnb-mainnet.g.alchemy.com'
};

/**
 * Fetch NFTs owned by a wallet address on a specific network.
 */
const fetchNftsForOwner = async (walletAddress, network = 'ethereum') => {
  const apiKey = process.env.ALCHEMY_API_KEY;
  const subdomain = ALCHEMY_SUBDOMAINS[network.toLowerCase()];

  if (!subdomain) {
    throw new Error(`Unsupported network: ${network}`);
  }

  // Return empty array if API key is not present (disable mocks completely)
  if (!apiKey || apiKey === 'YOUR_ALCHEMY_API_KEY_HERE') {
    logger.warn(`Alchemy API Key is missing. Returning empty array for: ${walletAddress}`);
    return [];
  }

  try {
    const url = `https://${subdomain}/nft/v3/${apiKey}/getNFTsForOwner`;
    logger.info(`Fetching NFTs from Alchemy on ${network} for: ${walletAddress}`);
    
    const response = await axios.get(url, {
      params: {
        owner: walletAddress,
        withMetadata: true,
        pageSize: 100
      }
    });

    const ownedNfts = response.data.ownedNfts || [];
    
    return ownedNfts.map(nft => {
      const contractAddress = nft.contract.address;
      const tokenId = nft.tokenId;
      
      // Fallback for image URLs
      let image = '';
      if (nft.image && nft.image.cachedUrl) image = nft.image.cachedUrl;
      else if (nft.image && nft.image.originalUrl) image = nft.image.originalUrl;
      else if (nft.raw && nft.raw.metadata && nft.raw.metadata.image) image = nft.raw.metadata.image;
      else if (nft.contract && nft.contract.openSeaMetadata && nft.contract.openSeaMetadata.imageUrl) image = nft.contract.openSeaMetadata.imageUrl;
      
      // Handle IPFS links
      if (image && image.startsWith('ipfs://')) {
        image = image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      } else if (image && image.startsWith('ipfs/')) {
        image = 'https://ipfs.io/' + image;
      }

      return {
        nftId: `${contractAddress}-${tokenId}-${network}`,
        name: nft.name || nft.title || `${nft.contract.name || 'NFT'} #${tokenId}`,
        description: nft.description || nft.contract.openSeaMetadata?.description || 'No description available.',
        contractAddress,
        tokenId,
        collectionName: nft.contract.openSeaMetadata?.collectionName || nft.contract.name || 'Unnamed Collection',
        image: image || '',
        network: network.toLowerCase(),
        value: nft.contract.openSeaMetadata?.floorPrice ? nft.contract.openSeaMetadata.floorPrice.toString() : null,
        attributes: nft.raw?.metadata?.attributes || []
      };
    });
  } catch (error) {
    logger.error(`Error querying Alchemy API for ${network}: ${error.message}. Returning empty array.`);
    return []; // Return empty array on failure instead of fallback mocks
  }
};

module.exports = {
  fetchNftsForOwner
};
