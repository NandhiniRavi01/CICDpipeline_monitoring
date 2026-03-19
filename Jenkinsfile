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

                echo "⏳ Waiting for MongoDB to start..."
                sleep 15
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
        nandhudocker01/ecommerce-backend:latest

        echo "⏳ Waiting for MongoDB readiness..."

        # Wait until Mongo is actually ready
        for i in {1..10}; do
          docker exec test-mongo mongosh --eval "db.adminCommand('ping')" && break
          echo "Mongo not ready yet..."
          sleep 5
        done

        echo "⏳ Waiting for backend to stabilize..."
        sleep 10

        echo "📜 Backend logs:"
        docker logs test-backend

        echo "🧪 Running tests..."
        docker exec test-backend npm test || (echo "❌ Tests failed. Logs:" && docker logs test-backend && exit 1)
        '''
    }
}
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
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
                sh '''
                kubectl apply -f k8s-files/
                '''
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
