# Branches screen contract freeze

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

## Scope and evidence

User requested review and implementation for `Administration/Branches`. Scope includes its directly related Branch API/VM boundary, translations and Administration guide. Both repositories started clean. No screenshots supplied. No new business workflow, schema, permission or accounting effect is authorized. Existing fields and name uniqueness are preserved. Backend Pattern 1; UI screen 01, fields-only controlled modal in the existing details component. No PLAN-00 is needed: established CRUD behavior and canonical mandatory replacements resolve the target without ambiguous business choices.

Recipe generator `-Check` passed all eight packets before use. Applicable phases 0–6; phase 4 covers existing delete only. No builds, tests, lint, browser, database, migrations, commits or pushes.

## Frozen read contract

Grid order: shared Actions first, `id` (number), `name`, `branchCode`, `branchCode2`, `trn`, `state`, `createdBy`, `createdAt` (dateTime). BranchListVM properties beside it: Id, Name, BranchCode, BranchCode2, TRN, State, CreatedBy, CreatedAt. Remove unused inherited SubscriptionId, No, GUID, IsActive, IsValid, IsChanged and declared CCEmails/Address from this response after checking consumers. No second named Branch list consumer exists, so the duplicate BranchFullListVM is removed; the existing GetSelect contract remains available through the generic service.

`GET Branch`: Results<BranchListVM>; explicit pageNo/pageSize (15 initial, options10/15/20/50/100; server clamp1–100), Filters[sortField], Filters[sortOrder], id/name/branchCode/branchCode2/trn/state filters (existing base property filters). Add a convenient search input using existing Filters[search] (name OR primary code); preserve the six legacy property-search capabilities. Empty filters omitted, id numeric positive when supplied. Applied filter snapshot drives paging, export and post-mutation refresh. CountAsync/TotalCount owns pager totals. Sort whitelist is the eight displayed stored fields; default id descending. Export fetches all matching pages with the same snapshot and translated columns; partial failure produces no file.

## Frozen detail/write contract

`GET Branch/GetById/{id}`: Result<BranchDetailVM>. Detail = integer Id plus Name, BranchCode, BranchCode2, TRN, State, CCEmails, Address. Audit values can remain optional in the TS compatibility interface for existing typed consumers, but the Branch editor does not request or render them.

`POST Branch`: BranchAddVM / BranchCreateDTO. `PUT Branch`: BranchUpdateVM / BranchUpdateDTO. Seven client-editable fields only; update adds integer Id. Tenant/audit/system state excluded. Name required, trimmed by existing request pipeline, max100 per BranchConfig. Optional nullable primary/secondary codes/TRN max50, State max100, CCEmails/Address max500. CCEmails remains free text (no source-supported separator/email-list rule). Frontend optional controls use strings and map empty values to null; validators mirror persisted limits. Backend write metadata matches these limits. Duplicate Name remains tenant-scoped and update excludes self; the BranchConfig unique index is filtered to `[IsDeleted] = 0` so deleted names do not reserve the key. Lean detail/list corrections introduce no other schema change. No calculations/child collections/upload.

## Actions and integration

Create/View/Edit use the one controlled padded EditorDialog; list route `/Branch` only. Remove obsolete create/details routes after checking callers (none found outside the feature). View loads detail, disables form, offers Edit/Close; Create/Edit Save validates and sends typed request. Save failure retains values and surface; success closes and refreshes the applied query once. Busy/confirmation states gate duplicate actions. X/Cancel/scoped Escape and route departure share one deferred discard decision; freeze controls while pending and retain original disabled states with shared freezeFormState. Successful save bypasses discard.

Delete remains the existing server-owned soft-delete operation (`DELETE Branch?id=...`) with record-specific shared danger confirmation. Do not invent activate/deactivate controls. Backend inbound dependencies must be reconciled against the EF model/source and the existing policy (all references block deletion); reuse generic base automatic delete-reference validation when supported. No cascading deletion or new access restriction. Interceptor owns standard mutation success/error; inline read/export/detail errors suppress interceptor and use shared error utilities with retry.

AuthGuard/API authentication remain current owners; no invented authorization. Branch service retains root provider and the existing interceptor-enabled HttpClient/environment.baseUrl. Existing inherited generic service methods remain available to lookup consumers. User-guide topic belongs in existing Administration guide (`/UserGuide/administration`, existing Administration menu entry).

## Reference conformance before implementation

| Concern | Book | Actual reference/symbol | Shared owner | Target |
|---|---|---|---|---|
| List shell/title | UI1/3 | Job list template + host sigma-route-host | global sigma-list-* / FeatureTitle | same fill hierarchy, no feature SCSS |
| Filters | UI4 | Job list FilterPanel imports/template | FilterPanel + separate directives | stableLayout, labelled controls, mandatory Reset |
| Grid/paging | UI5/6/28 | Job bindListQueries / shared DataTable | resolveListPaging, Subject/switchMap/defer | same cancellation/count/sort ownership |
| Export | UI8 | Job export / list-query.fetchAllPages | dataTableExportRows | complete applied result, translated headers |
| Modal | UI13/15 | current EditorDialogComponent public inputs/outputs | EditorDialog, FormSection, FieldError | padded body, explicit modes, own typed content |
| Discard/delete | UI9/10 | ConfirmationDialogService + freezeFormState | existing shared confirmation/form-state | one decision, pending gates |
| Backend | BE3/7/8/9/13 | BranchService + generic Service hooks | existing base validation/query/write | lean contracts; inherited behavior where possible |

The Workshop reference's labour time, invoice, close/cancel, quality check, log, estimation and gate-pass actions are Not Applicable: Branch has no workshop aggregate/state. Create/View/Edit/Delete/Search/Reset/paging/sort/export are Supported. No shared component extraction is anticipated because all required presentation/lifecycle owners already exist.

## Handoff ownership

Root owns frontend list, models/service, routes, translations, guide, integration, full diff review and final report. Bounded editor work may own only Branches/components/details files. Bounded backend work may own only BranchService and Branch VMs (not EF, entities, migrations, unrelated reference modules). Any material conflict stops the affected slice and returns to root. This freeze is historical; later corrections must be appended with their evidence.

## Schema impact amendment

The directly related `BranchConfig` unique index now includes the canonical soft-delete filter `[IsDeleted] = 0`. This is a schema/index change; the owner must run `Add-Migration FilterBranchNameUniqueIndex` and review existing duplicate/deleted rows before applying it. No migration was created or run by this task.
