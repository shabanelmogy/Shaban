| Field | Value |
|---|---|
| Status | Frozen — presentation/cache and read-lifetime slice |
| Date | 2026-10-26 |
| Owner verification pending | yes |

# Sales menu current review and confirmed fixes

Later owner-authorized domain/read amendment 2026-10-27: see SALES_EQUIPMENT_RENTAL_REDESIGN_MAINTENANCE_EVOLUTION_PLAN.md for complete reformulation, public Speed evidence and the frozen implemented slice. Detail adds CanDeliverAll and line CanDeliver as server-owned read capabilities for exact posted-invoice/undelivered-unit choices. Cost validation and cost posting share the actual reserved-unit set, including any invoice basis that completes billing; this preserves existing accounts/timing while correcting bypass/omission. Customer PO terminology is separated from asset sale and internal hire execution. No approval of new cross-invoice tax distribution, depreciation disposal or rental financial posting is inferred. Existing earlier presentation/cache fixes and pending work remain.

Owner requests review of the Sales menu according to current books and execution
of confirmed findings. Scope is the actual sidebar /Fleet, /SalesQuotation,
/SalesAgreement, /DueInstallments plus existing /UserGuide/sales. Active route
imports inspected, scoped application paths initially clean. Unrelated shared,
Customers/Suppliers/Staff/Receipt changes retained. Source-only: no build, test,
lint, browser/runtime, database, migration, snapshot edit, commit or Graphify/MCP.

Tier L; existing SALES_CYCLE and SALES_REVIEW_FIXES Frozen contracts retain
fields/DTOs/financial/lifecycle/concurrency/receipt authority. Current partial
invoice and partial delivery behavior is a preserved source contract, not an
invitation to revert to older cycle tables. No new accounting, rate, permission,
eligibility, data cleanup, schema or index implementation is authorized.
Generator -Check passed all eight before using PLAN00/PHASE00–06. Current books
Master1/4/5/7, UI2/22/28/29 and selected type02/09/07 shape blocks own the work.
References: Job list/editor shell, shared EditorDialog/EditableCollectionTable/
ReferenceLookupStatus/ReferenceLookupBindings, TrialBalance report shell.
Backend normal/aggregate/report BE13/14/17; accounting actions preserve BE15.

## Frozen confirmed presentation/cache slice

1. Required routed initial/filter bootstrap must always mount the existing
   ReferenceLookupStatus page owner. Aggregate actual pending reads; remove
   select/filter/page-local loading visuals while preserving local busy,
   errors/Retry/finalize/cancel and disabled/aria-busy. Page tables explicitly
   suppress their mask. Dialog reads use one shared local StateMessage/status,
   no page count; dialog writes retain existing global/save/navigation safety.
2. Approved reference sources must use their real opted-in source services,
   finite successful bootstrap and separate once-bound ReferenceLookupBindings
   watches. Preserve current selected IDs/labels/drafts, explicit context clear,
   errors and Retry/destroy lifetime; retained refresh silent. No source with
   no opt-in, operational availability, policy or settings singleton becomes
   a reference list cache. Raw Customer/GetSelect calls in SalesAgreement
   bypass the existing CustomerService opt-in and must delegate to it; keep
   public method signatures/URL/feedback mode and add a typed matching watch.
3. DueInstallments output() performs all-page read requests without a page
   loading count: acquire at its subscribed defer start and release finalize,
   preserving full-data export/print, errors/Retry and applied filters.
   Its report/output errors also lack a visible Retry. Retain the failed read
   operation kind and retry that same report/applied query or complete output;
   no write retry, hidden filter reset or partial result export.
4. Agreement invoice/delivery action's getDetail read currently shows raw
   loading text inside fields, ignores unsuccessful Result and transport errors,
   and allows a late closed/reopened action response to replace choices. Use a
   single cancellable Subject/switchMap read lifecycle, one shared local status,
   response/id checks, inline errors/Retry, safe disabled/busy and identity fence;
   cancel when action closes/replaces. Never change invoice/delivery eligibility,
   default full/amount/units choices, item IDs or write-time backend checks.
