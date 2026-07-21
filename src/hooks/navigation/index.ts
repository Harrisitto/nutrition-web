import { useNavigate, useLocation } from 'react-router-dom'
import { useCallback } from 'react'
import { APP_ROUTES } from './routes'
import type { AppRoute } from './routes'
import { DEFAULT_ROUTE_METADATA, ROUTE_METADATA } from './metadata'
import { addRouteToStack } from '@src/store/slices/error/store'
import { useAppDispatch, useAppSelector } from '@src/store/store'
import useSearchParams from './search_params'

export default function useAppNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const user = useAppSelector((state) => state.auth.user);

    const navigateTo = useCallback((route: AppRoute, options?: { replace?: boolean; state?: unknown }) => {
        const routeMetadata = ROUTE_METADATA[route] || DEFAULT_ROUTE_METADATA;
        let routeState: Record<string, unknown> = {};
        let finalRoute: AppRoute = route;

        if (routeMetadata.isProtected && !user) {
            routeState = {
                from: route,
                message: 'Please sign in to access this page'
            };
            finalRoute = APP_ROUTES.LOGIN;
        }
        dispatch(addRouteToStack(finalRoute));
        const extraState = options?.state && typeof options.state === 'object'
            ? (options.state as Record<string, unknown>)
            : {};

        navigate(finalRoute, {
            replace: options?.replace,
            state: { ...routeState, ...extraState }
        })
    }, [dispatch, user, navigate]);

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