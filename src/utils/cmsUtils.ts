import { ContactFormData, LeadRecord, LeadStatus } from '../types';
import { INQUIRY_BOUNDS } from './inquiryValidation';

export const LEAD_STATUSES: readonly LeadStatus[] = ['Новая', 'В работе', 'Закрыта'];

export const CMS_BOUNDS = {
  maxEntries: 500,
  maxKeyLength: 160,
  maxValueLength: 4000,
  updatedByMaxLength: 128,
} as const;

export interface SanitizedLeadPayload {
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
  status: LeadStatus;
  userId: string;
  adminNote: string;
}

function clampString(value: string | undefined, maxLength: number): string {
  return (value ?? '').trim().slice(0, maxLength);
}

export function buildSanitizedLeadPayload(
  formData: ContactFormData,
  language: 'de' | 'en',
  userId: string | null | undefined
): SanitizedLeadPayload {
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
    throw new Error('Lead name violates minLength boundary');
  }
  if (
    email.length < INQUIRY_BOUNDS.email.minLength ||
    !INQUIRY_BOUNDS.email.pattern.test(email)
  ) {
    throw new Error('Lead email violates schema pattern or minLength boundary');
  }
  if (message.length < INQUIRY_BOUNDS.message.minLength) {
    throw new Error('Lead message violates minLength boundary');
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
    status: 'Новая',
    userId: safeUserId,
    adminNote: '',
  };
}

export function sanitizeCmsOverrides(
  raw: Record<string, unknown>
): Record<string, string> {
  const result: Record<string, string> = {};
  let count = 0;

  for (const [key, value] of Object.entries(raw)) {
    if (count >= CMS_BOUNDS.maxEntries) break;
    const cleanKey = key.trim().slice(0, CMS_BOUNDS.maxKeyLength);
    if (!cleanKey || typeof value !== 'string') continue;
    const cleanValue = value.slice(0, CMS_BOUNDS.maxValueLength);
    result[cleanKey] = cleanValue;
    count += 1;
  }

  return result;
}

export function isValidImageUrlInput(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed || trimmed.length > 2000) return false;
  if (trimmed.startsWith('/')) {
    return !trimmed.startsWith('//');
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function escapeCsvCell(value: string): string {
  const safe = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (/[",\n;]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

export function formatLeadTimestampIso(ts?: { seconds: number } | null): string {
  if (!ts?.seconds) return '';
  return new Date(ts.seconds * 1000).toISOString();
}

export function exportLeadsToCsv(leads: LeadRecord[]): string {
  const headers = [
    'ID',
    'Дата и время',
    'Имя',
    'Email',
    'Телефон',
    'Компания',
    'Услуга',
    'Бюджет',
    'Сроки',
    'Сообщение',
    'Статус',
    'Заметка',
  ];

  const rows = leads.map((lead) => [
    lead.id,
    formatLeadTimestampIso(lead.createdAt),
    lead.name,
    lead.email,
    lead.phone,
    lead.company,
    lead.requestedService,
    lead.budget,
    lead.timeline,
    lead.message,
    lead.status,
    lead.adminNote,
  ]);

  const lines = [headers, ...rows].map((row) => row.map((cell) => escapeCsvCell(String(cell ?? ''))).join(','));
  return '\uFEFF' + lines.join('\r\n');
}
