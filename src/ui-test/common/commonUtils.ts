import { Workbench, QuickPickItem, InputBox, Notification, VSBrowser, QuickOpenBox } from "vscode-extension-tester";
import * as fs from "fs";
import { expect } from "chai";

let path = require('path');
/**
 * @author Ondrej Dockal <odockal@redhat.com>
 */
async function openCommandPrompt() {
    return new Workbench().openCommandPrompt();
}

async function runCommands(...commands: string[]) {
    const commandPrompt = await openCommandPrompt();
    for (let index = 0; index < commands.length; index++) {
        const command = commands[index];
        await commandPrompt.setText(command);
        await commandPrompt.confirm();
    }
    return commandPrompt;
}

async function waitForQuickPick(input: InputBox | QuickOpenBox, quickPickValue: string, timeout: number = 6000, message?: string): Promise<QuickPickItem> {
    message = message || `Could not find option with value: ${quickPickValue}.`;

    const hasText = async (quickPick: QuickPickItem, text: string) => await quickPick.getText() === text;

    const findQuickPick = async () => {
        const q = await input.getQuickPicks().catch(() => []);
        return q.find(q => hasText(q, quickPickValue));
    };

    const quickPick = await VSBrowser.instance.driver.wait(findQuickPick, timeout, message);

    if (quickPick === undefined) {
        expect.fail(message);
    }
    return quickPick as QuickPickItem;
}

async function verifyQuickPicks(input: InputBox | QuickOpenBox, quickPickValues: string[], timeout?: number, message?: string): Promise<void> {
    const quickPicks = await Promise.all(quickPickValues.map((option: string) => {
        return waitForQuickPick(input, option, timeout, message);
    })).catch(expect.fail);
    expect(quickPicks.length,
        `Quick pick menu does not have ${quickPickValues.length} entires. Actual number of entries: ${quickPicks.length}`)
        .to.be.equal(quickPickValues.length);
}

async function typeCommandConfirm(command: string, useQuickPick: boolean = false) {
    const prompt = await InputBox.create();
    await prompt.setText(command);
    if (useQuickPick) {
        const option = await waitForQuickPick(prompt, command);
        await option.click();
    }
    else {
        await prompt.confirm();
    }
}

async function getCommandPromptOptions(command: string) {
    const commandPrompt = await InputBox.create();
    await commandPrompt.setText(command);
    const options = await commandPrompt.getQuickPicks();
    return convertArrayObjectsToText<QuickPickItem>(options);
}

async function convertArrayObjectsToText<T extends QuickPickItem>(array: T[]) {
    let options = [];
    for (let index = 0; index < array.length; index++) {
        const element = await array[index].getLabel();
        options.push(element.toString());
    }
    return options;
}

async function convertArrayObjectsToTextAndDescription<T extends QuickPickItem>(array: T[]) {
    let options = [];
    for (let index = 0; index < array.length; index++) {
        const label = await array[index].getLabel();
        const description = await array[index].getDescription();
        // const description = await array[index].findElement(By.className("label-description")).getText();
        options.push(label + " " + description);
    }
    return options;
}

async function getIndexOfQuickPickItem(fulltext: string, array: QuickPickItem[]) {
    let index = -1;
    for (let item of array) {
        const text = await item.getLabel();
        const description = await item.getDescription();
        if (fulltext === text + " " + description) {
            return item.getIndex();
        }
    }
    return index;
}

async function notificationExists(text: string): Promise<Notification | undefined> {
    const notifications = await new Workbench().getNotifications().catch(() => []);
    for (const notification of notifications) {
        const message = await notification.getMessage();
        if (message.indexOf(text) >= 0) {
            return notification;
        }
    }
}

async function removeFolderFromWorkspace(dir: string) {
    await openCommandPrompt();
    await typeCommandConfirm(">Workspaces: Remove Folder from workspace");
    const input = await InputBox.create();
    let dirs = await convertArrayObjectsToText(await input.getQuickPicks());
    if (dirs.filter(item => { return item.indexOf(dir) === 0; }).length === 0) {
        throw Error("Folder " + dir + " is not set as workspace, cannot be removed, available folders: " + dirs);
    }
    await input.selectQuickPick(dir);
}

async function addFolderToWorkspace(dir: string) {
    await openCommandPrompt();
    const quick = await InputBox.create();
    await quick.setText(">Extest: Add Folder");
    await quick.confirm();
    let confirmedPrompt = await InputBox.create();
    await confirmedPrompt.setText(dir);
    await confirmedPrompt.confirm();
}

function removeFilePathRecursively(filepath: string, includeRootDir: boolean = false) {
    if (fs.lstatSync(filepath).isDirectory()) {
        for (let file of fs.readdirSync(filepath)) {
            removeFilePathRecursively(filepath + path.sep + file, true);
        }
        if (includeRootDir) {
            fs.rmdirSync(filepath);
        }
    } else {
        fs.unlinkSync(filepath);
    }
}

export {
    convertArrayObjectsToText,
    waitForQuickPick,
    verifyQuickPicks,
    typeCommandConfirm,
    getCommandPromptOptions,
    openCommandPrompt,
    runCommands,
    notificationExists,
    convertArrayObjectsToTextAndDescription,
    getIndexOfQuickPickItem,
    addFolderToWorkspace,
    removeFolderFromWorkspace,
    removeFilePathRecursively
};
