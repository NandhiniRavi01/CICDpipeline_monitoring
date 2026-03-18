pipeline {
agent any


stages {

    stage('Checkout') {
        steps {
            git url: 'https://github.com/NandhiniRavi01/CICDpipeline_monitoring.git', branch: 'main'
        }
    }

    stage('Install Dependencies') {
        steps {
            sh 'npm install'
        }
    }

    stage('Run Tests') {
        steps {
            sh 'npm test'
        }
    }

    stage('Start Minikube') {
        steps {
            sh 'minikube start'
        }
    }

    stage('Deploy to Kubernetes') {
        steps {
            sh 'kubectl apply -f k8s-files/'
        }
    }

    stage('Restart Deployment') {
        steps {
            sh 'kubectl rollout restart deployment ecommerce-backend'
        }
    }

    stage('Verify') {
        steps {
            sh 'kubectl get pods'
            sh 'kubectl get svc'
        }
    }
}

post {
    success {
        echo 'Deployment Successful'
    }
    failure {
        echo 'Deployment Failed'
    }
}


}
