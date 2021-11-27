# Generate on-call timesheets

Small CLI tool to generate on-call timesheets, calculate stats etc.

- Specify date range
- Generates .xlsx timesheets including bankholidays
- Summarises rota counts etc.
- Works with multiple calendars, teams, departments etc.

## Setup confluence calendar

https://www.atlassian.com/software/confluence/team-calendars

Expects rotations to be sequential and non-overlapping. If you have multiple people on call at the same time you will probably get some strange results back.

## Calendar event endpoint

Find the calendar endpoint; I think I used browser network inspector for this e.g.
https://{confluence}/rest/calendar-services/1.0/calendar/events.json?subCalendarId={id}}&userTimeZoneId=UTC&start={start}&end={end}

Note: the date range is hardcoded at the moment and will need to be adjusted or parameterised in the code.

## Bank holidays

Checks bank holidays from https://www.gov.uk/bank-holidays.json

## Certs

Make sure your certs are discoverable by the https client e.g.

- /etc/pki/cosmos/current/client.crt
- /etc/pki/tls/certs/ca-bundle.crt

## Install

```bash
git clone git@github.com:bbc/on-call.git && cd ./on-call
yarn install
```

## Create config.json

The config.json will contain values for your departments, teams, charge code and Confluence calendar api endpoints etc. Supports multiple teams and calendars

```json
{
  "departments": [
    {
      "department": "<dept name",
      "teams": [
        {
          "team": "<team name>",
          "staff": [
            {
              "displayName": "<staff user id as displayed in the calendar>",
              "number": "<staff id>",
              "division": "<country(s) from https://www.gov.uk/bank-holidays.json>"
            }
          ],
          "calendarPage": "https://confluence/pages/viewpage.action?pageId=12345678",
          "costCentre": "<your team's charge code>",
          "teamCalendarAPI": "<jira calendar url>"
        },
        {
          "team": "<team name>",
          "staff": [
            {
              "displayName": "<staff user id as displayed in the calendar>",
              "number": "<staff id>",
              "division": "<country(s) from https://www.gov.uk/bank-holidays.json>"
            }
          ],
          "calendarPage": "https://confluence/pages/viewpage.action?pageId=12345678",
          "costCentre": "<your team's charge code>",
          "teamCalendarAPI": "<jira calendar url>"
        }
      ]
    }
  ]
}
```

## Run

```bash
node index.js
```

## Generate timesheets

Copy and paste the csv into the Summary Timesheet. You may need to copy and paste into the excel and then use the Data > Text to Columns option.

Alternatively Paste Special (^⌘v) and select "As: Text"

Or use the generated sheets
