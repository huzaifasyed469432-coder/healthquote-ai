export type Gender = 'Male' | 'Female' | 'Other';
export type CoverageType = 'Individual' | 'Family';
export type CoverageDuration = '6 Months' | '1 Year' | '2 Years';
export type HealthStatus = 'Excellent' | 'Good' | 'Average' | 'Poor';
export type EmploymentStatus = 'Employed' | 'Self-Employed' | 'Business Owner' | 'Student' | 'Retired' | 'Unemployed';

export interface PersonalDetails {
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: Gender;
  nationality: string;
  cityCountry: string;
  employmentStatus: EmploymentStatus;
  monthlyIncome: string; // e.g. "10,000 - 15,000"
}

export interface HealthInformation {
  healthStatus: HealthStatus;
  hasPreExistingConditions: boolean;
  preExistingConditions: string[];
  otherConditionDescription?: string;
  coverageType: CoverageType;
  coverageDuration: CoverageDuration;
  familyMembersCount?: number;
  additionalNotes: string;
}

export interface InsurancePlan {
  id: string;
  provider: string;
  providerLogoText?: string;
  providerLogoColor?: string;
  planName: string;
  monthlyPremium: number; // in AED
  currency: string;
  coverageType: CoverageType;
  duration: CoverageDuration;
  inpatientCoverage: string;
  outpatientCoverage: string;
  maternityCoverage: string;
  dentalCoverage: string;
  visionCoverage: string;
  globalNetwork: string;
  hospitalCount: string;
  benefits: string[];
  isBestValue?: boolean;
  isPopular?: boolean;
  deductible: string;
  annualLimit: string;
  pharmacyCoverage: string;
  emergencyEvacuation: boolean;
  description: string;
  matchScore?: number;
  recommendationReasons?: string[];
}

export interface GroupEmployee {
  id: string;
  employeeId: string;
  name: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female';
  nationality: string;
  location: string;
  employmentStatus: string;
  salary: number;
  coverageTier: 'Basic' | 'Standard' | 'Executive';
  dependentsCount: number;
  hasPreExisting?: boolean;
}

export interface GroupQuotePlan {
  id: string;
  name: string;
  tier: 'Basic Group' | 'Standard Group' | 'Premium Group';
  provider: string;
  monthlyPerEmployee: number;
  inpatientLimit: string;
  outpatientCoverage: string;
  networkSize: string;
  benefits: string[];
  recommendedFor?: string;
}

export interface SavedQuote {
  id: string;
  quoteNumber: string;
  customerName: string;
  plan: InsurancePlan;
  personalDetails: PersonalDetails;
  healthInfo: HealthInformation;
  createdAt: string;
  monthlyPremium: number;
  annualPremium: number;
  status: 'Active' | 'Pending Review' | 'Application Started';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  timestamp: string;
}
