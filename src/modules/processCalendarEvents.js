const { addMonths, format } = require('date-fns')

function eachDayOfInterval(s, e) {
  const end = new Date(e);
  let current = new Date(s);

  const result = [];

  while (current <= end) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
    current.setHours(0,0,0,0);
  }
  return result;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function previousFriday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day <= 5 ? 7 - 5 + day : day - 5;

  d.setDate(d.getDate() - diff);
  // d.setHours(0);
  // d.setMinutes(0);
  // d.setSeconds(0);

  return new Date(d.getTime());
}

// This maps the days from the confluence calendar and calculates weekends etc
const processCalendarEvents = ({
  calendarEvents,
  bankHolidays,
  userStaffConfig,
  costCentre,
  defaultsubmissionCutOff,
  team,
}) =>
  calendarEvents.map(
    ({ invitees: [{ displayName: eventStaffName }], start, end }) => {
      const { number: staffNumber, division: staffRegion } =
        userStaffConfig.find(
          ({ displayName }) => displayName === eventStaffName
        ) || {};

      if (!staffNumber && !staffRegion) {
        throw Error(
          `Unexpected staff member found in calendar - check config: ${eventStaffName}`
        );
      }

      // TODO work out what the start and end dates actually are
      const eachDay = eachDayOfInterval(start, end);

      const weekends = eachDay.filter(isWeekend).length;
      const weekdays = eachDay.length - weekends;
      const bankHols = eachDay.reduce((acc, day) => {
        if (
          bankHolidays[staffRegion].events.find(
            ({ date }) => date === day.toISOString().split("T")[0]
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

      const d = new Date(start);
      d.setDate(defaultsubmissionCutOff);
      const submissionCutOff = isWeekend(d) ? previousFriday(d) : d;

      const nextMonth = new Date(submissionCutOff);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthFormatted = new Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
      })
        .formatToParts(nextMonth)
        .map(({ value }) => {
          return value === " " ? "-" : value;
        })
        .join("");

      const currentMonthFormatted = new Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
      })
        .formatToParts(submissionCutOff)
        .map(({ value }) => {
          return value === " " ? "-" : value;
        })
        .join("");

      const previousMonth = new Date(submissionCutOff);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const previousMonthFormatted = new Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
      })
        .formatToParts(previousMonth)
        .map(({ value }) => {
          return value === " " ? "-" : value;
        })
        .join("");

      // If start date is before submissionCutOff put in that month's timesheetTitle here
      // but if the period is mostly past submissionCutOff I'll sometimes discretionally bump to next month manually

      let timesheetTitle;
      let paymentMonth;

      if (new Date(start) < submissionCutOff && new Date(end) < submissionCutOff) {
        timesheetTitle = `${previousMonthFormatted} ${currentMonthFormatted}`;
        paymentMonth = addMonths(new Date(submissionCutOff), 1);
      } else {
        timesheetTitle = `${currentMonthFormatted} ${nextMonthFormatted}`;
        paymentMonth = addMonths(nextMonth, 1);
      }

      const paymentMonthFormatted = format(paymentMonth, 'MMMM-yyyy');

      return {
        start,
        end,
        timesheetTitle,
        paymentMonth: paymentMonthFormatted,
        submissionCutOff,
        staffNumber,
        name: formatName,
        cost: costCentre,
        weekdays,
        weekends,
        bankHols,
        team,
      };
    }
  );

module.exports = { processCalendarEvents };
