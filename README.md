# Alerts Feedback API
A collection of endpoints to register feedback from operators about whether a given congestion alert was useful and actionable for them.

## Using Alerts Feedback API

### API Documentation
For details on how to use the Alerts Feedback API, please review the Postman collection located [here]() _(link forthcoming)_.

### Feedback Analysis
The Feedback API contains the ability to provide all collected feedback. A CSV file can be accessed from an endpoint (see API Documentation above).

A readout of all alerts can also be obtained by running the following script:
```bash
npm run feedback-alerts
```

This will print all alerts with feedback as JSON to the console, terminating with a count of all alerts with associated feedback.

## Development

### Running Locally
-   `npm install` from the root of the repository will install the needed dependencies
-   In the extensions pane, search for `@recommended`, and install the recommended extensions
    -   All team code linting / formatting will happen upon saving
-   `npm run watch` will spin up the alerting-feedback in watch mode (code changes will refresh)

### Testing

Endpoints are tested with jest and the supertest library. An example is available
in the `app.test.ts` file.

-   `npm run test:watch` will run all `*.test.ts` files in watch mode
-   `npm run view:coverage` will startup a server to serve the coverage report
    for you to view in your browser

## Deployment

Github Actions is used for our internal deployment, steps are documented in the
`.github/workflows` directory.

## API Dependencies Note

-   Anything needed by typescript to build (including `@types` packages) need to
    be included in the `dependencies`, not the `devDependencies`. This could be
    changed to be more conventional, but the dockerfile steps would also need
    to be updated.

