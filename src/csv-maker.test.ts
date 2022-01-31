import {generateFeedbackCsv} from "./csv-maker";
import * as RetrieveFeedback from "./retrieve-feedback";
import {FeedbackAlert} from "./models/feedback-alert";

describe('csv-maker', () => {
    it('can make a CSV from alerts', async () => {
      const alert1: FeedbackAlert = {
        id: 'some-alert-id',
        type: 'type',
        severity: 'severity',
        time: 'time',
        latitude: 17,
        longitude: 29,
        location: 'location',
        status: 'status',
        speed: 5,
        avgSpeed: 10,
        refSpeed: 15,
        camera: 'camera',
        isCongestion: true,
        functionalClass: '3'
      };

      const alert2: FeedbackAlert = {
        id: 'another-alert-id',
        type: '',
        severity: '',
        time: '',
        latitude: undefined,
        longitude: undefined,
        location: '',
        status: '',
        speed: 50,
        avgSpeed: 55,
        refSpeed: 60,
        camera: null,
        isCongestion: false,
        functionalClass: '5'
      };
      const EMPTY_SPACE = '';

      const dataRow1 = `"${alert1.id}","${alert1.type}","${alert1.severity}","${alert1.time}",${alert1.latitude},${alert1.longitude},"${alert1.location}","${alert1.status}",${alert1.speed},${alert1.avgSpeed},${alert1.refSpeed},"${alert1.camera}","${alert1.functionalClass}",${alert1.isCongestion}`;
      const dataRow2 = `"${alert2.id}","${alert2.type}","${alert2.severity}","${alert2.time}",${EMPTY_SPACE},${EMPTY_SPACE},"${alert2.location}","${alert2.status}",${alert2.speed},${alert2.avgSpeed},${alert2.refSpeed},${EMPTY_SPACE},"${alert2.functionalClass}",${alert2.isCongestion}`;


      const allAlertsMock = jest.spyOn(RetrieveFeedback, 'allAlerts').mockImplementation();
      allAlertsMock.mockResolvedValue([alert1, alert2]);

      const headerRow = '"id","type","severity","time","latitude","longitude","location","status","speed","avgSpeed","refSpeed","camera","functionalClass","isCongestion"';
      const expectedCsv = `${headerRow}\n${dataRow1}\n${dataRow2}`;

      const actualCsv = await generateFeedbackCsv();
      expect(actualCsv).toEqual(expectedCsv);
    });
});
