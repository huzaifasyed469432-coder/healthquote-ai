import React, { useState } from 'react';
import { useQuote } from '../../context/QuoteContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, Shield, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { submitContactMessage, showToast } = useQuote();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Individual Health Insurance Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please provide a valid email format';
    }
    if (!form.phone.trim()) errs.phone = 'Contact telephone is required';
    if (!form.message.trim()) errs.message = 'Please enter your inquiry message';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      submitContactMessage(form);
      setSubmitted(true);
    } else {
      showToast('Please fix the highlighted form errors.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Dedicated Healthcare Advisory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact Underwriting Support
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Have questions about coverage limits, pre-existing conditions, or corporate group schemes? Our healthcare consultants are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Toll Free Phone</h4>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">+971 4 800 4325</p>
                  <p className="text-[11px] text-slate-500">Sun - Thu, 8:00 AM - 6:00 PM GST</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Inquiries</h4>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">quotes@healthquote-ai.ae</p>
                  <p className="text-[11px] text-slate-500">Average response time: &lt; 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Dubai Office</h4>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">Dubai Silicon Oasis & DIFC Gate</p>
                  <p className="text-[11px] text-slate-500">Dubai, United Arab Emirates</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-sky-900 text-white shadow-md">
              <div className="flex items-center gap-2 mb-2 text-sky-300 text-xs font-bold">
                <Clock className="w-4 h-4" /> Instant Turnaround
              </div>
              <p className="text-xs leading-relaxed text-sky-100">
                All submitted inquiries are recorded locally in your session portfolio. For real policy underwriting, our licensed brokerage partners provide formal validation.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              {submitted ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Your message has been submitted successfully.
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    A representative has received your request. In this prototype, your inquiry is securely preserved in session state.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'Individual Health Insurance Inquiry',
                        message: ''
                      });
                    }}
                    className="mt-4 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq Mansoor"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                    {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="you@company.ae"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      />
                      {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+971 50 123 4567"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      />
                      {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800"
                    >
                      <option value="Individual Health Insurance Inquiry">Individual Health Insurance Inquiry</option>
                      <option value="Family Coverage Consultation">Family Coverage Consultation</option>
                      <option value="Corporate Employee Census Quote">Corporate Employee Census Quote</option>
                      <option value="DHA Visa Compliance Question">DHA Visa Compliance Question</option>
                      <option value="Pre-existing Medical Condition Underwriting">Pre-existing Medical Condition Underwriting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please share any specific coverage requirements, hospital preferences, or member details..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                    {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
