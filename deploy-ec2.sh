#!/bin/bash

echo "🚀 Launching EC2 instance for Notes9..."

# Launch EC2 instance
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id ami-0c02fb55956c7d316 \
    --instance-type t3.medium \
    --key-name my-key \
    --security-group-ids sg-035364ca84db49ec5 \
    --subnet-id subnet-0de5beef3096a1937 \
    --associate-public-ip-address \
    --user-data '#!/bin/bash
yum update -y
yum install -y docker
service docker start
usermod -a -G docker ec2-user

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 557690595651.dkr.ecr.us-east-1.amazonaws.com

# Run backend container
docker run -d --name backend \
    -p 3010:3010 \
    -e DATABASE_URL="postgresql://affine:affinepassword123@notes9-db.crecqsg4qz25.us-east-1.rds.amazonaws.com:5432/affine" \
    -e REDIS_SERVER_HOST="notes9-redis.0uxvoc.0001.use1.cache.amazonaws.com" \
    -e REDIS_SERVER_PORT="6379" \
    -e NODE_ENV="production" \
    -e AFFINE_ENV="prod" \
    -e DEPLOYMENT_TYPE="selfhosted" \
    557690595651.dkr.ecr.us-east-1.amazonaws.com/notes9-backend:latest

# Run web container  
docker run -d --name web \
    -p 8080:8080 \
    -e NODE_ENV="production" \
    557690595651.dkr.ecr.us-east-1.amazonaws.com/notes9-web:latest
' \
    --region us-east-1 \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "✅ EC2 Instance launched: $INSTANCE_ID"
echo "⏳ Waiting for instance to start..."

aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region us-east-1

PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text --region us-east-1)

echo "🎉 Instance ready!"
echo "📍 Public IP: $PUBLIC_IP" 
echo "🌐 Web App: http://$PUBLIC_IP:8080"
echo "🔧 Backend: http://$PUBLIC_IP:3010"
echo ""
echo "⏳ Applications will be available in 2-3 minutes after containers start"
