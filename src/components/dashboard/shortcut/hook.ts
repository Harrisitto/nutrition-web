import { addFormatToShortcut, compareEqualStringsforShortcut, containsFormat } from "@src/helpers/shortcut";
import { TanstackUser } from "@src/services/tanstack"
import { useConfigSetAvailableShortcuts, useConfigSetSelectedUserId } from "@src/store/slices/config/hook";
import { useAppSelector } from "@src/store/store";
import { useEffect, useMemo } from "react";

export const useInitalizeShortcuts = () => {
    const users = TanstackUser.Select.useFetchNutritionistUsers();
    const userformat = useAppSelector(state => state.config.shortcutGroups.users.format);
    const setShortcut = useConfigSetAvailableShortcuts();

    const userRelated = useMemo(() => {
        if (!users.data) return [];
        return users.data.map(user => addFormatToShortcut(user.user_info?.name ?? '', userformat)).filter(name => name.trim() !== "");
    }, [users.data, userformat]);

    useEffect(() => {
        setShortcut([
            ...userRelated,
        ]);
    }, [userRelated, setShortcut]);
}

export const useListenerForShortcuts = () => {
    const users = TanstackUser.Select.useFetchNutritionistUsers();
    const selectedShortcut = useAppSelector(state => state.config.selectedShortcutId);
    const setSelectedUser = useConfigSetSelectedUserId();
    const userformat = useAppSelector(
        (state) => state.config.shortcutGroups.users.format,
    );

    useEffect(() => {
        if(!users.data) return;
        if(!selectedShortcut) return;
        if(!containsFormat(selectedShortcut, userformat)) return;
        const selectedUser = users.data.find(user => {
            const fullShortcut = addFormatToShortcut(user.user_info?.name ?? '', userformat);
            return compareEqualStringsforShortcut(selectedShortcut, fullShortcut, userformat);
        });
        if (!selectedUser) return;
        setSelectedUser(selectedUser.user_id);
    }, [users.data, selectedShortcut, userformat, setSelectedUser]);
    

}