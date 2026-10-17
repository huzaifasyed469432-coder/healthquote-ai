import React, { useEffect, useState } from 'react';
import { useQuote } from '../../context/QuoteContext';
import { Shield, Pill, HeartPulse, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import aiRobotImg from '../../assets/images/ai_health_robot_1792231934522.jpg';

export const AiAnalysisStep: React.FC = () => {
  const { navigate } = useQuote();
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { label: 'Reviewing your details', threshold: 25 },
    { label: 'Checking plan eligibility', threshold: 50 },
    { label: 'Comparing top providers', threshold: 75 },
    { label: 'Calculating estimated premiums', threshold: 95 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/quote/results');
          }, 450);
          return 100;
        }

        // Realistic variable speed increment
        let increment = 4;
        if (prev > 60 && prev < 85) increment = 6;
        else if (prev >= 85) increment = 5;

        const next = Math.min(100, prev + increment);

        // Update active stages
        if (next >= 25 && next < 50) setCurrentStage(1);
        else if (next >= 50 && next < 75) setCurrentStage(2);
        else if (next >= 75 && next < 95) setCurrentStage(3);
        else if (next >= 95) setCurrentStage(4);

        return next;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Step Header */}
      <div className="w-full bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white">
              <Shield className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-base">
              HealthQuote<span className="text-sky-600"> AI</span>
            </span>
          </div>

          <div className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
            Step 3 of 5 · AI Analysis
          </div>
        </div>
      </div>

      {/* Main Analysis Visuals matching Screen 4 */}
      <main className="max-w-lg mx-auto px-4 py-8 w-full flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md text-center">
          {/* Animated AI Robot with Floating Healthcare Icons */}
          <div className="relative w-44 h-44 mx-auto mb-6 flex items-center justify-center">
            {/* Pulsing halo ring */}
            <div className="absolute inset-0 rounded-full bg-sky-100/70 animate-ping opacity-25" />
            
            {/* Robot Image Container */}
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-b from-sky-100 to-sky-200 flex items-center justify-center">
              <img
                src={aiRobotImg}
                alt="AI Health Analysis Assistant"
                className="w-full h-full object-cover scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Floating Orbit Icons */}
            <div className="absolute -top-1 left-2 w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-sky-500 animate-bounce">
              <HeartPulse className="w-4 h-4" />
            </div>

            <div className="absolute top-4 -right-1 w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-blue-600 animate-pulse">
              <Shield className="w-4 h-4" />
            </div>

            <div className="absolute bottom-1 -left-1 w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-teal-500">
              <Pill className="w-4 h-4" />
            </div>

            <div className="absolute -bottom-1 right-2 w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-sky-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          {/* Heading & Subtitle */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Analyzing Your Information...
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Our AI is checking the best plans, comparing coverage options and calculating your personalized quotes.
          </p>

          {/* Animated Checklist (matching Screen 4) */}
          <div className="mt-6 text-left space-y-2.5 max-w-xs mx-auto">
            {stages.map((stage, idx) => {
              const isDone = progress >= stage.threshold;
              const isActive = progress < stage.threshold && (idx === 0 || progress >= stages[idx - 1].threshold);

              return (
                <div
                  key={stage.label}
                  className={`flex items-center gap-2.5 text-xs font-semibold transition-colors duration-300 ${
                    isDone
                      ? 'text-emerald-600'
                      : isActive
                      ? 'text-sky-700 animate-pulse'
                      : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-600'
                        : isActive
                        ? 'bg-sky-100 text-sky-600'
                        : 'bg-slate-100 text-slate-300'
                    }`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <span>{stage.label}</span>
                </div>
              );
            })}
          </div>

          {/* Realistic Progress Bar */}
          <div className="mt-7">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5 px-1">
              <span>Matching algorithm</span>
              <span className="tabular-nums text-sky-600 font-mono">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Subtext info */}
          <p className="text-[11px] text-slate-400 mt-4">
            This usually takes less than 1 minute.
          </p>

          {/* Skip CTA button */}
          <div className="mt-5 pt-3 border-t border-slate-100">
            <button
              onClick={() => navigate('/quote/results')}
              className="text-xs font-semibold text-slate-500 hover:text-sky-600 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Skip directly to results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
