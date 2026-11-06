import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../keys";
import { queryClient } from "../queryClient";

export const useFetchAppointmentThemes = () => {
  return useQuery({
    queryKey: queryKeys().data.appointmentThemes,
    queryFn: async () => {
      const response = await supabase
        .from('nutri_appointment_themes')
        .select('*')
        .eq('is_deleted', false);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
  });
};

export const useInsertAppointmentTheme = () => {
    return useMutation({
        mutationFn: async (newTheme: { name: string }) => {
            const response = await supabase
                .from('nutri_appointment_themes')
                .insert(newTheme)
                .select()
                .single();

            if (response.error) {
                throw new Error(response.error.message);
            }

            return response.data;
        },
        onSuccess: () => {
            // Invalidate the query to refetch the appointment themes after a successful insertion
            queryClient.invalidateQueries({ queryKey: queryKeys().data.appointmentThemes });
        },
    });
};

export const useChangeAppointmentTheme = () => {
    return useMutation({
        mutationFn: async (updatedTheme: { id: number; name: string }) => {
            const response = await supabase
                .from('nutri_appointment_themes')
                .update({ name: updatedTheme.name })
                .eq('id', updatedTheme.id)
                .select()
                .single();

            if (response.error) {
                throw new Error(response.error.message);
            }

            return response.data;
        },
        onSuccess: () => {
            // Invalidate the query to refetch the appointment themes after a successful update
            queryClient.invalidateQueries({ queryKey: queryKeys().data.appointmentThemes });
        },
    });
};

export const useDeleteAppointmentTheme = () => {
    return useMutation({
        mutationFn: async (themeId: number) => {
            const response = await supabase
                .from('nutri_appointment_themes')
                .update({ is_deleted: true })
                .eq('id', themeId)
                .select()
                .single();

            if (response.error) {
                throw new Error(response.error.message);
            }

            return response.data;
        },
        onSuccess: () => {
            // Invalidate the query to refetch the appointment themes after a successful deletion
            queryClient.invalidateQueries({ queryKey: queryKeys().data.appointmentThemes });
        },
    });
};

export const useFetchAppointmentThemeById = (themeId: number) => {
  return useQuery({
    queryKey: queryKeys().data.appointmentPoints(themeId),
    queryFn: async () => {
      const response = await supabase
        .from('appointment_theme_points')
        .select('*')
        .eq('theme_id', themeId)
        .order('in_days', { ascending: true })
        // El mismo día, por orden de creación (como al llevarlos a una consulta)
        .order('id', { ascending: true });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
  });
};

export const useInsertAppointmentPoint = () => {
  return useMutation({
    // group_name: el del día al que se añade (todos los puntos de un día comparten grupo)
    // document_id: documento del nutricionista que se copia al punto al llevarlo a una consulta
    mutationFn: async (newPoint: {
      theme_id: number;
      point: string;
      in_days: number;
      group_name: string | null;
      document_id: string | null;
    }) => {
      const response = await supabase
        .from('appointment_theme_points')
        .insert(newPoint)
        .select()
        .single();

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the query to refetch the appointment points for the specific theme after a successful insertion
      queryClient.invalidateQueries({ queryKey: queryKeys().data.appointmentPoints(data.theme_id) });
    },
  });
};

export const useChangeAppointmentPoint = () => {
  return useMutation({
    // group_name: el del día de destino, que puede haber cambiado con in_days
    mutationFn: async (updatedPoint: {
      id: number;
      point: string;
      in_days: number;
      group_name: string | null;
      document_id: string | null;
    }) => {
      const response = await supabase
        .from('appointment_theme_points')
        .update({
          point: updatedPoint.point,
          in_days: updatedPoint.in_days,
          group_name: updatedPoint.group_name,
          document_id: updatedPoint.document_id,
        })
        .eq('id', updatedPoint.id)
        .select()
        .single();

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the query to refetch the appointment points for the specific theme after a successful update
      queryClient.invalidateQueries({ queryKey: queryKeys().data.appointmentPoints(data.theme_id) });
    },
  });
};

// Nombre del grupo de los puntos de una temática que caen el mismo día: se escribe en todos
export const useRenameAppointmentPointGroup = () => {
  return useMutation({
    mutationFn: async (group: { theme_id: number; in_days: number; group_name: string | null }) => {
      const response = await supabase
        .from('appointment_theme_points')
        .update({ group_name: group.group_name })
        .eq('theme_id', group.theme_id)
        .eq('in_days', group.in_days);

      if (response.error) {
        throw new Error(response.error.message);
      }
    },
    onSuccess: (_, group) => {
      queryClient.invalidateQueries({ queryKey: queryKeys().data.appointmentPoints(group.theme_id) });
    },
  });
};

export const useDeleteAppointmentPoint = () => {
  return useMutation({
    mutationFn: async (pointId: number) => {
      const response = await supabase
        .from('appointment_theme_points')
        .delete()
        .eq('id', pointId)
        .select()
        .single();

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the query to refetch the appointment points for the specific theme after a successful deletion
      queryClient.invalidateQueries({ queryKey: queryKeys().data.appointmentPoints(data.theme_id) });
    },
  });
};