import { useState } from "react";
import { useTranslation } from "react-i18next";
import FromDate from "@src/helpers/dates";
import { RangeDate } from "../../../../../../components/input/date";
import { StepSection } from "../../components/stepSection";
import { HistoryPlaning } from "./planing";
import { HistoryMeasures } from "./measures";
import { HistoryNotes } from "./notes";
import { toPeriod, weekPeriod, type PeriodInput } from "./shared/period";

const STEP_HISTORY_PAGES = ["planing", "measures", "notes"] as const;

type StepHistoryPages = (typeof STEP_HISTORY_PAGES)[number];

const StepHistory = ({ appointmentId }: { appointmentId: number }) => {
    const { t } = useTranslation();
    const [page, setPage] = useState<StepHistoryPages>('planing');

    // Fechas del RangeDate ("YYYY-MM-DD"), por defecto la semana actual
    const [range, setRange] = useState<PeriodInput>(() => {
        const { start, end } = weekPeriod(new FromDate());
        return { startDate: start.save(), endDate: end.save() };
    });

    // Al pulsar un resultado de busqueda se elige su semana
    const selectWeek = (date: FromDate) => {
        const { start, end } = weekPeriod(date);
        setRange({ startDate: start.save(), endDate: end.save() });
    };

    const pageProps = { period: toPeriod(range), onSelectWeek: selectWeek };

    return (
        <StepSection step="history">
            <RangeDate
                label={t("data:appointments.form.history.period")}
                value={range}
                onChange={(startDate, endDate) => setRange({ startDate, endDate })}
            />

            <div role="tablist" className="flex gap-1 border-b border-nutrition-green/20">
                {STEP_HISTORY_PAGES.map((value) => (
                    <button
                        key={value}
                        type="button"
                        role="tab"
                        aria-selected={page === value}
                        onClick={() => setPage(value)}
                        className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                            page === value
                                ? "border-nutrition-green text-nutrition-green"
                                : "border-transparent text-text-muted hover:text-text-title"
                        }`}
                    >
                        {t(`data:appointments.form.history.pages.${value}`)}
                    </button>
                ))}
            </div>

            {/* Las paginas siguen montadas al cambiar de pestaña: no se pierde la busqueda */}
            <div hidden={page !== "planing"}>
                <HistoryPlaning {...pageProps} />
            </div>
            <div hidden={page !== "measures"}>
                <HistoryMeasures {...pageProps} />
            </div>
            <div hidden={page !== "notes"}>
                <HistoryNotes {...pageProps} appointmentId={appointmentId} />
            </div>
        </StepSection>
    );
}

export default StepHistory;
