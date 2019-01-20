const createHTTPClient = require('./httpClient');
const getISOWeek = require('date-fns/get_iso_week')
const eachDay = require('date-fns/each_day')
const isWeekend = require('date-fns/is_weekend');
const format = require('date-fns/format');

const httpClient = createHTTPClient();

const print = async () => {
  const result = await httpClient.get('https://confluence.dev.bbc.co.uk/rest/calendar-services/1.0/calendar/events.json?subCalendarId=96d0cb5b-8641-4784-9e46-0f82221eed6d&userTimeZoneId=Europe%2FLondon&start=2018-10-10T00%3A00%3A00Z&end=2019-01-17T00%3A00%3A00Z&_=1547752399580');
  const { events } = result;
  events.forEach(e => {

    let week = getISOWeek(e.start);
    let weekendDays = 0;
    let weekDays = 0;
    let firstLine = '';

    eachDay(e.start, e.end).forEach(d => {

      // If new week
      if (getISOWeek(d) !== week) {
        firstLine = `<staffId>,${e.invitees[0].displayName},<costCode>,${getISOWeek(e.start)},On-call ${format(e.start, 'DD/MM/YYYY')},,,,,,,,,,,,${weekDays},${weekendDays}`;

        week = getISOWeek(d);
        weekendDays = 0;
        weekDays = 0;
      } 

      if (isWeekend(d)) {
        weekendDays += 1;
      } else {
        weekDays += 1;
      }
    });
    
    if (!firstLine) {
      console.log(`<staffId>,${e.invitees[0].displayName},<costCode>,${getISOWeek(e.start)},On-call ${format(e.start, 'DD/MM/YYYY')},,,,,,,,,,,,${weekDays},${weekendDays}`);
    } else {
      console.log(firstLine);
      console.log(`<staffId>,${e.invitees[0].displayName},<costCode>,${getISOWeek(e.end)},,,,,,,,,,,,${weekDays},${weekendDays}`);
    }

    // console.log(' ');

  });
}

print();
