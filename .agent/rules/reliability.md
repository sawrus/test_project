# Rule: Reliability Standards

**Priority**: P1 — Required before production promotion.

## SLO Defaults

| Service Tier | Availability | RTO | RPO |
|:---|:---|:---|:---|
| Tier 1 (revenue-critical) | 99.9% | 30 min | 15 min |
| Tier 2 (internal tools) | 99.5% | 4 hours | 1 hour |
| Tier 3 (batch/async) | 99.0% | 24 hours | 24 hours |

## Constraints

1. **No single points of failure**: All Tier 1 services run with minimum 2 replicas across 2 AZs.
2. **Graceful shutdown**: All containers handle `SIGTERM` with ≥ 30s drain before `SIGKILL`.
3. **Readiness before liveness**: K8s probes must define `readinessProbe` before `livenessProbe`.
4. **Defined resource limits**: Every container must specify `resources.requests` and `resources.limits`.
5. **Chaos budget**: Tier 1 services must pass a basic chaos test (pod kill, node drain) before going live.
