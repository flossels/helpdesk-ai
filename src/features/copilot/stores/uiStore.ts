import { create } from 'zustand'

type UiState = {
  copilotOpen: boolean
  toggleCopilot: () => void
}

export const useUiStore = create<UiState>()((set) => ({
  copilotOpen: false,
  toggleCopilot: () => set((state) => ({ copilotOpen: !state.copilotOpen }))
}))
