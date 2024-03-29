const fetch = require("node-fetch");
const { readdir } = require("fs/promises");

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
const CONFIG_EXAMPLE_FILE = "config.example.json";
const CONFIG_DIR = "src/config/";

const {
  addDateRangeToCalendarUrl,
  printCSV,
  summariseRotationsByTimesheet,
  printSummaryTable,
  totalRotations,
} = require("./utils");

const { processCalendarEvents } = require("./processCalendarEvents");

const { clearExistingTimesheets, writeTimesheet } = require("./spreadsheet");

const inquirer = require("inquirer");
inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

async function main() {
  try {
    const configFiles = await readdir(CONFIG_DIR);
    const filterConfigFiles = configFiles.filter((item) => item !== CONFIG_EXAMPLE_FILE);

    if (filterConfigFiles.length === 0) {
      throw new Error("No config files found");
    }

    const { config } =
      filterConfigFiles.length > 1
        ? await inquirer.prompt({
            type: "list",
            name: "config",
            message: "Choose a config file",
            choices: filterConfigFiles,
          })
        : { config: filterConfigFiles[0] };

    const { departments } = require(`../config/${config}`);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const { userStart, userEnd } = await inquirer.prompt([
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
    ]);

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

        console.log("Total rotations\n");
        const sorted = totalRotations(calendarEvents);
        console.log(sorted, "\n");

        // const summary = summariseRotationsByTimesheet(processedCalendarEvents);
        // console.log("Timesheets summary", "\n\n", summary, "\n");

        console.table(printSummaryTable(processedCalendarEvents));
      }
    }

    const { response } = await inquirer.prompt([
      {
        type: "list",
        name: "response",
        message: "Save timesheets?",
        choices: ["no", "yes"],
      },
    ]);

    if (response === "yes") {
      await writeFiles(processedResults);
    } else {
      console.log("bye!");
    }
  } catch (err) {
    console.error(err);
  }
}

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
  if (!events) {
    throw new Error(`No events: Possible problem with calendar ${urlWithUserEndDate}`)
  }
  return { config, events };
}

async function writeFiles(processedResults) {
  const { response } = await inquirer.prompt([
    {
      type: "list",
      name: "response",
      message: "Clear files?",
      choices: ["yes", "no"],
    },
  ]);

  if (response === "yes") {
    clearExistingTimesheets(TIMESHEETS_DIR);
  }

  for (const {
    department,
    team,
    processedCalendarEvents,
  } of processedResults) {
    writeTimesheet(TIMESHEETS_DIR, processedCalendarEvents, team, department);
  }
}

module.exports = { main };
