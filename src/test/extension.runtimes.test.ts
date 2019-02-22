'use strict';
import * as assert from 'assert';
import { Catalog } from '../Catalog';
import * as initializer from '../extension';

suite("Extension Tests for Runtimes", function () {



    test('Should Filter missions with specific runtime support', function() {
        let catalog = JSON.parse(`
        {
            "boosters": [
                {
                    "mission": "mission1",
                    "name": "booster1.1",
                    "description": "booster1.1",
                    "runtime": "runtimeId1",
                    "version": "community"
                },
                {
                    "mission": "mission1",
                    "name": "booster1.2",
                    "description": "booster1.2",
                    "runtime": "runtimeId2",
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
                    "id": "runtimeId1",
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
        let filteredCatalog = initializer.filterCatalogForRuntimes(catalog, ["runtimeId1", "runtimeId2"]);
        assert.ok(filteredCatalog.missions.length === 1);
        assert.ok(filteredCatalog.missions[0].id === "mission1");
        assert.ok(filteredCatalog.missions[0].id === "mission1");

        assert.ok(filteredCatalog.boosters.length === 2);
    });
    
    let catalogPromise:Promise<any>;

    this.beforeAll(function() {
        let catalog = new Catalog('https://forge.api.openshift.io/api/');
        catalogPromise = catalog.getCatalog();
    });
    
    test('Ensure at least one booster still exists for Camel/Fuse runtime', function() {
        return checkAtLeastOneMissionForRuntimes(catalogPromise, initializer.CAMEL_FUSE_RUNTIME_IDS);
    });
    
    test('Ensure at least one booster still exists for Golang runtime', function() {
        return checkAtLeastOneMissionForRuntimes(catalogPromise, initializer.GOLANG_RUNTIME_IDS);
    });
    test('Ensure at least one booster still exists for NodeJS runtime', function() {
        return checkAtLeastOneMissionForRuntimes(catalogPromise, initializer.NODEJS_RUNTIME_IDS);
    });
    test('Ensure at least one booster still exists for Spring Boot runtime', function() {
        return checkAtLeastOneMissionForRuntimes(catalogPromise, initializer.SPRINGBOOT_RUNTIME_IDS);
    });
    test('Ensure at least one booster still exists for Thorntail runtime', function() {
        return checkAtLeastOneMissionForRuntimes(catalogPromise, initializer.THORNTAIL_RUNTIME_IDS);
    });
    test('Ensure at least one booster still exists for Vert.x runtime', function() {
        return checkAtLeastOneMissionForRuntimes(catalogPromise, initializer.VERTX_RUNTIME_IDS);
    });
    
    function checkAtLeastOneMissionForRuntimes(catalog:Promise<any>, runtimeIds:string[]) {
        return catalog.then((catalog) => {
            let filteredCatalog = initializer.filterCatalogForRuntimes(catalog, runtimeIds);
            assert.ok(filteredCatalog.missions.length >= 1);
        });
    }

});


