import { AnimationLoading } from "@src/components/global/Animations";
import { useEffect, useMemo, useState } from "react";
import { useFetchNutritionistUsers } from "@src/services/tanstack/user/profile";
import { RefreshCcwIcon, SearchIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { setSelectedUserId } from "@src/store/slices/config/store";


const checkUpcomingMeals = (planingDateStr: string | undefined): boolean => {
  if (!planingDateStr) return false;

  const latestPlaningDate = new Date(planingDateStr);

  // Obtenemos el límite: Hoy + 5 días en adelante (puedes ajustar el número de días aquí)
  const targetLimitDate = new Date();
  targetLimitDate.setDate(targetLimitDate.getDate() + 5);

  // IMPORTANTE: Usamos .getTime() para comparar los timestamps reales completos
  return latestPlaningDate.getTime() >= targetLimitDate.getTime();
};

const OpenSidebarClient = ({ name }: { name: string }) => {
  return (
    <div className="px-2 py-2 truncate w-full">
      <p className="text-sm font-semibold text-white truncate">{name}</p>
    </div>
  );
};

const ClosedSidebarClient = ({ name }: { name: string }) => {
  return (
    // Aseguramos flex y centrado absoluto dentro del contenedor del avatar
    <div className="flex items-center justify-center w-8 h-8 aspect-square m-auto">
      <p className="text-sm font-bold text-white text-center">
        {name[0]?.toUpperCase() || "?"}
      </p>
    </div>
  );
};

const SingleClient = ({
  name,
  id,
  idx,
  hasNextWeek,
}: {
  name: string;
  id: string;
  idx: number;
  hasNextWeek: boolean;
}) => {
  const selectedUser = useAppSelector((state) => state.config.selectedUserId);
  const sidebarOpen = useAppSelector((state) => state.config.sidebarOpen);
  const dispatch = useAppDispatch();
  const setSelectedUser = (id: string) => {
    dispatch(setSelectedUserId(id));
  };


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
        relative transition-all duration-300 ease-out
        ${
          isSelected
            ? "bg-gradient-to-r from-nutrition-green to-nutrition-blue shadow-lg hover:shadow-2xl scale-102"
            : `${hasNextWeek ? "bg-gradient-to-r to-fade-dark-green from-nutrition-blue" : "bg-gradient-to-r to-fade-dark-green from-nutrition-purple"}`
        }
        rounded-lg cursor-pointer overflow-hidden
        hover:scale-105 active:scale-98
        ${sidebarOpen ? "w-full p-1 my-1" : "w-full p-1 my-2 flex justify-center"}
      `}
      onClick={() => {
        setSelectedUser(id);
      }}
    >
      {/* Forzamos que el contenedor z-10 sea un flex centrado si la barra está cerrada */}
      <div
        className={`relative z-10 flex items-center ${sidebarOpen ? "w-full justify-start" : "w-full justify-center"}`}
      >
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
  const [search, setSearch] = useState("");
  const users = useFetchNutritionistUsers();
  const sidebarOpen = useAppSelector((state) => state.config.sidebarOpen);

  const displayUsers = useMemo(() => {
    if (!users.data) return [];
    return users.data.filter((user) => {
      return user.name
        .trim()
        .toLowerCase()
        .includes(search.trim().toLowerCase());
    });
  }, [users.data, search]);

  if (users.isLoading) return <AnimationLoading />;

  return (
    <>
      {sidebarOpen && (
        <div className="relative w-full px-2 mb-4 group">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-colors group-focus-within:text-nutrition-green" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente..."
            className="w-full pl-9 pr-10 py-2 text-sm text-white placeholder-gray-400 bg-fade-dark-green border border-transparent rounded-lg focus:outline-none focus:border-nutrition-green focus:ring-2 focus:ring-nutrition-green/20 transition-all duration-200"
          />

          <button
            type="button"
            onClick={() => {
              setSearch("");
              users.refetch();
            }}
            disabled={users.isFetching}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-200 focus:outline-none disabled:pointer-events-none"
            title="Sincronizar clientes"
          >
            <RefreshCcwIcon
              className={`w-4 h-4 transition-transform duration-500 ease-in-out ${
                users.isFetching
                  ? "animate-spin text-nutrition-green"
                  : "hover:rotate-45"
              }`}
            />
          </button>
        </div>
      )}

      {/* Contenedor de la lista con flex col para mantener la estructura limpia */}
      <div className="flex flex-col gap-1 w-full">
        {displayUsers.map((user, index) => {
          if (!user) return null;
          // Extraemos la última fecha de planificación que trajo tu query de Supabase
          const latestDate = user.user_planing?.[0]?.date;
          // Evaluamos si tiene comidas programadas para de aquí a 5 días en adelante
          const hasUpcomingMeals = checkUpcomingMeals(latestDate);
          return (
            <SingleClient
              key={user.user_id}
              name={user?.name || "Unnamed User"}
              id={user.user_id}
              idx={index}
              hasNextWeek={hasUpcomingMeals}
            />
          );
        })}
      </div>
    </>
  );
};
