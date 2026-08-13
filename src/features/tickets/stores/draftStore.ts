import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { JSONContent } from '@tiptap/react'

type Draft = { content: JSONContent; contentText: string }

type DraftState = {
  drafts: Record<string, Draft>
  setDraft: (ticketId: string, draft: Draft) => void
  clearDraft: (ticketId: string) => void
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      drafts: {},
      setDraft: (ticketId, draft) => set((state) => ({ drafts: { ...state.drafts, [ticketId]: draft } })),
      clearDraft: (ticketId) =>
        set((state) => {
          const { [ticketId]: _removed, ...rest } = state.drafts
          return { drafts: rest }
        })
    }),
    { name: 'ticket-drafts' }
  )
)
