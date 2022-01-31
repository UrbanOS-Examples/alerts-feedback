import {findLocation} from './locator';
import mock from "mock-fs";

describe('Locator', () => {
    beforeEach(() => {
      const locationFileContents = `[
          {
            "code": "1111111",
            "fclass": "3",
            "lat": 39.95100068158972,
            "lon": -83.15704970746185,
            "name": "SOMEWHERE RD"
          }]`;
      mock({
        'src/locations.json': locationFileContents,
      });
    });
    afterEach(() => {
      mock.restore();
    });

    it('returns empty object when no location match', () => {
      const latitude = 0;
      const longitude = 0;
      const location = findLocation(latitude,longitude);
        expect(location).not.toBeUndefined();
        expect(location.code).toEqual(undefined);
        expect(location.name).toEqual(undefined);
        expect(location.lat).toEqual(latitude);
        expect(location.lon).toEqual(longitude);
        expect(location.fclass).toEqual(undefined);
    });

    it('finds a location from latitude and longitude', () => {
        const latitude = 39.95100068158972;
        const longitude = -83.15704970746185;

        const location = findLocation(latitude, longitude);
        expect(location.code).toEqual('1111111');
        expect(location.name).toEqual('SOMEWHERE RD');
        expect(location.fclass).toEqual('3');
    });
});
