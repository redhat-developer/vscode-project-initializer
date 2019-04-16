'use strict';
import * as assert from 'assert';
import { Catalog } from '../Catalog';
import * as initializer from '../extension';

suite("Extension Tests for Camel/Fuse", function () {

    test('Should Filter missions with Camel/Fuse runtime support', function() {
        let catalog = JSON.parse(`
        {
            "boosters": [
                {
                    "mission": "mission1",
                    "name": "booster1.1",
                    "description": "booster1.1",
                    "runtime": "fuse",
                    "version": "community"
                },
                {
                    "mission": "mission1",
                    "name": "booster1.2",
                    "description": "booster1.2",
                    "runtime": "camel",
                    "version": "redhat"
                },
                {
                    "mission": "mission1",
                    "name": "booster1.3",
                    "description": "booster1.3",
                    "runtime": "another",
                    "version": "another"
                },
                {
                    "mission": "mission2",
                    "name": "booster2",
                    "description": "booster2",
                    "runtime": "another",
                    "version": "another"
                }
            ],
            "runtimes": [
                {
                    "id": "fuse",
                    "name": "Fuse",
                    "description": "The Fuse runtime",
                    "versions": [
                        {
                            "id": "community",
                            "name": "2.21.2 (Community)"
                        },
                        {
                            "id": "redhat",
                            "name": "7.2.0 (Red Hat Fuse)"
                        }
                    ]
                }
            ],
            "missions": [
                {
                    "id": "mission1",
                    "name": "mission1",
                    "description": "mission1"
                },
                {
                    "id": "mission2",
                    "name": "mission2",
                    "description": "mission2"
                }
            ]
        }`);
        let filteredCatalog = initializer.filterCatalogForCamelFuse(catalog);
        assert.ok(filteredCatalog.missions.length === 1);
        assert.ok(filteredCatalog.missions[0].id === "mission1");
        assert.ok(filteredCatalog.missions[0].id === "mission1");

        assert.ok(filteredCatalog.boosters.length === 2);
    });
    
    test('Ensure Camel/Fuse runtime id available in Catalog', function() {
        let catalog = new Catalog('https://forge.api.openshift.io/api/');
        return catalog.getCatalog().then(res => {
            assert.ok(res.runtimes.filter((runtime:any) => {return runtime.id === "fuse" || runtime.id === "camel";}).length !== 0);
        });
    });

});
