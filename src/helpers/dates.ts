
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

export const parseDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);  
};


export const dateThisMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7; // Calculate how many days to subtract to get to Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    return monday;
}

export const dateThisSunday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToSunday = (7 - dayOfWeek) % 7;
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + diffToSunday);
    return sunday;
}

export const dateLastMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToLastMonday = (dayOfWeek + 6) % 7 + 7;
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - diffToLastMonday);
    return lastMonday;
}

export const dateLastSunday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToLastSunday = (7 - dayOfWeek) % 7 || 7;
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - diffToLastSunday);
    return lastSunday;
}

export const dateNextMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToNextMonday = (8 - dayOfWeek) % 7 || 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + diffToNextMonday);
    return nextMonday;
}

export const dateNextSunday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToNextSunday = (7 - dayOfWeek) % 7 || 7;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + diffToNextSunday);
    return nextSunday;
}