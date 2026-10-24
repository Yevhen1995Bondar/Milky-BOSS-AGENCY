import React, { useState } from 'react';
import { RETAINER_PLANS } from '../data/content';
import { calculateProjectEstimate } from '../utils/pricing';
import { Check, ArrowRight, Sliders, ShieldCheck } from 'lucide-react';
import { PricingPlan } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PricingSectionProps {
  onSelectPlan: (planName: string, estimateDetails?: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const { pricingPlans, dict, language } = useLanguage();

  // Interactive estimator state
  const [selectedService, setSelectedService] = useState<'landingpage' | 'shopify' | 'corporate'>('shopify');
  const [features, setFeatures] = useState<string[]>(['crm_integration']);
  const [withMaintenance, setWithMaintenance] = useState<boolean>(false);
  const [withAds, setWithAds] = useState<boolean>(true);

  const toggleFeature = (id: string) => {
    if (features.includes(id)) {
      setFeatures(features.filter((f) => f !== id));
    } else {
      setFeatures([...features, id]);
    }
  };

  const estimate = calculateProjectEstimate({
    serviceType: selectedService,
    additionalFeatures: features,
    maintenanceRetainer: withMaintenance,
    adsManagement: withAds,
  });

  const getServiceLabel = (type: string) => {
    switch (type) {
      case 'landingpage':
        return language === 'de' ? 'Sprint Landingpage' : 'Sprint Landing Page';
      case 'shopify':
        return language === 'de' ? 'Shopify E-Commerce Pro' : 'Shopify E-Commerce Pro';
      case 'corporate':
        return language === 'de' ? 'KMU Corporate Website' : 'Corporate Web Platform';
      default:
        return 'Project';
    }
  };

  const locale = language === 'de' ? 'de-DE' : 'en-US';

  const addOnModules = [
    {
      id: 'meta_ads_setup',
      label: language === 'de' ? 'Meta Ads (Instagram & FB) Erstellung & Audit' : 'Meta Ads (Instagram & FB) Setup & Audit',
      cost: '+750 €',
    },
    {
      id: 'social_audit_content',
      label: language === 'de' ? 'Instagram & TikTok Audit + 30-Tage Content-Plan' : 'Instagram & TikTok Audit + 30-Day Content Plan',
      cost: '+650 €',
    },
    {
      id: 'strategic_swot_pestel',
      label: language === 'de' ? 'Strategische Analyse (SWOT, PESTEL & Lebenszyklus)' : 'Strategic Analysis (SWOT, PESTEL & Lifecycle)',
      cost: '+700 €',
    },
    {
      id: 'crm_integration',
      label: language === 'de' ? 'CRM-Integration (HubSpot / Klaviyo)' : 'CRM Integration (HubSpot / Klaviyo)',
      cost: '+800 €',
    },
    {
      id: 'google_ai_automation',
      label: language === 'de' ? 'Google AI Studio Triage & Chatbot' : 'Google AI Studio Triage & Chatbot',
      cost: '+950 €',
    },
    {
      id: 'seo_bundle',
      label: language === 'de' ? 'Lokales SEO Köln & NRW Bundle' : 'Local SEO & Core Vitals Optimization',
      cost: '+600 €',
    },
    {
      id: 'custom_checkout',
      label: language === 'de' ? 'Custom Checkout & Upsell-Engine' : 'Custom Checkout & One-Click Upsell Engine',
      cost: '+850 €',
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#090a0f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#c81e32]">
            {dict.pricing.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-2 tracking-tight">
            {dict.pricing.heading}
          </h2>
          <p className="text-zinc-400 mt-3 text-base sm:text-lg">
            {dict.pricing.subtext}
          </p>
        </div>

        {/* 3 Core Package Cards */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan: PricingPlan) => {
            const isFeatured = !!plan.recommended;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl border transition-all duration-300 p-8 flex flex-col justify-between relative ${
                  isFeatured
                    ? 'bg-[#141824] border-[#c81e32] shadow-2xl shadow-[#c81e32]/10 scale-100 lg:-translate-y-2'
                    : 'bg-[#10131b] border-white/10 hover:border-white/20'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-[#c81e32] text-white px-3 py-1 rounded-full shadow-sm">
                      {dict.pricing.popular_badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold font-display text-white">{plan.name}</h3>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{plan.subtitle}</p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-display text-white tabular-nums tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {language === 'de' ? 'zzgl. MwSt.' : 'excl. VAT'}
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-mono text-zinc-400">{plan.deliveryTime}</div>

                  {/* Feature Checklist */}
                  <div className="mt-8 space-y-3.5 pt-6 border-t border-white/10">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-[#c81e32] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-[11px] text-zinc-400 mb-4">{plan.suitableFor}</div>
                  <button
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full py-3 px-4 rounded-md text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isFeatured
                        ? 'bg-[#c81e32] hover:bg-[#b01829] text-white shadow-lg shadow-[#c81e32]/25'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    <span>{dict.pricing.select_plan_btn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ongoing Retainers Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {RETAINER_PLANS.map((ret) => (
            <div
              key={ret.id}
              className="p-6 rounded-xl border border-white/10 bg-[#0e1118] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#c81e32]">
                  {language === 'de' ? 'Monatliche Betreuung' : 'Monthly Retainer'}
                </span>
                <h4 className="text-base font-bold text-white font-display mt-0.5">{ret.name}</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-md">{ret.description}</p>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                <span className="text-sm font-bold text-white font-mono">{ret.price}</span>
                <button
                  onClick={() => onSelectPlan(ret.name)}
                  className="text-xs px-3 py-1.5 rounded bg-white/5 hover:bg-[#c81e32] text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  {language === 'de' ? 'Anfragen' : 'Inquire'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Custom Budget Estimator */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-[#11141c] p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#c81e32]/20 text-[#c81e32] flex items-center justify-center shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  {language === 'de' ? 'Individueller Projekt-Kalkulator' : 'Custom Project Estimator'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {language === 'de'
                    ? 'Wählen Sie Modulbausteine aus und sehen Sie sofort das Investitionsvolumen.'
                    : 'Select architectural modules and preview your exact project investment.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {language === 'de' ? 'Verbindliche Festpreis-Garantie' : 'Guaranteed Fixed Price Agreement'}
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Config Controls */}
            <div className="lg:col-span-8 space-y-6">
              {/* Service Type Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-3">
                  {language === 'de' ? '1. Basis-Projekt wählen:' : '1. Choose Base Architecture:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'landingpage', label: language === 'de' ? 'Landingpage' : 'Landing Page', price: language === 'de' ? 'ab 1.850 €' : 'from €1,850' },
                    { id: 'shopify', label: 'Shopify Store', price: language === 'de' ? 'ab 3.900 €' : 'from €3,900' },
                    { id: 'corporate', label: language === 'de' ? 'KMU Website' : 'Corporate Site', price: language === 'de' ? 'ab 4.400 €' : 'from €4,400' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s.id as any)}
                      className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                        selectedService === s.id
                          ? 'bg-[#c81e32] border-[#c81e32] text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-semibold">{s.label}</div>
                      <div className={`text-[10px] mt-0.5 ${selectedService === s.id ? 'text-white/80' : 'text-zinc-400'}`}>
                        {s.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-on Features */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-3">
                  {language === 'de' ? '2. Spezifische Zusatzmodule:' : '2. Strategic Add-On Modules:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addOnModules.map((feat) => {
                    const isChecked = features.includes(feat.id);
                    return (
                      <button
                        key={feat.id}
                        onClick={() => toggleFeature(feat.id)}
                        className={`p-3 rounded-lg border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#181d2a] border-[#c81e32] text-white'
                            : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-[#c81e32] border-[#c81e32] text-white' : 'border-zinc-600'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-xs font-medium text-zinc-200">{feat.label}</span>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400 shrink-0">{feat.cost}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Monthly Service Options */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-3">
                  {language === 'de' ? '3. Laufende Betreuung (optional):' : '3. Ongoing Retainers (optional):'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setWithAds(!withAds)}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      withAds
                        ? 'bg-[#181d2a] border-[#c81e32] text-white'
                        : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          withAds ? 'bg-[#c81e32] border-[#c81e32] text-white' : 'border-zinc-600'
                        }`}
                      >
                        {withAds && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-medium text-zinc-200">
                        {language === 'de' ? 'Google & Meta Ads Betreuung' : 'Google & Meta Ads Retainer'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                      {language === 'de' ? '+850 €/Monat' : '+€850/month'}
                    </span>
                  </button>

                  <button
                    onClick={() => setWithMaintenance(!withMaintenance)}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      withMaintenance
                        ? 'bg-[#181d2a] border-[#c81e32] text-white'
                        : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          withMaintenance ? 'bg-[#c81e32] border-[#c81e32] text-white' : 'border-zinc-600'
                        }`}
                      >
                        {withMaintenance && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-medium text-zinc-200">
                        {language === 'de' ? 'Technische Wartung & Updates' : 'Technical Maintenance & SLA'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                      {language === 'de' ? '+390 €/Monat' : '+€390/month'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-4 p-6 rounded-xl bg-[#0c0e15] border border-white/10 space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {language === 'de' ? 'Kalkulationsübersicht:' : 'Estimate Summary:'}
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-zinc-400">{language === 'de' ? 'Basis' : 'Base'} ({getServiceLabel(selectedService)}):</span>
                  <span className="text-white font-mono">{estimate.basePrice.toLocaleString(locale)} €</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-zinc-400">Module &amp; AI ({features.length}):</span>
                  <span className="text-white font-mono">+{estimate.addOnPrice.toLocaleString(locale)} €</span>
                </div>
                {estimate.monthlyRetainer > 0 && (
                  <div className="flex justify-between pb-2 border-b border-white/5 text-emerald-400">
                    <span>{language === 'de' ? 'Laufende Betreuung:' : 'Monthly Retainer:'}</span>
                    <span className="font-mono">{estimate.monthlyRetainer.toLocaleString(locale)} € / {language === 'de' ? 'Monat' : 'month'}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>{language === 'de' ? 'Geschätzte Umsetzungszeit:' : 'Estimated Timeline:'}</span>
                  <span className="text-white font-mono">
                    {language === 'de' ? `ca. ${estimate.estimatedWeeks} Wochen` : `approx. ${estimate.estimatedWeeks} weeks`}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-xs text-zinc-400">
                  {language === 'de' ? 'Einmaliges Investitionsvolumen:' : 'One-Time Project Investment:'}
                </div>
                <div className="text-3xl font-bold font-display text-white mt-1 tabular-nums">
                  {estimate.totalOneTime.toLocaleString(locale)} €
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  {language === 'de' ? 'zzgl. gesetzlicher MwSt.' : 'excl. applicable VAT'}
                </div>
              </div>

              <button
                onClick={() => {
                  const summary = `${getServiceLabel(selectedService)} (${language === 'de' ? 'Kalkulation' : 'Estimate'}: ca. ${estimate.totalOneTime} € ${language === 'de' ? 'einmalig' : 'one-time'}${
                    estimate.monthlyRetainer > 0 ? ` + ${estimate.monthlyRetainer} €/${language === 'de' ? 'M' : 'mo'}` : ''
                  })`;
                  onSelectPlan(getServiceLabel(selectedService), summary);
                }}
                className="w-full py-3 px-4 rounded-md text-xs uppercase tracking-wider font-semibold text-white bg-[#c81e32] hover:bg-[#b01829] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#c81e32]/20"
              >
                <span>{language === 'de' ? 'In Anfrage übernehmen' : 'Apply to Project Inquiry'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
