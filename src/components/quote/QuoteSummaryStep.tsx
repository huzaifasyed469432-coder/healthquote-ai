import React, { useState } from 'react';
import { useQuote } from '../../context/QuoteContext';
import {
  Shield,
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Briefcase,
  Layers,
  Download,
  Bookmark,
  CheckCircle2,
  FileCheck,
  CreditCard,
  MailCheck,
  Sparkles
} from 'lucide-react';
import { calculateAge } from '../../services/recommendationEngine';
import { downloadQuotePdfFile } from '../../services/pdfGenerator';
import confetti from 'canvas-confetti';

export const QuoteSummaryStep: React.FC = () => {
  const {
    selectedPlan,
    personalDetails,
    healthInfo,
    saveCurrentQuote,
    navigate,
    showToast
  } = useQuote();

  const [hasSaved, setHasSaved] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

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
    benefits: ['Inpatient & Outpatient Coverage', 'Maternity (Optional)', 'Global Network'],
    description: 'Comprehensive essential protection balancing broad UAE network coverage with cost-effective monthly premiums.'
  };

  const age = calculateAge(personalDetails.dateOfBirth);

  const handleDownload = () => {
    try {
      downloadQuotePdfFile(plan, personalDetails, healthInfo);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      showToast('Official Health Quote PDF downloaded successfully!', 'success');
    } catch {
      navigate('/quote/pdf');
    }
  };

  const handleSaveAndContinueLater = () => {
    saveCurrentQuote();
    setHasSaved(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <div className="w-full bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/quote/details')}
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

          <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
            Quote Ready
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Quote Summary
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your customized quote details before application submission or PDF download.
            </p>
          </div>

          {/* Selected Plan Snapshot (matching Screen 7) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50/80 to-blue-50/80 border border-sky-100 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                {plan.provider}
              </p>
              <h3 className="text-lg font-bold text-slate-900">
                {plan.planName}
              </h3>
              <p className="text-xs text-slate-500">
                {healthInfo.coverageType} · {healthInfo.coverageDuration || '1 Year'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">AED </span>
              <span className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
                {plan.monthlyPremium.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">/month</span>
              <p className="text-[10px] text-slate-400">
                AED {(plan.monthlyPremium * 12).toLocaleString()} /year
              </p>
            </div>
          </div>

          {/* Your Details (matching Screen 7) */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Your Details
            </h3>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/40 divide-y divide-slate-100 text-xs">
              <div className="p-3 sm:px-4 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500 font-medium">
                  <User className="w-4 h-4 text-slate-400" /> Name:
                </span>
                <span className="font-bold text-slate-800">
                  {personalDetails.fullName || 'Muhammad Ali'}
                </span>
              </div>

              <div className="p-3 sm:px-4 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500 font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" /> Age:
                </span>
                <span className="font-bold text-slate-800">
                  {age} Years ({personalDetails.gender || 'Male'})
                </span>
              </div>

              <div className="p-3 sm:px-4 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500 font-medium">
                  <MapPin className="w-4 h-4 text-slate-400" /> Location:
                </span>
                <span className="font-bold text-slate-800">
                  {personalDetails.cityCountry || 'Dubai, UAE'}
                </span>
              </div>

              <div className="p-3 sm:px-4 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500 font-medium">
                  <Briefcase className="w-4 h-4 text-slate-400" /> Employment:
                </span>
                <span className="font-bold text-slate-800">
                  {personalDetails.employmentStatus || 'Employed'}
                </span>
              </div>

              <div className="p-3 sm:px-4 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500 font-medium">
                  <Layers className="w-4 h-4 text-slate-400" /> Coverage:
                </span>
                <span className="font-bold text-slate-800">
                  {healthInfo.coverageType} ({healthInfo.coverageDuration || '1 Year'})
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps (matching Screen 7) */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Next Steps
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Review your quote</p>
                  <p className="text-[11px] text-slate-500">Check hospital network, limits and monthly premium.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Complete application</p>
                  <p className="text-[11px] text-slate-500">Submit standard medical questionnaire and Emirates ID.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Make secure payment</p>
                  <p className="text-[11px] text-slate-500">Card, direct debit, or corporate bank transfer in AED.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Receive policy documents</p>
                  <p className="text-[11px] text-slate-500">Instant digital insurance card & DHA visa compliance certificate.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons (matching Screen 7) */}
          <div className="pt-3 space-y-3">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Quote (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/quote/pdf')}
              className="w-full py-3 px-6 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-sky-600" />
              <span>Interactive PDF Previewer</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndContinueLater}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                hasSaved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
            >
              {hasSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Saved to Portfolio</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-slate-500" />
                  <span>Save & Continue Later</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowApplicationModal(true)}
                className="text-xs font-semibold text-sky-600 hover:underline cursor-pointer"
              >
                Proceed to Online Application Demo &rarr;
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Online Application Demo Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">Application Demo Notice</h3>
              </div>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This is a demonstration prototype. In production, this step transfers your verified customer record directly to {plan.provider}&apos;s API endpoint for KYC, Emirates ID upload, and instant DHA policy issuance.
            </p>

            <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-900 space-y-1">
              <p className="font-bold">Next simulated actions:</p>
              <p>• Download your generated PDF quote document</p>
              <p>• Save the quotation to your portfolio to view later</p>
              <p>• Test Group Employee Census upload</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  handleDownload();
                }}
                className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Download PDF
              </button>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
