import { Workbench, QuickPickItem, InputBox } from "vscode-extension-tester";
import { waitForEvent } from "./testUtils";

export async function openCommandPrompt() {
    return new Workbench().openCommandPrompt();
}

export async function runCommands(...commands: string []) {
    const commandPrompt = await openCommandPrompt();
    for (let index = 0; index < commands.length; index++) {
        const command = commands[index];
        await commandPrompt.setText(command);
        await commandPrompt.confirm();
    }
    return commandPrompt;
}

export async function openCommandPromptGetOptions(command: string) {
    console.log('Open command palette prompt');
    const commandPrompt = await new Workbench().openCommandPrompt();
    console.log('Typing ' + command);
    await commandPrompt.setText(command);
    const options = await commandPrompt.getQuickPicks();
    return logArray(options);
}

export async function openCommandPromptGetOptionsOnLast(...commands: string []) {
    console.log('Open command palette prompt');
    const commandPrompt = await openCommandPrompt();
    for (let index = 0; index < commands.length-1; index++) {
        const command = commands[index];
        console.log('Typing ' + command);
        await commandPrompt.setText(command);
        console.log('Confirming');
        await commandPrompt.confirm();
    }
    const lastCommand = commands[commands.length - 1];
    console.log('Typing command: ' + lastCommand);
    await commandPrompt.setText(lastCommand);
    await commandPrompt.confirm();
    await waitForEvent((<WaitCondition>{
        test: function() {
            return false;
        }
    }), 5000);
    const input = await new InputBox();
    const options = await input.getQuickPicks();
    return logArray(options);
}

export async function logArray(array: QuickPickItem[]) {
    let options = [];
    for (let index = 0; index < array.length; index++) {
        const element = await array[index].getText();
        console.log(element);
        options.push(element);
    }
    return options;
}