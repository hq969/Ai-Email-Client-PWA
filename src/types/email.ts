export interface Email {
  id: string
  subject: string
  from: { name: string; email: string }
  to: string[]
  date: string
  body: string
  html?: string
  labels?: string[]
  priority?: 'high' | 'medium' | 'low'
  aiSummary?: string
  aiReplyDraft?: string
  unread: boolean
  attachments?: Attachment[]
}

export interface Attachment {
  filename: string
  contentType: string
  size: number
  cid?: string
}

export interface Account {
  id: string
  name: string
  email: string
  type: 'gmail' | 'office365' | 'imap'
  config: Record<string, any>
  active: boolean
}

export interface AIResponse {
  summary: string
  replyDraft: string
  priority: 'high' | 'medium' | 'low'
  actionItems: string[]
}
