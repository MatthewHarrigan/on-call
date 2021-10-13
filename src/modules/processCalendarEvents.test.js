const { processCalendarEvents } = require("./processCalendarEvents");

const {
  printCSV,
  printTimesheetSummaries,
  printTotals,
} = require("./printHelpers");

const {
  response: { events },
} = require("./mockEventsResponse.js");

const { bankHolidays } = require("./mockBankHolidaysResponse.js");

const { costCentre, staff } = require("./mockConfig.json");

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

describe("processCalendarEvents", () => {
  test("it processes calendar events", () => {
    const processed = processCalendarEvents(
      events,
      bankHolidays,
      staff,
      costCentre
    );
    expect(processed).toEqual(out);
  });
});

describe("printTotals", () => {
  test("it prints totals", () => {
    const totals = printTotals(events);

    const expected = [
      ["Willie Dustice", 9],
      ["Bobson Dugnutt", 8],
      ["dorse.o.hintline", 8],
      ["Todd Bonzalez", 5],
    ];

    expect(totals).toEqual(expected);
  });
});

describe("printTimesheetSummaries", () => {
  test("it prints Timesheet summary", () => {
    const processedCalendarEvents = processCalendarEvents(
      events,
      bankHolidays,
      staff,
      costCentre
    );

    const summary = printTimesheetSummaries(processedCalendarEvents);

    const expected = {
      "Mar-Apr": {
        "Todd Bonzalez": 1,
        "Bobson Dugnutt": 1,
        "Willie Dustice": 1,
      },
      "Apr-May": {
        "Dorse O Hintline": 1,
        "Todd Bonzalez": 1,
        "Bobson Dugnutt": 1,
        "Willie Dustice": 1,
      },
      "May-Jun": {
        "Dorse O Hintline": 1,
        "Todd Bonzalez": 1,
        "Willie Dustice": 2,
        "Bobson Dugnutt": 1,
      },
      "Jun-Jul": {
        "Dorse O Hintline": 2,
        "Todd Bonzalez": 1,
        "Bobson Dugnutt": 1,
        "Willie Dustice": 1,
      },
      "Jul-Aug": {
        "Todd Bonzalez": 1,
        "Bobson Dugnutt": 1,
        "Willie Dustice": 1,
        "Dorse O Hintline": 1,
      },
      "Aug-Sep": {
        "Bobson Dugnutt": 2,
        "Willie Dustice": 1,
        "Dorse O Hintline": 1,
      },
      "Sep-Oct": {
        "Dorse O Hintline": 2,
        "Bobson Dugnutt": 1,
        "Willie Dustice": 2,
      },
    };

    expect(summary).toEqual(expected);
  });
});

describe("printCSV", () => {
  test("it prints calendar events", () => {
    const processedCalendarEvents = processCalendarEvents(
      events,
      bankHolidays,
      staff,
      costCentre
    );

    const csv = printCSV(processedCalendarEvents, costCentre);

    const expectedCSV = `524870J,Todd Bonzalez,S3823,On-Call: 17/03/2021 - 23/03/2021,,,5,2,0
527770W,Bobson Dugnutt,S3823,On-Call: 24/03/2021 - 30/03/2021,,,5,2,0
506352B,Willie Dustice,S3823,On-Call: 31/03/2021 - 06/04/2021,,,5,2,2
553398E,Dorse O Hintline,S3823,On-Call: 07/04/2021 - 13/04/2021,,,5,2,0
524870J,Todd Bonzalez,S3823,On-Call: 14/04/2021 - 20/04/2021,,,5,2,0
527770W,Bobson Dugnutt,S3823,On-Call: 21/04/2021 - 27/04/2021,,,5,2,0
506352B,Willie Dustice,S3823,On-Call: 28/04/2021 - 04/05/2021,,,5,2,1
553398E,Dorse O Hintline,S3823,On-Call: 05/05/2021 - 11/05/2021,,,5,2,0
524870J,Todd Bonzalez,S3823,On-Call: 12/05/2021 - 12/05/2021,,,1,0,0
506352B,Willie Dustice,S3823,On-Call: 13/05/2021 - 18/05/2021,,,4,2,0
527770W,Bobson Dugnutt,S3823,On-Call: 19/05/2021 - 25/05/2021,,,5,2,0
506352B,Willie Dustice,S3823,On-Call: 26/05/2021 - 01/06/2021,,,5,2,1
553398E,Dorse O Hintline,S3823,On-Call: 02/06/2021 - 08/06/2021,,,5,2,0
524870J,Todd Bonzalez,S3823,On-Call: 09/06/2021 - 15/06/2021,,,5,2,0
527770W,Bobson Dugnutt,S3823,On-Call: 16/06/2021 - 22/06/2021,,,5,2,0
506352B,Willie Dustice,S3823,On-Call: 23/06/2021 - 29/06/2021,,,5,2,0
553398E,Dorse O Hintline,S3823,On-Call: 30/06/2021 - 06/07/2021,,,5,2,0
524870J,Todd Bonzalez,S3823,On-Call: 07/07/2021 - 13/07/2021,,,5,2,0
527770W,Bobson Dugnutt,S3823,On-Call: 14/07/2021 - 20/07/2021,,,5,2,0
506352B,Willie Dustice,S3823,On-Call: 21/07/2021 - 27/07/2021,,,5,2,0
553398E,Dorse O Hintline,S3823,On-Call: 28/07/2021 - 03/08/2021,,,5,2,0
527770W,Bobson Dugnutt,S3823,On-Call: 04/08/2021 - 10/08/2021,,,5,2,0
506352B,Willie Dustice,S3823,On-Call: 11/08/2021 - 17/08/2021,,,5,2,0
553398E,Dorse O Hintline,S3823,On-Call: 18/08/2021 - 24/08/2021,,,5,2,0
527770W,Bobson Dugnutt,S3823,On-Call: 25/08/2021 - 31/08/2021,,,5,2,1
553398E,Dorse O Hintline,S3823,On-Call: 01/09/2021 - 07/09/2021,,,5,2,0
527770W,Bobson Dugnutt,S3823,On-Call: 08/09/2021 - 14/09/2021,,,5,2,0
506352B,Willie Dustice,S3823,On-Call: 15/09/2021 - 21/09/2021,,,5,2,0
506352B,Willie Dustice,S3823,On-Call: 22/09/2021 - 28/09/2021,,,5,2,0
553398E,Dorse O Hintline,S3823,On-Call: 29/09/2021 - 05/10/2021,,,5,2,0`;

    expect(csv).toEqual(expectedCSV);
  });
});
