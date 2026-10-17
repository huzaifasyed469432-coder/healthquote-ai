import React, { useState } from 'react';
import { useQuote } from '../../context/QuoteContext';
import {
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  Shield,
  Building,
  Stethoscope,
  Heart,
  Globe,
  FileCheck
} from 'lucide-react';
import { calculateAge } from '../../services/recommendationEngine';
import { downloadQuotePdfFile } from '../../services/pdfGenerator';

export const PdfPreviewStep: React.FC = () => {
  const { selectedPlan, personalDetails, healthInfo, navigate, showToast } = useQuote();
  const [zoom, setZoom] = useState<number>(100);

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
      showToast('Downloading official PDF quote...', 'success');
    } catch {
      showToast('Failed to trigger download.', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const zoomIn = () => setZoom((prev) => Math.min(150, prev + 15));
  const zoomOut = () => setZoom((prev) => Math.max(70, prev - 15));

  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 flex flex-col">
      {/* Top PDF Dark Viewer Bar matching Screen 8 */}
      <div className="bg-slate-900 border-b border-slate-700/80 px-4 py-2.5 flex items-center justify-between shadow-md sticky top-0 z-40 no-print">
        {/* Left: Back + Doc name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/quote/summary')}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Back to summary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-200">
              Health_Quote_{personalDetails.fullName ? personalDetails.fullName.replace(/\s+/g, '_') : 'Member'}.pdf
            </span>
          </div>
        </div>

        {/* Center: Page & Zoom controls */}
        <div className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
          <span className="text-slate-400">1 / 1</span>
          <span className="text-slate-600">|</span>
          <button
            onClick={zoomOut}
            className="p-1 text-slate-300 hover:text-white cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-slate-300 min-w-10 text-center">{zoom}%</span>
          <button
            onClick={zoomIn}
            className="p-1 text-slate-300 hover:text-white cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Download PDF file"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
            title="Print Document"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Document Canvas Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-slate-800/90">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200"
        >
          {/* Authentic A4-like Document Page Container */}
          <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-12 shadow-2xl rounded-sm font-sans flex flex-col justify-between border border-slate-300">
            {/* Document Header */}
            <div>
              <div className="flex items-start justify-between border-b-2 border-sky-600 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-sky-600">
                    <Shield className="w-6 h-6 stroke-[2.5]" />
                    <span className="text-xl font-black tracking-tight text-slate-900">
                      HealthQuote<span className="text-sky-600"> AI</span>
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
                    Smart. Fast. Reliable.
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-sky-700 tracking-wide">
                    {plan.provider}
                  </div>
                  <span className="inline-block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Authorized Quote Schedule
                  </span>
                </div>
              </div>

              {/* Title Section */}
              <div className="mt-6 mb-6">
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-wide">
                  HEALTH INSURANCE QUOTATION
                </h1>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-1">
                  <span>Ref: HQ-829104</span>
                  <span>·</span>
                  <span>Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>·</span>
                  <span>Valid for 30 days</span>
                </div>
              </div>

              {/* Two Column Grid: Policy Details & Member Details (matching Screen 8) */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Left: Policy Details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h3 className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-3">
                    Policy Details
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Plan Name:</span>
                      <span className="font-bold text-slate-900">{plan.planName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Coverage Type:</span>
                      <span className="font-bold text-slate-900">{healthInfo.coverageType || 'Individual'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Duration:</span>
                      <span className="font-bold text-slate-900">{healthInfo.coverageDuration || '1 Year'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly Premium:</span>
                      <span className="font-bold text-slate-900">AED {plan.monthlyPremium.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Currency:</span>
                      <span className="font-bold text-slate-900">{plan.currency}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Member Details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h3 className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-3">
                    Member Details
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name:</span>
                      <span className="font-bold text-slate-900">{personalDetails.fullName || 'Muhammad Ali'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Age:</span>
                      <span className="font-bold text-slate-900">{age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-bold text-slate-900">{personalDetails.cityCountry || 'Dubai, UAE'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Employment:</span>
                      <span className="font-bold text-slate-900">{personalDetails.employmentStatus || 'Employed'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Health Status:</span>
                      <span className="font-bold text-slate-900">{healthInfo.healthStatus || 'Good'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coverage Benefits Grid matching Screen 8 */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Coverage Benefits
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="border border-slate-200 rounded-xl p-3 text-center bg-white">
                    <Building className="w-5 h-5 mx-auto text-sky-600 mb-1" />
                    <p className="text-[10px] text-slate-500 font-medium">Inpatient</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{plan.inpatientCoverage}</p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3 text-center bg-white">
                    <Stethoscope className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                    <p className="text-[10px] text-slate-500 font-medium">Outpatient</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{plan.outpatientCoverage}</p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3 text-center bg-white">
                    <Heart className="w-5 h-5 mx-auto text-rose-500 mb-1" />
                    <p className="text-[10px] text-slate-500 font-medium">Maternity</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{plan.maternityCoverage}</p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3 text-center bg-white">
                    <Globe className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                    <p className="text-[10px] text-slate-500 font-medium">Global Network</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{plan.hospitalCount || '1,000+ Hospitals'}</p>
                  </div>
                </div>
              </div>

              {/* AI Recommendation Summary */}
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 mb-8">
                <p className="text-xs font-bold text-sky-900 mb-1.5">
                  Personalized Recommendation Fit
                </p>
                <p className="text-xs text-sky-800 leading-relaxed">
                  Based on applicant age ({age}) and declared profile, this plan provides full compliance with Dubai Health Authority (DHA) mandatory coverage requirements, offering cashless direct settlement across leading hospitals.
                </p>
              </div>
            </div>

            {/* Document Bottom Footer matching Screen 8 */}
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Your Health. Our Priority.</h4>
                  <p className="text-[10px] text-slate-500 max-w-md mt-0.5 leading-normal">
                    This is a sample quote. Final terms and conditions may vary based on the selected provider and policy details.
                  </p>
                </div>
                <div className="text-right text-xs font-bold text-sky-700">
                  {plan.provider}
                </div>
              </div>

              <div className="text-[9px] text-slate-400 text-center pt-2 border-t border-slate-100">
                Generated via HealthQuote AI Platform · Document Ref: HQ-DEMO-82910 · For illustrative purposes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
