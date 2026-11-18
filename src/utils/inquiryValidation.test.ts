import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INQUIRY_BOUNDS,
  buildSanitizedInquiryPayload,
  clampAdminNote,
  sanitizeUserProfileFields,
} from './inquiryValidation';

test('buildSanitizedInquiryPayload produces schema-compliant payload and truncates oversized fields', () => {
  const longMessage = 'A'.repeat(5000);
  const payload = buildSanitizedInquiryPayload(
    {
      service: 'Shopify Onlineshop',
      budget: '3.000 € – 6.000 €',
      timeline: 'In 2–4 Wochen',
      name: '  Elena Hoffmann  ',
      email: 'elena@hoffmann-studio.de',
      phone: '+49 221 123456',
      company: 'Hoffmann Studio GmbH',
      message: longMessage,
      crmInterest: true,
    },
    'de',
    null
  );

  assert.equal(payload.name, 'Elena Hoffmann');
  assert.equal(payload.email, 'elena@hoffmann-studio.de');
  assert.equal(payload.message.length, INQUIRY_BOUNDS.message.maxLength);
  assert.equal(payload.status, 'new');
  assert.equal(payload.userId, '');
  assert.equal(payload.adminNote, '');
  assert.equal(payload.language, 'de');
});

test('buildSanitizedInquiryPayload rejects invalid email or short message', () => {
  assert.throws(() =>
    buildSanitizedInquiryPayload(
      {
        service: 'Meta Ads',
        budget: '1.500 €',
        timeline: 'ASAP',
        name: 'Max',
        email: 'bad-email',
        phone: '',
        company: '',
        message: 'Valid length project brief message.',
        crmInterest: false,
      },
      'en',
      'user123'
    )
  );

  assert.throws(() =>
    buildSanitizedInquiryPayload(
      {
        service: 'Meta Ads',
        budget: '1.500 €',
        timeline: 'ASAP',
        name: 'Max',
        email: 'max@agency.de',
        phone: '',
        company: '',
        message: 'Too short',
        crmInterest: false,
      },
      'en',
      'user123'
    )
  );
});

test('clampAdminNote enforces maxLength of 2000 characters', () => {
  const clamped = clampAdminNote('x'.repeat(2500));
  assert.equal(clamped.length, INQUIRY_BOUNDS.adminNote.maxLength);
});

test('sanitizeUserProfileFields validates UID and clamps display fields', () => {
  const clean = sanitizeUserProfileFields({
    uid: 'abc_123-XYZ',
    displayName: null,
    photoURL: 'https://example.com/avatar.png',
    email: 'client@example.de',
  });
  assert.equal(clean.displayName, 'Client');
  assert.equal(clean.uid, 'abc_123-XYZ');

  assert.throws(() =>
    sanitizeUserProfileFields({
      uid: 'invalid/uid/with/slashes',
      displayName: 'Test',
      photoURL: '',
      email: 'test@example.de',
    })
  );
});
