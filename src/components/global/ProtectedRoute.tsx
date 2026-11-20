import { APP_ROUTES } from '@src/hooks/navigation/routes'
import { useEffect } from 'react'
import useAppNavigation from '@src/hooks/navigation'
import { useGetAuthSession } from '@src/services/tanstack/auth/get'
import { useIsDatabaseEditor } from '@src/services/tanstack/auth/databaseEditor'
import { useAppSelector } from '@src/store/store'

interface ProtectedRouteProps {
  children: React.ReactNode
  authenticatedUserRequired?: boolean // If true, also checks if a user is selected in the config
  selectedUserRequired?: boolean // If true, also checks if a user is selected in the config
  databaseEditorRequired?: boolean // If true, only database editors get in; the rest go to the dashboard
}

// Routes that live under the dashboard but are not about a single client:
// bouncing them back to the dashboard root would break their deep links,
// which is what happens on every reload since the selection is not persisted.
const routeNeedsSelectedClient = (pathname: string) =>
  !pathname.startsWith(APP_ROUTES.CONFIG) &&
  pathname !== APP_ROUTES.CANCEL_PAYMENT

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  authenticatedUserRequired = true,
  selectedUserRequired = false,
  databaseEditorRequired = false,
}) => {

  const selectedUser = useAppSelector((state) => state.config.selectedUserId)
  const { data: session, isLoading } = useGetAuthSession();
  const { navigateTo, currentRoute } = useAppNavigation();

  const isAuthenticated = !!session?.userId
  const { data: isDatabaseEditor, isLoading: isLoadingEditor } = useIsDatabaseEditor()
  // isLoading is false while the query is disabled (no session yet), so it only waits for a real fetch
  const editorPending = databaseEditorRequired && isLoadingEditor

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && authenticatedUserRequired) {
      navigateTo(APP_ROUTES.INFO); // Redirect to dashboard if no user selected
      return;
    }
    if (
      selectedUserRequired &&
      !selectedUser &&
      currentRoute !== APP_ROUTES.DASHBOARD &&
      routeNeedsSelectedClient(currentRoute)
    ) {
      navigateTo(APP_ROUTES.DASHBOARD); // Redirect to dashboard if no user selected
      return;
    }
    if (databaseEditorRequired && isAuthenticated && !editorPending && !isDatabaseEditor) {
      navigateTo(APP_ROUTES.DASHBOARD, { replace: true });
    }
    }, [isLoading, isAuthenticated, authenticatedUserRequired, selectedUserRequired, selectedUser, currentRoute, navigateTo, databaseEditorRequired, editorPending, isDatabaseEditor])

  // `data` is an object even when signed out, so this has to test the user id:
  // testing the object itself let the protected tree mount and fire its
  // queries unauthenticated for a render before the redirect landed.
  if (
    isLoading ||
    (authenticatedUserRequired && !isAuthenticated) ||
    (databaseEditorRequired && !isDatabaseEditor)
  ) {
    // While loading or if not authenticated or profile incomplete or not a nutritionist, render nothing (or a loader)
    return null;
  }
  // Render children if authenticated and has profile and is a nutritionist
  return children
}

export default ProtectedRoute
