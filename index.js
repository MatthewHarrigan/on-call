const createHTTPClient = require("./httpClient");
const eachDay = require("date-fns/each_day");
const isWeekend = require("date-fns/is_weekend");
const format = require("date-fns/format");

const inquirer = require("inquirer");
inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

const { costCentre, staff, url } = require("./config.json");

const date = new Date();
date.setMonth(date.getMonth() - 1);

const getName = (event) => event.invitees[0].displayName;
const getStaff = (event) =>
  staff.find((element) => element.displayName === getName(event));

const getDate = (day) => format(day, "DD/MM/YYYY");

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

      console.log("\n");

      const out = events
        .map((event) => {
          const days = eachDay(event.start, event.end);
          const weekends = days.filter(isWeekend).length;
          const weekdays = days.length - weekends;
          const bankHols = days.reduce((acc, day) => {
            if (
              bankHolidays[getStaff(event).division].events.find(
                ({ date }) => date === format(day, "YYYY-MM-DD")
              )
            ) {
              acc += 1;
            }
            return acc;
          }, 0);

          const dateRangeStr = `On-Call: ${getDate(event.start)} - ${getDate(
            event.end
          )}`;

          const name = getName(event)
            .split(".")
            .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
            .join(" ");

          return [
            getStaff(event).number,
            name,
            costCentre,
            dateRangeStr,
            "",
            "",
            weekdays,
            weekends,
            bankHols,
          ].join(",");
        })
        .join("\n");

      console.log(out, "\n");

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
