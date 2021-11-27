function addDateRangeToCalendarUrl(start, end, url) {
  const startDateWithoutMS = start.toISOString().slice(0, -5) + "Z";
  const endDateWithoutMS = end.toISOString().slice(0, -5) + "Z";
  return url
    .replace(/START/g, encodeURI(startDateWithoutMS))
    .replace(/END/g, encodeURI(endDateWithoutMS));
}

function clearExistingTimesheets(dir) {
  const fs = require("fs");
  const path = require("path");

  fs.readdir(dir, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(dir, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

function writeFiles(processedResults) {
  for (const {
    department,
    team,
    processedCalendarEvents,
  } of processedResults) {
    writeTimesheet(TIMESHEETS_DIR, processedCalendarEvents, team, department);
  }
}

function printCSV(processedCalendarEvents) {
  return processedCalendarEvents
    .map(
      ({ staffNumber, name, cost, weekdays, weekends, bankHols, start, end }) =>
        [
          staffNumber,
          name,
          cost,
          `On-Call: ${new Date(start).toLocaleString().split(",")[0]} - ${
            new Date(end).toLocaleString().split(",")[0]
          }`,
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
  return processedCalendarEvents.reduce((obj, { timesheet, name }) => {
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

function printSummaryTable(processedCalendarEvents) {
  console.log(processedCalendarEvents)
  return '<table>';
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

module.exports = {
  addDateRangeToCalendarUrl,
  clearExistingTimesheets,
  printCSV,
  summariseRotationsByTimesheet,
  printSummaryTable,
  totalRotations,
  writeFiles,
};
