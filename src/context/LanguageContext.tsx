import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  TRANSLATIONS,
  SERVICES_I18N,
  PROJECTS_I18N,
  PRICING_PLANS_I18N,
  TESTIMONIALS_I18N,
  FAQS_I18N,
  TestimonialItem,
  FaqItem,
} from '../data/translations';
import { ServiceItem, ProjectCaseStudy, PricingPlan } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (section: keyof typeof TRANSLATIONS['de'], key?: string) => any;
  dict: typeof TRANSLATIONS['de'];
  services: ServiceItem[];
  projects: ProjectCaseStudy[];
  pricingPlans: PricingPlan[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mb_lang');
    if (saved === 'en' || saved === 'de') return saved;
    // Default to German for local Cologne audience
    return 'de';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('mb_lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const dict = TRANSLATIONS[language];

  const t = (section: keyof typeof TRANSLATIONS['de'], key?: string) => {
    const sec = dict[section] as any;
    if (!key) return sec;
    return sec?.[key] ?? '';
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    dict,
    services: SERVICES_I18N[language],
    projects: PROJECTS_I18N[language],
    pricingPlans: PRICING_PLANS_I18N[language],
    testimonials: TESTIMONIALS_I18N[language],
    faqs: FAQS_I18N[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
