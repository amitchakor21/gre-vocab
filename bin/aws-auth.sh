#!/bin/bash
#
#
# PURPOSE: Sets AWS Auth and Terraform for a AVM project to run in a bitbucket pipeline
#
# set -n   # Uncomment to check your syntax, without execution.
#          # NOTE: Do not forget to put the comment back in or
#          #       the shell script will not execute!
# set -x   # Uncomment to debug this shell script 
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

# validate required named parameters
if [ -z "$deploymentLevel" ]; then
    echo -e "\nPlease pass --deploymentLevel <deploymentLevel> to run this command!\n"
    exit 1
fi


echo -e "\nRESOLVING ACCOUNT ID:"
echo "----------------------------------------"
if [ "$deploymentLevel" == "DEV" ]
then
	export AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID_DEV 
	export ENVIRONMENT=development 
elif [ "$deploymentLevel" == "STAGING" ]
then
	export AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID_STAGE
	export ENVIRONMENT=staging
elif [ "$deploymentLevel" == "PROD" ]
then
	export AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID_PROD
	export ENVIRONMENT=production
else
	echo "Not a valid deployment level!" 
	exit 1
fi

echo -e "\nSTARTING AWS AUTH:"
echo "----------------------------------------"
echo "DEPLOYMENT_LEVEL: $deploymentLevel"

if [ -d "infra/infrastructure_backend/" ]
then
	echo "Backend files found; setting them to $deploymentLevel"
	# Updating the backend files...
	if [ "$deploymentLevel" == "DEV" ]
	then
		export TF_BACKEND="infrastructure_backend/$ENVIRONMENT.backend"
		sed -i "s/{DEV_ACCOUNT_ID}/$AWS_ACCOUNT_ID/" $BITBUCKET_CLONE_DIR/infra/$TF_BACKEND
		sed -i "s/{STATE_OBJECT_NAME}/$TF_STATE_OBJECT_NAME/" $BITBUCKET_CLONE_DIR/infra/$TF_BACKEND
	elif [ "$deploymentLevel" == "STAGING" ]
	then
		export TF_BACKEND="infrastructure_backend/$ENVIRONMENT.backend"
		sed -i "s/{STAGE_ACCOUNT_ID}/$AWS_ACCOUNT_ID/" $BITBUCKET_CLONE_DIR/infra/$TF_BACKEND
		sed -i "s/{STATE_OBJECT_NAME}/$TF_STATE_OBJECT_NAME/" $BITBUCKET_CLONE_DIR/infra/$TF_BACKEND
	elif [ "$deploymentLevel" == "PROD" ]
	then
		export TF_BACKEND="infrastructure_backend/$ENVIRONMENT.backend"
		sed -i "s/{PROD_ACCOUNT_ID}/$AWS_ACCOUNT_ID/" $BITBUCKET_CLONE_DIR/infra/$TF_BACKEND
		sed -i "s/{STATE_OBJECT_NAME}/$TF_STATE_OBJECT_NAME/" $BITBUCKET_CLONE_DIR/infra/$TF_BACKEND
	else
		echo "Not a valid deployment level!"
		exit 1
	fi
else
	echo "No backend files found; terraform not functional here!"
fi

echo "Fetching AWS Keys for $AWS_ACCOUNT_ID via $GUT_ENDPOINT.  Token is not printed."
# get aws session
accessData=`curl -H "Content-Type: application/json" -d "{\"token\":\"$gutToken\", \"accountid\":\"$AWS_ACCOUNT_ID\", \"deploymentLevel\":\"$deploymentLevel\"}" $GUT_ENDPOINT 2>/dev/null`

echo "Retrieved credential payload from AWS, it is `echo $accessData | wc -c` bytes long."
# export aws session details
export AWS_ACCESS_KEY_ID=`echo $accessData | jq .AccessKeyId -r`
export AWS_SESSION_TOKEN=`echo $accessData | jq .SessionToken -r`
export AWS_SECRET_ACCESS_KEY=`echo $accessData | jq .SecretAccessKey -r`

# Some sanity checking about auth results
if [ `echo -n "$AWS_ACCESS_KEY_ID" | wc -c` -ne 20 ]
then
	echo "ERROR: Access key appears invalid."
	exit 1
fi
if [ `echo -n "$AWS_SECRET_ACCESS_KEY" | wc -c` -ne 40 ]
then
	echo "ERROR: Secret access key appears invalid."
	exit 1
fi

export AWS_DEFAULT_REGION=$AWS_REGION
echo "Set AWS default region to $AWS_REGION"

echo "AUTH COMPLETED FOR ACCOUNT: $AWS_ACCOUNT_ID, ENV: $ENVIRONMENT"


