import React from 'react';
import { useQuote } from '../../context/QuoteContext';
import {
  Shield,
  ArrowLeft,
  Building,
  Stethoscope,
  Heart,
  Globe,
  Check,
  Download,
  ArrowRight,
  FileText,
  BadgePercent,
  Pill,
  Sparkles
} from 'lucide-react';
import { downloadQuotePdfFile } from '../../services/pdfGenerator';

export const QuoteDetailsStep: React.FC = () => {
  const { selectedPlan, personalDetails, healthInfo, navigate, showToast } = useQuote();

  const plan = selectedPlan || {
    id: 'cigna-essential',
    provider: 'Cigna Healthcare',
    planName: 'Essential Care',
    monthlyPremium: 1250,
    currency: 'AED',
    coverageType: 'Individual',
    duration: '1 Year',
    inpatientCoverage: 'Up to AED 500,000',
    outpatientCoverage: 'Up to AED 250,000',
    maternityCoverage: 'Up to AED 50,000',
    dentalCoverage: '80% up to AED 7,500',
    visionCoverage: 'Annual checkup + frames',
    globalNetwork: 'Over 1,000 hospitals',
    hospitalCount: '1,200+ Hospitals',
    annualLimit: 'AED 1,000,000',
    deductible: 'AED 50 per outpatient visit',
    pharmacyCoverage: '100% generic medications',
    emergencyEvacuation: true,
    isBestValue: true,
    benefits: ['Inpatient & Outpatient Coverage', 'Maternity (Optional)', 'Global Network'],
    description: 'Comprehensive essential protection balancing broad UAE network coverage with cost-effective monthly premiums.'
  };

  const handleDownloadPdf = () => {
    try {
      downloadQuotePdfFile(plan, personalDetails, healthInfo);
      showToast('Downloading your official PDF quote document...', 'success');
    } catch (err) {
      showToast('Could not download PDF. Please try previewing.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Step Header matching Screen 6 */}
      <div className="w-full bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/quote/results')}
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
            onClick={handleDownloadPdf}
            className="p-2 text-slate-600 hover:text-sky-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            title="Download Quote PDF"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
          {/* Top Plan Header with Best Value Badge */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              {plan.isBestValue && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                  Best Value
                </span>
              )}
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {plan.provider}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {plan.planName}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {plan.coverageType} Health Insurance Plan · {plan.duration}
              </p>
            </div>

            {/* Price display matching reference */}
            <div className="sm:text-right">
              <span className="text-xs text-slate-400 font-medium">AED </span>
              <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">
                {plan.monthlyPremium.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500"> /month</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Annual Total: AED {(plan.monthlyPremium * 12).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Coverage Summary Grid matching Screen 6 (Inpatient, Outpatient, Maternity, Global) */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Coverage Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Inpatient */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Inpatient Coverage</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{plan.inpatientCoverage}</p>
                </div>
              </div>

              {/* Outpatient */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Outpatient Coverage</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{plan.outpatientCoverage}</p>
                </div>
              </div>

              {/* Maternity */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Maternity (Optional)</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{plan.maternityCoverage}</p>
                </div>
              </div>

              {/* Global Network */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Global Network</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{plan.globalNetwork}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Extended Limits Grid */}
          <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200/60 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Annual Overall Limit</span>
              <span className="font-bold text-slate-800">{plan.annualLimit || 'AED 1,000,000'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Consultation Co-Pay</span>
              <span className="font-bold text-slate-800">{plan.deductible || 'AED 50'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Pharmacy Benefit</span>
              <span className="font-bold text-slate-800">{plan.pharmacyCoverage || '100% covered'}</span>
            </div>
          </div>

          {/* "Why this plan?" section matching Screen 6 */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">Why this plan?</h3>
            </div>
            <div className="space-y-2">
              {(plan.recommendationReasons && plan.recommendationReasons.length > 0
                ? plan.recommendationReasons
                : [
                    'Best balance of coverage and cost',
                    'Wide network of hospitals',
                    'Strong customer support'
                  ]
              ).map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs matching Screen 6 */}
          <div className="pt-4 space-y-3">
            <button
              type="button"
              onClick={() => navigate('/quote/summary')}
              className="w-full py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/quote/pdf')}
              className="w-full py-3 px-6 rounded-xl bg-white hover:bg-slate-50 text-sky-700 border border-sky-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Preview & Download Full Quote (PDF)</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
