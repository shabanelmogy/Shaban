# Customers Alerts — frontend read handoff (2026-10-02)

| Status | Owner verification pending |
|---|---|
| Frozen | yes |

## Scope and evidence

User: review `src/app/modules/Customers/alerts` and fix all findings. Tier M.
Frontend screen, service, model, existing spec and its `alerts` translations are in scope.
Backend is inspected as the existing producer; no business, schema or API change is required.
Existing modifications to the three list files and both vocabularies are preserved and completed.
No screenshots or other visual requirements were supplied.

UI shape: a flat read-only operational alert grid, using UI 1/4/5/6 list presentation,
with complete-array local paging. It has no CRUD editor, document sections, accounting
totals, print, row activation or selection. This is the read-grid exception to the
catalog's CRUD default, not a new report/editor workflow. Backend: pattern 5 read model,
existing `CustomerService.AlertsAsync` using `QueryReport`; no generic CRUD replacement.
Approved presentation reference: `Workshop/Job/components/list`; shared controls are
`filter-panel`, `data-table`, `feature-title`, primary action button and global shell styles.

Recipe fingerprints: `Generate-SigmaRecipes.ps1 -Check` passed all eight recipes.
Semantic drift: Phase 5 still calls for LayoutModule-owned HttpClient/providers;
UI 1 and current AppModule use the single root interceptor client. Follow UI 1;
packet needs regeneration from a corrected template and semantic review, outside this scope.

## Existing read API (Confirmed)

| Operation | Route | Request | Response / evidence |
|---|---|---|---|
| Alerts | `GET Customer/Alerts` | optional top-level `customerId: int?`; omit when null | `Results<CustomerAlertDto>.Entities`; `AlertsAsync` has no Skip/Take or page-size clamp, returns complete filtered documents |
| Customers | `GET Customer/GetSelect` | no filters | `Results<DropDownSelect>`; inherited select via shared CustomerService |

Backend includes documents with an expiry date whose partner appears as customer,
primary driver or additional driver on an open agreement. `customerId` means exact
document `PartnerId`, not all drivers employed by a selected company. Preserve this meaning.
Tenant and soft-delete behavior belongs to `QueryReport`, authentication to the base controller.
No Add/Update/Detail/action DTO, AutoMapper or transaction changes.

## Columns beside response properties

| Order / grid property | API property | Type / display |
|---|---|---|
| 1 `srNo` | `SrNo` | number, backend partner serial |
| 2 `customerName` | `CustomerName` | name plus translated `Type` on next line |
| 3 `agreementNo` | `AgreementNo` | all linked open agreement numbers |
| 4 `company` | `Company` | company label |
| 5 `documentType` | `DocumentType` | translated known DocumentType names, raw fallback for unrecognized values |
| 6 `documentNo` | `DocumentNo` | text |
| 7 `issuedBy` | `IssuedBy` | text |
| 8 `issueDate` | `IssueDate` | nullable ISO calendar day, shared date formatting |
| 9 `expiryDate` | `ExpiryDate` | nullable ISO calendar day, shared date formatting |
| 10 `status` | derived from `ExpiryDate` | translated shared status badge plus existing expiry detail |

Additional DTO properties: `PartnerId` for customer matching; `Type` for name subline.
These are all 11 DTO fields. No fields are removed from the API. No actions column.
Sorting is local on the complete response, not a claimed server sort API.
Excel follows all ten columns and the complete applied-filter result, regardless of page.

## Filter and lifecycle decisions

| Control | Form type / default | Applied behavior / serialized key |
|---|---|---|
| Customer | `number | null`, null | apply on Search; `customerId` sent to API |
| Search | nonnullable string, empty | apply trimmed search on Search; local, no new query key |
| Status | `CustomerAlertStatus | null`, null | apply on Search; local, null means all |

Use the shared filter panel with mandatory Reset; status dropdown retains the existing
all/expired/expiring/valid document counts. This replaces bespoke summary cards without
losing their status-filter function or counts. Dropdowns start null and fill their fields.
Search applies one typed snapshot. Refresh reloads the applied snapshot, not draft edits.
Reset restores empty customer/search/status and searches page 1. Every applied search,
reset and refresh returns to page 1 and retains chosen page size. Local paging uses
`resolveListPaging` before writes; default 10, options 10/20/50/100, no API request.

Expiry classification remains display-only: expired < 0 calendar days, expiringSoon
0..30 inclusive, valid >30. Isolate the existing 30-day threshold. Use local today's
calendar date and UTC day ordinals to avoid DST-length day errors; do not change stored
dates or introduce backend-owned workflow state. Missing/invalid dates show an empty
status/detail rather than valid with Number.MAX_SAFE_INTEGER days; no fabricated value.
Known document names use neutral partner enum translations; partner-type labels use
explicit `alerts.partnerTypes` keys; unknown wire text is retained.

