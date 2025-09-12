#!/bin/bash

REGION="ap-southeast-1"
CLUSTER="career-backend-cluster"
SERVICE="career-backend-service"

echo "🔍 Monitoring ECS Service Deployment..."

while true; do
    echo "$(date): Checking service status..."
    
    # Get service status
    SERVICE_STATUS=$(aws ecs describe-services \
        --cluster $CLUSTER \
        --services $SERVICE \
        --region $REGION \
        --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount,Deployment:deployments[0].status}' \
        --output json 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo "Service Status: $SERVICE_STATUS"
        
        # Get tasks
        TASK_ARNS=$(aws ecs list-tasks \
            --cluster $CLUSTER \
            --service-name $SERVICE \
            --region $REGION \
            --query 'taskArns' \
            --output text 2>/dev/null)
        
        if [ ! -z "$TASK_ARNS" ] && [ "$TASK_ARNS" != "None" ]; then
            echo "Active tasks found. Checking task status..."
            
            for TASK_ARN in $TASK_ARNS; do
                TASK_STATUS=$(aws ecs describe-tasks \
                    --cluster $CLUSTER \
                    --tasks $TASK_ARN \
                    --region $REGION \
                    --query 'tasks[0].{LastStatus:lastStatus,HealthStatus:healthStatus,StoppedReason:stoppedReason}' \
                    --output json 2>/dev/null)
                echo "Task Status: $TASK_STATUS"
            done
            
            # Check target group health
            TG_ARN=$(aws elbv2 describe-target-groups \
                --names career-backend-tg \
                --region $REGION \
                --query 'TargetGroups[0].TargetGroupArn' \
                --output text 2>/dev/null)
            
            if [ "$TG_ARN" != "None" ] && [ ! -z "$TG_ARN" ]; then
                TG_HEALTH=$(aws elbv2 describe-target-health \
                    --target-group-arn $TG_ARN \
                    --region $REGION \
                    --query 'TargetHealthDescriptions[*].{Target:Target.Id,Health:TargetHealth.State,Description:TargetHealth.Description}' \
                    --output json 2>/dev/null)
                echo "Target Health: $TG_HEALTH"
            fi
            
            # Test API
            echo "Testing API..."
            API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://career-backend-alb-40793301.ap-southeast-1.elb.amazonaws.com/ 2>/dev/null)
            echo "API Response Code: $API_RESPONSE"
            
            if [ "$API_RESPONSE" = "200" ] || [ "$API_RESPONSE" = "404" ]; then
                echo "🎉 API is responding! Deployment successful!"
                break
            fi
        else
            echo "No active tasks found."
        fi
    else
        echo "Error describing service"
    fi
    
    echo "Waiting 30 seconds before next check..."
    echo "----------------------------------------"
    sleep 30
done