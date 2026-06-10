import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esAR from './locales/es-AR.json';
import enUS from './locales/en-US.json';
import { DEFAULT_LOCALE } from '@/constants';

const resources = {
  'es-AR': { translation: esAR },
  'en-US': { translation: enUS },
};

function resolveLocale(): string {
  const deviceLocales = Localization.getLocales();
  const deviceTag = deviceLocales[0]?.languageTag ?? DEFAULT_LOCALE;
  if (deviceTag.startsWith('es')) return 'es-AR';
  if (deviceTag.startsWith('en')) return 'en-US';
  return DEFAULT_LOCALE;
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: resolveLocale(),
    fallbackLng: DEFAULT_LOCALE,
    compatibilityJSON: 'v4',
    interpolation: { escapeValue: false },
  });
}

export default i18n;
export { resolveLocale };
