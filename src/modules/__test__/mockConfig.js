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
}

module.exports = { mockConfig };