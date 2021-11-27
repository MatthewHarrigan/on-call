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

const BANKHOLIDAYS_URL = "https://www.gov.uk/bank-holidays.json";
const TIMESHEETS_DIR = "timesheets";
// Submit and payfor that has happened retrospectively (up to payday)
const DEFAULT_TIMESHEET_SUBMISSION_CUTOFF = 15;
const { departments } = require("../config/config.json");

const {
  addDateRangeToCalendarUrl,
  printCSV,
  summariseRotationsByTimesheet,
  printSummaryTable,
  totalRotations,
  clearExistingTimesheets,
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

  const fetchBankhols = await fetch(BANKHOLIDAYS_URL);
  const bankHolidays = await fetchBankhols.json();

  const processedResults = [];

  for (const { department, teams } of departments) {
    const calendarEventResults = await Promise.all(
      teams.map((team) =>
        fetchCalendarEventsByDateRange(team, userStart, userEnd)
      )
    );

    for (result of calendarEventResults) {
      const {
        config: { costCentre, staff: userStaffConfig, team },
        events: calendarEvents,
      } = result;

      const processedCalendarEvents = processCalendarEvents({
        bankHolidays,
        calendarEvents,
        costCentre,
        defaultsubmissionCutOff: DEFAULT_TIMESHEET_SUBMISSION_CUTOFF,
        userStaffConfig,
        team,
      });

      processedResults.push({ department, team, processedCalendarEvents });

      console.log("\n<copy-paste this into Excel>\n");

      const print = printCSV(processedCalendarEvents, costCentre);
      console.log(print, "\n");

      const sorted = totalRotations(calendarEvents);
      console.log(sorted, "\n");

      const summary = summariseRotationsByTimesheet(processedCalendarEvents);
      console.log("Timesheets summary", "\n\n", summary, "\n");

      console.log("Print a nice table");
      console.log(printSummaryTable(processedCalendarEvents));
    }
  }

  inquirer
    .prompt([
      {
        type: "list",
        name: "response",
        message: "Save timesheets?",
        choices: ["no", "yes"],
      },
    ])
    .then((answers) => {
      if (answers.response === "yes") {
        promptClearDir();
      } else {
        console.log("bye!");
      }
    });

  function promptClearDir() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "response",
          message: "Clear files?",
          choices: ["yes", "no"],
        },
      ])
      .then((answers) => {
        if (answers.response === "yes") {
          clearExistingTimesheets(TIMESHEETS_DIR);
        }

        writeTimesheet(processedResults);
      });
  }
}

module.exports = { main };
