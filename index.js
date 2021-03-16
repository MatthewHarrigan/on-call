const createHTTPClient = require("./httpClient");
const getISOWeek = require("date-fns/get_iso_week");
const eachDay = require("date-fns/each_day");
const isWeekend = require("date-fns/is_weekend");
const format = require("date-fns/format");
const fs = require("fs");

const inquirer = require("inquirer");
inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

const date = new Date();
date.setMonth(date.getMonth() - 1);

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
    const { team, chargeCode, staff, url } = require("./config.json");

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

    const getName = (event) => event.invitees[0].displayName;
    const getStaffNumber = (event) => staff[getName(event)];
    const getDate = (day) => format(day, "DD/MM/YYYY");

    let rowIndex = 1;
    const rowTemplate = (day, event) =>
      `${rowIndex++},${getStaffNumber(event)},${getName(
        event
      )},${chargeCode},${getISOWeek(day)},On-call: ${getDate(
        day
      )},,,,,,,,,,${+!isWeekend(day)},${+isWeekend(day)}`;

    const httpClient = createHTTPClient();

    (async () => {
      const { events } = await httpClient.get(urlWithUserEndDate);
      const out = events
        .flatMap((event) =>
          eachDay(event.start, event.end).map((day) => rowTemplate(day, event))
        )
        .join("\n");

      console.log("\n", out, "\n");

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

      console.log(names);
    })();
  });
