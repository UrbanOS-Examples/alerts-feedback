import * as Store from './store';
import * as redisMock from 'redis-mock';
import SpyInstance = jest.SpyInstance;

describe('Store', () => {
    let fakeConsole: SpyInstance;

    beforeEach(() => {
        fakeConsole = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        fakeConsole.mockRestore();
    });

    it('can retrieve', async () => {
        const redisClient = redisMock.createClient();
        redisClient.set('test', 'success');
        const value = await Store.getStoredValue('test');
        expect(value).toBe('success');
    });

    it('can store value', async () => {
        const key = 'make';
        const value = 'work';
        const success = await Store.storeValue(key, value);
        expect(success).toBe(true);
        const storedValue = await Store.getStoredValue(key);
        expect(storedValue).toBe(value);
    });

    it('returns false if cannot store value', async () => {
        const key: string = null;
        const value = 'work';
        const success = await Store.storeValue(key, value);
        expect(success).toBe(false);
    });

    it('can store values in list', async () => {
        const key = 'fruit';
        const firstValue = 'pomegranate';
        const secondValue = 'avocado';

        let success = await Store.storeValueInList(key, firstValue);
        expect(success).toBe(true);
        success = await Store.storeValueInList(key, secondValue);
        expect(success).toBe(true);

        const valuesInList = await Store.getValuesStoredInList(key);
        expect(valuesInList.length).toBe(2);
        expect(valuesInList).toContain(firstValue);
        expect(valuesInList).toContain(secondValue);
    });

    it('returns false if cannot store values in list', async () => {
        const key = 'pet';
        const firstValue = 'Hazel';
        const secondValue = 'Meloy';

        await Store.storeValue(key, firstValue);

        const success = await Store.storeValueInList(key, secondValue);
        expect(success).toBe(false);
    });

    it('gets all keys matching pattern', async () => {
        const keyPrefix = 'activity-';
        await Store.storeValueInList(keyPrefix + 'sport', 'calvinball');
        await Store.storeValueInList(keyPrefix + 'art', 'finger painting');
        await Store.storeValueInList('course', 'compsci 101');

        const keysMatchingPattern = await Store.getKeysByPattern(keyPrefix + '*');
        expect(keysMatchingPattern.length).toBe(2);
    });
});
