pipeline {
    agent {
        kubernetes {
            inheritFrom 'node-22'
        }
    }

    environment {
        REGISTRY       = 'docker.io/tonyq2k3'
        IMAGE_NAME     = "${REGISTRY}/demo-app"
        IMAGE_TAG      = "${env.BUILD_NUMBER}-${env.GIT_COMMIT?.take(7) ?: 'local'}"
        HELM_RELEASE   = 'demo-release'
        HELM_NAMESPACE = 'demo'
        CHART_PATH     = 'helm/demo-app'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                container('node') {
                    sh 'npm ci'
                }
            }
        }

        stage('Unit test') {
            steps {
                container('node') {
                    sh 'npm test'
                }
            }
        }

        stage('Docker Build') {
            steps {
                container('docker') {
                    sh '''
                        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    '''
                }
            }
        }

        stage('Docker Login') {
            steps {
                container('docker') {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh '''
                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        '''
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                container('docker') {
                    sh '''
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
            }
        }
    }
}
