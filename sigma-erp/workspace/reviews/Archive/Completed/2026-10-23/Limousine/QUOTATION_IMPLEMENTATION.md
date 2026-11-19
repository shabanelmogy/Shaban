# LimoQuotation implementation and source audit

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |
| Integration owner | Root agent; frontend translations/backend resources, provider/config reconciliation and final whole-feature review remain root-owned |

2026-10-07. This bounded work follows `LIMOUSINE_QUOTATION_CONTRACT_FREEZE.md`, Sigma `AGENTS.md`, the screen-refactor skill and the canonical UI/Backend books. No screenshots were supplied. Generated packet drift was established by the root: canonical blocks govern this implementation; generated packets were not edited.

## Applied scope

Frontend repository `F:/My Work/Sigma/SiGmaAngularFrontEnd`: the existing LimoQuotation list/details TS/HTML/SCSS, routes, create/details/list models and feature service (11 files).

Backend repository `F:/My Work/Sigma/SigmaBackend`: `LimoQuotationService`, `LimoQuotationProfiler`, `LimoQuotationListVM`, `LimoQuotationDetailVM` (4 files). Existing controller/interface, Add/Update VMs, entities and EF configuration remain the source-supported owners; they required no implementation change in this slice.

Phases 2/3/4 applied against the already-frozen Phase 1 handoff. Phase 5 route/service wiring applied within the owned folder. Root owns global integration and Phase 6 closure. No schema changes, migrations or snapshots; no Add-Migration required.

## Decisions and final contract

| Concern | Decision and evidence |
|---|---|
| UI shape | Stateful quotation with financial display uses routed Create/View/Edit, shared editor shell and SummaryCards (UI1/13/15/24). One primary panel, one editor body scroll region; no local visual/layout styles. |
| Grid | Built-in shared actions, No, CreatedAt, CustomerName, internal approval and customer approval derived from persisted Status. ListVM properties: Id, No, CreatedAt, CustomerId, CustomerName, Status. The root-authorized source-constraint amendment removes inherited base plumbing because TListVm has no base constraint. All nested customer/trip/location/editor graphs removed. |
| Paging | Shared `DEFAULT_PAGE_SIZE` (15) and `resolveListPaging`; direct list GET uses generic `GetManyAsync`, its exact count and `NormalizePaging` cap 1–100. `ApplyListFilters` runs before count; `MaterializeListAsync` projects only the list shape with CustomerName. No client all-data filtering or slicing. |
| Filters | QuotationNo substring, CustomerId, inclusive CreatedAt calendar From/To dates and the two approval selectors retain the old UI semantics. Server quotation number match preserves case-insensitive text. The inclusive end is the next day's exclusive bound. Unknown/malformed filters remain absent via FilterHelper. |
| Approval display | CustomerRejected stays the existing customer-approval label `revised`; persisted enum values and transitions are unchanged. Internal approval is derived from the one stored status; no second status is invented. |
| Writes | Typed editable inputs only: customerId, tripTypeId, roundTrip, pickUpLocationId, dropOffLocationId, tariffGroupId, fuelCharge, charges, tax, notes; Update adds id. Tenant, number, audit and computed totals never submitted. Nullable IDs use the shared Int32 validator; charges are finite/nonnegative; nullable fuel has 0/1 validation; notes max2000. |
| Details | Lean explicit detail includes saved editable inputs, identity/number/date/creator/status and flattened lookup labels. View requests the existing navigation-capable endpoint without loading edit-only option lists. Edit merges saved selections through shared mergeSelectOptions. Failed detail/required lookups keep the form disabled and provide retry; both failed Result and HTTP error channels stay visible. |
| Calculations | Backend tax settings/ITaxPolicyService remain authoritative. Create/Edit keep the existing readonly tax preview as the existing tax input in the request; no manual-tax UI is added. View retains saved tax and charges; it never recalculates historical tax from current settings. Summary total is display-only charges+tax and omitted from writes. |
| Mapping | Conventional one-way maps retained; explicit location ShortName mappings are necessary because the target uses PickUpLocationName/DropOffLocationName. Conventional CustomerName/TripTypeName/TariffGroupName flattening uses their owning navigations. Removed unnecessary Status Ignore calls: no write VM includes Status; service remains its owner. No ReverseMap. |
| Actions | Pending may Edit/Delete/InternalApprove/InternalReject; InternallyApproved may CustomerApprove/CustomerReject/Revise. View/Print any saved state. Revise refreshes then opens Edit on the same id. All mutations use typed owning methods, shared confirmation, inflight/reentry guards and backend state validation. Delete of the final visible row moves back one page. No unapprove, downstream agreement, accounting or permission contract invented. |
| Feedback | Inline read requests explicitly skip the global error interceptor and use shared error formatting; standard mutations leave all API failure/success presentation to that interceptor. Forms stay open and restore editable controls after failure. Removed duplicate local Save API failure surface. Global list/detail/save/action loader starts are balanced in finalize. |
| Navigation | Four canonical routes carry data.mode. The historical details/:id alias uses an Angular-supported CanActivateFn/UrlTree to retain old edit=true and print=true bookmarks; it strips only the legacy edit flag. Filters/page state are carried to and restored from the owning list. Dirty navigation uses a cold deferred shared discard decision: captured id/mode/disposed guards reject obsolete or duplicate subscriptions, freeze controls only while pending and restore previously disabled controls (including readonly tax) only on the same live editor. Submit/unload are guarded. |
| Output | Excel traverses all filtered server pages through fetchAllPages and translates the shared grid column contract at click time. An unexpectedly empty export while visible rows exist reports failure. View print uses ReportPrintService's guarded destroy-bound session and a render frame; old timer/direct print scheduling removed. |

