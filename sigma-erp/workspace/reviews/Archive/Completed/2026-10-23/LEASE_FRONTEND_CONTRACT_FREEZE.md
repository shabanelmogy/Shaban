# Lease frontend conformance handoff — 2026-10-06

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

## Scope and authority

User authorizes review and implementation of `SiGmaAngularFrontEnd/src/app/modules/Lease` against the documentation. The frontend working tree was clean at discovery. No new screenshots were supplied; historical screenshot classifications remain in the earlier feature artifacts. Authority is Sigma AGENTS.md, Master 4/5/7 and current UI books plus each feature's frozen business contract. The recipe check reports all packets stale except Phase 1; use canonical blocks, never edit generated packets.

## Frozen boundaries

- Preserve current typed domain payloads, backend calculations, transitions, eligibility flags and endpoints. Inspect directly related backend contracts read-only; a genuinely missing material business decision blocks only that slice. Older discovery artifacts are historical: later action freezes and current source supersede their earlier missing-action inventories.
- Normal list/modal shapes: LeaseClause, LeaseCostParameter, LeaseCostSetting (one child collection, no totals), LeaseInquiry. Use Job list and VehicleService modal references.
- Routed aggregate shapes: LeaseAgreement and LeaseQuotation (multiple children/totals); LeaseMasterAgreement View (approval/children, creation remains the existing quotation action); LeaseTariff (four child collections) adopts the routed shared document editor under UI13 D4-2. Use Job editor; stateful action dialogs use Job close-job.
- LeaseCustomerSms is the existing operational simulation list, not a new delivery integration. Preserve its simulation-only API.
- closedLeaseAgreements is a closed subset of LeaseAgreement, not a separate write aggregate. Current service names a nonexistent `closedLeaseAgreementss` controller; use confirmed LeaseAgreement list query with `isClosed=true`, backend paging and existing View. Do not invent a closed-agreement create/write API.
- LeaseCostSettingItem has no registered UI ownership and standalone writes were explicitly rejected in its parent freeze. Do not resurrect this path; reconcile dead route exports without adding standalone CRUD.
- Backend patterns: ordinary parameter/clause records use Pattern1; inquiry/quotation/agreement/tariff/cost-setting use existing aggregate contracts (Pattern2, with already-owned accounting transitions kept intact); closed records are a filtered read, SMS operational exception. No backend/schema change is authorized by a frontend conformance finding.
- All inline API failure consumers must send `X-Skip-Error-Interceptor` and reuse apiErrorMessage/composedReadErrorMessage. Standard mutations retain one global success toast. Reuse shared filter, field-error, state-message, collection, dates/query/export owners. Loading uses balanced finalize; reads cancel stale responses; mutations/confirmation pending lock conflicting edits.
- Grid field order, filter keys and editable DTO properties remain the current confirmed source contract. Record exact lists in the final review per workstream; reduce frontend-only redundant fields only where no consumer needs them. No backend ListVM broadening.
- Root owns common wiring, vocabulary integration, shared extraction decisions, final scoped diff and reconciliation. Workers may edit only their assigned feature directories and their separate review fragment; no migrations, snapshots, builds, tests, lint, browser, database, commits, pushes or deployments.

## Phase handoff

Phase0 initial discovery and Phase1 contract freeze complete for this conformance boundary. Phases2/3 and already-confirmed Phase4 presentation may proceed independently across nonoverlapping directories. Root performs Phase5/6 and resolves any newly discovered cross-layer conflict before its implementation.

## Evidence sources

`LeaseAgreement/models/list.ts` and `services/leaseagreement.service.ts`; current Lease routes/services; `LeaseTariff/models/{create,details}.ts` (four collections); `LeaseMasterAgreement/leasemasteragreement.routes.ts`; backend Lease controllers inventory; `LEASE_COST_SETTING_DISCOVERY_CONTRACT_FREEZE.md` standalone child prohibition; historical Lease action freezes. Shape conformance evidence is completed before edits by each workstream in its review fragment.
