import { useAuth } from '../../store/slices/auth/hook'
import { APP_ROUTES } from '@src/hooks/navigation/routes'
import { useEffect } from 'react'
import useAppNavigation from '@src/hooks/navigation'
import { useConfigSelectedUserId } from '@src/store/slices/config/hook'

interface ProtectedRouteProps {
  children: React.ReactNode
  selectedUserRequired?: boolean // If true, also checks if a user is selected in the config
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  selectedUserRequired = false,
}) => {

  const {
    loading,
    isAuthenticated,
    profile
  } = useAuth();

  const selectedUserId = useConfigSelectedUserId();

  const { navigateTo } = useAppNavigation();

  useEffect(() => {
    if (loading) return; // Don't do anything while loading
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigateTo(APP_ROUTES.LOGIN);
      } else if (!profile) {
        navigateTo(APP_ROUTES.COMPLETE_PROFILE);
      }
    }, 500); // Debounce 500ms - navigation only happens if state stabilizes
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, profile])

  useEffect(() => {
    if (loading) return;
    if (!selectedUserRequired) return; // If no selected user required, do nothing
    if (!selectedUserId) {
      navigateTo(APP_ROUTES.DASHBOARD); // Redirect to dashboard if no user selected
    }
  }, [loading, selectedUserId, selectedUserRequired])

  if (loading || !isAuthenticated || !profile) {
    // While loading or if not authenticated or profile incomplete or not a nutritionist, render nothing (or a loader)
    return null;
  }
  // Render children if authenticated and has profile and is a nutritionist
  return children
}

export default ProtectedRoute