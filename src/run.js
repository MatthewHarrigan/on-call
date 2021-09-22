const createHTTPClient = require("../httpClient");
const format = require("date-fns/format");
const parseISO = require("date-fns/parseISO");

const inquirer = require("inquirer");
inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

const { costCentre, url, staff} = require("./config/config.json");
const { processCalendarEvents } = require("./modules/processCalendarEvents");

const date = new Date();
date.setMonth(date.getMonth() - 1);
const getDate = (day) => format(day, "dd/MM/yyyy");

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

        const out = processCalendarEvents(events, bankHolidays, staff, costCentre);

        console.log(out);

        console.log("\n<copy-paste this into Excel>\n");

        const print = out
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

        console.log(print, "\n");

        const names = events
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

        console.log(sorted);
      })();
    });
}

module.exports = { run };
