import { useState, useRef, useEffect } from 'react'
import { useLocale } from '../../contexts/LocaleContext'
import { SUPPORTED_LANGUAGES } from '../../i18n'

const SHORT: Record<string, string> = { en: 'EN', es: 'ES', de: 'DE' }

interface LanguageSwitcherProps {
  /** true when sitting on a light background (dark text) */
  isDark?: boolean
  className?: string
}

export default function LanguageSwitcher({ isDark = false, className = '' }: LanguageSwitcherProps) {
  const { language, availableLanguages, setLanguage } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  // Nothing to switch to
  if (availableLanguages.length < 2) return null

  const textColor = isDark ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 text-xs font-semibold tracking-wide transition-colors ${textColor}`}
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        {SHORT[language] ?? language.toUpperCase()}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 min-w-[130px] rounded-xl bg-white shadow-xl border border-gray-100 py-1 z-[70]"
          role="listbox"
        >
          {availableLanguages.map((lang) => (
            <button
              key={lang}
              role="option"
              aria-selected={lang === language}
              onClick={() => {
                setOpen(false)
                if (lang !== language) setLanguage(lang)
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${
                lang === language ? 'font-bold text-black' : 'text-gray-600'
              }`}
            >
              {SUPPORTED_LANGUAGES[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
