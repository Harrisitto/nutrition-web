import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../store/slices/auth/hook'
import { APP_ROUTES } from './routes'
import type { AppRoute } from './routes'
import { DEFAULT_ROUTE_METADATA, ROUTE_METADATA } from './metadata'
import { useError } from '../../store'
import useSearchParams from './search_params'

export default function useAppNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const pushRouteToErrorStack = useError().pushRouteToStack;
    const searchParams = useSearchParams();

    const navigateTo = (route: AppRoute, options?: { replace?: boolean; state?: unknown }) => {

        const routeMetadata = ROUTE_METADATA[route] || DEFAULT_ROUTE_METADATA;
        let routeState = {};
        let finalRoute: AppRoute = route;
        if (routeMetadata.isProtected && !isAuthenticated) {
            routeState = {
                from: route,
                message: 'Please sign in to access this page'
            };
            finalRoute = APP_ROUTES.LOGIN;
        }

        pushRouteToErrorStack(finalRoute);

        navigate(finalRoute, {
            replace: options?.replace,
            state: { ...routeState, ...routeState }
        })
    }

    const goBack = () => {
        if (window.history.length > 1) {
            pushRouteToErrorStack(null);
            navigate(-1);
        } else {
            navigateTo(APP_ROUTES.HOME);
        }
    }


    return {
        location,
        goBack,
        navigateTo,
        searchParams,

        // Current state
        currentRoute: location.pathname as AppRoute,
        isAuthenticated,

        // Constants
        ROUTES: APP_ROUTES,
        METADATA: ROUTE_METADATA,
    }
}