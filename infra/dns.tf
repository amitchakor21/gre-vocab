data "aws_route53_zone" "ideasrms" {
  provider = aws.dnsdelegate
  name     = var.environment_short == "prod" ? "ideasrms.com" : "${var.environment_short}.ideasrms.com"
}