import React, { useState, useMemo } from 'react';
import { useQuote } from '../../context/QuoteContext';
import { Shield, ArrowLeft, User, Check, SlidersHorizontal, Sparkles, Star, ChevronRight } from 'lucide-react';
import { InsurancePlan, CoverageType } from '../../types/insurance';

export const PlanComparisonStep: React.FC = () => {
  const {
    availablePlans,
    selectedPlan,
    setSelectedPlan,
    healthInfo,
    setHealthInfo,
    personalDetails,
    navigate
  } = useQuote();

  const [activeTab, setActiveTab] = useState<CoverageType>(healthInfo.coverageType || 'Individual');
  const [sortBy, setSortBy] = useState<'best-value' | 'lowest-price' | 'highest-coverage'>('best-value');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [maternityOnly, setMaternityOnly] = useState<boolean>(false);
  const [globalOnly, setGlobalOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  // Switch tab and sync with healthInfo
  const handleTabChange = (type: CoverageType) => {
    setActiveTab(type);
    setHealthInfo((prev) => ({ ...prev, coverageType: type }));
  };

  const providers = useMemo(() => {
    const list = Array.from(new Set(availablePlans.map((p) => p.provider)));
    return ['All', ...list];
  }, [availablePlans]);

  const filteredAndSortedPlans = useMemo(() => {
    return availablePlans
      .filter((plan) => {
        // Tab filter
        if (plan.coverageType !== activeTab) return false;
        // Provider filter
        if (selectedProvider !== 'All' && plan.provider !== selectedProvider) return false;
        // Price filter
        if (plan.monthlyPremium > maxPrice) return false;
        // Maternity filter
        if (maternityOnly && !plan.maternityCoverage.toLowerCase().includes('included') && !plan.maternityCoverage.toLowerCase().includes('up to')) {
          return false;
        }
        // Global filter
        if (globalOnly && !plan.globalNetwork.toLowerCase().includes('global') && !plan.globalNetwork.toLowerCase().includes('worldwide')) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'lowest-price') return a.monthlyPremium - b.monthlyPremium;
        if (sortBy === 'highest-coverage') return (b.matchScore || 0) - (a.matchScore || 0);
        // Best value default: best value badge first, then score
        if (a.isBestValue && !b.isBestValue) return -1;
        if (!a.isBestValue && b.isBestValue) return 1;
        return (b.matchScore || 0) - (a.matchScore || 0);
      });
  }, [availablePlans, activeTab, selectedProvider, maxPrice, maternityOnly, globalOnly, sortBy]);

  const handleSelectPlan = (plan: InsurancePlan) => {
    setSelectedPlan(plan);
    navigate('/quote/details');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Step Header matching Screen 5 */}
      <div className="w-full bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/quote/health')}
            className="p-1.5 -ml-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white">
              <Shield className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-base">
              HealthQuote<span className="text-sky-600"> AI</span>
            </span>
          </div>

          <button
            onClick={() => navigate('/saved-quotes')}
            className="p-2 text-slate-600 hover:text-sky-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            title="Saved Quotes"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Title & Subtitle */}
        <div className="text-center sm:text-left mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Your Personalized Health Plans
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Based on your details ({personalDetails.fullName || 'Member'}, {personalDetails.cityCountry || 'Dubai, UAE'}), here are the best options for you.
          </p>
        </div>

        {/* Individual / Family Segmented Tabs */}
        <div className="flex items-center justify-center sm:justify-start gap-2 p-1 bg-slate-200/80 rounded-2xl max-w-xs mb-6">
          <button
            type="button"
            onClick={() => handleTabChange('Individual')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'Individual'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Individual Plans
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('Family')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'Family'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Family Plans
          </button>
        </div>

        {/* Filters & Sorting Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <SlidersHorizontal className="w-4 h-4 text-sky-600" />
              <span>Filters & Sorting</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white text-slate-800"
                >
                  <option value="best-value">Best Value</option>
                  <option value="lowest-price">Lowest Price</option>
                  <option value="highest-coverage">Highest AI Match</option>
                </select>
              </div>

              {/* Provider Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="font-medium">Provider:</span>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white text-slate-800"
                >
                  {providers.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Quick Toggles */}
              <button
                type="button"
                onClick={() => setGlobalOnly(!globalOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  globalOnly
                    ? 'bg-sky-50 text-sky-700 border-sky-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                Global Network
              </button>

              <button
                type="button"
                onClick={() => setMaternityOnly(!maternityOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  maternityOnly
                    ? 'bg-sky-50 text-sky-700 border-sky-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                Maternity Included
              </button>
            </div>
          </div>
        </div>

        {/* Plan Cards List */}
        {filteredAndSortedPlans.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80">
            <p className="text-slate-700 font-bold text-base">No plans match your selected filters.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the provider or feature toggles above.</p>
            <button
              onClick={() => {
                setSelectedProvider('All');
                setMaternityOnly(false);
                setGlobalOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedPlans.map((plan) => {
              const isCurrentSelected = selectedPlan?.id === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-200 relative ${
                    plan.isBestValue
                      ? 'border-sky-300 shadow-md ring-1 ring-sky-200'
                      : 'border-slate-200/80 shadow-xs hover:border-slate-300'
                  }`}
                >
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {plan.isBestValue && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>Best Value</span>
                        </span>
                      )}
                      {plan.matchScore && (
                        <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-sky-500" />
                          <span>{plan.matchScore}% Match</span>
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-medium text-slate-500">
                      {plan.duration} renewable
                    </span>
                  </div>

                  {/* Plan Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Left Info: Provider & Plan Name */}
                    <div className="md:col-span-5 space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {plan.provider}
                      </p>
                      <h3 className="text-xl font-bold text-slate-900">
                        {plan.planName}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {plan.description}
                      </p>
                    </div>

                    {/* Middle: Benefits Checklist (matching Screen 5) */}
                    <div className="md:col-span-4 space-y-1.5 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
                      {plan.benefits.slice(0, 3).map((b, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    {/* Right: Price & CTA (matching Screen 5) */}
                    <div className="md:col-span-3 text-right flex flex-col items-end justify-center border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                      <div className="mb-3 text-right">
                        <span className="text-xs text-slate-400 font-medium">AED </span>
                        <span className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
                          {plan.monthlyPremium.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500">/month</span>
                        <p className="text-[10px] text-slate-400">
                          Est. AED {(plan.monthlyPremium * 12).toLocaleString()} /yr
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isCurrentSelected || plan.isBestValue
                            ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <span>Select Plan</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Demo Disclaimer notice */}
        <div className="mt-8 text-center text-xs text-slate-500 max-w-xl mx-auto">
          <p>
            Demo estimate — actual premiums, eligibility and coverage are subject to insurer underwriting and current provider terms.
          </p>
        </div>
      </main>
    </div>
  );
};
