import React from 'react';
import NftCard from './NftCard';
import { HelpCircle } from 'lucide-react';

const NftGrid = ({ 
  nfts, 
  onViewDetails, 
  colsClass = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
}) => {
  if (!nfts || nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 glass-card rounded-3xl border border-slate-200/60 dark:border-slate-800/60">
        <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
          <HelpCircle className="h-8 w-8 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
          No NFTs Found
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-sm">
          No collectibles match the current filter or search criteria. Try adjusting your settings.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${colsClass}`}>
      {nfts.map((nft) => (
        <NftCard 
          key={nft.nftId} 
          nft={nft} 
          onViewDetails={onViewDetails} 
        />
      ))}
    </div>
  );
};

export default NftGrid;