5. Root-provided Sales services must not be re-provided by LayoutModule; remove
   only scoped SalesAgreement/SalesQuotation/Fleet/DueInstallments imports and
   provider entries, retaining the existing root HttpClient/auth/interceptors.
   Shared int32ValueValidator covers the actual Int32 filter/editor IDs and
   installment counts with FieldError/focus; bounds/requiredness remain owned
   by the existing contracts. Agreement's optional tax/financial preview reads
   keep their current fallback/feedback/financial policy, but pending bootstrap
   participates in the same page owner. No financial policy watch is added.
6. Preserve the existing optional/required/sign/bounds of decimal inputs while
   adding shared finite-number transport validation where absent. In Agreement
   action, a manually set amount error can survive switching back to full/unit
   invoicing; bind amount required/min validation only to amount basis and clear
   that obsolete control error on basis change. Reuse shared FieldError for the
   existing unit-selection error, with no amount/precision/financial rule change.

## Integration and remaining discovery

### Shared consumed currency read — Frozen 2026-10-26

DocumentCurrency is actually mounted by Quotation/Agreement and performs direct
policy/Partner reads with version fences but no progress owner; old partner reads
also continue after input replacement. Extend this existing shared owner generally
with ReferenceLookupStatus (page default / inherited dialog scope), aggregate
read flags and aria-busy; cancel replaced partner subscriptions, retain version
fencing and DestroyRef. Preserve supplied saved code, persisted base fallback,
supplier/customer preference and financial authority. Inline partner failures
retain their existing fallback and expose one localized Retry in the same owner;
base policy retains its existing global feedback and optional fallback contract,
matching load mode to avoid duplicate requests. Do not cache Partner detail,
change its broad endpoint, add policy watches or write parent forms. Shared
behavior and error string are documented in UI22 + execution skill/history.

### Backend confirmed amendment — Frozen 2026-10-26

- EquipmentService.GetManyAsync reconstructs fixed filter keys and drops the
  actual incoming Filters[grid] used by Fleet's shared table. Preserve that
  encoded key in columnFilters before ListQuery so existing ApplyGridFilters
  governs both Count and page projection. Keep fixed screen filters, sort,
  upper page clamp, TotalCount/TotalPages and shared expression validation;
  do not introduce an independent grid parser or change endpoint/DTOs.
- SalesAgreementService.LoadAggregateAsync eagerly joins independent items,
  payments and invoice/item collections. Add AsSplitQuery only on this existing
  aggregate helper to avoid their cross product. Preserve tracked root/children,
  tenant/live predicates, same DbContext and existing tenant SalesAgreement lock/
  transaction. More bounded queries trade against duplicated joined rows;
  no parallel EF, early materialization, dropped collection or measured-speed
  claim. Runtime SQL/query plan/isolation acceptance remains owner-pending.
- TaxPolicyService already has a scoped snapshot: item-level calls do not imply
  settings-query N+1 and remain unchanged. Partner currency's generic deep read
  is an existing shared-endpoint volume risk; narrowing a broad endpoint or
  adding a new public DTO requires a separately frozen cross-consumer contract.
  Record it explicitly; no speculative index or Partner domain change here.

Root owns contracts, Agreement/Due/frontend action dialog, guide, documentation,
integration and complete diff. Bounded quotation/Fleet/frontend and backend
read-only discovery agents report findings before implementation delegation;
no overlapping ownership. Backend fixes require an explicit source-supported
amendment here before edits. Review the existing per-line VAT compatibility
exception as recorded; do not silently introduce a new calculation policy.

Final review records exact grid/DTO/filter/action, cache URL/writer/topic,
loading subscription/visibility, Angular21/layout, query/index and guide evidence
in SALES_FEATURE_REVIEW.md. Same cold/warm datasets and owner SQL/latency/visual
checks; syntax/diff alone do not prove runtime, EF translation or measured speed.
No migration follows this slice; previous pending schema work stays separate.

## Final handoff — 2026-10-26

All confirmed S26-01–09 groups implemented/source-reconciled in the current
SALES_FEATURE_REVIEW section, including amendments above and exact cache/loading/
query/index evidence. Frontend22 files +2 inline templates and backend2 files
syntax parsed without errors; complete scoped diffs reviewed and whitespace
checks pass. Sales in-app guide, UI22/BE9 owning rules, execution skill/history
and generator-produced all8 packets current. No build/test/runtime/DB/schema
execution. Actual EF/SQL/timing/cache/visual/accounting/concurrency acceptance
remains owner work. Shared broad Partner currency endpoint volume remains an
explicit future cross-consumer API contract; it is not claimed optimized.
