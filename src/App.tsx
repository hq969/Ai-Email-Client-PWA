import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { InboxView } from './components/InboxView'
import { EmailDetail } from './components/EmailDetail'
import { AccountSetup } from './components/AccountSetup'

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<InboxView />} />
          <Route path="/email/:id" element={<EmailDetail />} />
          <Route path="/setup" element={<AccountSetup />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
