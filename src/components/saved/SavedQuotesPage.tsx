import React from 'react';
import { useQuote } from '../../context/QuoteContext';
import { Bookmark, Eye, Download, Trash2, ArrowLeft, Plus, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { downloadQuotePdfFile } from '../../services/pdfGenerator';
import { SavedQuote } from '../../types/insurance';

export const SavedQuotesPage: React.FC = () => {
  const { savedQuotes, deleteSavedQuote, loadSavedQuote, navigate, showToast } = useQuote();

  const handleDownloadPdf = (quote: SavedQuote) => {
    try {
      downloadQuotePdfFile(quote.plan, quote.personalDetails, quote.healthInfo);
      showToast(`Downloaded PDF for quote #${quote.quoteNumber}`, 'success');
    } catch {
      showToast('Could not generate PDF. Please try opening the quote.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-sky-600" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Saved Quotes Portfolio
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Re-open previously calculated quotes, review benefits, or download official PDF schedules.
            </p>
          </div>

          <button
            onClick={() => navigate('/quote/personal')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Quote</span>
          </button>
        </div>

        {savedQuotes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Saved Quotes Yet</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              When you compare plans and click &quot;Save &amp; Continue Later&quot;, your quotes will appear here so you can revisit them anytime.
            </p>
            <button
              onClick={() => navigate('/quote/personal')}
              className="px-6 py-3 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-sky-700 cursor-pointer"
            >
              Start New Health Quote
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedQuotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                      {quote.quoteNumber}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {quote.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {quote.plan.planName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {quote.plan.provider} · {quote.plan.coverageType}
                  </p>

                  <div className="my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customer:</span>
                      <span className="font-semibold text-slate-800">{quote.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date Issued:</span>
                      <span className="text-slate-700 font-medium">{quote.createdAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly Premium:</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        AED {quote.monthlyPremium.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (View, Download, Delete) */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => loadSavedQuote(quote)}
                    className="flex-1 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Quote</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(quote)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteSavedQuote(quote.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Delete saved quote"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
