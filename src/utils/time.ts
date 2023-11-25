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
const getWeekDateRange = (date: Date) => {
  // Set the locale to start the week on Monday
  moment.locale('en', {
    week: {
      dow: 1, // First day of the week is Monday
    }
  });

  // Start of the week (Monday)
  const startOfWeek = moment(date).startOf('week');

  // End of the week (Sunday)
  const endOfWeek = moment(date).endOf('week');

  return {
    start: startOfWeek.format('YYYY-MM-DD'),
    end: endOfWeek.format('YYYY-MM-DD')
  };
};

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
