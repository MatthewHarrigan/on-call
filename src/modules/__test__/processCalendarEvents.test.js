const { processCalendarEvents } = require("../processCalendarEvents");

const {
  response: { events },
} = require("./mockEventsResponse.js");

const { bankHolidays } = require("./mockBankHolidaysResponse.js");

const {
  mockConfig: {
    departments:[
      {teams: [{ team, staff, costCentre }]},
    ]
  },
} = require("./mockConfig");

const { mockProcessedEvents } = require("./mockProcessedEvents");

const DEFAULT_TIMESHEET_SUBMISSION_CUTOFF = 15;

describe("processCalendarEvents", () => {
  test("it processes calendar events", () => {
    const processed = processCalendarEvents({
      bankHolidays,
      calendarEvents: events,
      costCentre,
      defaultsubmissionCutOff: DEFAULT_TIMESHEET_SUBMISSION_CUTOFF,
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
        defaultsubmissionCutOff: DEFAULT_TIMESHEET_SUBMISSION_CUTOFF,
        userStaffConfig: staff,
      });
    }).toThrow(
      "Unexpected staff member found in calendar - check config: Homer Simpson"
    );
  });
});
