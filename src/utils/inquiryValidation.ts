import { ContactFormData, InquiryStatus } from '../types';

// Synchronized verbatim with firebase-blueprint.json
export const INQUIRY_BOUNDS = {
  requestedService: { minLength: 1, maxLength: 160 },
  budget: { minLength: 1, maxLength: 80 },
  timeline: { minLength: 1, maxLength: 100 },
  name: { minLength: 2, maxLength: 120 },
  email: { minLength: 5, maxLength: 160, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { maxLength: 40 },
  company: { maxLength: 160 },
  message: { minLength: 10, maxLength: 4000 },
  userId: { maxLength: 128 },
  adminNote: { maxLength: 2000 },
} as const;

export const USER_PROFILE_BOUNDS = {
  uid: { minLength: 1, maxLength: 128, pattern: /^[a-zA-Z0-9_-]+$/ },
  displayName: { minLength: 1, maxLength: 120 },
  photoURL: { maxLength: 500 },
} as const;

export interface SanitizedInquiryPayload {
  requestedService: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  crmInterest: boolean;
  language: 'de' | 'en';
  status: InquiryStatus;
  userId: string;
  adminNote: string;
}

function clampString(value: string | undefined, maxLength: number): string {
  return (value ?? '').trim().slice(0, maxLength);
}

export function buildSanitizedInquiryPayload(
  formData: ContactFormData,
  language: 'de' | 'en',
  userId: string | null | undefined
): SanitizedInquiryPayload {
  const requestedService =
    clampString(formData.service, INQUIRY_BOUNDS.requestedService.maxLength) || 'General Inquiry';
  const budget = clampString(formData.budget, INQUIRY_BOUNDS.budget.maxLength) || 'Flexible';
  const timeline = clampString(formData.timeline, INQUIRY_BOUNDS.timeline.maxLength) || 'ASAP';
  const name = clampString(formData.name, INQUIRY_BOUNDS.name.maxLength);
  const email = clampString(formData.email, INQUIRY_BOUNDS.email.maxLength);
  const phone = clampString(formData.phone, INQUIRY_BOUNDS.phone.maxLength);
  const company = clampString(formData.company, INQUIRY_BOUNDS.company.maxLength);
  const message = clampString(formData.message, INQUIRY_BOUNDS.message.maxLength);
  const safeUserId = clampString(userId ?? '', INQUIRY_BOUNDS.userId.maxLength);

  if (name.length < INQUIRY_BOUNDS.name.minLength) {
    throw new Error('Inquiry name violates minLength boundary');
  }
  if (
    email.length < INQUIRY_BOUNDS.email.minLength ||
    !INQUIRY_BOUNDS.email.pattern.test(email)
  ) {
    throw new Error('Inquiry email violates schema pattern or minLength boundary');
  }
  if (message.length < INQUIRY_BOUNDS.message.minLength) {
    throw new Error('Inquiry message violates minLength boundary');
  }

  return {
    requestedService,
    budget,
    timeline,
    name,
    email,
    phone,
    company,
    message,
    crmInterest: Boolean(formData.crmInterest),
    language: language === 'en' ? 'en' : 'de',
    status: 'new',
    userId: safeUserId,
    adminNote: '',
  };
}

export function clampAdminNote(note: string): string {
  return clampString(note, INQUIRY_BOUNDS.adminNote.maxLength);
}

export function sanitizeUserProfileFields(input: {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
  email?: string | null;
}): { uid: string; displayName: string; photoURL: string; email: string } {
  const uid = clampString(input.uid, USER_PROFILE_BOUNDS.uid.maxLength);
  if (!USER_PROFILE_BOUNDS.uid.pattern.test(uid)) {
    throw new Error('Invalid UID format');
  }
  const displayName =
    clampString(input.displayName ?? undefined, USER_PROFILE_BOUNDS.displayName.maxLength) ||
    'Client';
  const photoURL = clampString(input.photoURL ?? undefined, USER_PROFILE_BOUNDS.photoURL.maxLength);
  const email = clampString(input.email ?? undefined, INQUIRY_BOUNDS.email.maxLength);

  return { uid, displayName, photoURL, email };
}
