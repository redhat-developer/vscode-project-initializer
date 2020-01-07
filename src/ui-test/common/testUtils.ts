import { fail } from "assert";

/**
 * @author Ondrej Dockal <odockal@redhat.com>
 */
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
