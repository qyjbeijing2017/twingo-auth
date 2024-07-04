pipeline{
    agent any
    options{
        timeout(time: 30, unit: 'MINUTES')
    }
    stages{
        stage("Build"){
            steps{
                echo "========executing Build========"
                sh "docker compose up --build twingo-auth -d"
            }
            post{
                success{
                    echo "========Build executed successfully========"
                }
                failure{
                    echo "========Build execution failed========"
                }
            }
        }
    }
    post{
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}