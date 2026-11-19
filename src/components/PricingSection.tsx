import React, { useEffect, useRef, useState } from 'react';
import { calculateProjectEstimate } from '../utils/pricing';
import { Check, ArrowRight, Sliders, ShieldCheck, Info } from 'lucide-react';
import { PricingPlan, AddonServiceItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { EditableText } from './EditableText';

interface PricingSectionProps {
  onSelectPlan: (planName: string, estimateDetails?: string) => void;
}

interface CalculatorTooltipProps {
  id: string;
  title: string;
  items: string[];
  activeId: string | null;
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
  isHighlighted?: boolean;
  align?: 'left' | 'right';
  ariaLabel: string;
}

const CalculatorInfoButton: React.FC<CalculatorTooltipProps> = ({
  id,
  title,
  items,
  activeId,
  setActiveId,
  isHighlighted = false,
  align = 'right',
  ariaLabel,
}) => {
  const isOpen = activeId === id;

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={() => setActiveId(id)}
      onMouseLeave={() => setActiveId((curr) => (curr === id ? null : curr))}
    >
      <button
        type="button"
        data-tooltip-trigger={id}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onFocus={() => setActiveId(id)}
        onBlur={(e) => {
          const next = e.relatedTarget as HTMLElement | null;
          if (!next || !e.currentTarget.parentElement?.contains(next)) {
            setActiveId((curr) => (curr === id ? null : curr));
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveId((curr) => (curr === id ? null : id));
        }}
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
          isHighlighted
            ? isOpen
              ? 'bg-white/25 text-white'
              : 'text-white/80 hover:text-white hover:bg-white/15'
            : isOpen
              ? 'bg-white/15 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/10'
        }`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className={`absolute bottom-full mb-2.5 w-64 sm:w-72 p-3.5 rounded-xl bg-[#090a0f] border border-white/15 shadow-2xl shadow-black/70 text-left z-50 pointer-events-auto ${
            align === 'left' ? 'right-0 sm:right-auto sm:left-0' : 'right-0'
          }`}
        >
          <div className="text-[11px] font-bold text-white leading-snug mb-2">{title}</div>
          <ul className="space-y-1.5">
            {items.map((line, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px] text-zinc-300 leading-relaxed">
                <Check className="w-3 h-3 text-[#c81e32] shrink-0 mt-0.5" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const { pricingPlans, addonServices, dict, language } = useLanguage();

  // Interactive estimator state
  const [selectedService, setSelectedService] = useState<'landingpage' | 'website_ads' | 'shopify'>('website_ads');
  const [features, setFeatures] = useState<string[]>(['photo_video_nrw']);
  const [withMaintenance, setWithMaintenance] = useState<boolean>(false);
  const [withAds, setWithAds] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeTooltip) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (calculatorRef.current && !calculatorRef.current.contains(event.target as Node)) {
        setActiveTooltip(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveTooltip(null);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTooltip]);

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
        return language === 'de' ? 'Web-Start Landingpage' : 'Web-Start Landing Page';
      case 'website_ads':
        return language === 'de' ? 'Website + Google Ads Start' : 'Website + Google Ads Start';
      case 'shopify':
        return language === 'de' ? 'Shopify Onlineshop' : 'Shopify Online Store';
      default:
        return 'Project';
    }
  };

  const locale = language === 'de' ? 'de-DE' : 'en-US';

  const basePackages = [
    {
      id: 'landingpage' as const,
      label: language === 'de' ? 'Web-Start Landingpage' : 'Web-Start Landing Page',
      price: language === 'de' ? '500 €' : '€500',
      details:
        language === 'de'
          ? [
              'Individuelles, verkaufsstarkes Design (inkl. Texte)',
              '100 % optimiert für Smartphone & Tablet',
              'Direktes Anfrageformular & 1-Klick WhatsApp-Button',
              'Basis-SEO, Google Maps-Profil & DSGVO (5–7 Werktage)',
            ]
          : [
              'Custom conversion-focused design (incl. copywriting)',
              '100% optimized for smartphone & tablet',
              'Direct inquiry form & 1-click WhatsApp button',
              'Basic SEO, Google Maps profile & GDPR (5–7 days)',
            ],
    },
    {
      id: 'website_ads' as const,
      label: 'Website + Google Ads Start',
      price: language === 'de' ? '750 €' : '€750',
      details:
        language === 'de'
          ? [
              'Alles aus dem Web-Start Paket inklusive',
              'Google Ads Konto-Setup & Erfolgsmessung',
              'Bis zu 15 Keywords & Anzeigen für bis zu 5 Leistungen',
              'Lokales Umkreis-Targeting & Konto-Einweisung (7–10 Werktage)',
            ]
          : [
              'Everything from the Web-Start package included',
              'Google Ads account setup & conversion tracking',
              'Up to 15 keywords & ads for up to 5 services',
              'Local radius targeting & walkthrough (7–10 days)',
            ],
    },
    {
      id: 'shopify' as const,
      label: language === 'de' ? 'Shopify Onlineshop' : 'Shopify Online Store',
      price: language === 'de' ? 'ab 950 €' : 'from €950',
      details:
        language === 'de'
          ? [
              'Individuelles Shopdesign & bis zu 15 Produkte',
              'Zahlungen (PayPal, Klarna, Stripe) & Versand',
              'Google Merchant Center & Instagram Shopping',
              'Rechtssicheres DE-Setup & 30 Tage Support (7–12 Werktage)',
            ]
          : [
              'Custom Shopify design & up to 15 products',
              'Payment integration (PayPal, Klarna, Stripe) & shipping',
              'Google Merchant Center & Instagram Shopping',
              'Compliant German legal setup & 30 days support',
            ],
    },
  ];

  const addOnModules = [
    {
      id: 'photo_video_nrw',
      label: language === 'de' ? 'Foto- & Videoshooting im Betrieb (NRW)' : 'On-Site Photo & Video Shoot (NRW)',
      cost: '+350 €',
      details:
        language === 'de'
          ? [
              '1,5–2 Std. Shooting inkl. Anfahrt in Köln, Düsseldorf, Duisburg, Essen, Oberhausen & Dortmund',
              'Inkl. 15–20 professionell bearbeiteter Fotos für Website & Anzeigen',
              '2–3 geschnittene Kurzvideos / Reels für Social Media',
            ]
          : [
              '1.5–2 hour shoot incl. travel across NRW (Cologne, Düsseldorf, Duisburg, Essen, Oberhausen, Dortmund)',
              'Includes 15–20 professionally edited photos for website & ads',
              '2–3 edited short videos / Reels for social media',
            ],
    },
    {
      id: 'social_strategy_plan',
      label: language === 'de' ? 'Social Media Strategie & 30-Tage-Plan' : 'Social Media Strategy & 30-Day Plan',
      cost: '+450 €',
      details:
        language === 'de'
          ? [
              'Tiefenprüfung Ihrer Instagram- & TikTok-Kanäle',
              'Wettbewerbsanalyse & Schärfung Ihres Angebots (USP)',
              'Maßgeschneiderter 30-Tage-Content-Plan inkl. Video-Skripten',
            ]
          : [
              'Deep audit of your Instagram & TikTok channels',
              'Competitor analysis & offer positioning (USP)',
              'Custom 30-day content plan incl. video scripts',
            ],
    },
    {
      id: 'google_ads_setup',
      label: language === 'de' ? 'Google Ads Start-Setup (Keywords & Messung)' : 'Google Ads Start Setup (Keywords & Measurement)',
      cost: '+250 €',
      details:
        language === 'de'
          ? [
              'Einrichtung Ihres eigenen Google Ads Kontos mit voller Kostenkontrolle',
              'Recherche & Setup von bis zu 15 kaufstarken Suchbegriffen',
              'Lokales Umkreis-Targeting & Messung eingehender Anfragen',
            ]
          : [
              'Setup of your own Google Ads account with full budget control',
              'Research & setup of up to 15 high-intent keywords',
              'Local radius targeting & inquiry/call measurement',
            ],
    },
    {
      id: 'meta_ads_setup',
      label: language === 'de' ? 'Instagram & Facebook Werbeanzeigen' : 'Instagram & Facebook Ads Setup',
      cost: '+350 €',
      details:
        language === 'de'
          ? [
              'Einrichtung Ihres Meta Werbekontos & saubere Verknüpfung',
              'Zielgruppen-Ausrichtung für Ihren Standort in NRW',
              'Startklare Anzeigenstruktur für mehr lokale Sichtbarkeit & Anfragen',
            ]
          : [
              'Meta Ads account setup & clean integration',
              'Local audience targeting around your NRW business',
              'Launch-ready ad structure for regional awareness & leads',
            ],
    },
    {
      id: 'crm_integration',
      label: language === 'de' ? 'WhatsApp & automatische Kundenanfragen' : 'WhatsApp & Automated Customer Inquiries',
      cost: '+290 €',
      details:
        language === 'de'
          ? [
              'Sofortige Weiterleitung neuer Anfragen an Ihr Team per E-Mail oder WhatsApp',
              'Automatische, höfliche Eingangsbestätigung an den Kunden',
              'Keine Anfrage geht mehr verloren – ideal für schnelle Terminvergabe',
            ]
          : [
              'Instant routing of new inquiries to your team via email or WhatsApp',
              'Automated confirmation message sent to prospective clients',
              'Never miss a lead – ideal for fast appointment scheduling',
            ],
    },
    {
      id: 'extra_products',
      label: language === 'de' ? 'Erweitertes Produkt-Setup (bis 40 Artikel)' : 'Extended Product Setup (up to 40 items)',
      cost: '+350 €',
      details:
        language === 'de'
          ? [
              'Einpflegen von bis zu 40 Artikeln statt 15 Standard-Artikeln in Shopify',
              'Inklusive Varianten (Größe/Farbe), Kategorien & Preispflege',
              'Saubere Produktbeschreibungen & Einrichtung passender Versandregeln',
            ]
          : [
              'Upload of up to 40 products instead of 15 standard items in Shopify',
              'Includes variants (size/color), categories & pricing',
              'Clean product copy & matching shipping rule configuration',
            ],
    },
  ];

  const monthlyOptions = [
    {
      id: 'monthly_ads',
      label: language === 'de' ? 'Optionales Google & Meta Ads Management' : 'Optional Google & Meta Ads Care',
      cost: language === 'de' ? '+250 €/Monat' : '+€250/month',
      checked: withAds,
      toggle: () => setWithAds(!withAds),
      details:
        language === 'de'
          ? [
              'Laufende Betreuung & Optimierung Ihrer Google- und Instagram-Anzeigen',
              'Regelmäßige Anpassung von Keywords, Geboten & Anzeigentexten',
              'Monatliche Budget-Kontrolle & verständlicher Ergebnisbericht',
            ]
          : [
              'Ongoing management & optimization of your Google and Instagram ads',
              'Regular keyword, bid & ad copy adjustments',
              'Monthly budget control & clear performance summary',
            ],
    },
    {
      id: 'monthly_maintenance',
      label: language === 'de' ? 'Technische Pflege & Text-Updates' : 'Technical Care & Content Updates',
      cost: language === 'de' ? '+90 €/Monat' : '+€90/month',
      checked: withMaintenance,
      toggle: () => setWithMaintenance(!withMaintenance),
      details:
        language === 'de'
          ? [
              'Regelmäßige Backups, Sicherheitsprüfungen & technische Updates',
              'Schnelle Umsetzung kleinerer Text-, Preis- oder Bildänderungen',
              'Persönlicher Ansprechpartner bei Fragen (monatlich flexibel kündbar)',
            ]
          : [
              'Regular backups, security checks & technical updates',
              'Fast turnaround on minor copy, pricing, or image changes',
              'Direct support contact (cancelable monthly)',
            ],
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#090a0f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <EditableText
            as="div"
            contentKey="pricing.tag"
            defaultValue={dict.pricing.tag}
            label="Тег секции цен"
            className="text-xs font-semibold uppercase tracking-wider text-[#c81e32]"
          />
          <EditableText
            as="h2"
            contentKey="pricing.heading"
            defaultValue={dict.pricing.heading}
            label="Заголовок секции цен"
            className="text-3xl sm:text-4xl font-bold font-display text-white mt-2 tracking-tight"
          />
          <EditableText
            as="p"
            contentKey="pricing.subtext"
            defaultValue={dict.pricing.subtext}
            multiline
            label="Подзаголовок секции цен"
            className="text-zinc-400 mt-3 text-base sm:text-lg block"
          />
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
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-[#c81e32] text-white px-3.5 py-1 rounded-full shadow-sm whitespace-nowrap inline-block">
                      {dict.pricing.popular_badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <EditableText
                      as="h3"
                      contentKey={`pricing.plan.${plan.id}.name`}
                      defaultValue={plan.name}
                      label={`Название тарифа ${plan.id}`}
                      className="text-xl font-bold font-display text-white"
                    />
                  </div>
                  <EditableText
                    as="p"
                    contentKey={`pricing.plan.${plan.id}.subtitle`}
                    defaultValue={plan.subtitle}
                    label={`Подзаголовок тарифа ${plan.id}`}
                    className="text-xs text-zinc-400 mt-1 block"
                  />

                  <div className="mt-6 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <EditableText
                      contentKey={`pricing.plan.${plan.id}.price`}
                      defaultValue={plan.price}
                      shared
                      label={`Цена тарифа ${plan.name}`}
                      className="text-4xl font-bold font-display text-white tabular-nums tracking-tight"
                    />
                    {plan.monthlyPrice ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-semibold text-zinc-400">+</span>
                        <EditableText
                          contentKey={`pricing.plan.${plan.id}.monthlyPrice`}
                          defaultValue={plan.monthlyPrice}
                          label={`Ежемесячная цена тарифа ${plan.name}`}
                          className="text-xl font-bold font-display text-[#ff4d63] tabular-nums"
                        />
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-zinc-400">
                        {plan.priceNote || (language === 'de' ? 'Endpreis gem. § 19 UStG' : 'Final price (no VAT, § 19 UStG)')}
                      </span>
                    )}
                  </div>

                  <EditableText
                    as="div"
                    contentKey={`pricing.plan.${plan.id}.delivery`}
                    defaultValue={plan.deliveryTime}
                    label={`Срок / условия тарифа ${plan.name}`}
                    className="mt-2 text-xs font-mono text-zinc-400"
                  />

                  {/* Feature Checklist */}
                  <div className="mt-8 space-y-3.5 pt-6 border-t border-white/10">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-[#c81e32] shrink-0 mt-0.5" />
                        <EditableText
                          contentKey={`pricing.plan.${plan.id}.feat.${idx}`}
                          defaultValue={feat}
                          label={`Пункт тарифа ${plan.name} #${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <EditableText
                    as="div"
                    contentKey={`pricing.plan.${plan.id}.suitable`}
                    defaultValue={plan.suitableFor}
                    multiline
                    label={`Кому подходит тариф ${plan.name}`}
                    className="text-[11px] text-zinc-400 mb-4 block"
                  />
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

        {/* 2 Symmetrical Add-On Service Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {addonServices.map((addon: AddonServiceItem) => (
            <div
              key={addon.id}
              className="p-6 sm:p-7 rounded-2xl border border-white/10 bg-[#0e1118] hover:border-white/20 transition-colors flex flex-col justify-between gap-5 h-full"
            >
              <div>
                <EditableText
                  as="span"
                  contentKey={`pricing.addon.${addon.id}.badge`}
                  defaultValue={addon.badge}
                  label={`Бейдж доп-услуги ${addon.id}`}
                  className="text-[10px] font-mono uppercase tracking-wider text-[#c81e32] font-semibold block"
                />
                <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-2">
                  <EditableText
                    as="h4"
                    contentKey={`pricing.addon.${addon.id}.name`}
                    defaultValue={addon.name}
                    label={`Название доп-услуги ${addon.id}`}
                    className="text-lg font-bold text-white font-display"
                  />
                  <EditableText
                    contentKey={`pricing.addon.${addon.id}.price`}
                    defaultValue={addon.price}
                    label={`Цена доп-услуги ${addon.name}`}
                    className="text-sm font-bold text-white font-mono whitespace-nowrap"
                  />
                </div>
                <EditableText
                  as="p"
                  contentKey={`pricing.addon.${addon.id}.desc`}
                  defaultValue={addon.description}
                  multiline
                  label={`Описание доп-услуги ${addon.id}`}
                  className="text-xs sm:text-[13px] text-zinc-400 mt-2.5 leading-relaxed block"
                />
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-end">
                <button
                  onClick={() => onSelectPlan(addon.name)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-md bg-white/5 hover:bg-[#c81e32] text-zinc-200 hover:text-white border border-white/10 hover:border-[#c81e32] transition-all cursor-pointer"
                >
                  <span>{dict.pricing.addon_cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Custom Budget Estimator */}
        <div ref={calculatorRef} className="mt-16 rounded-2xl border border-white/10 bg-[#11141c] p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#c81e32]/20 text-[#c81e32] flex items-center justify-center shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  {language === 'de' ? 'Individueller Projekt-Kalkulator' : 'Custom Project Calculator'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {language === 'de'
                    ? 'Stellen Sie Ihr Wunschpaket zusammen und sehen Sie sofort den Festpreis.'
                    : 'Build your custom package and see your exact fixed price immediately.'}
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
                  {language === 'de' ? '1. Basis-Paket wählen:' : '1. Choose Base Package:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {basePackages.map((s, idx) => {
                    const isSelected = selectedService === s.id;
                    const tooltipId = `base-${s.id}`;
                    return (
                      <div
                        key={s.id}
                        className={`relative rounded-lg border transition-all flex items-stretch ${
                          activeTooltip === tooltipId ? 'z-30' : 'z-0'
                        } ${
                          isSelected
                            ? 'bg-[#c81e32] border-[#c81e32] text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedService(s.id)}
                          className="flex-1 p-3.5 pr-1 text-left cursor-pointer focus:outline-none"
                        >
                          <div className="text-xs font-semibold leading-snug">{s.label}</div>
                          <div className={`text-[11px] font-mono mt-1 ${isSelected ? 'text-white/90' : 'text-zinc-400'}`}>
                            {s.price}
                          </div>
                        </button>
                        <div className="pr-2.5 pb-2.5 flex items-end">
                          <CalculatorInfoButton
                            id={tooltipId}
                            title={s.label}
                            items={s.details}
                            activeId={activeTooltip}
                            setActiveId={setActiveTooltip}
                            isHighlighted={isSelected}
                            align={idx === 0 ? 'left' : 'right'}
                            ariaLabel={
                              language === 'de'
                                ? `Details zu ${s.label} anzeigen`
                                : `Show details for ${s.label}`
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add-on Features */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-3">
                  {language === 'de' ? '2. Optionale Zusatz-Leistungen:' : '2. Optional Business Add-Ons:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addOnModules.map((feat, idx) => {
                    const isChecked = features.includes(feat.id);
                    const tooltipId = `addon-${feat.id}`;
                    return (
                      <div
                        key={feat.id}
                        className={`relative rounded-lg border transition-all flex items-center justify-between gap-2 ${
                          activeTooltip === tooltipId ? 'z-30' : 'z-0'
                        } ${
                          isChecked
                            ? 'bg-[#181d2a] border-[#c81e32] text-white'
                            : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFeature(feat.id)}
                          className="flex-1 p-3 pr-1 text-left flex items-center justify-between gap-2 cursor-pointer focus:outline-none min-w-0"
                        >
                          <div className="flex items-center gap-2 min-w-0">
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
                        <div className="pr-2.5 flex items-center shrink-0">
                          <CalculatorInfoButton
                            id={tooltipId}
                            title={feat.label}
                            items={feat.details}
                            activeId={activeTooltip}
                            setActiveId={setActiveTooltip}
                            align={idx % 2 === 0 ? 'left' : 'right'}
                            ariaLabel={
                              language === 'de'
                                ? `Details zu ${feat.label} anzeigen`
                                : `Show details for ${feat.label}`
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly Service Options */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-3">
                  {language === 'de' ? '3. Laufende Betreuung (optional):' : '3. Optional Monthly Support:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {monthlyOptions.map((opt, idx) => {
                    const tooltipId = `monthly-${opt.id}`;
                    return (
                      <div
                        key={opt.id}
                        className={`relative rounded-lg border transition-all flex items-center justify-between gap-2 ${
                          activeTooltip === tooltipId ? 'z-30' : 'z-0'
                        } ${
                          opt.checked
                            ? 'bg-[#181d2a] border-[#c81e32] text-white'
                            : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={opt.toggle}
                          className="flex-1 p-3 pr-1 text-left flex items-center justify-between gap-2 cursor-pointer focus:outline-none min-w-0"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                opt.checked ? 'bg-[#c81e32] border-[#c81e32] text-white' : 'border-zinc-600'
                              }`}
                            >
                              {opt.checked && <Check className="w-3 h-3" />}
                            </div>
                            <span className="text-xs font-medium text-zinc-200">{opt.label}</span>
                          </div>
                          <span className="text-[11px] font-mono text-zinc-400 shrink-0">{opt.cost}</span>
                        </button>
                        <div className="pr-2.5 flex items-center shrink-0">
                          <CalculatorInfoButton
                            id={tooltipId}
                            title={opt.label}
                            items={opt.details}
                            activeId={activeTooltip}
                            setActiveId={setActiveTooltip}
                            align={idx % 2 === 0 ? 'left' : 'right'}
                            ariaLabel={
                              language === 'de'
                                ? `Details zu ${opt.label} anzeigen`
                                : `Show details for ${opt.label}`
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
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
                  <span className="text-zinc-400">
                    {language === 'de' ? 'Zusatzmodule' : 'Add-On Modules'} ({features.length}):
                  </span>
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
                    {language === 'de'
                      ? `ca. ${estimate.estimatedWeeks} ${estimate.estimatedWeeks === 1 ? 'Woche' : 'Wochen'}`
                      : `approx. ${estimate.estimatedWeeks} ${estimate.estimatedWeeks === 1 ? 'week' : 'weeks'}`}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-xs text-zinc-400">
                  {language === 'de' ? 'Einmaliger Paketpreis:' : 'One-Time Project Price:'}
                </div>
                <div className="text-3xl font-bold font-display text-white mt-1 tabular-nums">
                  {estimate.totalOneTime.toLocaleString(locale)} €
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  {language === 'de' ? 'Endpreis (gem. § 19 UStG)' : 'Final price (exempt under § 19 UStG)'}
                </div>
              </div>

              <button
                onClick={() => {
                  const summary = `${getServiceLabel(selectedService)} (${language === 'de' ? 'Kalkulation' : 'Estimate'}: ca. ${estimate.totalOneTime} € ${language === 'de' ? 'Endpreis gem. § 19 UStG' : 'Final price § 19 UStG'}${
                    estimate.monthlyRetainer > 0 ? ` + ${estimate.monthlyRetainer} €/${language === 'de' ? 'Monat' : 'mo'}` : ''
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

        {/* Bottom Pricing Footnote */}
        <div className="mt-10 pt-6 border-t border-white/5 max-w-4xl mx-auto text-center">
          <EditableText
            as="p"
            contentKey="pricing.footnote"
            defaultValue={dict.pricing.footnote}
            multiline
            label="Сноска секции цен"
            className="text-xs text-zinc-400 leading-relaxed block"
          />
        </div>
      </div>
    </section>
  );
};
