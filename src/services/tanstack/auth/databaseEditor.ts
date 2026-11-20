import { useQuery } from "@tanstack/react-query";
import { supabase } from "@src/services/supabase/client";
import { queryKeys } from "../keys";
import { useGetAuthSession } from "./get";

/**
 * Si el usuario de la sesión es editor de la base de datos (escribe los catálogos: recetas, medidas...).
 * public.recipe_editors es la vista de compatibilidad sobre public_users.database_editors y solo devuelve
 * la fila propia, así que basta con mirar si hay alguna. Es la única API que lo expone por ahora: cuando
 * se borre la vista habrá que pasar a una RPC.
 * Solo sirve para mostrar u ocultar la UI: los permisos los comprueba la base de datos al escribir.
 */
export const useIsDatabaseEditor = () => {
  const { data: session } = useGetAuthSession();
  const userId = session?.userId;

  return useQuery({
    queryKey: queryKeys({ userId }).auth.databaseEditor,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipe_editors")
        .select("user_id")
        .eq("user_id", userId!)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!userId,
    staleTime: 30 * 60 * 1000,
  });
};
