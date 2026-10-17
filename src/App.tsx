/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QuoteProvider, useQuote } from './context/QuoteContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { LandingPage } from './components/landing/LandingPage';
import { PersonalDetailsStep } from './components/quote/PersonalDetailsStep';
import { HealthInfoStep } from './components/quote/HealthInfoStep';
import { AiAnalysisStep } from './components/quote/AiAnalysisStep';
import { PlanComparisonStep } from './components/quote/PlanComparisonStep';
import { QuoteDetailsStep } from './components/quote/QuoteDetailsStep';
import { QuoteSummaryStep } from './components/quote/QuoteSummaryStep';
import { PdfPreviewStep } from './components/quote/PdfPreviewStep';
import { GroupQuotePage } from './components/group/GroupQuotePage';
import { SavedQuotesPage } from './components/saved/SavedQuotesPage';
import { ContactPage } from './components/contact/ContactPage';
import { AboutPage } from './components/about/AboutPage';

const AppContent: React.FC = () => {
  const { currentPath } = useQuote();

  // Determine which page component to display based on currentPath
  const renderRoute = () => {
    switch (currentPath) {
      case '/':
        return <LandingPage />;
      case '/quote/personal':
        return <PersonalDetailsStep />;
      case '/quote/health':
        return <HealthInfoStep />;
      case '/quote/analyzing':
        return <AiAnalysisStep />;
      case '/quote/results':
        return <PlanComparisonStep />;
      case '/quote/details':
        return <QuoteDetailsStep />;
      case '/quote/summary':
        return <QuoteSummaryStep />;
      case '/quote/pdf':
        return <PdfPreviewStep />;
      case '/group':
        return <GroupQuotePage />;
      case '/saved-quotes':
        return <SavedQuotesPage />;
      case '/contact':
        return <ContactPage />;
      case '/about':
        return <AboutPage />;
      default:
        return <LandingPage />;
    }
  };

  // Step screens or PDF preview render their own custom headers
  const isDedicatedStepScreen =
    currentPath.startsWith('/quote/') && currentPath !== '/quote/pdf';
  const isPdfPreview = currentPath === '/quote/pdf';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {!isPdfPreview && !isDedicatedStepScreen && <Header />}
      
      <div className="flex-1">
        {renderRoute()}
      </div>

      {!isPdfPreview && <Footer />}

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <QuoteProvider>
      <AppContent />
    </QuoteProvider>
  );
}
