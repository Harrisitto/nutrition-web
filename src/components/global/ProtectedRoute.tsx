import { APP_ROUTES } from '@src/hooks/navigation/routes'
import { useEffect } from 'react'
import useAppNavigation from '@src/hooks/navigation'
import { useGetAuthSession } from '@src/services/tanstack/auth/get'
import { useAppSelector } from '@src/store/store'

interface ProtectedRouteProps {
  children: React.ReactNode
  authenticatedUserRequired?: boolean // If true, also checks if a user is selected in the config
  selectedUserRequired?: boolean // If true, also checks if a user is selected in the config
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  authenticatedUserRequired = true,
  selectedUserRequired = false,
}) => {

  const selectedUser = useAppSelector((state) => state.config.selectedUserId)
  const { data: session, isLoading } = useGetAuthSession();
  const { navigateTo } = useAppNavigation();

  useEffect(() => {
    if (isLoading) return;
    if (!session?.userId && authenticatedUserRequired) {
      navigateTo(APP_ROUTES.INFO); // Redirect to dashboard if no user selected
    }
    if (selectedUserRequired && !selectedUser) {
      navigateTo(APP_ROUTES.DASHBOARD); // Redirect to dashboard if no user selected
    }
    }, [isLoading, session, selectedUserRequired])

  if (isLoading || !session) {
    // While loading or if not authenticated or profile incomplete or not a nutritionist, render nothing (or a loader)
    return null;
  }
  // Render children if authenticated and has profile and is a nutritionist
  return children
}

export default ProtectedRoute
