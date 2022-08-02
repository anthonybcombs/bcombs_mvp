const cron = require('node-cron');

import {
  triggerCronSetReminder,
  triggerCronUpdateChildIds
} from "./api/cron";

exports.setReminder = () => {
  console.log('SET REMINDER TRIGGER')
  //trigger evert 12:01 AM
  let task1 = cron.schedule('*/3 * * * *', () => {
    console.log('trigger cron');

    task1.stop();

    triggerCronSetReminder();
  })
}

exports.updateIds = () => {
  console.log('SET UPDATE IDS TRIGGER')
  let task1 = cron.schedule('*/3 * * * *', () => {
    console.log('trigger cron update child ids');

    task1.stop();

    triggerCronUpdateChildIds();
  })
}