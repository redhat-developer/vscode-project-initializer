import { VSBrowser, WebDriver } from 'vscode-extension-tester';
import { waitForEvent } from './common/testUtils';
import { ProjectInitializer } from './common/projectInitializerConstants';
import { openCommandPrompt } from './common/commonUtils';
import { expect } from 'chai';

export function extensionInCommandPromptTest() {
    describe('Verify extension brought its functionality into command prompt', () => {

        let driver: WebDriver;

        before(async () => {
            driver = VSBrowser.instance.driver;
            console.log(await driver.getTitle());
        });

        it('Command Palette prompt knows project initializer commands', async function () {
            
            await verifyCommandPalette();
            waitForEvent(new ExtensionIsAvailable(ProjectInitializer.PROJECT_INITIALIZER_NAME));
        });

        after(async () => {
        });

    });

}

async function verifyCommandPalette() {
    const prompt = await openCommandPrompt();
    await prompt.setText('Project: ');
    const options = await prompt.getQuickPicks();
    expect(options[0].getText()).not.equal('No commands matching');
}

/*
async function testFunctionSearchInputExtensions() {
    const activityBar: ActivityBar = new Workbench().getActivityBar();
    const control: ViewControl = activityBar.getViewControl('Extensions');
    await control.openView();
    const sideBarPart = await new SideBarView().getTitlePart();

    const actions = await sideBarPart.getActions();
    for (let index = 0; index < actions.length; index++) {
        const element = actions[index];
        console.log('actions:' + await element.getTitle());
    }
    const action = await sideBarPart.getAction('More Actions...');
    await action.click();
}
*/

class ExtensionIsAvailable implements WaitCondition {

    name: string;

    constructor(name: string) {
        this.name = name;
    }

    test(): boolean {
        return true;
    }

}