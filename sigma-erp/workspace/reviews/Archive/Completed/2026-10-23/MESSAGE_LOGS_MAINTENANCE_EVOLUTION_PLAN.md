| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Message Logs — implementation and producer evolution

2026-10-14. Scope approved by Arabic review-and-implement request, plus explicit clarification to add missing frontend/backend. Initial frozen API is in MESSAGE_LOGS_FULL_STACK_CONTRACT_FREEZE.md; this plan records the focused shared-producer expansion before that expansion's implementation. No speculative send workflow, SMS provider, permission or historical reconstruction.

## Existing state and impact map

| Area | Evidence | Classification / target |
|---|---|---|
| List | messageLogs/list uses uninitialized searchForm, ms-lib, dead details/create paths | Replace internals in place with shared Job list owners; keep /messageLogs |
| Read contract | Service points at absent messageLogs endpoint; enums exist on both layers | Create authenticated tenant paged/sorted read + lean ListVM |
| Storage | No outbound log entity/configuration found | Create append-only MessageLog; no existing rows rewritten; future events only |
| SMTP test | SettingsEmailSmtpModelService calls EmailHelper | Extend with result logging using shared transport |
| Reminders | FleetAlertsService.SendServiceRemindersAsync calls same EmailHelper | Extend same transport; keep selection, dedupe and first-rejection stop |
| Other email | SecurityService SendMail code is commented | Keep out of active coverage; no inferred OTP workflow |
| SMS | LeaseCustomerSmsService.SimulateAsync returns simulated counters | Keep simulation; no fabricated Delivered/Rejected log |
| Reports/Excel | Screenshot supplies Report/Export; no old typed path | Create full applied-snapshot table outputs through existing shared owners |
| Guide | Administration guide/reader/menu already exist | Extend one topic in existing guide |
| Auth/EF/DI | QueryReport, sealed-config scan, Business-service scan | Keep existing boundaries; no new permission system |

## Alternatives and decisions

1. Reusing audit events was rejected: audit metadata describes business saves, not SMTP outcomes/addresses. A separate event is the smallest correct persistence source.
2. Inferring message results from templates/settings/agreements was rejected: configuration and simulation do not prove actual delivery attempts. Log only each actual attempted send.
3. Logging twice in caller-specific code was rejected under Master5; shared MessageDeliveryService owns transport outcome plus isolated append, with typed internal DTO/outcome. No body/password persisted.
4. A generic public CRUD log API was rejected: the visible screen is read-only and delivery status is server-owned. No Add/Update/Delete/Select/UI editor.
5. A message provider/receipt integration was rejected because none exists. Delivered follows existing enum and explicitly means SMTP acceptance. No claim of inbox receipt. SMS history is empty until actual transport exists.
6. Partial failure must not trigger automatic resend: preserve per-attempt logs and disclose already accepted count. Persistence failure after acceptance reports log unavailable while preserving actual send outcome.

## Frozen implementation order and verification

Phase0 evidence/source; Phase1 entity/config/read/write ownership contract; Phase2 backend and frontend disjoint work; Phase5 route/root client/DI/shared sender integration; Phase6 full scoped diff, guide, source-only verification. Phases3/4 not applicable: no editor or state transition. Canonical owners: UI1–8/16/17/19/21–29, BE1–9/17/18; operational log is an explicit exception to mutable CRUD. Frozen contract names exact filters, nine grid fields, snapshot boundary and sizes.

Rollout: owner creates/applies Add-Migration AddMessageLogs before using the log UI and shared append capability; no migration is created/run by reviewers. No old history/backfill. Verify real SMTP success/rejection; log-write failure without resend; multi-recipient partial outcome; two-tenant isolation; date/enum/sort/page boundaries; >100 results fully print/export; filter edits/rapid paging; EN/AR, themes and responsive boundaries. Source syntax/diff inspection is not runtime or database acceptance.

No open business decision: root uses conservative source-supported decisions under Master2 standing rule and user's explicit missing-parts authorization. Runtime and schema application remain owner verification, not contract blockers.
