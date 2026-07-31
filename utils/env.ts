import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
dotenv.config();

const ACCOUNT_FILE = path.join(__dirname, '..', '.auth', 'test-account.json');

function loadFreshAccount(): { email: string; password: string } | null {
  if (!fs.existsSync(ACCOUNT_FILE)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(ACCOUNT_FILE, 'utf-8'));
    if (data.email && data.password) return { email: data.email, password: data.password };
  } catch {
    // Malformed/partial file - ignore and fall back to .env below.
  }
  return null;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Copy .env.example to .env and fill in a real, manually-created test account.`
    );
  }
  return value;
}

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://am.globbing.com',
  loginUrl: process.env.LOGIN_URL ?? 'https://am.globbing.com/en/login/',
  get testUserEmail() {
    return loadFreshAccount()?.email ?? required('TEST_USER_EMAIL');
  },
  get testUserPassword() {
    return loadFreshAccount()?.password ?? required('TEST_USER_PASSWORD');
  },
};
