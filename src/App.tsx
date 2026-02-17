import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NotFoundPage from './pages/error/NotFoundPage'
//import ProtectedRoute from './components/auth/ProtectedRoute'
import LogInPage from './pages/auth/LogInPage'
import { PagePrivacyPolicy } from './pages/privacyPolicy/page'

function App() {
  return (
    <Router basename='nutrition-web'>
        <main className="w-full p-8 min-h-screen bg-white-green text-black-green">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LogInPage />} />
            <Route path="/privacy-policy" element={<PagePrivacyPolicy />} />
            
            {/* Protected routes 
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
              */}
       
            
            {/* 404 - Catch all unmatched routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
    </Router>
  )
}

export default App
