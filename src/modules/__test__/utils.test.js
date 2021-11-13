const { processCalendarEvents } = require("../processCalendarEvents");

const {
  printCSV,
  summariseRotationsByTimesheet,
  totalRotations,
  getPayDate,
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

const DEFAULT_PAYDAY_OF_MONTH = 15;

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
      {
        bankHolidays,
        calendarEvents: events,
        costCentre,
        defaultPayDay: DEFAULT_PAYDAY_OF_MONTH,
        userStaffConfig: staff,
      }
    );

    const summary = summariseRotationsByTimesheet(processedCalendarEvents);

    const expected = {
      "Mar-Apr": {
        "Todd Bonzalez": 1,
        "Bobson Dugnutt": 1,
        "Willie Dustice": 1,
        "Dorse O Hintline": 1,
      },
      "Apr-May": {
        "Todd Bonzalez": 2,
        "Bobson Dugnutt": 1,
        "Willie Dustice": 1,
        "Dorse O Hintline": 1,
      },
      "May-Jun": {
        "Willie Dustice": 2,
        "Bobson Dugnutt": 1,
        "Dorse O Hintline": 1,
      },
      "Jun-Jul": {
        "Todd Bonzalez": 2,
        "Bobson Dugnutt": 1,
        "Willie Dustice": 1,
        "Dorse O Hintline": 1,
      },
      "Jul-Aug": {
        "Bobson Dugnutt": 2,
        "Willie Dustice": 1,
        "Dorse O Hintline": 1,
      },
      "Aug-Sept": {
        "Willie Dustice": 1,
        "Dorse O Hintline": 2,
        "Bobson Dugnutt": 2,
      },
      "Sept-Oct": { "Willie Dustice": 2, "Dorse O Hintline": 1 },
    };
    expect(summary).toEqual(expected);
  });
});

describe("printCSV", () => {
  test("it prints calendar events", () => {
    const processedCalendarEvents = processCalendarEvents(
      {
        bankHolidays,
        calendarEvents: events,
        costCentre,
        defaultPayDay: DEFAULT_PAYDAY_OF_MONTH,
        userStaffConfig: staff,
      }
    );

    const csv = printCSV(processedCalendarEvents, costCentre);

    const expectedCSV = `555555A,Todd Bonzalez,S1234,On-Call: 17/03/2021 - 23/03/2021,,,5,2,0
555555B,Bobson Dugnutt,S1234,On-Call: 24/03/2021 - 30/03/2021,,,5,2,0
555555C,Willie Dustice,S1234,On-Call: 31/03/2021 - 06/04/2021,,,5,2,2
555555D,Dorse O Hintline,S1234,On-Call: 07/04/2021 - 13/04/2021,,,5,2,0
555555A,Todd Bonzalez,S1234,On-Call: 14/04/2021 - 20/04/2021,,,5,2,0
555555B,Bobson Dugnutt,S1234,On-Call: 21/04/2021 - 27/04/2021,,,5,2,0
555555C,Willie Dustice,S1234,On-Call: 28/04/2021 - 04/05/2021,,,5,2,1
555555D,Dorse O Hintline,S1234,On-Call: 05/05/2021 - 11/05/2021,,,5,2,0
555555A,Todd Bonzalez,S1234,On-Call: 12/05/2021 - 12/05/2021,,,1,0,0
555555C,Willie Dustice,S1234,On-Call: 13/05/2021 - 18/05/2021,,,4,2,0
555555B,Bobson Dugnutt,S1234,On-Call: 19/05/2021 - 25/05/2021,,,5,2,0
555555C,Willie Dustice,S1234,On-Call: 26/05/2021 - 01/06/2021,,,5,2,1
555555D,Dorse O Hintline,S1234,On-Call: 02/06/2021 - 08/06/2021,,,5,2,0
555555A,Todd Bonzalez,S1234,On-Call: 09/06/2021 - 15/06/2021,,,5,2,0
555555B,Bobson Dugnutt,S1234,On-Call: 16/06/2021 - 22/06/2021,,,5,2,0
555555C,Willie Dustice,S1234,On-Call: 23/06/2021 - 29/06/2021,,,5,2,0
555555D,Dorse O Hintline,S1234,On-Call: 30/06/2021 - 06/07/2021,,,5,2,0
555555A,Todd Bonzalez,S1234,On-Call: 07/07/2021 - 13/07/2021,,,5,2,0
555555B,Bobson Dugnutt,S1234,On-Call: 14/07/2021 - 20/07/2021,,,5,2,0
555555C,Willie Dustice,S1234,On-Call: 21/07/2021 - 27/07/2021,,,5,2,0
555555D,Dorse O Hintline,S1234,On-Call: 28/07/2021 - 03/08/2021,,,5,2,0
555555B,Bobson Dugnutt,S1234,On-Call: 04/08/2021 - 10/08/2021,,,5,2,0
555555C,Willie Dustice,S1234,On-Call: 11/08/2021 - 17/08/2021,,,5,2,0
555555D,Dorse O Hintline,S1234,On-Call: 18/08/2021 - 24/08/2021,,,5,2,0
555555B,Bobson Dugnutt,S1234,On-Call: 25/08/2021 - 31/08/2021,,,5,2,1
555555D,Dorse O Hintline,S1234,On-Call: 01/09/2021 - 07/09/2021,,,5,2,0
555555B,Bobson Dugnutt,S1234,On-Call: 08/09/2021 - 14/09/2021,,,5,2,0
555555C,Willie Dustice,S1234,On-Call: 15/09/2021 - 21/09/2021,,,5,2,0
555555C,Willie Dustice,S1234,On-Call: 22/09/2021 - 28/09/2021,,,5,2,0
555555D,Dorse O Hintline,S1234,On-Call: 29/09/2021 - 05/10/2021,,,5,2,0`;

    expect(csv).toEqual(expectedCSV);
  });
});
