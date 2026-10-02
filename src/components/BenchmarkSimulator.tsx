import React, { useState } from 'react';
import { MobileApp, CategoryStat } from '../types/app';
import { Sparkles, ArrowRight, CheckCircle, AlertCircle, TrendingUp, HelpCircle } from 'lucide-react';

interface BenchmarkSimulatorProps {
  categories: CategoryStat[];
  allApps: MobileApp[];
  globalMean: number;
}

export const BenchmarkSimulator: React.FC<BenchmarkSimulatorProps> = ({
  categories,
  allApps,
  globalMean,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.category || 'GAME');
  const [priceType, setPriceType] = useState<'Free' | 'Paid'>('Free');
  const [priceValue, setPriceValue] = useState<number>(2.99);
  const [sizeMb, setSizeMb] = useState<number>(25);
  const [targetInstalls, setTargetInstalls] = useState<number>(100000);
  const [userRating, setUserRating] = useState<number>(4.4);

  // Filter apps matching category
  const categoryApps = allApps.filter(a => a.category === selectedCategory);
  const ratedCategoryApps = categoryApps.filter(a => a.rating !== null);
  const ratings = ratedCategoryApps.map(a => a.rating as number).sort((a, b) => a - b);

  // Compute quartiles
  const p25 = ratings.length > 0 ? ratings[Math.floor(ratings.length * 0.25)] : 4.0;
  const p50 = ratings.length > 0 ? ratings[Math.floor(ratings.length * 0.50)] : 4.3;
  const p75 = ratings.length > 0 ? ratings[Math.floor(ratings.length * 0.75)] : 4.6;
  const p90 = ratings.length > 0 ? ratings[Math.floor(ratings.length * 0.90)] : 4.7;

  // Percentile calculation for user rating
  const belowCount = ratings.filter(r => r < userRating).length;
  const percentile = ratings.length > 0 ? Math.round((belowCount / ratings.length) * 100) : 50;

  // Rating health verdict
  let statusColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
  let statusText = 'Top Tier Competitive';
  if (userRating < p25) {
    statusColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
    statusText = 'High Risk of Churn';
  } else if (userRating < p50) {
    statusColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    statusText = 'Below Category Median';
  } else if (userRating < p75) {
    statusColor = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800';
    statusText = 'Healthy & Competitive';
  }

  const currentCatStat = categories.find(c => c.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            App Rating Simulator & Peer Positioning Engine
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Model your app's projected score against {ratings.length} real competitors in {selectedCategory.replace(/_/g, ' ')}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              App Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map(c => (
                <option key={c.category} value={c.category}>
                  {c.category.replace(/_/g, ' ')} ({c.appCount} apps · avg ★{c.avgRating})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Pricing Model
              </label>
              <div className="flex rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setPriceType('Free')}
                  className={`flex-1 py-1.5 text-xs font-medium text-center transition-colors ${
                    priceType === 'Free'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Free
                </button>
                <button
                  type="button"
                  onClick={() => setPriceType('Paid')}
                  className={`flex-1 py-1.5 text-xs font-medium text-center transition-colors ${
                    priceType === 'Paid'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Paid
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                APK Size (MB)
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={sizeMb}
                onChange={e => setSizeMb(Math.max(1, Number(e.target.value)))}
                className="w-full text-xs font-mono px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {priceType === 'Paid' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                App Price ($ USD)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.49"
                max="399.99"
                value={priceValue}
                onChange={e => setPriceValue(Math.max(0.49, Number(e.target.value)))}
                className="w-full text-xs font-mono px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200"
              />
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Simulated Rating Target
              </label>
              <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">
                ★ {userRating.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={userRating}
              onChange={e => setUserRating(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* Results & Intelligence Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Header Verdict Card */}
          <div className={`p-4 rounded-xl border ${statusColor} transition-all`}>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold">
                Peer Standing Verdict
              </span>
              <span className="text-xs font-mono font-bold">
                {percentile}th Percentile
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold mt-1">
              {statusText}
            </div>
            <p className="text-xs opacity-90 mt-1">
              A rating of <strong>★ {userRating.toFixed(1)}</strong> places your app above <strong>{percentile}%</strong> of all apps in {selectedCategory.replace(/_/g, ' ')}.
            </p>
          </div>

          {/* Benchmark Distribution Markers */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center justify-between">
              <span>Category Benchmark Milestones</span>
              <span className="text-slate-400 font-normal text-[11px] font-mono">
                Median: ★ {p50}
              </span>
            </div>

            <div className="relative pt-6 pb-2">
              {/* Range bar */}
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
                <div
                  style={{ width: `${(p50 / 5) * 100}%` }}
                  className="h-full bg-slate-200 dark:bg-slate-700"
                />
              </div>

              {/* Marker for current user rating */}
              <div
                style={{ left: `${Math.min(Math.max((userRating / 5) * 100, 2), 98)}%` }}
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-10"
              >
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded shadow-xs border border-indigo-200 dark:border-indigo-800 whitespace-nowrap">
                  You: ★{userRating.toFixed(1)}
                </span>
                <div className="w-2 h-2 rotate-45 bg-indigo-600 -mt-1" />
              </div>

              {/* Milestone ticks */}
              <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-2">
                <span>Bottom 25%: ★{p25}</span>
                <span>Median (50%): ★{p50}</span>
                <span>Top 25%: ★{p75}</span>
                <span>Top 10%: ★{p90}</span>
              </div>
            </div>
          </div>

          {/* Category-Specific Advisory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 text-[11px] block">Category Average</span>
              <strong className="text-slate-900 dark:text-white font-mono text-sm">
                ★ {currentCatStat?.avgRating || globalMean}
              </strong>
              <p className="text-[11px] text-slate-500 mt-1">
                Total category reviews: {currentCatStat?.totalReviews.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 text-[11px] block">Category Paid Ratio</span>
              <strong className="text-slate-900 dark:text-white font-mono text-sm">
                {currentCatStat ? (currentCatStat.paidRatio * 100).toFixed(1) : 0}% Paid
              </strong>
              <p className="text-[11px] text-slate-500 mt-1">
                Avg paid price in category: ${currentCatStat?.avgPrice || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
