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

const {
  printCSV,
  summariseRotationsByTimesheet,
  totalRotations,
} = require("./utils");

const { teams } = require("../config/config.json");

const { processCalendarEvents } = require("./processCalendarEvents");

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
  const start = new Date("01 October 2021 14:48 UTC");
  const end = new Date("01 November 2021 14:48 UTC");

  const response = await fetch("https://www.gov.uk/bank-holidays.json");
  const bankHolidays = await response.json();

  const results = await Promise.all(
    teams.map((team) => teamCalendarEvents(team, start, end))
  );

  results.forEach((result) => {
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
