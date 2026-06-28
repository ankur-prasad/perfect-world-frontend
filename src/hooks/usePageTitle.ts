import { useEffect } from 'react'

const BASE = 'Perfect World'

/** Sets the document title for the page; restores nothing on unmount by design. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — Together. Not Alone.`
  }, [title])
}
