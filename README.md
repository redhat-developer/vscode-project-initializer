# Fabric8 Launcher VSCode

[![Build Status](https://semaphoreci.com/api/v1/fabric8-launcher/launcher-vscode-extension/branches/master/badge.png)](https://semaphoreci.com/fabric8-launcher/launcher-vscode-extension)
[![Build status](https://ci.appveyor.com/api/projects/status/bndhekqk8lnj0s99?svg=true)](https://ci.appveyor.com/project/fabric8-launcher/launcher-vscode-extension)

## Overview

A lightweight extension based on Fabric8 Launcher to generate quickstart projects using Visual Studio Code (VS Code). Here's a list of features:

- Generator

## Requirements

- VS Code (version 1.19.0 or later)

## How-to

First you need to "open the folder" in VS Code in which you want to create the project.

Then, you can trigger the Fabric8 launcher. It is available from Palette command (Ctrl+Shift=P) with the name "Fabric8: generate a project from Fabric8 launcher":

![Fabric8 palette entry.](images/fabric8LauncherPaletteEntry.png "Fabric8 Palette entry")

## Extension Settings

* `fabric8.launcher.endpointUrl`: launcher service endpoint URL. Defaults to https://forge.api.openshift.io/api/
* `fabric8.launcher.defaultGroupId`: default group id. Defaults to io.openshift
* `fabric8.launcher.defaultArtifactId`: default artifact id. Defaults to booster
* `fabric8.launcher.defaultVersion`: default version. Defaults to 0.0.1-SNAPSHOT

## Known Issues

None at this point.

## Release Notes

### 0.0.1

First version for early feedback

### 0.0.2

First missing dependency

### 0.0.3

Update for new Launcher API

### 0.0.4

Endpoint URL, default groupID, artifactId and version settings

### 0.0.5

Fix typo in default endpoint URL causing catalog loading error

### 0.0.6

Files are now extracted at the root of the workspace folder

