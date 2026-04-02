import { useTranslation } from "react-i18next"
import { cellStyles } from "../defaultStyles"
import { useTableContext } from "../../tableContext";

export const HeaderMacros = () => {
    const { t } = useTranslation();
    return (
        <>
            <div className={cellStyles.longHeader.backgroundSpan8}>
            {t("data:dashboardTable.dailyMacros.header")}
        </div>
        <div className={`${cellStyles.rightColumnCell.background}`}>
            {t("data:dashboardTable.dailyMacros.weeklyAvg")}
        </div>
        </>
    )
};

export const RowCarbsPerKg = () => {
    const { t } = useTranslation();
    return (
        <div className={cellStyles.leftColumnCell.background}>
            {t("data:dashboardTable.dailyMacros.carbsPerkg")}
        </div>
    )
};

export const RowProteinPerKgHeader = () => {
    const { t } = useTranslation();
    return (
        <div className={cellStyles.leftColumnCell.background}>
            {t("data:dashboardTable.dailyMacros.proteinPerkg")}
        </div>
    )
};

export const RowFatsPerKg = () => {
    const { t } = useTranslation();
    return (
        <div className={cellStyles.leftColumnCell.background}>
            {t("data:dashboardTable.dailyMacros.fatsPerkg")}
        </div>
    )
};

export const EmptyMacrosCell = () => {
    const { tableFragmentIndex } = useTableContext();
    return (
        <div 
            className={cellStyles.rightColumnCell.background}
            style={{
                gridColumn: 9,
                gridRow: tableFragmentIndex.trainingKcalRows.start + 2,
            }}
        >
            {/* This cell is intentionally left blank, but we can add a tooltip or something in the future */}
        </div>
    )
};

export const DailyMacrosCarbsPerKg = () => {
    const { daysOfWeek, planing } = useTableContext();

    return daysOfWeek.map((_, dayIndex) => {
        const carbsPerKg = planing.kcalState[dayIndex]?.macros.carbsPerKg ?? 0;
        return (
            <div
                key={dayIndex}
                className={cellStyles.numeric.display}
            >
                {carbsPerKg.toFixed(2)}
            </div>
        );
    });
};

export const ResumeMacrosCarbsPerKg = () => {
    const { planing, daysOfWeek } = useTableContext();
    const totalCarbsPerKg = planing.kcalState.reduce((total, day) => total + (day.macros.carbsPerKg ?? 0), 0);
    return (
        <div
            className={cellStyles.numeric.display}
        >
            {(totalCarbsPerKg / daysOfWeek.length).toFixed(2)}
        </div>
    );
}

export const DailyMacrosProteinPerKg = () => {
    const { daysOfWeek, planing } = useTableContext();

    return daysOfWeek.map((_, dayIndex) => {
        const proteinPerKg = planing.kcalState[dayIndex]?.macros.proteinPerKg ?? 0;
        return (
            <div
                key={dayIndex}
                className={cellStyles.numeric.display}
            >
                {proteinPerKg.toFixed(2)}
            </div>
        );
    });
};

export const ResumeMacrosProteinPerKg = () => {
    const { planing, daysOfWeek } = useTableContext();
    const totalProteinPerKg = planing.kcalState.reduce((total, day) => total + (day.macros.proteinPerKg ?? 0), 0);
    return (
        <div
            className={cellStyles.numeric.display}
        >
            {(totalProteinPerKg / daysOfWeek.length).toFixed(2)}
        </div>
    );
}

export const DailyMacrosFatsPerKg = () => {
    const { daysOfWeek, planing } = useTableContext();
    return daysOfWeek.map((_, dayIndex) => {
        const fatPerKg = planing.kcalState[dayIndex]?.macros.fatPerKg ?? 0;
        return (
            <div
                key={dayIndex}
                className={cellStyles.numeric.display}
            >
                {fatPerKg.toFixed(2)}
            </div>
        );
    });
};

export const ResumeMacrosFatsPerKg = () => {
    const { planing, daysOfWeek } = useTableContext();
    const totalFatPerKg = planing.kcalState.reduce((total, day) => total + (day.macros.fatPerKg ?? 0), 0);
    return (
        <div
            className={cellStyles.numeric.display}
        >
            {(totalFatPerKg / daysOfWeek.length).toFixed(2)}
        </div>
    );
}