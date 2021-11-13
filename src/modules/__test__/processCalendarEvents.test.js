const { processCalendarEvents } = require("../processCalendarEvents");

const {
  response: { events },
} = require("./mockEventsResponse.js");

const { bankHolidays } = require("./mockBankHolidaysResponse.js");

const {
  mockConfig: {
    teams: [{ staff, costCentre }],
  },
} = require("./mockConfig");

const { mockProcessedEvents } = require("./mockProcessedEvents");

const DEFAULT_PAYDAY_OF_MONTH = 15;

describe("processCalendarEvents", () => {
  test("it processes calendar events", () => {
    const processed = processCalendarEvents({
      bankHolidays,
      calendarEvents: events,
      costCentre,
      defaultPayDay: DEFAULT_PAYDAY_OF_MONTH,
      userStaffConfig: staff,
    });

    expect(processed).toEqual(mockProcessedEvents);
  });

  test("it errors if unexpected user in response", () => {
    const {
      response: { events },
    } = require("./mockEventsResponseWithUnexpectedUser.js");

    expect(() => {
      processCalendarEvents({
        bankHolidays,
        calendarEvents: events,
        costCentre,
        defaultPayDay: DEFAULT_PAYDAY_OF_MONTH,
        userStaffConfig: staff,
      });
    }).toThrow(
      "Unexpected staff member found in calendar - check config: Homer Simpson"
    );
  });
});
