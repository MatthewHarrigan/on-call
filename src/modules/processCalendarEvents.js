const eachDay = require("date-fns/eachDayOfInterval");
const isWeekend = require("date-fns/isWeekend");
const format = require("date-fns/format");
const subMonths = require("date-fns/subMonths");
const addMonths = require("date-fns/addMonths");
const isBefore = require("date-fns/isBefore");
const parseISO = require("date-fns/parseISO");
const { getPayDate } = require("./utils");
const PAYDAY = 15;

const processCalendarEvents = (events, bankHolidays, staffConfig, costCentre) =>
  events.map((event) => {
    const {
      invitees: [{ displayName: eventStaffName }],
      start,
      end,
    } = event;

    const eventStart = parseISO(start);
    const eventEnd = parseISO(end);

    // Get staff member from Config
    const findStaff = staffConfig.find(
      ({displayName}) => displayName === eventStaffName
    );

    if (!findStaff) {
      throw Error(
        `Unexpected staff member in calendar - check config: ${eventStaffName}`
      );
    }

    const { number: staffNumber, division: staffLocation } = findStaff;

    const eachDayOfInterval = eachDay({
      start: eventStart,
      end: eventEnd,
    });

    const weekends = eachDayOfInterval.filter(isWeekend).length;
    const weekdays = eachDayOfInterval.length - weekends;
    const bankHols = eachDayOfInterval.reduce((acc, day) => {
      if (
        bankHolidays[staffLocation].events.find(
          ({ date }) => date === format(day, "yyyy-MM-dd")
        )
      ) {
        acc += 1;
      }
      return acc;
    }, 0);

    const formatName = eventStaffName
      .split(".")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(" ");

    const payDay = getPayDate(eventStart, PAYDAY);

    const datePattern = "MMM";
    const nextMonth = format(addMonths(payDay, 1), datePattern);
    const currentMonth = format(payDay, datePattern);
    const previousMonth = format(subMonths(payDay, 1), datePattern);

    // If start date is before payDay put in that month's timesheet here
    // but if the period is mostly past payDay I'll sometimes discretionally bump to next month manually
    const timesheetTitle =
      isBefore(eventStart, payDay) && isBefore(eventEnd, payDay)
        ? `${previousMonth}-${currentMonth}`
        : `${currentMonth}-${nextMonth}`;

    return {
      // timesheet: timesheet,
      start: start,
      end: end,
      timesheet: timesheetTitle,
      staffNumber,
      name: formatName,
      cost: costCentre,
      weekdays,
      weekends,
      bankHols,
    };
  });

module.exports = { processCalendarEvents };
