import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface NavigationContextType {
  isMenuOpen: boolean
  toggleMenu: () => void
  closeMenu: () => void
  isScrolled: boolean
  setIsScrolled: (scrolled: boolean) => void
  isTransitioning: boolean
  setIsTransitioning: (transitioning: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <NavigationContext.Provider
      value={{
        isMenuOpen,
        toggleMenu,
        closeMenu,
        isScrolled,
        setIsScrolled,
        isTransitioning,
        setIsTransitioning,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
