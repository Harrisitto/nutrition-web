import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/redux/hooks/auth'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const navigate = useNavigate()
  
  const { 
    signIn, 
    signUp, 
    loading, 
    error, 
    isAuthenticated, 
    clearError 
  } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard') // Adjust route as needed
    }
  }, [isAuthenticated, navigate])

  // Clear error when switching between sign in/up
  useEffect(() => {
    clearError()
  }, [isSignUp, clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      return
    }

    try {
      if (isSignUp) {
        const result = await signUp(email, password)
        if (result.meta.requestStatus === 'fulfilled') {
          // Show success message for sign up (user needs to verify email)
          alert('Please check your email to verify your account!')
        }
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      console.error('Auth error:', err)
    }
  }

  const handleClearError = () => {
    clearError()
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={handleClearError}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
        
        {!isSignUp && (
          <div className="mt-2 text-center">
            <button
              onClick={() => {
                const email = prompt('Enter your email for password reset:')
                if (email) {
                  // You can add resetPassword functionality here
                  alert('Password reset functionality can be added here')
                }
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Forgot Password?
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginForm