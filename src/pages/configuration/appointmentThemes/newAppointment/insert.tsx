import { useInsertAppointmentTheme } from "../../../../services/tanstack/data/appointments";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { primaryIconButtonStyle } from "@src/components/styles";
import type { Form } from "@src/hooks/form/class";
import { fieldIds } from "./form";

export const BtnInsertAppointment = ({
    form,
}: {
    form: Form;
}) => {
    const { t } = useTranslation();
    const insertAppointmentTheme = useInsertAppointmentTheme();

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // Values live in the Form instance, read them at click time
        if (!form.validateForm()) return;
        const state = form.getState();
        insertAppointmentTheme.mutate(
            { name: state[fieldIds.name] as string },
            {
                onSuccess: () => form.reset(),
                onError: (error) => console.error("Error inserting appointment theme:", error),
            },
        );
    };

    return (
        <button
            type="submit"
            onClick={handleSubmit}
            disabled={insertAppointmentTheme.isPending}
            title={t("data:configuration.sections.appointmentThemes.forms.appointment.submit")}
            aria-label={t("data:configuration.sections.appointmentThemes.forms.appointment.submit")}
            className={primaryIconButtonStyle}
        >
            <Plus size={18} />
        </button>
    );
};
