pipeline {
    agent any
    
    tools {
        nodejs "node18"
    }

    environment {
        GIT_CREDENTIALS_ID = 'frontend-pr'
        GITHUB_REPO = 'demo-frontend'
    }

    options {
        skipDefaultCheckout false
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        // We'll add stages step by step here
    }

    post {
        success {
            echo "✅ Pipeline completed successfully"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