## Conformance evidence reconciled to final source

| Concern | Book / actual reference | Shared owner and target source comparison |
|---|---|---|
| Container-fill page | UI1/3; Workshop/Job list and editor | Both target components use sigma-route-host; list uses sigma-list-page/panel/header/table and editor uses sigma-editor-page/panel/form/body/scroll. No height calculations, duplicate title or feature CSS. |
| Filters/grid | UI4/5/6/28; Workshop/Job list | Target FilterPanel stableLayout=true, 5 main columns, reserved date feedback; DataTable fill=true/lazy=true, controlled page/rows/exact totalRecords. Public DataTableColumn/DataTableStatus exports and dateTime/status literal types checked against data-table.format.ts; switchMap cancels older reads. |
| Editor fields | UI13/15/19; Workshop/Job editor | Target FormSection, sigma-editor-grid/field/read, FieldError for editable fields, PrimaryActionButton submit and shared scalar validators. Exact public component inputs and standalone registrations reviewed; no raw p-dialog or ms-lib. View text uses saved names. |
| Summary | UI24; summary-card.model.ts / Workshop editor | Target typed readonly SummaryCard array, slim/row/min140/max80 public sizing, money format and valid neutral/info/primary accents; no local card internals. |
| Lookup merge | UI16; shared select-options.ts | withSaved adapts the actual saved IDs/names to shared mergeSelectOptions; fetched labels win and existing selections absent from a lookup remain visible. |
| Dates | UI17; shared date-utils.ts | Filter uses DatePickerDirective, dateRangeValidator, parseDateRange and toPickerDate; no ISO timezone conversion or private date parser. Legacy one-year default range is retained. |
| Confirmation | UI7/9/10/22; ConfirmationDialogService | Exact confirm/confirmDelete/confirmDiscard contracts checked. Record identity presented by the shared dialog. Pending confirmation and mutation signals block duplicate actions. |
| Print | UI21; report-print.service.ts | createSession(DestroyRef) replaces private timers and owns preparation/destroy cleanup. Print/View controls gate repeat navigation while printing; shared editor print rules release bounds. |
| Backend read | BE3/4/5/7/9; base Service MaterializeListAsync/ListQuery/GetManyAsync | Two justified read hooks only. Base keeps exact count/order/paging/filter scope; ProjectTo supplies CustomerName without loading editor graphs. DetailWithNavigationsAsync still uses GetByIdDeepAsync, preserving the flattened saved labels. |
| Domain state/tax | BE8 and frozen source action table | Existing state validations and ITaxPolicyService remain unchanged; localized message keys replace hardcoded action/error strings. No new persisted fields or accounting effect. |

