import React, { useEffect, useState } from 'react';
import { Compass, Wallet, ShieldCheck, BarChart3, Star, Zap, Network } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const { account, connectWallet, isConnecting } = useWeb3();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNFTsViewed: 0,
    totalFavorites: 0
  });

  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        const response = await api.get('/analytics');
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (err) {
        console.error('Failed to load platform stats:', err);
      }
    };
    fetchPlatformStats();
  }, []);

  const handleCtaClick = () => {
    if (account) {
      navigate('/dashboard');
    } else {
      connectWallet();
    }
  };

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 lg:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 uppercase tracking-widest">
              <Zap className="h-3.5 w-3.5 text-amber-500 animate-bounce" />
              The Next-Gen NFT Portfolio
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 leading-[1.1]">
              Explore and Showcase{' '}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Your Web3 NFTs
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Connect your MetaMask wallet instantly. Search, sort, filter, and organize all your digital collectibles across Ethereum, Polygon, and Base in a premium, fluid interface.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleCtaClick}
                disabled={isConnecting}
                className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base"
              >
                <Wallet className="h-5 w-5" />
                {account ? 'Go to Dashboard' : 'Connect MetaMask'}
              </button>
              {isAuthenticated && (
                <Link
                  to="/gallery"
                  className="btn-secondary w-full sm:w-auto px-8 py-3.5 text-base"
                >
                  <Compass className="h-5 w-5 text-violet-500" />
                  Explore NFT Gallery
                </Link>
              )}
            </div>
          </div>

          {/* Right Hero Cards Visual */}
          <div className="relative flex justify-center items-center">
            {/* Background glowing gradients */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl -z-10 animate-pulse" />
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl -z-10 translate-x-20 translate-y-10 animate-pulse" />

            <div className="relative w-72 h-96 sm:w-80 sm:h-[420px] rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-0.5 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 animate-float">
              <div className="w-full h-full bg-[#161C2A] rounded-[22px] overflow-hidden p-4 flex flex-col justify-between">
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=80"
                    alt="Hero NFT Visual"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">
                    Cybernetic Synapses
                  </p>
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-white text-lg truncate">
                      Neural Orb #8902
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      Polygon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-[32px] p-8 sm:p-12 border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
            
            <div className="pt-6 sm:pt-0">
              <span className="block text-4xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {stats.totalUsers || 18}+
              </span>
              <span className="block text-sm font-semibold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest">
                Active Collectors
              </span>
            </div>

            <div className="pt-8 sm:pt-0">
              <span className="block text-4xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {stats.totalNFTsViewed || 245}+
              </span>
              <span className="block text-sm font-semibold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest">
                NFT Views Recorded
              </span>
            </div>

            <div className="pt-8 sm:pt-0">
              <span className="block text-4xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {stats.totalFavorites || 42}+
              </span>
              <span className="block text-sm font-semibold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest">
                Saved Favorites
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            Core Web3 Capabilities
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Everything you need to fetch, view, filter, and track your NFTs across multiple major networks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="glass-card rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/50 hover:border-violet-500/30 dark:hover:border-violet-500/20 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-2xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Network className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              Cross-Chain Compatibility
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Read digital collections on Ethereum, Polygon, and Base. Detect chain-swapping instantly in MetaMask and sync state.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/50 hover:border-violet-500/30 dark:hover:border-violet-500/20 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-2xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              Cryptographic Signature Logins
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Ensure data security. Verify wallet addresses using decentralized signature challenge nonces backed by standard JWT auth.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/50 hover:border-violet-500/30 dark:hover:border-violet-500/20 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-2xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              Visitor Statistics & Aggregates
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              View custom dashboard metrics: total collections owned, favorites count, and trace system-wide trends in real time.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
