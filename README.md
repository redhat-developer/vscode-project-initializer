# Fabric8 Launcher VSCode

[![Build Status](https://travis-ci.org/jeffmaury/fabric8-launcher-vscode-extension.svg?branch=master)](https://travis-ci.org/jeffmaury/fabric8-launcher-vscode-extension)[![Build status](https://ci.appveyor.com/api/projects/status/yomg02ev76ryron9?svg=true)](https://ci.appveyor.com/project/jeffmaury/fabric8-launcher-vscode-extension)

## Overview

A lightweight extension based on Fabric8 Launcher to generate quickstart projects using Visual Studio Code (VS Code). Here's a list of features:

- Generator

## Requirements

- VS Code (version 1.19.0 or later)

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

