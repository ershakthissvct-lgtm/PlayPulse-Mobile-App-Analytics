import { MobileApp, CategoryStat, RatingBin, InstallTierStat, PriceTierStat } from '../types/app';

export interface GlobalAnalysis {
  totalApps: number;
  ratedAppsCount: number;
  unratedAppsCount: number;
  meanRating: number;
  medianRating: number;
  weightedRating: number;
  ratingStdDev: number;
  totalReviews: number;
  avgReviewsPerApp: number;
  totalEstimatedInstalls: number;
  freeAppsCount: number;
  paidAppsCount: number;
  freeAvgRating: number;
  paidAvgRating: number;
  highestRatedCategory: { name: string; rating: number };
  lowestRatedCategory: { name: string; rating: number };
  mostCompetitiveCategory: { name: string; count: number };
}

export function computeGlobalAnalysis(apps: MobileApp[]): GlobalAnalysis {
  const totalApps = apps.length;
  const ratedApps = apps.filter(a => a.rating !== null && !isNaN(a.rating));
  const unratedAppsCount = totalApps - ratedApps.length;

  if (ratedApps.length === 0) {
    return {
      totalApps,
      ratedAppsCount: 0,
      unratedAppsCount,
      meanRating: 0,
      medianRating: 0,
      weightedRating: 0,
      ratingStdDev: 0,
      totalReviews: 0,
      avgReviewsPerApp: 0,
      totalEstimatedInstalls: 0,
      freeAppsCount: 0,
      paidAppsCount: 0,
      freeAvgRating: 0,
      paidAvgRating: 0,
      highestRatedCategory: { name: 'N/A', rating: 0 },
      lowestRatedCategory: { name: 'N/A', rating: 0 },
      mostCompetitiveCategory: { name: 'N/A', count: 0 },
    };
  }

  const ratings = ratedApps.map(a => a.rating as number).sort((a, b) => a - b);
  const sumRating = ratings.reduce((sum, r) => sum + r, 0);
  const meanRating = +(sumRating / ratings.length).toFixed(2);

  const mid = Math.floor(ratings.length / 2);
  const medianRating = ratings.length % 2 === 0 
    ? +((ratings[mid - 1] + ratings[mid]) / 2).toFixed(2)
    : +ratings[mid].toFixed(2);

  // Standard Deviation
  const variance = ratings.reduce((acc, r) => acc + Math.pow(r - meanRating, 2), 0) / ratings.length;
  const ratingStdDev = +Math.sqrt(variance).toFixed(2);

  // Weighted Rating by Review Volume
  let totalWeighted = 0;
  let totalReviewsWeight = 0;
  ratedApps.forEach(a => {
    const w = Math.log10(Math.max(a.reviews, 1) + 1);
    totalWeighted += (a.rating as number) * w;
    totalReviewsWeight += w;
  });
  const weightedRating = totalReviewsWeight > 0 ? +(totalWeighted / totalReviewsWeight).toFixed(2) : meanRating;

  const totalReviews = apps.reduce((sum, a) => sum + a.reviews, 0);
  const avgReviewsPerApp = Math.round(totalReviews / totalApps);
  const totalEstimatedInstalls = apps.reduce((sum, a) => sum + a.installsNum, 0);

  // Free vs Paid
  const freeApps = apps.filter(a => a.type === 'Free');
  const paidApps = apps.filter(a => a.type === 'Paid');
  const freeRated = freeApps.filter(a => a.rating !== null);
  const paidRated = paidApps.filter(a => a.rating !== null);

  const freeAvgRating = freeRated.length > 0 
    ? +(freeRated.reduce((s, a) => s + (a.rating as number), 0) / freeRated.length).toFixed(2)
    : 0;
  const paidAvgRating = paidRated.length > 0
    ? +(paidRated.reduce((s, a) => s + (a.rating as number), 0) / paidRated.length).toFixed(2)
    : 0;

  // Category insights
  const catStats = computeCategoryStats(apps);
  const validCatStats = catStats.filter(c => c.ratedCount >= 3);
  const sortedByRating = [...validCatStats].sort((a, b) => b.avgRating - a.avgRating);
  const sortedByCount = [...catStats].sort((a, b) => b.appCount - a.appCount);

  return {
    totalApps,
    ratedAppsCount: ratedApps.length,
    unratedAppsCount,
    meanRating,
    medianRating,
    weightedRating,
    ratingStdDev,
    totalReviews,
    avgReviewsPerApp,
    totalEstimatedInstalls,
    freeAppsCount: freeApps.length,
    paidAppsCount: paidApps.length,
    freeAvgRating,
    paidAvgRating,
    highestRatedCategory: sortedByRating[0] ? { name: sortedByRating[0].category, rating: sortedByRating[0].avgRating } : { name: 'N/A', rating: 0 },
    lowestRatedCategory: sortedByRating[sortedByRating.length - 1] ? { name: sortedByRating[sortedByRating.length - 1].category, rating: sortedByRating[sortedByRating.length - 1].avgRating } : { name: 'N/A', rating: 0 },
    mostCompetitiveCategory: sortedByCount[0] ? { name: sortedByCount[0].category, count: sortedByCount[0].appCount } : { name: 'N/A', count: 0 },
  };
}

