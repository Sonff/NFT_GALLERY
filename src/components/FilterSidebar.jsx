import React from 'react';
import { Filter, RotateCcw, Layers, Network } from 'lucide-react';

const FilterSidebar = ({
  selectedNetwork,
  setSelectedNetwork,
  selectedCollection,
  setSelectedCollection,
  collections = [],
  onClearAll
}) => {
  const networks = [
    { id: 'all', name: 'All Networks 🌐' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'polygon', name: 'Polygon' },
    { id: 'base', name: 'Base Network' },
    { id: 'bnb', name: 'BNB Chain' }
  ];

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60 sticky top-28 space-y-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
          <Filter className="h-5 w-5 text-violet-500" />
          <h2>Filters</h2>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset All
        </button>
      </div>

      {/* Network Filter */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Network className="h-3.5 w-3.5" />
          Blockchain Network
        </h3>
        <div className="flex flex-col gap-2">
          {networks.map((net) => {
            const isSelected = selectedNetwork === net.id;
            return (
              <button
                key={net.id}
                onClick={() => setSelectedNetwork(net.id)}
                className={`w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold transition-all duration-300 border ${
                  isSelected
                    ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-500/15'
                    : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {net.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Collection Filter */}
      <div className="space-y-3 flex-grow flex flex-col">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5" />
          Collections
        </h3>
        <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCollection('')}
            className={`w-full px-4 py-2 rounded-xl text-left text-sm font-semibold transition-all duration-200 shrink-0 ${
              selectedCollection === ''
                ? 'bg-slate-200/60 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            All Collections
          </button>
          
          {collections.map((colName) => {
            const isSelected = selectedCollection === colName;
            return (
              <button
                key={colName}
                onClick={() => setSelectedCollection(colName)}
                className={`w-full px-4 py-2 rounded-xl text-left text-sm font-semibold transition-all duration-200 truncate shrink-0 ${
                  isSelected
                    ? 'bg-slate-200/60 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
                title={colName}
              >
                {colName}
              </button>
            );
          })}
          
          {collections.length === 0 && (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic pl-4 py-2">
              No collections found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
