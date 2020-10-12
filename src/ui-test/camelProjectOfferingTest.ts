import { assertEqualOptions } from './common/testUtils';
import { Catalog } from '../Catalog';
import {
    convertArrayObjectsToText,
    convertScrollableQuickPicksToTextAndDescription,
    openCommandPrompt,
    typeCommandConfirm
} from './common/commonUtils';
import { expect } from 'chai';
import { InputBox, QuickPickItem } from 'vscode-extension-tester';
import { it } from 'mocha';
import { ProjectInitializer } from './common/projectInitializerConstants';

const CAMEL_MISSIONS_EXPECTED = [
    'circuit-breaker', 'configmap', 'health-check', 'rest-http', 'istio-distributed-tracing'
];

/**
 * @author odockal@redhat.com
 */
export function testFuseProjectOffering() {
    describe('Verify Project initializer Camel/Fuse Command palette options', async function () {

        let inputBox: InputBox;
        let catalogBuilder = new Catalog(ProjectInitializer.BUILDER_CATALOG_URL);
        let catalog = await catalogBuilder.getCatalog();
        let catalogFuse = filterCatalogForRuntimes(catalog, ProjectInitializer.CAMEL_FUSE_RUNTIME_IDS);

        for (let mission of catalogFuse.missions) {
            describe(`Verifying runtimes and versions for '${mission.id}' mission`, async function () {
                this.timeout(10000);

                before(async function () {
                    inputBox = await openCommandPrompt();
                });

                after(async function () {
                    if (inputBox && await inputBox.isDisplayed()) {
                        await inputBox.cancel();
                    }
                });

                it(`Execute command ${ProjectInitializer.PI_GENERAL.camel}`, async function () {
                    await typeCommandConfirm('>' + ProjectInitializer.PI_GENERAL.camel, QuickPickItem.prototype.getLabel);
                });

                it(`Select mission: ${mission.id}`, async function () {
                    inputBox = await InputBox.create();
                    expect(await inputBox.getPlaceHolder()).to.be.equal('Choose mission');
                    await inputBox.selectQuickPick(mission.id);
                });

                it('Verify mission versions', async function () {
                    let expectedRefs = findRefsForMissions(mission.id, catalogFuse.boosters);
                    let expected = expectedRefs.map((runver: any) => runver.runtime + ' ' + runver.version);
                    inputBox = await InputBox.create();
                    let actual = await convertScrollableQuickPicksToTextAndDescription(inputBox);
                    expect(expected).to.have.members(actual);
                });
            });
        }

        it('Verify options available for Camel/Fuse project', async function () {
            this.timeout(10000);
            await openCommandPrompt();
            await typeCommandConfirm('>' + ProjectInitializer.PI_GENERAL.camel, QuickPickItem.prototype.getLabel);
            inputBox = await InputBox.create();
            assertEqualOptions(CAMEL_MISSIONS_EXPECTED, await convertArrayObjectsToText<QuickPickItem>(await inputBox.getQuickPicks()));
            await inputBox.cancel();
        });
    });
}


function filterCatalogForRuntimes(catalog: any, runtimeIds: string[]) {
    let filteredCatalog = JSON.parse(JSON.stringify(catalog));
    filteredCatalog.runtimes = catalog.runtimes.filter((runtime: any) => { return runtimeIds.indexOf(runtime.id) > -1; });
    let filteredBoosters = catalog.boosters.filter((booster: any) => { return runtimeIds.indexOf(booster.runtime) > -1; });
    filteredCatalog.boosters = filteredBoosters;
    let filteredMissionIds = filteredBoosters.map((booster: any) => { return booster.mission; });
    filteredCatalog.missions = catalog.missions.filter((mission: any) => { return filteredMissionIds.includes(mission.id); });
    return filteredCatalog;
}

function findRefsForMissions(mission: string, refCatalog: any) {
    let missionsRefs = refCatalog.filter((ref: any) => { return mission.indexOf(ref.mission) > -1; });
    return missionsRefs;
}
