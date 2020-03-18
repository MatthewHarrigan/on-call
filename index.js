const createHTTPClient = require("./httpClient");
const getISOWeek = require("date-fns/get_iso_week");
const eachDay = require("date-fns/each_day");
const isWeekend = require("date-fns/is_weekend");
const format = require("date-fns/format");
const fs = require("fs");
const { chargeCode, staff, url } = require("./config.json");

const getName = event => event.invitees[0].displayName;
const getStaffNumber = event => staff[getName(event)];
const getDate = day => format(day, "DD/MM/YYYY");

const rowTemplate = (day, event) =>
  `,${getStaffNumber(event)},${getName(event)},${chargeCode},${getISOWeek(
    day
  )},On-call: ${getDate(day)},,,,,,,,,,,,,${+!isWeekend(day)},${+isWeekend(
    day
  )}`;

const httpClient = createHTTPClient();
(async () => {
  const { events } = await httpClient.get(url);

  const out = events
    .flatMap(event =>
      eachDay(event.start, event.end).map(day => rowTemplate(day, event))
    )
    .join("\n");

  console.log(out);
})();

