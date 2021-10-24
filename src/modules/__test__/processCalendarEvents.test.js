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

const { mockProcessedEvents } = require('./mockProcessedEvents');

describe("processCalendarEvents", () => {
  test("it processes calendar events", () => {
    const processed = processCalendarEvents(
      events,
      bankHolidays,
      staff,
      costCentre
    );
    expect(processed).toEqual(mockProcessedEvents);
  });
  // test("it errors if unexpected user in response", () => {
  //   const {
  //     response: { events },
  //   } = require("./mockEventsResponseWithUnexpectedUser.js");

  //   const processed = processCalendarEvents(
  //     events,
  //     bankHolidays,
  //     staff,
  //     costCentre
  //   );
  // });
});
