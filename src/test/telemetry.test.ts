'use strict';
import * as assert from 'assert';
import * as os from 'os';
import { sanitize } from '../telemetry';

suite("Sanitize tests", function () {
    test('Should Filter 127.0.0.1', function() {
        let result = sanitize("Connected to 127.0.0.1");
        assert.ok(result === "Connected to $IPADDRESS");
    });
    
    test('Should Filter ip address', function() {
        let result = sanitize("Connected to 1.1.1.1");
        assert.ok(result === "Connected to $IPADDRESS");
    });

    test('Should Filter email addresses', function() {
        let result = sanitize("Message to tools@jboss.org sent");
        assert.ok(result === "Message to $EMAIL sent");
    });

    test('Should Filter homedir', function() {
        let result = sanitize("Folder " + os.homedir() + " does not exists");
        assert.ok(result === "Folder $HOME does not exists");
    });

    test('Should Filter temp dir', function() {
        let result = sanitize("Folder " + os.tmpdir() + " does not exists");
        assert.ok(result === "Folder $TMPDIR does not exists");
    });

    test('Should Filter user name', function() {
        let result = sanitize("User " + os.userInfo().username + " does not exists");
        assert.ok(result === "User $USER does not exists");
    });
});


