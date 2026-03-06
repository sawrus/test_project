# Rule: Cost Governance

**Priority**: P1 — Cost overruns trigger mandatory audit.

## Constraints

1. **Budget alerts**: Every AWS account/GCP project must have billing alerts at 80% and 100% of monthly budget.
2. **No oversized defaults**: Default instance type for new services is `t3.small` (AWS) / `e2-small` (GCP). Larger requires justification.
3. **Data transfer awareness**: Cross-AZ and cross-region transfer costs estimated before architectural decisions.
4. **Unused resource policy**: Resources with zero traffic for 7 days trigger review notification. Idle for 30 days → terminated.
5. **Reserved/committed use**: Any workload running continuously > 3 months must have RI/CUD analysis completed.
