# Generate On-call timesheet csv

Reads Confluence team calendar via the Confluence API and outputs CSV to copypaste into timesheet

## Setup confluence calendar

https://www.atlassian.com/software/confluence/team-calendars
i.e. https://confluence.dev.bbc.co.uk/pages/viewpage.action?pageId=190673180

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

The config.json will contain values for your team: staff, charge code and Confluence calendar api endpoint. Supports multiple teams and calendars

```json
{
  "teams": [
    {
      "team": "<team name>",
      "staff": [
        {
            "displayName" : "<staff user id as displayed in the calendar>",
            "number" : "<staff id>",
            "division" : "<country(s) from https://www.gov.uk/bank-holidays.json>"
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
            "displayName" : "<staff user id as displayed in the calendar>",
            "number" : "<staff id>",
            "division" : "<country(s) from https://www.gov.uk/bank-holidays.json>"
        }
    ],
      "calendarPage": "https://confluence/pages/viewpage.action?pageId=12345678",
      "costCentre": "<your team's charge code>",
      "teamCalendarAPI": "<jira calendar url>"
    }
  ]
}


```

## Run

```bash
node index.js
```

## Copy and paste

Copy and paste the csv into the Summary Timesheet. You may need to copy and paste into the excel and then use the Data > Text to Columns option.

Alternatively Paste Special (^⌘v) and select "As: Text"
