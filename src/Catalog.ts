import * as request from 'request'

export class Catalog {
    private catalog:any;
    constructor(readonly endpoint:string) {}

    getCatalog() : Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.catalog) {
                resolve(this.catalog)
            } else {
                request(this.endpoint + "booster-catalog", (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(this.catalog = JSON.parse(body));
                    }

                });

            }
        });
    }

    zip(name:string, missionId:string, runtimeId:string, versionId:string, groupId:string, artifactId:string, version:string) {
        return new Promise((resolve, reject) => {
            request.get(this.endpoint + '/launcher/zip', {qs: {mission:missionId,runtime:runtimeId,runtimeVersion:versionId,projectName:name,groupId:groupId,artifactId:artifactId,projectVersion:version}, encoding:null},
            (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }

            });
        });
    }
}