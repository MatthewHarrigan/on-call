const createHTTPClient = require("../httpClient");

const inquirer = require("inquirer");
inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

const { costCentre, url, staff } = require("./config/config.json");
const { processCalendarEvents } = require("./modules/processCalendarEvents");

const {
  printCSV,
  summariseRotationsByTimesheet,
  totalRotations,
} = require("./modules/utils");

const date = new Date();
date.setMonth(date.getMonth() - 1);

async function run() {
  inquirer
    .prompt([
      {
        type: "datetime",
        name: "start",
        message: "Start date",
        initial: date,
        format: ["d", "/", "m", "/", "yyyy"],
      },
      {
        type: "datetime",
        name: "end",
        message: "End date",
        initial: new Date(),
        format: ["d", "/", "m", "/", "yyyy"],
      },
    ])
    .then((answers) => {
      const startDateWithoutMS = answers.start.toISOString().slice(0, -5) + "Z";
      const endDateWithoutMS = answers.end.toISOString().slice(0, -5) + "Z";

      const urlWithUserStartDate = url.replace(
        /START/g,
        encodeURI(startDateWithoutMS)
      );
      const urlWithUserEndDate = urlWithUserStartDate.replace(
        /END/g,
        encodeURI(endDateWithoutMS)
      );

      const httpClient = createHTTPClient();

      (async () => {
        const { events } = await httpClient.get(urlWithUserEndDate);
        const bankHolidays = await httpClient.get(
          "https://www.gov.uk/bank-holidays.json"
        );

        const processedCalendarEvents = processCalendarEvents(
          events,
          bankHolidays,
          staff,
          costCentre
        );

        console.log("\n<copy-paste this into Excel>\n");

        const print = printCSV(processedCalendarEvents, costCentre);

        console.log(print, "\n");

        // const sorted = totalRotations(events);
        // console.log(sorted, "\n");

        const summary = summariseRotationsByTimesheet(processedCalendarEvents);

        console.log("Timesheets summary", "\n\n", summary, "\n");
      })();
    });
}

module.exports = { run };
