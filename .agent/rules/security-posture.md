# Rule: Security Posture

**Priority**: P0 — Violations block deployment.

## Constraints

1. **Least Privilege (IAM)**: Every IAM role scoped to minimum actions and resources. Wildcards (`*`) in `Action` or `Resource` forbidden in production without documented exception.
2. **No secrets in state or code**: Terraform state must be encrypted (S3 + KMS). No credentials in `.tf` files or CI YAML.
3. **Encrypted at rest and in transit**: All storage (S3, RDS, EBS) encrypted. All inter-service communication uses TLS ≥ 1.2.
4. **Network isolation**: Production workloads in private subnets. Public exposure only via load balancer with WAF. Security groups default-deny inbound.
5. **Tagging compliance**: Every resource must have tags: `Owner`, `Environment`, `CostCenter`, `Terraform=true`.
6. **MFA on human IAM users**: All human AWS accounts require MFA. Service accounts use IAM roles, never long-lived access keys.
