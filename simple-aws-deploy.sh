#!/bin/bash
set -e

echo "🚀 Starting Notes9 AWS Deployment - Fast Track"

# Configuration
REGION="us-east-1"
STACK_NAME="notes9-prod"
ECR_BACKEND_REPO="notes9-backend"
ECR_WEB_REPO="notes9-web"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "📍 Account ID: $ACCOUNT_ID"
echo "📍 Region: $REGION"

# Step 1: Create ECR repositories
echo "🐳 Creating ECR repositories..."
aws ecr create-repository --repository-name $ECR_BACKEND_REPO --region $REGION 2>/dev/null || echo "Backend repo already exists"
aws ecr create-repository --repository-name $ECR_WEB_REPO --region $REGION 2>/dev/null || echo "Web repo already exists"

# Step 2: Get ECR login
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Step 3: Build and push backend image
echo "🔨 Building backend image..."
docker build -f Dockerfile.dev -t $ECR_BACKEND_REPO:latest .
docker tag $ECR_BACKEND_REPO:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_BACKEND_REPO:latest
echo "📤 Pushing backend image..."
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_BACKEND_REPO:latest

# Step 4: Build and push web image  
echo "🔨 Building web image..."
docker build -f Dockerfile.web -t $ECR_WEB_REPO:latest .
docker tag $ECR_WEB_REPO:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_WEB_REPO:latest
echo "📤 Pushing web image..."
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_WEB_REPO:latest

# Step 5: Create RDS database
echo "🗄️ Creating RDS database..."
aws rds create-db-instance \
    --db-instance-identifier notes9-db \
    --db-name affine \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username affine \
    --master-user-password affinepassword123 \
    --allocated-storage 20 \
    --publicly-accessible \
    --region $REGION 2>/dev/null || echo "Database already exists"

# Step 6: Create ElastiCache Redis
echo "🔴 Creating Redis cluster..."
aws elasticache create-cache-cluster \
    --cache-cluster-id notes9-redis \
    --cache-node-type cache.t3.micro \
    --engine redis \
    --num-cache-nodes 1 \
    --region $REGION 2>/dev/null || echo "Redis cluster already exists"

# Step 7: Get database and redis endpoints
echo "⏳ Waiting for database to be available..."
aws rds wait db-instance-available --db-instance-identifier notes9-db --region $REGION

DB_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier notes9-db --query 'DBInstances[0].Endpoint.Address' --output text --region $REGION)
REDIS_ENDPOINT=$(aws elasticache describe-cache-clusters --cache-cluster-id notes9-redis --show-cache-node-info --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' --output text --region $REGION)

echo "🎯 Database endpoint: $DB_ENDPOINT"
echo "🎯 Redis endpoint: $REDIS_ENDPOINT"

# Step 8: Create Application Load Balancer
echo "⚖️ Creating Application Load Balancer..."
ALB_ARN=$(aws elbv2 create-load-balancer \
    --name notes9-alb \
    --subnets subnet-0a1b2c3d4e5f6g7h8 subnet-0h8g7f6e5d4c3b2a1 \
    --security-groups sg-0123456789abcdef0 \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4 \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text \
    --region $REGION 2>/dev/null || echo "ALB creation failed - will use default VPC")

# Note: In a real deployment, you'd need to create proper VPC, subnets, and security groups
# For speed, we'll use AWS App Runner instead

echo "🏃 Using AWS App Runner for fastest deployment..."

# Create App Runner service for the web application
cat > apprunner-config.yaml << EOF
version: 1.0
runtime: docker
build:
  commands:
    build:
      - echo "Using pre-built image"
run:
  runtime-version: latest
  command: yarn affine dev -p @affine/web
  network:
    port: 8080
    env: PORT
  env:
    - name: AFFINE_SERVER_EXTERNAL_URL
      value: http://localhost:3010
    - name: NODE_ENV
      value: production
EOF

echo "🎉 Docker images built and pushed successfully!"
echo ""
echo "📋 Next steps to complete deployment:"
echo "1. Go to AWS App Runner console: https://console.aws.amazon.com/apprunner/"
echo "2. Create a new App Runner service"
echo "3. Use container image: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_WEB_REPO:latest"
echo "4. Configure port 8080"
echo ""
echo "🌐 Or use ECS with these images:"
echo "Backend: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_BACKEND_REPO:latest"
echo "Web: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_WEB_REPO:latest"
echo ""
echo "📊 Resources created:"
echo "- Database: $DB_ENDPOINT"
echo "- Redis: $REDIS_ENDPOINT"
echo "- ECR repositories ready with images"
