import { useEffect } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

const RedirectPage = () => {
  const [searchParams] = useSearchParams()
  
  // Get the target from URL params (e.g., /redirect?to=dashboard)
  const redirectTo = searchParams.get('to') || '/'
  
  // You could add logic here to validate the redirect
  // For example, check if user is authenticated
  const isValidRedirect = ['/', '/dashboard', '/profile'].includes(redirectTo)
  
  useEffect(() => {
    console.log(`Redirecting to: ${redirectTo}`)
  }, [redirectTo])

  // Redirect to the target page
  return <Navigate to={isValidRedirect ? redirectTo : '/'} replace />
}

export default RedirectPage