import React, { useState, useEffect } from 'react';
import { Heart, ExternalLink, Coins } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NftCard = ({ nft, onViewDetails }) => {
  const { toggleFavorite, isFavorite, isAuthenticated } = useAuth();
  const { nftId, name, collectionName, image, network, tokenId, value } = nft;

  const isFav = isFavorite(nftId);
  const [imgSrc, setImgSrc] = useState(image);

  // Sync state if image prop updates
  useEffect(() => {
    setImgSrc(image);
  }, [image]);

  const handleImageError = () => {
    // Elegant fallback to placeholders service if the original image url fails
    setImgSrc(`https://placehold.co/500x500/6d28d9/ffffff?text=${encodeURIComponent(name || 'NFT')}`);
  };

  // Network badge style mapping
  const getNetworkBadge = (net) => {
    switch (net?.toLowerCase()) {
      case 'ethereum':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'polygon':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'base':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'bnb':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Avoid opening details modal when toggling favorite
    toggleFavorite(nft);
  };

  return (
    <div 
      onClick={() => onViewDetails && onViewDetails(nft)}
      className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer flex flex-col h-full"
    >
      {/* NFT Image Container - Padding-bottom Hack to force 1:1 Aspect Ratio without collapse */}
      <div className="w-full relative pb-[100%] h-0 bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <img
          src={imgSrc || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'}
          alt={name}
          onError={handleImageError}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Network Badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border backdrop-blur-md ${getNetworkBadge(network)}`}>
          {network}
        </div>

        {/* Floating Favorite Button */}
        {isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all duration-300 transform active:scale-90 ${
              isFav
                ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-rose-500 border-slate-200/50 dark:border-slate-800/50'
            }`}
            aria-label="Add to Favorites"
          >
            <Heart className={`h-4.5 w-4.5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* NFT Details */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
            {collectionName || 'Unknown Collection'}
          </p>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
            {name || `NFT #${tokenId}`}
          </h3>
        </div>

        {/* Value metric row */}
        <div className="flex justify-between items-center mt-3 text-xs bg-slate-100/50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900/60">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Coins className="h-3.5 w-3.5 text-amber-500" />
            Floor Value
          </span>
          <span className="font-extrabold text-violet-600 dark:text-violet-400">
            {value && value !== 'null' ? `${value} ETH` : 'N/A'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-400">
          <span>ID: <span className="font-mono font-semibold text-slate-600 dark:text-slate-300">#{tokenId.slice(0, 6)}{tokenId.length > 6 ? '...' : ''}</span></span>
          <span className="flex items-center gap-1 text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300 font-semibold transition-colors">
            View Details
            <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
