import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@src/services/supabase/client";
import type { ViewInsert, ViewRow } from "@src/services/supabase/database";
import { queryKeys } from "../keys";
import { queryClient } from "../queryClient";
import { useGetAuthSession } from "../auth/get";

export type Video = ViewRow<"nutri_videos">;
// nutri_id lo pone la base de datos (default auth.uid())
export type NewVideo = Pick<
    ViewInsert<"nutri_videos">,
    "name" | "description" | "url"
>;

/** Vídeos del nutricionista autenticado, los más recientes primero */
export const useFetchMyVideos = () => {
    const { data: sessionData } = useGetAuthSession();
    const nutriId = sessionData?.userId ?? "";

    return useQuery({
        queryKey: queryKeys({ userId: nutriId }).data.videos,
        queryFn: async () => {
            const { data, error } = await supabase
                // nutri_videos ya devuelve solo los vídeos del nutricionista (auth.uid())
                .from("nutri_videos")
                .select("*")
                .order("updated_at", { ascending: false });

            if (error) {
                throw error;
            }
            return data;
        },
        enabled: !!nutriId,
    });
};

export const useInsertVideo = () => {
    const { data: sessionData } = useGetAuthSession();
    const nutriId = sessionData?.userId ?? "";

    return useMutation({
        mutationFn: async (newVideo: NewVideo) => {
            const { data, error } = await supabase
                .from("nutri_videos")
                .insert(newVideo)
                .select()
                .single();

            if (error) {
                throw error;
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys({ userId: nutriId }).data.videos });
        },
    });
};

export const useDeleteVideo = () => {
    const { data: sessionData } = useGetAuthSession();
    const nutriId = sessionData?.userId ?? "";

    return useMutation({
        mutationFn: async (videoId: number) => {
            const { error } = await supabase
                .from("nutri_videos")
                .delete()
                .eq("id", videoId);

            if (error) {
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys({ userId: nutriId }).data.videos });
        },
    });
};
