import {
    ActivityBar,
    ExtensionsViewItem,
    ExtensionsViewSection,
    InputBox
} from 'vscode-extension-tester';
import { expect } from 'chai';
import { openCommandPrompt } from './common/commonUtils';
import { ProjectInitializer } from './common/projectInitializerConstants';

export function baseExtensionUITest() {
    describe('Verify extension\'s base assets available after install', () => {

        let inputBox: InputBox;

        it('Command Palette prompt knows project initializer commands', async function () {
            this.timeout(4000);
            inputBox = await openCommandPrompt(this.timeout() - 500);
            await verifyCommandPalette(inputBox);
        });

        it('Project initializer extension is installed', async function () {
            this.timeout(5000);
            const view = await new ActivityBar().getViewControl('Extensions').openView();
            const section = await view.getContent().getSection('Installed') as ExtensionsViewSection;
            let item = await section.findItem(`@installed ${ProjectInitializer.PROJECT_INITIALIZER_FULL_NAME}`) as ExtensionsViewItem;
            expect(item).not.undefined;
        });

        after(async function () {
            if (inputBox && await inputBox.isDisplayed()) {
                await inputBox.cancel();
            }
            await new ActivityBar().getViewControl('Extensions').closeView();
        });

    });

}

async function verifyCommandPalette(input: any) {
    await input.setText(`>${ProjectInitializer.PROJECT_INITIALIZER_NAME}`);
    const options = await input.getQuickPicks();
    expect(options[0].getText()).not.equal('No commands matching');
}
