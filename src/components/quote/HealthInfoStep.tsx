import React from 'react';
import { useQuote } from '../../context/QuoteContext';
import { StepProgress } from '../common/StepProgress';
import { ArrowRight, Activity, Plus, Check } from 'lucide-react';
import { HealthStatus, CoverageType, CoverageDuration } from '../../types/insurance';

const COMMON_CONDITIONS = [
  'Diabetes',
  'Hypertension (High Blood Pressure)',
  'Asthma / Respiratory',
  'Heart Condition / Cardiovascular',
  'Thyroid Disorder',
  'Arthritis / Joint Condition',
  'Other Condition'
];

export const HealthInfoStep: React.FC = () => {
  const { healthInfo, setHealthInfo, navigate } = useQuote();

  const handleConditionToggle = (cond: string) => {
    const current = healthInfo.preExistingConditions || [];
    if (current.includes(cond)) {
      setHealthInfo({
        ...healthInfo,
        preExistingConditions: current.filter((c) => c !== cond)
      });
    } else {
      setHealthInfo({
        ...healthInfo,
        preExistingConditions: [...current, cond]
      });
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/quote/analyzing');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <StepProgress
          currentStep={2}
          onBack={() => navigate('/quote/personal')}
          title="A few more details"
          subtitle="This helps us match you with the right coverage."
        />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full">
          <form onSubmit={handleNext} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            {/* Current Health Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Health Status
              </label>
              <div className="relative">
                <select
                  value={healthInfo.healthStatus}
                  onChange={(e) =>
                    setHealthInfo({ ...healthInfo, healthStatus: e.target.value as HealthStatus })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm text-slate-800 bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="Excellent">Excellent - Active lifestyle, no medications</option>
                  <option value="Good">Good - Minor seasonal checkups</option>
                  <option value="Average">Average - Managed symptoms / periodic medication</option>
                  <option value="Poor">Poor - Ongoing chronic therapy</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Do you have any pre-existing conditions? */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Do you have any pre-existing conditions?
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-800 font-medium">
                  <input
                    type="radio"
                    name="preExisting"
                    checked={healthInfo.hasPreExistingConditions === true}
                    onChange={() => setHealthInfo({ ...healthInfo, hasPreExistingConditions: true })}
                    className="w-4 h-4 text-sky-600 focus:ring-sky-500 border-slate-300"
                  />
                  <span>Yes</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-800 font-medium">
                  <input
                    type="radio"
                    name="preExisting"
                    checked={healthInfo.hasPreExistingConditions === false}
                    onChange={() => setHealthInfo({ ...healthInfo, hasPreExistingConditions: false })}
                    className="w-4 h-4 text-sky-600 focus:ring-sky-500 border-slate-300"
                  />
                  <span>No</span>
                </label>
              </div>

              {/* Dynamic Pre-existing Condition Selector */}
              {healthInfo.hasPreExistingConditions && (
                <div className="mt-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-3 animate-in fade-in">
                  <p className="text-xs font-semibold text-sky-900">
                    Select declared conditions for accurate underwriter quotation:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_CONDITIONS.map((cond) => {
                      const isSelected = (healthInfo.preExistingConditions || []).includes(cond);
                      return (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => handleConditionToggle(cond)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-sky-400'
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{cond}</span>
                        </button>
                      );
                    })}
                  </div>

                  {(healthInfo.preExistingConditions || []).includes('Other Condition') && (
                    <div className="pt-1">
                      <input
                        type="text"
                        placeholder="Please specify other medical condition..."
                        value={healthInfo.otherConditionDescription || ''}
                        onChange={(e) =>
                          setHealthInfo({
                            ...healthInfo,
                            otherConditionDescription: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-sky-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Preferred Coverage Type */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Preferred Coverage Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    healthInfo.coverageType === 'Individual'
                      ? 'border-sky-600 bg-sky-50/50 ring-2 ring-sky-500/20'
                      : 'border-slate-300 hover:border-slate-400 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="coverageType"
                    checked={healthInfo.coverageType === 'Individual'}
                    onChange={() => setHealthInfo({ ...healthInfo, coverageType: 'Individual' })}
                    className="w-4 h-4 text-sky-600 focus:ring-sky-500 border-slate-300"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Individual</p>
                    <p className="text-[11px] text-slate-500">For myself only</p>
                  </div>
                </label>

                <label
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    healthInfo.coverageType === 'Family'
                      ? 'border-sky-600 bg-sky-50/50 ring-2 ring-sky-500/20'
                      : 'border-slate-300 hover:border-slate-400 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="coverageType"
                    checked={healthInfo.coverageType === 'Family'}
                    onChange={() => setHealthInfo({ ...healthInfo, coverageType: 'Family' })}
                    className="w-4 h-4 text-sky-600 focus:ring-sky-500 border-slate-300"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Family</p>
                    <p className="text-[11px] text-slate-500">Spouse & Dependents</p>
                  </div>
                </label>
              </div>

              {healthInfo.coverageType === 'Family' && (
                <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-medium text-slate-700">Total Family Members:</span>
                  <select
                    value={healthInfo.familyMembersCount || 2}
                    onChange={(e) =>
                      setHealthInfo({ ...healthInfo, familyMembersCount: Number(e.target.value) })
                    }
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
                  >
                    <option value={2}>2 Members (Couple)</option>
                    <option value={3}>3 Members (Couple + 1 Child)</option>
                    <option value={4}>4 Members (Couple + 2 Children)</option>
                    <option value={5}>5+ Members</option>
                  </select>
                </div>
              )}
            </div>

            {/* Coverage Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Coverage Duration
              </label>
              <div className="relative">
                <select
                  value={healthInfo.coverageDuration}
                  onChange={(e) =>
                    setHealthInfo({
                      ...healthInfo,
                      coverageDuration: e.target.value as CoverageDuration
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm text-slate-800 bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year (Standard Renewable)</option>
                  <option value="2 Years">2 Years (Multi-Year Rate Guarantee)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Additional Notes (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Any specific requirements?"
                value={healthInfo.additionalNotes}
                onChange={(e) => setHealthInfo({ ...healthInfo, additionalNotes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all"
              />
            </div>

            {/* Next Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
