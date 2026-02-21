import { Navigate } from 'react-router-dom'
import { useAuth } from '../../store/slices/auth/hook'
import { APP_ROUTES } from '@src/hooks/navigation/routes'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
}) => {

  const {
    loading,
    isAuthenticated,
    profile
  } = useAuth();

  console.log('ProtectedRoute - Auth State:', {
    loading,
    isAuthenticated,
    profile
  });

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />
  }

  if (!profile) {
    return (
      <Navigate to={APP_ROUTES.COMPLETE_PROFILE} replace />
    )
  }

  if (!profile.is_nutritionist) {
    return (
      /* If user is authenticated but not a nutritionist, redirect to 404 page */
      /* This is a simple way to prevent unauthorized access to nutritionist-only pages without exposing the existence of those pages to non-nutritionist users. */
      <Navigate to={APP_ROUTES.NOT_FOUND} replace />
    )
  }

  // Render children if authenticated and has profile and is a nutritionist
  return children
}

export default ProtectedRoute