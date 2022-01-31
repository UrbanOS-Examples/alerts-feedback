import app from './app';
import supertest from 'supertest';
import * as Store from './store';
import * as CsvMaker from './csv-maker';

describe('Application', () => {
    it('GET - Healthcheck Returns healthy', async () => {
        const res = await supertest(app).get('/healthcheck');
        expect(res.text).toEqual('Healthy');
        expect(res.statusCode).toBe(200);
    });

    it('GET - feedback report returns CSV', async () => {
        const generateFeedbackCsvMock = jest.spyOn(CsvMaker, 'generateFeedbackCsv').mockImplementation();
        generateFeedbackCsvMock.mockResolvedValue('some,csv');

        const res = await supertest(app).get('/feedbackReport');

        expect(res.get('Content-Disposition')).toContain('attachment; filename="feedback.csv"');
        expect(res.get('Content-Type')).toContain('text/csv');
        expect(res.statusCode).toBe(200);
    });

    describe('POST - Feedback', () => {
        const VALID_REQUEST_JSON = { alertId: 'abc123', isCongestion: true };

        it('returns OK no content when store succeeds', async () => {
            const mockStoreValueInList = jest
                .spyOn(Store, 'storeValueInList')
                .mockImplementation();
            mockStoreValueInList.mockResolvedValue(true);
            const res = await supertest(app)
                .post('/feedback')
                .send(VALID_REQUEST_JSON);
            expect(res.statusCode).toBe(204);
        });

        it('returns error when store fails', async () => {
            const mockStoreValueInList = jest
                .spyOn(Store, 'storeValueInList')
                .mockImplementation();
            mockStoreValueInList.mockResolvedValue(false);
            const res = await supertest(app)
                .post('/feedback')
                .send(VALID_REQUEST_JSON);
            expect(res.statusCode).toBe(500);
        });

        it('stores feedback by alertId', async () => {
            const mockStoreValueInList = jest
                .spyOn(Store, 'storeValueInList')
                .mockImplementation();
            mockStoreValueInList.mockResolvedValue(true);
            const res = await supertest(app)
                .post('/feedback')
                .send(VALID_REQUEST_JSON);
            expect(res.statusCode).toBe(204);
            expect(mockStoreValueInList).toHaveBeenCalledWith(
                'feedback-abc123',
                'true',
            );
        });

        it('returns 400 if alertId is null', async () => {
            const invalidRequestJson = {
                bananas: 'I love them',
                tarragon: 'could take it or leave it',
            };
            const res = await supertest(app)
                .post('/feedback')
                .send(invalidRequestJson);
            expect(res.statusCode).toBe(400);
        });

        it('returns 400 if alertId is empty', async () => {
            const invalidRequestJson = {
                alertId: '',
                isCongestion: false,
            };
            const res = await supertest(app)
                .post('/feedback')
                .send(invalidRequestJson);
            expect(res.statusCode).toBe(400);
        });
    });

    it('turns off mime sniffing', async () => {
        const res = await supertest(app).get('/healthcheck');
        expect(res.get('X-Content-Type-Options')).toEqual('nosniff');
    });

    it('turns off caching', async () => {
        const res = await supertest(app).get('/healthcheck');
        expect(res.get('Cache-Control')).toEqual('no-cache');
    });

    it('does not reveal implementation details', async () => {
        const res = await supertest(app).get('/healthcheck');
        expect(res.get('X-Powered-By')).toBeUndefined();
    });
});
