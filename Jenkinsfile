pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git url: 'https://github.com/NandhiniRavi01/CICDpipeline_monitoring.git', branch: 'main'
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
        docker run -d -p 27018:27017 --name test-mongo mongo:4.4 --noauth
        '''
    }
}

        stage('Test') {
            steps {
                sh 'NODE_ENV=test npm test'
            }
        }

        stage('Build Docker') {
            steps {
                sh 'docker build -t nandhudocker01/ecommerce-backend:latest .'
            }
        }

        stage('Push Docker') {
            steps {
                sh 'docker push nandhudocker01/ecommerce-backend:latest'
            }
        }

        stage('Deploy K8s') {
            steps {
                sh 'kubectl apply -f k8s-files/'
            }
        }
    }
}
