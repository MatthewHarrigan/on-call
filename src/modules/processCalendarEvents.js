
function eachDayOfInterval(s, e) {
  const end = new Date(e);
  let current = new Date(s);

  const result = [];

  while (current <= end) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
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
  const diff = (day <= 5) ? (7 - 5 + day ) : (day - 5);

  d.setDate(d.getDate() - diff);
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);

  return d.getTime();
}

// This maps the days from the confluence calendar and calculates weekends etc
const processCalendarEvents = ({
  calendarEvents,
  bankHolidays,
  userStaffConfig,
  costCentre,
  defaultPayDay,
  team
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
            ({ date }) => date === day.toISOString().split('T')[0]
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
      d.setDate(defaultPayDay);
      const payDay = isWeekend(d) ? previousFriday(d) : d;

      const nextMonth = new Date(payDay);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthFormatted = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(nextMonth)

      const currentMonthFormatted = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(payDay)

      const previousMonth = new Date(payDay);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const previousMonthFormatted = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(previousMonth)

      // If start date is before payDay put in that month's timesheet here
      // but if the period is mostly past payDay I'll sometimes discretionally bump to next month manually

      const timesheetTitle =
      new Date(start) < payDay && new Date(end) < payDay
          ? `${previousMonthFormatted}-${currentMonthFormatted}`
          : `${currentMonthFormatted}-${nextMonthFormatted}`;

      return {
        start,
        end,
        timesheet: timesheetTitle,
        staffNumber,
        name: formatName,
        cost: costCentre,
        weekdays,
        weekends,
        bankHols,
        team
      };
    }
  );

module.exports = { processCalendarEvents };
