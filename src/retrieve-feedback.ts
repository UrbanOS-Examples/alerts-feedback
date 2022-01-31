import {getKeysByPattern, getStoredValue, getValuesStoredInList} from './store';
import {findLocation} from "./locator";
import {FeedbackAlert} from "./models/feedback-alert";
import {Alert} from "./models/alert";


export async function allAlerts(): Promise<FeedbackAlert[]> {
  const alertKeys = await getKeysByPattern('alert-*');
  const alerts: FeedbackAlert[] = [];
  for (const key of alertKeys) {
    const alert = JSON.parse(await getStoredValue(key));
    const feedbackAlert: FeedbackAlert = await buildFeedbackAlert(alert, key);
    alerts.push(feedbackAlert);
  }
  return alerts;
}

async function buildFeedbackAlert(alert: Alert, key: string): Promise<FeedbackAlert> {
  const feedbackAlert: FeedbackAlert = {
    id: alert.id,
    type: alert.type,
    severity: alert.severity,
    time: alert.time,
    latitude: alert.coordinates?.latitude,
    longitude: alert.coordinates?.longitude,
    location: alert.location,
    status: alert.status,
    speed: alert.speed,
    avgSpeed: alert.avgSpeed,
    refSpeed: alert.refSpeed,
    camera: alert.camera
  };

  feedbackAlert.functionalClass = findLocation(feedbackAlert.latitude, feedbackAlert.longitude).fclass;

  const idFromAlertKey = key.substring('alert-'.length);
  const feedbackValues = await getValuesStoredInList(`feedback-${idFromAlertKey}`);
  if (feedbackValues.length == 0) {
    feedbackAlert.isCongestion = null;
  } else {
    feedbackAlert.isCongestion = feedbackValues.some(feedback => feedback === 'true');
  }

  return feedbackAlert;
}
