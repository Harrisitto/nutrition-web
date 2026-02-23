import { useAppDispatch } from "@src/store/store"
import { useAppSelector } from "@src/store/store"
import { useCallback } from "react"
import { changeFormatForGroup, selectShortcut, setAvailableShortcuts, setSelectedUserId, setShortcutConfig, setSidebarOpen, type ConfigState } from "./store"
import { normalizeStringForShortcut } from "@src/helpers/shortcut"
import { parseDate } from "@src/helpers/dates"

export const useConfigSelectedUserId = () => {
    return useAppSelector((state) => state.config.selectedUserId)
}

export const useConfigSidebarOpen = () => {
    return useAppSelector((state) => state.config.sidebarOpen)
}

export const useConfigSelectedShortcutId = () => {
    const id = useAppSelector((state) => state.config.selectedShortcutId)
    const guess = useAppSelector((state) => state.config.shortcutGuess)
    return {
        id,
        guess,
    }
}

export const useConfigDateRange = () => {
    const selectedDateRange = useAppSelector((state) => state.config.selectedDateRange);
    return {
        start: parseDate(selectedDateRange[0]),
        end: parseDate(selectedDateRange[1]),
    }
}

export const useConfigAvailableShortcuts = () => {
    return useAppSelector((state) => state.config.availableShortcuts)
}

export const useConfigShortcutConfig = () => {
    return useAppSelector((state) => state.config.shortcutConfig)
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

export const useConfigSetShortcuts = () => {
    const dispatch = useAppDispatch()
    return useCallback(
        (shortcutId: string, guess: string) => {
            dispatch(selectShortcut([shortcutId, guess]))
        },
        [dispatch]
    )
}

export const useConfigSetAvailableShortcuts = () => {
    const dispatch = useAppDispatch()
    return useCallback((shortcuts: string[]) => {
        const uniqueShortcuts = Array.from(new Set(shortcuts)).map(s => normalizeStringForShortcut(s)).filter(s => s !== "");
        dispatch(setAvailableShortcuts(uniqueShortcuts))
    }, [dispatch])
}

export const useConfigChangeFormatForGroup = () => {
    const dispatch = useAppDispatch()
    return useCallback((groupKey: string, newFormat: string) => {
        dispatch(changeFormatForGroup({ groupKey, newFormat }))
    }, [dispatch])
} 

export const useConfigSetShortcutConfig = () => {
    const dispatch = useAppDispatch()
    return useCallback((config: Partial<ConfigState['shortcutConfig']>) => {
        dispatch(setShortcutConfig(config))
    }, [dispatch])
}

