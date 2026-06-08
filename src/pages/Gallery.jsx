import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import NftGrid from '../components/NftGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import NftDetailsModal from '../components/NftDetailsModal';
import { HelpCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

const Gallery = () => {
  const { account, networkSlug } = useWeb3();
  
  const [nfts, setNfts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter & Search states
  const [search, setSearch] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal active state
  const [activeNft, setActiveNft] = useState(null);

  // Main fetch hook
  const fetchNfts = async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/nfts/${account}`, {
        params: {
          network: selectedNetwork,
          search: search,
          collection: selectedCollection,
          page: page,
          limit: 8 // Limit per page to show nice pagination layout
        }
      });

      if (response.data.success) {
        setNfts(response.data.nfts);
        setCollections(response.data.collections);
        setTotalPages(response.data.pagination.pages);
        setTotalItems(response.data.pagination.total);
      }
    } catch (err) {
      console.error('Failed to load gallery NFTs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNfts();
  }, [account, selectedNetwork, selectedCollection, search, page]);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [selectedNetwork, selectedCollection, search]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedNetwork('all');
    setSelectedCollection('');
    setPage(1);
  };

  // Memory sort function
  const getSortedNfts = () => {
    const nftsCopy = [...nfts];
    return nftsCopy.sort((a, b) => {
      if (sortOption === 'name-asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortOption === 'name-desc') {
        return (b.name || '').localeCompare(a.name || '');
      }
      if (sortOption === 'id-asc') {
        return parseInt(a.tokenId || '0', 10) - parseInt(b.tokenId || '0', 10);
      }
      if (sortOption === 'id-desc') {
        return parseInt(b.tokenId || '0', 10) - parseInt(a.tokenId || '0', 10);
      }
      return 0;
    });
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6">
          <HelpCircle className="h-8 w-8 animate-bounce" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
          Connect Your Wallet to View NFTs
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
          The NFT Gallery is currently empty. Connect your MetaMask wallet to query on-chain collectibles.
        </p>
      </div>
    );
  }

  const sortedNfts = getSortedNfts();

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            NFT Gallery
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Displaying {totalItems} digital assets on {selectedNetwork === 'all' ? 'all networks' : selectedNetwork}
          </p>
        </div>
        
        {/* Refresh Button */}
        <button
          onClick={fetchNfts}
          disabled={isLoading}
          className="btn-secondary self-start sm:self-center px-4 py-2"
        >
          <RefreshCw className={`h-4 w-4 text-violet-500 ${isLoading ? 'animate-spin' : ''}`} />
          Sync Gallery
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <FilterSidebar
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
            collections={collections}
            onClearAll={handleClearFilters}
          />
        </div>

        {/* Main Gallery Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-grow w-full">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            
            <div className="w-full sm:w-48">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 focus:border-violet-500 dark:focus:border-violet-500 outline-none backdrop-blur-md transition-all duration-300 font-semibold text-sm cursor-pointer"
              >
                <option value="name-asc">Sort: Name (A-Z)</option>
                <option value="name-desc">Sort: Name (Z-A)</option>
                <option value="id-asc">Sort: Token ID (Low-High)</option>
                <option value="id-desc">Sort: Token ID (High-Low)</option>
              </select>
            </div>
          </div>

          {/* NFT Grid Container */}
          {isLoading ? (
            <LoadingSkeleton count={8} />
          ) : (
            <NftGrid 
              nfts={sortedNfts} 
              onViewDetails={(nft) => setActiveNft(nft)} 
              colsClass="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
            />
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/60 pt-6 mt-8">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Page <span className="font-semibold text-slate-800 dark:text-slate-200">{page}</span> of{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPages}</span>
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pop-up Details Modal overlay */}
      {activeNft && (
        <NftDetailsModal
          nft={activeNft}
          onClose={() => setActiveNft(null)}
        />
      )}
    </div>
  );
};

export default Gallery;
