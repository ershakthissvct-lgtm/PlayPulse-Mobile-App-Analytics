import React, { useState } from 'react';
import { RatingBin } from '../types/app';
import { Star, Info } from 'lucide-react';

interface RatingDistributionChartProps {
  bins: RatingBin[];
  granularBins: { rating: number; count: number; label: string }[];
  meanRating: number;
  medianRating: number;
  totalRated: number;
}

export const RatingDistributionChart: React.FC<RatingDistributionChartProps> = ({
  bins,
  granularBins,
  meanRating,
  medianRating,
  totalRated,
}) => {
  const [viewMode, setViewMode] = useState<'standard' | 'granular'>('standard');
  const [hoveredBin, setHoveredBin] = useState<string | null>(null);

  const maxCountStandard = Math.max(...bins.map(b => b.count), 1);
  const maxCountGranular = Math.max(...granularBins.map(b => b.count), 1);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Rating Distribution Frequency
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Observing left-skewed concentration: most Google Play Store apps cluster between 4.1 and 4.7
          </p>
        </div>

        {/* Granularity switch */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setViewMode('standard')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'standard'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Tier Bins
          </button>
          <button
            onClick={() => setViewMode('granular')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'granular'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            0.2 Step Curve
          </button>
        </div>
      </div>

      {viewMode === 'standard' ? (
        <div className="space-y-3">
          {bins.map(bin => {
            const widthPct = ((bin.count / maxCountStandard) * 100).toFixed(1);
            const isTopBin = bin.bin.startsWith('4.0') || bin.bin.startsWith('4.5');
            const isHovered = hoveredBin === bin.bin;

            return (
              <div
                key={bin.bin}
                onMouseEnter={() => setHoveredBin(bin.bin)}
                onMouseLeave={() => setHoveredBin(null)}
                className={`group p-2 rounded-lg transition-colors ${
                  isHovered ? 'bg-slate-50 dark:bg-slate-800/60' : ''
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-slate-700 dark:text-slate-300 font-mono">
                      {bin.bin} ★
                    </span>
                    <span className="text-slate-400 font-normal text-[11px]">
                      {bin.count} apps
                    </span>
                  </div>
                  <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                    {bin.percentage}%
                  </span>
                </div>

                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${widthPct}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      bin.min >= 4.5
                        ? 'bg-indigo-600 dark:bg-indigo-500'
                        : bin.min >= 4.0
                        ? 'bg-blue-500 dark:bg-blue-400'
                        : bin.min >= 3.0
                        ? 'bg-amber-500 dark:bg-amber-400'
                        : 'bg-rose-500 dark:bg-rose-400'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Granular SVG Bar Chart */
        <div className="pt-4 pb-2">
          <div className="h-56 relative flex items-end justify-between gap-1 border-b border-slate-200 dark:border-slate-800 px-2">
            {granularBins.map(item => {
              const heightPct = Math.max((item.count / maxCountGranular) * 100, 2);
              const isPeak = item.count === maxCountGranular;
              return (
                <div
                  key={item.label}
                  className="flex-1 flex flex-col items-center group relative h-full justify-end"
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-10 z-20 bg-slate-900 text-white text-[11px] py-1 px-2 rounded shadow-md whitespace-nowrap transition-opacity">
                    ★ {item.label}: {item.count} apps ({((item.count / totalRated) * 100).toFixed(1)}%)
                  </div>

                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[24px] rounded-t transition-all duration-300 ${
                      item.rating >= 4.0
                        ? 'bg-indigo-600 dark:bg-indigo-500 group-hover:bg-indigo-400'
                        : item.rating >= 3.0
                        ? 'bg-amber-500 dark:bg-amber-400 group-hover:bg-amber-300'
                        : 'bg-rose-500 dark:bg-rose-400 group-hover:bg-rose-300'
                    } ${isPeak ? 'ring-2 ring-indigo-400' : ''}`}
                  />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
                    {item.rating % 1 === 0 ? item.rating.toFixed(1) : ''}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-4 px-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                <span>Poor (&lt; 3.0)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                <span>Average (3.0 - 3.9)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" />
                <span>Strong (4.0 - 5.0)</span>
              </div>
            </div>

            <div className="font-mono text-xs">
              Mean: <span className="font-semibold text-slate-900 dark:text-white">{meanRating}</span> · Median: <span className="font-semibold text-slate-900 dark:text-white">{medianRating}</span>
            </div>
          </div>
        </div>
      )}

      {/* Analytical Callout */}
      <div className="mt-5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong className="text-slate-900 dark:text-slate-200 font-medium">Asymmetry Insight:</strong> Ratings on mobile stores are severely negative-skewed. Over <strong>76%</strong> of rated apps hold a score of 4.0 or higher. A 4.0 is considered average, and falling below 3.8 severely impairs organic discovery and algorithmic recommendation.
        </div>
      </div>
    </div>
  );
};
