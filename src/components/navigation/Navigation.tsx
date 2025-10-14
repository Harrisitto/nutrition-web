import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/redux/hooks/auth'
import useAppNavigation from '../../hooks/navigation'

const Navigation = () => {
  const { user, signOut, isAuthenticated } = useAuth()
  const { 
    isRouteActive, 
    ROUTES 
  } = useAppNavigation()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <nav className="bg-black-green shadow-lg border-b border-dark-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold text-nutrition-green hover:text-white-green transition-colors duration-200"
            >
              🥗 Nutrition Web
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isRouteActive(ROUTES.HOME) 
                    ? 'bg-nutrition-green text-white' 
                    : 'text-white-green hover:bg-dark-green hover:text-white'
                }`}
              >
                🏠 Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isRouteActive(ROUTES.DASHBOARD) 
                        ? 'bg-nutrition-blue text-white' 
                        : 'text-white-green hover:bg-dark-green hover:text-white'
                    }`}
                  >
                    📊 Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isRouteActive(ROUTES.PROFILE) 
                        ? 'bg-nutrition-purple text-white' 
                        : 'text-white-green hover:bg-dark-green hover:text-white'
                    }`}
                  >
                    👤 Profile
                  </Link>
                  
                  {/* User info and sign out */}
                  <div className="flex items-center space-x-3">
                    <span className="text-white-green text-sm">
                      👋 {user?.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="px-3 py-2 rounded-md text-sm font-medium text-white-green hover:bg-red-600 hover:text-white transition-colors duration-200"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isRouteActive(ROUTES.LOGIN) 
                      ? 'bg-nutrition-blue text-white' 
                      : 'text-white-green hover:bg-dark-green hover:text-white'
                  }`}
                >
                  🔐 Sign In
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white-green hover:text-white focus:outline-none focus:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation