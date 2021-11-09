const fetch = require("node-fetch");

const https = require("https");

const { newAgent } = require("../../httpClient/agents");

const agentConfig = {
  // ca: "/etc/pki/cloud-ca.pem",
  ca: '/etc/pki/tls/certs/ca-bundle.crt',
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
  // const response = await fetch(urlWithUserEndDate, requestOptions);
  // const { events } = await response.json();

console.log(urlWithUserEndDate)
  try {

    let dataString = '';
    const response = await new Promise((resolve, reject) => {
      const req = https.get(urlWithUserEndDate, requestOptions, function (res) {
        res.on("data", (chunk) => {
          dataString += chunk;
        });
        res.on("end", () => {
          resolve({
            statusCode: 200,
            body: JSON.stringify(JSON.parse(dataString), null, 4),
          });
        });
      });
  
      req.on("error", (e) => {
        reject({
          statusCode: 500,
          body: "Something went wrong!",
        });
      });
    });

    const { events } = JSON.parse(response.body);
    return { team, events };

  } catch (error) {
    console.log(error);
  }

}

async function main() {
  const { userStart, userEnd } = await inquirer.prompt(questions);

  let dataString = '';
  let bankHolidays = [];
  try {

    const response = await new Promise((resolve, reject) => {
      const req = https.get("https://www.gov.uk/bank-holidays.json", function (res) {
        res.on("data", (chunk) => {
          dataString += chunk;
        });
        res.on("end", () => {
          resolve({
            statusCode: 200,
            body: JSON.stringify(JSON.parse(dataString), null, 4),
          });
        });
      });
  
      req.on("error", (e) => {
        reject({
          statusCode: 500,
          body: "Something went wrong!",
        });
      });
    });

    bankHolidays = JSON.parse(response.body);
  } catch (error) {
    console.log(error);
  }

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
