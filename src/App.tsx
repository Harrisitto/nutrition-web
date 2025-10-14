import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import ValidationConfirmedPage from './pages/ValidationConfirmedPage'
import RedirectPage from './pages/RedirectPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginForm from './components/auth/LoginForm'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {

  console.log('App rendered');
  
  return (
    <Router basename="/nutrition-web">
      <div className="w-full min-h-screen bg-white-green text-black-green">
        <main className="w-full py-8">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/validation-confirmed" element={<ValidationConfirmedPage />} />
            <Route path="/redirect" element={<RedirectPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            {/* 404 - Catch all unmatched routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
