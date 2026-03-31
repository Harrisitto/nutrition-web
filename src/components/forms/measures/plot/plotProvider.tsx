import { useMemo, useState, type ReactNode } from "react";
import { PlotContext } from "./plotContext";

type DateRange = {
	startDate: Date;
	endDate: Date;
};

export const PlotProvider = ({ children }: { children: ReactNode }) => {
	const maxDate = useMemo(() => new Date(), []);
	const minDate = useMemo(() => {
		const date = new Date(maxDate);
		date.setMonth(maxDate.getMonth() - 3);
		return date;
	}, [maxDate]);

	const [focusedDateRange, setFocusedDateRange] = useState<DateRange>({
		startDate: minDate,
		endDate: maxDate,
	});

	const [dateRange, setDateRange] = useState<DateRange>({
		startDate: minDate,
		endDate: maxDate,
	});

	const value = useMemo(
		() => ({
			minDate,
			maxDate,
			dateRange,
			focusedDateRange,
			setDateRange,
			setFocusedDateRange,
		}),
		[dateRange, focusedDateRange, maxDate, minDate],
	);

	return <PlotContext.Provider value={value}>{children}</PlotContext.Provider>;
};


