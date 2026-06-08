import React from 'react';
import { Wallet, LogOut, Loader2, Key } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useAuth } from '../context/AuthContext';

const WalletConnect = () => {
  const { account, networkName, isConnecting, connectWallet } = useWeb3();
  const { isAuthenticating, isAuthenticated, logout } = useAuth();

  // Helper to format wallet address
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (account) {
    return (
      <div className="flex items-center gap-3">
        {/* Network Badge */}
        <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
          {networkName}
        </div>

        {/* Shortened Address */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono text-sm font-semibold">
          <Wallet className="h-4 w-4 text-violet-500" />
          {formatAddress(account)}
          {isAuthenticating && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
          )}
          {!isAuthenticating && !isAuthenticated && (
            <Key className="h-3.5 w-3.5 text-amber-500" title="Signature Required" />
          )}
        </div>

        {/* Disconnect Button */}
        <button
          onClick={logout}
          className="p-2.5 rounded-xl border border-rose-200 hover:border-rose-300 dark:border-rose-950/40 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 transition-all duration-300 transform active:scale-95 flex items-center justify-center"
          title="Disconnect Wallet"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="btn-primary"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </>
      )}
    </button>
  );
};

export default WalletConnect;
