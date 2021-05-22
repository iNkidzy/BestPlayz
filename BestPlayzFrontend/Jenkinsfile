pipeline {
    agent any
    triggers{
        pollSCM("* * * * *")
    }
    stages {
        stage("Build") {
            steps {
               //echo "===== REQUIRED: Will build the website ====="
                sh "npm install"
                sh "npm run build"
                sh "docker build . -t best-playz-frontend_app"
            }
        }
        stage("Deliver") {
            steps {
            // echo " ===== REQUIRED: Will deliver the website to Docker Hub ===== "

            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'DockerHub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']])
				    {
				    	sh 'docker login -u ${USERNAME} -p ${PASSWORD}'
				    }
              sh "docker push nadiamiteva/best-playz-frontend_app"

            }
        }
        stage("Release to test environment") {
            steps {
               // echo "===== REQUIRED: Will use Docker Compose to spin up a test environment ====="
               sh "docker-compose -p staging -f docker-compose.yml -f docker-compose.test.yml up -d"

            }
        }
        stage("Automated acceptance test") {
            steps {
              echo"==== REQUIRED:Selenium in Frontend ===="
            }
        }
    }
 }
