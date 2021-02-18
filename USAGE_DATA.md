## [Project Initializer by Red Hat](https://github.com/redhat-developer/vscode-project-initializer)

### Usage Data

* when extension is activated
* when a command contributed by extension is executed
    * command's ID
    * command's duration time
    * command's error message (in case of exception)
    * command's specific data (see details below)
* when extension is deactivated

### Command's Specific Data Reported

#### Generate project

In addition to command's usage data (see above) `Generate project` command also reports:

* mission - the selected mission
* runtime - the selected runtime
* runtimeVersion - the version of the selected runtime
