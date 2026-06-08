import React from 'react';
import { Compass, Github, Twitter, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-dark-bg/50 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white">
                <Compass className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                NFT Gallery
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              Discover, organize, and showcase your digital collectibles on Ethereum, Polygon, and Base. Connect your wallet to unlock your customized portfolio dashboard.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Supported Networks
            </h3>
            <ul className="space-y-2">
              {['Ethereum Mainnet', 'Polygon Network', 'Base Chain', 'Sepolia Testnet'].map((net) => (
                <li key={net} className="text-sm text-slate-500 dark:text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors">
                  {net}
                </li>
              ))}
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://metamask.io" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-amber-500 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
              Portfolio Project for BCA/MCA showcase. Made with Tailwind & React.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} NFT Gallery. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
