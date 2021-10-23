const eachDay = require("date-fns/eachDayOfInterval");
const isWeekend = require("date-fns/isWeekend");
const format = require("date-fns/format");
const subDays = require("date-fns/subDays");
const subMonths = require("date-fns/subMonths");
const addMonths = require("date-fns/addMonths");
const isBefore = require("date-fns/isBefore");
const parseISO = require("date-fns/parseISO");
const getName = (event) => event.invitees[0].displayName;

const processCalendarEvents = (events, bankHolidays, staffConfig, costCentre) => {
  return events.map((event) => {
    const start = parseISO(event.start);
    const end = parseISO(event.end);

    const days = eachDay({
      start: start,
      end: end,
    });

    const findStaff = staffConfig.find((staffFromConfig) => {
      return staffFromConfig.displayName === event.invitees[0].displayName;
    });

    if (!findStaff) {
      throw Error(`Unexpected staff member in calendar - check config: ${event.invitees[0].displayName}`);
    }

    const staffNumber = findStaff.number;

    const weekends = days.filter(isWeekend).length;
    const weekdays = days.length - weekends;
    const bankHols = days.reduce((acc, day) => {
      if (
        bankHolidays[findStaff.division].events.find(
          ({ date }) => date === format(day, "yyyy-MM-dd")
        )
      ) {
        acc += 1;
      }
      return acc;
    }, 0);

    const name = getName(event)
      .split(".")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(" ");

    let payDay = start;
    payDay.setDate(15);
    while (isWeekend(payDay)) {
      payDay = subDays(payDay, 1);
    }

    const datePattern = "MMM";
    const nextMonth = format(addMonths(payDay, 1), datePattern);
    const currentMonth = format(payDay, datePattern);
    const previousMonth = format(subMonths(payDay, 1), datePattern);

    // If start date is before payDay put in that month's timesheet here
    // but if the period is mostly past payDay I'll discretionally bump to next month manually
    const timesheet = isBefore(start, payDay)
      ? `${previousMonth}-${currentMonth}`
      : `${currentMonth}-${nextMonth}`;

    return {
      timesheet: timesheet,
      start: event.start,
      end: event.end,
      timesheet: timesheet,
      staffNumber: staffNumber,
      name: name,
      cost: costCentre,
      weekdays: weekdays,
      weekends: weekends,
      bankHols: bankHols,
    };
  });
};

module.exports = { processCalendarEvents };