#!/bin/bash

# Create VPC Endpoints for ECR Access from Private Subnets
# This is the recommended approach for production environments

REGION="ap-southeast-1"
PROJECT_NAME="career-backend"

echo "🔧 Creating VPC Endpoints for ECR access..."

# Get VPC ID
VPC_ID=$(aws ec2 describe-vpcs --region $REGION --query 'Vpcs[0].VpcId' --output text)
echo "🌐 VPC ID: $VPC_ID"

# Get route table for private subnets
ROUTE_TABLE_ID=$(aws ec2 describe-route-tables \
    --region $REGION \
    --filters "Name=vpc-id,Values=$VPC_ID" \
    --query 'RouteTables[0].RouteTableId' \
    --output text)

echo "🛣️ Route Table ID: $ROUTE_TABLE_ID"

# Get ECS security group
ECS_SG_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=${PROJECT_NAME}-ecs-sg" \
    --region $REGION \
    --query 'SecurityGroups[0].GroupId' \
    --output text)

echo "🔒 ECS Security Group: $ECS_SG_ID"

# 1. Create VPC Endpoint for ECR Docker Registry
echo "📦 Creating VPC Endpoint for ECR Docker Registry..."
ECR_DKR_ENDPOINT=$(aws ec2 create-vpc-endpoint \
    --vpc-id $VPC_ID \
    --service-name com.amazonaws.${REGION}.ecr.dkr \
    --vpc-endpoint-type Interface \
    --subnet-ids $(aws ec2 describe-subnets --region $REGION --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0:2].SubnetId' --output text | tr '\t' ' ') \
    --security-group-ids $ECS_SG_ID \
    --private-dns-enabled \
    --region $REGION \
    --query 'VpcEndpoint.VpcEndpointId' \
    --output text 2>/dev/null || \
    aws ec2 describe-vpc-endpoints \
    --region $REGION \
    --filters "Name=service-name,Values=com.amazonaws.${REGION}.ecr.dkr" "Name=vpc-id,Values=$VPC_ID" \
    --query 'VpcEndpoints[0].VpcEndpointId' \
    --output text)

echo "✅ ECR Docker Registry Endpoint: $ECR_DKR_ENDPOINT"

# 2. Create VPC Endpoint for ECR API
echo "🔌 Creating VPC Endpoint for ECR API..."
ECR_API_ENDPOINT=$(aws ec2 create-vpc-endpoint \
    --vpc-id $VPC_ID \
    --service-name com.amazonaws.${REGION}.ecr.api \
    --vpc-endpoint-type Interface \
    --subnet-ids $(aws ec2 describe-subnets --region $REGION --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0:2].SubnetId' --output text | tr '\t' ' ') \
    --security-group-ids $ECS_SG_ID \
    --private-dns-enabled \
    --region $REGION \
    --query 'VpcEndpoint.VpcEndpointId' \
    --output text 2>/dev/null || \
    aws ec2 describe-vpc-endpoints \
    --region $REGION \
    --filters "Name=service-name,Values=com.amazonaws.${REGION}.ecr.api" "Name=vpc-id,Values=$VPC_ID" \
    --query 'VpcEndpoints[0].VpcEndpointId' \
    --output text)

echo "✅ ECR API Endpoint: $ECR_API_ENDPOINT"

# 3. Create VPC Endpoint for S3 (Gateway type for ECR image layers)
echo "🪣 Creating VPC Endpoint for S3..."
S3_ENDPOINT=$(aws ec2 create-vpc-endpoint \
    --vpc-id $VPC_ID \
    --service-name com.amazonaws.${REGION}.s3 \
    --vpc-endpoint-type Gateway \
    --route-table-ids $ROUTE_TABLE_ID \
    --region $REGION \
    --query 'VpcEndpoint.VpcEndpointId' \
    --output text 2>/dev/null || \
    aws ec2 describe-vpc-endpoints \
    --region $REGION \
    --filters "Name=service-name,Values=com.amazonaws.${REGION}.s3" "Name=vpc-id,Values=$VPC_ID" \
    --query 'VpcEndpoints[0].VpcEndpointId' \
    --output text)

echo "✅ S3 Gateway Endpoint: $S3_ENDPOINT"

# 4. Create VPC Endpoint for CloudWatch Logs
echo "📊 Creating VPC Endpoint for CloudWatch Logs..."
LOGS_ENDPOINT=$(aws ec2 create-vpc-endpoint \
    --vpc-id $VPC_ID \
    --service-name com.amazonaws.${REGION}.logs \
    --vpc-endpoint-type Interface \
    --subnet-ids $(aws ec2 describe-subnets --region $REGION --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0:2].SubnetId' --output text | tr '\t' ' ') \
    --security-group-ids $ECS_SG_ID \
    --private-dns-enabled \
    --region $REGION \
    --query 'VpcEndpoint.VpcEndpointId' \
    --output text 2>/dev/null || \
    aws ec2 describe-vpc-endpoints \
    --region $REGION \
    --filters "Name=service-name,Values=com.amazonaws.${REGION}.logs" "Name=vpc-id,Values=$VPC_ID" \
    --query 'VpcEndpoints[0].VpcEndpointId' \
    --output text)

echo "✅ CloudWatch Logs Endpoint: $LOGS_ENDPOINT"

# 5. Create VPC Endpoint for SSM (for parameter store secrets)
echo "🔐 Creating VPC Endpoint for SSM..."
SSM_ENDPOINT=$(aws ec2 create-vpc-endpoint \
    --vpc-id $VPC_ID \
    --service-name com.amazonaws.${REGION}.ssm \
    --vpc-endpoint-type Interface \
    --subnet-ids $(aws ec2 describe-subnets --region $REGION --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0:2].SubnetId' --output text | tr '\t' ' ') \
    --security-group-ids $ECS_SG_ID \
    --private-dns-enabled \
    --region $REGION \
    --query 'VpcEndpoint.VpcEndpointId' \
    --output text 2>/dev/null || \
    aws ec2 describe-vpc-endpoints \
    --region $REGION \
    --filters "Name=service-name,Values=com.amazonaws.${REGION}.ssm" "Name=vpc-id,Values=$VPC_ID" \
    --query 'VpcEndpoints[0].VpcEndpointId' \
    --output text)

echo "✅ SSM Endpoint: $SSM_ENDPOINT"

# 6. Update security group to allow HTTPS traffic to VPC endpoints
echo "🔒 Updating security group for VPC endpoint access..."
aws ec2 authorize-security-group-egress \
    --group-id $ECS_SG_ID \
    --protocol tcp \
    --port 443 \
    --cidr 10.0.0.0/8 \
    --region $REGION 2>/dev/null || echo "✅ VPC HTTPS egress rule already exists"

echo "✅ VPC Endpoints setup complete!"
echo ""
echo "🔍 Verify endpoints:"
echo "   aws ec2 describe-vpc-endpoints --region $REGION --vpc-endpoint-ids $ECR_DKR_ENDPOINT $ECR_API_ENDPOINT $S3_ENDPOINT $LOGS_ENDPOINT $SSM_ENDPOINT"
echo ""
echo "🚀 Now retry your ECS deployment:"
echo "   aws ecs update-service --cluster ${PROJECT_NAME}-cluster --service ${PROJECT_NAME}-service --desired-count 1 --region $REGION"