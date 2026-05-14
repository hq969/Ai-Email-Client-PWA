import PQueue from 'p-queue'
import { Email, Account, AIResponse } from '../types/email'

class EmailService {
  private accounts: Account[] = []
  private queue = new PQueue({ concurrency: 3 })
  private emailCache = new Map<string, Email[]>()

  async addAccount(account: Account): Promise<void> {
    this.accounts.push(account)
    await this.syncAccount(account)
  }

  async syncAccount(account: Account): Promise<Email[]> {
    const emails = await this.queue.add(() => this.fetchEmails(account))
    this.emailCache.set(account.id, emails)
    return emails
  }

  private async fetchEmails(account: Account): Promise<Email[]> {
    switch (account.type) {
      case 'gmail':
        return this.fetchGmailEmails(account)
      case 'office365':
        return this.fetchOffice365Emails(account)
      case 'imap':
        return this.fetchImapEmails(account)
      default:
        throw new Error(`Unsupported account type: ${account.type}`)
    }
  }

  // Gmail API (gapi)
  private async fetchGmailEmails(account: Account): Promise<Email[]> {
    const gapi = (window as any).gapi
    const response = await gapi.client.gmail.users.messages.list({
      userId: 'me',
      maxResults: 50,
      labelIds: ['INBOX']
    })

    const emails: Email[] = []
    for (const message of response.messages || []) {
      const msg = await gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: message.id!
      })
      emails.push(this.parseGmailMessage(msg))
    }
    return emails
  }

  // Microsoft Graph API
  private async fetchOffice365Emails(account: Account): Promise<Email[]> {
    const { Client } = await import('@microsoft/microsoft-graph-client')
    const client = Client.init({
      authProvider: { getAccessToken: () => account.config.accessToken }
    })

    const response = await client.api('/me/mailFolders/Inbox/messages')
      .top(50)
      .select('id,subject,from,receivedDateTime,bodyPreview,isRead,hasAttachments')
      .get()

    return (response.value || []).map((msg: any) => ({
      id: msg.id,
      subject: msg.subject || '',
      from: { 
        name: msg.from?.emailAddress?.name || 'Unknown', 
        email: msg.from?.emailAddress?.address || '' 
      },
      date: msg.receivedDateTime,
      body: msg.bodyPreview || '',
      unread: !msg.isRead,
      attachments: msg.hasAttachments ? [] : undefined
    }))
  }

  // IMAP Protocol
  private async fetchImapEmails(account: Account): Promise<Email[]> {
    const { connect } = await import('imap-simple')
    const config = { imap: account.config }
    
    const connection = await connect(config)
    await connection.openBox('INBOX')
    
    const messages = await connection.search(['UNSEEN'], { 
      bodies: ['HEADER', 'TEXT'], 
      struct: true 
    })
    await connection.end()

    return messages.map((msg: any) => this.parseImapMessage(msg))
  }

  async sendEmail(account: Account, to: string[], subject: string, body: string): Promise<void> {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.createTransporter({
      service: account.type === 'gmail' ? 'gmail' : 'office365',
      auth: account.config
    })

    await transporter.sendMail({
      from: account.email,
      to: to.join(','),
      subject,
      html: body
    })
  }

  // xAI Grok Integration
  async getAISummary(email: Email): Promise<AIResponse> {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_XAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [{
          role: 'system',
          content: 'AI email assistant. Return JSON: {summary, replyDraft, priority, actionItems}'
        }, {
          role: 'user',
          content: `Subject: ${email.subject}\nFrom: ${email.from.email}\nBody: ${email.body.slice(0, 2000)}`
        }],
        max_tokens: 300
      })
    })

    const data = await response.json()
    const content = data.choices[0].message.content
    return JSON.parse(content)
  }

  private parseGmailMessage(msg: any): Email { /* impl */ }
  private parseImapMessage(msg: any): Email { /* impl */ }
}

export const emailService = new EmailService()
