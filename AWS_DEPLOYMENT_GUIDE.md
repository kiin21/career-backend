# AWS Deployment Guide - Career Backend

## Tổng quan Architecture

```
Internet → ALB → ECS Fargate → RDS PostgreSQL
                    ↓
                 S3 Bucket
                    ↓
              CloudWatch Logs
```

## 📋 Prerequisites

- AWS CLI được cài đặt và cấu hình
- Docker được cài đặt
- GitHub account với repo chứa code

## 🚀 Bước 1: Tạo ECR Repository

```bash
# Tạo ECR repository
aws ecr create-repository --repository-name career-backend --region ap-southeast-1

# Lấy login command cho Docker
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 412381742784.dkr.ecr.ap-southeast-1.amazonaws.com
```

## 🗄️ Bước 2: Tạo RDS PostgreSQL Database

### 2.1 Tạo DB Subnet Group

```bash
aws rds create-db-subnet-group \
    --db-subnet-group-name career-db-subnet-group \
    --db-subnet-group-description "Career DB Subnet Group" \
    --subnet-ids subnet-12345678 subnet-87654321 \
    --region ap-southeast-1
```

### 2.2 Tạo Security Group cho RDS

```bash
aws ec2 create-security-group \
    --group-name career-rds-sg \
    --description "Career RDS Security Group" \
    --vpc-id vpc-12345678

# Cho phép kết nối PostgreSQL từ ECS
aws ec2 authorize-security-group-ingress \
    --group-id sg-rds123456 \
    --protocol tcp \
    --port 5432 \
    --source-group sg-ecs123456
```

### 2.3 Tạo RDS Instance

```bash
aws rds create-db-instance \
    --db-instance-identifier career-production-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.3 \
    --master-username career_admin \
    --master-user-password "YOUR_SECURE_PASSWORD" \
    --allocated-storage 20 \
    --storage-type gp2 \
    --vpc-security-group-ids sg-rds123456 \
    --db-subnet-group-name career-db-subnet-group \
    --backup-retention-period 7 \
    --storage-encrypted \
    --region ap-southeast-1
```

## 🔧 Bước 3: Tạo IAM Roles

### 3.1 ECS Task Execution Role

```bash
# Tạo trust policy
cat > ecs-task-execution-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Tạo role
aws iam create-role \
    --role-name ecsTaskExecutionRole \
    --assume-role-policy-document file://ecs-task-execution-trust-policy.json

# Attach policy
aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

### 3.2 ECS Task Role (cho S3 access)

```bash
# Tạo task role
aws iam create-role \
    --role-name ecsTaskRole \
    --assume-role-policy-document file://ecs-task-execution-trust-policy.json

# Attach S3 policy
aws iam attach-role-policy \
    --role-name ecsTaskRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
```

## 📦 Bước 4: Lưu trữ Secrets trong AWS Systems Manager

```bash
# Database secrets
aws ssm put-parameter \
    --name "/career-backend/database-host" \
    --value "your-rds-endpoint.region.rds.amazonaws.com" \
    --type "SecureString"

aws ssm put-parameter \
    --name "/career-backend/database-username" \
    --value "career_admin" \
    --type "SecureString"

aws ssm put-parameter \
    --name "/career-backend/database-password" \
    --value "YOUR_SECURE_PASSWORD" \
    --type "SecureString"

aws ssm put-parameter \
    --name "/career-backend/database-name" \
    --value "career_production" \
    --type "SecureString"

# JWT secrets (generate với openssl rand -base64 32)
aws ssm put-parameter \
    --name "/career-backend/jwt-secret" \
    --value "YOUR_JWT_SECRET" \
    --type "SecureString"

aws ssm put-parameter \
    --name "/career-backend/refresh-secret" \
    --value "YOUR_REFRESH_SECRET" \
    --type "SecureString"
```

## 🌐 Bước 5: Tạo ECS Cluster và Service

### 5.1 Tạo ECS Cluster

```bash
aws ecs create-cluster \
    --cluster-name career-backend-cluster \
    --capacity-providers FARGATE \
    --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1
```

### 5.2 Tạo CloudWatch Log Group

```bash
aws logs create-log-group \
    --log-group-name /ecs/career-backend \
    --region ap-southeast-1
```

### 5.3 Register Task Definition

```bash
# Update task definition với Account ID của bạn
sed -i 's/YOUR_ACCOUNT_ID/123456789012/g' aws/ecs-task-definition.json

aws ecs register-task-definition \
    --cli-input-json file://aws/ecs-task-definition.json
