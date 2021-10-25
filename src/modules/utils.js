const getDate = (day) => format(day, "dd/MM/yyyy");
const format = require("date-fns/format");
const parseISO = require("date-fns/parseISO");
const isWeekend = require("date-fns/isWeekend");
const previousFriday = require("date-fns/previousFriday");
const setDate = require("date-fns/setDate");

function printCSV(processedCalendarEvents, costCentre) {
  return processedCalendarEvents
    .map(({staffNumber, name, weekdays, weekends, bankHols, start, end}) =>
      [
        staffNumber,
        name,
        costCentre,
        `On-Call: ${getDate(parseISO(start))} - ${getDate(
          parseISO(end)
        )}`,
        "",
        "",
        weekdays,
        weekends,
        bankHols,
      ].join(",")
    )
    .join("\n");
}

function summariseRotationsByTimesheet(processedCalendarEvents) {
  return processedCalendarEvents.reduce((obj, {timesheet, name}) => {
    if (!obj[timesheet]) {
      obj[timesheet] = { [name]: 1 };
    } else {
      if (!obj[timesheet][name]) {
        obj[timesheet][name] = 1;
      } else {
        obj[timesheet][name] += 1;
      }
    }

    return obj;
  }, {});
}

function totalRotations(processedCalendarEvents) {
  const names = processedCalendarEvents
    .flatMap((event) => event.invitees[0].displayName)
    .reduce((allNames, name) => {
      if (name in allNames) {
        allNames[name] += 1;
      } else {
        allNames[name] = 1;
      }
      return allNames;
    }, {});

  const entries = Object.entries(names);

  const sorted = entries.sort((a, b) => b[1] - a[1]);
  return sorted;
}

function addDateRangeToCalendarUrl(start, end, url) {
  const startDateWithoutMS = start.toISOString().slice(0, -5) + "Z";
  const endDateWithoutMS = end.toISOString().slice(0, -5) + "Z";
  return url.replace(
    /START/g,
    encodeURI(startDateWithoutMS)
  ).replace(
    /END/g,
    encodeURI(endDateWithoutMS)
  );
}

function getPayDate(date, companyPayDay) {
  const payday = setDate(date, companyPayDay);
  return isWeekend(payday) ? previousFriday(payday) : payday;
}

module.exports = {
  printCSV,
  summariseRotationsByTimesheet,
  totalRotations,
  addDateRangeToCalendarUrl,
  getPayDate,
};
