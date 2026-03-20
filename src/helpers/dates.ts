
export const dateToSupabaseFormat = (date: Date) => {
    // YEAR-MONTH-DAY
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const saveDate = (date: Date) => {
    return date.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
}

export const loadDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);  
};

export const nextDayDate = (date: Date | string) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate;
}


export const fromDate = (fromDate = new Date()) => ({
    incrementDay: (days: number) => {
        const newDate = new Date(fromDate);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    },
    nextMonday: () => {
        const day = fromDate.getDay();
        const diff = (day === 0 ? 1 : 8) - day;
        return new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + diff);
    },
    nextSunday: () => {
        const day = fromDate.getDay();
        const diff = (day === 0 ? 0 : 7) - day;
        return new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + diff);
    },
    thisMonday: () => {
        const day = fromDate.getDay();
        const diff = (day === 0 ? -6 : 1) - day;
        return new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + diff);
    },
    thisSunday: () => {
        const day = fromDate.getDay();
        const diff = (day === 0 ? 0 : 7) - day;
        return new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + diff);
    },
    pastMonday: () => {
        const day = fromDate.getDay();
        const diff = (day === 0 ? -6 : 1) - day;
        return new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + diff - 7);
    },
    pastSunday: () => {
        const day = fromDate.getDay();
        const diff = (day === 0 ? 0 : 7) - day;
        return new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + diff - 7);
    },
})