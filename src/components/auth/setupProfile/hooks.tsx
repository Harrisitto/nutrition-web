import useAppNavigation from "@src/hooks/navigation"
import { APP_ROUTES } from "@src/hooks/navigation/routes"
import { useAuth } from "@src/store/slices/auth/hook"
import { useEffect } from "react"

export const useRedirect = () => {
    const { navigateTo } = useAppNavigation()
    const { profile, isAuthenticated } = useAuth()

    useEffect(() => {
        if (profile) {
            navigateTo(APP_ROUTES.DASHBOARD)
        }
    }, [profile, navigateTo])

    useEffect(() => {
        if (!isAuthenticated) {
            navigateTo(APP_ROUTES.LOGIN)
        }
    }, [isAuthenticated, navigateTo])
}