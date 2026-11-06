import {
    useFetchAppointmentThemeById,
    useInsertAppointmentPoint,
} from "@src/services/tanstack/data/appointments";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { primaryIconButtonStyle } from "@src/components/styles";
import type { Form } from "@src/hooks/form/class";
import { fieldIds } from "./form";
import { groupNameOfDay } from "../listPoints/groups";

export const BtnInsertAppointmentPoint = ({
    form,
    theme_id,
    documentId,
    onInserted,
}: {
    form: Form;
    theme_id: number;
    documentId: string; // "" = sin documento
    onInserted: () => void;
}) => {
    const { t } = useTranslation();
    const insertAppointmentPoint = useInsertAppointmentPoint();
    // Ya en caché por la lista: de aquí sale el grupo del día al que se añade
    const { data: points } = useFetchAppointmentThemeById(theme_id);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // Values live in the Form instance, read them at click time
        if (!form.validateForm()) return;
        const state = form.getState();
        const inDays = state[fieldIds.inDays] as number;
        insertAppointmentPoint.mutate(
            {
                theme_id,
                point: state[fieldIds.point] as string,
                in_days: inDays,
                group_name: groupNameOfDay(points ?? [], inDays),
                document_id: documentId || null,
            },
            {
                onSuccess: () => {
                    form.reset();
                    onInserted();
                },
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
