import React from 'react';
import { Star, MessageSquare, DownloadCloud, DollarSign, Award, HelpCircle } from 'lucide-react';
import { GlobalAnalysis } from '../utils/analytics';

interface MetricCardsProps {
  analysis: GlobalAnalysis;
  onSelectCategory?: (category: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ analysis, onSelectCategory }) => {
  const formatCompact = (num: number): string => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* 1. Mean Rating */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Average Rating</span>
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
              {analysis.meanRating}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <span>Median: <strong className="font-mono text-slate-700 dark:text-slate-300">{analysis.medianRating}</strong></span>
            <span aria-hidden="true">·</span>
            <span>σ = {analysis.ratingStdDev}</span>
          </div>
        </div>
      </div>

      {/* 2. Weighted Rating */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Weighted Mean</span>
          <Award className="w-4 h-4 text-indigo-500" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-indigo-600 dark:text-indigo-400 tabular-nums">
              {analysis.weightedRating}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Log-weighted by review count
          </div>
        </div>
      </div>

      {/* 3. Total Reviews */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Total Reviews</span>
          <MessageSquare className="w-4 h-4 text-emerald-500" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
            {formatCompact(analysis.totalReviews)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            ~{formatCompact(analysis.avgReviewsPerApp)} reviews / app
          </div>
        </div>
      </div>

      {/* 4. Est. Installs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Est. Installs</span>
          <DownloadCloud className="w-4 h-4 text-cyan-500" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
            {formatCompact(analysis.totalEstimatedInstalls)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across {analysis.totalApps} cataloged apps
          </div>
        </div>
      </div>

      {/* 5. Free vs Paid Delta */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Paid vs Free</span>
          <DollarSign className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              Free: <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">{analysis.freeAvgRating}</span>
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              Paid: <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400 font-bold">{analysis.paidAvgRating}</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {analysis.paidAppsCount} paid ({((analysis.paidAppsCount / analysis.totalApps) * 100).toFixed(1)}%)
          </div>
        </div>
      </div>

      {/* 6. Unrated / Quality Gap */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Coverage Rate</span>
          <HelpCircle className="w-4 h-4 text-violet-500" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
            {((analysis.ratedAppsCount / analysis.totalApps) * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {analysis.unratedAppsCount} apps unrated (NaN)
          </div>
        </div>
      </div>
    </div>
  );
};
