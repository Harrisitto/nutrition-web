
export const getDateForDayIndex = (startDate: Date, dayIndex: number): Date => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayIndex);
    return date;
}

export const getDayOfMonth = (startDate: Date, dayIndex: number): number => {
    const date = getDateForDayIndex(startDate, dayIndex);
    return date.getDate();
}

export const getDayIndexForDate = (startDate: Date, targetDate: Date): number => {
    const timeDiff = targetDate.getTime() - startDate.getTime();
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
}


export const generatePlaningKey = (mealId: string, date: Date) => {
    const dateStr = date.toLocaleDateString(); // Get YYYY-MM-DD format
    return `${mealId}#${dateStr}`;
}

export const generateTrainingKey = (date: Date) => {
    const dateStr = date.toLocaleDateString();
    return `training#${dateStr}`;
}

export const parseTrainingKey = (key: string) => {
    const dateStr = key.split("#")[1];
    return new Date(dateStr);
}

export const parsePlaningKey = (key: string) => {
    const [mealId, dateStr] = key.split("#");
    return { mealId, date: new Date(dateStr) };
}

export const colorBasedOnKcal = (kcal: number) => {
    if (kcal < 200) return "bg-green-100 text-white-800";
    if (kcal < 300) return "bg-green-200 text-white-800";
    if (kcal < 400) return "bg-yellow-100 text-white-800";
    if (kcal < 500) return "bg-yellow-200 text-white-800";
    if (kcal < 600) return "bg-yellow-300 text-white-800";
    if (kcal < 700) return "bg-orange-100 text-white-800";
    if (kcal < 800) return "bg-orange-200 text-white-800";
    if (kcal < 900) return "bg-orange-300 text-white-800";
    if (kcal < 1000) return "bg-orange-400 text-white-800";
    if (kcal < 1100) return "bg-orange-500 text-white-800";
    return "bg-red-500 text-white-800";
}