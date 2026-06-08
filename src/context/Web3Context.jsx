import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { toast } from 'react-hot-toast';

const Web3Context = createContext();

const CHAIN_MAP = {
  '0x1': { name: 'Ethereum', slug: 'ethereum' },
  '0xaa36a7': { name: 'Sepolia', slug: 'ethereum' }, // Treat Sepolia as Ethereum for mock NFT ease
  '0x89': { name: 'Polygon', slug: 'polygon' },
  '0x13882': { name: 'Polygon Amoy', slug: 'polygon' },
  '0x2105': { name: 'Base', slug: 'base' },
  '0x14a34': { name: 'Base Sepolia', slug: 'base' }
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [networkName, setNetworkName] = useState('');
  const [networkSlug, setNetworkSlug] = useState('ethereum'); // Backend expects ethereum, polygon, base
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  // Check if MetaMask is available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setHasMetaMask(true);
      // Auto-connect if already authorized
      checkAlreadyConnected();
    }
  }, []);

  // Listen for MetaMask changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0].toLowerCase());
        toast.success('Wallet account changed!');
      } else {
        setAccount(null);
        setChainId(null);
        setNetworkName('');
        toast.error('Wallet disconnected!');
      }
    };

    const handleChainChanged = (hexChainId) => {
      setChainId(hexChainId);
      const netInfo = resolveNetwork(hexChainId);
      setNetworkName(netInfo.name);
      setNetworkSlug(netInfo.slug);
      toast.success(`Network changed to ${netInfo.name}`);
      // Reload is a safe standard practice in Web3 dApps to clear cache
      setTimeout(() => window.location.reload(), 1000);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  const resolveNetwork = (hexChainId) => {
    if (!hexChainId) return { name: 'Ethereum', slug: 'ethereum' };
    const net = CHAIN_MAP[hexChainId.toLowerCase()];
    if (net) return net;
    
    // Fallback based on decimals
    const decId = parseInt(hexChainId, 16);
    if (decId === 1 || decId === 11155111) return { name: 'Ethereum', slug: 'ethereum' };
    if (decId === 137) return { name: 'Polygon', slug: 'polygon' };
    if (decId === 8453) return { name: 'Base', slug: 'base' };
    
    return { name: `Unknown (Chain ${decId})`, slug: 'ethereum' };
  };

  const checkAlreadyConnected = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_accounts', []);
      if (accounts.length > 0) {
        const network = await provider.getNetwork();
        const hexChain = '0x' + network.chainId.toString(16);
        const netInfo = resolveNetwork(hexChain);
        
        setAccount(accounts[0].toLowerCase());
        setChainId(hexChain);
        setNetworkName(netInfo.name);
        setNetworkSlug(netInfo.slug);
      }
    } catch (err) {
      console.error('Error checking auto-connection:', err);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask is not installed. Please install MetaMask to use this application.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();
      const hexChain = '0x' + network.chainId.toString(16);
      const netInfo = resolveNetwork(hexChain);

      setAccount(accounts[0].toLowerCase());
      setChainId(hexChain);
      setNetworkName(netInfo.name);
      setNetworkSlug(netInfo.slug);
      toast.success('Wallet connected successfully!');
    } catch (err) {
      console.error('Connection failed:', err);
      toast.error(err.message || 'MetaMask connection rejected');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setNetworkName('');
    setNetworkSlug('ethereum');
    localStorage.removeItem('token'); // Clear backend session token
    toast.info('Wallet disconnected');
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        chainId,
        networkName,
        networkSlug,
        isConnecting,
        hasMetaMask,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
