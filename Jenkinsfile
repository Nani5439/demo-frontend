pipeline {
    agent any

    tools {
        nodejs "node18"
    }

    stages {
        stage('Verify Node.js') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Create .npmrc') {
            steps {
                withCredentials([string(credentialsId: 'NPM_RC', variable: 'NPM_RC_TOKEN')]) {
                    sh '''
                        echo "@fortawesome:registry=https://npm.fontawesome.com/" > .npmrc
                        echo "//npm.fontawesome.com/:_authToken=${NPM_RC_TOKEN}" >> .npmrc
                    '''
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Run App') {
            steps {
                sh 'npm start'
            }
        }
    }
}
