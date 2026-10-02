import React, { useState } from 'react';
import { MobileApp, CategoryStat } from '../types/app';
import { X, Star, MessageSquare, DownloadCloud, DollarSign, Search, ExternalLink } from 'lucide-react';

interface CategoryDetailModalProps {
  category: string | null;
  categoryStat?: CategoryStat;
  apps: MobileApp[];
  onClose: () => void;
  onSelectApp: (app: MobileApp) => void;
}

export const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
  category,
  categoryStat,
  apps,
  onClose,
  onSelectApp,
}) => {
  const [search, setSearch] = useState('');

  if (!category) return null;

  const categoryApps = apps.filter(a => a.category === category);
  const filteredApps = categoryApps.filter(a =>
    a.app.toLowerCase().includes(search.toLowerCase())
  );

  const ratedApps = categoryApps.filter(a => a.rating !== null);
  const sortedByRating = [...ratedApps].sort((a, b) => (b.rating as number) - (a.rating as number));
  const topApp = sortedByRating[0];
  const lowestApp = sortedByRating[sortedByRating.length - 1];

  const formatCompact = (num: number): string => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase mb-1">
              Category Deep-Dive
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {category.replace(/_/g, ' ')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {categoryApps.length} apps cataloged · {categoryStat?.ratedCount || ratedApps.length} rated
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category KPIs */}
        <div className="grid grid-cols-4 gap-2.5 p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">Avg Rating</span>
            <div className="font-mono text-base font-bold text-amber-500 flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{categoryStat?.avgRating.toFixed(2) || 'N/A'}</span>
            </div>
          </div>

          <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">Total Reviews</span>
            <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {formatCompact(categoryStat?.totalReviews || 0)}
            </div>
          </div>

          <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">Est. Installs</span>
            <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {formatCompact(categoryStat?.totalInstalls || 0)}
            </div>
          </div>

          <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">Paid Ratio</span>
            <div className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {categoryStat ? `${(categoryStat.paidRatio * 100).toFixed(0)}%` : '0%'}
            </div>
          </div>
        </div>

        {/* Highlights */}
        {topApp && (
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Top Rated:</span>
              <button
                onClick={() => onSelectApp(topApp)}
                className="font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 underline flex items-center gap-1 truncate max-w-[220px]"
              >
                {topApp.app} (★{topApp.rating})
              </button>
            </div>
            {lowestApp && lowestApp.id !== topApp.id && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Lowest Rated:</span>
                <button
                  onClick={() => onSelectApp(lowestApp)}
                  className="font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 underline flex items-center gap-1 truncate max-w-[220px]"
                >
                  {lowestApp.app} (★{lowestApp.rating})
                </button>
              </div>
            )}
          </div>
        )}

        {/* Search Input */}
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${categoryApps.length} apps in this category...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Apps List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1.5">
          {filteredApps.map(app => (
            <div
              key={app.id}
              onClick={() => onSelectApp(app)}
              className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors flex items-center justify-between text-xs"
            >
              <div className="truncate pr-3">
                <div className="font-semibold text-slate-900 dark:text-white truncate">{app.app}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>{app.installs} installs</span>
                  <span aria-hidden="true">·</span>
                  <span>{app.reviews.toLocaleString()} reviews</span>
                  <span aria-hidden="true">·</span>
                  <span>{app.size}</span>
                </div>
              </div>

              <div className="text-right shrink-0 font-mono">
                <div className="flex items-center justify-end gap-1 font-bold text-slate-900 dark:text-white">
                  {app.rating ? (
                    <>
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{app.rating.toFixed(1)}</span>
                    </>
                  ) : (
                    <span className="text-slate-400 text-xs">Unrated</span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  {app.type === 'Paid' ? app.priceRaw : 'Free'}
                </span>
              </div>
            </div>
          ))}

          {filteredApps.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No apps matched "{search}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
