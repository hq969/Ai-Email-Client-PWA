import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  Mail, 
  Search, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  ChevronLeft,
  Settings 
} from 'lucide-react'
import { useEmailStore } from '../stores/emailStore'
import toast from 'react-hot-toast'
import { AccountSetup } from './AccountSetup'

export function InboxView() {
  const [showSetup, setShowSetup] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { 
    accounts, 
    emails, 
    selectedAccount, 
    loading, 
    setSelectedAccount,
    refreshEmails,
    addAccount,
    setSearchQuery: setStoreSearch,
    demoMode 
  } = useEmailStore()

  useEffect(() => {
    setStoreSearch(searchQuery)
  }, [searchQuery, setStoreSearch])

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.body.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddDemoAccount = useCallback(async () => {
    const demoAccount = {
      id: 'demo-gmail-1',
      name: 'Demo Gmail',
      email: 'demo@ai-email.com',
      type: 'gmail' as const,
      config: { accessToken: 'demo-token' },
      active: true
    }
    addAccount(demoAccount)
    await setSelectedAccount(demoAccount.id)
    toast.success('🎉 Demo account activated!')
  }, [addAccount, setSelectedAccount])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-white/90 backdrop-blur-xl border-r border-white/20 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                AI Email
              </h1>
              <p className="text-xs text-gray-500 font-medium">{accounts.length} accounts</p>
            </div>
          </div>

          {/* Accounts List */}
          {accounts.length === 0 ? (
            <div className="space-y-3">
              <button
                onClick={handleAddDemoAccount}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 font-medium shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Start Demo</span>
              </button>
              <button
                onClick={() => setShowSetup(true)}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <Settings className="h-5 w-5 text-gray-400" />
                <span>Real Setup</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setSelectedAccount(account.id)}
                  className={`w-full text-left px-5 py-4 rounded-2xl transition-all group hover:shadow-lg ${
                    selectedAccount === account.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-2xl scale-[1.02]'
                      : 'bg-white/50 hover:bg-white/80 border border-gray-100 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold truncate">{account.name}</span>
                    {selectedAccount === account.id && (
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs opacity-75 truncate">{account.email}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 space-y-3 flex-shrink-0 border-t border-gray-100">
          <Link 
            to="/compose"
            className="w-full flex items-center space-x-3 px-5 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all font-medium shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>✨ New Email</span>
          </Link>
          
          <button
            onClick={refreshEmails}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 px-5 py-4 border border-gray-300 rounded-2xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all group"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : 'group-hover:rotate-12'}`} />
            <span>{loading ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={() => toast('🚀 AI features powered by xAI Grok!')}
            className="w-full flex items-center space-x-3 px-5 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all font-medium shadow-lg"
          >
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span>AI Magic ✨</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="p-6 border-b bg-white/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative max-w-2xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search emails, people, AI summaries..."
                className="w-full pl-14 pr-6 py-4 border border-gray-200 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 bg-white/50 backdrop-blur-sm text-lg shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </button>
              <Link to="/settings" className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all">
                <Settings className="h-6 w-6 text-gray-600" />
              </Link>
            </div>
          </div>
        </header>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-96 p-8">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-6"></div>
                <p className="text-xl font-medium text-gray-600">Syncing your inbox...</p>
                <p className="text-sm text-gray-500 mt-1">{demoMode ? 'Demo mode active' : 'Real sync'}</p>
              </div>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center p-8">
              <Mail className="h-24 w-24 text-gray-300 mb-6" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome to AI Email</h2>
              <p className="text-lg text-gray-500 mb-8 max-w-md">
                Add your first account to start managing emails with AI superpowers.
              </p>
              <div className="space-x-3">
                <button
                  onClick={handleAddDemoAccount}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all"
                >
                  Try Demo
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredEmails.map((email, index) => (
                <Link
                  key={email.id}
                  to={`/email/${email.id}`}
                  className={`block p-8 hover:bg-white transition-all border-b border-gray-50 last:border-b-0 ${
                    email.unread 
                      ? 'bg-gradient-to-r from-blue-50 border-l-4 border-blue-400 shadow-sm' 
                      : 'hover:shadow-md'
                  } ${email.priority === 'high' ? '!bg-red-50 !border-l-red-400 shadow-md' : ''}`}
                >
                  <div className="flex items-start justify-between gap-6">
                    {/* Priority indicator */}
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      email.priority === 'high' ? 'bg-red-500 animate-pulse' :
                      email.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`font-semibold text-lg ${
                              email.unread ? 'text-gray-900' : 'text-gray-700'
                            } truncate`}>
                              {email.subject}
                            </span>
                            {email.unread && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span className="font-medium truncate">{email.from.name}</span>
                            <span>·</span>
                            <span className="truncate">{email.from.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Preview & AI Summary */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {email.body}
                        </p>
                        {email.aiSummary && (
                          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl">
                            <Sparkles className="h-4 w-4 text-purple-500 flex-shrink-0" />
                            <p className="text-sm text-purple-900 font-medium line-clamp-1">
                              ✨ {email.aiSummary}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col items-end gap-1 text-right min-w-[100px] flex-shrink-0">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(email.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(email.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Account Setup Modal */}
      {showSetup && (
        <AccountSetup onClose={() => setShowSetup(false)} />
      )}
    </div>
  )
}
