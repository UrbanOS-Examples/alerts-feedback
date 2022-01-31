import app from './app';
import { Server } from 'http';
import { connectToRedis } from './store';

export const APP_PORT = 8080;

let server: Server;

function shutDown() {
    server.close();
    process.exit(0);
}

export function start(): Server {
    server = app.listen(APP_PORT, () => {
        console.log(`Server has starting listening on port ${APP_PORT}`);
    });
    connectToRedis();

    process.on('SIGTERM', () => {
        shutDown();
    });

    process.on('SIGINT', () => {
        shutDown();
    });

    return server;
}
