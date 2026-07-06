import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import i18n, { COUNTRY_LANGUAGE, SUPPORTED_LANGUAGES } from '../i18n'
import { setShopifyBuyerContext } from '../utils/shopify'

const LANGUAGE_KEY = 'pw-language' // explicit user choice, wins over detection
const COUNTRY_KEY = 'pw-country'   // last detected country, avoids re-fetch flicker

interface LocaleState {
  /** ISO 3166-1 alpha-2 country the visitor is browsing from, if known */
  country: string | null
  /** Active site language (ISO 639-1) */
  language: string
  /** Languages offered in the switcher: English always + the visitor's local language */
  availableLanguages: string[]
  setLanguage: (lang: string) => void
}

const LocaleContext = createContext<LocaleState>({
  country: null,
  language: 'en',
  availableLanguages: ['en'],
  setLanguage: () => {},
})

// eslint-disable-next-line react-refresh/only-export-components
export const useLocale = () => useContext(LocaleContext)

function applyBuyerContext(country: string | null, language: string) {
  setShopifyBuyerContext({
    country: country ?? undefined,
    language: language.toUpperCase() as 'EN' | 'ES' | 'DE',
  })
}

async function detectCountry(): Promise<string | null> {
  // Vercel geo header via our /api/geo function; short timeout so dev
  // (where the endpoint doesn't exist) and slow networks never block the site.
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 1500)
    const res = await fetch('/api/geo', { signal: controller.signal })
    clearTimeout(timer)
    if (res.ok) {
      const { country } = await res.json()
      if (typeof country === 'string' && /^[A-Z]{2}$/.test(country)) return country
    }
  } catch {
    // fall through to browser locale
  }
  // Fallback: region from the browser locale, e.g. "es-CO" → CO
  const region = navigator.language?.split('-')[1]?.toUpperCase()
  return region && /^[A-Z]{2}$/.test(region) ? region : null
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<string | null>(() => {
    const cached = localStorage.getItem(COUNTRY_KEY)
    return cached && /^[A-Z]{2}$/.test(cached) ? cached : null
  })
  const [language, setLanguageState] = useState<string>(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY)
    if (saved && SUPPORTED_LANGUAGES[saved]) return saved
    const cached = localStorage.getItem(COUNTRY_KEY)
    if (cached && COUNTRY_LANGUAGE[cached]) return COUNTRY_LANGUAGE[cached]
    // First visit before geo resolves: guess from the browser language
    const browserLang = navigator.language?.split('-')[0]?.toLowerCase()
    return browserLang && SUPPORTED_LANGUAGES[browserLang] ? browserLang : 'en'
  })

  // Keep i18next + Shopify context in sync from the very first render
  if (i18n.language !== language) i18n.changeLanguage(language)
  applyBuyerContext(country, language)

  useEffect(() => {
    let cancelled = false
    detectCountry().then((detected) => {
      if (cancelled || !detected) return
      localStorage.setItem(COUNTRY_KEY, detected)
      setCountry(detected)
      // Only auto-switch language if the user never chose one explicitly
      if (!localStorage.getItem(LANGUAGE_KEY)) {
        const local = COUNTRY_LANGUAGE[detected]
        if (local && local !== i18n.language) {
          setLanguageState(local)
          i18n.changeLanguage(local)
        }
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const setLanguage = (lang: string) => {
    if (!SUPPORTED_LANGUAGES[lang]) return
    localStorage.setItem(LANGUAGE_KEY, lang)
    setLanguageState(lang)
    i18n.changeLanguage(lang)
    applyBuyerContext(country, lang)
    // Reload so already-fetched Shopify data (prices, product text) refetches
    // in the new buyer context — a language switch is a rare, deliberate action.
    window.location.reload()
  }

  const localLang = country ? COUNTRY_LANGUAGE[country] : undefined
  const availableLanguages = [...new Set(['en', ...(localLang ? [localLang] : []), language])]

  return (
    <LocaleContext.Provider value={{ country, language, availableLanguages, setLanguage }}>
      {children}
    </LocaleContext.Provider>
  )
}
