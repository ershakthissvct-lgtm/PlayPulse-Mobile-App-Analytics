import React from 'react';
import { PriceTierStat, MobileApp } from '../types/app';
import { DollarSign, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

interface PricingAnalysisProps {
  priceStats: PriceTierStat[];
  apps: MobileApp[];
  onSelectApp: (app: MobileApp) => void;
}

export const PricingAnalysis: React.FC<PricingAnalysisProps> = ({
  priceStats,
  apps,
  onSelectApp,
}) => {
  // Find interesting paid outliers
  const paidApps = apps.filter(a => a.type === 'Paid');
  const luxuryApps = paidApps.filter(a => a.price >= 100);
  const bestValuePaid = [...paidApps]
    .filter(a => a.rating !== null && a.rating >= 4.5 && a.reviews >= 500)
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            Monetization & Rating Dynamics (Free vs. Paid)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Do paid apps enjoy higher ratings due to reduced ad frustration, or suffer harsher reviews from paying buyers?
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        {priceStats.map(tier => (
          <div
            key={tier.type}
            className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
          >
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {tier.type}
            </div>
            <div className="flex items-baseline gap-1.5 mb-1.5">
              <span className="text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                ★ {tier.avgRating > 0 ? tier.avgRating.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>{tier.count} apps</span>
              <span className="font-mono">{tier.avgReviews.toLocaleString()} avg rev</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Quality Paid Winners */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Top-Rated High-Volume Paid Apps (High Trust)
          </div>
          <div className="space-y-2.5">
            {bestValuePaid.map(app => (
              <div
                key={app.id}
                onClick={() => onSelectApp(app)}
                className="flex items-center justify-between p-2.5 rounded-md bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors text-xs"
              >
                <div className="truncate pr-2">
                  <div className="font-medium text-slate-900 dark:text-white truncate">{app.app}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">
                    {app.category} · {app.installs} installs
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <div className="font-bold text-amber-500">★ {app.rating}</div>
                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{app.priceRaw}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The $399.99 Outlier Case Study */}
        <div className="rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-300 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Dataset Phenomenon: The $399.99 "Veblen Good" Apps
          </div>
          <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed mb-3">
            The dataset features historical anomalies: multiple apps named <em>"I am rich"</em> priced at <strong>$399.99</strong> with minimal utility, yet generating thousands of downloads and ratings averaging <strong>3.8 ★</strong> (skewed by novelty reviews).
          </p>
          <div className="space-y-1.5 text-xs font-mono">
            {luxuryApps.slice(0, 3).map(app => (
              <div
                key={app.id}
                onClick={() => onSelectApp(app)}
                className="flex items-center justify-between p-2 rounded bg-white/70 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 cursor-pointer border border-amber-200/60 dark:border-amber-900/40"
              >
                <span className="truncate pr-2 text-slate-800 dark:text-slate-200">{app.app}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">★ {app.rating ?? 'N/A'}</span>
                  <span className="text-slate-900 dark:text-white font-bold">{app.priceRaw}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
