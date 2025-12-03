import { create } from 'zustand'

export interface TransitionData {
  clickPosition: { x: number; y: number }
  color: string
  gradientColors: string[]
  projectSlug: string
}

interface TransitionStore {
  isTransitioning: boolean
  direction: 'forward' | 'reverse' | null
  data: TransitionData | null

  startTransition: (data: TransitionData) => void
  startReverseTransition: (returnPosition: { x: number; y: number }) => void
  endTransition: () => void
}

export const useTransitionStore = create<TransitionStore>((set) => ({
  isTransitioning: false,
  direction: null,
  data: null,

  startTransition: (data) =>
    set({ isTransitioning: true, direction: 'forward', data }),

  startReverseTransition: (returnPosition) =>
    set((state) => ({
      isTransitioning: true,
      direction: 'reverse',
      data: state.data
        ? { ...state.data, clickPosition: returnPosition }
        : null,
    })),

  endTransition: () =>
    set({ isTransitioning: false, direction: null, data: null }),
}))
