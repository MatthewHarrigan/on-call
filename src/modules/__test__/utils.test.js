const { processCalendarEvents } = require("../processCalendarEvents");

const {
  printCSV,
  summariseRotationsByTimesheet,
  totalRotations,
} = require("../utils");

const {
  response: { events },
} = require("./mockEventsResponse.js");

const { bankHolidays } = require("./mockBankHolidaysResponse.js");

const {
  mockConfig: {
    teams: [{ staff, costCentre }],
  },
} = require("./mockConfig");

describe("totalRotations", () => {
  test("it prints totals", () => {
    const totals = totalRotations(events);

    const expected = [
      ["Willie Dustice", 9],
      ["Bobson Dugnutt", 8],
      ["dorse.o.hintline", 8],
      ["Todd Bonzalez", 5],
    ];

    expect(totals).toEqual(expected);
  });
});

describe("summariseRotationsByTimesheet", () => {
  test("it prints Timesheet summary", () => {
    const processedCalendarEvents = processCalendarEvents(
      events,
      bankHolidays,
      staff,
      costCentre
    );

    const summary = summariseRotationsByTimesheet(processedCalendarEvents);

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
