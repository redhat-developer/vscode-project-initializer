//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as vscode from 'vscode';
import { Catalog } from '../Catalog';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('redhat.project-initializer'));
    });

    test('should activate', function () {
        this.timeout(1 * 60 * 1000);
        return vscode.extensions.getExtension('redhat.project-initializer')!.activate().then((api) => {
            assert.ok(true);
        });
    });

    test('should register all commands', function () {
        return vscode.commands.getCommands(true).then((commands) =>
        {
            let myCommands = commands.filter(function(value){
                return value.startsWith('project.initializer');
            });
            assert.equal(myCommands.length, 7, 'Some commands are not registered properly or a new command is not added to the test');
        });
    });

    test('Should load default catalog', function() {
        let catalog = new Catalog('https://forge.api.openshift.io/api/');
        return catalog.getCatalog().then(res => {
            assert.ok(res);
        });

    });
});
