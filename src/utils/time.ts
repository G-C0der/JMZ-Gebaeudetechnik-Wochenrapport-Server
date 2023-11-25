import moment from "moment";

/**
 * Explicitly format date to dateonly
 * Useful to avoid any potential pitfalls related to timezones or format mismatches
 * @param date
 */
const toDateOnly = (date?: Date): string => moment(date).format('YYYY-MM-DD');

/**
 * Get week date range from a specific date
 * @param date
 */
const getWeekDateRange = (date: Date) => ({
  start: moment(date).startOf('week').format('YYYY-MM-DD'), // Start of the week (Monday)
  end: moment(date).endOf('week').format('YYYY-MM-DD') // End of the week (Sunday)
});

const timeStringToMinutes = (time: string | null) => {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export {
  toDateOnly,
  getWeekDateRange,
  timeStringToMinutes
};
