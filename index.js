const createHTTPClient = require('./httpClient');
const getISOWeek = require('date-fns/get_iso_week')
const eachDay = require('date-fns/each_day')
const isWeekend = require('date-fns/is_weekend');
const format = require('date-fns/format');

const httpClient = createHTTPClient();

const staff = {
  'Abrar Khan':'445694Y',
  'Adam.Roberts':'539192Y',
  'Duncan McDonald':'512089T',
  'James.Tosh':'524870J',
  'Julien Mazé':'529163L',
  'Matthew Harrigan':'506352B',
  'Marcus.Hobson':'547599L',
  'jack.o.stevenson':'553398E'
};

const url = 'https://confluence.dev.bbc.co.uk/rest/calendar-services/1.0/calendar/events.json?subCalendarId=ad37c355-3d91-4e31-ac83-de8dbf03cf92&userTimeZoneId=UTC&start=2019-07-27T00%3A00%3A00Z&end=2019-11-08T23%3A00%3A00Z&_=1566220152786';
  // const calendarApi = await httpClient.get('https://confluence.dev.bbc.co.uk/rest/calendar-services/1.0/calendar/events.json?subCalendarId=96d0cb5b-8641-4784-9e46-0f82221eed6d&userTimeZoneId=Europe%2FLondon&start=2019-06-14T00%3A00%3A00Z&end=2019-08-20T00%3A00%3A00Z&_=1547752399580');

const chargeCode = 'S3823';

const run = async () => {

  let str = '';
  const { events } = await httpClient.get(url);

  for (const event of events) {
    for (const day of eachDay(event.start, event.end)) {
      str += `,${staff[event.invitees[0].displayName]},${event.invitees[0].displayName},${chargeCode},${getISOWeek(day)},On-call: ${format(day, 'DD/MM/YYYY')},,,,,,,,,,,,,${+ !isWeekend(day)},${+ isWeekend(day)}\n`;
    }
  }

  console.log(str)
}

run();
