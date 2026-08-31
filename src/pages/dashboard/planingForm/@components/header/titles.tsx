import { useFetchNutritionistUsers } from "@src/services/tanstack/user/profile";
import { ForkKnife } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@src/store/store";

export const UserName = () => {
  const selectedUserId = useAppSelector((state) => state.config.selectedUserId);
  const users = useFetchNutritionistUsers();
  const selectedUser = users.data?.find(
    (user) => user.user_id === selectedUserId,
  );

  if (!selectedUser) return null;
  return (
    <h1 className="text-3xl font-bold text-text-title">{selectedUser?.name}</h1>
  );
};

export const Navigation = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-nutrition-green/20 bg-white-green/70 px-3 py-2 text-xs font-semibold uppercase text-dark-green shadow-sm w-92 ">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-nutrition-green/15 text-nutrition-green">
        <ForkKnife className="h-3.5 w-3.5" />
      </span>
      <span>{t("data:dashboardTable.navigation.header")}</span>
    </div>
  );
};
