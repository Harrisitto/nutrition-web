import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export const Chart = ({
    data,
}: {
    data: number[];
}) => {
    const normalizedData = data.map((value, index) => ({
        hour: `${index + 1}H`,
        carbs: value || 0,
    }));

    const hasData = normalizedData.some((item) => item.carbs > 0);

    if (!normalizedData.length) {
        return (
            <div className="rounded-lg border border-nutrition-green/20 bg-white-green/30 px-3 py-5 text-center text-xs text-text-muted">
                -
            </div>
        );
    }

    return (
        <div className="h-44 w-full rounded-lg border border-nutrition-green/20 bg-white-green/30 p-2">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={normalizedData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(47, 59, 26, 0.2)" />
                    <XAxis
                        dataKey="hour"
                        tick={{ fill: "#455e19", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(47, 59, 26, 0.2)" }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "#455e19", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={28}
                    />
                    <Tooltip
                        cursor={{ fill: "rgba(47, 59, 26, 0.08)" }}
                        contentStyle={{
                            borderRadius: "0.5rem",
                            border: "1px solid rgba(47, 59, 26, 0.2)",
                            backgroundColor: "#eaeee5",
                            color: "#14190b",
                            fontSize: "12px",
                        }}
                        formatter={(value) => [`${Number(value ?? 0)} gHC`, "HC"]}
                    />
                    <Bar dataKey="carbs" radius={[6, 6, 0, 0]} fill={hasData ? "#455e19" : "#8fa3b8"} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};