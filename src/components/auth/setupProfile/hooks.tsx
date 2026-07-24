import useAppNavigation from "@src/hooks/navigation"
import { APP_ROUTES } from "@src/hooks/navigation/routes"
import { useEffect } from "react"
import { useGetAuthInfo } from "@src/services/tanstack/auth/get"

export const useRedirect = () => {
    const { navigateTo } = useAppNavigation()
    const info = useGetAuthInfo()

    useEffect(() => {
        if (info.data?.name) {
          navigateTo(APP_ROUTES.DASHBOARD)
        }
    }, [info.data, navigateTo])
}
