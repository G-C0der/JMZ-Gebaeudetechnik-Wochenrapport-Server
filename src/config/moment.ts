import moment from "moment";

// Set the locale to start the week on Monday
moment.locale('ch', {
  week: {
    dow: 1, // First day of the week is Monday
  }
});
