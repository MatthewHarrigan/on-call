require("jest-fetch-mock").enableMocks();

const mockConfig = {
  teams: [
    {
      team: "FoodThree",
      staff: [
        {
          displayName: "Todd Bonzalez",
          number: "524870J",
          division: "england-and-wales",
        },
        {
          displayName: "Willie Dustice",
          number: "506352B",
          division: "england-and-wales",
        },
        {
          displayName: "Bobson Dugnutt",
          number: "527770W",
          division: "england-and-wales",
        },
        {
          displayName: "dorse.o.hintline",
          number: "553398E",
          division: "england-and-wales",
        },
      ],
      calendarPage:
        "https://confluence.dev.bbc.co.uk/pages/viewpage.action?pageId=123456789",
      costCentre: "S3823",
      url: "https://confluence.dev.bbc.co.uk/rest/calendar-services/1.0/calendar/events.json?subCalendarId=950d9966-d3b4-465e-aae2-d2f9cc023e42&userTimeZoneId=UTC&start=START&end=END",
    },
  ],
};

// Mocking a file
jest.mock("../../config/config.json", () => mockConfig, { virtual: true });

// Mocking a module
const { processCalendarEvents } = require("../processCalendarEvents");
jest.mock("../processCalendarEvents");
processCalendarEvents.mockResolvedValue({ timesheet: "timesheet" });

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

  test("calls fetch", async () => {
    await main();

    expect(fetch).toHaveBeenCalledTimes(2);

    expect(fetch.mock.calls[0][0]).toEqual(
      "https://www.gov.uk/bank-holidays.json"
    );

    expect(fetch.mock.calls[1][0]).toEqual(
      "https://confluence.dev.bbc.co.uk/rest/calendar-services/1.0/calendar/events.json?subCalendarId=950d9966-d3b4-465e-aae2-d2f9cc023e42&userTimeZoneId=UTC&start=2021-10-01T14:48:00Z&end=2021-11-01T14:48:00Z"
    );
  });

  test("processes calendar events", async () => {
    await main();

    expect(processCalendarEvents).toHaveBeenCalledTimes(1);
  });
});
