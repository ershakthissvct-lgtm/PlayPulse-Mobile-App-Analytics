import React from 'react';
import { MobileApp } from '../types/app';
import { X, Star, MessageSquare, DownloadCloud, DollarSign, Calendar, Shield, HardDrive, Smartphone } from 'lucide-react';

interface AppDetailModalProps {
  app: MobileApp | null;
  onClose: () => void;
  categoryAvg?: number;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({ app, onClose, categoryAvg }) => {
  if (!app) return null;

  const deltaFromCategory = app.rating && categoryAvg ? +(app.rating - categoryAvg).toFixed(2) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase mb-1">
              {app.category.replace(/_/g, ' ')}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {app.app}
            </h3>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>Genres: {app.genres}</span>
              <span aria-hidden="true">·</span>
              <span>Updated: {app.lastUpdated}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rating Hero */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Store Rating</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                {app.rating ? `★ ${app.rating.toFixed(1)}` : 'Unrated'}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 5.0</span>
            </div>
          </div>

          {deltaFromCategory !== null && (
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">vs Category Avg</span>
              <span className={`text-xs font-mono font-bold ${deltaFromCategory >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {deltaFromCategory >= 0 ? `+${deltaFromCategory}` : deltaFromCategory} pts
              </span>
            </div>
          )}
        </div>

        {/* Specs Matrix */}
        <div className="grid grid-cols-2 gap-3 p-5 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
              <span>Reviews</span>
            </div>
            <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              {app.reviews.toLocaleString()}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <DownloadCloud className="w-3.5 h-3.5 text-cyan-500" />
              <span>Installs</span>
            </div>
            <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              {app.installs}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span>Price</span>
            </div>
            <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              {app.type === 'Paid' ? `${app.priceRaw} (Paid)` : 'Free'}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <HardDrive className="w-3.5 h-3.5 text-amber-500" />
              <span>Size</span>
            </div>
            <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              {app.size}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Shield className="w-3.5 h-3.5 text-violet-500" />
              <span>Content Rating</span>
            </div>
            <div className="font-medium text-slate-900 dark:text-white text-sm truncate">
              {app.contentRating}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Smartphone className="w-3.5 h-3.5 text-rose-500" />
              <span>Android Ver</span>
            </div>
            <div className="font-medium text-slate-900 dark:text-white text-sm truncate">
              {app.androidVer || 'Varies with device'}
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
