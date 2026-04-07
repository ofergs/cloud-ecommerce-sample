terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket       = "cloud-ecommerce-sample-tfstate"
    key          = "cloud-ecommerce/frontend/terraform.tfstate"
    region       = "eu-west-1"
    encrypt      = true
    use_lockfile = true
  }
}

provider "aws" {
  region = var.region
}

# CloudFront requires ACM certs in us-east-1.
# This alias is used only if you add a custom domain later.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
