import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr/common.json';
import en from './locales/en/common.json';
import ar from './locales/ar/common.json';

// Only fr/en/ar have real content this pass - pulaar/wolof/soninké are
// deferred to a translation-content pass (per spec "Multilingual Support",
// the language list itself is data-driven, not hardcoded here).
export const SUPPORTED_LANGUAGES = ['fr', 'en', 'ar'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const RTL_LANGUAGES: readonly SupportedLanguage[] = ['ar'];

export function isRtlLanguage(language: string): boolean {
  return (RTL_LANGUAGES as readonly string[]).includes(language);
}

// A manually-picked language is a browser-local preference, not tied to the
// logged-in account - it survives reloads and logout/login on the same
// browser. AuthContext only falls back to the account's stored `language`
// field when no local override exists yet (fresh browser/first login).
export const LANGUAGE_STORAGE_KEY = 'vbg_language';

void i18next.use(initReactI18next).init({
  resources: {
    fr: { common: fr },
    en: { common: en },
    ar: { common: ar },
  },
  lng: localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? 'fr',
  fallbackLng: 'fr',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export default i18next;
