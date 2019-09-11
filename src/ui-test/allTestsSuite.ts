import { extensionInCommandPromptTest } from "./extensionTest";
import { testCommandPalette } from "./commandPaletteOptionsTest";

describe("Project initializer UI tests", () => {
    extensionInCommandPromptTest();
    testCommandPalette();
});