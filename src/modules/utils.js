const getDate = (day) => format(day, "dd/MM/yyyy");
const format = require("date-fns/format");
const parseISO = require("date-fns/parseISO");

function printCSV(processedCalendarEvents, costCentre) {
  return processedCalendarEvents
    .map((event) =>
      [
        event.staffNumber,
        event.name,
        costCentre,
        `On-Call: ${getDate(parseISO(event.start))} - ${getDate(
          parseISO(event.end)
        )}`,
        "",
        "",
        event.weekdays,
        event.weekends,
        event.bankHols,
      ].join(",")
    )
    .join("\n");
}

function summariseRotationsByTimesheet(processedCalendarEvents) {
  return processedCalendarEvents.reduce((obj, rotation) => {
    if (!obj[rotation.timesheet]) {
      obj[rotation.timesheet] = { [rotation.name]: 1 };
    } else {
      if (!obj[rotation.timesheet][rotation.name]) {
        obj[rotation.timesheet][rotation.name] = 1;
      } else {
        obj[rotation.timesheet][rotation.name] += 1;
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
        allNames[name]++;
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
  const urlWithUserStartDate = url.replace(
    /START/g,
    encodeURI(startDateWithoutMS)
  );
  const urlWithUserEndDate = urlWithUserStartDate.replace(
    /END/g,
    encodeURI(endDateWithoutMS)
  );
  return urlWithUserEndDate;
}

module.exports = { printCSV, summariseRotationsByTimesheet, totalRotations, addDateRangeToCalendarUrl };
