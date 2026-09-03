const DOMAIN = 'web-library.net';

import { request } from '@playwright/test';

const MAIL_TM_BASE = 'https://api.mail.tm';

let cachedDomain: string | null = null;

async function getActiveDomain(): Promise<string> {
  if (cachedDomain) return cachedDomain;

  const api = await request.newContext({ baseURL: MAIL_TM_BASE });
  const res = await api.get('/domains');

  if (!res.ok()) {
    throw new Error(`Failed to fetch mail.tm domains: ${res.status()}`);
  }

  const data = await res.json();
  const domains = data['hydra:member'] ?? [];

  const active = domains.find((d: any) => d.isActive);
  if (!active) throw new Error('No active mail.tm domain available');

  cachedDomain = active.domain;
  return cachedDomain!;
}

export async function generateDynamicEmail(prefix = 'qa'): Promise<string> {
  const domain = await getActiveDomain();
  const randomPart = Math.random().toString(36).slice(2, 8);
  const timestampPart = Date.now().toString(36);
  const localPart = `${prefix}.${randomPart}.${timestampPart}`.replace(/[^a-z0-9.]/gi, '');
  return `${localPart}@${domain}`;
}

export function generateDynamicPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#+';
  const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)];
  const core = Array.from({ length: 6 }, () => pick(lower)).join('');
  return `${pick(upper)}${core}${pick(digits)}${pick(symbols)}`;
}

const FIRST_NAMES = ['Anna', 'David', 'Mariam', 'Aram', 'Lilit', 'Gor', 'Nare', 'Vahe', 'Siranush', 'Tigran'];
const LAST_NAMES = ['Petrosyan', 'Sargsyan', 'Grigoryan', 'Harutyunyan', 'Avetisyan', 'Hakobyan', 'Movsisyan'];

export function generateDynamicName(): { firstName: string; lastName: string } {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastNameBase = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return { firstName, lastName: lastNameBase };
}

export function generateDynamicPhoneNumber(): { phoneCode: string; phoneNumber: string } {
  const validPrefixes = ['55', '77', '91', '93', '94', '95', '96', '98', '99'];
  const prefix = validPrefixes[Math.floor(Math.random() * validPrefixes.length)];
  const rest = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  return { phoneCode: '374', phoneNumber: `${prefix}${rest}` };
}

