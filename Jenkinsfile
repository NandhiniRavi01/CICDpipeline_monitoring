pipeline {
    agent any

   

    stages {

        stage('Checkout') {
    steps {
        git branch: 'main', url: 'https://github.com/NandhiniRavi01/CICDpipeline_monitoring.git'
    }
}
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Start Mongo') {
            steps {
                sh '''
                docker rm -f test-mongo || true

                docker run -d -p 27018:27017 \
                --name test-mongo mongo:4.4 --noauth

                echo "Waiting for MongoDB to start..."
                sleep 10
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                echo "Running tests..."
                NODE_ENV=test npm test
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker rm -f test-mongo || true'
            }
        }
    }
}
