pipeline {
    agent any
        stages {
            stage("Build") {
                steps {
                    parallel(
                        BestPlayzBackend: {
                            sh "npm install"
                            sh "npm run build"
                            sh "docker build . -t nadiamiteva/BestPlayzBackend:${BUILD_NUMBER}"
                        }
                        BestPlayzFrontend: {
                            sh "npm install"
                            sh "ng build"
                            sh "docker build . -t nadiamiteva/BestPlayzFrontend:${BUILD_NUMBER}"
                        }
                    )  
                }

            }
            stage("Deliver") {
                steps {
                        parallel(
                            BestPlayzBackend: {
                                withCredentials([usernamePassword(credentialsId: 'DockerHub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                                sh 'docker login -u ${USERNAME} -p ${PASSWORD}'
                                sh "docker push nadiamiteva/BestPlayzBackend:${BUILD_NUMBER}"
                                }
                            },
                            BestPlayzFrontend: {
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