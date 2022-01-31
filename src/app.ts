import express, {Request} from 'express';
import {storeValueInList} from './store';
import {Feedback} from './feedback';
import cors from 'cors';
import {generateFeedbackCsv} from './csv-maker';
import robots from 'express-robots-txt';

const app = express();
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');

app.use(robots({
  UserAgent: '*',
  Disallow: '/'
}));

app.use(function (req, res, next) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/healthcheck', function (req, res) {
    res.send('Healthy');
});

app.get('/feedbackReport', async function (req, res) {
    res.type('text/csv');
    res.attachment('feedback.csv');
    generateFeedbackCsv().then(csv => {
        res.send(csv);
    }).catch(error => {
        console.error(error);
    });
});

app.post('/feedback', async function (req, res) {
    if (req.body.alertId == null || req.body.alertId == '') {
        res.sendStatus(400);
        return;
    }

    const success = await storeRequestAsFeedback(req);
    if (success) {
        res.sendStatus(204);
    } else {
        res.sendStatus(500);
    }
});

async function storeRequestAsFeedback(req: Request) {
    const feedback = req.body as Feedback;
    return await storeValueInList(
        `feedback-${feedback.alertId}`,
        `${feedback.isCongestion}`,
    );
}

export default app;
