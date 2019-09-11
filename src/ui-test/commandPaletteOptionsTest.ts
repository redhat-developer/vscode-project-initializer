import { WebDriver, VSBrowser } from "vscode-extension-tester";
import { assertEqualOptions, waitForEvent } from "./common/testUtils";
import { openCommandPromptGetOptions, openCommandPrompt, logArray } from "./common/commonUtils";
import { ProjectInitializer } from "./common/projectInitializerConstants";

const EXT_STRING_SUFFIX = " project using Project Initializer";
const EXT_STRING_PREFIX = "Project: Generate ";

const PI_GENERAL = {
    general: EXT_STRING_PREFIX + "a" + EXT_STRING_SUFFIX,
    camel:EXT_STRING_PREFIX + ProjectInitializer.PaletteOptionsGeneral.camel + EXT_STRING_SUFFIX,
    go: EXT_STRING_PREFIX + ProjectInitializer.PaletteOptionsGeneral.go + EXT_STRING_SUFFIX,
    nodejs: EXT_STRING_PREFIX + ProjectInitializer.PaletteOptionsGeneral.nodejs + EXT_STRING_SUFFIX,
    spring: EXT_STRING_PREFIX + ProjectInitializer.PaletteOptionsGeneral.spring + EXT_STRING_SUFFIX,
    thorntail: EXT_STRING_PREFIX + ProjectInitializer.PaletteOptionsGeneral.thorntail + EXT_STRING_SUFFIX,
    vertx: EXT_STRING_PREFIX + ProjectInitializer.PaletteOptionsGeneral.vertx + EXT_STRING_SUFFIX
};

const FIRST_LEVEL_OPTIONS = [
    PI_GENERAL.general, 
    PI_GENERAL.camel,
    PI_GENERAL.go,
    PI_GENERAL.nodejs,
    PI_GENERAL.spring,
    PI_GENERAL.thorntail,
    PI_GENERAL.vertx
];

const GENERAL_PROJECT_EXPECTED = [
    'crud', 'cache', 'circuit-breaker', 'configmap', 'health-check', 'messaging', 'rest-http', 'rest-http-secured', 'istio-distributed-tracing'
];

export function testCommandPalette() {
    describe('Verify Project initializer Command palette options', () => {

        let driver: WebDriver;

        before(async () => {
            driver = VSBrowser.instance.driver;
            console.log('Active window: ' + await driver.getTitle());
        });

        it('Command palette should show proper options on the first level', async function () {
            const options = await openCommandPromptGetOptions(">Project initializer");
            assertEqualOptions(FIRST_LEVEL_OPTIONS, options);
        });

        it('Options available after general Project Initializer project generation', async function () {
            this.timeout(10000);
            const prompt = await openCommandPrompt();
            prompt.setText('>' + PI_GENERAL.general);
            prompt.confirm();
            await waitForEvent((<WaitCondition>{
                test: function() {
                    let count = 2;
                    if (--count >= 0) {
                        return false;
                    }
                    return true;
                    /*prompt.getAttribute('hidden').then(result => {
                        console.log('hidden result:' + result);
                        if (result === 'true') {
                            return false;
                        } else {
                            return true;
                        }});*/
                }
            }), 4000);
            const options = await logArray(await prompt.getQuickPicks());
            console.log(options);
            assertEqualOptions(GENERAL_PROJECT_EXPECTED, options);
        });

        after(async () => {
            
        });

    });
}