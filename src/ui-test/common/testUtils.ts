import { fail } from "assert";

export async function waitForEvent(myEvent: WaitCondition, ms = 1000) {
    let timeout = ms / 1000;
    console.log("Wait will wait for timeout: " + timeout + " s");
    while(timeout-- > 0) {
        console.log('Counter value: ' + timeout);
        if (myEvent.test()) {
            return;
        }
        await sleep(1000);
    }
    throw Error('Waiting for the condition failed');
}

// default sleep promise returning function
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function assertEqualOptions(expected: string[], actual: string[]) {
    if (actual === null || actual.length === 0) {
        throw new Error('Array passed into assert is null or empty');
    }
    let missing = expected.filter(item => actual.indexOf(item) < 0);
    if (missing.length > 0) {
        fail('Missing expected option in command palette: ' + missing);
    }
}

export function assertContainsOptions(expected: string[], actual: string[]) {
    if (actual === null || actual.length === 0) {
        throw new Error('Array passed into assert is null or empty');
    }
    let missing = expected.filter(item => actual.indexOf(item) > -1);
    if (missing.length > 0) {
        fail('Missing expected option in command palette: ' + missing);
    }
}
