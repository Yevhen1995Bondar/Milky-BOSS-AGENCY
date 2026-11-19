import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProjectEstimate,
  calculateConversionUplift,
  validateContactForm,
} from './pricing';

test('calculateProjectEstimate computes baseline landingpage correctly', () => {
  const result = calculateProjectEstimate({
    serviceType: 'landingpage',
    additionalFeatures: [],
    maintenanceRetainer: false,
    adsManagement: false,
  });

  assert.equal(result.basePrice, 500);
  assert.equal(result.addOnPrice, 0);
  assert.equal(result.totalOneTime, 500);
  assert.equal(result.monthlyRetainer, 0);
  assert.equal(result.estimatedWeeks, 1);
});

test('calculateProjectEstimate calculates Shopify with photo/video and social strategy add-ons', () => {
  const result = calculateProjectEstimate({
    serviceType: 'shopify',
    additionalFeatures: ['photo_video_nrw', 'social_strategy_plan'],
    maintenanceRetainer: true,
    adsManagement: true,
  });

  assert.equal(result.basePrice, 950);
  assert.equal(result.addOnPrice, 350 + 450);
  assert.equal(result.totalOneTime, 950 + 800);
  assert.equal(result.monthlyRetainer, 90 + 250);
  assert.equal(result.estimatedWeeks, 2);
});

test('calculateProjectEstimate calculates Website + Google Ads Start with Meta Ads and CRM add-ons', () => {
  const result = calculateProjectEstimate({
    serviceType: 'website_ads',
    additionalFeatures: ['meta_ads_setup', 'crm_integration'],
    maintenanceRetainer: false,
    adsManagement: false,
  });

  assert.equal(result.basePrice, 750);
  assert.equal(result.addOnPrice, 350 + 290);
  assert.equal(result.totalOneTime, 750 + 640);
});

test('calculateConversionUplift accurately calculates revenue growth and uplift', () => {
  const result = calculateConversionUplift({
    monthlyVisitors: 10000,
    conversionRate: 2.0, // 200 orders
    averageOrderValue: 80, // 16,000 EUR
    targetLiftPercent: 50, // -> 3.0% = 300 orders = 24,000 EUR
  });

  assert.equal(result.currentMonthlyOrders, 200);
  assert.equal(result.currentMonthlyRevenue, 16000);
  assert.equal(result.projectedConversionRate, 3.0);
  assert.equal(result.projectedMonthlyOrders, 300);
  assert.equal(result.projectedMonthlyRevenue, 24000);
  assert.equal(result.monthlyExtraRevenue, 8000);
  assert.equal(result.annualExtraRevenue, 96000);
});

test('validateContactForm checks required fields correctly', () => {
  const invalid = validateContactForm({
    name: '',
    email: 'not-an-email',
    message: 'hi',
  });

  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);

  const valid = validateContactForm({
    name: 'Alexander Weber',
    email: 'weber@example.de',
    phone: '+49 221 9876543',
    message: 'Wir suchen einen Partner für den Relaunch unseres Shopify Onlineshops in Köln.',
  });

  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('translations dictionary has matching top-level and nested keys for DE and EN', async () => {
  const { TRANSLATIONS, SERVICES_I18N, PRICING_PLANS_I18N, ADDON_SERVICES_I18N } = await import('../data/translations');

  const deSections = Object.keys(TRANSLATIONS.de);
  const enSections = Object.keys(TRANSLATIONS.en);
  assert.deepEqual(deSections.sort(), enSections.sort());

  for (const sec of deSections) {
    const deKeys = Object.keys((TRANSLATIONS.de as any)[sec]);
    const enKeys = Object.keys((TRANSLATIONS.en as any)[sec]);
    assert.deepEqual(deKeys.sort(), enKeys.sort(), `Section ${sec} keys do not match between DE and EN`);
  }

  assert.equal(SERVICES_I18N.de.length, 5);
  assert.equal(SERVICES_I18N.de.length, SERVICES_I18N.en.length);
  assert.deepEqual(
    SERVICES_I18N.de.map((s) => s.id),
    SERVICES_I18N.en.map((s) => s.id)
  );

  assert.equal(PRICING_PLANS_I18N.de.length, 3);
  assert.equal(PRICING_PLANS_I18N.de.length, PRICING_PLANS_I18N.en.length);
  assert.deepEqual(
    PRICING_PLANS_I18N.de.map((p) => p.id),
    PRICING_PLANS_I18N.en.map((p) => p.id)
  );

  assert.equal(ADDON_SERVICES_I18N.de.length, 2);
  assert.equal(ADDON_SERVICES_I18N.de.length, ADDON_SERVICES_I18N.en.length);
  assert.deepEqual(
    ADDON_SERVICES_I18N.de.map((a) => a.id),
    ADDON_SERVICES_I18N.en.map((a) => a.id)
  );
});
