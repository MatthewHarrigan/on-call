const Excel = require("exceljs");

async function writeTimesheet(dir, processedCalendarEvents, team, department) {
  // group events by timesheetTitle e.g. oct-nov
  const eventsByTimesheet = processedCalendarEvents.reduce(
    (obj, { timesheetTitle, ...event }) => {
      if (!obj[timesheetTitle]) {
        obj[timesheetTitle] = [event];
      } else {
        obj[timesheetTitle].push(event);
      }
      return obj;
    },
    {}
  );

  const timesheetTitles = Object.keys(eventsByTimesheet);

  for (const title of timesheetTitles) {
    const newWorkbook = new Excel.Workbook();
    await newWorkbook.xlsx.readFile("./docs/template.xlsx");

    const newworksheet = newWorkbook.getWorksheet("On Call Payments and Hours");

    const cellDivision = newworksheet.getCell("E9");
    cellDivision.value = `${department} ${team}`;

    const cellPayMonth = newworksheet.getCell("E10");
    cellPayMonth.value = title;

    // array of objects representing on call rotation
    eventsByTimesheet[title].map((event, index) => {
      var rowValues = [];
      rowValues[3] = event.staffNumber;
      rowValues[4] = event.name;
      rowValues[5] = event.cost;
      rowValues[6] = `On-Call: ${
        new Date(event.start).toLocaleString().split(",")[0]
      } - ${new Date(event.end).toLocaleString().split(",")[0]}`;
      rowValues[9] = event.weekdays;
      rowValues[10] = event.weekends;
      rowValues[11] = event.bankHols;

      newworksheet.insertRow(index + 16, rowValues, "o+");
    });

    const file = `./${dir}/On call Timesheet V3 ${department} ${team} ${title}.xlsx`;
    await newWorkbook.xlsx.writeFile(file);

    console.log(`${file}`)
  }
}

module.exports = { writeTimesheet };
