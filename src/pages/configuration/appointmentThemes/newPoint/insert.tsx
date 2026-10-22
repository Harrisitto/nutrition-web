import { useInsertAppointmentPoint } from "../../../../services/tanstack/data/appointments";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { primaryIconButtonStyle } from "@src/components/styles";
import type { Form } from "@src/hooks/form/class";
import { fieldIds } from "./form";

export const BtnInsertAppointmentPoint = ({
    form,
    theme_id,
}: {
    form: Form;
    theme_id: number;
}) => {
    const { t } = useTranslation();
    const insertAppointmentPoint = useInsertAppointmentPoint();

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // Values live in the Form instance, read them at click time
        if (!form.validateForm()) return;
        const state = form.getState();
        insertAppointmentPoint.mutate(
            {
                theme_id,
                point: state[fieldIds.point] as string,
                in_days: state[fieldIds.inDays] as number,
            },
            {
                onSuccess: () => form.reset(),
                onError: (error) => console.error("Error inserting appointment point:", error),
            },
        );
    };

    return (
        <button
            type="submit"
            onClick={handleSubmit}
            disabled={insertAppointmentPoint.isPending}
            title={t("data:configuration.sections.appointmentThemes.forms.point.submit")}
            aria-label={t("data:configuration.sections.appointmentThemes.forms.point.submit")}
            className={primaryIconButtonStyle}
        >
            <Plus size={18} />
        </button>
    );
};
