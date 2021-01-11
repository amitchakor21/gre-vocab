# Random String to ensure unique S3 Bucket Name
resource "random_string" "bucket_name" {
  length  = 6
  special = false
  upper   = false
}

# The bucket that will store your web app in S3
resource "aws_s3_bucket" "web_app" {
  bucket = "${var.environment}-s3-web-app-${random_string.bucket_name.result}"
  acl    = "private"

  tags = local.common_tags
}

# Secure our S3 bucket so that is only accessible through cloudfront.
resource "aws_s3_bucket_public_access_block" "web_app" {
  bucket = aws_s3_bucket.web_app.id

  block_public_acls   = true
  block_public_policy = true
}

# The policy that provides cloudfront with read access to the S3 bucket that stores your web app.
resource "aws_s3_bucket_policy" "web_app_cloudfront_access" {
  bucket = aws_s3_bucket.web_app.id

  policy = <<POLICY
{
    "Version": "2008-10-17",
    "Id": "PolicyForCloudFrontPrivateContent",
    "Statement": [
        {
            "Sid": "1",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.origin_access_identity.id}"
            },
            "Action": "s3:GetObject",
            "Resource": "${aws_s3_bucket.web_app.arn}/*"
        }
    ]
}
POLICY
}
