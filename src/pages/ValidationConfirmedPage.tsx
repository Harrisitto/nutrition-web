import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const ValidationConfirmedPage = () => {
  const [searchParams] = useSearchParams()
  
  // You can access URL parameters like this:
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    // Here you could make an API call to validate the token
    console.log('Validation token:', token)
    console.log('Email:', email)
  }, [token, email])

  return (
    <div className="w-full px-8 flex justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-green-900/20 border-2 border-green-500 rounded-lg p-8 text-center">
          <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-400 mb-2">Email Validation Confirmed!</h1>
          <p className="text-gray-300">Your email has been successfully validated.</p>
        </div>
        
        {email && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 mb-1">Validated Email:</p>
            <p className="font-semibold text-green-400">{email}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/dashboard" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Go to Dashboard
          </Link>
          <Link 
            to="/" 
            className="px-6 py-3 bg-transparent border border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white font-medium rounded-lg transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
      </div>
    </div>
  )
}

export default ValidationConfirmedPage