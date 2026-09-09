import { useCallback } from "react";
import { fieldIds, useContextMeasuresForm } from "../form/hook";
import { useInsertUserMeasure } from "@src/services/tanstack/user/measures";
import { useTranslation } from "react-i18next";

export const BtnInsertMeasure = ({
    className,
}: {
    className?: string;
}) => {
    const { form } = useContextMeasuresForm();
    const { t } = useTranslation();
    const insertQuery = useInsertUserMeasure();

    const insertMeasure = useCallback(async () => {
        if (!form.validateForm()) return;
        const values = form.getState();
        const date = values[fieldIds.date] as string;
        const measureId = values[fieldIds.selectMeasure] as string;
        const measureValue = values[fieldIds.measure.generateId(parseInt(measureId))] as number;
        if (!date || !measureId || measureValue === undefined) return;
        try {
            const data = await insertQuery.mutateAsync({
                date,
                measure_id: parseInt(measureId),
                value: measureValue,
            });
            if (!data) throw new Error('No data returned from insert measure');
            form.reset();
        } catch (error) {
            console.error("Error inserting measure:", error);
        }
    }, [form, insertQuery]);

    return (
        <button
            onClick={insertMeasure}
            className={
                `px-4 py-2 bg-nutrition-green text-white rounded hover:bg-dark-green transition-colors ${className ?? ""}`
            }
            type="submit"
        >
            {t("system:messages.submit")}
        </button>
    )
}