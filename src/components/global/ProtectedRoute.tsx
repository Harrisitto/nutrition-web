import { Navigate } from 'react-router-dom'
import { useAuth } from '../../store/slices/auth/hook'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const {
    loading,
    isAuthenticated
  } = useAuth();

  console.log("ProtectedRoute - loading:", loading, "isAuthenticated:", isAuthenticated);

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
    return <Navigate to={redirectTo} replace />
  }

  // Render children if authenticated
  return children
}

export default ProtectedRoute