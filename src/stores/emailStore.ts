import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Email, Account } from '../types/email'

interface EmailState {
  // State
  accounts: Account[]
  emails: Email[]
  selectedAccount: string | null
  selectedEmail: Email | null
  loading: boolean
  searchQuery: string
  aiFeaturesEnabled: boolean
  demoMode: boolean

  // Actions
  addAccount: (account: Account) => void
  setSelectedAccount: (accountId: string) => void
  setSelectedEmail: (email: Email | null) => void
  setSearchQuery: (query: string) => void
  refreshEmails: () => Promise<void>
  toggleDemoMode: () => void
  toggleAI: (enabled: boolean) => void
}

export const useEmailStore = create<EmailState>()(
  persist(
    (set, get) => ({
      accounts: [],
      emails: [],
      selectedAccount: null,
      selectedEmail: null,
      loading: false,
      searchQuery: '',
      aiFeaturesEnabled: true,
      demoMode: true,

      addAccount: (account) => set((state) => ({
        accounts: [...state.accounts, account]
      })),

      setSelectedAccount: (accountId) => {
        set({ selectedAccount: accountId })
        get().refreshEmails()
      },

      setSelectedEmail: (email) => set({ selectedEmail: email }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      refreshEmails: async () => {
        const { selectedAccount, demoMode } = get()
        if (!selectedAccount) return

        set({ loading: true })
        
        if (demoMode) {
          // Demo data
          setTimeout(() => {
            set({ 
              emails: generateDemoEmails(),
              loading: false 
            })
          }, 1000)
        } else {
          // Real sync would go here
          set({ loading: false })
        }
      },

      toggleDemoMode: () => set((state) => ({ demoMode: !state.demoMode })),

      toggleAI: (enabled) => set({ aiFeaturesEnabled: enabled })
    }),
    {
      name: 'ai-email-storage'
    }
  )
)

// Demo data generator
function generateDemoEmails(): Email[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `demo-${i}`,
    subject: `Project update ${i + 1}`,
    from: { 
      name: ['Alice', 'Bob', 'Carol', 'Dave'][i % 4], 
      email: `user${i}@example.com` 
    },
    to: ['you@ai-email.com'],
    date: new Date(Date.now() - i * 3600000).toISOString(),
    body: `This is demo email ${i + 1} body content. Meeting scheduled for tomorrow. Please confirm attendance.`,
    unread: i > 10,
    priority: (['high', 'medium', 'low'] as const)[i % 3],
    aiSummary: i % 3 === 0 ? 'AI Summary: Action required - confirm meeting' : undefined,
    aiReplyDraft: i % 3 === 0 ? 'Thanks, confirmed for tomorrow!' : undefined
  }))
}
