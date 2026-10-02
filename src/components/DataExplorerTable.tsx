import React, { useState, useMemo } from 'react';
import { MobileApp } from '../types/app';
import { Search, Filter, ArrowUpDown, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface DataExplorerTableProps {
  apps: MobileApp[];
  onSelectApp: (app: MobileApp) => void;
  categories: string[];
}

type SortKey = 'app' | 'category' | 'rating' | 'reviews' | 'installsNum' | 'price';

export const DataExplorerTable: React.FC<DataExplorerTableProps> = ({
  apps,
  onSelectApp,
  categories,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Free' | 'Paid'>('ALL');
  const [ratingFilter, setRatingFilter] = useState<string>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('reviews');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      // Search
      if (search) {
        const query = search.toLowerCase();
        const matchName = app.app.toLowerCase().includes(query);
        const matchCat = app.category.toLowerCase().includes(query);
        if (!matchName && !matchCat) return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && app.category !== selectedCategory) {
        return false;
      }

      // Type
      if (typeFilter !== 'ALL' && app.type !== typeFilter) {
        return false;
      }

      // Rating Filter
      if (ratingFilter === 'UNRATED' && app.rating !== null) return false;
      if (ratingFilter === '4.5' && (app.rating === null || app.rating < 4.5)) return false;
      if (ratingFilter === '4.0' && (app.rating === null || app.rating < 4.0)) return false;
      if (ratingFilter === '3.0' && (app.rating === null || app.rating < 3.0 || app.rating >= 4.0)) return false;
      if (ratingFilter === 'BELOW_3.0' && (app.rating === null || app.rating >= 3.0)) return false;

      return true;
    });
  }, [apps, search, selectedCategory, typeFilter, ratingFilter]);

  const sortedApps = useMemo(() => {
    return [...filteredApps].sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];

      // Handle null ratings
      if (sortKey === 'rating') {
        aVal = a.rating ?? -1;
        bVal = b.rating ?? -1;
      }

      if (typeof aVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? aVal - bVal : bVal - aVal;
    });
  }, [filteredApps, sortKey, sortAsc]);

  const totalPages = Math.ceil(sortedApps.length / pageSize) || 1;
  const paginatedApps = sortedApps.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by app name or category..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {c.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          {/* Type Segmented */}
          <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
            {(['ALL', 'Free', 'Paid'] as const).map(t => (
              <button
                key={t}
                onClick={() => {
                  setTypeFilter(t);
                  setPage(1);
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  typeFilter === t
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Rating Bracket */}
          <select
            value={ratingFilter}
            onChange={e => {
              setRatingFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Ratings</option>
            <option value="4.5">★ 4.5 & Above</option>
            <option value="4.0">★ 4.0 & Above</option>
            <option value="3.0">★ 3.0 - 3.9</option>
            <option value="BELOW_3.0">★ Below 3.0</option>
            <option value="UNRATED">Unrated (NaN)</option>
          </select>
        </div>
      </div>

      {/* High Density Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold select-none">
              <th
                onClick={() => handleSort('app')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  <span>Application</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th
                onClick={() => handleSort('category')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  <span>Category</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th
                onClick={() => handleSort('rating')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Rating</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th
                onClick={() => handleSort('reviews')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Reviews</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th
                onClick={() => handleSort('installsNum')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Installs</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th
                onClick={() => handleSort('price')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="py-3 px-4 text-right">Size</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {paginatedApps.map(app => (
              <tr
                key={app.id}
                onClick={() => onSelectApp(app)}
                className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 cursor-pointer transition-colors"
              >
                <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100 max-w-[240px] truncate">
                  {app.app}
                </td>

                <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                  {app.category.replace(/_/g, ' ')}
                </td>

                <td className="py-2.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                  {app.rating !== null ? (
                    <span className="font-bold text-slate-900 dark:text-white flex items-center justify-end gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {app.rating.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal text-[11px]">Unrated</span>
                  )}
                </td>

                <td className="py-2.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums whitespace-nowrap">
                  {app.reviews.toLocaleString()}
                </td>

                <td className="py-2.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums whitespace-nowrap">
                  {app.installs}
                </td>

                <td className="py-2.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                  {app.type === 'Paid' ? (
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{app.priceRaw}</span>
                  ) : (
                    <span className="text-slate-400 font-normal text-[11px]">Free</span>
                  )}
                </td>

                <td className="py-2.5 px-4 text-right text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                  {app.size}
                </td>
              </tr>
            ))}

            {paginatedApps.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No applications matched the specified filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <strong className="text-slate-800 dark:text-slate-200 font-mono">{Math.min((page - 1) * pageSize + 1, sortedApps.length)}</strong> to{' '}
          <strong className="text-slate-800 dark:text-slate-200 font-mono">{Math.min(page * pageSize, sortedApps.length)}</strong> of{' '}
          <strong className="text-slate-800 dark:text-slate-200 font-mono">{sortedApps.length}</strong> matching apps
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono tabular-nums">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
