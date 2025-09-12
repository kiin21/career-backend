#!/bin/bash

# AWS Deployment Script for Career Backend
# Region: ap-southeast-1
# Account ID: 412381742784

set -e

REGION="ap-southeast-1"
ACCOUNT_ID="412381742784"
PROJECT_NAME="career-backend"

echo "🚀 Starting AWS Deployment for $PROJECT_NAME"
echo "📍 Region: $REGION"
echo "🏢 Account: $ACCOUNT_ID"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check AWS CLI configuration
echo "🔍 Checking AWS CLI configuration..."
if ! aws sts get-caller-identity --region $REGION > /dev/null 2>&1; then
    print_error "AWS CLI not configured properly. Please run 'aws configure'"
    exit 1
fi
print_status "AWS CLI configured"

# 1. Get VPC and Subnet information
echo "🌐 Getting VPC and Subnet information..."
VPC_ID=$(aws ec2 describe-vpcs --region $REGION --query 'Vpcs[0].VpcId' --output text)
SUBNET_IDS=($(aws ec2 describe-subnets --region $REGION --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0:2].SubnetId' --output text))

if [ ${#SUBNET_IDS[@]} -lt 2 ]; then
    print_error "Need at least 2 subnets for RDS. Found: ${#SUBNET_IDS[@]}"
    exit 1
fi

print_status "VPC ID: $VPC_ID"
print_status "Subnets: ${SUBNET_IDS[*]}"

# 2. Create Security Group for RDS
echo "🔒 Creating Security Group for RDS..."
RDS_SG_ID=$(aws ec2 create-security-group \
    --group-name ${PROJECT_NAME}-rds-sg \
    --description "Security group for ${PROJECT_NAME} RDS" \
    --vpc-id $VPC_ID \
    --region $REGION \
    --query 'GroupId' \
    --output text 2>/dev/null || \
    aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=${PROJECT_NAME}-rds-sg" \
    --region $REGION \
    --query 'SecurityGroups[0].GroupId' \
    --output text)

print_status "RDS Security Group: $RDS_SG_ID"

# 3. Create Security Group for ECS
echo "🔒 Creating Security Group for ECS..."
ECS_SG_ID=$(aws ec2 create-security-group \
    --group-name ${PROJECT_NAME}-ecs-sg \
    --description "Security group for ${PROJECT_NAME} ECS" \
    --vpc-id $VPC_ID \
    --region $REGION \
    --query 'GroupId' \
    --output text 2>/dev/null || \
    aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=${PROJECT_NAME}-ecs-sg" \
    --region $REGION \
    --query 'SecurityGroups[0].GroupId' \
    --output text)

print_status "ECS Security Group: $ECS_SG_ID"

# 4. Configure Security Group Rules
echo "🔧 Configuring Security Group Rules..."

# Allow PostgreSQL access from ECS to RDS
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SG_ID \
    --protocol tcp \
    --port 5432 \
    --source-group $ECS_SG_ID \
    --region $REGION 2>/dev/null || print_warning "RDS rule might already exist"

# Allow HTTP access to ECS
aws ec2 authorize-security-group-ingress \
    --group-id $ECS_SG_ID \
    --protocol tcp \
    --port 3000 \
    --cidr 0.0.0.0/0 \
    --region $REGION 2>/dev/null || print_warning "ECS HTTP rule might already exist"

print_status "Security group rules configured"

# 5. Create DB Subnet Group
echo "🗄️ Creating DB Subnet Group..."
aws rds create-db-subnet-group \
    --db-subnet-group-name ${PROJECT_NAME}-db-subnet-group \
    --db-subnet-group-description "DB subnet group for ${PROJECT_NAME}" \
    --subnet-ids ${SUBNET_IDS[0]} ${SUBNET_IDS[1]} \
    --region $REGION 2>/dev/null || print_warning "DB subnet group might already exist"

print_status "DB Subnet Group created"

# 6. Create RDS Instance
echo "🗄️ Creating RDS PostgreSQL Instance..."
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
echo "Generated DB Password: $DB_PASSWORD"

aws rds create-db-instance \
    --db-instance-identifier ${PROJECT_NAME}-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.6 \
    --master-username career_admin \
    --master-user-password "$DB_PASSWORD" \
    --allocated-storage 20 \
    --storage-type gp2 \
    --vpc-security-group-ids $RDS_SG_ID \
    --db-subnet-group-name ${PROJECT_NAME}-db-subnet-group \
    --backup-retention-period 7 \
    --storage-encrypted \
    --publicly-accessible false \
    --region $REGION 2>/dev/null || print_warning "RDS instance might already exist"

print_status "RDS instance creation initiated"

# 7. Store secrets in SSM
echo "🔐 Storing secrets in Systems Manager..."
JWT_SECRET=$(openssl rand -base64 32)
REFRESH_SECRET=$(openssl rand -base64 32)

# Store database secrets
aws ssm put-parameter \
    --name "/${PROJECT_NAME}/database-host" \
    --value "placeholder-will-update-after-rds-ready" \
    --type "SecureString" \
    --region $REGION \
    --overwrite 2>/dev/null || true

aws ssm put-parameter \
    --name "/${PROJECT_NAME}/database-username" \
    --value "career_admin" \
    --type "SecureString" \
    --region $REGION \
    --overwrite 2>/dev/null || true

aws ssm put-parameter \
    --name "/${PROJECT_NAME}/database-password" \
    --value "$DB_PASSWORD" \
    --type "SecureString" \
    --region $REGION \
    --overwrite 2>/dev/null || true

aws ssm put-parameter \
    --name "/${PROJECT_NAME}/database-name" \
    --value "career_production" \
    --type "SecureString" \
    --region $REGION \
    --overwrite 2>/dev/null || true

# Store JWT secrets
aws ssm put-parameter \
    --name "/${PROJECT_NAME}/jwt-secret" \
    --value "$JWT_SECRET" \
    --type "SecureString" \
    --region $REGION \
    --overwrite 2>/dev/null || true

aws ssm put-parameter \
    --name "/${PROJECT_NAME}/refresh-secret" \
    --value "$REFRESH_SECRET" \
    --type "SecureString" \
    --region $REGION \
    --overwrite 2>/dev/null || true

print_status "Secrets stored in SSM"

# 8. Create IAM Roles
echo "👤 Creating IAM Roles..."

# ECS Task Execution Role
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

aws iam create-role \
    --role-name ecsTaskExecutionRole \
    --assume-role-policy-document file://ecs-task-execution-trust-policy.json 2>/dev/null || print_warning "ecsTaskExecutionRole might already exist"

aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 2>/dev/null || true

# ECS Task Role
aws iam create-role \
    --role-name ecsTaskRole \
    --assume-role-policy-document file://ecs-task-execution-trust-policy.json 2>/dev/null || print_warning "ecsTaskRole might already exist"

aws iam attach-role-policy \
    --role-name ecsTaskRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess 2>/dev/null || true

print_status "IAM Roles created"

# 9. Create ECS Cluster
echo "🚢 Creating ECS Cluster..."
aws ecs create-cluster \
    --cluster-name ${PROJECT_NAME}-cluster \
    --capacity-providers FARGATE \
    --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
    --region $REGION 2>/dev/null || print_warning "ECS cluster might already exist"

print_status "ECS Cluster created"

# 10. Create CloudWatch Log Group
echo "📊 Creating CloudWatch Log Group..."
aws logs create-log-group \
    --log-group-name /ecs/${PROJECT_NAME} \
    --region $REGION 2>/dev/null || print_warning "Log group might already exist"

print_status "CloudWatch Log Group created"

# Wait for RDS to be available
echo "⏳ Waiting for RDS instance to be available..."
echo "This may take 5-10 minutes..."

aws rds wait db-instance-available \
    --db-instance-identifier ${PROJECT_NAME}-db \
    --region $REGION

# Get RDS endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier ${PROJECT_NAME}-db \
    --region $REGION \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

print_status "RDS instance is ready: $DB_ENDPOINT"

# Update database host in SSM
aws ssm put-parameter \
    --name "/${PROJECT_NAME}/database-host" \
    --value "$DB_ENDPOINT" \
    --type "SecureString" \
    --region $REGION \
    --overwrite

print_status "Database host updated in SSM"

# Output summary
echo ""
echo "🎉 AWS Infrastructure Setup Complete!"
echo "=================================================="
echo "VPC ID: $VPC_ID"
echo "RDS Security Group: $RDS_SG_ID"
echo "ECS Security Group: $ECS_SG_ID"
echo "Database Endpoint: $DB_ENDPOINT"
echo "Database Password: $DB_PASSWORD"
echo "=================================================="
echo ""
echo "🔄 Next Steps:"
echo "1. Register ECS Task Definition"
echo "2. Create ECS Service"
echo "3. Setup Load Balancer"
echo "4. Test deployment"

# Clean up temporary files
rm -f ecs-task-execution-trust-policy.json

print_status "Setup script completed successfully!"