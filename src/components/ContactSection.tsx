import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { validateContactForm } from '../utils/pricing';
import { ContactFormData, FormErrors } from '../types';
import { CONTACT_EMAIL, CONTACT_PHONE, LOCATION_CITY } from '../data/content';
import { Mail, Phone, MapPin, Send, Clock, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactSectionProps {
  prefilledService?: string;
  prefilledMessage?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  prefilledService = 'Shopify E-Commerce Pro',
  prefilledMessage = '',
}) => {
  const { dict, language } = useLanguage();
  const c = dict.contact;

  const [formData, setFormData] = useState<ContactFormData>({
    service: prefilledService,
    budget: language === 'de' ? '3.000 € – 6.000 €' : '€3,000 – €6,000',
    timeline: language === 'de' ? 'Schnellstmöglich (in 2–4 Wochen)' : 'ASAP (within 2–4 weeks)',
    name: '',
    email: '',
    phone: '',
    company: '',
    message: prefilledMessage,
    crmInterest: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Auto-dismiss toast after 6 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Sync if prefilled values change
  React.useEffect(() => {
    if (prefilledService) {
      setFormData((prev) => ({ ...prev, service: prefilledService }));
    }
  }, [prefilledService]);

  React.useEffect(() => {
    if (prefilledMessage) {
      setFormData((prev) => ({ ...prev, message: prefilledMessage }));
    }
  }, [prefilledMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate reliable dispatch with subtle animations
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setShowToast(true);
    }, 700);
  };

  return (
    <section id="contact" className="py-24 bg-[#0c0e15] border-t border-white/10 relative">
      {/* Framer Motion Floating Success Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[120] max-w-md w-[92%] sm:w-auto p-4 rounded-xl bg-[#141824]/95 backdrop-blur-xl border border-emerald-500/40 shadow-2xl shadow-emerald-950/50 flex items-start gap-3.5 pointer-events-auto"
            data-testid="success-toast"
          >
            {/* Animated Check Icon */}
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
              <motion.svg
                viewBox="0 0 24 24"
                className="w-4 h-4 stroke-current"
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M 5 12 L 10 17 L 19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
              </motion.svg>
            </div>

            <div className="min-w-0 pr-2">
              <div className="text-xs font-bold text-white tracking-wide">
                {c.success_title}
              </div>
              <div className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                {c.success_desc}
              </div>
            </div>

            <button
              onClick={() => setShowToast(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/10 shrink-0 transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info & Trust in Cologne */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#c81e32]">
                {c.tag}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-2 tracking-tight">
                {c.heading}
              </h2>
              <p className="text-zinc-400 mt-4 text-base leading-relaxed">
                {c.subtext}
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#11141c] border border-white/10 hover:border-[#c81e32]/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#c81e32]/10 text-[#c81e32] flex items-center justify-center shrink-0 group-hover:bg-[#c81e32] group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-zinc-400">{c.email_direct}</div>
                  <div className="text-sm font-semibold text-white truncate">{CONTACT_EMAIL}</div>
                </div>
              </a>

              <a
                href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#11141c] border border-white/10 hover:border-[#c81e32]/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 text-zinc-300 flex items-center justify-center shrink-0 group-hover:bg-[#c81e32] group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-zinc-400">{c.phone_direct}</div>
                  <div className="text-sm font-semibold text-white truncate">{CONTACT_PHONE}</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#11141c] border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-white/5 text-zinc-300 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">{c.location_direct}</div>
                  <div className="text-sm font-semibold text-white">MediaPark / Ehrenfeld, 50672 {LOCATION_CITY}</div>
                </div>
              </div>
            </div>

            {/* Response Time & Guarantee */}
            <div className="p-4 rounded-xl bg-[#141824] border border-white/5 space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Clock className="w-4 h-4" />
                <span>
                  {language === 'de'
                    ? 'Reaktionszeit: Garantiert binnen 24 Stunden'
                    : 'Response time: Guaranteed within 24 hours'}
                </span>
              </div>
              <p className="text-zinc-400">
                {language === 'de'
                  ? 'Sie erhalten keine Standard-Absage, sondern eine fundierte erste Einschätzung zu Machbarkeit, Budget und Zeitplan.'
                  : 'You will receive a personalized assessment covering feasibility, technical scope, and exact milestones.'}
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Lead Capture Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#11141c] p-6 sm:p-10 shadow-2xl relative">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="py-12 text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                  >
                    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                      <motion.circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                      <motion.path
                        d="M 14 24 L 21 31 L 34 17"
                        stroke="#10b981"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
                      />
                    </svg>
                  </motion.div>

                  <div>
                    <h3 className="text-2xl font-bold font-display text-white">
                      {c.success_title}
                    </h3>
                    <p className="text-zinc-300 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                      {c.success_desc}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 max-w-md mx-auto text-left text-xs text-zinc-400 space-y-1">
                    <div><span className="text-zinc-200">{language === 'de' ? 'Name:' : 'Name:'}</span> {formData.name}</div>
                    <div><span className="text-zinc-200">{language === 'de' ? 'E-Mail:' : 'Email:'}</span> {formData.email}</div>
                    {formData.phone && <div><span className="text-zinc-200">{language === 'de' ? 'Telefon:' : 'Phone:'}</span> {formData.phone}</div>}
                    <div><span className="text-zinc-200">{language === 'de' ? 'Budget:' : 'Budget:'}</span> {formData.budget}</div>
                  </div>

                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        service: 'Shopify E-Commerce Pro',
                        budget: language === 'de' ? '3.000 € – 6.000 €' : '€3,000 – €6,000',
                        timeline: language === 'de' ? 'Schnellstmöglich' : 'ASAP',
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        message: '',
                        crmInterest: true,
                      });
                    }}
                    className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                  >
                    {language === 'de' ? 'Weitere Anfrage senden' : 'Send another inquiry'}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-bold font-display text-white pb-2 border-b border-white/10">
                    {language === 'de' ? 'Projektanfrage starten' : 'Start Project Inquiry'}
                  </h3>

                  {/* Service Selection */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-2">
                      {c.service_label}
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-[#181c26] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c81e32]"
                    >
                      <option value="Shopify Onlineshop (Neubau oder Relaunch)">
                        {language === 'de' ? 'Shopify Onlineshop (Neubau oder Relaunch)' : 'Shopify Store (New Build or Relaunch)'}
                      </option>
                      <option value="High-Converting Landingpage">
                        {language === 'de' ? 'High-Converting Landingpage' : 'High-Converting Landing Page'}
                      </option>
                      <option value="Meta Ads (Instagram & Facebook): Erstellung & Audit">
                        {language === 'de' ? 'Meta Ads (Instagram & Facebook): Erstellung & Audit' : 'Meta Ads (Instagram & Facebook): Campaigns & Audit'}
                      </option>
                      <option value="Social Media Audit & Content-Plan (Instagram & TikTok)">
                        {language === 'de' ? 'Social Media Audit & Content-Plan (Instagram & TikTok)' : 'Social Media Audit & Content Plan (Instagram & TikTok)'}
                      </option>
                      <option value="Strategische Analyse (SWOT, PESTEL & Lebenszyklus)">
                        {language === 'de' ? 'Strategische Analyse (SWOT, PESTEL & Lebenszyklus)' : 'Strategic Analysis (SWOT, PESTEL & Lifecycle)'}
                      </option>
                      <option value="Google AI Studio & CRM-Automatisierung">
                        {language === 'de' ? 'Google AI Studio & CRM-Automatisierung' : 'Google AI Studio & CRM Automation'}
                      </option>
                      <option value="Komplettpaket (Shop + Meta Ads + CRM)">
                        {language === 'de' ? 'Komplettpaket (Shop + Meta Ads + CRM)' : 'Full Scale Package (Shop + Meta Ads + CRM)'}
                      </option>
                    </select>
                  </div>

                  {/* Budget & Timeline Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-2">
                        {c.budget_label}:
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-[#181c26] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c81e32]"
                      >
                        <option value="1.500 € – 3.000 €">1.500 € – 3.000 €</option>
                        <option value="3.000 € – 6.000 €">3.000 € – 6.000 €</option>
                        <option value="6.000 € – 12.000 €">6.000 € – 12.000 €</option>
                        <option value="Über 12.000 €">{language === 'de' ? 'Über 12.000 €' : 'Over €12,000'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-2">
                        {c.timeline_label}:
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full bg-[#181c26] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c81e32]"
                      >
                        <option value="Sofort / Schnellstmöglich">
                          {language === 'de' ? 'Sofort / Schnellstmöglich' : 'Immediately / ASAP'}
                        </option>
                        <option value="In 2–4 Wochen">
                          {language === 'de' ? 'In 2–4 Wochen' : 'In 2–4 weeks'}
                        </option>
                        <option value="In 1–2 Monaten">
                          {language === 'de' ? 'In 1–2 Monaten' : 'In 1–2 months'}
                        </option>
                        <option value="Noch in der Planungsphase">
                          {language === 'de' ? 'Noch in der Planungsphase' : 'Currently scoping / planning'}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-2">
                        {c.name_label}
                      </label>
                      <input
                        type="text"
                        placeholder={c.name_placeholder}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        className={`w-full bg-[#181c26] border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none ${
                          errors.name ? 'border-red-500' : 'border-white/10 focus:border-[#c81e32]'
                        }`}
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-2">
                        {c.email_label}
                      </label>
                      <input
                        type="email"
                        placeholder={c.email_placeholder}
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        className={`w-full bg-[#181c26] border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none ${
                          errors.email ? 'border-red-500' : 'border-white/10 focus:border-[#c81e32]'
                        }`}
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Phone & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-2">
                        {c.phone_label}
                      </label>
                      <input
                        type="tel"
                        placeholder={c.phone_placeholder}
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        className={`w-full bg-[#181c26] border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none ${
                          errors.phone ? 'border-red-500' : 'border-white/10 focus:border-[#c81e32]'
                        }`}
                      />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-2">
                        {c.company_label}
                      </label>
                      <input
                        type="text"
                        placeholder={c.company_placeholder}
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-[#181c26] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c81e32]"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-2">
                      {c.message_label}
                    </label>
                    <textarea
                      rows={4}
                      placeholder={c.message_placeholder}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      className={`w-full bg-[#181c26] border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none ${
                        errors.message ? 'border-red-500' : 'border-white/10 focus:border-[#c81e32]'
                      }`}
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  </div>

                  {/* CRM Checkbox */}
                  <div className="flex items-start gap-3 pt-1">
                    <input
                      id="crmInterest"
                      type="checkbox"
                      checked={formData.crmInterest}
                      onChange={(e) => setFormData({ ...formData, crmInterest: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-[#c81e32] focus:ring-0 accent-[#c81e32]"
                    />
                    <label htmlFor="crmInterest" className="text-xs text-zinc-300 leading-normal cursor-pointer">
                      {c.crm_checkbox}
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-md text-xs uppercase tracking-wider font-semibold text-white bg-[#c81e32] hover:bg-[#b01829] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#c81e32]/25 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>{c.submitting_btn}</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{c.submit_btn}</span>
                        </>
                      )}
                    </button>
                    <div className="text-center mt-3 text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        {language === 'de'
                          ? '100% DSGVO-konform. Ihre Daten werden streng vertraulich behandelt.'
                          : '100% GDPR compliant. Your information is encrypted and strictly confidential.'}
                      </span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
