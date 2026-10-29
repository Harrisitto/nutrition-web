import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@src/services/supabase/client";
import type { Database } from "@src/services/supabase/types";
import { queryKeys } from "../keys";
import { queryClient } from "../queryClient";
import { useGetAuthSession } from "../auth/get";

export type Video = Database["public"]["Tables"]["all_videos"]["Row"];
// nutri_id lo pone la base de datos (default auth.uid())
export type NewVideo = Pick<
    Database["public"]["Tables"]["all_videos"]["Insert"],
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
                .from("all_videos")
                .select("*")
                .eq("nutri_id", nutriId)
                .order("updated", { ascending: false });

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
                .from("all_videos")
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
                .from("all_videos")
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