export function computeCategoryStats(apps: MobileApp[]): CategoryStat[] {
  const groups: Record<string, MobileApp[]> = {};
  apps.forEach(app => {
    const cat = app.category.trim() || 'OTHER';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(app);
  });

  return Object.entries(groups).map(([category, items]) => {
    const ratedItems = items.filter(i => i.rating !== null && !isNaN(i.rating));
    const ratings = ratedItems.map(i => i.rating as number).sort((a, b) => a - b);
    const sumRating = ratings.reduce((sum, r) => sum + r, 0);
    const avgRating = ratings.length > 0 ? +(sumRating / ratings.length).toFixed(2) : 0;
    
    const mid = Math.floor(ratings.length / 2);
    const medianRating = ratings.length > 0
      ? (ratings.length % 2 === 0 ? +((ratings[mid - 1] + ratings[mid]) / 2).toFixed(2) : ratings[mid])
      : 0;

    const totalReviews = items.reduce((sum, i) => sum + i.reviews, 0);
    const totalInstalls = items.reduce((sum, i) => sum + i.installsNum, 0);
    const avgInstalls = Math.round(totalInstalls / items.length);

    const freeCount = items.filter(i => i.type === 'Free').length;
    const paidCount = items.filter(i => i.type === 'Paid').length;
    const paidRatio = +(paidCount / items.length).toFixed(3);
    const avgPrice = paidCount > 0 ? +(items.reduce((s, i) => s + i.price, 0) / paidCount).toFixed(2) : 0;

    // Top rated and most reviewed
    const sortedByRated = [...ratedItems].sort((a, b) => (b.rating as number) - (a.rating as number) || b.reviews - a.reviews);
    const sortedByReviews = [...items].sort((a, b) => b.reviews - a.reviews);

    return {
      category,
      appCount: items.length,
      avgRating,
      medianRating,
      totalReviews,
      totalInstalls,
      avgInstalls,
      freeCount,
      paidCount,
      paidRatio,
      avgPrice,
      ratedCount: ratedItems.length,
      unratedCount: items.length - ratedItems.length,
      minRating: ratings.length > 0 ? ratings[0] : 0,
      maxRating: ratings.length > 0 ? ratings[ratings.length - 1] : 0,
      topRatedApp: sortedByRated[0]?.app || 'N/A',
      topRatedAppRating: sortedByRated[0]?.rating || 0,
      mostReviewedApp: sortedByReviews[0]?.app || 'N/A',
      mostReviewedCount: sortedByReviews[0]?.reviews || 0,
    };
  }).sort((a, b) => b.avgRating - a.avgRating);
}

export function computeRatingBins(apps: MobileApp[]): RatingBin[] {
  const rated = apps.filter(a => a.rating !== null && !isNaN(a.rating));
  const binsConfig = [
    { bin: '1.0 - 1.9', min: 1.0, max: 1.99 },
    { bin: '2.0 - 2.9', min: 2.0, max: 2.99 },
    { bin: '3.0 - 3.4', min: 3.0, max: 3.49 },
    { bin: '3.5 - 3.9', min: 3.5, max: 3.99 },
    { bin: '4.0 - 4.4', min: 4.0, max: 4.49 },
    { bin: '4.5 - 4.7', min: 4.5, max: 4.79 },
    { bin: '4.8 - 5.0', min: 4.8, max: 5.01 },
  ];

  return binsConfig.map(cfg => {
    const count = rated.filter(a => {
      const r = a.rating as number;
      return r >= cfg.min && r <= cfg.max;
    }).length;
    const percentage = rated.length > 0 ? +((count / rated.length) * 100).toFixed(1) : 0;
    return {
      bin: cfg.bin,
      min: cfg.min,
      max: cfg.max,
      count,
      percentage,
    };
  });
}

// Granular bins for smooth bell curve visualization (20 bins of 0.2 step)
export function computeGranularRatingBins(apps: MobileApp[]): { rating: number; count: number; label: string }[] {
  const rated = apps.filter(a => a.rating !== null && !isNaN(a.rating));
  const results = [];
  for (let r = 1.0; r <= 5.0; r += 0.2) {
    const min = +(r - 0.001).toFixed(2);
    const max = +(r + 0.199).toFixed(2);
    const count = rated.filter(a => {
      const val = a.rating as number;
      return val >= min && val <= max;
    }).length;
    results.push({
      rating: +r.toFixed(1),
      count,
      label: r.toFixed(1),
    });
  }
  return results;
}

