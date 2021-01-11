#!/bin/bash
#
#
# PURPOSE: Execute terraform apply in a bitbucket pipeline
#
# set -n   # Uncomment to check your syntax, without execution.
#          # NOTE: Do not forget to put the comment back in or
#          #       the shell script will not execute!
# set -x   # Uncomment to debug this shell script (Korn shell only)
#
set -e 

echo -e "\nSTARTING TERRFORM APPLY:"
echo "----------------------------------------"
echo "ENVIRONMENT: $ENVIRONMENT"
echo "AWS_ACCOUNT_ID: $AWS_ACCOUNT_ID" 
echo "TF_BACKEND: $TF_BACKEND"

pushd ./infra
terraform init -backend-config=$TF_BACKEND
terraform apply -auto-approve $ENVIRONMENT.plan
popd