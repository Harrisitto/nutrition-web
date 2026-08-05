
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


export const generatePlaningKey = (date: Date | string) => {
    if (typeof date === "string") {
        return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString(); // Get YYYY-MM-DD format
}

export const parsePlaningKey = (key: string) => {
    return new Date(key);
}

export const generateMealKey = (mealId: number, date: Date | string) => {
    const dateKey = generatePlaningKey(date);
    return `${mealId}#${dateKey}`;
}

export const parseMealKey = (key: string) => {
    const [mealIdStr, dateStr] = key.split("#");
    return {
        mealId: parseInt(mealIdStr, 10),
        date: parsePlaningKey(dateStr),
    }
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