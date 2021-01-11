resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "Origin Access Identity used for S3 based Web Application fronted by Cloudfront"
}

resource "aws_cloudfront_distribution" "s3_web_app" {
  depends_on = [aws_acm_certificate_validation.cert]

  origin {
    domain_name = aws_s3_bucket.web_app.bucket_regional_domain_name
    origin_id   = var.web_app_name

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  aliases = [trimsuffix(var.fqdn, ".")]

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Some comment describing the app or microservice. Example: Hello World web App CloudFront distribution "
  default_root_object = "index.html"

  # Cache behavior will be important for your application implementation. 
  # This well depend on what type of app you are hosting and how it is being stored and deployed to S3
  # The below example assumes that you are using header based cached control coming from metadata in the S3 object.
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.web_app_name

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  price_class = var.cloudfront_distribution_price_class

  tags = local.common_tags

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.internal-virginia.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }
}