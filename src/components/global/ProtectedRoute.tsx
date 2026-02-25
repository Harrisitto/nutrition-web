import { useAuth } from '../../store/slices/auth/hook'
import { APP_ROUTES } from '@src/hooks/navigation/routes'
import { useEffect } from 'react'
import useAppNavigation from '@src/hooks/navigation'

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

  const { navigateTo } = useAppNavigation();

  useEffect(() => {
    if (loading) return; // Don't do anything while loading
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigateTo(APP_ROUTES.LOGIN);
      } else if (!profile) {
        navigateTo(APP_ROUTES.COMPLETE_PROFILE);
      } else if (!profile.is_nutritionist) {
        navigateTo(APP_ROUTES.NOT_FOUND);
      }
    }, 500); // Debounce 500ms - navigation only happens if state stabilizes
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, profile])

  if (loading || !isAuthenticated || !profile || !profile.is_nutritionist) {
    // While loading or if not authenticated or profile incomplete or not a nutritionist, render nothing (or a loader)
    return null;
  }
  // Render children if authenticated and has profile and is a nutritionist
  return children
}

export default ProtectedRoute