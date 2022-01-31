import * as fs from 'fs';

export class Location {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly lat: number,
        public readonly lon: number,
        public readonly fclass: string,
    ) {}
}
let locations: Location[];

function readLocationData() {
    if (locations === undefined) {
        const rawFile = fs.readFileSync('src/locations.json').toString();
        locations = JSON.parse(rawFile) as Location[];
    }
}

function locationOrEmptyObject(location: Location, latitude: number, longitude: number) {
    if (location === undefined) {
        return new Location(undefined, undefined, latitude, longitude, undefined);
    }
    return location;
}

export function findLocation(latitude: number, longitude: number): Location {
    readLocationData();
    const location = locations.find((data) => data.lat === latitude && data.lon === longitude);
    return locationOrEmptyObject(location, latitude, longitude);
}