## Source audit and remaining owner steps

Owned source was compared to its producer/consumer contracts and scoped frontend/backend diffs were inspected separately. All runtime TypeScript files in the owned folder and both Angular templates parse without syntax diagnostics; this is syntax parsing only, not a build or type/Angular compilation. Scoped `git diff --check` is clean. No merge markers, ms-lib/ListCol/raw-table remnants, window.confirm, toISOString, flatMap/fromEntries or undefined error callbacks remain in this folder.

Root must supply the existing requested frontend keys consumed by this source: `limoQuotation.errors.load`, `errors.lookups`, `errors.editLocked`, `total`, `discardTitle`, `discardMessage`, `discard`. Old proposed errors.save/action are no longer consumed by this implementation. Backend resource keys are enumerated in `QUOTATION_TRANSLATION_REQUIREMENTS.json`; root owns their EN/AR integration. Existing shared/feature keys were inspected, and no additional frontend key is required.

The unused `LimoQuotationFullListVm.cs` has no consumers in the focused Business/ViewModels/ServerAPI searches; removal is root-owned outside this agent's four-file backend assignment. The generic base contract remains unchanged; only the quotation ListVM is narrowed to its exact consumed shape. Existing concurrency contracts remain unchanged.

Owner acceptance remains pending: frontend/backend compilation; paged filters including final calendar day, rapid overlapping search and final-row deletion; full filtered Excel after language switch; Create/Edit nullability and failed-lookup retry; preserved saved tax in View after settings change; each legal and illegal action plus competing requests; dirty browser/router exit; legacy edit/print URLs; full record print; keyboard, narrow screen, Arabic RTL and light/dark appearance; exactly one API notification per mutation.

No build, test, lint, browser/application verification, database command, migration/snapshot edit, commit, push, deployment, Graphify or Sigma MCP was run. No reusable new rule was established beyond the existing shared owners, so the learning protocol needs no book/skill change.

Suggested frontend commit: `refactor(limousine): align quotation list and routed editor with shared patterns`.
Suggested backend commit: `refactor(limousine): project quotation read contracts and localize domain feedback`.

## Final list reconciliation — 2026-10-07

UI23 literal-key correction replaces concatenated action titles, confirmation messages and approval labels with complete typed literal Record maps. Internal/customer option arrays reuse the literal approval map; no dynamic feature translation key remains in the quotation list. The existing labels and action semantics are unchanged and no new translation key is needed.

Paging correction caps restored integer URL page size at100 and caps lazy-event rows before shared resolveListPaging computes offset/page. Successful positive integer Results pageNo/pageSize metadata updates controlled state and a changed state is synchronized to the applied-filter URL. Invalid/missing runtime paging metadata retains requested valid state; optional totalCount handling stays unchanged. This prevents oversized old/hostile page sizes from causing gaps between actual100-row server pages. The amended list parses without TypeScript syntax diagnostics, scoped git diff --check is clean and focused dynamic-key scan has no matches. No build/test/lint/runtime command was run; owner verification remains pending.

## Final editor translation reconciliation — 2026-10-07

UI23 correction changes statusLabel's typed status map to complete literal translation keys and returns its selected entry directly. The five existing status labels and Pending fallback are preserved; no new key, transition, financial rule or API contract is introduced. Editor TypeScript syntax parsing and the focused dynamic quotation-key scan pass; scoped git diff --check is clean. Build, runtime and owner acceptance remain pending.
