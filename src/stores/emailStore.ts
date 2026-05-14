import { create } from 'zustand'
import { Email, Account } from '../types/email'
import { emailService } from '../services/EmailService'

interface EmailState {
  accounts: Account[]
  emails: Email[]
  selectedAccount: string | null
  selectedEmail: Email | null
  loading: boolean
  searchQuery: string
  aiFeaturesEnabled: boolean

  addAccount: (account: Account) => void
  setSelectedAccount: (accountId: string) => void
  setSelectedEmail: (email: Email | null) => void
  refreshEmails: () => Promise<void>
  sendEmail: (to: string[], subject: string, body: string) => Promise<void>
  getAISummary: (email: Email) => Promise<void>
}

export const useEmailStore = create<EmailState>((set, get) => ({
  accounts: [],
  emails: [],
  selectedAccount: null,
  selectedEmail: null,
  loading: false,
  searchQuery: '',
  aiFeaturesEnabled: true,

  addAccount: (account) => set((state) => ({ 
    accounts: [...state.accounts, account] 
  })),

  setSelectedAccount: async (accountId) => {
    set({ selectedAccount: accountId })
    await get().refreshEmails()
  },

  refreshEmails: async () => {
    const { selectedAccount, accounts } = get()
    if (!selectedAccount) return

    set({ loading: true })
    const account = accounts.find(a => a.id === selectedAccount)
    if (account) {
      const emails = await emailService.syncAccount(account)
      set({ emails, loading: false })
    }
  },

  sendEmail: async (to, subject, body) => {
    const { selectedAccount, accounts } = get()
    const account = accounts.find(a => a.id === selectedAccount)
    if (account) {
      await emailService.sendEmail(account, to, subject, body)
      await get().refreshEmails()
    }
  },

  getAISummary: async (email) => {
    if (!get().aiFeaturesEnabled) return
    const aiData = await emailService.getAISummary(email)
    set((state) => ({
      selectedEmail: state.selectedEmail 
        ? { ...state.selectedEmail, ...aiData }
        : null
    }))
  }
}))
