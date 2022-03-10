# Project Initializer

[![Visual Studio Marketplace](https://vsmarketplacebadge.apphb.com/version/redhat.project-initializer.svg)](https://marketplace.visualstudio.com/items?itemName=redhat.project-initializer)
[![Visual Studio Marketplace](https://vsmarketplacebadge.apphb.com/installs/redhat.project-initializer.svg)](https://marketplace.visualstudio.com/items?itemName=redhat.project-initializer)
[![Build Status](https://travis-ci.com/redhat-developer/vscode-project-initializer.svg?branch=master)](https://travis-ci.com/redhat-developer/vscode-project-initializer)
[![Build status](https://ci.appveyor.com/api/projects/status/bndhekqk8lnj0s99?svg=true)](https://ci.appveyor.com/project/redhat-developer/vscode-project-initializer)

This extension is now deprecated. The underlying service used by the extension (Red Hat Launcher) is planned to be sunset in 2022. You can find similar feature on https://code.quarkus.io or with the [Red Hat OpenShift Connector extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-openshift-connector)

## Overview

A lightweight extension based on Red Hat Launcher to generate quickstart projects using Visual Studio Code (VS Code). Here's a list of features:

- Generator

## Requirements

- VS Code (version 1.19.0 or later)

## How-to

First you need to "open the folder" in VS Code in which you want to create the project.

Then, you can trigger the Project Initializer. It is available from Palette command (Ctrl+Shift+P) with the name "Project: generate a project using Project Initializer":

![Project Initializer palette entry.](images/fabric8LauncherPaletteEntry.png "Project Initializer Palette entry")

## Extension Settings

* `project.initializer.endpointUrl`: launcher service endpoint URL. Defaults to https://forge.api.openshift.io/api/
* `project.initializer.defaultGroupId`: default group id. Defaults to io.openshift
* `project.initializer.defaultArtifactId`: default artifact id. Defaults to booster
* `project.initializer.defaultVersion`: default version. Defaults to 0.0.1-SNAPSHOT

## Known Issues

None at this point.

## Release Notes

### 0.2.2

Extension deprecation

### 0.2.1

Bug fixes in telemetry library

### 0.2.0

Removed vscode-commons dependency

### 0.1.0

Add opt-in telemetry

### 0.0.10

Restore permissions on files while unzipping

### 0.0.9

Specific commands are available to create project by choosing runtime first

### 0.0.8

Switch to Project Initializer

### 0.0.7

Add VSCode recommendation files to generated projects

### 0.0.6

Files are now extracted at the root of the workspace folder

### 0.0.5

Fix typo in default endpoint URL causing catalog loading error

### 0.0.4

Endpoint URL, default groupID, artifactId and version settings

### 0.0.3

Update for new Launcher API

### 0.0.2

First missing dependency

### 0.0.1

First version for early feedback


## Data and telemetry

The Project Initializer by Red Hat for Visual Studio Code collects anonymous [usage data](USAGE_DATA.md) and sends it to Red Hat servers to help improve our products and services. Read our [privacy statement](https://developers.redhat.com/article/tool-data-collection) to learn more. This extension respects the `redhat.telemetry.enabled` setting which you can learn more about at https://github.com/redhat-developer/vscode-redhat-telemetry#how-to-disable-telemetry-reporting

