'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Catalog } from './Catalog';
import * as zip from 'adm-zip'

let catalog:Catalog = new Catalog("https://forge.api.openshift.io/api");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('fabric8.launcher.generate', () => generate());

    context.subscriptions.push(disposable);
}

async function generate() {
    try {
        let missions = await catalog.getMissions();
        let missionId:any = await vscode.window.showQuickPick(missions.map((mission:any) => ({label: mission.id, description:mission.description})), {placeHolder: 'Choose mission'});
        if (missionId) {
            let mission = missions.find((item) => item.id == missionId.label);
            if (mission) {
                let runtimeId = await vscode.window.showQuickPick(mission.runtimes, {placeHolder: 'Choose runtime'});
                if (runtimeId) {
                    let runtimes = await catalog.getRuntimes();
                    let runtime = runtimes.find((item) => item.id == runtimeId);
                    if (runtime) {
                        let runtimeMission = runtime.missions.find((item:any) => item.id == mission.id);
                        if (runtimeMission) {
                            let versionId:any = await vscode.window.showQuickPick(runtimeMission.versions.map((version:any) => ({label: version.id, description:version.name})), {placeHolder: 'Choose runtime version'});
                                let groupId = await vscode.window.showInputBox({prompt:'Group Id', placeHolder:'Enter the group id'});
                                if (groupId) {
                                    let artifactId = await vscode.window.showInputBox({prompt:'Artifact Id', placeHolder:'Enter the artifact id'});
                                    if (artifactId) {
                                        let version = await vscode.window.showInputBox({prompt:'Version',placeHolder:'Enter the version'});
                                        if (version) {
                                            vscode.window.setStatusBarMessage("Downloading zip project file", 1000);
                                            let zipProject = await catalog.zip(artifactId, missionId.label, runtimeId, versionId.label, groupId, artifactId, version);
                                            if (zipProject) {
                                                let folder = await vscode.window.showWorkspaceFolderPick({placeHolder:'Select the target workspace folder'});
                                                if (folder) {
                                                    vscode.window.setStatusBarMessage("Unzipping project file", 1000);
                                                    new zip(zipProject as Buffer).extractAllToAsync(folder.uri.fsPath, false, (error) => {
                                                        if (error) {
                                                            vscode.window.showErrorMessage("Error while unzipping to " + folder!.uri.fsPath);
                                                        } else {
                                                            vscode.window.showInformationMessage("Project saved to " + folder!.uri.fsPath);
                                                        }

                                                    });
                                                }
                                            }
                                            console.log(zip);
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            }
        }
        catch (error) {
            vscode.window.showErrorMessage("Error while processing Fabric8 launcher");
        }


}

// this method is called when your extension is deactivated
export function deactivate() {
}