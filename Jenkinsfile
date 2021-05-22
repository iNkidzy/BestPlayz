pipeline {
    agent any
        stages {
            stage("Build") {
                steps {
                    parallel(
                        bestPlayzBackend: {
                            sh "npm install"
                            sh "npm run build"
                            sh "docker build . -t nadiamiteva/BestPlayzBackend:${BUILD_NUMBER}"
                        }
                        bestPlayzFrontend: {
                            sh "ng build"
                            sh "docker build . -t nadiamiteva/BestPlayzFrontend:${BUILD_NUMBER}"
                        }
                    )  
                }

            }
            stage("Deliver") {
                steps {
                        parallel(
                            bestPlayzBackend: {
                                withCredentials([usernamePassword(credentialsId: 'DockerHub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                                sh 'docker login -u ${USERNAME} -p ${PASSWORD}'
                                sh "docker push nadiamiteva/BestPlayzBackend:${BUILD_NUMBER}"
                                }
                            },
                            bestPlayzFrontend: {
                                withCredentials([usernamePassword(credentialsId: 'DockerHub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                                sh 'docker login -u ${USERNAME} -p ${PASSWORD}'
                                sh "docker push nadiamiteva/BestPlayzFrontend:${BUILD_NUMBER}"
                                }
                            }
                        )         
                    }
                }
            stage("Release to test") {
                steps {
                    sh "docker-compose -p staging -f docker-compose.yml -f docker-compose.test.yml up -d"
                }
            }

        }
}