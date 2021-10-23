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



const out = [
  {
    timesheet: "Mar-Apr",
    start: "2021-03-17T00:00:00.000Z",
    end: "2021-03-23T00:00:00.000Z",
    staffNumber: "524870J",
    name: "Todd Bonzalez",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Mar-Apr",
    start: "2021-03-24T00:00:00.000Z",
    end: "2021-03-30T00:00:00.000Z",
    staffNumber: "527770W",
    name: "Bobson Dugnutt",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Mar-Apr",
    start: "2021-03-31T00:00:00.000Z",
    end: "2021-04-06T00:00:00.000Z",
    staffNumber: "506352B",
    name: "Willie Dustice",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 2,
  },
  {
    timesheet: "Apr-May",
    start: "2021-04-07T00:00:00.000Z",
    end: "2021-04-13T00:00:00.000Z",
    staffNumber: "553398E",
    name: "Dorse O Hintline",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Apr-May",
    start: "2021-04-14T00:00:00.000Z",
    end: "2021-04-20T00:00:00.000Z",
    staffNumber: "524870J",
    name: "Todd Bonzalez",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Apr-May",
    start: "2021-04-21T00:00:00.000Z",
    end: "2021-04-27T00:00:00.000Z",
    staffNumber: "527770W",
    name: "Bobson Dugnutt",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Apr-May",
    start: "2021-04-28T00:00:00.000Z",
    end: "2021-05-04T00:00:00.000Z",
    staffNumber: "506352B",
    name: "Willie Dustice",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 1,
  },
  {
    timesheet: "May-Jun",
    start: "2021-05-05T00:00:00.000Z",
    end: "2021-05-11T00:00:00.000Z",
    staffNumber: "553398E",
    name: "Dorse O Hintline",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "May-Jun",
    start: "2021-05-12T00:00:00.000Z",
    end: "2021-05-12T00:00:00.000Z",
    staffNumber: "524870J",
    name: "Todd Bonzalez",
    cost: "S3823",
    weekdays: 1,
    weekends: 0,
    bankHols: 0,
  },
  {
    timesheet: "May-Jun",
    start: "2021-05-13T00:00:00.000Z",
    end: "2021-05-18T00:00:00.000Z",
    staffNumber: "506352B",
    name: "Willie Dustice",
    cost: "S3823",
    weekdays: 4,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "May-Jun",
    start: "2021-05-19T00:00:00.000Z",
    end: "2021-05-25T00:00:00.000Z",
    staffNumber: "527770W",
    name: "Bobson Dugnutt",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "May-Jun",
    start: "2021-05-26T00:00:00.000Z",
    end: "2021-06-01T00:00:00.000Z",
    staffNumber: "506352B",
    name: "Willie Dustice",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 1,
  },
  {
    timesheet: "Jun-Jul",
    start: "2021-06-02T00:00:00.000Z",
    end: "2021-06-08T00:00:00.000Z",
    staffNumber: "553398E",
    name: "Dorse O Hintline",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Jun-Jul",
    start: "2021-06-09T00:00:00.000Z",
    end: "2021-06-15T00:00:00.000Z",
    staffNumber: "524870J",
    name: "Todd Bonzalez",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Jun-Jul",
    start: "2021-06-16T00:00:00.000Z",
    end: "2021-06-22T00:00:00.000Z",
    staffNumber: "527770W",
    name: "Bobson Dugnutt",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Jun-Jul",
    start: "2021-06-23T00:00:00.000Z",
    end: "2021-06-29T00:00:00.000Z",
    staffNumber: "506352B",
    name: "Willie Dustice",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Jun-Jul",
    start: "2021-06-30T00:00:00.000Z",
    end: "2021-07-06T00:00:00.000Z",
    staffNumber: "553398E",
    name: "Dorse O Hintline",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Jul-Aug",
    start: "2021-07-07T00:00:00.000Z",
    end: "2021-07-13T00:00:00.000Z",
    staffNumber: "524870J",
    name: "Todd Bonzalez",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Jul-Aug",
    start: "2021-07-14T00:00:00.000Z",
    end: "2021-07-20T00:00:00.000Z",
    staffNumber: "527770W",
    name: "Bobson Dugnutt",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Jul-Aug",
    start: "2021-07-21T00:00:00.000Z",
    end: "2021-07-27T00:00:00.000Z",
    staffNumber: "506352B",
    name: "Willie Dustice",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Jul-Aug",
    start: "2021-07-28T00:00:00.000Z",
    end: "2021-08-03T00:00:00.000Z",
    staffNumber: "553398E",
    name: "Dorse O Hintline",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Aug-Sep",
    start: "2021-08-04T00:00:00.000Z",
    end: "2021-08-10T00:00:00.000Z",
    staffNumber: "527770W",
    name: "Bobson Dugnutt",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Aug-Sep",
    start: "2021-08-11T00:00:00.000Z",
    end: "2021-08-17T00:00:00.000Z",
    staffNumber: "506352B",
    name: "Willie Dustice",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Aug-Sep",
    start: "2021-08-18T00:00:00.000Z",
    end: "2021-08-24T00:00:00.000Z",
    staffNumber: "553398E",
    name: "Dorse O Hintline",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Aug-Sep",
    start: "2021-08-25T00:00:00.000Z",
    end: "2021-08-31T00:00:00.000Z",
    staffNumber: "527770W",
    name: "Bobson Dugnutt",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 1,
  },
  {
    timesheet: "Sep-Oct",
    start: "2021-09-01T00:00:00.000Z",
    end: "2021-09-07T00:00:00.000Z",
    staffNumber: "553398E",
    name: "Dorse O Hintline",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Sep-Oct",
    start: "2021-09-08T00:00:00.000Z",
    end: "2021-09-14T00:00:00.000Z",
    staffNumber: "527770W",
    name: "Bobson Dugnutt",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Sep-Oct",
    start: "2021-09-15T00:00:00.000Z",
    end: "2021-09-21T00:00:00.000Z",
    staffNumber: "506352B",
    name: "Willie Dustice",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Sep-Oct",
    start: "2021-09-22T00:00:00.000Z",
    end: "2021-09-28T00:00:00.000Z",
    staffNumber: "506352B",
    name: "Willie Dustice",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
  {
    timesheet: "Sep-Oct",
    start: "2021-09-29T00:00:00.000Z",
    end: "2021-10-05T00:00:00.000Z",
    staffNumber: "553398E",
    name: "Dorse O Hintline",
    cost: "S3823",
    weekdays: 5,
    weekends: 2,
    bankHols: 0,
  },
];


// Mocking a module
const { processCalendarEvents } = require("../processCalendarEvents");
jest.mock("../processCalendarEvents");
processCalendarEvents.mockReturnValue(out);


const {
  printCSV,
  summariseRotationsByTimesheet,
  totalRotations,
} = require("../utils");

jest.mock("../utils");


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

  test("calls processCalendarEvents", async () => {
    await main();
    expect(processCalendarEvents).toHaveBeenCalledTimes(1);
  });

  test("calls printCSV", async () => {
    await main();
    expect(printCSV).toHaveBeenCalledTimes(1);
  })

  test("summarises rotations by timesheet", async () => {
    await main();
    expect(summariseRotationsByTimesheet).toHaveBeenCalledTimes(1);
  })
});
