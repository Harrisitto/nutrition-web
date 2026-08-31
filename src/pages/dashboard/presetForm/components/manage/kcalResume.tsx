import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Sector,
    Tooltip,
} from "recharts";

const CHART_COLORS = ["#455e19", "#30556b", "#6b2f55", "#8fa3b8", "#2b3618"];

const PieChart = ({
    mealKcal,
    totalKcal,
}: {
    mealKcal: {
        kcal: number;
        name: string;
    }[];
    totalKcal: number;
}) => {
    const pieData = mealKcal.map((meal, index) => ({
        ...meal,
        fill: CHART_COLORS[index % CHART_COLORS.length],
    }));

    if (!pieData.length || totalKcal <= 0) {
        return (
            <div className="h-28 w-28 rounded-full border border-nutrition-green/20 bg-white-green/40" />
        );
    }

    return (
        <div className="h-28 w-28 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                    <Pie
                        data={pieData}
                        dataKey="kcal"
                        nameKey="name"
                        innerRadius={26}
                        outerRadius={48}
                        paddingAngle={2}
                        stroke="none"
                        shape={(props) => <Sector {...props} fill={props.payload?.fill ?? "#455e19"} />}
                    />
                    <Tooltip
                        formatter={(value, name) => {
                            const numeric = Number(value ?? 0);
                            const pct = totalKcal > 0 ? Math.round((numeric / totalKcal) * 100) : 0;
                            return [`${numeric} kcal (${pct}%)`, String(name ?? "Meal")];
                        }}
                        contentStyle={{
                            borderRadius: "0.5rem",
                            border: "1px solid rgba(47, 59, 26, 0.2)",
                            backgroundColor: "#eaeee5",
                            color: "#14190b",
                            fontSize: "12px",
                        }}
                    />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
};

export const KcalResume = ({
    mealKcal,
    trainingKcal,
}: {
    mealKcal: {
        kcal: number;
        name: string;
    }[];
    trainingKcal: number;
}) => {
    const { t } = useTranslation();
    const mealTotalKcal = useMemo(() => {
        const mealsTotal = mealKcal.reduce((total, meal) => total + meal.kcal, 0);
        return mealsTotal;
    }, [mealKcal]);

    return (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-nutrition-green/20 bg-nutrition-green/10 px-3 py-2">
            <div>
                <h3 className="text-sm font-semibold text-text-subtitle">
                    {t("forms:preset.fields.totalKcal")}
                </h3>
                <p className="text-lg font-bold text-dark-green">{trainingKcal + mealTotalKcal}</p>
            </div>
            <div>
                <h3 className="text-sm font-medium text-text-muted">
                    {t("forms:preset.fields.mealsKcal")}
                </h3>
                <p className="text-base font-semibold text-text-title">{mealTotalKcal}</p>
            </div>
            <div>
                <h3 className="text-sm font-medium text-text-muted">
                    {t("forms:preset.fields.trainingKcal")}
                </h3>
                <p className="text-base font-semibold text-text-title">{trainingKcal}</p>
            </div>
            <PieChart mealKcal={mealKcal} totalKcal={mealTotalKcal} />
        </div>
    );
};