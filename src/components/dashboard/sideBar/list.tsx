import { AnimationLoading } from "@src/components/global/Animations";
import { useEffect } from "react";
import {
  useConfigSelectedUserId,
  useConfigSetSelectedUserId,
  useConfigSidebarOpen,
} from "@src/store/slices/config/hook";
import { useFetchNutritionistUsers } from "@src/services/tanstack/user/profile";

const OpenSidebarClient = ({ name }: { name: string }) => {
  return (
    <div className="px-4 py-3 truncate">
      <p className="text-sm font-semibold text-white truncate">{name}</p>
    </div>
  );
};

const ClosedSidebarClient = ({ name }: { name: string }) => {
  return (
    <div className="px-4 py-3 flex items-center justify-center w-full aspect-square max-w-8">
      <p className="text-sm font-bold text-white">
        {name[0]?.toUpperCase() || "?"}
      </p>
    </div>
  );
};

const SingleClient = ({
  name,
  id,
  idx,
}: {
  name: string;
  id: string;
  idx: number;
}) => {
  const selectedUser = useConfigSelectedUserId();
  const setSelectedUser = useConfigSetSelectedUserId();
  const sidebarOpen = useConfigSidebarOpen();

  useEffect(() => {
    if (idx === 0 && id && !selectedUser) {
      setSelectedUser(id);
    }
  }, [id, idx, selectedUser, setSelectedUser]);

  const isSelected = id === selectedUser;

  return (
    <div
      key={id}
      className={`
                animate-fade-in
                relative transition-all duration-500 ease-out
                ${
                  isSelected
                    ? "bg-gradient-to-r from-nutrition-green to-nutrition-blue shadow-lg hover:shadow-2xl scale-105"
                    : "bg-fade-dark-green hover:bg-gray-blue-600 scale-100"
                }
                rounded-lg cursor-pointer overflow-hidden
                hover:!scale-110 active:!scale-95
                ${sidebarOpen ? "px-4 py-3" : "p-1"}
              `}
      onClick={() => {
        setSelectedUser(id);
      }}
    >
      <div className="relative z-10 flex items-center justify-center">
        {sidebarOpen ? (
          <OpenSidebarClient name={name} />
        ) : (
          <ClosedSidebarClient name={name} />
        )}
      </div>
    </div>
  );
};

export const List = () => {
  const users = useFetchNutritionistUsers();

  if (users.isLoading) return <AnimationLoading />;

  return users.data?.map((user, index) => {
    if (!user) return null;

    return (
      <SingleClient
        key={user.user_id}
        name={user?.name || "Unnamed User"}
        id={user.user_id}
        idx={index}
      />
    );
  });
};
