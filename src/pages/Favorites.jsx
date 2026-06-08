import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import NftGrid from '../components/NftGrid';
import NftDetailsModal from '../components/NftDetailsModal';
import { Heart, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { account } = useWeb3();
  const { favorites, isAuthenticated } = useAuth();
  const [activeNft, setActiveNft] = useState(null);

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6">
          <Heart className="h-8 w-8 animate-bounce" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
          Connect Your Wallet to View Favorites
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
          Please connect your MetaMask wallet to sync your database profile favorites.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Saved Favorites
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          You have {favorites.length} collectibles saved in your database portfolio
        </p>
      </div>

      {/* Grid */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 glass-card rounded-3xl border border-slate-200/60 dark:border-slate-800/60">
          <div className="h-16 w-16 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            Favorites List Empty
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-xs mb-6">
            You haven't saved any NFTs yet. Explore the gallery to add assets to this list.
          </p>
          <Link to="/gallery" className="btn-primary">
            Explore Gallery
          </Link>
        </div>
      ) : (
        <NftGrid 
          nfts={favorites} 
          onViewDetails={(nft) => setActiveNft(nft)} 
        />
      )}

      {/* Modal overlay */}
      {activeNft && (
        <NftDetailsModal
          nft={activeNft}
          onClose={() => setActiveNft(null)}
        />
      )}
    </div>
  );
};

export default Favorites;
