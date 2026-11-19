# Checklist Item — frontend contract freeze

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Scope | Administration/ChecklistItem Angular module; API inspected read-only |

## Authority and scope

User requested review and implementation according to documentation. Follow Sigma AGENTS, sigma-screen-refactor, Master 4/5/7, UI screen 01, UI 1–10/13/15/19/22–29 and BE 9/13 for existing API evidence. Recipe Check passed all eight packets before use. Applicable phases 00–06; backend implementation, schema changes, unrelated modules and reference edits excluded. PLAN-00 not required: bounded adoption of documented CRUD shape, no new domain behavior.

Existing user changes: details component has Save/Cancel/Delete/Edit icons; preserve their semantic icons through shared owners. Shared translations and administration guide contain unrelated pending edits; append only this screen's content. No screenshots/video supplied; source is Confirmed evidence.

## Frozen UI and read contract

UI type01, list plus modal; BE pattern1 normal entity, currently inherited Service. Approved list reference Workshop/Job/components/list; modal reference shared EditorDialog declarations and UI13 controlled composition. Backend reference BranchService inspected for comparison only.

Grid order: shared Actions first; `name` text/link to View; `order` number. Frontend List: `id: number`, `name: string`, `order: number|null`. Backend ChecklistItemListVM contains Id/Name/Order plus inherited SubscriptionId/IsActive/IsValid/IsChanged/No/GUID/CreatedAt/CreatedBy: these extra server fields remain out-of-scope backend debt; client consumes only the three required fields. Remove bogus No column rather than invent numbering. Audit fields are not displayed.

Filter: one optional Name text → `filters.name` → `Filters[name]` → generic entity Name Contains predicate; trim UI input, omit empty. No unsupported `search` key. PageNo/PageSize top-level; default15; options10/15/20/50/100; cap100. CountAsync before slicing, TotalCount authoritative. Sort allowlist derived from sortable columns Name/Order; initial order remains inherited Id descending (`sortField=''`). Applied filter snapshot governs paging, refresh/export and mutations; Reset empty Name/page1. Keep query state via shared readListRoute/writeListRoute. Export all pages through fetchAllPages, translated dataTableExportRows.

## Frozen detail/write contract

| Field | Form | Read | Add | Update | Validation |
|---|---|---|---|---|---|
| id | none | number, dialog subtitle | none | number | Positive saved identity |
| name | nonnullable string | Name | Name | Name | Required; AddBaseVmWithName max250; UpdateBaseVmWithName max50; enforce current mode limit without silently truncating |
| order | number|null | Order nullable Int32 | Order nullable Int32 | Order nullable Int32 | Optional; shared int32ValueValidator; signed range; do not invent positive/unique/required order rule |

Detail client contains only id/name/order; heavy backend Detail remains unchanged. Add sends name/order; Update sends id/name/order. Never tenant/audit/GUID/delete/active flags. Trim Name at Save. View read-only, no Save; list provides Edit separately, so View shell primaryActionVisible=false. FormSection+shared fields, MockDataFormsModule retained for editable drafts only. Inline detail/list errors use X-Skip-Error-Interceptor/apiErrorMessage with Retry; mutation messages owned solely by global interceptor; draft restored on both failure channels.

GET ChecklistItem with typed query → Results<List>; GET ChecklistItem/GetById/{id} → Result<Detail>; POST ChecklistItem Add; PUT ChecklistItem Update; DELETE ChecklistItem?id={id} → Result. Root provided service/root HttpClient retained. Existing getChecklistItems() unpaged inline-suppressed reader retained exactly for logsMovement check-card consumer (String(id), nullable order fallback supported).

## Frozen actions and wiring

Create/View/Edit/Delete/Export supported. Delete names selected record in shared destructive confirmation, guarded against duplicates, global success/failure owner, refresh same applied page (previous page if last row deleted). Existing generic RemoveAsync soft-deletes; no new dependency protection promised. Backend lacks feature-specific duplicate declaration/index and inbound-reference checks; record as backend follow-up, do not invent guarantees in UI.

Job reference actions: View/Edit/Delete/Create/Export Supported; labourTime, invoiceCustomer, close, cancel, qualityCheck, log, estimation, printGatePass and lubricationJob Not Applicable: ChecklistItem has no Job aggregate, invoice, state, time, estimate or print document contract. Activate endpoint inherited but no existing screen workflow/status column; not introduced. CheckUnique not adopted: no UniqueColumns declaration for target. Authentication via AuthGuard and Authorize; no permission API. Authorization candidate DELETE ChecklistItem retained for permission inventory.

One list route `''`; obsolete create/details routes removed per modal rule. Route canDeactivate delegates to mounted editor's deferred discard decision. No source link to those obsolete routes found in directly related wiring. Dialog remounted per session, explicit mode/id, stale detail identity checks and takeUntilDestroyed. X/Cancel/Escape/navigation share dirty confirmation; freezeFormState captures controls while decision/save pending; no duplicate confirmation; accepted close does not block on its own pending flag. Saved closes emit true and refresh; canceled emits false without reload.

No schema/calculation/mapping changes. No Add-Migration required. Backend mapping ReverseMap on read DTOs remains pre-existing debt outside frontend scope. No new reusable guidance/extraction: existing shared owners cover all changes.

## Integration evidence amendment — 2026-10-14

Direct wiring evidence requires two bounded shared-file edits: suppress the duplicate ChecklistItem toolbar title and remove ChecklistItemService's redundant LayoutModule import/provider so the existing root registration owns it. Other pending shared-file edits are preserved.

Final filter presentation uses ordinary shared FilterPanel (stableLayout, mainColumns1, full-span Name) with Reset/Export/Search in its toolbar. The current default inline-actions CSS retains two outer columns at <=720px; the documented stacking claim does not match that cascade unless another modifier applies. This screen selects the existing normal layout to retain usable narrow field widths, without a shared-layout redesign. Recorded documentation/source drift is a follow-up, not a new canonical rule. Business/read contracts unchanged.
