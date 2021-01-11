#!/bin/sh
#
#
# PURPOSE: uploads directory to AWS S3 Bucket
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

# Set our Bucket Name for s3 upload
# Set our environment.js for s3 upload
if [ "$deploymentLevel" == "DEV" ]
then
    # BUCKET_NAME="dev-s3-web-app"
    ENVIRONMENT_JS="dev"
elif [ "$deploymentLevel" == "STAGING" ]
then
    # BUCKET_NAME="stage-s3-web-app"
    ENVIRONMENT_JS="stage"
elif [ "$deploymentLevel" == "PROD" ]
then
    # BUCKET_NAME="prod-s3-web-app"
    ENVIRONMENT_JS="prod"
else
    echo "Broken Logic in Setting Bucket Name!"
    exit 1
fi

# replace the default environment.js with the proper environment.js
cp -v $BITBUCKET_CLONE_DIR/apps/ui/src/environments/$ENVIRONMENT_JS/environment.js $BITBUCKET_CLONE_DIR/dist/apps/ui/environments/environment.js
# Apply the appropriate environments.js to the angular app
echo "updating environments.js"
# Inject the version into the environment.js file
    # Search: (export const environment = \\{.*)
    # Replacement: \1\n\tVersion: "${BITBUCKET_BUILD_NUMBER}" (this creates a new first line VERSION: "$VERSION")
sed -i -r "s/(export const environment = \{.*)/\1\n\tVERSION: '$VERSION',/" $BITBUCKET_CLONE_DIR/dist/apps/ui/environments/environment.js

# get the name of S3 bucket from terraform state
pushd $BITBUCKET_CLONE_DIR/infra
terraform init -backend-config=$TF_BACKEND
BUCKET_NAME=$(terraform output bucket_name)
popd

# deploy web app artifacts
echo "Deploying artifacts to $BUCKET_NAME"
aws s3 cp $BITBUCKET_CLONE_DIR/dist/apps/ui s3://$BUCKET_NAME --cache-control "max-age=31536000" --recursive
#  upload the index and environment file again, but telling it not to cache these two files as we never want the users browser to cache these two files
echo "updating index.html cache metadata"
aws s3 cp $BITBUCKET_CLONE_DIR/dist/apps/ui/index.html s3://$BUCKET_NAME/index.html --content-type "text/html" --cache-control "max-age=0, no-cache, no-store"
echo "updating environment.js cache metadata"
aws s3 cp $BITBUCKET_CLONE_DIR/dist/apps/ui/environments/environment.js s3://$BUCKET_NAME/environments/environment.js --content-type "application/x-javascript" --cache-control "max-age=0, no-cache, no-store"
