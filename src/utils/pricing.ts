import { ContactFormData, FormErrors } from '../types';

export interface EstimateOptions {
  serviceType: 'landingpage' | 'shopify' | 'corporate' | 'enterprise';
  additionalFeatures: string[];
  maintenanceRetainer: boolean;
  adsManagement: boolean;
}

export function calculateProjectEstimate(options: EstimateOptions): {
  basePrice: number;
  addOnPrice: number;
  monthlyRetainer: number;
  totalOneTime: number;
  estimatedWeeks: number;
} {
  let basePrice = 1850;
  let estimatedWeeks = 2;

  switch (options.serviceType) {
    case 'landingpage':
      basePrice = 1850;
      estimatedWeeks = 2;
      break;
    case 'shopify':
      basePrice = 3900;
      estimatedWeeks = 3;
      break;
    case 'corporate':
      basePrice = 4400;
      estimatedWeeks = 4;
      break;
    case 'enterprise':
      basePrice = 6500;
      estimatedWeeks = 6;
      break;
  }

  let addOnPrice = 0;
  for (const feature of options.additionalFeatures) {
    switch (feature) {
      case 'crm_integration':
        addOnPrice += 800;
        break;
      case 'google_ai_automation':
        addOnPrice += 950;
        break;
      case 'meta_ads_setup':
        addOnPrice += 750;
        break;
      case 'social_audit_content':
        addOnPrice += 650;
        break;
      case 'strategic_swot_pestel':
        addOnPrice += 700;
        break;
      case 'seo_bundle':
        addOnPrice += 600;
        break;
      case 'multilingual':
        addOnPrice += 750;
        break;
      case 'custom_checkout':
        addOnPrice += 850;
        break;
      default:
        addOnPrice += 400;
    }
  }

  let monthlyRetainer = 0;
  if (options.maintenanceRetainer) {
    monthlyRetainer += 390;
  }
  if (options.adsManagement) {
    monthlyRetainer += 850;
  }

  return {
    basePrice,
    addOnPrice,
    monthlyRetainer,
    totalOneTime: basePrice + addOnPrice,
    estimatedWeeks,
  };
}

export interface RoiInputs {
  monthlyVisitors: number;
  conversionRate: number; // in percentage, e.g. 1.8%
  averageOrderValue: number; // in EUR, e.g. 85 €
  targetLiftPercent: number; // in percentage boost, e.g. 35%
}

export function calculateConversionUplift(inputs: RoiInputs): {
  currentMonthlyOrders: number;
  currentMonthlyRevenue: number;
  projectedConversionRate: number;
  projectedMonthlyOrders: number;
  projectedMonthlyRevenue: number;
  monthlyExtraRevenue: number;
  annualExtraRevenue: number;
} {
  const currentRateDecimal = Math.max(0.1, inputs.conversionRate) / 100;
  const currentOrders = Math.round(inputs.monthlyVisitors * currentRateDecimal);
  const currentRevenue = currentOrders * inputs.averageOrderValue;

  const upliftMultiplier = 1 + inputs.targetLiftPercent / 100;
  const newRateDecimal = currentRateDecimal * upliftMultiplier;
  const projectedOrders = Math.round(inputs.monthlyVisitors * newRateDecimal);
  const projectedRevenue = projectedOrders * inputs.averageOrderValue;

  const monthlyExtraRevenue = Math.max(0, projectedRevenue - currentRevenue);
  const annualExtraRevenue = monthlyExtraRevenue * 12;

  return {
    currentMonthlyOrders: currentOrders,
    currentMonthlyRevenue: Math.round(currentRevenue),
    projectedConversionRate: Number((newRateDecimal * 100).toFixed(2)),
    projectedMonthlyOrders: projectedOrders,
    projectedMonthlyRevenue: Math.round(projectedRevenue),
    monthlyExtraRevenue: Math.round(monthlyExtraRevenue),
    annualExtraRevenue: Math.round(annualExtraRevenue),
  };
}

export function validateContactForm(data: Partial<ContactFormData>): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Bitte geben Sie Ihren vollständigen Namen an.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse an.';
  }

  if (data.phone && data.phone.trim().length > 0) {
    const phoneClean = data.phone.replace(/[\s\-\+\(\)]/g, '');
    if (phoneClean.length < 6 || !/^\d+$/.test(phoneClean)) {
      errors.phone = 'Bitte geben Sie eine gültige Telefonnummer ein.';
    }
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Bitte beschreiben Sie kurz Ihr Vorhaben (mind. 10 Zeichen).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
