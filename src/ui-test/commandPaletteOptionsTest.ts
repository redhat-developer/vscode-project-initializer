import { InputBox, QuickOpenBox } from "vscode-extension-tester";
import { getCommandPromptOptions, openCommandPrompt, typeCommandConfirm, verifyQuickPicks } from "./common/commonUtils";
import { ProjectInitializer } from "./common/projectInitializerConstants";
import { assertEqualOptions } from "./common/testUtils";


const GENERAL_PROJECT_EXPECTED = [
    'crud', 'cache', 'circuit-breaker', 'configmap', 'health-check', 'messaging', 'rest-http', 'rest-http-secured', 'istio-distributed-tracing'
];


/**
 * @author Ondrej Dockal <odockal@redhat.com>
 */
export function testCommandPaletteOffering() {
    describe('Verify Project initializer Command palette options', () => {

        let inputBox: InputBox | QuickOpenBox;

        it('Command palette should show proper options on the first level', async function () {
            this.timeout(5000);
            inputBox = await openCommandPrompt();
            const options = await getCommandPromptOptions(">Project initializer");
            assertEqualOptions(ProjectInitializer.FIRST_LEVEL_OPTIONS, options);
        });

        it('Options available after general Project Initializer project generation', async function () {
            this.timeout(10000);
            inputBox = await openCommandPrompt();
            await typeCommandConfirm('>' + ProjectInitializer.PI_GENERAL.general, true);
            await verifyQuickPicks(inputBox, GENERAL_PROJECT_EXPECTED);
        });

        after(async function () {
            if (inputBox && await inputBox.isDisplayed()) {
                await inputBox.cancel();
            }
        });
    });
}

