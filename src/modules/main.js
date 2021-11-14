const fetch = require("node-fetch");

const { newAgent } = require("../httpClient/agents");

const requestOptions = {
  agent: newAgent("https", {
    ca: "/etc/pki/tls/certs/ca-bundle.crt",
    cert: "/etc/pki/tls/certs/client.crt",
    key: "/etc/pki/tls/private/client.key",
  }),
  method: "GET",
};

const TIMESHEETS_DIR = "timesheets";
const DEFAULT_PAYDAY_OF_MONTH = 15;
const { teams } = require("../config/.config.json");

const {
  printCSV,
  summariseRotationsByTimesheet,
  totalRotations,
  addDateRangeToCalendarUrl,
} = require("./utils");

const { processCalendarEvents } = require("./processCalendarEvents");

const { writeTimesheet } = require("./spreadsheet");

const inquirer = require("inquirer");
inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);

const questions = [
  {
    type: "datetime",
    name: "userStart",
    message: "Start date",
    initial: lastMonth,
    format: ["d", "/", "m", "/", "yyyy"],
  },
  {
    type: "datetime",
    name: "userEnd",
    message: "End date",
    initial: new Date(),
    format: ["d", "/", "m", "/", "yyyy"],
  },
];

async function fetchCalendarEventsByDateRange(
  { teamCalendarAPI, ...config },
  start,
  end
) {
  const urlWithUserEndDate = addDateRangeToCalendarUrl(
    start,
    end,
    teamCalendarAPI
  );
  const response = await fetch(urlWithUserEndDate, requestOptions);
  const { events } = await response.json();
  return { config, events };
}

async function main() {
  const { userStart, userEnd } = await inquirer.prompt(questions);

  const fetchBankhols = await fetch("https://www.gov.uk/bank-holidays.json");
  const bankHolidays = await fetchBankhols.json();

  const calendarEventResults = await Promise.all(
    teams.map((team) =>
      fetchCalendarEventsByDateRange(team, userStart, userEnd)
    )
  );

  const processedResults = [];

  for (result of calendarEventResults) {
    const {
      config: { costCentre, staff: userStaffConfig, team },
      events: calendarEvents,
    } = result;

    const processedCalendarEvents = processCalendarEvents({
      bankHolidays,
      calendarEvents,
      costCentre,
      defaultPayDay: DEFAULT_PAYDAY_OF_MONTH,
      userStaffConfig,
      team,
    });

    processedResults.push({ team, processedCalendarEvents });

    console.log(processedCalendarEvents);
    console.log("\n<copy-paste this into Excel>\n");

    const print = printCSV(processedCalendarEvents, costCentre);
    console.log(print, "\n");

    const sorted = totalRotations(calendarEvents);
    console.log(sorted, "\n");

    const summary = summariseRotationsByTimesheet(processedCalendarEvents);
    console.log("Timesheets summary", "\n\n", summary, "\n");
  }

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'response',
        message: 'Save timesheets?',
        choices: ['yes', 'no'],
      },
    ])
    .then((answers) => {
      if (answers.response === "yes") {
        processedResults.forEach(({ team, processedCalendarEvents }) => {
          writeTimesheet(TIMESHEETS_DIR, processedCalendarEvents, team);
        });
      } else {
        console.log('bye!')
      }
    });
}

module.exports = { main };
