# The ARN of the Datadog Lambda Function that forwards logs to datadog. Subscribe
# your Cloudwatch Log Group to this ARN and your logs will appear in datadog.
data "aws_ssm_parameter" "datadog-forwarder" {
  name = "ddog_lambda_arn"
}
