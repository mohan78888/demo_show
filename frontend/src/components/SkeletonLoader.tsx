import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 animate-pulse bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header Skeleton */}
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-8"></div>
      
      {/* Content Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-slate-100 dark:bg-slate-900 rounded-2xl h-64 p-6 flex flex-col justify-between border border-transparent dark:border-slate-800">
            <div>
              <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
