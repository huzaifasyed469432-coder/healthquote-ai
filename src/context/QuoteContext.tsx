import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PersonalDetails,
  HealthInformation,
  InsurancePlan,
  SavedQuote,
  GroupEmployee,
  GroupQuotePlan,
  ContactMessage
} from '../types/insurance';
import { MOCK_PLANS, SAMPLE_EMPLOYEE_CENSUS, MOCK_GROUP_PLANS } from '../data/mockPlans';
import { rankAndPersonalizePlans, calculateAge } from '../services/recommendationEngine';

interface ToastInfo {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface QuoteContextType {
  // Navigation & Current Route
  currentPath: string;
  navigate: (path: string) => void;

  // Individual / Family Quote State
  personalDetails: PersonalDetails;
  setPersonalDetails: React.Dispatch<React.SetStateAction<PersonalDetails>>;
  healthInfo: HealthInformation;
  setHealthInfo: React.Dispatch<React.SetStateAction<HealthInformation>>;
  selectedPlan: InsurancePlan | null;
  setSelectedPlan: (plan: InsurancePlan | null) => void;
  availablePlans: InsurancePlan[];
  setAvailablePlans: React.Dispatch<React.SetStateAction<InsurancePlan[]>>;

  // Action helpers
  loadDemoQuote: () => void;
  saveCurrentQuote: () => void;
  deleteSavedQuote: (id: string) => void;
  loadSavedQuote: (quote: SavedQuote) => void;
  savedQuotes: SavedQuote[];

  // Group Quote State
  groupEmployees: GroupEmployee[];
  setGroupEmployees: React.Dispatch<React.SetStateAction<GroupEmployee[]>>;
  selectedGroupPlan: GroupQuotePlan | null;
  setSelectedGroupPlan: (plan: GroupQuotePlan | null) => void;
  loadSampleCensus: () => void;
  groupMetrics: {
    totalEmployees: number;
    eligibleEmployees: number;
    dependentsCount: number;
    averageAge: number;
    totalHeadcount: number;
    baseEstimatedMonthly: number;
    baseEstimatedAnnual: number;
  };

  // Contact Messages
  contactMessages: ContactMessage[];
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'timestamp'>) => void;

  // Notification Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Analysis progress
  analysisProgress: number;
  setAnalysisProgress: React.Dispatch<React.SetStateAction<number>>;
  isAnalyzing: boolean;
  setIsAnalyzing: (state: boolean) => void;
}

const defaultPersonalDetails: PersonalDetails = {
  fullName: '',
  dateOfBirth: '',
  gender: 'Male',
  nationality: 'Emirati',
  cityCountry: 'Dubai, UAE',
  employmentStatus: 'Employed',
  monthlyIncome: '10,000 - 15,000'
};

