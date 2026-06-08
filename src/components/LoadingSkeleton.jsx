import React from 'react';

const CardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-pulse">
      {/* Image aspect ratio placeholder */}
      <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800" />
      {/* Card Details */}
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
