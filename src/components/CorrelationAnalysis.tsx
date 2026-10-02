import React from 'react';
import { InstallTierStat } from '../types/app';
import { DownloadCloud, HardDrive, ShieldCheck, TrendingUp } from 'lucide-react';

interface CorrelationAnalysisProps {
  installStats: InstallTierStat[];
  sizeStats: { tier: string; count: number; avgRating: number; avgReviews: number }[];
  contentRatingStats: { tier: string; count: number; avgRating: number; totalInstalls: number }[];
}

export const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({
  installStats,
  sizeStats,
  contentRatingStats,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. Rating vs Install Volume */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <DownloadCloud className="w-4 h-4 text-cyan-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Rating by Install Tier</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          High-install apps maintain higher rating stability due to survivor bias and active maintenance.
        </p>

        <div className="space-y-3">
          {installStats.map(tier => {
            const barWidth = tier.avgRating > 0 ? ((tier.avgRating / 5.0) * 100).toFixed(1) : 0;
            return (
              <div key={tier.tier} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{tier.tier}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px]">{tier.count} apps</span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                      ★ {tier.avgRating.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${barWidth}%` }}
                    className="h-full bg-cyan-600 dark:bg-cyan-500 rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          💡 <strong className="text-slate-800 dark:text-slate-200">Scale Advantage:</strong> Apps crossing 10M+ installs average <strong>4.35+</strong> rating, having survived early bugs and negative cohort churn.
        </div>
      </div>

      {/* 2. Rating vs App File Size */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <HardDrive className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Rating by APK Size</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Heavier apps (&gt;60MB, often rich games/suites) show competitive ratings despite download friction.
        </p>

        <div className="space-y-3">
          {sizeStats.map(stat => {
            const barWidth = stat.avgRating > 0 ? ((stat.avgRating / 5.0) * 100).toFixed(1) : 0;
            return (
              <div key={stat.tier} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{stat.tier}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px]">{stat.count} apps</span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                      ★ {stat.avgRating.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${barWidth}%` }}
                    className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          💡 <strong className="text-slate-800 dark:text-slate-200">Device Adaptation:</strong> Apps with 'Varies with device' dynamic bundling achieve strong ratings by optimizing assets per architecture.
        </div>
      </div>

      {/* 3. Rating by Content Rating */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Audience & Content Rating</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          How ratings vary across target age demographics and content classification brackets.
        </p>

        <div className="space-y-3">
          {contentRatingStats.map(stat => {
            const barWidth = stat.avgRating > 0 ? ((stat.avgRating / 5.0) * 100).toFixed(1) : 0;
            return (
              <div key={stat.tier} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{stat.tier}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px]">{stat.count} apps</span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                      ★ {stat.avgRating.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${barWidth}%` }}
                    className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          💡 <strong className="text-slate-800 dark:text-slate-200">Demographic Sentiment:</strong> Mature 17+ apps exhibit greater rating polarization due to dating and social chat friction points.
        </div>
      </div>
    </div>
  );
};
