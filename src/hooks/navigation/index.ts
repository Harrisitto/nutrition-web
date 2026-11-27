import { useNavigate, useLocation } from 'react-router-dom'
import { useCallback } from 'react'
import { APP_ROUTES } from './routes'
import type { AppRoute } from './routes'
import { addRouteToStack } from '@src/store/slices/error/store'
import { useAppDispatch } from '@src/store/store'
import useSearchParams from './search_params'

export default function useAppNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();

    // Protected routes are guarded by ProtectedRoute, which reads the current session.
    // Checking it here used the session captured by the caller's closure: right after
    // verifying the OTP it was still null, so the dashboard was swapped for HOME.
    const navigateTo = useCallback((route: AppRoute, options?: { replace?: boolean; state?: unknown }) => {
        dispatch(addRouteToStack(route));
        navigate(route, {
            replace: options?.replace,
            state: options?.state,
        })
    }, [dispatch, navigate]);

    const goBack = useCallback(() => {
        if (window.history.length > 1) {
            dispatch(addRouteToStack(null));
            navigate(-1);
        } else {
            navigateTo(APP_ROUTES.HOME);
        }
    }, [dispatch, navigate, navigateTo]);


    return {
        location,
        goBack,
        navigateTo,
        searchParams,
        // Current state
        currentRoute: location.pathname as AppRoute,
   }
}
