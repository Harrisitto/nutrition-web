import { Range } from "react-range";
import { useTranslation } from "react-i18next";
import { usePlotContext } from "../plotContext";
import FromDate from "../../../../../../helpers/dates";

export const SelectDateRange = () => {
    const { t } = useTranslation();
    const { dateRange, minDate, maxDate, setDateRange } = usePlotContext();

    return (
        <div className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-600">
                        {t("forms:measures.fields.dateRangeStart")}
                    </span>
                    <input
                        type="date"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                        value={dateRange.startDate.toISOString().split("T")[0]}
                        min={minDate.toISOString().split("T")[0]}
                        max={maxDate.toISOString().split("T")[0]}
                        onChange={(e) =>
                            setDateRange({
                                ...dateRange,
                                startDate: new FromDate(e.target.value),
                            })
                        }
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-600">
                        {t("forms:measures.fields.dateRangeEnd")}
                    </span>
                    <input
                        type="date"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                        value={dateRange.endDate.toISOString().split("T")[0]}
                        min={minDate.toISOString().split("T")[0]}
                        max={maxDate.toISOString().split("T")[0]}
                        onChange={(e) =>
                            setDateRange({
                                ...dateRange,
                                endDate: new FromDate(e.target.value),
                            })
                        }
                    />
                </label>
            </div>
        </div>
    );
};

export const SelectFocusedDateRange = () => {
    const { focusedDateRange, dateRange, setFocusedDateRange } = usePlotContext();

    const DAY_IN_MS = 24 * 60 * 60 * 1000;
    const toStartOfDayTimestamp = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

    const minTimestamp = toStartOfDayTimestamp(dateRange.startDate);
    const maxTimestamp = toStartOfDayTimestamp(dateRange.endDate);
    const totalDays = Math.max(0, Math.round((maxTimestamp - minTimestamp) / DAY_IN_MS));

    const startDay = Math.max(
        0,
        Math.min(
            totalDays,
            Math.round((toStartOfDayTimestamp(focusedDateRange.startDate) - minTimestamp) / DAY_IN_MS),
        ),
    );

    const endDay = Math.max(
        0,
        Math.min(
            totalDays,
            Math.round((toStartOfDayTimestamp(focusedDateRange.endDate) - minTimestamp) / DAY_IN_MS),
        ),
    );

    const values = [
        Math.min(startDay, endDay),
        Math.max(startDay, endDay),
    ];
    
    const formatDayLabel = (dayIndex: number) =>
        new Date(minTimestamp + dayIndex * DAY_IN_MS).toLocaleDateString();

    return (
        <div className="w-full py-2">
            <Range
                label="Select focused date range"
                step={1}
                min={0}
                max={totalDays}
                values={values}
                onChange={([startValue, endValue]) => {
                    const startDayValue = Math.min(startValue, endValue);
                    const endDayValue = Math.max(startValue, endValue);

                    setFocusedDateRange({
                        startDate: new FromDate(minTimestamp + startDayValue * DAY_IN_MS),
                        endDate: new FromDate(minTimestamp + endDayValue * DAY_IN_MS),
                    });
                }}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        className="flex h-8 w-full"
                    >
                        <div
                            ref={props.ref}
                            className="h-1.5 w-full self-center rounded-full bg-slate-300"
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ props, value }) => (
                    <div
                        {...props}
                        key={props.key}
                        className="relative h-4 w-4 rounded-full border-2 border-sky-600 bg-white shadow"
                    >
                        <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded bg-white px-1 text-[10px] text-slate-700 shadow-sm">
                            {formatDayLabel(value)}
                        </span>
                    </div>
                )}
            />
        </div>
    );
};