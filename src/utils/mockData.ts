import { Email, Account } from '../types/email'

export const generateDemoAccounts = (): Account[] => [
  {
    id: 'gmail-primary',
    name: 'Personal Gmail',
    email: 'john.doe@gmail.com',
    type: 'gmail',
    config: { accessToken: 'demo_gmail_token_123' },
    active: true
  },
  {
    id: 'office-work',
    name: 'Work Outlook',
    email: 'john.doe@company.com',
    type: 'office365',
    config: { accessToken: 'demo_o365_token_456' },
    active: true
  },
  {
    id: 'yahoo-personal',
    name: 'Personal Yahoo',
    email: 'john.doe@yahoo.com',
    type: 'imap',
    config: {
      user: 'john.doe@yahoo.com',
      password: 'demo_yahoo_pass',
      host: 'imap.mail.yahoo.com',
      port: 993,
      tls: true,
      authTimeout: 3000
    },
    active: false
  }
]

export const generateDemoEmails = (accountId: string, count = 30): Email[] => {
  const senders = [
    { name: 'Alice Johnson', email: 'alice@company.com' },
    { name: 'Bob Smith', email: 'bob@client.com' },
    { name: 'Carol Davis', email: 'carol@team.com' },
    { name: 'David Wilson', email: 'david@partner.com' },
    { name: 'Eve Brown
