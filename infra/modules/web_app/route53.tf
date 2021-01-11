resource "aws_acm_certificate" "internal" {
  domain_name       = var.fqdn
  validation_method = "DNS"
}

# Cloudfront requires the certificate to exist in us-east-1 virginia
resource "aws_acm_certificate" "internal-virginia" {
  provider          = aws.virginia
  domain_name       = var.fqdn
  validation_method = "DNS"
  # the same validation record is used for both us-east-1 and us-east-2
  depends_on = [aws_route53_record.internal_acm_validation]
}

resource "aws_route53_record" "internal" {
  provider = aws.dnsdelegate
  name     = var.fqdn
  type     = "A"
  zone_id  = var.route53_zone_id
  
  alias {
    # (Required) DNS domain name for a CloudFront distribution, S3 bucket, ELB, or another resource record set in this hosted zone.
    name = aws_cloudfront_distribution.s3_web_app.domain_name
    # (Required) Hosted zone ID for a CloudFront distribution, S3 bucket, ELB, or Route 53 hosted zone.
    zone_id = aws_cloudfront_distribution.s3_web_app.hosted_zone_id
    # (Required) Set to true if you want Route 53 to determine whether to respond to DNS queries using this resource record set by checking the health of the resource record set.
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "internal_acm_validation" {
  provider = aws.dnsdelegate
  for_each = {
    for dvo in aws_acm_certificate.internal.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 300
  type            = each.value.type
  zone_id         = var.route53_zone_id
}

# Cloudfront requires the certificate to exist in us-east-1 virginia. Validate that it is available
resource "aws_acm_certificate_validation" "cert" {
  provider        = aws.virginia
  certificate_arn = aws_acm_certificate.internal-virginia.arn
}