variable "region" {
  description = "Primary AWS region"
  type        = string
  default     = "eu-west-1"
}

variable "stage" {
  description = "Deployment stage (dev, prod, …)"
  type        = string
  default     = "dev"
}

variable "project" {
  description = "Project name used in resource naming"
  type        = string
  default     = "cloud-ecommerce"
}
