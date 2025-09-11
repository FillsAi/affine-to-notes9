# Notes9 AWS Deployment Guide

## Complete Step-by-Step Production Deployment

This guide documents the complete deployment process for Notes9 (built on AFFiNE) to AWS, including all troubleshooting steps and solutions encountered during the deployment.

---

## 🎯 **Final Result**

- **✅ Web App:** http://YOUR-EC2-IP:8080 (Fully functional)
- **⚠️ Backend API:** Some configuration challenges remain
- **💰 Monthly Cost:** ~$90 (EC2 xlarge + RDS + Redis + bandwidth)

---

## 📋 **Prerequisites**

### Required Tools

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# Install Docker
# For macOS: Docker Desktop
# For Linux: docker.io package

# Configure AWS credentials
aws configure
```

### AWS Account Requirements

- Active AWS account with billing enabled
- IAM user with administrator permissions
- AWS CLI configured with access keys

---

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Users         │    │   EC2 Instance  │    │   AWS Services  │
│                 │    │   (ARM64)       │    │                 │
│ Web Browser ────┼────┼─► Web:8080      │    │ RDS PostgreSQL  │
│                 │    │   Backend:3010  ├────┼─► Redis Cache   │
│                 │    │   (16GB RAM)    │    │ ECR Registry    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 **Deployment Steps**

### Step 1: Build and Push Docker Images

```bash
# Configure AWS ECR login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR-ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com

# Create ECR repositories
aws ecr create-repository --repository-name notes9-backend --region us-east-1
aws ecr create-repository --repository-name notes9-web --region us-east-1

# Build and tag images (ARM64 for Apple Silicon)
docker build -t notes9-backend -f Dockerfile.dev .
docker build -t notes9-web -f Dockerfile.web .

# Tag for ECR
docker tag notes9-backend:latest YOUR-ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com/notes9-backend:latest
docker tag notes9-web:latest YOUR-ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com/notes9-web:latest

# Push to ECR
docker push YOUR-ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com/notes9-backend:latest
docker push YOUR-ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com/notes9-web:latest
```

### Step 2: Create AWS Infrastructure

#### 2.1 Create Database (RDS PostgreSQL)

```bash
aws rds create-db-instance \
  --db-instance-identifier notes9-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username affine \
  --master-user-password affinepassword123 \
  --allocated-storage 20 \
  --publicly-accessible \
  --region us-east-1
```

#### 2.2 Create Redis Cache (ElastiCache)

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id notes9-redis \
  --engine redis \
  --cache-node-type cache.t3.micro \
  --num-cache-nodes 1 \
  --region us-east-1
```

#### 2.3 Create Security Groups

```bash
# Create EC2 security group
EC2_SG=$(aws ec2 create-security-group \
  --group-name notes9-ec2-sg \
  --description "Notes9 EC2 Security Group" \
  --region us-east-1 \
  --query 'GroupId' --output text)

# Add rules to EC2 security group
aws ec2 authorize-security-group-ingress --group-id $EC2_SG --protocol tcp --port 22 --cidr 0.0.0.0/0 --region us-east-1
aws ec2 authorize-security-group-ingress --group-id $EC2_SG --protocol tcp --port 8080 --cidr 0.0.0.0/0 --region us-east-1
aws ec2 authorize-security-group-ingress --group-id $EC2_SG --protocol tcp --port 3010 --cidr 0.0.0.0/0 --region us-east-1

# Create and configure RDS security group
RDS_SG=$(aws rds describe-db-instances --db-instance-identifier notes9-db --query 'DBInstances[0].VpcSecurityGroups[0].VpcSecurityGroupId' --output text --region us-east-1)

aws ec2 authorize-security-group-ingress \
  --group-id $RDS_SG \
  --protocol tcp \
  --port 5432 \
  --source-group $EC2_SG \
  --region us-east-1
```

### Step 3: Launch EC2 Instance

#### 3.1 Create SSH Key Pair

```bash
aws ec2 create-key-pair --key-name notes9-key --query 'KeyMaterial' --output text > notes9-key.pem
chmod 400 notes9-key.pem
```

#### 3.2 Launch ARM64 Instance with Sufficient Memory

