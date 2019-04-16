'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Catalog } from './Catalog';
import * as yauzl from 'yauzl'
let fs = require('fs');
let p = require('path');

let catalogBuilder:Catalog = new Catalog(vscode.workspace.getConfiguration("project.initializer").get<string>("endpointUrl", "https://forge.api.openshift.io/api/"));
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let genericGenerationCommand = vscode.commands.registerCommand('project.initializer.generate', () => generateFromAllChoices());
    let fuseGenerationCommand = vscode.commands.registerCommand('project.initializer.generate.camelfuse', () => generateForCamelFuse());

    let disposableListener = vscode.workspace.onDidChangeConfiguration(event => {updateCatalog(event)});

    context.subscriptions.push(genericGenerationCommand);
    context.subscriptions.push(fuseGenerationCommand);
    context.subscriptions.push(disposableListener);
}

function updateCatalog(event: vscode.ConfigurationChangeEvent) {
    if (event.affectsConfiguration("project.initializer.endpointUrl")) {
        let url = vscode.workspace.getConfiguration("project.initializer").get<string>("endpointUrl", "https://forge.api.openshift.io/api/");
        if (catalogBuilder.endpoint != url) {
            catalogBuilder = new Catalog(url);
        }
    }
}

async function generateForCamelFuse() {
    try {
        let catalog = await catalogBuilder.getCatalog();
        await generate(filterCatalogForCamelFuse(catalog));
    }
    catch (error) {
        vscode.window.showErrorMessage("Error while processing Project Initializer" + error);
    }
}

export function filterCatalogForCamelFuse(catalog: any) {
    let filteredCatalog = JSON.parse(JSON.stringify(catalog));
    filteredCatalog.runtimes = catalog.runtimes.filter((runtime: any) => { return runtime.id === "fuse" || runtime.id === "camel"; });
    let camelFuseBoosters = catalog.boosters.filter((booster: any) => { return booster.runtime === "fuse" || booster.runtime === "camel"; });
    filteredCatalog.boosters = camelFuseBoosters;
    let camelFuseMissionIds = camelFuseBoosters.map((camelFuseBooster:any) => {return camelFuseBooster.mission;});
    filteredCatalog.missions = catalog.missions.filter((mission:any) => {return camelFuseMissionIds.includes(mission.id);});
    return filteredCatalog;
}

async function generateFromAllChoices() {
    try {
        let catalog = await catalogBuilder.getCatalog();
        await generate(catalog);
    }
    catch (error) {
        vscode.window.showErrorMessage("Error while processing Project Initializer" + error);
    }
}

async function generate(catalog: any) {
    let missions = catalog.missions.map((mission:any) => ({label: mission.id, description:mission.description}));
    let missionId: any = await vscode.window.showQuickPick(missions, { placeHolder: 'Choose mission' });
    if (missionId) {
        let boosters = catalog.boosters.filter((item: any) => item.mission == missionId.label);
        if (boosters) {
            let runtimeId: any = await vscode.window.showQuickPick(boosters.map((item: any) => ({ label: item.runtime, description: item.version })), { placeHolder: 'Choose runtime' });
            if (runtimeId) {
                let groupId = await vscode.window.showInputBox({ prompt: 'Group Id', placeHolder: 'Enter the group id', value: vscode.workspace.getConfiguration("project.initializer").get<string>("defaultGroupId") });
                if (groupId) {
                    let artifactId = await vscode.window.showInputBox({ prompt: 'Artifact Id', placeHolder: 'Enter the artifact id', value: vscode.workspace.getConfiguration("project.initializer").get<string>("defaultArtifactId") });
                    if (artifactId) {
                        let version = await vscode.window.showInputBox({ prompt: 'Version', placeHolder: 'Enter the version', value: vscode.workspace.getConfiguration("project.initializer").get<string>("defaultVersion") });
                        if (version) {
                            vscode.window.setStatusBarMessage("Downloading zip project file", 1000);
                            let zipProject = await catalogBuilder.zip(artifactId, missionId.label, runtimeId.label, runtimeId.description, groupId, artifactId, version);
                            if (zipProject) {
                                let folder = await vscode.window.showWorkspaceFolderPick({ placeHolder: 'Select the target workspace folder' });
                                if (folder) {
                                    vscode.window.setStatusBarMessage("Unzipping project file", 1000);
                                    extract(zipProject as Buffer, folder.uri.fsPath);
                                    vscode.window.showInformationMessage("Project saved to " + folder!.uri.fsPath);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function extract(content:Buffer, path:string) {
    yauzl.fromBuffer(content, {lazyEntries:true}, (err, zipfile) => {
        if (err) {
            throw err;
        }
        zipfile!.readEntry();
        zipfile!.on("entry", (entry:yauzl.Entry) => {
            console.log("Processing " + entry.fileName);
            let entryPath = removeFirstLevel(entry.fileName);
            if (entryPath != "/") {
                let mappedPath = p.resolve(path, p.normalize(entryPath));
                if (entryPath.endsWith("/")) {
                    fs.mkdirSync(mappedPath);
                } else {
                    zipfile!.openReadStream(entry, (err,stream) => {
                        if (err) {
                            throw err;
                        }
                        stream!.pipe(fs.createWriteStream(mappedPath));
                    });
                }
            }
            zipfile!.readEntry();
        });

    });
}

function removeFirstLevel(path:string) {
    let index = path.indexOf("/");
    if (index != (-1)) {
        path = path.substring(index + 1);
    }
    return path;
}

// this method is called when your extension is deactivated
export function deactivate() {
}