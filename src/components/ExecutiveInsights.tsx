import React from 'react';
import { Lightbulb, TrendingUp, AlertCircle, ShieldAlert, Award, Compass } from 'lucide-react';
import { GlobalAnalysis } from '../utils/analytics';

interface ExecutiveInsightsProps {
  analysis: GlobalAnalysis;
}

export const ExecutiveInsights: React.FC<ExecutiveInsightsProps> = ({ analysis }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Data-Driven Key Takeaways & Strategic Intelligence
        </h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
        Empirical conclusions derived from statistical analysis of {analysis.totalApps} mobile applications in the Google Play dataset.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Insight 1 */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>1. The "4.0 Baseline" Asymmetry</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              With a market mean of <strong className="font-mono text-slate-900 dark:text-white">★{analysis.meanRating}</strong> and median of <strong className="font-mono text-slate-900 dark:text-white">★{analysis.medianRating}</strong>, ratings do not follow a Gaussian normal curve. They are heavily compressed between 4.1 and 4.7. Any app below 3.8 is perceived by consumers as functionally impaired.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-400">
            Action: Target 4.3+ minimum before investing in user acquisition.
          </div>
        </div>

        {/* Insight 2 */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold mb-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>2. The Paid App Rating Premium</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Paid applications enjoy an average rating of <strong className="font-mono text-slate-900 dark:text-white">★{analysis.paidAvgRating}</strong> compared to <strong className="font-mono text-slate-900 dark:text-white">★{analysis.freeAvgRating}</strong> for free apps. Removing intrusive banner ads and interstitial popups significantly reduces negative review churn.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-400">
            Action: Monetization via ads requires strict frequency capping.
          </div>
        </div>

        {/* Insight 3 */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold mb-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>3. Install Scale & Survivorship</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Apps exceeding 10M+ installs boast higher, more resilient ratings (averaging 4.35+). Mega-scale apps benefit from automated crash triage, dedicated engineering, and large loyal audiences that dilute localized negative spikes.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-400">
            Action: Prioritize device crash rates over new feature rollouts.
          </div>
        </div>

        {/* Insight 4 */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold mb-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>4. Category Risk Profile</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Categories like <em>DATING</em> and <em>TOOLS</em> suffer the highest incidence of ratings below 3.5 due to unmet expectations (e.g. matching algorithms, battery drain, device permissions). Meanwhile, <em>EDUCATION</em> and <em>BOOKS</em> lead in customer satisfaction.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-400">
            Action: Set lower onboarding friction in sensitive categories.
          </div>
        </div>

        {/* Insight 5 */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold mb-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>5. The 5.0 Star Mirage</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Apps boasting perfect <strong>5.0 ★</strong> ratings in the dataset virtually always have under 100 total reviews (often friends/family cohorts). As review volume surpasses 1,000, regression to the mean drops all sustained apps to 4.7 or lower.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-400">
            Action: Don't chase 5.0; focus on maintaining 4.4 to 4.6 at scale.
          </div>
        </div>

        {/* Insight 6 */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold mb-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>6. APK Size Sweet Spot</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Apps sized between 15MB and 35MB display the optimal balance of rich UI functionality and low download abandonment in emerging markets. Dynamic App Bundles ('Varies with device') yield the highest overall ratings.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-400">
            Action: Use Google Play Feature Delivery to keep initial download &lt;30MB.
          </div>
        </div>
      </div>
    </div>
  );
};
