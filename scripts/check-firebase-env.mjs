#!/usr/bin/env node
/**
 * Verifica que las variables EXPO_PUBLIC_FIREBASE_* estén presentes.
 * Uso: node scripts/check-firebase-env.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env');

const required = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
];

if (!existsSync(envPath)) {
  console.error('❌ No existe .env — copiá .env.example y completá los valores.');
  console.error('   Ver docs/FIREBASE-SETUP.md');
  process.exit(1);
}

const envText = readFileSync(envPath, 'utf8');
const missing = required.filter((key) => {
  const match = envText.match(new RegExp(`^${key}=(.+)$`, 'm'));
  return !match || !match[1].trim();
});

if (missing.length) {
  console.error('❌ Faltan variables en .env:');
  missing.forEach((k) => console.error(`   - ${k}`));
  process.exit(1);
}

console.log('✅ Firebase env vars presentes en .env');
console.log('   Reiniciá Expo (`npm start`) después de cambios en .env');
