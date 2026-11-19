import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSanitizedLeadPayload,
  sanitizeCmsOverrides,
  isValidImageUrlInput,
  exportLeadsToCsv,
  CMS_BOUNDS,
} from './cmsUtils';
import { LeadRecord } from '../types';

test('buildSanitizedLeadPayload defaults status to Новая and clamps fields', () => {
  const payload = buildSanitizedLeadPayload(
    {
      service: 'Shopify E-Commerce Pro',
      budget: '3.000 € – 6.000 €',
      timeline: 'In 2–4 Wochen',
      name: '  Lukas Meyer  ',
      email: 'lukas@meyer-shop.de',
      phone: '+49 170 5551234',
      company: 'Meyer GmbH',
      message: 'Wir brauchen einen neuen Shopify Store mit Klaviyo Integration.',
      crmInterest: true,
    },
    'de',
    null
  );

  assert.equal(payload.status, 'Новая');
  assert.equal(payload.name, 'Lukas Meyer');
  assert.equal(payload.adminNote, '');
  assert.equal(payload.userId, '');
});

test('sanitizeCmsOverrides enforces max 500 entries and maxValueLength', () => {
  const huge: Record<string, unknown> = {};
  for (let i = 0; i < 600; i += 1) {
    huge[`key.${i}`] = i === 0 ? 'X'.repeat(5000) : `val-${i}`;
  }
  huge['   '] = 'ignored';
  huge['non_string'] = 12345;

  const clean = sanitizeCmsOverrides(huge);
  assert.equal(Object.keys(clean).length, CMS_BOUNDS.maxEntries);
  assert.equal(clean['key.0'].length, CMS_BOUNDS.maxValueLength);
  assert.equal('non_string' in clean, false);
});

test('isValidImageUrlInput accepts relative assets and https URLs and rejects javascript:', () => {
  assert.equal(isValidImageUrlInput('/assets/projects/cafe-kundera.jpg'), true);
  assert.equal(isValidImageUrlInput('https://example.com/photo.webp'), true);
  assert.equal(isValidImageUrlInput('javascript:alert(1)'), false);
  assert.equal(isValidImageUrlInput('//evil.com/x.png'), false);
  assert.equal(isValidImageUrlInput(''), false);
});

test('exportLeadsToCsv includes UTF-8 BOM and RFC-4180 escapes quotes, commas, and newlines', () => {
  const sample: LeadRecord[] = [
    {
      id: 'lead-1',
      requestedService: 'Meta Ads, Audits',
      budget: '3.000 €',
      timeline: 'ASAP',
      name: 'Anna "VIP" Becker',
      email: 'anna@example.de',
      phone: '+49 221 999',
      company: 'Studio Köln',
      message: 'Line 1\nLine 2, urgent',
      crmInterest: true,
      language: 'de',
      status: 'В работе',
      userId: '',
      adminNote: 'Follow up',
      createdAt: { seconds: 1700000000, nanoseconds: 0 },
    },
  ];

  const csv = exportLeadsToCsv(sample);
  assert.ok(csv.startsWith('\uFEFFID,'));
  assert.ok(csv.includes('"Meta Ads, Audits"'));
  assert.ok(csv.includes('"Anna ""VIP"" Becker"'));
  assert.ok(csv.includes('"Line 1\nLine 2, urgent"'));
  assert.ok(csv.includes('В работе'));
});
