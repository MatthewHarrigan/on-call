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

const inquirer = require("inquirer");
inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

const {
  printCSV,
  summariseRotationsByTimesheet,
  totalRotations,
} = require("./utils");

const { teams } = require("../config/config.json");

const { processCalendarEvents } = require("./processCalendarEvents");

const date = new Date();
date.setMonth(date.getMonth() - 1);

async function teamCalendarEvents(team, start, end) {
  const startDateWithoutMS = start.toISOString().slice(0, -5) + "Z";
  const endDateWithoutMS = end.toISOString().slice(0, -5) + "Z";
  const urlWithUserStartDate = team.url.replace(
    /START/g,
    encodeURI(startDateWithoutMS)
  );
  const urlWithUserEndDate = urlWithUserStartDate.replace(
    /END/g,
    encodeURI(endDateWithoutMS)
  );

  const response = await fetch(urlWithUserEndDate, requestOptions);
  const { events } = await response.json();
  return { team, events };
}

async function main() {
  const answers = await inquirer.prompt([
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
  ]);

  const fetchBankhols = await fetch("https://www.gov.uk/bank-holidays.json");
  const bankHolidays = await fetchBankhols.json();

  const fetchCals = await Promise.all(
    teams.map((team) => teamCalendarEvents(team, answers.start, answers.end))
  );

  fetchCals.forEach((result) => {
    const {
      team: { costCentre, staff },
      events,
    } = result;
    const processedCalendarEvents = processCalendarEvents(
      events,
      bankHolidays,
      staff,
      costCentre
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
