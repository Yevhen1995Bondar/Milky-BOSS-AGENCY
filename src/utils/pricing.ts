import { ContactFormData, FormErrors } from '../types';

export interface EstimateOptions {
  serviceType: 'landingpage' | 'website_ads' | 'shopify';
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
  let basePrice = 500;
  let estimatedWeeks = 1;

  switch (options.serviceType) {
    case 'landingpage':
      basePrice = 500;
      estimatedWeeks = 1;
      break;
    case 'website_ads':
      basePrice = 750;
      estimatedWeeks = 1;
      break;
    case 'shopify':
      basePrice = 950;
      estimatedWeeks = 2;
      break;
  }

  let addOnPrice = 0;
  for (const feature of options.additionalFeatures) {
    switch (feature) {
      case 'photo_video_nrw':
        addOnPrice += 350;
        break;
      case 'social_strategy_plan':
        addOnPrice += 450;
        break;
      case 'google_ads_setup':
        addOnPrice += 250;
        break;
      case 'meta_ads_setup':
        addOnPrice += 350;
        break;
      case 'crm_integration':
        addOnPrice += 290;
        break;
      case 'extra_products':
        addOnPrice += 350;
        break;
      default:
        addOnPrice += 250;
    }
  }

  let monthlyRetainer = 0;
  if (options.maintenanceRetainer) {
    monthlyRetainer += 90;
  }
  if (options.adsManagement) {
    monthlyRetainer += 250;
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
