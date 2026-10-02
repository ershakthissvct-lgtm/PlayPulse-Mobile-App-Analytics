import React, { useState } from 'react';
import { CategoryStat } from '../types/app';
import { Star, ArrowUpDown, ChevronRight, Layers } from 'lucide-react';

interface CategoryRankingsChartProps {
  categories: CategoryStat[];
  onSelectCategory: (category: string) => void;
  globalMean: number;
}

type SortField = 'avgRating' | 'appCount' | 'totalReviews' | 'totalInstalls' | 'paidRatio';

export const CategoryRankingsChart: React.FC<CategoryRankingsChartProps> = ({
  categories,
  onSelectCategory,
  globalMean,
}) => {
  const [sortField, setSortField] = useState<SortField>('avgRating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterMinApps, setFilterMinApps] = useState<number>(1);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filtered = categories.filter(c => c.appCount >= filterMinApps);

  const sortedCategories = [...filtered].sort((a, b) => {
    const factor = sortOrder === 'desc' ? -1 : 1;
    return (a[sortField] - b[sortField]) * factor;
  });

  const maxCategoryRating = Math.max(...categories.map(c => c.avgRating), 5);
  const minCategoryRating = Math.min(...categories.map(c => c.avgRating), 3);

  const formatCompact = (num: number): string => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Category Rating Benchmarks & Competitiveness
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ranked category performance against the market mean of <span className="font-mono font-medium text-slate-900 dark:text-slate-200">{globalMean}</span>
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Sort By:</span>
          {[
            { key: 'avgRating', label: 'Rating' },
            { key: 'appCount', label: 'App Count' },
            { key: 'totalReviews', label: 'Reviews' },
            { key: 'totalInstalls', label: 'Installs' },
            { key: 'paidRatio', label: 'Paid %' },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => handleSort(opt.key as SortField)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                sortField === opt.key
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{opt.label}</span>
              {sortField === opt.key && (
                <span className="text-[10px]">{sortOrder === 'desc' ? '↓' : '↑'}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Category Benchmark Bars */}
      <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
        {sortedCategories.map(cat => {
          // Normalize bar length between 0% and 100% relative to 5.0
          const barWidth = ((cat.avgRating / 5.0) * 100).toFixed(1);
          const isAboveAverage = cat.avgRating >= globalMean;

          return (
            <div
              key={cat.category}
              onClick={() => onSelectCategory(cat.category)}
              className="group p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                    {cat.appCount} apps · {formatCompact(cat.totalInstalls)} installs
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-500 text-[11px]">
                    {formatCompact(cat.totalReviews)} rev
                  </span>
                  <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white tabular-nums">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{cat.avgRating.toFixed(2)}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                {/* Mean marker */}
                <div
                  style={{ left: `${(globalMean / 5.0) * 100}%` }}
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-500 z-10"
                  title={`Global Mean: ${globalMean}`}
                />
                <div
                  style={{ width: `${barWidth}%` }}
                  className={`h-full rounded-full transition-all duration-300 ${
                    cat.avgRating >= 4.4
                      ? 'bg-indigo-600 dark:bg-indigo-500'
                      : cat.avgRating >= 4.1
                      ? 'bg-blue-500 dark:bg-blue-400'
                      : cat.avgRating >= 3.8
                      ? 'bg-amber-500 dark:bg-amber-400'
                      : 'bg-rose-500 dark:bg-rose-400'
                  }`}
                />
              </div>

              {/* Top performer teaser */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                <span className="truncate max-w-[280px] sm:max-w-md">
                  Leader: <span className="text-slate-600 dark:text-slate-400">{cat.topRatedApp}</span>
                </span>
                <span>
                  {cat.paidCount > 0 ? `${(cat.paidRatio * 100).toFixed(0)}% paid` : '100% free'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
