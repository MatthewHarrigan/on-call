function printCSV(processedCalendarEvents) {
  return processedCalendarEvents
    .map(({staffNumber, name, cost, weekdays, weekends, bankHols, start, end}) =>
      [
        staffNumber,
        name,
        cost,
        `On-Call: ${new Date(start).toLocaleString().split(',')[0]} - ${new Date(end).toLocaleString().split(',')[0]}`,
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

module.exports = {
  printCSV,
  summariseRotationsByTimesheet,
  totalRotations,
  addDateRangeToCalendarUrl,
};
