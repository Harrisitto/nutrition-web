import { useAppDispatch } from "@src/store/store"
import { useAppSelector } from "@src/store/store"
import { useCallback } from "react"
import { setSelectedUserId, setSidebarOpen } from "./store"
import { loadDate } from "@src/helpers/dates"

export const useConfigSelectedUserId = () => {
    return useAppSelector((state) => state.config.selectedUserId)
}

export const useConfigSidebarOpen = () => {
    return useAppSelector((state) => state.config.sidebarOpen)
}

export const useConfigDateRange = () => {
    const selectedDateRange = useAppSelector((state) => state.config.selectedDateRange);
    return {
        start: loadDate(selectedDateRange[0]),
        end: loadDate(selectedDateRange[1]),
    }
}

export const useConfigSelectedDay = () => {
    const selectedDay = useAppSelector((state) => state.config.selectedDay);
    return selectedDay ? loadDate(selectedDay) : null;
}

export const useConfigSetSelectedUserId = () => {
    const dispatch = useAppDispatch()
    return useCallback(
        (userId: string | null) => {
            dispatch(setSelectedUserId(userId))
        },
        [dispatch]
    )
}

export const useConfigSetSidebarOpen = () => {
    const dispatch = useAppDispatch()
    return useCallback(
        (open: boolean) => {
            dispatch(setSidebarOpen(open))
        },
        [dispatch]
    )
}