```bash
# Find ARM64 AMI
ARM64_AMI=$(aws ec2 describe-images \
  --owners amazon \
  --filters "Name=name,Values=amzn2-ami-hvm-*-arm64-gp2" "Name=state,Values=available" \
  --query 'Images|sort_by(@,&CreationDate)[-1].ImageId' \
  --output text --region us-east-1)

# Launch t4g.xlarge instance (16GB RAM - CRITICAL for webpack build)
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id $ARM64_AMI \
  --instance-type t4g.xlarge \
  --key-name notes9-key \
  --security-group-ids $EC2_SG \
  --associate-public-ip-address \
  --block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"VolumeSize":30,"VolumeType":"gp2","DeleteOnTermination":true}}]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=notes9-server}]' \
  --region us-east-1 \
  --query 'Instances[0].InstanceId' \
  --output text)

# Wait for instance to be running
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region us-east-1

# Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text --region us-east-1)

echo "Instance launched! IP: $PUBLIC_IP"
```

### Step 4: Setup EC2 Instance

```bash
# Connect to EC2 instance
ssh -o StrictHostKeyChecking=no -i notes9-key.pem ec2-user@$PUBLIC_IP

# Install Docker and AWS CLI
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# Install AWS CLI for ARM64
curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure set aws_access_key_id YOUR_ACCESS_KEY
aws configure set aws_secret_access_key YOUR_SECRET_KEY
aws configure set default.region us-east-1

# Login to ECR
aws ecr get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin YOUR-ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com
```

### Step 5: Run Application Containers

#### 5.1 Get Database and Redis Endpoints

```bash
# Get RDS endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier notes9-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text --region us-east-1)

# Get Redis endpoint
REDIS_ENDPOINT=$(aws elasticache describe-cache-clusters \
  --cache-cluster-id notes9-redis \
  --show-cache-node-info \
  --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' \
  --output text --region us-east-1)
```

#### 5.2 Start Backend Container

```bash
sudo docker run -d --name backend -p 3010:3010 --restart unless-stopped \
  -e DATABASE_URL="postgresql://affine:affinepassword123@${DB_ENDPOINT}:5432/affine?sslmode=require" \
  -e REDIS_SERVER_HOST="$REDIS_ENDPOINT" \
  -e REDIS_SERVER_PORT="6379" \
  -e NODE_ENV="production" \
  -e AFFINE_ENV="prod" \
  -e DEPLOYMENT_TYPE="selfhosted" \
  -e SERVER_FLAVOR="allinone" \
  YOUR-ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com/notes9-backend:latest
```

#### 5.3 Start Web Container

```bash
sudo docker run -d --name web -p 8080:8080 --restart unless-stopped \
  -e NODE_ENV="production" \
  -e AFFINE_SERVER_EXTERNAL_URL="http://${PUBLIC_IP}:3010" \
  -e HOST="0.0.0.0" \
  -e PORT="8080" \
  YOUR-ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com/notes9-web:latest
```

---

## 🔧 **Troubleshooting Guide**

### Issue 1: Webpack Build Fails (Memory Issues)

**Symptoms:** Web container crashes with memory errors
**Solution:** Use t4g.xlarge (16GB RAM) instead of smaller instances

```bash
# Upgrade instance type
aws ec2 stop-instances --instance-ids $INSTANCE_ID --region us-east-1
aws ec2 wait instance-stopped --instance-ids $INSTANCE_ID --region us-east-1
aws ec2 modify-instance-attribute --instance-id $INSTANCE_ID --instance-type Value=t4g.xlarge --region us-east-1
aws ec2 start-instances --instance-ids $INSTANCE_ID --region us-east-1
```

### Issue 2: Architecture Mismatch (ARM64 vs x86_64)

**Symptoms:** "exec format error" when running containers
**Solution:** Use ARM64 EC2 instances (t4g family) with ARM64 Docker images

### Issue 3: Database Connection Issues

**Symptoms:** "Can't reach database server"
**Solution:** Fix security group rules

```bash
# Add PostgreSQL access rule
aws ec2 authorize-security-group-ingress \
  --group-id $RDS_SG \
  --protocol tcp \
  --port 5432 \
  --source-group $EC2_SG \
  --region us-east-1
```

### Issue 4: Container Networking

**Symptoms:** Services not accessible from outside
**Solution:** Ensure proper port bindings and security groups

```bash
# Check container ports
sudo docker ps
# Check security group rules
aws ec2 describe-security-groups --group-ids $EC2_SG --region us-east-1
```

