#!/bin/bash

# Fix ECS networking by creating NAT Gateway for reliable ECR access

REGION="ap-southeast-1"
VPC_ID="vpc-0da9e9b3da22ca3b4"
PROJECT_NAME="career-backend"

echo "🔧 Setting up NAT Gateway for reliable ECR access..."

# 1. Get public subnet (we know subnet-09067b506819974fc is public)
PUBLIC_SUBNET="subnet-09067b506819974fc"
echo "✅ Using public subnet: $PUBLIC_SUBNET"

# 2. Create NAT Gateway
echo "🌐 Creating NAT Gateway..."
# First, allocate Elastic IP
EIP_ALLOCATION=$(aws ec2 allocate-address --domain vpc --region $REGION --query 'AllocationId' --output text)
echo "✅ Allocated EIP: $EIP_ALLOCATION"

# Create NAT Gateway
NAT_GATEWAY_ID=$(aws ec2 create-nat-gateway \
    --subnet-id $PUBLIC_SUBNET \
    --allocation-id $EIP_ALLOCATION \
    --region $REGION \
    --query 'NatGateway.NatGatewayId' \
    --output text)

echo "✅ Created NAT Gateway: $NAT_GATEWAY_ID"

# 3. Wait for NAT Gateway to be available
echo "⏳ Waiting for NAT Gateway to become available..."
aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_GATEWAY_ID --region $REGION
echo "✅ NAT Gateway is available"

# 4. Create private subnets
echo "🔒 Creating private subnets..."

# Private subnet in AZ 1a
PRIVATE_SUBNET_1A=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 172.31.64.0/20 \
    --availability-zone ap-southeast-1a \
    --region $REGION \
    --query 'Subnet.SubnetId' \
    --output text)

# Private subnet in AZ 1c  
PRIVATE_SUBNET_1C=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 172.31.80.0/20 \
    --availability-zone ap-southeast-1c \
    --region $REGION \
    --query 'Subnet.SubnetId' \
    --output text)

echo "✅ Created private subnets:"
echo "   - $PRIVATE_SUBNET_1A (ap-southeast-1a)"
echo "   - $PRIVATE_SUBNET_1C (ap-southeast-1c)"

# 5. Create route table for private subnets
echo "🛣️ Creating route table for private subnets..."
PRIVATE_ROUTE_TABLE=$(aws ec2 create-route-table \
    --vpc-id $VPC_ID \
    --region $REGION \
    --query 'RouteTable.RouteTableId' \
    --output text)

echo "✅ Created private route table: $PRIVATE_ROUTE_TABLE"

# 6. Add route to NAT Gateway
aws ec2 create-route \
    --route-table-id $PRIVATE_ROUTE_TABLE \
    --destination-cidr-block 0.0.0.0/0 \
    --nat-gateway-id $NAT_GATEWAY_ID \
    --region $REGION

echo "✅ Added NAT Gateway route"

# 7. Associate private subnets with private route table
aws ec2 associate-route-table \
    --subnet-id $PRIVATE_SUBNET_1A \
    --route-table-id $PRIVATE_ROUTE_TABLE \
    --region $REGION

aws ec2 associate-route-table \
    --subnet-id $PRIVATE_SUBNET_1C \
    --route-table-id $PRIVATE_ROUTE_TABLE \
    --region $REGION

echo "✅ Associated private subnets with route table"

# 8. Tag the subnets
aws ec2 create-tags \
    --resources $PRIVATE_SUBNET_1A $PRIVATE_SUBNET_1C \
    --tags Key=Name,Value="$PROJECT_NAME-private-subnet" \
    --region $REGION

echo "✅ Tagged private subnets"

echo ""
echo "🎉 NAT Gateway setup complete!"
echo "📝 Configuration:"
echo "   NAT Gateway ID: $NAT_GATEWAY_ID"
echo "   Private Subnets: $PRIVATE_SUBNET_1A, $PRIVATE_SUBNET_1C"
echo "   Private Route Table: $PRIVATE_ROUTE_TABLE"
echo ""
echo "🚀 Now update ECS service to use private subnets:"
echo "   aws ecs update-service \\"
echo "       --cluster $PROJECT_NAME-cluster \\"
echo "       --service $PROJECT_NAME-service \\"
echo "       --network-configuration \"awsvpcConfiguration={subnets=[$PRIVATE_SUBNET_1A,$PRIVATE_SUBNET_1C],securityGroups=[sg-038f51181cb9588a1],assignPublicIp=DISABLED}\" \\"
echo "       --region $REGION"