export const renderMacroLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
  }: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    outerRadius?: number;
    percent?: number;
    name?: string;
  }) => {
    if (cx === undefined || cy === undefined || midAngle === undefined || outerRadius === undefined) {
      return null;
    }

    const radian = Math.PI / 180;
    const radius = outerRadius + 16;
    const x = cx + radius * Math.cos(-midAngle * radian);
    const y = cy + radius * Math.sin(-midAngle * radian);
    const displayPercent = percent !== undefined ? (percent * 100).toFixed(0) : "0";

    return (
      <text
        x={x}
        y={y}
        fill="#2b3618"
        fontSize={12}
        fontWeight={600}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name ?? ""}: ${displayPercent}%`}
      </text>
    );
  };