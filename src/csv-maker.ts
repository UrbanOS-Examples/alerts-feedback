import {Parser} from "json2csv";
import {allAlerts} from "./retrieve-feedback";

export async function generateFeedbackCsv(): Promise<string> {
  const alerts = await allAlerts();

  const fields = [
    'id',
    'type',
    'severity',
    'time',
    'latitude',
    'longitude',
    'location',
    'status',
    'speed',
    'avgSpeed',
    'refSpeed',
    'camera',
    'functionalClass',
    'isCongestion',
  ];
  const json2csv = new Parser({fields});

  return json2csv.parse(alerts);
}