---

## 💰 **Cost Breakdown**

| Service       | Instance Type     | Monthly Cost   |
| ------------- | ----------------- | -------------- |
| EC2           | t4g.xlarge (16GB) | ~$60           |
| RDS           | db.t3.micro       | ~$13           |
| ElastiCache   | cache.t3.micro    | ~$12           |
| Data Transfer | Standard rates    | ~$5            |
| **Total**     |                   | **~$90/month** |

---

## 📊 **Performance Notes**

### Memory Requirements

- **Minimum:** 8GB RAM for webpack build
- **Recommended:** 16GB RAM (t4g.xlarge) for stable builds
- **Storage:** 30GB minimum for Docker images and builds

### Build Times

- **Webpack Build:** 15-20 minutes on t4g.xlarge
- **Docker Image Pull:** 5-10 minutes (depending on connection)
- **Total Deployment:** 30-45 minutes

---

## 🛡️ **Security Considerations**

### Production Recommendations

1. **Database Security:**

   - Use RDS with encryption at rest
   - Enable SSL connections
   - Restrict access to specific subnets

2. **Network Security:**

   - Use VPC with private subnets
   - Implement proper security group rules
   - Enable CloudTrail logging

3. **Container Security:**
   - Use minimal base images
   - Scan images for vulnerabilities
   - Implement proper secrets management

---

## 🔄 **Deployment Variants Attempted**

### ❌ CloudFormation + ECS Fargate

- **Issue:** Architecture mismatch (ARM64 vs x86_64)
- **Status:** Failed - complex configuration

### ❌ ECS with Manual Setup

- **Issue:** Task execution permissions and log group access
- **Status:** Partially working but complex

### ✅ EC2 with Docker (Final Solution)

- **Status:** Working
- **Pros:** Simple, direct control, easier troubleshooting
- **Cons:** Manual scaling, more maintenance

---

## 📝 **Maintenance Tasks**

### Regular Maintenance

```bash
# Update containers
docker pull YOUR-ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com/notes9-web:latest
docker pull YOUR-ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com/notes9-backend:latest
docker restart web backend

# Monitor logs
docker logs web --tail 50
docker logs backend --tail 50

# Database backups
aws rds create-db-snapshot \
  --db-instance-identifier notes9-db \
  --db-snapshot-identifier "notes9-backup-$(date +%Y%m%d)" \
  --region us-east-1
```

### Scaling Considerations

- **Vertical Scaling:** Upgrade EC2 instance type
- **Horizontal Scaling:** Use Application Load Balancer + Auto Scaling Groups
- **Database Scaling:** Consider RDS read replicas for read-heavy workloads

---

## 🎯 **Success Metrics**

### ✅ Achieved

- Web application fully functional
- Docker images built and deployed successfully
- AWS infrastructure provisioned
- Proper memory allocation (16GB) for webpack builds
- ARM64 architecture compatibility resolved

### ⚠️ Partially Achieved

- Backend API (configuration issues remain)
- Database migrations (manual intervention required)

### 🔄 Future Improvements

- Automate database migrations
- Implement proper secrets management
- Add SSL/HTTPS support
- Implement monitoring and alerting

---

## 📞 **Support & Troubleshooting**

### Useful Commands

```bash
# Check container status
sudo docker ps -a

# View logs
sudo docker logs [container_name] --tail 50 -f

# Connect to container
sudo docker exec -it [container_name] bash

# Restart services
sudo docker restart web backend

# Check AWS resource status
aws rds describe-db-instances --region us-east-1
aws elasticache describe-cache-clusters --region us-east-1
```

### Log Locations

- **Container Logs:** `docker logs [container_name]`
- **System Logs:** `/var/log/` on EC2 instance
- **Application Logs:** Inside containers at `/app/logs/`

---

## 🏁 **Final Notes**

This deployment successfully demonstrates:

1. **Complex monorepo application deployment** on AWS
2. **ARM64 architecture handling** for Apple Silicon compatibility
3. **Memory-intensive webpack builds** in cloud environment
4. **Multi-service infrastructure** setup (Database, Cache, Compute)
5. **Docker containerization** of complex applications

The deployment provides a solid foundation for a production Notes9 application with room for optimization and scaling.

**Deployment Date:** September 2025  
**Documentation Version:** 1.0  
**Last Updated:** Complete deployment process documented
