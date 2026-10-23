import { useFetchClientPendingAppointments } from "../../../../services/tanstack/user/appointments";
import { PendingAppointmentItem } from "./item";

export const PendingAppointments = () => {
    const appointmentsQuery = useFetchClientPendingAppointments();

    if (appointmentsQuery.isLoading || appointmentsQuery.isError) {
        return null;
    }

    return appointmentsQuery.data?.map((appointment) => (
        <PendingAppointmentItem key={appointment.id} appointment={appointment} />
    ));
};