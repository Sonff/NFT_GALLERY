import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Heart, ExternalLink, ShieldCheck, Coins } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const NftDetailsModal = ({ nft, onClose }) => {
  const { toggleFavorite, isFavorite, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!nft) return null;
  
  const { nftId, name, collectionName, image, description, contractAddress, tokenId, network, value, attributes = [] } = nft;
  const isFav = isFavorite(nftId);
  const [imgSrc, setImgSrc] = useState(image);

  useEffect(() => {
    setImgSrc(image);
  }, [image]);

  const handleImageError = () => {
    setImgSrc(`https://placehold.co/500x500/6d28d9/ffffff?text=${encodeURIComponent(name || 'NFT')}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    toast.success('Contract address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevent modal closure when clicking inside content
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-10 transition-opacity"
    >
      <div 
        onClick={handleModalClick}
        className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl relative animate-scaleIn max-h-[90vh] flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors shadow-sm"
          aria-label="Close details"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left: Image Container */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 min-h-[300px]">
          <img
            src={imgSrc || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'}
            alt={name}
            onError={handleImageError}
            className="w-full h-full object-cover max-h-[45vh] md:max-h-full"
          />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 backdrop-blur-md">
            {network}
          </div>
        </div>

        {/* Right: NFT Detailed Data */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[45vh] md:max-h-full flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <p className="text-xs font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest mb-1">
                {collectionName || 'Unknown Collection'}
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                {name || `NFT #${tokenId}`}
              </h2>
            </div>

            {/* Actions: Favorite & Open page */}
            <div className="flex flex-wrap gap-3">
              {isAuthenticated && (
                <button
                  onClick={() => toggleFavorite(nft)}
                  className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-sm font-semibold transition-all duration-300 transform active:scale-95 ${
                    isFav
                      ? 'bg-rose-500 hover:bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-500/10'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Heart className={`h-4.5 w-4.5 ${isFav ? 'fill-current' : ''}`} />
                  {isFav ? 'Favorited' : 'Add to Favorites'}
                </button>
              )}

              <Link
                to={`/gallery/${network}/${contractAddress}/${tokenId}`}
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2 text-sm font-semibold transition-all duration-300"
              >
                <ExternalLink className="h-4 w-4" />
                NFT Details Page
              </Link>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Description</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                {description || 'No description available for this digital asset.'}
              </p>
            </div>

            {/* Meta tags / contract details */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1 font-semibold">
                  <Coins className="h-4 w-4 text-amber-500" />
                  Floor Value
                </span>
                <span className="font-extrabold text-violet-600 dark:text-violet-400 font-mono">
                  {value && value !== 'null' ? `${value} ETH` : 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Contract Address</span>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-violet-500 dark:hover:text-violet-400 transition-colors font-mono text-xs"
                >
                  {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Token ID</span>
                <span className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all font-semibold">
                  #{tokenId}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Blockchain Network</span>
                <span className="capitalize text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  {network}
                </span>
              </div>
            </div>

            {/* Attributes Section */}
            {attributes && attributes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Properties</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {attributes.map((attr, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 bg-violet-50/50 dark:bg-violet-950/10 border border-violet-100 dark:border-violet-900/30 rounded-xl text-center flex flex-col justify-center"
                    >
                      <span className="text-[10px] text-violet-400 dark:text-violet-500 uppercase tracking-wider font-extrabold truncate">
                        {attr.trait_type}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5 truncate">
                        {attr.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDetailsModal;
