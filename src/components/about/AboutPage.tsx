import React from 'react';
import { useQuote } from '../../context/QuoteContext';
import { Shield, Sparkles, Award, Lock, ArrowRight, HeartPulse, Building2, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate, loadDemoQuote } = useQuote();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Healthcare Intelligence Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Smart. Fast. Reliable.
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            HealthQuote AI was designed to eliminate the friction, confusing fine print, and slow turnaround times of traditional health insurance quotations.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">AI-Powered Matching</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our recommendation engine evaluates age, location, pre-existing history, and coverage limits to match you with top-rated UAE plans.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">DHA & MOH Compliant</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every quoted plan conforms to Dubai Health Authority and UAE Ministry of Health residency visa regulations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Private & Transparent</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transparent pricing with no hidden charges. In this prototype, data is retained strictly in your browser session.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs mb-12 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">
            About Our Quotation Engine
          </h2>
          <p>
            Whether you are an individual relocating to Dubai, a family looking for comprehensive maternity and pediatric cover, or an enterprise HR team uploading an employee census for 500+ staff members, HealthQuote AI standardizes the quotation pipeline.
          </p>
          <p>
            We interface with benchmark rate tariffs from accredited carriers including Cigna Healthcare, Daman National Health Insurance Company, MSH International, Bupa Global, Allianz Care, and Sukoon Insurance.
          </p>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/quote/personal')}
              className="px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-sky-700 cursor-pointer flex items-center gap-1.5"
            >
              <span>Get Individual Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/group')}
              className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 cursor-pointer"
            >
              Explore Group Quotes
            </button>
            <button
              onClick={loadDemoQuote}
              className="px-5 py-2.5 bg-sky-50 text-sky-700 border border-sky-200 font-bold text-xs rounded-xl hover:bg-sky-100 cursor-pointer"
            >
              Try Pre-filled Demo Quote
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
