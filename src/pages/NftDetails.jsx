import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Copy, Check, ShieldCheck, ChevronRight, Coins } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const NftDetails = () => {
  const { network, contractAddress, tokenId } = useParams();
  const { account } = useWeb3();
  const { toggleFavorite, isFavorite, favorites, isAuthenticated } = useAuth();
  
  const [nft, setNft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    const locateNft = async () => {
      setIsLoading(true);
      
      // 1. Look in favorites first
      const favoriteMatch = favorites.find(
        (f) =>
          f.contractAddress.toLowerCase() === contractAddress.toLowerCase() &&
          f.tokenId === tokenId &&
          f.network.toLowerCase() === network.toLowerCase()
      );

      if (favoriteMatch) {
        setNft(favoriteMatch);
        setImgSrc(favoriteMatch.image);
        setIsLoading(false);
        return;
      }

      // 2. Query user gallery
      if (account) {
        try {
          const response = await api.get(`/nfts/${account}`, {
            params: { network }
          });
          
          if (response.data.success) {
            const galleryMatch = response.data.nfts.find(
              (n) =>
                n.contractAddress.toLowerCase() === contractAddress.toLowerCase() &&
                n.tokenId === tokenId
            );

            if (galleryMatch) {
              setNft(galleryMatch);
              setImgSrc(galleryMatch.image);
              setIsLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error('Failed to locate NFT in user gallery:', err);
        }
      }

      setNft(null);
      setIsLoading(false);
    };

    locateNft();
  }, [network, contractAddress, tokenId, account, favorites]);

  // Sync state if image URL updates later
  useEffect(() => {
    if (nft?.image) {
      setImgSrc(nft.image);
    }
  }, [nft]);

  const handleImageError = () => {
    if (nft) {
      setImgSrc(`https://placehold.co/500x500/6d28d9/ffffff?text=${encodeURIComponent(nft.name || 'NFT')}`);
    }
  };

  const copyContract = () => {
    if (!nft) return;
    navigator.clipboard.writeText(nft.contractAddress);
    setCopied(true);
    toast.success('Contract address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        <span className="text-slate-500 dark:text-slate-400 font-semibold text-sm">Locating collectible details...</span>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto text-3xl">⚠️</div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Collectible Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          We could not find this NFT in your active wallet or favorites list. Make sure you are connected to the correct network.
        </p>
        <Link to="/gallery" className="btn-primary inline-flex">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>
      </div>
    );
  }

  const isFav = isFavorite(nft.nftId);

  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
      {/* Breadcrumb / Back button */}
      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400">
        <Link to="/gallery" className="hover:text-violet-500 transition-colors flex items-center gap-1">
          Gallery
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="capitalize">{nft.network}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[150px] sm:max-w-none font-bold">
          {nft.name}
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column - Large Image Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-card rounded-[32px] overflow-hidden border border-slate-200/50 dark:border-slate-800/50 p-2 shadow-xl bg-white/40 dark:bg-slate-900/10">
            {/* Aspect container to prevent image collapse */}
            <div className="w-full relative pb-[100%] h-0 rounded-[24px] overflow-hidden bg-slate-950">
              <img
                src={imgSrc || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'}
                alt={nft.name}
                onError={handleImageError}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Informational Segment */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Titles */}
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
              {nft.network}
            </span>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
              {nft.name || `Collectible #${nft.tokenId}`}
            </h1>
            
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Collection: <span className="text-violet-500 dark:text-violet-400 font-extrabold">{nft.collectionName || 'Unknown Collection'}</span>
            </p>

            {/* Glowing Floor Price Badge */}
            <div className="flex items-center gap-3 bg-violet-50/50 dark:bg-violet-950/10 border border-violet-100/60 dark:border-violet-900/20 p-4 rounded-2xl max-w-xs shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center">
                <Coins className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Floor Price</span>
                <span className="text-lg font-black text-violet-600 dark:text-violet-400 font-mono">
                  {nft.value && nft.value !== 'null' ? `${nft.value} ETH` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          {isAuthenticated && (
            <div className="flex gap-4 border-y border-slate-200 dark:border-slate-800/60 py-5">
              <button
                onClick={() => toggleFavorite(nft)}
                className={`px-6 py-3 rounded-2xl border flex items-center gap-2 text-sm font-bold transition-all duration-300 transform active:scale-95 ${
                  isFav
                    ? 'bg-rose-500 hover:bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-500/15'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Heart className={`h-4.5 w-4.5 ${isFav ? 'fill-current' : ''}`} />
                {isFav ? 'In Favorites' : 'Add to Favorites'}
              </button>
            </div>
          )}

          {/* Descriptive Container */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Asset Description
            </h3>
            <div className="p-5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800/40 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {nft.description || 'No descriptive summary is registered for this ledger address.'}
            </div>
          </div>

          {/* Ledger metadata */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Contract Specifications
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Box 1 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40 rounded-2xl flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Contract Address</span>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300 select-all truncate max-w-[150px] sm:max-w-none">
                    {nft.contractAddress}
                  </span>
                  <button
                    onClick={copyContract}
                    className="p-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-500 transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Box 2 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40 rounded-2xl flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Token ID</span>
                <span className="font-mono text-xs text-slate-800 dark:text-slate-200 font-bold break-all mt-2 select-all">
                  #{nft.tokenId}
                </span>
              </div>

              {/* Box 3 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40 rounded-2xl flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Token standard</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold mt-2">
                  ERC-721
                </span>
              </div>

              {/* Box 4 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40 rounded-2xl flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ledger Security</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1 mt-2">
                  <ShieldCheck className="h-4 w-4" />
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Properties / Attributes */}
          {nft.attributes && nft.attributes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Asset Properties
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {nft.attributes.map((attr, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-violet-50/50 dark:bg-violet-950/10 border border-violet-100/60 dark:border-violet-900/20 rounded-xl text-center"
                  >
                    <span className="block text-[10px] text-violet-400 dark:text-violet-500 uppercase tracking-widest font-extrabold truncate">
                      {attr.trait_type}
                    </span>
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-200 mt-1 truncate">
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
  );
};

export default NftDetails;
