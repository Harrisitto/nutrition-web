import { TanstackUser } from "@src/services/tanstack";
import { useConfigSelectedUserId } from "@src/store/slices/config/hook";

export const UserName = () => {
    const selectedUserId = useConfigSelectedUserId();
    const users = TanstackUser.Select.useFetchNutritionistUsers();
    const selectedUser = users.data?.find(user => user.user_id === selectedUserId);

    if (!selectedUser) return null;
    return <h1 className="text-3xl font-bold text-text-title">{selectedUser.user_info?.name}</h1>;
}