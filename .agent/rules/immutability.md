# Rule: Immutable Infrastructure

**Priority**: P0 — No exceptions. Manual changes to running infra are a firing-level incident.

## Constraints

1. **No SSH/console patching**: Running instances are never modified in place. Fix = new image + redeploy.
2. **All infrastructure is code**: Every resource in production must have a corresponding Terraform resource. Resources without IaC are subject to automatic termination.
3. **Terraform is the single source of truth**: Never use the cloud console to create, modify, or delete resources.
4. **Module versioning**: All Terraform modules pinned to specific version tags. No `?ref=main` in production.
5. **Immutable image tags**: Container images in production use content-addressed digests (`image@sha256:...`), never `:latest`.

## Enforcement

- `terraform plan` reviewed in every PR via automated comment
- Drift detection runs every 6 hours via `/drift-check` workflow
- OPA policy blocks `terraform apply` if plan contains manually-created resources
