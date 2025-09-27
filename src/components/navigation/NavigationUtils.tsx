import { useNavigate, useLocation } from 'react-router-dom'

const NavigationUtils = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleRedirects = {
    // Example: Navigate with URL parameters
    goToValidation: () => {
      const params = new URLSearchParams({
        token: 'abc123xyz',
        email: 'user@example.com'
      })
      navigate(`/validation-confirmed?${params}`)
    },

    // Example: Navigate with state
    goToDashboardWithState: () => {
      navigate('/dashboard', { 
        state: { from: location.pathname, message: 'Welcome back!' }
      })
    },

    // Example: Replace current history entry
    redirectHome: () => {
      navigate('/', { replace: true })
    },

    // Example: Go back in history
    goBack: () => {
      navigate(-1)
    },

    // Example: Navigate to redirect route
    useRedirectRoute: () => {
      navigate('/redirect?to=/dashboard')
    }
  }

  return (
    <div className="bg-white-green border border-fade-dark-green rounded-lg p-6 my-8 shadow-md">
      <h3 className="text-xl font-semibold text-nutrition-green mb-4">Navigation Examples</h3>
      <div className="flex flex-wrap gap-3 mb-4">
        <button 
          onClick={handleRedirects.goToValidation} 
          className="px-4 py-2 bg-nutrition-green hover:bg-dark-green text-white text-sm border border-nutrition-green rounded-md transition-colors duration-200"
        >
          Go to Validation (with params)
        </button>
        <button 
          onClick={handleRedirects.goToDashboardWithState} 
          className="px-4 py-2 bg-nutrition-blue hover:bg-opacity-80 text-white text-sm border border-nutrition-blue rounded-md transition-colors duration-200"
        >
          Dashboard (with state)
        </button>
        <button 
          onClick={handleRedirects.useRedirectRoute} 
          className="px-4 py-2 bg-nutrition-purple hover:bg-opacity-80 text-white text-sm border border-nutrition-purple rounded-md transition-colors duration-200"
        >
          Use Redirect Route
        </button>
        <button 
          onClick={handleRedirects.goBack} 
          className="px-4 py-2 bg-white-green hover:bg-fade-white-green text-black-green text-sm border border-fade-dark-green rounded-md transition-colors duration-200"
        >
          Go Back
        </button>
      </div>
      
      <div className="pt-4 border-t border-fade-dark-green">
        <small className="text-fade-dark-green">
          Current path: <code className="bg-fade-green px-2 py-1 rounded text-xs font-mono text-black-green">{location.pathname}{location.search}</code>
        </small>
      </div>
    </div>
  )
}

export default NavigationUtils