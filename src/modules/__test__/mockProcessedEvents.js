
const mockProcessedEvents = [
  {
    start: '2021-03-17T00:00:00.000Z',
    end: '2021-03-23T00:00:00.000Z',
    timesheet: 'Mar-2021 Apr-2021',
    staffNumber: '555555A',
    name: 'Todd Bonzalez',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-03-24T00:00:00.000Z',
    end: '2021-03-30T00:00:00.000Z',
    timesheet: 'Mar-2021 Apr-2021',
    staffNumber: '555555B',
    name: 'Bobson Dugnutt',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-03-31T00:00:00.000Z',
    end: '2021-04-06T00:00:00.000Z',
    timesheet: 'Mar-2021 Apr-2021',
    staffNumber: '555555C',
    name: 'Willie Dustice',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 2
  },
  {
    start: '2021-04-07T00:00:00.000Z',
    end: '2021-04-13T00:00:00.000Z',
    timesheet: 'Mar-2021 Apr-2021',
    staffNumber: '555555D',
    name: 'Dorse O Hintline',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-04-14T00:00:00.000Z',
    end: '2021-04-20T00:00:00.000Z',
    timesheet: 'Apr-2021 May-2021',
    staffNumber: '555555A',
    name: 'Todd Bonzalez',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-04-21T00:00:00.000Z',
    end: '2021-04-27T00:00:00.000Z',
    timesheet: 'Apr-2021 May-2021',
    staffNumber: '555555B',
    name: 'Bobson Dugnutt',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-04-28T00:00:00.000Z',
    end: '2021-05-04T00:00:00.000Z',
    timesheet: 'Apr-2021 May-2021',
    staffNumber: '555555C',
    name: 'Willie Dustice',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 1
  },
  {
    start: '2021-05-05T00:00:00.000Z',
    end: '2021-05-11T00:00:00.000Z',
    timesheet: 'Apr-2021 May-2021',
    staffNumber: '555555D',
    name: 'Dorse O Hintline',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-05-12T00:00:00.000Z',
    end: '2021-05-12T00:00:00.000Z',
    timesheet: 'Apr-2021 May-2021',
    staffNumber: '555555A',
    name: 'Todd Bonzalez',
    cost: 'S1234',
    weekdays: 1,
    weekends: 0,
    bankHols: 0
  },
  {
    start: '2021-05-13T00:00:00.000Z',
    end: '2021-05-18T00:00:00.000Z',
    timesheet: 'May-2021 Jun-2021',
    staffNumber: '555555C',
    name: 'Willie Dustice',
    cost: 'S1234',
    weekdays: 4,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-05-19T00:00:00.000Z',
    end: '2021-05-25T00:00:00.000Z',
    timesheet: 'May-2021 Jun-2021',
    staffNumber: '555555B',
    name: 'Bobson Dugnutt',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-05-26T00:00:00.000Z',
    end: '2021-06-01T00:00:00.000Z',
    timesheet: 'May-2021 Jun-2021',
    staffNumber: '555555C',
    name: 'Willie Dustice',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 1
  },
  {
    start: '2021-06-02T00:00:00.000Z',
    end: '2021-06-08T00:00:00.000Z',
    timesheet: 'May-2021 Jun-2021',
    staffNumber: '555555D',
    name: 'Dorse O Hintline',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-06-09T00:00:00.000Z',
    end: '2021-06-15T00:00:00.000Z',
    timesheet: 'Jun-2021 Jul-2021',
    staffNumber: '555555A',
    name: 'Todd Bonzalez',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-06-16T00:00:00.000Z',
    end: '2021-06-22T00:00:00.000Z',
    timesheet: 'Jun-2021 Jul-2021',
    staffNumber: '555555B',
    name: 'Bobson Dugnutt',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-06-23T00:00:00.000Z',
    end: '2021-06-29T00:00:00.000Z',
    timesheet: 'Jun-2021 Jul-2021',
    staffNumber: '555555C',
    name: 'Willie Dustice',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-06-30T00:00:00.000Z',
    end: '2021-07-06T00:00:00.000Z',
    timesheet: 'Jun-2021 Jul-2021',
    staffNumber: '555555D',
    name: 'Dorse O Hintline',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-07-07T00:00:00.000Z',
    end: '2021-07-13T00:00:00.000Z',
    timesheet: 'Jun-2021 Jul-2021',
    staffNumber: '555555A',
    name: 'Todd Bonzalez',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-07-14T00:00:00.000Z',
    end: '2021-07-20T00:00:00.000Z',
    timesheet: 'Jul-2021 Aug-2021',
    staffNumber: '555555B',
    name: 'Bobson Dugnutt',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-07-21T00:00:00.000Z',
    end: '2021-07-27T00:00:00.000Z',
    timesheet: 'Jul-2021 Aug-2021',
    staffNumber: '555555C',
    name: 'Willie Dustice',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-07-28T00:00:00.000Z',
    end: '2021-08-03T00:00:00.000Z',
    timesheet: 'Jul-2021 Aug-2021',
    staffNumber: '555555D',
    name: 'Dorse O Hintline',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-08-04T00:00:00.000Z',
    end: '2021-08-10T00:00:00.000Z',
    timesheet: 'Jul-2021 Aug-2021',
    staffNumber: '555555B',
    name: 'Bobson Dugnutt',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-08-11T00:00:00.000Z',
    end: '2021-08-17T00:00:00.000Z',
    timesheet: 'Aug-2021 Sept-2021',
    staffNumber: '555555C',
    name: 'Willie Dustice',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-08-18T00:00:00.000Z',
    end: '2021-08-24T00:00:00.000Z',
    timesheet: 'Aug-2021 Sept-2021',
    staffNumber: '555555D',
    name: 'Dorse O Hintline',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-08-25T00:00:00.000Z',
    end: '2021-08-31T00:00:00.000Z',
    timesheet: 'Aug-2021 Sept-2021',
    staffNumber: '555555B',
    name: 'Bobson Dugnutt',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 1
  },
  {
    start: '2021-09-01T00:00:00.000Z',
    end: '2021-09-07T00:00:00.000Z',
    timesheet: 'Aug-2021 Sept-2021',
    staffNumber: '555555D',
    name: 'Dorse O Hintline',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-09-08T00:00:00.000Z',
    end: '2021-09-14T00:00:00.000Z',
    timesheet: 'Aug-2021 Sept-2021',
    staffNumber: '555555B',
    name: 'Bobson Dugnutt',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-09-15T00:00:00.000Z',
    end: '2021-09-21T00:00:00.000Z',
    timesheet: 'Sept-2021 Oct-2021',
    staffNumber: '555555C',
    name: 'Willie Dustice',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-09-22T00:00:00.000Z',
    end: '2021-09-28T00:00:00.000Z',
    timesheet: 'Sept-2021 Oct-2021',
    staffNumber: '555555C',
    name: 'Willie Dustice',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  },
  {
    start: '2021-09-29T00:00:00.000Z',
    end: '2021-10-05T00:00:00.000Z',
    timesheet: 'Sept-2021 Oct-2021',
    staffNumber: '555555D',
    name: 'Dorse O Hintline',
    cost: 'S1234',
    weekdays: 5,
    weekends: 2,
    bankHols: 0
  }
];

module.exports = { mockProcessedEvents }
