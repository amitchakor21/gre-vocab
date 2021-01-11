provider "aws" {
  alias   = "dnsdelegate"
}

# AWS us-east-1 provider.
# Required to attach cert to cloudfront.
provider "aws" {
 alias = "virginia"
 region = "us-east-1"
}