#!/bin/bash
# CI/CD script (run in GitHub Actions or CodePipeline)

# Build and push images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker build -t backend ./backend -f backend/Dockerfile
docker tag backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/codejudge-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/codejudge-backend:latest

# Similar for frontend, executor

# Register ECS task definitions
aws ecs register-task-definition --cli-input-json file://ecs-task-definitions/backend-task.json
aws ecs update-service --cluster codejudge-cluster --service backend-service --task-definition codejudge-backend

# Create S3 bucket if needed
aws s3 mb s3://codejudge-assets --region us-east-1

echo "Deployment complete!"