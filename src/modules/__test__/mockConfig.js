const mockConfig = {
  teams: [
    {
      team: "FoodThree",
      staff: [
        {
          displayName: "Todd Bonzalez",
          number: "555555A",
          division: "england-and-wales",
        },
        {
          displayName: "Willie Dustice",
          number: "555555C",
          division: "england-and-wales",
        },
        {
          displayName: "Bobson Dugnutt",
          number: "555555B",
          division: "england-and-wales",
        },
        {
          displayName: "dorse.o.hintline",
          number: "555555D",
          division: "england-and-wales",
        },
      ],
      calendarPage:
        "https://confluence/pages/viewpage.action?pageId=123456789",
      costCentre: "S1234",
      teamCalendarAPI: "https://confluence/rest/calendar-services/1.0/calendar/events.json?subCalendarId=950d9966-d3b4-465e-aae2-d2f9cc023e42&userTimeZoneId=UTC&start=START&end=END",
    },
  ],
}

module.exports = { mockConfig };
