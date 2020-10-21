#!/usr/bin/env groovy

node('rhel7'){
    stage('Checkout repo') {
        deleteDir()
        git url: 'https://github.com/redhat-developer/vscode-project-initializer.git'
    }

    stage('Install requirements') {
        def nodeHome = tool 'nodejs-12.13.1'
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
            sh "rsync -Pzrlt --rsh=ssh --protocol=28 ${filesToPush[0].path} ${UPLOAD_LOCATION}/snapshots/vscode-project-initializer/"
            stash name:'vsix', includes:filesToPush[0].path
            filesToPush = findFiles(glob: '**.tgz')
            stash name:'tgz', includes:filesToPush[0].path
        }
    }
}

node('rhel7'){
    if(publishToMarketPlace.equals('true')){
        timeout(time:5, unit:'DAYS') {
            input message:'Approve deployment?', submitter: 'jmaury'
        }

        stage("Publish to Marketplace") {
            unstash 'vsix'
            unstash 'tgz'
            withCredentials([[$class: 'StringBinding', credentialsId: 'vscode_java_marketplace', variable: 'TOKEN']]) {
                def vsix = findFiles(glob: '**.vsix')
                sh 'vsce publish -p ${TOKEN} --packagePath' + " ${vsix[0].path}"
            }

            // Open-vsx Marketplace
            sh "npm install -g ovsx"
            withCredentials([[$class: 'StringBinding', credentialsId: 'open-vsx-access-token', variable: 'OVSX_TOKEN']]) {
                def vsix = findFiles(glob: '**.vsix')
                sh 'ovsx publish -p ${OVSX_TOKEN}' + " ${vsix[0].path}"
            }

            archiveArtifacts artifacts:"**.vsix,**.tgz"

            stage "Promote the build to stable"
            def vsix = findFiles(glob: '**.vsix')
            sh "rsync -Pzrlt --rsh=ssh --protocol=28 ${vsix[0].path} ${UPLOAD_LOCATION}/stable/vscode-project-initializer/"
            def tgz = findFiles(glob: '**.tgz')
            sh "rsync -Pzrlt --rsh=ssh --protocol=28 ${tgz[0].path} ${UPLOAD_LOCATION}/stable/vscode-project-initializer/"
        }
    }
}