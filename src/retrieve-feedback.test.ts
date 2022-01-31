import {allAlerts} from "./retrieve-feedback";
import * as Store from './store';
import * as Locator from "./locator";
import SpyInstance = jest.SpyInstance;
import each from "jest-each";
import {Location} from "./locator";
import {Alert} from "./models/alert";
import {FeedbackAlert} from "./models/feedback-alert";

describe('retrieveFeedback', () => {
    let mockGetKeysByPattern: SpyInstance;
    let mockGetValuesStoredInList: SpyInstance;
    let mockGetStoredValue: SpyInstance;
    let mockFindLocation: SpyInstance;

  beforeEach(() => {
    mockGetKeysByPattern = jest.spyOn(Store, 'getKeysByPattern').mockImplementation();
    mockGetValuesStoredInList = jest.spyOn(Store, 'getValuesStoredInList').mockImplementation();
    mockGetStoredValue = jest.spyOn(Store, 'getStoredValue').mockImplementation();
    mockFindLocation = jest.spyOn(Locator, "findLocation").mockImplementation();
  });

  afterEach(() => {
    mockGetKeysByPattern.mockRestore();
    mockGetValuesStoredInList.mockRestore();
    mockGetStoredValue.mockRestore();
    mockFindLocation.mockRestore();
  });

  it('returns FeedbackAlert objects for all alerts', async () => {
    const originalAlert: Alert = {
      id: 'abc-123',
      type: 'some type',
      severity: 'severe!',
      time: 'now:o:clock',
      coordinates: {
        latitude: 40,
        longitude: 50
      },
      location: 'chicago new york detroit',
      status: 'truckin',
      speed: 42,
      avgSpeed: 55,
      refSpeed: 54,
      camera: 'TERRAPIN STATION'
    };
    const expectedFeedbackAlert: FeedbackAlert = {
      id: originalAlert.id,
      type: originalAlert.type,
      severity: originalAlert.severity,
      time: originalAlert.time,
      latitude: originalAlert.coordinates.latitude,
      longitude: originalAlert.coordinates.longitude,
      location: originalAlert.location,
      status: originalAlert.status,
      speed: originalAlert.speed,
      avgSpeed: originalAlert.avgSpeed,
      refSpeed: originalAlert.refSpeed,
      camera: originalAlert.camera,
      functionalClass: '4',
      isCongestion: true
    };
    mockGetKeysByPattern.mockResolvedValue(['alert-key','alert-key','alert-key']);
    mockGetStoredValue.mockResolvedValue(JSON.stringify(originalAlert));
    mockFindLocation.mockReturnValue(new Locator.Location('', '', 0, 0, expectedFeedbackAlert.functionalClass));
    mockGetValuesStoredInList.mockResolvedValue([`${expectedFeedbackAlert.isCongestion}`]);

    const feedbackAlerts = await allAlerts();

    expect(feedbackAlerts.length).toBe(3);
    expect(feedbackAlerts[0]).toStrictEqual(expectedFeedbackAlert);
    expect(feedbackAlerts[1]).toStrictEqual(expectedFeedbackAlert);
    expect(feedbackAlerts[2]).toStrictEqual(expectedFeedbackAlert);
  });

  each([
    [['false'], false],
    [['false', 'true'], true],
    [[], null]
  ]).it('assigns feedback appropriately', async (feedbackForAlert: string[], expectedFeedback: boolean) => {
    mockGetKeysByPattern.mockResolvedValue(['alert-key']);
    mockGetStoredValue.mockResolvedValue(JSON.stringify({id: 'abc-123', coordinates: {}}));
    mockFindLocation.mockReturnValue(new Location('', '', 0, 0, ''));
    mockGetValuesStoredInList.mockResolvedValue(feedbackForAlert);

    const feedbackAlerts = await allAlerts();

    expect(feedbackAlerts.length).toBe(1);
    expect(feedbackAlerts[0].isCongestion).toBe(expectedFeedback);
  });

  it('latitude and longitude are null if no coordinates on alert', async () => {
    mockGetKeysByPattern.mockResolvedValue(['alert-key']);
    mockGetStoredValue.mockResolvedValue(JSON.stringify({id: 'abc-123', coordinates: null}));
    mockFindLocation.mockReturnValue(new Location('', '', 0, 0, ''));
    mockGetValuesStoredInList.mockResolvedValue([]);

    const feedbackAlerts = await allAlerts();

    expect(feedbackAlerts.length).toBe(1);
    expect(feedbackAlerts[0].latitude).toBe(undefined);
    expect(feedbackAlerts[0].longitude).toBe(undefined);
  });
});
