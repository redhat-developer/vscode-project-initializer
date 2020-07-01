import { InputBox, QuickOpenBox, QuickPickItem } from 'vscode-extension-tester';
import { openCommandPrompt, typeCommandConfirm, verifyQuickPicks } from './common/commonUtils';
import { ProjectInitializer } from './common/projectInitializerConstants';


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
            this.timeout(8000);
            await inputBox.setText('>Project initializer');
            await verifyQuickPicks(inputBox, ProjectInitializer.FIRST_LEVEL_OPTIONS, QuickPickItem.prototype.getLabel, 4500);
            await inputBox.clear();
        });

        it('Options available after general Project Initializer project generation', async function () {
            this.timeout(12000);
            await typeCommandConfirm('>' + ProjectInitializer.PI_GENERAL.general, QuickPickItem.prototype.getLabel, 7500);
            inputBox = await InputBox.create();
            await verifyQuickPicks(inputBox, GENERAL_PROJECT_EXPECTED, QuickPickItem.prototype.getLabel, 5000);
        });

        before(async function () {
            this.timeout(8000);
            inputBox = await openCommandPrompt();
        });

        after(async function () {
            // ignore cancel command if input is not visible
            await inputBox?.cancel().catch(() => null);
        });
    });
}

