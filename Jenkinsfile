#!/usr/bin/env groovy

node('rhel8'){
    stage('Checkout repo') {
        deleteDir()
        git url: 'https://github.com/redhat-developer/vscode-project-initializer.git'
    }

    stage('Install requirements') {
        def nodeHome = tool 'nodejs-latest'
        env.PATH="${env.PATH}:${nodeHome}/bin"
        sh "npm install -g typescript vsce"
    }

    stage('Build') {
        sh "npm install"
        sh "npm run vscode:prepublish"
    }

    withEnv(['JUNIT_REPORT_PATH=report.xml']) {
        stage('Test') {
            wrap([$class: 'Xvnc']) {
                sh "npm test --silent"
                junit 'report.xml'
            }
        }
    }

    stage('Package') {
        def packageJson = readJSON file: 'package.json'
        sh "vsce package -o project-initializer-${packageJson.version}-${env.BUILD_NUMBER}.vsix"
        sh "npm pack && mv project-initializer-${packageJson.version}.tgz project-initializer-${packageJson.version}-${env.BUILD_NUMBER}.tgz"
    }

    if(params.UPLOAD_LOCATION) {
        stage('Snapshot') {
            def filesToPush = findFiles(glob: '**.vsix')
            sh "sftp -C ${UPLOAD_LOCATION}/snapshots/vscode-project-initializer/ <<< \$'put -p \"${filesToPush[0].path}\"'"
            stash name:'vsix', includes:filesToPush[0].path
            filesToPush = findFiles(glob: '**.tgz')
            stash name:'tgz', includes:filesToPush[0].path
        }
    }

    if(publishToMarketPlace.equals('true') || publishToOVSX.equals('true')) {
        timeout(time:5, unit:'DAYS') {
            input message:'Approve deployment?', submitter: 'jmaury'
        }

        if(publishToMarketPlace.equals('true')) {
            stage("Publish to Marketplace") {
                unstash 'vsix'
                unstash 'tgz'
                withCredentials([[$class: 'StringBinding', credentialsId: 'vscode_java_marketplace', variable: 'TOKEN']]) {
                    def vsix = findFiles(glob: '**.vsix')
                    sh 'vsce publish -p ${TOKEN} --packagePath' + " ${vsix[0].path}"
                }

                archiveArtifacts artifacts:"**.vsix,**.tgz"

                stage "Promote the build to stable"
                def vsix = findFiles(glob: '**.vsix')
                sh "sftp -C ${UPLOAD_LOCATION}/stable/vscode-project-initializer/ <<< \$'put -p \"${vsix[0].path}\"'"
                def tgz = findFiles(glob: '**.tgz')
                sh "sftp -C ${UPLOAD_LOCATION}/stable/vscode-project-initializer/ <<< \$'put -p \"${tgz[0].path}\"'"
            }
        }

        if (publishToOVSX.equals('true')) {
            // Open-vsx Marketplace
            sh "npm install -g ovsx"
            withCredentials([[$class: 'StringBinding', credentialsId: 'open-vsx-access-token', variable: 'OVSX_TOKEN']]) {
                def vsix = findFiles(glob: '**.vsix')
                sh 'ovsx publish -p ${OVSX_TOKEN}' + " ${vsix[0].path}"
            }
        }
    }
}
