import * as request from 'request-promise-native';

export class Catalog {
    private catalog:any;
    constructor(readonly endpoint:string) {}

    async getCatalog(): Promise<any> {
        return this.catalog || request({ 
            url: this.endpoint + "booster-catalog", 
            json: true
        }).then((catalog) => this.catalog = catalog);
    }

    zip(projectName:string, mission:string, runtime:string, runtimeVersion:string, groupId:string, artifactId:string, projectVersion:string): request.RequestPromise<any> {
        return request(this.endpoint + 'launcher/zip', {
            qs: {
                mission, 
                runtime, 
                runtimeVersion, 
                projectName, 
                groupId, 
                artifactId, 
                projectVersion, 
                ide: 'vscode'}, 
            encoding: null
        });
    }
}