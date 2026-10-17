import { PersonalDetails, HealthInformation, InsurancePlan } from '../types/insurance';
import { MOCK_PLANS } from '../data/mockPlans';

export function calculateAge(dobString: string): number {
  if (!dobString) return 30;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return 30;
  const diffMs = Date.now() - dob.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

export function rankAndPersonalizePlans(
  personal: PersonalDetails,
  health: HealthInformation
): InsurancePlan[] {
  const age = calculateAge(personal.dateOfBirth);
  const isFamily = health.coverageType === 'Family';
  const hasPreExisting = health.hasPreExistingConditions;

  // Filter or prioritize by coverage type
  let plans = MOCK_PLANS.filter((p) => p.coverageType === health.coverageType);
  if (plans.length === 0) {
    plans = MOCK_PLANS;
  }

  return plans.map((plan) => {
    let score = 85;
    const reasons: string[] = [];

    // Evaluate matching factors
    if (plan.isBestValue) {
      score += 7;
      reasons.push('Best balance of comprehensive coverage and affordable monthly premium');
    }

    if (hasPreExisting) {
      if (plan.provider.includes('Cigna') || plan.provider.includes('Daman') || plan.provider.includes('MSH')) {
        score += 5;
        reasons.push('Excellent chronic condition and pre-existing care management network');
      }
    } else {
      reasons.push('Fast-track instant approval with standard underwriting criteria');
    }

    if (age > 45) {
      if (plan.monthlyPremium > 1500) {
        score += 4;
        reasons.push('High outpatient allowance suited for preventive screenings and specialist care');
      }
    } else {
      if (plan.id === 'cigna-essential') {
        score += 6;
        reasons.push('Ideal tier for young active professionals seeking prime hospital access without high deductibles');
      }
    }

    if (isFamily) {
      reasons.push('Includes pediatric well-child checks, mandatory vaccinations, and family dental support');
    } else {
      reasons.push('Wide direct billing network across over 1,000 certified clinics and hospitals in the UAE');
    }

    if (personal.cityCountry.toLowerCase().includes('dubai') || personal.cityCountry.toLowerCase().includes('uae')) {
      reasons.push('Fully compliant with DHA (Dubai Health Authority) health insurance requirements');
    }

    // Default reasons fallback
    if (reasons.length < 3) {
      reasons.push('24/7 multilingual telehealth consultations via mobile application');
      reasons.push('Zero hassle cashless pharmacy network across leading chains');
    }

    // Keep top 3 to 4 distinct reasons
    const distinctReasons = Array.from(new Set(reasons)).slice(0, 4);

    return {
      ...plan,
      matchScore: Math.min(99, Math.max(70, score)),
      recommendationReasons: distinctReasons
    };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}
