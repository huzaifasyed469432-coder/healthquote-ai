import React from 'react';
import { useQuote } from '../../context/QuoteContext';
import { Zap, ShieldCheck, Cpu, ArrowRight, Users, Sparkles, CheckCircle2, HeartPulse, Building2, Clock } from 'lucide-react';
import heroDoctorsImg from '../../assets/images/hero_healthcare_doctors_1792231934188.jpg';

export const LandingPage: React.FC = () => {
  const { navigate, loadDemoQuote } = useQuote();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        {/* Mobile / Screen 1 Reference Blue Hero Box */}
        <div className="bg-gradient-to-br from-blue-700 via-sky-600 to-sky-700 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Subtle geometric background glow circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium tracking-wide">
                <HeartPulse className="w-3.5 h-3.5 text-sky-200" />
                <span>UAE & Worldwide Accredited Health Plans</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-balance">
                Get Your Health Insurance Quote in Seconds
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-sky-100 max-w-xl font-normal leading-relaxed">
                AI-powered health insurance quotes for individuals and businesses. Compare DHA-compliant rates from top carriers instantly.
              </p>

              {/* 3 Feature Cards (matching reference Screen 1) */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center border border-white/15 hover:bg-white/15 transition-colors">
                  <div className="w-9 h-9 mx-auto rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-xs font-semibold leading-tight">Instant Quotes</p>
                  <p className="text-[10px] text-sky-200 mt-0.5 hidden sm:block">Under 60s</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center border border-white/15 hover:bg-white/15 transition-colors">
                  <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center mb-2">
                    <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <p className="text-xs font-semibold leading-tight">Trusted Providers</p>
                  <p className="text-[10px] text-sky-200 mt-0.5 hidden sm:block">Cigna, Daman, Bupa</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center border border-white/15 hover:bg-white/15 transition-colors">
                  <div className="w-9 h-9 mx-auto rounded-xl bg-sky-300/20 text-sky-200 flex items-center justify-center mb-2">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold leading-tight">AI Powered</p>
                  <p className="text-[10px] text-sky-200 mt-0.5 hidden sm:block">Personalized Fit</p>
                </div>
              </div>

              {/* Primary Interactive CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
                <button
                  onClick={() => navigate('/quote/personal')}
                  className="inline-flex items-center justify-center gap-2.5 bg-white text-blue-700 hover:bg-sky-50 active:bg-sky-100 font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => navigate('/group')}
                  className="inline-flex items-center justify-center gap-2 bg-sky-800/80 hover:bg-sky-800 text-white font-semibold px-5 py-3.5 rounded-xl border border-white/20 transition-all cursor-pointer text-sm"
                >
                  <Users className="w-4 h-4" />
                  <span>Get Group Quote</span>
                </button>

                <button
                  onClick={loadDemoQuote}
                  className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-sky-100 font-medium px-4 py-3.5 rounded-xl border border-white/15 transition-all cursor-pointer text-xs"
                  title="Loads pre-filled sample quote matching reference images"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Try Demo Quote</span>
                </button>
              </div>
            </div>

            {/* Right Media Card (matching Screen 1: "Better Health Brighter Future") */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-2xl p-3 shadow-2xl relative group transform hover:rotate-0.5 transition-transform">
                {/* Photo container */}
                <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-sky-100">
                  <img
                    src={heroDoctorsImg}
                    alt="Professional healthcare doctors in modern hospital"
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Subtle overlay badge matching reference */}
                  <div className="absolute right-4 top-4 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-100/80 text-right">
                    <p className="text-xs font-serif italic text-sky-800 font-bold leading-tight">
                      Better Health
                    </p>
                    <p className="text-xs font-serif italic text-blue-600 font-bold leading-tight">
                      Brighter Future
                    </p>
                  </div>
                </div>

                {/* Micro info bar under photo */}
                <div className="pt-3 px-1 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Live Underwriting Online</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">AED Benchmark 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Highlights Row */}
        <section className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 tabular-nums">60 Sec</p>
              <p className="text-xs text-slate-500 font-medium">Average Quote Time</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 tabular-nums">3,000+</p>
              <p className="text-xs text-slate-500 font-medium">Direct Billing Centers</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 tabular-nums">100%</p>
              <p className="text-xs text-slate-500 font-medium">DHA & MOH Compliant</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 tabular-nums">SME & Group</p>
              <p className="text-xs text-slate-500 font-medium">Employee Census Tool</p>
            </div>
          </div>
        </section>

        {/* How It Works Steps */}
        <section className="mt-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How HealthQuote AI Works
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              From your basic details to an official policy quote in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 font-bold flex items-center justify-center mb-4 text-base">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Enter Your Details</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Provide your basic profile, residence city, and coverage preferences (individual or family).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center mb-4 text-base">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Analyzes Top Insurers</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Our algorithm matches your health status against Cigna, Daman, MSH, Bupa and Allianz rate books.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-4 text-base">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Download Official PDF</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Compare benefit limits, select your plan, and immediately download your formal PDF quote.
              </p>
            </div>
          </div>
        </section>

        {/* Carrier Logos Ribbon */}
        <section className="mt-14 pt-8 pb-4 border-t border-slate-200/70 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-6">
            Trusted Carrier Networks & Direct Billing Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-600 font-bold text-sm">
            <span className="hover:text-sky-600 transition-colors">Cigna Healthcare</span>
            <span className="hover:text-sky-600 transition-colors">Daman National Health</span>
            <span className="hover:text-sky-600 transition-colors">MSH International</span>
            <span className="hover:text-sky-600 transition-colors">Bupa Global</span>
            <span className="hover:text-sky-600 transition-colors">Allianz Care</span>
            <span className="hover:text-sky-600 transition-colors">Sukoon Insurance</span>
          </div>
        </section>
      </main>
    </div>
  );
};
