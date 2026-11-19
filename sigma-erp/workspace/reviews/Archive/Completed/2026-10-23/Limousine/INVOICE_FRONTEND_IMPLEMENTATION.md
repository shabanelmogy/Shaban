# Limousine invoice frontend implementation

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |

2026-10-07. Bounded worker ownership: only `SiGmaAngularFrontEnd/src/app/modules/Limousine/LimousineInvoice`. Root owns contract freeze, backend, localization and shell integration. User approved trip-based generation, then explicitly allowed several partial invoices while requiring their sum not to exceed the trip total. No screenshot supplied; source evidence and that owner decision govern content.

## Changes and API match

- Replaced the unrelated product/loyalty placeholder list and untyped manual invoice editor with shared invoice list, read-only saved View and selected-trip generation workspace.
- Invoice grid columns: no, tripNo, invoiceDate, pickupDateTime, customerName, driverName, amount, tax, totalAmount. List DTO contains exactly those plus id for View/Print. Filters: tripNo, customerId, pickup calendar range. Exact server count/page metadata, default15/cap100, shared paging resolver, switchMap cancellation, applied filter snapshot and preserved list query on editor return.
- Candidate endpoint is consumed as a complete collection. Source fields remain readonly: trip/customer/driver/vehicle/locations/description/charges/tax/discount/total/billed/remaining. Typed per-row form owns only selected and requested gross. Unselected amounts stay disabled; defaults use actual remaining. Selected amounts must be required, finite, positive, at most remaining and within the actual currency scale. This is an advisory UI gate; backend reread/cap enforcement remains authoritative.
- Payload is exactly invoiceDate local yyyy-MM-dd and items(tripBookingId,totalAmount). No client source customer, driver, tax, discount, total calculation, tenant, audit or number is sent.
- Currency precision is loaded from existing Currency/GetFinancialNumberPolicy; failure/incompatible policy blocks generation with Retry. Customer/Branch lookup failures have both business and transport paths; failed options are never considered success. Successful empty options remain valid. Optional filter IDs require positive integers and actual lookup membership.
- Saved View shows persisted amount/tax/total and server labels, with no recalculation against current tax settings. Root frozen saved-trip tax contract supersedes a new-document tax-default recipe for this source-backed action.
- List Excel and Print fetch every actual server page under the click-time applied snapshot. Export captures translated headers; print uses separate complete rows and shared ReportPrintService without changing live page/filter/data. Both list and View release all bounded ancestors through sigma-print-flow and hide actions with no-print.
- Routes are list/create/view/:id; legacy details/:id redirects to read-only View with query state. No edit/delete/manual invoice workflow added. Reused view/:id params unsubscribe prior detail read, clear old record, change identity and guard delayed print against stale identity. Existing AuthGuard/interceptor chain stays root-owned.
- Dirty guard is cold and one-use. It captures editor identity, checks alive/busy at subscription and acceptance, freezes controls and restores intentionally disabled states only on the same live editor. Cancel preserves changes. Search/Reset confirms before replacing selections. Successful Save closes after finalize releases busy; failed Save preserves date/selections/amounts. beforeunload protects dirty financial inputs.
- Removed two empty unused SCSS files; shared declarations own all shell/table/summary/field/print presentation. Existing component names/spec imports retained; no tests added/run.

## Source conformance evidence

| Concern | Book/reference/shared declaration | Target comparison |
|---|---|---|
| Bounds/title/list | UI1/3/6; Workshop/Job list; styles.scss sigma-route-host/list-page/list-panel/list-table | Same container-fill classes, DataTable fill true, rows sole list scroll; feature title inside panel; no viewport calc/local styles |
| Financial collection | UI14; OpeningBalances customers/details; actual EditableCollectionTable public API | Routed shared editor workspace; complete rows; fillHeight+stickyHeader; one table scroll owner; fixed date/filters/SummaryCards/footer outside frame; cells only and single reactive group per row |
| Numeric readonly | UI14/27; shared editable value/highlight classes, NumericFocusDirective | Source charges/tax/discount/total/billed/remaining centered readonly highlight; editable request only selected, actual precision and focus appearance |
| Summary | UI24; actual SummaryCard and SummaryCardsComponent | Typed readonly cards; slim/row/min140/max80; requested total explicitly marked preview; saved invoice values authoritative |
| Filters/dates | UI4/17; FilterPanel/DatePicker/date-utils/list-route-state | Explicit Search applied snapshot; safe local picker hydration; required real invoice date; no UTC conversion; empty range preserved across return |
| Errors/validation | UI19/22; FieldError/StateMessage/financialScaleValidator/apiError/composedReadError | Every validated control has FieldError and first-invalid focus; both read failures inline with skip header/Retry; mutation interceptor single feedback owner; no manual toast |
| Lifetime/discard | UI10/28; ConfirmationDialogService and installed DestroyRef declaration | Deferred identity-safe guard, disabled snapshots, duplicate subscription reject, takeUntilDestroyed, same-record print timer guard |
| Print/export | UI8/21; fetchAllPages/dataTableExportRows/ReportPrintService; shared sigma-print-flow | Full dataset from actual paging; no partial file on failed page; separate print rows; no private print CSS |
| Wiring | UI1/26; existing LimousineInvoice lazy route, root BaseService | Existing service providedIn root and API base inherited; route names aligned, no extra HttpClient/interceptors or permissions |

## Files and verification

Changed9 runtime files: components/list/list.component.ts + .html; components/details/details.component.ts + .html; limousineinvoice.routes.ts; models/list.ts/create.ts/details.ts; services/limousineinvoice.service.ts. Deleted2 empty unused component SCSS files. No shared/layout/localization/backend source edited by this worker. Translation requirements are in INVOICE_FRONTEND_TRANSLATION_REQUIREMENTS.json and integrated by root.

Source parser evidence: invoice-source-syntax.cjs parses7 runtime TypeScript files and2 Angular templates, zero syntax/local-import path errors. This is parsing only: no typecheck/build/tests/runtime. Complete scoped diff reviewed through bounded per-file output; git diff --check clean (LF/CRLF normalization notices only before normalization). Static locale audit after root integration: no missingEN/missingAR.

Owner acceptance remains: build/compiler; repeated parts across submissions; amount zero/negative/over-remaining/invalid scale/cleared input; all-or-nothing failed generation; two-user race/cap; source price changes concurrent with invoices; same View route different id and delayed responses; canceled/accepted dirty close/Search; successful empty lookups vs failed lookups/Retry; full print/Excel beyond100; Arabic/theme/narrow/keyboard and one scroll owner; exactly one mutation success/failure surface. Backend/accounting/migration outcome belongs to root's reconciliation. No builds, tests, lint, browser/application verification, database/migrations/snapshots, commits/pushes or deployment run.

Root integration amendment: Generate's actual non-generic Result returns created IDs in id:number[] and no entity. models/create.ts and service now use a dedicated LimousineInvoiceGenerationResult envelope matching the producer. No request/control behavior changed. Whole-feature final source verification is in INVOICE_IMPLEMENTATION.md.

Frontend suggested commit: `feat(limousine): generate partial trip invoices from remaining balances`. Whole feature closure remains root-owned.
