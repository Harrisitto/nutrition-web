import { supabase } from "../../supabase/client";
import { queryKeys } from "../keys";
import { useAppSelector } from "../../../store/store";
import { useQuery } from "@tanstack/react-query";

export const useFetchClientAppointmentPoints = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: clientId }).user.appointments.pending,
    queryFn: async () => {
        if (!clientId) {
            throw new Error("Client ID is not defined");
        }   

        const response = await supabase.from('user_appointment_points')
        .select('*')
        .eq('user_id', clientId)
        .is('treated_at', null);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    },
  });
};

export const useFetchTreatedClientAppointmentPoints = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: clientId }).user.appointments.treated,
    queryFn: async () => {
        if (!clientId) {
            throw new Error("Client ID is not defined");
        }
        const response = await supabase.from('user_appointment_points')
        .select('*')
        .eq('user_id', clientId)
        .not('treated_at', 'is', null);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    },
  });
};

export const useFetchClientPendingAppointments = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: clientId }).user.appointments.pending,
    queryFn: async () => {
        if (!clientId) {
            throw new Error("Client ID is not defined");
        }

        const response = await supabase.from('nutri_appointments')
        .select('*, user_appointment_points(*, appointment_theme_points(*))')
        .eq('user_id', clientId)
        .is('treated_at', null);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    },
  });
};

export const useFetchClientTreatedAppointments = () => {
  const clientId = useAppSelector((state) => state.config.selectedUserId);

  return useQuery({
    queryKey: queryKeys({ userId: clientId }).user.appointments.treated,
    queryFn: async () => {
        if (!clientId) {
            throw new Error("Client ID is not defined");
        }

        const response = await supabase.from('nutri_appointments')
        .select('*, user_appointment_points(*, appointment_theme_points(*))')
        .eq('user_id', clientId)
        .not('treated_at', 'is', null);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    },
  });
};
