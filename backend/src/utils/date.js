const dayjs = require("dayjs");

const getLeaveDays = (fromDate, toDate) => {
  const start = dayjs(fromDate).startOf("day");
  const end = dayjs(toDate).startOf("day");

  if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
    return 0;
  }

  return end.diff(start, "day") + 1;
};

const monthRange = (month) => {
  const start = dayjs(`${month}-01`).startOf("month");
  return {
    start: start.toDate(),
    end: start.endOf("month").toDate(),
    daysInMonth: start.daysInMonth()
  };
};

module.exports = { getLeaveDays, monthRange };
