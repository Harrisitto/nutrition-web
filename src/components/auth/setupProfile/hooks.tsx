import useAppNavigation from "@src/hooks/navigation"
import { APP_ROUTES } from "@src/hooks/navigation/routes"
import { useEffect } from "react"
import { useAppSelector } from "@src/store/store"

export const useRedirect = () => {
    const { navigateTo } = useAppNavigation()
    const { profile } = useAppSelector((state) => state.auth)

    useEffect(() => {
        if (profile) {
            navigateTo(APP_ROUTES.DASHBOARD)
        }
    }, [profile, navigateTo])
}