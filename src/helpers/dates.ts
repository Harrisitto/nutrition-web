class FromDate extends Date {
  constructor(date?: string | number | Date | null) {
    if (date) {
      super(date);
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
