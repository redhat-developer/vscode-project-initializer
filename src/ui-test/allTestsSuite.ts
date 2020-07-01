import { baseExtensionUITest } from './baseExtensionTest';
import { QuickPickItem } from 'vscode-extension-tester';
import { testCommandPaletteOffering } from './commandPaletteOptionsTest';
import { testCreatingCamelProject } from './camelProjectCreateTest';
import { testFuseProjectOffering } from './camelProjectOfferingTest';

/**
 * @author Ondrej Dockal <odockal@redhat.com>
 */
describe('Project initializer UI tests', function () {
   QuickPickItem.prototype.select = async function () {
      await this.getDriver().executeScript('arguments[0].click();', this);
   };

   baseExtensionUITest();
   testCommandPaletteOffering();
   testCreatingCamelProject();
   testFuseProjectOffering();
});
