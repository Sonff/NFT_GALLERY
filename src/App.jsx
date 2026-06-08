import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import NftDetails from './pages/NftDetails';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Global Navigation header */}
        <Navbar />
        
        {/* Main interactive screen grid */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:network/:contractAddress/:tokenId" element={<NftDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            {/* Fallback routing redirects to home page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Persistent footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
