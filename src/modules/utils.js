function addDateRangeToCalendarUrl(start, end, url) {
  const startDateWithoutMS = start.toISOString().slice(0, -5) + "Z";
  const endDateWithoutMS = end.toISOString().slice(0, -5) + "Z";
  return url
    .replace(/START/g, encodeURI(startDateWithoutMS))
    .replace(/END/g, encodeURI(endDateWithoutMS));
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
  return processedCalendarEvents.reduce((obj, { timesheetTitle, name }) => {
    if (!obj[timesheetTitle]) {
      obj[timesheetTitle] = { [name]: 1 };
    } else {
      if (!obj[timesheetTitle][name]) {
        obj[timesheetTitle][name] = 1;
      } else {
        obj[timesheetTitle][name] += 1;
      }
    }

    return obj;
  }, {});
}

function printSummaryTable(processedCalendarEvents) {
  const results = processedCalendarEvents.reduce(
    (obj, { timesheetTitle, name, paymentMonth, submissionCutOff }) => {
      if (!obj[paymentMonth]) {
        const payDay = new Intl.DateTimeFormat("en-GB", {
          dateStyle: "full",
        }).format(submissionCutOff);

        obj[paymentMonth] = {
          paySlip: paymentMonth,
          rotas: { [name]: 1 },
          submittedInTimesheet: timesheetTitle,
        };
      } else {
        if (!obj[paymentMonth]["rotas"][name]) {
          obj[paymentMonth]["rotas"][name] = 1;
        } else {
          obj[paymentMonth]["rotas"][name] += 1;
        }
      }
      return obj;
    },
    {}
  );

  const tidyTable = [];
  for (const result in results) {
    results[result].rotas = JSON.stringify(results[result].rotas);
    tidyTable.push(results[result]);
  }

  return tidyTable;
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
  printCSV,
  summariseRotationsByTimesheet,
  printSummaryTable,
  totalRotations,
};
