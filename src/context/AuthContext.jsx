import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { toast } from 'react-hot-toast';
import { useWeb3 } from './Web3Context';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { account, disconnectWallet } = useWeb3();
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync auth state when MetaMask wallet account changes
  useEffect(() => {
    if (account) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        fetchUserProfile(account);
      } else {
        login(account);
      }
    } else {
      setUser(null);
      setFavorites([]);
      setIsAuthenticated(false);
    }
  }, [account]);

  const fetchUserProfile = async (walletAddress) => {
    try {
      const response = await api.get(`/user/${walletAddress}`);
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Fetch favorites after profile is loaded
        await fetchFavorites(walletAddress);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        login(walletAddress);
      }
    }
  };

  const fetchFavorites = async (walletAddress) => {
    try {
      const response = await api.get(`/favorites/${walletAddress}`);
      if (response.data.success) {
        setFavorites(response.data.nfts);
      }
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };

  const login = async (walletAddress) => {
    if (!window.ethereum) return;
    setIsAuthenticating(true);
    const loadingToast = toast.loading('Authenticating via MetaMask...');

    try {
      const nonceResponse = await api.get(`/auth/nonce/${walletAddress}`);
      const { nonce, message } = nonceResponse.data;

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      const verifyResponse = await api.post('/auth/verify', {
        walletAddress,
        signature,
        message
      });

      if (verifyResponse.data.success) {
        const { token, user: authenticatedUser } = verifyResponse.data;
        localStorage.setItem('token', token);
        setUser(authenticatedUser);
        setIsAuthenticated(true);
        await fetchFavorites(walletAddress);
        toast.success('Authenticated successfully!', { id: loadingToast });
      }
    } catch (err) {
      console.error('Authentication failed:', err);
      toast.error(err.response?.data?.message || 'MetaMask signature request rejected', { id: loadingToast });
      disconnectWallet();
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setFavorites([]);
    setIsAuthenticated(false);
    disconnectWallet();
  };

  const updateProfile = async (username, avatar) => {
    try {
      const response = await api.put('/user/profile', { username, avatar });
      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Profile updated successfully!');
        return true;
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error(err.response?.data?.message || 'Profile update failed');
      return false;
    }
  };

  const toggleFavorite = async (nft) => {
    if (!isAuthenticated) {
      toast.error('Please connect and verify your wallet first');
      return;
    }

    const isFav = favorites.some((f) => f.nftId === nft.nftId);

    try {
      if (isFav) {
        // Remove from favorites
        const response = await api.delete(`/favorites/${nft.nftId}`);
        if (response.data.success) {
          setFavorites((prev) => prev.filter((f) => f.nftId !== nft.nftId));
          toast.success('Removed from favorites');
        }
      } else {
        // Add to favorites
        const response = await api.post('/favorites', {
          nftId: nft.nftId,
          contractAddress: nft.contractAddress,
          tokenId: nft.tokenId,
          name: nft.name,
          image: nft.image,
          description: nft.description,
          collectionName: nft.collectionName,
          network: nft.network
        });
        if (response.data.success || response.status === 210) {
          setFavorites((prev) => [response.data.data, ...prev]);
          toast.success('Added to favorites');
        }
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      toast.error(err.response?.data?.message || 'Failed to update favorites');
    }
  };

  const isFavorite = (nftId) => {
    return favorites.some((f) => f.nftId === nftId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        favorites,
        isAuthenticating,
        isAuthenticated,
        login: () => login(account),
        logout,
        updateProfile,
        toggleFavorite,
        isFavorite
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
