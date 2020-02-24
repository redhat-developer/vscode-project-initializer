import { baseExtensionUITest } from "./baseExtensionTest";
import { testCommandPaletteOffering } from "./commandPaletteOptionsTest";
import { testCreatingCamelProject } from "./camelProjectCreateTest";
import { testFuseProjectOffering } from "./camelProjectOfferingTest";

/**
 * @author Ondrej Dockal <odockal@redhat.com>
 */
describe("Project initializer UI tests", () => {
   baseExtensionUITest();
   testCommandPaletteOffering();
   testCreatingCamelProject();
   testFuseProjectOffering();
});