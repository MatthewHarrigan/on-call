require("jest-fetch-mock").enableMocks();

const { mockConfig } = require("./mockConfig");

// Mocking a file
jest.mock("../../config/config.json", () => mockConfig, { virtual: true });

const { mockProcessedEvents } = require("./mockProcessedEvents");

// Mocking a module
const { processCalendarEvents } = require("../processCalendarEvents");
jest.mock("../processCalendarEvents");
processCalendarEvents.mockReturnValue(mockProcessedEvents);

const {
  printCSV,
  summariseRotationsByTimesheet,
  addDateRangeToCalendarUrl,
} = require("../utils");

jest.mock("../utils");

const inquirer = require("inquirer");
jest.mock("inquirer");

const start = new Date("01 October 2021 14:48 UTC");
const end = new Date("01 November 2021 14:48 UTC");
inquirer.prompt.mockResolvedValue({ start: start, end: end });

const { main } = require("../main");

const { response } = require("./mockEventsResponse");
const { bankHolidays } = require("./mockBankHolidaysResponse");

describe("main", () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponses(
      [JSON.stringify(bankHolidays), { status: 200 }],
      [JSON.stringify(response), { status: 200 }]
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test(" ", async () => {
  });

  // test("calls fetch", async () => {
  //   addDateRangeToCalendarUrl.mockReturnValue(
  //     "https://confluence/rest/calendar-services/1.0/calendar/events.json?subCalendarId=950d9966-d3b4-465e-aae2-d2f9cc023e42&userTimeZoneId=UTC&start=2021-10-01T14:48:00Z&end=2021-11-01T14:48:00Z"
  //   );
  //   await main();

  //   expect(fetch).toHaveBeenCalledTimes(2);

  //   expect(fetch.mock.calls[0][0]).toEqual(
  //     "https://www.gov.uk/bank-holidays.json"
  //   );

  //   expect(fetch.mock.calls[1][0]).toEqual(
  //     "https://confluence/rest/calendar-services/1.0/calendar/events.json?subCalendarId=950d9966-d3b4-465e-aae2-d2f9cc023e42&userTimeZoneId=UTC&start=2021-10-01T14:48:00Z&end=2021-11-01T14:48:00Z"
  //   );
  // });

  // test("calls processCalendarEvents", async () => {
  //   await main();
  //   expect(processCalendarEvents).toHaveBeenCalledTimes(1);
  // });

  // test("calls printCSV", async () => {
  //   await main();
  //   expect(printCSV).toHaveBeenCalledTimes(1);
  // });

  // test("summarises rotations by timesheet", async () => {
  //   await main();
  //   expect(summariseRotationsByTimesheet).toHaveBeenCalledTimes(1);
  // });
});
