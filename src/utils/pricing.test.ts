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

  assert.equal(result.basePrice, 1850);
  assert.equal(result.addOnPrice, 0);
  assert.equal(result.totalOneTime, 1850);
  assert.equal(result.monthlyRetainer, 0);
  assert.equal(result.estimatedWeeks, 2);
});

test('calculateProjectEstimate calculates Shopify with CRM and Google AI add-ons', () => {
  const result = calculateProjectEstimate({
    serviceType: 'shopify',
    additionalFeatures: ['crm_integration', 'google_ai_automation'],
    maintenanceRetainer: true,
    adsManagement: true,
  });

  assert.equal(result.basePrice, 3900);
  assert.equal(result.addOnPrice, 800 + 950);
  assert.equal(result.totalOneTime, 3900 + 1750);
  assert.equal(result.monthlyRetainer, 390 + 850);
  assert.equal(result.estimatedWeeks, 3);
});

test('calculateProjectEstimate calculates Meta Ads, Social Audit and SWOT analysis add-ons', () => {
  const result = calculateProjectEstimate({
    serviceType: 'landingpage',
    additionalFeatures: ['meta_ads_setup', 'social_audit_content', 'strategic_swot_pestel'],
    maintenanceRetainer: false,
    adsManagement: false,
  });

  assert.equal(result.basePrice, 1850);
  assert.equal(result.addOnPrice, 750 + 650 + 700);
  assert.equal(result.totalOneTime, 1850 + 2100);
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
  const { TRANSLATIONS, SERVICES_I18N, PRICING_PLANS_I18N } = await import('../data/translations');

  const deSections = Object.keys(TRANSLATIONS.de);
  const enSections = Object.keys(TRANSLATIONS.en);
  assert.deepEqual(deSections.sort(), enSections.sort());

  for (const sec of deSections) {
    const deKeys = Object.keys((TRANSLATIONS.de as any)[sec]);
    const enKeys = Object.keys((TRANSLATIONS.en as any)[sec]);
    assert.deepEqual(deKeys.sort(), enKeys.sort(), `Section ${sec} keys do not match between DE and EN`);
  }

  assert.equal(SERVICES_I18N.de.length, SERVICES_I18N.en.length);
  assert.deepEqual(
    SERVICES_I18N.de.map((s) => s.id),
    SERVICES_I18N.en.map((s) => s.id)
  );

  assert.equal(PRICING_PLANS_I18N.de.length, PRICING_PLANS_I18N.en.length);
  assert.deepEqual(
    PRICING_PLANS_I18N.de.map((p) => p.id),
    PRICING_PLANS_I18N.en.map((p) => p.id)
  );
});
