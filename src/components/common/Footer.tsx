import React from 'react';
import { Shield, Lock, Award, HeartHandshake, ExternalLink } from 'lucide-react';
import { useQuote } from '../../context/QuoteContext';

export const Footer: React.FC = () => {
  const { navigate } = useQuote();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <Shield className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                HealthQuote<span className="text-sky-400"> AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-powered health insurance quotation platform delivering instant, transparent comparisons for individuals, families, and businesses across the UAE and globally.
            </p>
            <div className="flex items-center gap-3 text-xs text-sky-400 font-medium">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> 256-bit Encrypted
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> DHA / MOH Compliant
              </span>
            </div>
          </div>

          {/* Quotations Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Insurance Quotes
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/quote/personal')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Individual Health Insurance
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/quote/personal')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Family Medical Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/group')}
                  className="hover:text-white transition-colors cursor-pointer text-left text-sky-400 font-medium"
                >
                  Employee Census & Group Quotes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/saved-quotes')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Saved Quotation Portfolio
                </button>
              </li>
            </ul>
          </div>

          {/* Insurer Partners */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Network Insurers
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <span className="py-1 px-2 rounded bg-slate-800/80">Cigna Healthcare</span>
              <span className="py-1 px-2 rounded bg-slate-800/80">Daman National</span>
              <span className="py-1 px-2 rounded bg-slate-800/80">MSH International</span>
              <span className="py-1 px-2 rounded bg-slate-800/80">Bupa Global</span>
              <span className="py-1 px-2 rounded bg-slate-800/80">Allianz Care</span>
              <span className="py-1 px-2 rounded bg-slate-800/80">Sukoon Insurance</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Direct billing across 3,000+ certified regional hospitals, clinics & pharmacies.
            </p>
          </div>

          {/* Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Assistance & Help
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact Medical Underwriter
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About HealthQuote AI
                </button>
              </li>
              <li className="pt-2 text-xs text-slate-400">
                Support: <span className="text-slate-200">quotes@healthquote-ai.ae</span>
              </li>
              <li className="text-xs text-slate-400">
                Helpline: <span className="text-slate-200">+971 4 800 4325</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Transparent Legal Disclaimer Required by Brief */}
        <div className="mt-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-sky-400 shrink-0" />
            Prototype Notice & Pricing Disclaimer
          </p>
          <p>
            HealthQuote AI provides illustrative demo estimates based on entered demographic parameters and benchmark schedule rates in AED. Actual policy issuance, binding premiums, medical underwriting approval, pre-existing condition waiting periods, and formal policy documentation are subject to final evaluation by the licensed insurance carrier in accordance with DHA/MOH regulations.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} HealthQuote AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/about')} className="hover:text-slate-300">Privacy Policy</button>
            <button onClick={() => navigate('/about')} className="hover:text-slate-300">Terms of Use</button>
            <button onClick={() => navigate('/contact')} className="hover:text-slate-300">Support Desk</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
