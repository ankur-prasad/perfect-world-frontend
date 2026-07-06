import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'
import de from './locales/de.json'

export const SUPPORTED_LANGUAGES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
}

// Country → local site language. English is always offered alongside.
export const COUNTRY_LANGUAGE: Record<string, string> = {
  // Spanish-speaking
  CO: 'es', ES: 'es', MX: 'es', AR: 'es', CL: 'es', PE: 'es', EC: 'es',
  VE: 'es', BO: 'es', UY: 'es', PY: 'es', CR: 'es', PA: 'es', GT: 'es',
  HN: 'es', SV: 'es', NI: 'es', DO: 'es', CU: 'es', PR: 'es',
  // German-speaking
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    de: { translation: de },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    // React already escapes rendered strings
    escapeValue: false,
  },
})

export default i18n
