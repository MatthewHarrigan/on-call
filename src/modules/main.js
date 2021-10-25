const fetch = require("node-fetch");

const { newAgent } = require("../../httpClient/agents");

const agentConfig = {
  ca: "/etc/pki/cloud-ca.pem",
  cert: "/etc/pki/tls/certs/client.crt",
  key: "/etc/pki/tls/private/client.key",
};

const requestOptions = {
  agent: newAgent("https", agentConfig),
  method: "GET",
};

const { teams } = require("../config/config.json");

const {
  printCSV,
  summariseRotationsByTimesheet,
  totalRotations,
  addDateRangeToCalendarUrl,
} = require("./utils");

const defaultPayDay = 15;
const { processCalendarEvents } = require("./processCalendarEvents");

const inquirer = require("inquirer");

inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

const date = new Date();
date.setMonth(date.getMonth() - 1);

const questions = [
  {
    type: "datetime",
    name: "userStart",
    message: "Start date",
    initial: date,
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

async function fetchCalendarEventsByDateRange(team, start, end) {
  const { teamCalendarAPI } = team;

  const urlWithUserEndDate = addDateRangeToCalendarUrl(
    start,
    end,
    teamCalendarAPI
  );
  const response = await fetch(urlWithUserEndDate, requestOptions);
  const { events } = await response.json();
  return { team, events };
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

  calendarEventResults.forEach((result) => {
    const {
      team: { costCentre, staff },
      events,
    } = result;

    const processedCalendarEvents = processCalendarEvents(
      events,
      bankHolidays,
      staff,
      costCentre,
      defaultPayDay
    );
    console.log("\n<copy-paste this into Excel>\n");

    const print = printCSV(processedCalendarEvents, costCentre);
    console.log(print, "\n");

    // // // const sorted = totalRotations(events);
    // // // console.log(sorted, "\n");
    const summary = summariseRotationsByTimesheet(processedCalendarEvents);
    console.log("Timesheets summary", "\n\n", summary, "\n");
  });
}

module.exports = { main };
