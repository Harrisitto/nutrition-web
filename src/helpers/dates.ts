const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * El estándar parsea "YYYY-MM-DD" como medianoche UTC, mientras que `save()` y
 * el resto de métodos de la clase leen en hora local. En husos por detrás de
 * UTC eso devolvía el día anterior y desplazaba toda la semana. Anclamos esas
 * fechas a medianoche local para que el string que entra sea el que sale.
 * Los timestamps, los `Date` y los strings con hora se dejan intactos.
 */
const parseDateOnly = (date: string | number | Date) => {
  if (typeof date !== "string") return date;
  const match = DATE_ONLY.exec(date);
  if (!match) return date;
  const [, year, month, day] = match;
  const local = new Date(0);
  local.setFullYear(Number(year), Number(month) - 1, Number(day));
  local.setHours(0, 0, 0, 0);
  return local;
};

class FromDate extends Date {
  constructor(date?: string | number | Date | null) {
    if (date) {
      super(parseDateOnly(date));
    } else {
      super();
    }
  }

  save(): string {
    const year = this.getFullYear();
    const month = String(this.getMonth() + 1).padStart(2, "0");
    const day = String(this.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  incrementDay(days: number): FromDate {
    const newDate = new FromDate(this);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  thisMonday(): FromDate {
    const newDate = new FromDate(this);
    const day = newDate.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    newDate.setDate(newDate.getDate() + diff);
    return newDate;
  }

  thisSunday(): FromDate {
    const newDate = new FromDate(this);
    const day = newDate.getDay();
    const diff = (day === 0 ? 0 : 7) - day;
    newDate.setDate(newDate.getDate() + diff);
    return newDate;
  }

  thisWeek() {
    return {
      monday: this.thisMonday(),
      sunday: this.thisSunday(),
    };
  }
}

export default FromDate;
