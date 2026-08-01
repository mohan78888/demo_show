"use client";

import React from 'react';

export default function LoadingHotelsPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white font-sans animate-pulse">
      {/* 1. HERO SKELETON */}
      <div className="bg-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <div className="h-8 sm:h-10 bg-slate-800 rounded-xl w-3/4 mx-auto animate-pulse"></div>
          <div className="h-4 bg-slate-800/60 rounded-lg w-1/2 mx-auto animate-pulse"></div>

          {/* SEARCH CARD SKELETON */}
          <div className="mt-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex gap-2">
              <div className="h-7 w-20 bg-slate-800 rounded-lg"></div>
              <div className="h-7 w-20 bg-slate-800 rounded-lg"></div>
              <div className="h-7 w-20 bg-slate-800 rounded-lg"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4 h-14 bg-slate-800 rounded-xl"></div>
              <div className="md:col-span-3 h-14 bg-slate-800 rounded-xl"></div>
              <div className="md:col-span-3 h-14 bg-slate-800 rounded-xl"></div>
              <div className="md:col-span-2 h-14 bg-blue-700/60 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. VALUE PROPOSITION BAR SKELETON */}
      <div className="py-8 border-b border-slate-100 dark:border-slate-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
              <div className="space-y-2 w-full">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800/60 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TOP HOTELS CAROUSEL SKELETON */}
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-2">
          <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800/60 rounded-lg w-2/5"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl h-64 p-3 flex flex-col justify-between">
              <div className="bg-slate-200 dark:bg-slate-800 rounded-xl h-40 w-full"></div>
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800/60 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