export function computeInstallTierStats(apps: MobileApp[]): InstallTierStat[] {
  const tiers = [
    { tier: '< 10K', min: 0, max: 9999 },
    { tier: '10K - 100K', min: 10000, max: 99999 },
    { tier: '100K - 1M', min: 100000, max: 999999 },
    { tier: '1M - 10M', min: 1000000, max: 9999999 },
    { tier: '10M - 100M', min: 10000000, max: 99999999 },
    { tier: '100M+', min: 100000000, max: Infinity },
  ];

  return tiers.map(t => {
    const matched = apps.filter(a => a.installsNum >= t.min && a.installsNum <= t.max);
    const rated = matched.filter(a => a.rating !== null);
    const avgRating = rated.length > 0
      ? +(rated.reduce((s, a) => s + (a.rating as number), 0) / rated.length).toFixed(2)
      : 0;
    const totalReviews = matched.reduce((s, a) => s + a.reviews, 0);

    return {
      tier: t.tier,
      minInstalls: t.min,
      count: matched.length,
      avgRating,
      totalReviews,
    };
  });
}

export function computeSizeCorrelation(apps: MobileApp[]): { tier: string; count: number; avgRating: number; avgReviews: number }[] {
  const tiers = [
    { tier: '< 5 MB', filter: (s: number | null) => s !== null && s < 5 },
    { tier: '5 - 15 MB', filter: (s: number | null) => s !== null && s >= 5 && s < 15 },
    { tier: '15 - 30 MB', filter: (s: number | null) => s !== null && s >= 15 && s < 30 },
    { tier: '30 - 60 MB', filter: (s: number | null) => s !== null && s >= 30 && s < 60 },
    { tier: '60 MB+', filter: (s: number | null) => s !== null && s >= 60 },
    { tier: 'Varies', filter: (s: number | null) => s === null },
  ];

  return tiers.map(t => {
    const matched = apps.filter(a => t.filter(a.sizeMb));
    const rated = matched.filter(a => a.rating !== null);
    const avgRating = rated.length > 0
      ? +(rated.reduce((s, a) => s + (a.rating as number), 0) / rated.length).toFixed(2)
      : 0;
    const avgReviews = matched.length > 0 ? Math.round(matched.reduce((s, a) => s + a.reviews, 0) / matched.length) : 0;
    return {
      tier: t.tier,
      count: matched.length,
      avgRating,
      avgReviews,
    };
  });
}

export function computeContentRatingStats(apps: MobileApp[]): { tier: string; count: number; avgRating: number; totalInstalls: number }[] {
  const groups: Record<string, MobileApp[]> = {};
  apps.forEach(a => {
    const cr = a.contentRating || 'Unrated';
    if (!groups[cr]) groups[cr] = [];
    groups[cr].push(a);
  });

  return Object.entries(groups).map(([tier, items]) => {
    const rated = items.filter(a => a.rating !== null);
    const avgRating = rated.length > 0
      ? +(rated.reduce((s, a) => s + (a.rating as number), 0) / rated.length).toFixed(2)
      : 0;
    const totalInstalls = items.reduce((s, a) => s + a.installsNum, 0);
    return {
      tier,
      count: items.length,
      avgRating,
      totalInstalls,
    };
  }).sort((a, b) => b.count - a.count);
}

export function computePriceStats(apps: MobileApp[]): PriceTierStat[] {
  const freeApps = apps.filter(a => a.type === 'Free');
  const paidApps = apps.filter(a => a.type === 'Paid');

  const calcTier = (type: string, items: MobileApp[]): PriceTierStat => {
    const rated = items.filter(a => a.rating !== null);
    const ratings = rated.map(a => a.rating as number).sort((a, b) => a - b);
    const avgRating = rated.length > 0 ? +(rated.reduce((s, a) => s + (a.rating as number), 0) / rated.length).toFixed(2) : 0;
    const mid = Math.floor(ratings.length / 2);
    const medianRating = ratings.length > 0 
      ? (ratings.length % 2 === 0 ? +((ratings[mid - 1] + ratings[mid]) / 2).toFixed(2) : ratings[mid])
      : 0;
    const avgReviews = items.length > 0 ? Math.round(items.reduce((s, a) => s + a.reviews, 0) / items.length) : 0;
    return {
      type,
      count: items.length,
      avgRating,
      medianRating,
      avgReviews,
    };
  };

  const cheapPaid = paidApps.filter(a => a.price > 0 && a.price < 3);
  const midPaid = paidApps.filter(a => a.price >= 3 && a.price < 10);
  const premiumPaid = paidApps.filter(a => a.price >= 10);

  return [
    calcTier('Free Apps', freeApps),
    calcTier('Paid Apps (All)', paidApps),
    calcTier('Paid (< $3.00)', cheapPaid),
    calcTier('Paid ($3.00 - $9.99)', midPaid),
    calcTier('Premium ($10.00+)', premiumPaid),
  ];
}
