import {allAlerts} from '../retrieve-feedback';

allAlerts()
  .then((alerts: object[]) => {
    console.log(alerts);
    console.log('Total alerts with feedback: ' + alerts.length);
  });
