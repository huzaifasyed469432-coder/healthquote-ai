import React, { useState } from 'react';
import { useQuote } from '../../context/QuoteContext';
import { StepProgress } from '../common/StepProgress';
import { User, Calendar, MapPin, Briefcase, Coins, Globe, ArrowRight } from 'lucide-react';
import { Gender, EmploymentStatus } from '../../types/insurance';

export const PersonalDetailsStep: React.FC = () => {
  const { personalDetails, setPersonalDetails, navigate, showToast } = useQuote();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!personalDetails.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    } else if (personalDetails.fullName.trim().length < 2) {
      errs.fullName = 'Please enter a valid full name';
    }

    if (!personalDetails.dateOfBirth) {
      errs.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(personalDetails.dateOfBirth);
      const now = new Date();
      if (isNaN(dob.getTime()) || dob >= now) {
        errs.dateOfBirth = 'Please enter a valid past birth date';
      }
    }

    if (!personalDetails.cityCountry.trim()) {
      errs.cityCountry = 'City / Country of residence is required';
    }

    if (!personalDetails.nationality.trim()) {
      errs.nationality = 'Nationality is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      navigate('/quote/health');
    } else {
      showToast('Please complete all required fields.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <StepProgress
          currentStep={1}
          onBack={() => navigate('/')}
          title="Tell us about yourself"
          subtitle="This helps us find the best plans for your needs."
        />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full">
          <form onSubmit={handleNext} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Muhammad Ali"
                  value={personalDetails.fullName}
                  onChange={(e) => {
                    setPersonalDetails({ ...personalDetails, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 transition-all ${
                    errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 hover:border-slate-400 focus:border-sky-500'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.fullName}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  value={personalDetails.dateOfBirth}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setPersonalDetails({ ...personalDetails, dateOfBirth: e.target.value });
                    if (errors.dateOfBirth) setErrors({ ...errors, dateOfBirth: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 transition-all ${
                    errors.dateOfBirth ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 hover:border-slate-400 focus:border-sky-500'
                  }`}
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <select
                  value={personalDetails.gender}
                  onChange={(e) =>
                    setPersonalDetails({ ...personalDetails, gender: e.target.value as Gender })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm text-slate-800 bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nationality <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Pakistani, Emirati, Indian, British"
                  value={personalDetails.nationality}
                  onChange={(e) => {
                    setPersonalDetails({ ...personalDetails, nationality: e.target.value });
                    if (errors.nationality) setErrors({ ...errors, nationality: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 transition-all ${
                    errors.nationality ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 hover:border-slate-400 focus:border-sky-500'
                  }`}
                />
              </div>
              {errors.nationality && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.nationality}</p>
              )}
            </div>

            {/* City / Country of Residence */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                City / Country of Residence <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Dubai, UAE"
                  value={personalDetails.cityCountry}
                  onChange={(e) => {
                    setPersonalDetails({ ...personalDetails, cityCountry: e.target.value });
                    if (errors.cityCountry) setErrors({ ...errors, cityCountry: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 transition-all ${
                    errors.cityCountry ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 hover:border-slate-400 focus:border-sky-500'
                  }`}
                />
              </div>
              {errors.cityCountry && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.cityCountry}</p>
              )}
            </div>

            {/* Employment Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Employment Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <select
                  value={personalDetails.employmentStatus}
                  onChange={(e) =>
                    setPersonalDetails({
                      ...personalDetails,
                      employmentStatus: e.target.value as EmploymentStatus
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm text-slate-800 bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="Employed">Employed</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Student">Student</option>
                  <option value="Retired">Retired</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Monthly Income (AED) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Monthly Income (AED)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Coins className="w-4 h-4" />
                </div>
                <select
                  value={personalDetails.monthlyIncome}
                  onChange={(e) =>
                    setPersonalDetails({ ...personalDetails, monthlyIncome: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm text-slate-800 bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="Under 5,000">Under AED 5,000</option>
                  <option value="5,000 - 10,000">AED 5,000 - 10,000</option>
                  <option value="10,000 - 15,000">AED 10,000 - 15,000</option>
                  <option value="15,000 - 25,000">AED 15,000 - 25,000</option>
                  <option value="25,000 - 50,000">AED 25,000 - 50,000</option>
                  <option value="Above 50,000">Above AED 50,000</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-4">
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
