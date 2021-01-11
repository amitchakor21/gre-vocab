# Reference Architecture: S3 with Cloudfront
--- 

##  What is implemented here? 
This repository deploys a static web page (located in `modules/refarch/index.html`) to an S3 bucket that is served up as a publicly accessibly website. This architecture can be used to host a static or dynamic html web application (The terraform module that creates this is called by web_app.tf). This module creates the required infrastructure to handle the below:

| AWS Tech    | Terraform File                 | What it does for us                                                                                 |
| :---------- | :----------------------------: |---------------------------------------------------------------------------------------------------: |
| S3          | /modules/web_app/s3.tf         | Provides file storage - this is where our website lives                                             |
| Cloudfront  | /modules/web_app/cloudfront.tf | Provides edge service content delivery - If I'm browsing in Europe, I hit a European content server |
| Route53     | /modules/web_app/route53.tf    | Basically DNS in AWS - friendly domain names for our clients!                                       |
| ACM         | /modules/web_app/route53.tf    | Manages our Certificates for us :)                                                                  |


## How do I use this repository? 
Like any Reference Architecture repository, you can launch it into your own AVM-based project using the following steps:

1. Fork the repository to your own Bitbucket project
2. In your new repository, enable BitBucket pipelines (Repository Settings -> Pipelines Settings -> click "Enable Pipelines")
3. Set your repository's AWS account ID variables (Repository Settings -> Pipelines Repository variables). You will need to create 4 environment variables: 

| Variable              | Value                          | What it does for us                                                                                 |
| :-------------------- | :----------------------------: |---------------------------------------------------------------------------------------------------: |
| AWS_ACCOUNT_ID_DEV    | YOUR DEV AWS ACCOUNT ID        | Provides needed information to connnect to Dev account                                              |
| AWS_ACCOUNT_ID_STAGE  | YOUR STAGE AWS ACCOUNT ID      | Provides needed information to connnect to Stage account                                            |
| AWS_ACCOUNT_ID_PROD   | YOUR PROD AWS ACCOUNT ID       | Provides needed information to connnect to Prod account                                             |
| STATE_OBJECT_NAME     | YOUR Project/Microservice Name | Provides proper naming convention for tfstate storage files                                         |


## Referance Architecture Resources
The below outlines important resources that are specific to this architecture implementation.

### [development|staging|production].tfvars
Developers should use the TFVars mechanism to define properties on a per-deployment-level basis. An example of this can be seen with the cloudfront_distribution_price_class variable that handles the price class that the cloudfront distribution will be assigned. 

The dev/stage/prod tfvars files apply to the file /variables.tf which in turn end up applying to the file /modules/web_app/variables.tf at runtime, and the terraform will then run with the associated variable assignment. In the provided example, we want to save money in Dev by limiting the price class, but in Stage and Prod we want to include more regions so we are providing different values.

## Items of Note 
1. Cache Control will be something your team needs to determine how to manage. In the example implementation, the cache control is handled by the source S3 object using metadata.

2. You will eventually want to remove the example index.html file and the associated terraform resource that deploys it as those are purely used for this example. Your web application code should live in it's own repository, and that repository should handle deploying the appropriate code to the S3 bucket that hosts your web application.


## AVM Common Resources
The below outlines important resources that are common amoungst all of the reference architecture implementations that run in the AVM model. You may have a use case to modify these, but for the most part, these parts of the repository handle the AVM connectivity for you.

### Content
*bitbucket-pipelines.yml* - The pipeline file; that's a story for a different evening. You need to enable pipelines in your repository (under Repository Settings -> Pipelines -> Settings) for this to actually turn on. 

*auth.sh* - Provides a mechanism to authenticate to cloud services (AWS, Mongo, etc...).  By default, this calls out to our AWS accounts and authenticates the repository, returning an IAM token for the pipeline to use.  It also does some variable replacement in the [development|stage|production].backend files so the pipeline will talk to the correct TFState, and so forth.  If you have custom integrations that need to be done for the pipeline to work (e.g, connect to CloudAMQP), that should be snowflaked here. 

*datadog_forwarder.tf* - Every AVM comes complete with DataDog integration out of the box; the Bootstrapper (not something we need to talk about right now) takes care of setting that up outside the context of Terraform.  This file helps you get at an SSM parameter that contains the ARN of the DataDog Lambda function, so that you can invoke it yourself for things not covered directly by the Datadog Integration (e.g, ECS' awslogs driver). 

*dns.tf* - The Shared Services accounts provide route53 for ideasrms.com.  This lets you access those zones.  Note that to talk to Route53, you need to make sure you're using the _aws.dnsdelegate_ provider.

*vpc.tf* - VPCs and all networking primatives are controlled by the Shared Services accounts; we provide the _data_ directives in this file so that you can avoid using remote state.

### Infrastructure_TFVars/
Each of the development/stage/production environment have their corresponding TFVars files.  By default, they come with relevant information about the Shared Services (for example, the subnet IDs) - this lets things like *vpc.tf* work properly. Basically, don't touch these :).