```

### 5.4 Tạo Security Group cho ECS

```bash
aws ec2 create-security-group \
    --group-name career-ecs-sg \
    --description "Career ECS Security Group" \
    --vpc-id vpc-12345678

# Cho phép HTTP traffic từ ALB
aws ec2 authorize-security-group-ingress \
    --group-id sg-ecs123456 \
    --protocol tcp \
    --port 3000 \
    --source-group sg-alb123456
```

### 5.5 Tạo ECS Service

```bash
aws ecs create-service \
    --cluster career-backend-cluster \
    --service-name career-backend-service \
    --task-definition career-backend-task:1 \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678,subnet-87654321],securityGroups=[sg-ecs123456],assignPublicIp=ENABLED}"
```

## ⚖️ Bước 6: Tạo Application Load Balancer

### 6.1 Tạo ALB

```bash
aws elbv2 create-load-balancer \
    --name career-backend-alb \
    --subnets subnet-12345678 subnet-87654321 \
    --security-groups sg-alb123456
```

### 6.2 Tạo Target Group

```bash
aws elbv2 create-target-group \
    --name career-backend-tg \
    --protocol HTTP \
    --port 3000 \
    --vpc-id vpc-12345678 \
    --target-type ip \
    --health-check-path /api/v1/health
```

### 6.3 Tạo Listener

```bash
aws elbv2 create-listener \
    --load-balancer-arn arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:loadbalancer/app/career-backend-alb/1234567890123456 \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:targetgroup/career-backend-tg/1234567890123456
```

### 6.4 Update ECS Service với Load Balancer

```bash
aws ecs update-service \
    --cluster career-backend-cluster \
    --service career-backend-service \
    --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:targetgroup/career-backend-tg/1234567890123456,containerName=career-backend,containerPort=3000
```

## 🚀 Bước 7: Setup GitHub Actions

### 7.1 Tạo IAM User cho GitHub Actions

```bash
aws iam create-user --user-name github-actions-user

# Attach policy cho ECR và ECS
aws iam attach-user-policy \
    --user-name github-actions-user \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser

aws iam attach-user-policy \
    --user-name github-actions-user \
    --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess

# Tạo access key
aws iam create-access-key --user-name github-actions-user
```

### 7.2 Add GitHub Secrets

Trong GitHub repository, vào Settings > Secrets and variables > Actions và thêm:

- `AWS_ACCESS_KEY_ID`: Access Key từ bước trên
- `AWS_SECRET_ACCESS_KEY`: Secret Key từ bước trên

## 🔧 Bước 8: Domain và SSL (Optional)

### 8.1 Tạo ACM Certificate

```bash
aws acm request-certificate \
    --domain-name api.your-domain.com \
    --validation-method DNS \
    --region ap-southeast-1
```

### 8.2 Update ALB Listener cho HTTPS

```bash
aws elbv2 modify-listener \
    --listener-arn arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:listener/app/career-backend-alb/1234567890123456/1234567890123456 \
    --protocol HTTPS \
    --port 443 \
    --certificates CertificateArn=arn:aws:acm:ap-southeast-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

## 📊 Monitoring và Troubleshooting

### CloudWatch Logs

```bash
# Xem logs
aws logs tail /ecs/career-backend --follow
```

### ECS Service Status

```bash
# Check service status
aws ecs describe-services \
    --cluster career-backend-cluster \
    --services career-backend-service
```

### RDS Status

```bash
# Check RDS status
aws rds describe-db-instances \
    --db-instance-identifier career-production-db
```

## 💰 Cost Optimization Tips

1. **ECS Fargate**: Sử dụng t3.micro (512 CPU, 1GB memory) cho development
2. **RDS**: Sử dụng db.t3.micro với 20GB storage
3. **S3**: Enable S3 Intelligent Tiering
4. **CloudWatch**: Set log retention period (7-30 days)

## 🔄 Deployment Process

1. Push code lên GitHub main branch
2. GitHub Actions sẽ tự động:
   - Run tests
   - Build Docker image
   - Push lên ECR
   - Deploy lên ECS

## 🔧 Local Testing với Production Config

```bash
# Build production image
docker build -f Dockerfile.prod -t career-backend:prod .

# Run với production compose
docker-compose -f docker-compose.prod.yaml up
```

## 📝 Notes

- Thay thế tất cả `YOUR_ACCOUNT_ID`, `subnet-*`, `sg-*` bằng giá trị thực tế
- Đảm bảo VPC và subnets đã tồn tại
- Backup database định kỳ
- Monitor costs thường xuyên
- Use AWS Secrets Manager cho production thực tế