One typed request trigger + switchMap + defer; inner catchError keeps retries alive;
takeUntilDestroyed follows switchMap and finalization releases local/global loading.
Clear old rows while a new result loads to prevent export/counts from representing another
query. List and lookup failures each have one inline owner, explicit suppression header,
apiErrorMessage for HTTP bodies and translated fallback keys. Lookup Retry is available
after either failure channel and uses only local loading. Reactive customer control is
disabled/enabled through the form API during lookup; no template-only disabled binding.

## Source conformance before edits

| Concern | Book | Reference / shared producer | Target evidence and required correction |
|---|---|---|---|
| Container and title | UI 1/3 | Job metadata host, sigma-list-page/panel/header; styles.scss and FeatureTitleComponent | Alerts lacks sigma-route-host, imports Staff SCSS; adopt exact shared chain/title wrapper |
| Filters and actions | UI 4/16/24 | Job form/appFilterPanel/appFilterActions; FilterPanelComponent mainColumns=6, mandatory reset; shared buttons | Replace staff filter geometry and cards with labelled customer/search/status fields and count-bearing options; preserve Refresh/Excel |
| Grid and paging | UI 5/6/8 | Job fill=true; DataTableComponent rows min10/default10, options10/20/50/100; dataTableExportRows | Existing viewport clamp, date templates and status palette removed; fill=true; shared date/status types; full response proven above |
| Failures and requests | UI 22/28 | Job bindListQueries switchMap/defer/catchError/finalize then destroy; service skip header | Alerts tap precedes switchMap, outer error kills trigger, teardown upstream; adopt reference lifecycle and inline owner |
| RTL/theme | UI 24/25 | global sigma-* tokens, shared badge/panel/grid | Remove cross-feature SCSS, hard-coded colors and internal overrides; shared owners supply both directions/themes |
| Date display | UI 17 | parseDateValue + formatDisplayDate, shared column type=date | Validate/normalize ISO day before shared formatting, preserve API calendar date without timezone shift |

Phases: 0 discovery, 1 existing read handoff, 2 grid, 5 wiring, 6 reconciliation.
Phases 3/4 not applicable: no editor or domain mutation. No migration. No authorization
candidates for mutations. Builds, tests, lint, runtime/browser/DB, commit/push and deploy
remain owner-only. Contract required decisions are resolved by existing source and books.

### Final source correction to the frozen handoff (2026-10-02)

The final source comparison found `shared/utils/list-query.ts` exports
`DEFAULT_PAGE_SIZE = 20` (current owner decision recorded in its comment), while the
earlier handoff/book snippets said 10. Current source owns the factual default:
Alerts continues using the shared token, now 20; minimum remains 10 and options
10/20/50/100. Do not override the shared owner to fit a stale snippet. No API paging
or default change was made by this task. The spec follows the token, not a duplicate
constant. This supersedes the handoff's numeric default only; source/document drift
is reported for future documentation reconciliation.

Grid initial local sort remains expiryDate ascending; the shared table owns user
sorting. The existing status filter's explicit “expiring in 30 days” label is retained
through `alerts.expiringSoonDocuments` with its count. Normalized row dates are shared
`toApiDateTime(partnerPickerDate(value))` midnight strings without Z so shared grid/export
date formatting preserves the source day across timezones. Backend dates are unchanged.

### Owner correction — restore visible summary badges (2026-10-03)

The owner requested the removed badges above the table. This supersedes the earlier
decision that the status dropdown alone replaced the visible summary. Frozen Tier S
change: restore Total, Expired, Expiring within 30 days and Valid counts with the existing
`statusCounts` computation and `alerts.*Documents` labels. HEAD's original summary
buttons confirm both the four values and immediate status filtering.

Use native `sigma-secondary-button` controls containing shared `sigma-status-badge`
semantic variants (info/danger/warning/success), wrapping layout utilities and no feature
SCSS. Shared owners inspected before edits: `src/styles.scss` secondary focus/disabled
rules and status variants including dark-theme values; Job's shared list shell. UI 1/4/5/24/25/27
own layout, filter semantics, badges, theme and keyboard behavior. The group stays fixed
above the fill table; rows remain the only grid scroll owner.

Click updates only the applied status, mirrors it into the status form control and resets
page one; it retains the applied customer/search and chosen page size, leaves unrelated
draft edits pending, and makes no HTTP request because the response is complete. Native
buttons support keyboard activation, expose `aria-pressed`, display a selection marker
and are disabled while the list loads. Keep the existing status dropdown in sync.
No API, response, columns, backend, persistence or migration change is required.
