import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/navigation/Navigation'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import ValidationConfirmedPage from './pages/ValidationConfirmedPage'
import RedirectPage from './pages/RedirectPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Router basename="/nutrition-web">
      <div className="w-full min-h-screen bg-white-green text-black-green">
        <Navigation />
        <main className="w-full py-8">
          <Routes>
            {/* Main routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Validation route - supports URL parameters */}
            <Route path="/validation-confirmed" element={<ValidationConfirmedPage />} />
            
            {/* Redirect route - for handling redirections */}
            <Route path="/redirect" element={<RedirectPage />} />
            
            {/* 404 - Catch all unmatched routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
