# Currencies — screen contract freeze

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Authorization | Owner: review `Administration/Currencies` and apply documentation-based fixes |

## Manifest and boundaries

Tier M, existing currency master screen and directly related API. UI type01 (fields only): Job list reference; shared EditorDialog controlled composition, no tabs. Backend pattern1: BranchService and generic Service hooks. Both repositories were clean at discovery. No supplied screenshots/videos; source and canonical books provide Confirmed evidence. Recipe Check passed all eight packets. Apply phases0–6; PLAN-00 is limited to persistence hardening described in CURRENCIES_MAINTENANCE_EVOLUTION_PLAN.md (pending creation). Do not implement the separate Draft exchange-rate plan, foreign-currency accounting, historical rates, revaluation, ledger widening, or base-currency lifecycle redesign.

## Frozen read contract

GET /Currency uses ListSmBase: pageNo>=1, pageSize1–100; reviewed UI default15 and choices10/15/20/50/100. Filters preserve existing generic property matches: id (integer equality), name/code/decimalName (trimmed Contains), decimalPrecision/currencyToBaseRate (decimal equality). Three text fields in main filters; id/precision/rate in advanced filters. No new custom search endpoint. Numeric filters use finiteNumberValidator; precision integer0–6. Empty filters omitted, zero retained. Search/Reset applies draft filters at page1; paging/sorting/refresh/export use applied snapshot. Stable stored-field sort, default id descending, id tie-breaker. Results<CurrencyListVm> entities/pageNo/pageSize/totalCount/totalPages authoritative. Export every matching page with fetchAllPages and grid-column formatting at click-time language.

Grid order: Actions; id(number); name; code; decimalName; decimalPrecision(number); currencyToBaseRate(number, NOT money rounding); isBase(translated status); createdBy; createdAt(dateTime). ListVM property list beside it: Id, Name, Code, DecimalName, DecimalPrecision, CurrencyToBaseRate, IsBase, CreatedBy, CreatedAt. Remove unused SubscriptionId, No, IsActive, IsValid, IsChanged, GUID from this feature's list read shape only, after direct consumer check. Retain name/code/rate/etc for current currency readers.

## Frozen detail/write contract

GET /Currency/GetById/{id}: Id, Name, Code, DecimalName, DecimalPrecision, CurrencyToBaseRate, IsBase only (LeanDetailBaseVm). POST /Currency: name:string required/non-whitespace max100; code:string required/non-whitespace max10; decimalName:string required/non-whitespace max50; decimalPrecision:number integer0–6 default2; currencyToBaseRate:number>=0.000001. PUT /Currency: same fields plus positive integer id. Omit tenant, No, audit and IsBase. Trim three strings before duplicates/map. Server validates precision and rounds rate through FinancialNumberPolicy.RoundExchangeRate (6 places, AwayFromZero), rejects rounded rates beyond decimal(18,6) storage; keep ledger/base precision<=2 invariant. Preserve earliest-live currency IsBase assignment and existing re-election only on Add/Update; no client base toggle or rate=1 invention.

Code, Name and DecimalName remain three independent live-tenant unique keys (current service evidence). Use shared UniqueColumns/InvalidInputAsync and ExecuteUniqueWriteAsync for custom writes, plus filtered tenant indexes when expressible. Backend owns IsBase, precision compatibility and rounding. Current Add two saves remains atomic; Update one save uses implicit EF transaction within shared uniqueness boundary. No new domain class or calculation owner.

## Frozen action/integration contract

Create/View/Edit use one list-controlled details component with explicit EditorDialogMode and fresh component per session. View disables form, hides Save; separate list Edit action. Detail failure blocks Save and offers Retry. Failed Save retains draft; requests finalize loader/busy state; frozen controls during Save and pending discard. X/Cancel/Escape share confirmDiscard and same-session check; accepted confirmation closes before finalize releases its pending flag. Delete uses shared confirmDelete naming record, DELETE /Currency?id, RemoveWithChildrenAsync with no owned children (live FK checks), retains row on failure, refreshes current applied page, moves back when last row removed. Global interceptor alone owns mutation success/error feedback; inline list/detail/export reads use X-Skip-Error-Interceptor and shared apiErrorMessage/composedReadErrorMessage.

Only operational route /Currency, remove legacy create/details routes after scoped caller search (no alternate editor). Root CurrencyService remains the existing shared service path; typed list/create/update/delete methods added there, inherited lookups/other consumers preserved. No feature HttpClient/provider/token code. Existing administration UserGuide content gains currencies topic; reader/module guide route/sidebar remain reused. AuthGuard and API Authorize are authentication only. Authorization candidates: POST/PUT/DELETE Currency (master financial configuration); no fabricated permissions.

Reference action inventory: Branch Add/Update/Delete/Detail/List/Select supported (select retained for external currency pickers); generic handleActivate Not Applicable to this screen because current currency selection has no active-state eligibility contract; navigation reads compatibility-only, no owned relationships. Job domain actions (close/cancel/invoice/time/quality/gatepass/log/estimation) Not Applicable: Currency has none of their states/aggregates. No new dormant generic action UI.

## Conformance evidence before implementation

| Concern | Book | Actual reference/symbol | Shared owner | Target contract |
|---|---|---|---|---|
| Shell/title/filters | UI1/3/4 | Job list template, JobsComponent imports/host | styles.scss, FeatureTitle, FilterPanel | same host/page/panel/header/table chain, stableLayout, mandatory Reset; no local SCSS |
| Grid/query/output | UI5/6/8/28 | Job list bindListQueries, typed columns and export | DataTable, resolveListPaging, fetchAllPages | fill=true, one server pager, applied query, switchMap/defer |
| Dialog/body | UI13/15 | EditorDialogComponent public inputs, controlled UI13 composition | EditorDialog and sigma-editor-* | contentPadded=true; intrinsic flex-fill form/body/scroll; single section, no tabs |
| Validation/discard | UI10/19/27 | FieldErrorComponent, confirmation presets, freezeFormState, focusField | shared components/utils | typed form; finite scalar validation; first-invalid focus; deferred same-session discard |
| DTO/map/CRUD | BE3/4/7/8/13 | BranchService + Service generic methods, CurrencyProfiler | base Service/UOW/helpers | lean read contracts; four one-way maps retained; feature-specific overrides only |
| Precision/business | source contract | CurrencyService, CurrencyConfig, FinancialNumberPolicy | existing backend policy | rates/IsBase/ledger storage rules preserved |

No new reusable pattern: adopt existing shared owners. No canonical-book/skill change required for routine adoption. Compiler/runtime/visual verification stays owner-pending. Nonblocking open decision: base deletion/change after transactions remains the deferred currency-system plan; do not silently introduce a new restriction or reassignment. Source review reports its existing risk.

## Source-backed amendments — 2026-10-14

Owner explicitly authorized continuation while preserving other sessions' edits and adding currency-only keys in shared resources. All unrelated work remains outside scope.

1. The existing earliest-live re-election can choose a previously non-base currency after unused-base deletion. Check the selected winner's precision before mutation, using requested precision when that winner is edited, to preserve the already-frozen base<=2 invariant. Do not change the selection policy.
2. FinancialNumberPolicyService caches load() responses with shareReplay and has no invalidation. Add an invalidate() method to that existing owner and invoke it synchronously only after successful typed currency create/update/delete. Next consumer read reloads authoritative policy; no new calculation, automatic policy request, extra success surface or change to existing load(force) semantics. This directly related dependency is added to the bounded plan; no unrelated consumer rewrite.
