import { InputBox, QuickOpenBox, ActivityBar, Notification, TreeItem, WebDriver, VSBrowser } from "vscode-extension-tester";
import { openCommandPrompt, removeFilePathRecursively, getIndexOfQuickPickItem, notificationExists, typeCommandConfirm } from "./common/commonUtils";
import * as fs from "fs";
import { ProjectInitializer } from "./common/projectInitializerConstants";
import { expect } from "chai";
let os = require('os');
let path = require('path');

const CAMEL_MISSIONS_EXPECTED = [
    'circuit-breaker', 'configmap', 'health-check', 'rest-http', 'istio-distributed-tracing'
];

const DIR = "Fuse_Camel_TestFolder";
const RUNTIME_VERSION = "fuse redhat750";

/**
 * @author Ondrej Dockal <odockal@redhat.com>
 */
export function testCreatingCamelProject() {

    describe('Verify Project initializer Camel/Fuse projects creation', async function() {

        let homedir: string;
        let inputBox: InputBox | QuickOpenBox;
        let driver: WebDriver;

        before(async function() {
            this.timeout(10000);
            homedir = os.homedir() + path.sep + DIR;
            driver = VSBrowser.instance.driver;
            if (! fs.existsSync(homedir)) {
                fs.mkdirSync(homedir);
            }
            await openCommandPrompt();
            const quick = await InputBox.create();
            await quick.setText(">Extest: Add Folder");
            await quick.confirm();
            let confirmedPrompt = await InputBox.create();
            await confirmedPrompt.setText(homedir);
            await confirmedPrompt.confirm();
        });

        CAMEL_MISSIONS_EXPECTED.forEach( async function(mission) {
            it('Test creating Camel/Fuse project: ' + mission + ", runtime & version: " + RUNTIME_VERSION, async function () {
                this.timeout(20000); 
                await openCommandPrompt();
                await typeCommandConfirm(`>${ProjectInitializer.PI_GENERAL.camel}`, true);
                inputBox = await InputBox.create();
                await inputBox.selectQuickPick(mission);
                inputBox = await InputBox.create();
                let index = await getIndexOfQuickPickItem(RUNTIME_VERSION, await inputBox.getQuickPicks());
                await inputBox.selectQuickPick(index);
                // settings default groupID
                inputBox = await InputBox.create();
                await inputBox.confirm();
                // setting default artifactID
                inputBox = await InputBox.create();
                await inputBox.confirm();
                // setting default version
                inputBox = await InputBox.create();
                await inputBox.confirm();
                console.log("vrsion confirmed");
                // select home dir
                inputBox = await InputBox.create();
                await inputBox.selectQuickPick(DIR);

                // check the notification "Project saved to ;
                // on Windows seems the C: is translated to c: by VSCode so we can't check this part
                const notification = await driver.wait(() => { return notificationExists('Project saved to '); }, 5000) as Notification;
                await notification.dismiss();
                // check explorer that it contains created project
                const explorerView = await new ActivityBar().getViewControl("Explorer").openView();
                const viewTab = await explorerView.getContent().getSection("Untitled (Workspace)");
                
                await driver.wait(async () => {
                    const items = await viewTab.getVisibleItems() as TreeItem[];
                    return items.find(item => item.getLabel() === "pom.xml") !== undefined;
                }, 8000, "Could not find pom.xml in file explorer.").catch(expect.fail);
            });
        });

        afterEach(async function () {
            this.timeout(5000);
            // delete created project - files from the folder
            removeFilePathRecursively(homedir);
            await new ActivityBar().getViewControl('Explorer').closeView();
        });

        after(async function () {
            this.timeout(10000);
            if (inputBox && await inputBox.isDisplayed()) {
                await inputBox.cancel();
            }
        });

    });
}
