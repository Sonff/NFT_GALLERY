import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { User, Calendar, Award, Heart, Layers, Eye } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
  const { account } = useWeb3();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    favoritesCount: 0,
    totalNFTs: 0,
    totalCollections: 0,
    viewsCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!account) return;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/user/${account}`);
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (err) {
        console.error('Failed to load profile stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [account]);

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fadeIn">
        <div className="h-16 w-16 rounded-2xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6">
          <User className="h-8 w-8 animate-bounce" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
          Connect Your Wallet to View Profile
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
          Unlock your custom collector statistics and profile options by connecting your MetaMask wallet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
      {/* Header banner */}
      <div className="glass-card rounded-[32px] p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-lg">
          {user?.username ? user.username[0].toUpperCase() : 'U'}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">
            {user?.username || 'Web3 Collector'}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 dark:text-slate-400 font-semibold">
            <span className="font-mono text-slate-600 dark:text-slate-300">
              {account}
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="flex items-center gap-1.5 justify-center sm:justify-start">
              <Calendar className="h-4 w-4 text-violet-500" />
              Member since {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'Today'}
            </span>
          </div>
        </div>
      </div>

      {/* Numerical Stats Segment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat Item 1 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-black text-slate-800 dark:text-white">
              {isLoading ? '...' : stats.totalNFTs}
            </span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Total NFTs Owned
            </span>
          </div>
        </div>

        {/* Stat Item 2 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-black text-slate-800 dark:text-white">
              {isLoading ? '...' : stats.totalCollections}
            </span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Collections Sync
            </span>
          </div>
        </div>

        {/* Stat Item 3 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <div>
            <span className="block text-2xl font-black text-slate-800 dark:text-white">
              {isLoading ? '...' : stats.favoritesCount}
            </span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Favorite NFTs Saved
            </span>
          </div>
        </div>

        {/* Stat Item 4 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-black text-slate-800 dark:text-white">
              {isLoading ? '...' : stats.viewsCount}
            </span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Profile Views count
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
