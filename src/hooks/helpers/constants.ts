export const calculateKcalFromMacros = ({
    carbs,
    protein,
    fat,
}: {
    carbs?: number;
    protein?: number;
    fat?: number;
}) => {
    const carbKcal = carbs ? carbs * 4 : 0;
    const proteinKcal = protein ? protein * 4 : 0;
    const fatKcal = fat ? fat * 9 : 0;
    return carbKcal + proteinKcal + fatKcal;
};