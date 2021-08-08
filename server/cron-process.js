const cron = require('node-cron');

import {
  triggerCronSetReminder
} from "./api/cron";

exports.setReminder = () => {

  //trigger evert 12:01 AM
  let task1 = cron.schedule('* */10 * * *', () => {
    console.log('trigger cron');

    task1.stop();

    triggerCronSetReminder();
  })
}