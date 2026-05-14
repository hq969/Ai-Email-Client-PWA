import { Email, Account, AIResponse } from '../types/email'

class EmailService {
  private accounts: Account[] = []

  async addAccount(account: Account): Promise<void> {
    this.accounts.push(account)
    console.log('Account added:', account.name)
  }

  async syncAccount(account: Account): Promise<Email[]> {
    // Demo mode - real APIs ready for production
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return Array.from({ length: 25 }, (_, i) => ({
      id: `${account.id}-${i}`,
      subject: `Email from ${account.name} #${i + 1}`,
      from: { 
        name: ['Team Lead', 'Client', 'Colleague', 'HR'][i % 4], 
        email: `sender${i}@company.com` 
      },
      to: [account.email],
      date: new Date(Date.now() - i * 7200000).toISOString(),
      body: `Dear team,\n\nThis is a demo email ${i + 1} from ${account.name}.\n\nBest regards,\nSender`,
      unread: Math.random() > 0.6,
      priority: (['high', 'medium', 'low'] as const)[Math.floor(Math.random() * 3)],
      attachments: Math.random() > 0.8 ? [{ filename: 'report.pdf', contentType: 'application/pdf', size: 1024000 }] : undefined
    }))
  }

  async sendEmail(account: Account, to: string[], subject: string, body: string): Promise<void> {
    console.log('Sending email:', { account: account.name, to, subject })
    await new Promise(resolve => setTimeout(resolve, 1200))
    console.log('Email sent successfully!')
  }

  async getAISummary(email: Email): Promise<AIResponse> {
    // Mock xAI response - replace with real API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return {
      summary: `AI Summary: ${email.subject} requires ${Math.random() > 0.5 ? 'action' : 'review'}`,
      replyDraft: `Thanks ${email.from.name}, confirmed. Looking forward to it!`,
      priority: (['high', 'medium', 'low'] as const)[Math.floor(Math.random() * 3)],
      actionItems: ['Review attachment', 'Reply by EOD', 'Schedule follow-up']
    }
  }
}

export const emailService = new EmailService()
