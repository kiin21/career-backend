#!/bin/bash

# Deployment Check Script
REGION="ap-southeast-1"
PROJECT_NAME="career-backend"

echo "🔍 Checking AWS Deployment Status..."

# Check RDS
echo "🗄️ RDS Status:"
aws rds describe-db-instances \
    --db-instance-identifier ${PROJECT_NAME}-db \
    --region $REGION \
    --query 'DBInstances[0].{Status:DBInstanceStatus,Endpoint:Endpoint.Address}' \
    --output table 2>/dev/null || echo "RDS not found"

# Check ECS Cluster
echo "🚢 ECS Cluster:"
aws ecs describe-clusters \
    --clusters ${PROJECT_NAME}-cluster \
    --region $REGION \
    --query 'clusters[0].{Status:status,ActiveServices:activeServicesCount,RunningTasks:runningTasksCount}' \
    --output table

# Check ECS Service
echo "🎯 ECS Service:"
aws ecs describe-services \
    --cluster ${PROJECT_NAME}-cluster \
    --services ${PROJECT_NAME}-service \
    --region $REGION \
    --query 'services[0].{Status:status,RunningCount:runningCount,DesiredCount:desiredCount}' \
    --output table 2>/dev/null || echo "Service not found"

# Check ECS Service Events
echo "📋 ECS Service Events (Recent 3):"
aws ecs describe-services \
    --cluster ${PROJECT_NAME}-cluster \
    --services ${PROJECT_NAME}-service \
    --region $REGION \
    --query 'services[0].events[0:3].[createdAt,message]' \
    --output table 2>/dev/null || echo "No events found"

# Check Load Balancer
echo "⚖️ Load Balancer:"
ALB_DNS=$(aws elbv2 describe-load-balancers \
    --names ${PROJECT_NAME}-alb \
    --region $REGION \
    --query 'LoadBalancers[0].DNSName' \
    --output text 2>/dev/null)

if [ "$ALB_DNS" != "None" ] && [ ! -z "$ALB_DNS" ]; then
    echo "ALB DNS: $ALB_DNS"
    echo "Testing API..."
    curl -I http://$ALB_DNS/ 2>/dev/null || echo "API not responding"
else
    echo "ALB not found"
fi

# Check Target Group Health
echo "🎯 Target Group Health:"
TG_ARN=$(aws elbv2 describe-target-groups \
    --names ${PROJECT_NAME}-tg \
    --region $REGION \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text 2>/dev/null)

if [ "$TG_ARN" != "None" ] && [ ! -z "$TG_ARN" ]; then
    aws elbv2 describe-target-health \
        --target-group-arn $TG_ARN \
        --region $REGION \
        --query 'TargetHealthDescriptions[*].{Target:Target.Id,Health:TargetHealth.State}' \
        --output table 2>/dev/null || echo "No targets found"
else
    echo "Target group not found"
fi

# Check CloudWatch Logs
echo "📊 Recent CloudWatch Logs:"
aws logs tail /ecs/${PROJECT_NAME} \
    --since 10m \
    --region $REGION 2>/dev/null | tail -10 || echo "No logs found"

echo "✅ Deployment check completed"