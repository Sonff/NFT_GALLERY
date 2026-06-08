import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useAuth } from '../context/AuthContext';
import { Copy, Check, ExternalLink, Calendar, Layers, Shield, Heart, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Dashboard = () => {
  const { account, networkName } = useWeb3();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    favoritesCount: 0,
    totalNFTs: 0,
    totalCollections: 0,
    viewsCount: 0,
    lastVisit: null
  });
  
  const [copied, setCopied] = useState(false);
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
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [account]);

  const copyAddress = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    toast.success('Wallet address copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getEtherscanLink = (addr) => {
    return `https://etherscan.io/address/${addr}`;
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
          <Shield className="h-8 w-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
          Wallet Connection Required
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
          Please connect your MetaMask wallet in the navigation bar to access your personal dashboard.
        </p>
      </div>
    );
  }

  // Format activity date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate activities based on stats
  const recentActivities = [
    { id: 1, type: 'Wallet Connection', desc: 'Successfully connected MetaMask', date: new Date() },
    { id: 2, type: 'Auth Challenge', desc: 'Completed cryptographic signature challenge', date: new Date() },
    ...(stats.totalNFTs > 0 ? [
      { id: 3, type: 'Sync Assets', desc: `Synced ${stats.totalNFTs} NFTs from Alchemy API`, date: stats.lastVisit }
    ] : []),
    ...(stats.favoritesCount > 0 ? [
      { id: 4, type: 'Favorites Updated', desc: `You have ${stats.favoritesCount} favorited NFTs`, date: new Date() }
    ] : [])
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Card */}
      <div className="glass-card rounded-[32px] p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tr from-violet-600/10 to-indigo-600/10 dark:from-violet-500/5 dark:to-indigo-500/5 blur-3xl -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              Welcome back,{' '}
              <span className="text-violet-600 dark:text-violet-400">
                {user?.username || `Web3User_${account.slice(2, 8)}`}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Manage your connected wallets and explore your cross-chain digital assets.
            </p>
          </div>
          
          {/* Wallet detail badge */}
          <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl md:min-w-[320px]">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Connected Address</span>
              <span className="text-emerald-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                {networkName}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
                {account.slice(0, 8)}...{account.slice(-8)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={copyAddress}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-500 transition-colors"
                  title="Copy Address"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
                <a
                  href={getEtherscanLink(account)}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-500 transition-colors"
                  title="View on Etherscan"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-800 dark:text-white">
              {isLoading ? '...' : stats.totalNFTs}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              Total NFTs Owned
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-800 dark:text-white">
              {isLoading ? '...' : stats.totalCollections}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              Total Collections
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-800 dark:text-white">
              {isLoading ? '...' : stats.favoritesCount}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              Favorite NFTs Count
            </span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-800 dark:text-white">
              {isLoading ? '...' : stats.viewsCount}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              Total Sync Views
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left side details, Right side activity log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card & Platform info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
              Collector Profile
            </h3>
            
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {user?.username ? user.username[0].toUpperCase() : 'U'}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">
                  {user?.username || 'Unnamed User'}
                </h4>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3 w-3" />
                  Joined {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'Today'}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Account Status:</span>
                <span className="text-emerald-500 font-bold">Verified (Web3 Signature)</span>
              </div>
              <div className="flex justify-between">
                <span>Default Network:</span>
                <span className="font-semibold">{networkName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
              Recent Activity
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/60 text-xs text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                    <th className="pb-3">Action Type</th>
                    <th className="pb-3">Details</th>
                    <th className="pb-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
                  {recentActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 font-bold text-slate-800 dark:text-slate-200">
                        {act.type}
                      </td>
                      <td className="py-4 text-slate-500 dark:text-slate-400">
                        {act.desc}
                      </td>
                      <td className="py-4 text-right text-xs text-slate-400 font-mono">
                        {formatDate(act.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
