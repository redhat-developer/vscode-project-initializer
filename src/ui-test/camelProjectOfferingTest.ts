import { QuickOpenBox, InputBox, QuickPickItem } from "vscode-extension-tester";
import { openCommandPrompt, typeCommandConfirm, convertArrayObjectsToText, convertArrayObjectsToTextAndDescription } from "./common/commonUtils";
import { assertEqualOptions } from "./common/testUtils";
import { ProjectInitializer } from "./common/projectInitializerConstants";
import { Catalog } from "../Catalog";
import { expect } from "chai";

const CAMEL_MISSIONS_EXPECTED = [
    'circuit-breaker', 'configmap', 'health-check', 'rest-http', 'istio-distributed-tracing'
];

/**
 * @author odockal@redhat.com
 */
export function testFuseProjectOffering() {
    describe('Verify Project initializer Camel/Fuse Command palette options', async function() {

        let inputBox: InputBox | QuickOpenBox;
        let catalogFuse: any;

        before(async function() {
            this.timeout(5000);
            let catalogBuilder = new Catalog(ProjectInitializer.BUILDER_CATALOG_URL);
            let catalog = await catalogBuilder.getCatalog();
            catalogFuse = filterCatalogForRuntimes(catalog, ProjectInitializer.CAMEL_FUSE_RUNTIME_IDS);
        });

        it('Available missions and runtime versions correspond to Camel/Fuse project catalog', async function () {
            this.timeout(30000);
            for (let mission of catalogFuse.missions) {
                console.log("\tVerifying runtimes and versions for " + mission.id + " mission");
                await openCommandPrompt();
                await typeCommandConfirm('>' + ProjectInitializer.PI_GENERAL.camel);
                inputBox = await InputBox.create();
                await inputBox.selectQuickPick(mission.id);
                let expectedRefs = findRefsForMissions(mission.id, catalogFuse.boosters);
                let expected = expectedRefs.map( (runver: any) => runver.runtime + " " + runver.version);
                inputBox = await InputBox.create();
                let actual = await convertArrayObjectsToTextAndDescription<QuickPickItem>(await inputBox.getQuickPicks());
                expect(expected).to.have.same.members(actual);
                await inputBox.cancel();
            }
        });

        it('Verify options available for Camel/Fuse project', async function () {
            this.timeout(10000);
                await openCommandPrompt();
                await typeCommandConfirm('>' + ProjectInitializer.PI_GENERAL.camel);
                inputBox = await InputBox.create();
                assertEqualOptions(CAMEL_MISSIONS_EXPECTED, await convertArrayObjectsToText<QuickPickItem>(await inputBox.getQuickPicks()));
        });

        after(async function () {
            if (inputBox && await inputBox.isDisplayed()) {
                await inputBox.cancel();
            }
        });
    });
}


function filterCatalogForRuntimes(catalog: any, runtimeIds:string[]) {
    let filteredCatalog = JSON.parse(JSON.stringify(catalog));
    filteredCatalog.runtimes = catalog.runtimes.filter((runtime: any) => { return runtimeIds.indexOf(runtime.id) > -1;});
    let filteredBoosters = catalog.boosters.filter((booster: any) => { return runtimeIds.indexOf(booster.runtime) > -1;});
    filteredCatalog.boosters = filteredBoosters;
    let filteredMissionIds = filteredBoosters.map((booster:any) => {return booster.mission;});
    filteredCatalog.missions = catalog.missions.filter((mission:any) => {return filteredMissionIds.includes(mission.id);});
    return filteredCatalog;
}

function findRefsForMissions(mission: string, refCatalog: any) {
    let missionsRefs = refCatalog.filter((ref: any) => { return mission.indexOf(ref.mission) > -1;});
    return missionsRefs;
}
