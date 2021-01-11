variable "web_app_name" {
  type    = string
  default = "refarch_update_me"
  description = "The short name of the web application that will be hosted in S3. Typically, the microservice of project name"
}

variable "environment" {
  type    = string
  description = "The environment type, dev/stage/prod"
}

variable "route53_zone_id" {
  type    = string
  description = "The hosted zone id for route 53 services"
}

variable "fqdn" {
  type    = string
  description = "The full domain name that should be used for web services URL."
}

variable "cloudfront_distribution_price_class" {
  type    = string
  default = "PriceClass_100"
  description = "The price class to use for cloudfront distribution. This controls how many cloudfront regions will be used for edge compute caching."
}