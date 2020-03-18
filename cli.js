#!/usr/bin/env node
var argv = require('yargs')
    .usage('Usage: $0 -start [date] -end [date]')
    .demandOption(['start','end'])
    .argv;

console.log('The start/end  ', argv.start, argv.end);
