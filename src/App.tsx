import React, { useState, useMemo, useRef } from 'react';
import { INITIAL_APPS, parseInstalls, parseSize, parsePrice } from './data/dataset';
import { MobileApp, CategoryStat } from './types/app';
import {
  computeGlobalAnalysis,
  computeCategoryStats,
  computeRatingBins,
  computeGranularRatingBins,
  computeInstallTierStats,
  computeSizeCorrelation,
  computeContentRatingStats,
  computePriceStats,
} from './utils/analytics';
import { Header, ActiveTab } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { RatingDistributionChart } from './components/RatingDistributionChart';
import { CategoryRankingsChart } from './components/CategoryRankingsChart';
import { CorrelationAnalysis } from './components/CorrelationAnalysis';
import { PricingAnalysis } from './components/PricingAnalysis';
import { BenchmarkSimulator } from './components/BenchmarkSimulator';
import { DataExplorerTable } from './components/DataExplorerTable';
import { ExecutiveInsights } from './components/ExecutiveInsights';
import { CategoryDetailModal } from './components/CategoryDetailModal';
import { AppDetailModal } from './components/AppDetailModal';
import { BarChart3, TrendingUp, Filter, Layers, Upload, Download, Sparkles, Check } from 'lucide-react';

export default function App() {
  const [apps, setApps] = useState<MobileApp[]>(INITIAL_APPS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedApp, setSelectedApp] = useState<MobileApp | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute live statistical representations based on current app list
  const globalAnalysis = useMemo(() => computeGlobalAnalysis(apps), [apps]);
  const categoryStats = useMemo(() => computeCategoryStats(apps), [apps]);
  const ratingBins = useMemo(() => computeRatingBins(apps), [apps]);
  const granularBins = useMemo(() => computeGranularRatingBins(apps), [apps]);
  const installStats = useMemo(() => computeInstallTierStats(apps), [apps]);
  const sizeStats = useMemo(() => computeSizeCorrelation(apps), [apps]);
  const contentRatingStats = useMemo(() => computeContentRatingStats(apps), [apps]);
  const priceStats = useMemo(() => computePriceStats(apps), [apps]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(apps.map(a => a.category))).sort();
  }, [apps]);

  // Export analyzed data as CSV
  const handleExportCsv = () => {
    const headers = ['App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs', 'Type', 'Price', 'Content Rating', 'Genres', 'Last Updated'];
    const rows = apps.map(a => [
      `"${a.app.replace(/"/g, '""')}"`,
      a.category,
      a.rating ?? 'NaN',
      a.reviews,
      a.size,
      `"${a.installs}"`,
      a.type,
      a.priceRaw,
      `"${a.contentRating}"`,
      `"${a.genres}"`,
      a.lastUpdated,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mobile_app_rating_analysis_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom CSV File Upload parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          setUploadError('The CSV file appears to be empty or missing data rows.');
          return;
        }

        // Parse CSV lines respecting quotes
        const parseCsvLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              result.push(current);
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current);
          return result;
        };

        const parsedApps: MobileApp[] = [];
        // Skip header
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCsvLine(lines[i]);
          if (cols.length >= 7) {
            const app = cols[0]?.trim() || `App ${i}`;
            const category = cols[1]?.trim() || 'OTHER';
            const ratingRaw = cols[2]?.trim();
            const rating = ratingRaw && !isNaN(parseFloat(ratingRaw)) ? parseFloat(ratingRaw) : null;
            const reviews = parseInt(cols[3]?.replace(/[^0-9]/g, '') || '0', 10);
            const size = cols[4]?.trim() || 'Varies with device';
            const installs = cols[5]?.trim() || '0+';
            const type: 'Free' | 'Paid' = cols[6]?.toLowerCase().includes('paid') ? 'Paid' : 'Free';
            const priceRaw = cols[7]?.trim() || '0';
            const contentRating = cols[8]?.trim() || 'Everyone';
            const genres = cols[9]?.trim() || category;
            const lastUpdated = cols[10]?.trim() || 'Unknown';

            parsedApps.push({
              id: `custom-app-${i}`,
              app,
              category,
              rating,
              reviews,
              size,
              sizeMb: parseSize(size),
              installs,
              installsNum: parseInstalls(installs),
              type,
              price: parsePrice(priceRaw),
              priceRaw,
              contentRating,
              genres,
              lastUpdated,
              currentVer: '1.0.0',
              androidVer: '4.0.3 and up',
            });
          }
        }

        if (parsedApps.length === 0) {
          setUploadError('Could not parse any valid app rows from this file. Ensure standard column headers.');
          return;
        }

        setApps(parsedApps);
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          setShowUploadModal(false);
        }, 1200);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to parse CSV file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefault = () => {
    setApps(INITIAL_APPS);
    setShowUploadModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Contract (3 zones) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalApps={apps.length}
        onExportCsv={handleExportCsv}
        onUploadCsvClick={() => setShowUploadModal(true)}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Hero Kicker */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-900">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Mobile App Rating Intelligence</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                ({apps.length} apps · {uniqueCategories.length} categories)
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Statistical breakdown of Google Play Store ratings, review densities, category benchmark curves, and price elasticity.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Market Mean: <strong className="text-amber-400">★ {globalAnalysis.meanRating}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Weighted Mean: <strong className="text-indigo-400">★ {globalAnalysis.weightedRating}</strong></span>
          </div>
        </div>

        {/* Executive KPI Metric Row */}
        <MetricCards analysis={globalAnalysis} />

        {/* Tab 1: Executive Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Split layout: Rating Distribution Histogram & Category Rankings Teaser */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <RatingDistributionChart
                  bins={ratingBins}
                  granularBins={granularBins}
                  meanRating={globalAnalysis.meanRating}
                  medianRating={globalAnalysis.medianRating}
                  totalRated={globalAnalysis.ratedAppsCount}
                />
              </div>

              <div className="lg:col-span-7">
                <CategoryRankingsChart
                  categories={categoryStats}
                  onSelectCategory={cat => setSelectedCategory(cat)}
                  globalMean={globalAnalysis.meanRating}
                />
              </div>
            </div>

            {/* Monetization Dynamics */}
            <PricingAnalysis
              priceStats={priceStats}
              apps={apps}
              onSelectApp={app => setSelectedApp(app)}
            />

            {/* Strategic Takeaways Grid */}
            <ExecutiveInsights analysis={globalAnalysis} />
          </div>
        )}

        {/* Tab 2: Category Benchmark */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <CategoryRankingsChart
              categories={categoryStats}
              onSelectCategory={cat => setSelectedCategory(cat)}
              globalMean={globalAnalysis.meanRating}
            />

            {/* Category Metric Grid Cards */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Full Category Taxonomy Index (Click to inspect all apps in category)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categoryStats.map(cat => (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategory(cat.category)}
                    className="p-3 text-left rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-1 text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate pr-2">
                        {cat.category.replace(/_/g, ' ')}
                      </span>
                      <span className="font-mono font-bold text-amber-500 tabular-nums">
                        ★ {cat.avgRating.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {cat.appCount} apps · {cat.totalReviews.toLocaleString()} reviews
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Rating Dynamics (Distributions, Installs, Size, Content) */}
        {activeTab === 'distributions' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <RatingDistributionChart
              bins={ratingBins}
              granularBins={granularBins}
              meanRating={globalAnalysis.meanRating}
              medianRating={globalAnalysis.medianRating}
              totalRated={globalAnalysis.ratedAppsCount}
            />

            <CorrelationAnalysis
              installStats={installStats}
              sizeStats={sizeStats}
              contentRatingStats={contentRatingStats}
            />
          </div>
        )}

        {/* Tab 4: Rating Simulator & Positioning */}
        {activeTab === 'simulator' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <BenchmarkSimulator
              categories={categoryStats}
              allApps={apps}
              globalMean={globalAnalysis.meanRating}
            />

            <ExecutiveInsights analysis={globalAnalysis} />
          </div>
        )}

        {/* Tab 5: Data Explorer Table */}
        {activeTab === 'explorer' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <DataExplorerTable
              apps={apps}
              onSelectApp={app => setSelectedApp(app)}
              categories={uniqueCategories}
            />
          </div>
        )}
      </main>

      {/* Category Detail Modal Drawer */}
      <CategoryDetailModal
        category={selectedCategory}
        categoryStat={categoryStats.find(c => c.category === selectedCategory)}
        apps={apps}
        onClose={() => setSelectedCategory(null)}
        onSelectApp={app => setSelectedApp(app)}
      />

      {/* App Detail Modal */}
      <AppDetailModal
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
        categoryAvg={
          selectedApp
            ? categoryStats.find(c => c.category === selectedApp.category)?.avgRating
            : undefined
        }
      />

      {/* CSV Upload / Switch Dataset Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-500" />
                Upload Dataset
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Upload any Google Play Store CSV file with columns: <code>App, Category, Rating, Reviews, Size, Installs, Type, Price, Content Rating</code>.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/40"
            >
              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                Click to browse CSV file
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                CSV format, up to 10MB
              </span>
            </div>

            {uploadError && (
              <div className="mt-3 p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="mt-3 p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Dataset imported successfully! Updating analytics...</span>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleResetToDefault}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Reset to Original Data
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-xs transition-colors"
              >
                Select File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 text-slate-500 text-xs py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PlayPulse © {new Date().getFullYear()} · Mobile App Rating & Store Dynamics Intelligence
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>{apps.length} cataloged apps</span>
            <span aria-hidden="true">·</span>
            <span>{uniqueCategories.length} categories</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleExportCsv}
              className="hover:text-white underline cursor-pointer"
            >
              Export CSV
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
