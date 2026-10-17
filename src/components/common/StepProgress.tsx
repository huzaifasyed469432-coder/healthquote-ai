import React from 'react';
import { ArrowLeft, Check, Shield } from 'lucide-react';
import { useQuote } from '../../context/QuoteContext';

interface StepProgressProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  onBack,
  title,
  subtitle
}) => {
  const { navigate } = useQuote();

  const steps = [
    { number: 1, label: 'Personal Details', path: '/quote/personal' },
    { number: 2, label: 'Health Information', path: '/quote/health' },
    { number: 3, label: 'AI Analysis', path: '/quote/analyzing' },
    { number: 4, label: 'Quote Results', path: '/quote/results' },
    { number: 5, label: 'Quote Summary', path: '/quote/summary' },
  ];

  const handleStepClick = (stepNum: number, path: string) => {
    // Only allow clicking to previously completed steps or current
    if (stepNum < currentStep) {
      navigate(path);
    }
  };

  return (
    <div className="w-full bg-white border-b border-slate-200/80 pt-4 pb-5 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Top Header in Step: Back Arrow + Brand */}
        <div className="flex items-center justify-between mb-5">
          {onBack ? (
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-medium"
              aria-label="Go back to previous step"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          ) : (
            <div className="w-8" />
          )}

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white">
              <Shield className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-base">
              HealthQuote<span className="text-sky-600"> AI</span>
            </span>
          </div>

          <div className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
            Step {currentStep} of 5
          </div>
        </div>

        {/* Step Circles Row */}
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Line */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
          
          {/* Active Progress Filled Line */}
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 h-0.5 bg-sky-500 transition-all duration-300 z-0"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 92}%` }}
          />

          {steps.map((s) => {
            const isCompleted = s.number < currentStep;
            const isCurrent = s.number === currentStep;
            const isClickable = s.number < currentStep;

            return (
              <div key={s.number} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  disabled={!isClickable && !isCurrent}
                  onClick={() => handleStepClick(s.number, s.path)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isCurrent
                      ? 'bg-sky-600 text-white ring-4 ring-sky-100 shadow-sm scale-110'
                      : isCompleted
                      ? 'bg-sky-600 text-white cursor-pointer hover:bg-sky-700'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                  aria-label={`Step ${s.number}: ${s.label}`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.number}
                </button>
                <span
                  className={`text-[11px] font-medium mt-1.5 hidden sm:block whitespace-nowrap ${
                    isCurrent
                      ? 'text-sky-600 font-bold'
                      : isCompleted
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Optional Title / Subtitle below step bar */}
        {(title || subtitle) && (
          <div className="mt-6 text-center sm:text-left">
            {title && (
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
