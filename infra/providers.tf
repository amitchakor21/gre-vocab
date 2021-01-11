provider "aws" {
  region = "us-east-2"
}

provider "aws" {
  alias  = "dnsdelegate"
  region = "us-east-2"
  assume_role {
    role_arn     = "arn:aws:iam::${var.shared_service_account_id}:role/avm-dnsdelegate"
    session_name = "AVMDNS"
  }
}

provider "aws" {
  alias  = "endpointdelegate"
  region = "us-east-2"
  assume_role {
    role_arn     = "arn:aws:iam::${var.shared_service_account_id}:role/avm-endpointdelegate"
    session_name = "AVM_VPC_ENDPOINT"
  }
}
