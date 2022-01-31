import { AddressInfo } from 'net';
import { Server } from 'http';
import {start} from "./server"

describe('Server', () => {
    let server: Server;

    beforeEach(() => {
        server = start();
    });
    
    afterEach(() => {
        server.close();
    });


    it('starts on port 8080', async () => {
        const address = server.address() as AddressInfo;
        expect(address.port).toEqual(8080);
    });

});
