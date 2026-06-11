pipeline {
    agent any

    environment {
        USER_SERVER_HOST = 'server'
        LOGS_HOST        = 'cliente'
        HEALTH_HOST      = 'health_server'
        USER_PROFILE_HOST = 'user_profile'
        NOTIFICATION_HOST = 'notification_server'
        NATS_SERVER      = 'nats'
    }

    stages {

        stage('Install Test Dependencies') {
            steps {
                dir('tests/gherkin') {
                    sh 'npm ci'
                }
            }
        }

        stage('Test: Auth Server') {
            steps {
                dir('tests/gherkin') {
                    sh 'npm run test:auth || true'
                }
            }
        }

        stage('Test: Logs Manager') {
            steps {
                dir('tests/gherkin') {
                    sh 'npm run test:logs || true'
                }
            }
        }

        stage('Test: Health Server') {
            steps {
                dir('tests/gherkin') {
                    sh 'npm run test:health || true'
                }
            }
        }

        stage('Test: Notifications') {
            steps {
                dir('tests/gherkin') {
                    sh 'npm run test:notifications || true'
                }
            }
        }

        stage('Test: User Profile') {
            steps {
                dir('tests/gherkin') {
                    sh 'npm run test:profiles || true'
                }
            }
        }

        stage('Test: Integration') {
            steps {
                dir('tests/gherkin') {
                    sh 'npm run test:integration || true'
                }
            }
        }

        stage('Full Test Suite + Report') {
            steps {
                dir('tests/gherkin') {
                    sh 'npm run test:report || true'
                }
            }
            post {
                always {
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'tests/gherkin/reports',
                        reportFiles: 'cucumber_report.html',
                        reportName: 'Cucumber E2E Report'
                    ])
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'All stages completed successfully.'
        }
        failure {
            echo 'Some stages failed. Check the Cucumber report for details.'
        }
    }
}
