#!/bin/bash
#
#
# PURPOSE: Execute terraform plan in a bitbucket pipeline
#
# set -n   # Uncomment to check your syntax, without execution.
#          # NOTE: Do not forget to put the comment back in or
#          #       the shell script will not execute!
# set -x   # Uncomment to debug this shell script (Korn shell only)
#
set -e 

# enable named parameters
while [ $# -gt 0 ]; do

   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
   fi

  shift
done

echo -e "\nSTARTING TERRFORM PLAN:"
echo "----------------------------------------"
echo "ENVIRONMENT: $ENVIRONMENT"
echo "AWS_ACCOUNT_ID: $AWS_ACCOUNT_ID" 
echo "TF_BACKEND: $TF_BACKEND"

VARS_COMMAND=""
if [ ! -z "$vars" ]
then
    echo "VARS_COMMAND: $vars"
    VARS_COMMAND=$vars
fi

pushd ./infra
terraform init -backend-config=$TF_BACKEND
terraform plan -destroy -var-file=application_tfvars/$ENVIRONMENT.tfvars -var-file=infrastructure_tfvars/$ENVIRONMENT.tfvars $VARS_COMMAND -out destroy-$ENVIRONMENT.plan
popd