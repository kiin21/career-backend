#!/bin/bash

# Fix ECS Networking for ECR Access
# Quick fix: Use public subnets with auto-assign public IP

REGION="ap-southeast-1"
PROJECT_NAME="career-backend"

echo "🔧 Fixing ECS networking for ECR access..."

# 1. Get public subnets
echo "🌐 Finding public subnets..."
PUBLIC_SUBNETS=$(aws ec2 describe-subnets \
    --region $REGION \
    --filters "Name=map-public-ip-on-launch,Values=true" \
    --query 'Subnets[].SubnetId' \
    --output text)

if [ -z "$PUBLIC_SUBNETS" ]; then
    echo "❌ No public subnets found. You need to either:"
    echo "   1. Create public subnets with internet gateway"
    echo "   2. Use private subnets with NAT gateway"
    echo "   3. Set up VPC endpoints for ECR"
    exit 1
fi

echo "✅ Public subnets found: $PUBLIC_SUBNETS"

# 2. Update ECS security group to allow outbound HTTPS
ECS_SG_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=${PROJECT_NAME}-ecs-sg" \
    --region $REGION \
    --query 'SecurityGroups[0].GroupId' \
    --output text)

echo "🔒 Updating ECS security group rules..."
aws ec2 authorize-security-group-egress \
    --group-id $ECS_SG_ID \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0 \
    --region $REGION 2>/dev/null || echo "✅ HTTPS egress rule already exists"

aws ec2 authorize-security-group-egress \
    --group-id $ECS_SG_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 \
    --region $REGION 2>/dev/null || echo "✅ HTTP egress rule already exists"

echo "✅ Security group updated"

# 3. Create ECS service with proper network configuration
echo "🚢 Updating ECS service network configuration..."

# Stop existing service first
aws ecs update-service \
    --cluster ${PROJECT_NAME}-cluster \
    --service ${PROJECT_NAME}-service \
    --desired-count 0 \
    --region $REGION 2>/dev/null || echo "Service might not exist yet"

# Wait for service to stop
echo "⏳ Waiting for service to stop..."
sleep 30

# Create/update service with public subnets
SUBNET_ARRAY=$(echo $PUBLIC_SUBNETS | tr ' ' ',')

cat > ecs-service-config.json << EOF
{
  "serviceName": "${PROJECT_NAME}-service",
  "cluster": "${PROJECT_NAME}-cluster",
  "taskDefinition": "${PROJECT_NAME}-task",
  "desiredCount": 1,
  "launchType": "FARGATE",
  "networkConfiguration": {
    "awsvpcConfiguration": {
      "subnets": ["$(echo $PUBLIC_SUBNETS | sed 's/ /","/g')"],
      "securityGroups": ["$ECS_SG_ID"],
      "assignPublicIp": "ENABLED"
    }
  },
  "loadBalancers": [],
  "serviceRegistries": []
}
EOF

echo "📝 ECS service configuration:"
cat ecs-service-config.json

echo "🚀 Creating/updating ECS service..."
aws ecs create-service \
    --cli-input-json file://ecs-service-config.json \
    --region $REGION || \
aws ecs update-service \
    --cluster ${PROJECT_NAME}-cluster \
    --service ${PROJECT_NAME}-service \
    --desired-count 1 \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_ARRAY],securityGroups=[$ECS_SG_ID],assignPublicIp=ENABLED}" \
    --region $REGION

echo "✅ ECS service updated with public network configuration"
echo "🔍 Monitor the deployment:"
echo "   aws ecs describe-services --cluster ${PROJECT_NAME}-cluster --services ${PROJECT_NAME}-service --region $REGION"
echo "   aws logs tail /ecs/${PROJECT_NAME} --follow --region $REGION"