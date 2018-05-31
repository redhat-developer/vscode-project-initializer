import * as request from 'request'

export class Catalog {
    private missions:any;
    private runtimes:any;
    constructor(readonly endpoint:string) {}

    getMissions() : Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            if (this.missions) {
                resolve(this.missions)
            } else {
                request(this.endpoint + "/booster-catalog/missions", (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(this.missions = JSON.parse(body));
                    }

                });

            }
        });
    }

    getRuntimes() : Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            if (this.runtimes) {
                resolve(this.missions)
            } else {
                request(this.endpoint + "/booster-catalog/runtimes", (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(this.runtimes = JSON.parse(body));
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