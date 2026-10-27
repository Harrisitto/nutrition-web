import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

const inputStyle =
    "w-full min-w-0 px-3 py-2 rounded-md bg-gray-blue-50 border border-gray-blue-300 text-gray-blue-700 transition focus:outline-none focus:ring-2 focus:ring-gray-blue-400 focus:border-gray-blue-500";

// Etiqueta pequeña de cada extremo del rango (Fecha de inicio / Fecha de fin)
const rangeLabelStyle = "text-[11px] font-semibold uppercase tracking-wider text-gray-blue-500";

type BaseDateInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">;

type SingleDateProps = BaseDateInputProps & {
    label?: string;
    value?: string;
    onChange: (newDate: string) => void;
};

type RangeValue = {
    startDate: string;
    endDate: string;
};

type RangeDateProps = BaseDateInputProps & {
    label?: string;
    onChange: (startDate: string, endDate: string) => void;
    value?: RangeValue;
};

export const SingleDate = ({
    label,
    value,
    onChange,
    ...props
}: SingleDateProps) => {
    return (
        <label className="flex flex-col gap-2">
            {label && <span className="text-sm text-gray-blue-600">{label}</span>}
            <input
                type="date"
                {...props}
                value={value}
                className={inputStyle}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
};

// Valor en formato "HH:MM"
export const SingleTime = ({
    label,
    value,
    onChange,
    ...props
}: SingleDateProps) => {
    return (
        <label className="flex flex-col gap-2">
            {label && <span className="text-sm text-gray-blue-600">{label}</span>}
            <input
                type="time"
                {...props}
                value={value}
                className={inputStyle}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
};

export const RangeDate = ({
    label,
    onChange,
    value,
    ...props
}: RangeDateProps) => {
    const { t } = useTranslation();

    // fieldset y no label: un label con dos inputs solo enfoca el primero
    return (
        <fieldset className="flex min-w-0 flex-col">
            {label && <legend className="mb-2 text-sm text-gray-blue-600">{label}</legend>}
            {/* En pantallas anchas inicio -> fin en una fila; en movil uno debajo del otro */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className={rangeLabelStyle}>{t("system:dateRange.start")}</span>
                    {/* El calendario no deja elegir un inicio posterior al fin ni al reves */}
                    <input
                        type="date"
                        max={value?.endDate || undefined}
                        {...props}
                        value={value?.startDate || ""}
                        className={inputStyle}
                        onChange={(e) => onChange(e.target.value, value?.endDate || "")}
                    />
                </label>
                {/* mb-3: centrada con la altura del input */}
                <ArrowRight
                    size={16}
                    aria-hidden
                    className="hidden shrink-0 text-gray-blue-400 sm:mb-3 sm:block"
                />
                <label className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className={rangeLabelStyle}>{t("system:dateRange.end")}</span>
                    <input
                        type="date"
                        min={value?.startDate || undefined}
                        {...props}
                        value={value?.endDate || ""}
                        className={inputStyle}
                        onChange={(e) => onChange(value?.startDate || "", e.target.value)}
                    />
                </label>
            </div>
        </fieldset>
    );
};