# ---------------------------------------- #
# AVM Required Variables
# ---------------------------------------- #
# Naming conventions and handy little doodads
variable "environment" {}
variable "environment_short" {}

# Organization settings
variable "deployment-level-OU-arn" {}

# VPC lookups 
variable "us-east-2-vpc-id" {}
variable "us-east-2a-subnet-id" {}
variable "us-east-2b-subnet-id" {}
variable "us-east-2c-subnet-id" {}

variable "internal_networks" {
  default = ["172.16.0.0/12", "10.0.0.0/8", "149.173.0.0/16", "192.168.0.0/16"]
}

variable "shared_service_account_id" {}

# ---------------------------------------- #
# Refarch/Project implementation Variables
# ---------------------------------------- #
variable "cloudfront_distribution_price_class" {
  type        = string
  description = "The price class to use for cloudfront distribution. This controls how many cloudfront regions will be used for edge compute caching."
}
