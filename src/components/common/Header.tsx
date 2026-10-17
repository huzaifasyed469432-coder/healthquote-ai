import React, { useState } from 'react';
import { useQuote } from '../../context/QuoteContext';
import { Shield, Menu, X, Bookmark, User, PhoneCall, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPath, navigate, savedQuotes, loadDemoQuote } = useQuote();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Get Quote', path: '/quote/personal' },
    { label: 'Group Quote', path: '/group' },
    { label: 'Saved Quotes', path: '/saved-quotes', badge: savedQuotes.length > 0 ? savedQuotes.length : null },
    { label: 'Contact', path: '/contact' },
    { label: 'About', path: '/about' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Tagline */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 text-left focus:outline-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  HealthQuote<span className="text-sky-600"> AI</span>
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                Smart. Fast. Reliable.
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`relative text-sm font-medium transition-colors cursor-pointer py-1 ${
                    isActive
                      ? 'text-sky-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-sky-500 rounded-full">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={loadDemoQuote}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 px-3.5 py-2 rounded-lg transition-all cursor-pointer"
              title="Pre-populate with sample quote data"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Try Demo Quote</span>
            </button>

            <button
              onClick={() => handleNav('/quote/personal')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNav('/saved-quotes')}
              className="p-2 text-slate-600 hover:text-sky-600 relative cursor-pointer"
              aria-label="Saved quotes"
            >
              <Bookmark className="w-5 h-5" />
              {savedQuotes.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-sky-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-sky-600 focus:outline-hidden cursor-pointer rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                  currentPath === link.path
                    ? 'bg-sky-50 text-sky-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-sky-500 rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                loadDemoQuote();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Try Demo Quote</span>
            </button>
            <button
              onClick={() => handleNav('/quote/personal')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
