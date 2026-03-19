 pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "nandhudocker01/ecommerce-backend:latest"
        DOCKER_CREDENTIALS_ID = "dockerhub-cred"   // Jenkins credentials
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/NandhiniRavi01/CICDpipeline_monitoring.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $DOCKER_IMAGE .
                '''
            }
        }

        stage('Create Network') {
            steps {
                sh '''
                docker network create test-net || true
                '''
            }
        }

        stage('Start MongoDB (Test)') {
            steps {
                sh '''
                docker rm -f test-mongo || true

                docker run -d \
                --name test-mongo \
                --network test-net \
                mongo:4.4
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                docker rm -f test-backend || true

                docker run -d \
                --name test-backend \
                --network test-net \
                -e NODE_ENV=test \
                -e MONGO_URI=mongodb://test-mongo:27017/ecommerce_test \
                $DOCKER_IMAGE

                echo "Waiting for container..."
                sleep 15

                docker exec test-backend npm test
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "$DOCKER_CREDENTIALS_ID",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $DOCKER_IMAGE
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f k8s-files/
                '''
            }
        }
    }

    post {
        always {
            sh '''
            docker rm -f test-backend || true
            docker rm -f test-mongo || true
            '''
        }

        success {
            echo "✅ Pipeline Success: Build, Test, Deploy completed"
        }

        failure {
            echo "❌ Pipeline Failed"
        }
    }
}
