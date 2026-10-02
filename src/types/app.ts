export interface MobileApp {
  id: string;
  app: string;
  category: string;
  rating: number | null; // null for NaN
  reviews: number;
  size: string;
  sizeMb: number | null; // parsed size in MB
  installs: string;
  installsNum: number;
  type: 'Free' | 'Paid';
  price: number;
  priceRaw: string;
  contentRating: string;
  genres: string;
  lastUpdated: string;
  currentVer: string;
  androidVer: string;
}

export interface CategoryStat {
  category: string;
  appCount: number;
  avgRating: number;
  medianRating: number;
  totalReviews: number;
  totalInstalls: number;
  avgInstalls: number;
  freeCount: number;
  paidCount: number;
  paidRatio: number;
  avgPrice: number;
  ratedCount: number;
  unratedCount: number;
  minRating: number;
  maxRating: number;
  topRatedApp: string;
  topRatedAppRating: number;
  mostReviewedApp: string;
  mostReviewedCount: number;
}

export interface RatingBin {
  bin: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
}

export interface InstallTierStat {
  tier: string;
  minInstalls: number;
  count: number;
  avgRating: number;
  totalReviews: number;
}

export interface PriceTierStat {
  type: string;
  count: number;
  avgRating: number;
  medianRating: number;
  avgReviews: number;
}