const defaultHealthInfo: HealthInformation = {
  healthStatus: 'Good',
  hasPreExistingConditions: false,
  preExistingConditions: [],
  otherConditionDescription: '',
  coverageType: 'Individual',
  coverageDuration: '1 Year',
  familyMembersCount: 1,
  additionalNotes: ''
};

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync with browser URL / hash or local route
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname && window.location.pathname !== '/'
      ? window.location.pathname
      : '/';
  });

  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(() => {
    const saved = localStorage.getItem('hq_personal_details');
    return saved ? JSON.parse(saved) : defaultPersonalDetails;
  });

  const [healthInfo, setHealthInfo] = useState<HealthInformation>(() => {
    const saved = localStorage.getItem('hq_health_info');
    return saved ? JSON.parse(saved) : defaultHealthInfo;
  });

  const [selectedPlan, setSelectedPlanState] = useState<InsurancePlan | null>(() => {
    const saved = localStorage.getItem('hq_selected_plan');
    return saved ? JSON.parse(saved) : MOCK_PLANS[0];
  });

  const [availablePlans, setAvailablePlans] = useState<InsurancePlan[]>(() => {
    return rankAndPersonalizePlans(defaultPersonalDetails, defaultHealthInfo);
  });

  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>(() => {
    const saved = localStorage.getItem('hq_saved_quotes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // Seed with 1 initial sample quote so the Saved Quotes page looks populated
    return [
      {
        id: 'sq-seed-1',
        quoteNumber: 'HQ-742918',
        customerName: 'Muhammad Ali',
        plan: MOCK_PLANS[0],
        personalDetails: {
          fullName: 'Muhammad Ali',
          dateOfBirth: '1995-05-12',
          gender: 'Male',
          nationality: 'Pakistani',
          cityCountry: 'Dubai, UAE',
          employmentStatus: 'Employed',
          monthlyIncome: '10,000 - 15,000'
        },
        healthInfo: {
          healthStatus: 'Good',
          hasPreExistingConditions: false,
          preExistingConditions: [],
          coverageType: 'Individual',
          coverageDuration: '1 Year',
          additionalNotes: 'Require comprehensive outpatient with low deductible.'
        },
        createdAt: '2026-04-14',
        monthlyPremium: 1250,
        annualPremium: 15000,
        status: 'Active'
      }
    ];
  });

  // Group Quote state
  const [groupEmployees, setGroupEmployees] = useState<GroupEmployee[]>(() => {
    const saved = localStorage.getItem('hq_group_census');
    return saved ? JSON.parse(saved) : SAMPLE_EMPLOYEE_CENSUS;
  });

  const [selectedGroupPlan, setSelectedGroupPlan] = useState<GroupQuotePlan | null>(
    MOCK_GROUP_PLANS[1]
  );

  // AI Analysis state
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Contact messages
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('hq_contact_msgs');
    return saved ? JSON.parse(saved) : [];
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync route with browser history
  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save personal & health info to localStorage
  useEffect(() => {
    localStorage.setItem('hq_personal_details', JSON.stringify(personalDetails));
  }, [personalDetails]);

  useEffect(() => {
    localStorage.setItem('hq_health_info', JSON.stringify(healthInfo));
    // Recalculate ranked plans
    const ranked = rankAndPersonalizePlans(personalDetails, healthInfo);
    setAvailablePlans(ranked);
  }, [healthInfo, personalDetails]);

  useEffect(() => {
    if (selectedPlan) {
      localStorage.setItem('hq_selected_plan', JSON.stringify(selectedPlan));
    }
  }, [selectedPlan]);

  useEffect(() => {
    localStorage.setItem('hq_saved_quotes', JSON.stringify(savedQuotes));
  }, [savedQuotes]);

  useEffect(() => {
    localStorage.setItem('hq_group_census', JSON.stringify(groupEmployees));
  }, [groupEmployees]);

  const setSelectedPlan = (plan: InsurancePlan | null) => {
    setSelectedPlanState(plan);
  };

  // Load demo quote populated with Muhammad Ali matching reference image
  const loadDemoQuote = () => {
    const demoPersonal: PersonalDetails = {
      fullName: 'Muhammad Ali',
      dateOfBirth: '1995-05-12',
      gender: 'Male',
      nationality: 'Pakistani',
      cityCountry: 'Dubai, UAE',
      employmentStatus: 'Employed',
      monthlyIncome: '10,000 - 15,000'
    };
    const demoHealth: HealthInformation = {
      healthStatus: 'Good',
      hasPreExistingConditions: false,
      preExistingConditions: [],
      otherConditionDescription: '',
      coverageType: 'Individual',
      coverageDuration: '1 Year',
      familyMembersCount: 1,
      additionalNotes: 'Looking for fast approval with DHA compliance and low deductible.'
    };
    setPersonalDetails(demoPersonal);
    setHealthInfo(demoHealth);
    const ranked = rankAndPersonalizePlans(demoPersonal, demoHealth);
    setAvailablePlans(ranked);
    setSelectedPlan(ranked[0] || MOCK_PLANS[0]);
    showToast('Demo profile loaded with Muhammad Ali details!', 'info');
    navigate('/quote/personal');
  };

  const saveCurrentQuote = () => {
    if (!selectedPlan) return;
    const quoteNumber = `HQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const newQuote: SavedQuote = {
      id: `sq-${Date.now()}`,
      quoteNumber,
      customerName: personalDetails.fullName || 'Valued Member',
      plan: selectedPlan,
      personalDetails: { ...personalDetails },
      healthInfo: { ...healthInfo },
      createdAt: new Date().toISOString().split('T')[0],
      monthlyPremium: selectedPlan.monthlyPremium,
      annualPremium: selectedPlan.monthlyPremium * 12,
      status: 'Active'
    };

    setSavedQuotes((prev) => [newQuote, ...prev]);
    showToast(`Quote #${quoteNumber} successfully saved to your portfolio!`, 'success');
  };

  const deleteSavedQuote = (id: string) => {
    setSavedQuotes((prev) => prev.filter((q) => q.id !== id));
    showToast('Quote removed from saved records.', 'info');
  };

  const loadSavedQuote = (quote: SavedQuote) => {
    setPersonalDetails(quote.personalDetails);
    setHealthInfo(quote.healthInfo);
    setSelectedPlan(quote.plan);
    showToast(`Loaded Quote #${quote.quoteNumber}`, 'success');
    navigate('/quote/details');
  };

  const loadSampleCensus = () => {
    setGroupEmployees(SAMPLE_EMPLOYEE_CENSUS);
    showToast(`Loaded ${SAMPLE_EMPLOYEE_CENSUS.length} sample employee census records`, 'success');
  };

  const submitContactMessage = (msg: Omit<ContactMessage, 'id' | 'timestamp'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    const updated = [newMsg, ...contactMessages];
    setContactMessages(updated);
    localStorage.setItem('hq_contact_msgs', JSON.stringify(updated));
    showToast('Thank you! Your inquiry has been submitted successfully.', 'success');
  };

  // Group metrics calculations
  const totalEmployees = groupEmployees.length;
  const eligibleEmployees = groupEmployees.filter((e) => e.employmentStatus !== 'Contractor').length;
  const dependentsCount = groupEmployees.reduce((sum, e) => sum + (e.dependentsCount || 0), 0);
  const totalHeadcount = totalEmployees + dependentsCount;
  const averageAge =
    totalEmployees > 0
      ? Math.round(groupEmployees.reduce((sum, e) => sum + (e.age || calculateAge(e.dateOfBirth)), 0) / totalEmployees)
      : 32;

  // Base calculation with demographic weighting
  const baseRatePerLife = selectedGroupPlan ? selectedGroupPlan.monthlyPerEmployee : 850;
  const ageFactor = averageAge > 40 ? 1.25 : averageAge > 35 ? 1.1 : 1.0;
  const dependentDiscountFactor = 0.8;
  const baseEstimatedMonthly = Math.round(
    totalEmployees * baseRatePerLife * ageFactor +
    dependentsCount * baseRatePerLife * ageFactor * dependentDiscountFactor
  );
  const baseEstimatedAnnual = baseEstimatedMonthly * 12;

  return (
    <QuoteContext.Provider
      value={{
        currentPath,
        navigate,
        personalDetails,
        setPersonalDetails,
        healthInfo,
        setHealthInfo,
        selectedPlan,
        setSelectedPlan,
        availablePlans,
        setAvailablePlans,
        loadDemoQuote,
        saveCurrentQuote,
        deleteSavedQuote,
        loadSavedQuote,
        savedQuotes,
        groupEmployees,
        setGroupEmployees,
        selectedGroupPlan,
        setSelectedGroupPlan,
        loadSampleCensus,
        groupMetrics: {
          totalEmployees,
          eligibleEmployees,
          dependentsCount,
          averageAge,
          totalHeadcount,
          baseEstimatedMonthly,
          baseEstimatedAnnual
        },
        contactMessages,
        submitContactMessage,
        toasts,
        showToast,
        removeToast,
        analysisProgress,
        setAnalysisProgress,
        isAnalyzing,
        setIsAnalyzing
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};
