| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Audit Trail evolution plan

Owner authorized full backend/frontend and requested generic interceptor capture on2026-10-14. The existing frontend has an `audittrail` GET assumption, broken local filtering and a dummy editor; the backend has creation/deletion metadata in HandleAudit but no audit event history/API. Repository.QueryReport already owns tenant scoping; authentication NameIdentifier represents SubscriptionId and Name supplies the actor. Extend these owners rather than duplicating them.

| Area | Classification | Impact / target |
|---|---|---|
| HandleAudit / EntityBase | Keep | Existing subscription, created/soft-delete metadata and concurrency behavior |
| EF ServerAPI registration | Extend | SaveChangesInterceptor plus generic metadata capture in the same save |
| Audit event storage | Create | Standalone append-only operational table; owner migration; no existing history invented |
| Read API | Create | Tenant read/filter/count/paging/snapshot/user choices, projection DTO only |
| Angular audit screen | Refactor | Shared report hosts, one date range, server paging/full export and failure lifecycle |
| Dummy details and broken boilerplate specs | Remove | No functional editor, API or business behavior existed |
| Module guide/vocabulary | Extend | Bilingual final workflow and capture limits |

Architecture alternatives and exact frozen rules are in AUDIT_TRAIL_FULL_STACK_CONTRACT_FREEZE.md. Generic EF capture serves all tracked EntityBase instances under the configured context without altering their business calculations. No raw SQL/bulk-write coverage is claimed. No audit deletion or new access policy. Historical domain log tables remain untouched; subscription-platform/global audit is not repurposed.

Implementation order: freeze → independent persistence/read API workers + root frontend → root wiring review/guide → scoped diff/reconciliation. Owner deploys migration before enabling saves with the new interceptor, then performs build/startup/API/rollback/retry/concurrency and responsive/RTL/theme acceptance. Source-only checks inspect schema, EF callback lifecycle, query tenant/count/snapshot boundaries, typed Angular imports/inputs, bilingual keys and complete export failure behavior.
