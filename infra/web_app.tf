module "s3-cloudfront-route53-acm" {
  source = "./modules/web_app"

  web_app_name                        = "refarch-web-app"
  environment                         = var.environment_short
  route53_zone_id                     = data.aws_route53_zone.ideasrms.zone_id
  fqdn                                = "refarch-web-app.${data.aws_route53_zone.ideasrms.name}"
  cloudfront_distribution_price_class = var.cloudfront_distribution_price_class

  providers = {
    aws.dnsdelegate = aws.dnsdelegate
  }
}