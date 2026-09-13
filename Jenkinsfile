pipeline {
    agent {
        kubernetes {
            inheritFrom 'node-22'
        }
    }

    environment {
        REGISTRY       = 'docker.io/tonyq2k3'
        IMAGE_NAME     = "${REGISTRY}/demo-app"
        IMAGE_TAG      = "build${env.BUILD_NUMBER}-${env.GIT_COMMIT?.take(7) ?: 'local'}"
        CHART_PATH     = 'helm/demo-app'

        GITOPS_REPO    = 'github.com/TonyQ2k3/devops-demo.git'
        GITOPS_BRANCH  = 'dev'
        VALUES_FILE    = "${CHART_PATH}/values.yaml"
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

        stage('Docker Push') {
            steps {
                container('docker') {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh '''
                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                            docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        '''
                    }
                }
            }
        }
        stage('Update GitOps Repo') {
            steps {
                container('git') {
                    withCredentials([usernamePassword(
                        credentialsId: 'github-pat-cred',
                        usernameVariable: 'GIT_USER',
                        passwordVariable: 'GIT_TOKEN'
                    )]) {
                        sh '''
                            # Set Git Identity
                            git config --global user.email "jenkins-bot@concung.com"
                            git config --global user.name "jenkins-bot"

                            # Clone GitOps Repository
                            git clone https://${GIT_USER}:${GIT_TOKEN}@${GITOPS_REPO} gitops-dir
                            cd gitops-dir
                            git checkout ${GITOPS_BRANCH}

                            # Update Image Tag
                            sed -i "s/tag: .*/tag: \\"${IMAGE_TAG}\\"/" ${VALUES_FILE}

                            if [ -n "$(git status --porcelain)" ]; then
                                git add ${VALUES_FILE}
                                git commit -m "DEPLOYMENT: update demo-app image tag to ${IMAGE_TAG}"
                                git push origin ${GITOPS_BRANCH}
                            else
                                echo "No changes detected in GitOps repo."
                            fi
                        '''
                    }
                }
            }
        }
    }
}
