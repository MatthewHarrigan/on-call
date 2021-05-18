# Generate On-call-timesheet csv

Reads Confluence team calendar via the Confluence API and outputs CSV to copypaste into timesheet

## Setup confluence calendar
https://www.atlassian.com/software/confluence/team-calendars
i.e. https://confluence.dev.bbc.co.uk/pages/viewpage.action?pageId=190673180

## Calendar event endpoint
Find the calendar endpoint; I think I used browser network inspector for this
https://confluence.dev.bbc.co.uk/rest/calendar-services/1.0/calendar/events.json?subCalendarId=ad37c355-3d91-4e31-ac83-de8dbf03cf92&userTimeZoneId=UTC&start=2019-07-27T00%3A00%3A00Z&end=2019-11-08T23%3A00%3A00Z&_=1566220152786

Note: the date range is hardcoded at the moment and will need to be adjusted or parameterised in the code.

## Bank holidays
Checks for bank holidays from https://www.gov.uk/bank-holidays.json

## Certs

Make sure your certs are discoverable by the https client

* /etc/pki/cloud-ca.pem
* /etc/pki/cosmos/current/client.crt
* /etc/pki/tls/certs/ca-bundle.crt

## Clone repo
```bash
git clone git@github.com:bbc/on-call.git && cd ./on-call
```

## NPM install

```bash
npm i
```

## Create config.json 
The config.json will contain values for your team: staff, charge code and Confluence calendar api endpoint.

```json
{
    "staff": [
        {
            "displayName" : "<staff user id as displayed in the calendar>",
            "number" : "<staff id>",
            "division" : "<country(s) from https://www.gov.uk/bank-holidays.json>"
        }
    ],
    "costCentre": "<your team's charge code>",
    "url": "<jira calendar url>"
}

```

## Run

```bash
node index.js
```

## Copy and paste
Copy and paste the csv into the Summary Timesheet. You may need to copy and paste into the excel and then use the Data > Text to Columns option.

Alternatively Paste Special (^⌘v) and select "As: Text"
