pipeline {
    agent any

    environment {
        IMAGE_NAME = "nandhudocker01/ecommerce-backend:latest"
        DOCKER_CREDENTIALS_ID = "docker-cred"
    }

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

        // ✅ BUILD FIRST
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Create Network') {
            steps {
                sh 'docker network create test-net || true'
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

                echo "⏳ Waiting for MongoDB..."
                sleep 20
                '''
            }
        }

        // ✅ TEST NEW IMAGE (not old one)
        stage('Run Tests') {
            steps {
                sh '''
                docker rm -f test-backend || true

                docker run -d \
                --name test-backend \
                --network test-net \
                -e NODE_ENV=test \
                -e MONGO_URI=mongodb://test-mongo:27017/ecommerce_test \
                $IMAGE_NAME

                echo "⏳ Waiting for backend..."
                sleep 40

                echo "📜 Backend logs:"
                docker logs test-backend

                echo "🧪 Running tests..."
                docker exec test-backend npm test || (
                  echo "❌ Container crashed. Logs:"
                  docker logs test-backend
                  exit 1
                )
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_CREDENTIALS_ID}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $IMAGE_NAME
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s-files/'
            }
        }
    }

    post {
        always {
            sh '''
            echo "🧹 Cleaning up..."
            docker rm -f test-backend || true
            docker rm -f test-mongo || true
            '''
        }
    }
}
