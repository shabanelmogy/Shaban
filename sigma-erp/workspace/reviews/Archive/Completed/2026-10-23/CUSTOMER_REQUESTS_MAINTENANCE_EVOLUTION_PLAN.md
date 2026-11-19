# Customer Requests maintenance / evolution

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

Implementation-authorized request: review CustomerRequests and apply canonical
documents, with images1/2/3. PLAN-00 discovery precedes implementation; target
handoff is CUSTOMER_REQUESTS_SHARED_CONTRACT_FREEZE.md including dated customer
ownership amendment. This plan does not introduce a parallel request system.

Impact: existing frontend list/details/models/routes/service, live Partner
customer picker, CustomerRequest entity/config/VM/profile/service/interface/
controller, owning EN/AR messages and Administration in-app guide. No reports,
financial/accounting effects, permissions or changes to other feature owners.
Feature-scoped files initially clean; preserve other dirty repository changes.

| Area | Classification | Reason |
|---|---|---|
| CustomerRequest owner and CRUD | Keep / extend | Existing generic routes, tenancy and soft delete are reusable |
| Customer reference | Refactor | Actual Customer/GetSelect returns Individual/Company Partner ids; old FK is legacy Customer |
| Request status | Create within existing owner | Screenshot shows Open/Close; minimal durable Open0/Closed1, no reopen |
| Legacy list/form stubs | Replace | Console-only saves, no picker/filters; shared list + modal control composition |
| DTO/profile | Refactor | Only grid/editor inputs; no audit/tenant writes or nested customer graphs |
| FullList/spec/style scaffolding | Remove | No FullList consumer; wrong component spec imports and unused empty styles |
| Guide/translations | Extend | Existing Administration reader/menu, bilingual screen topic |

Alternatives and reasons are frozen in the handoff: no IsActive overload, new
entity/system, invented numbering sequence, permission API or nonpersisted state.
Owner explicitly confirms table empty/testdata. Existing test links must be
inspected/remapped before owner applies FK migration; no destructive data command
authorized. Nullable inputs/max1000 retained from existing VM/entity; no required
or duplicate rule invented. Closed edit/delete remains current ordinary CRUD.

Implementation sequence: freeze shared contract; independent backend and frontend
work; root integration/guide; full scoped source reconciliation. Backend agent
owns only backend feature and localization; root frontend/guide/artifacts.
Verification: source JSON/TS/template parsing, DTO/filter/action/route/translation
comparison and Git scoped diff/whitespace. No build/test/lint/runtime/browser/DB/
migration/commit/push/deployment. Owner build and manual full cycle pending.
Migration: ChangeCustomerRequestCustomerReferenceAndAddStatus; owner checks any
legacy FK values and status defaults before applying.
