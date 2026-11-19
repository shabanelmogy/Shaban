# Lease Master Agreement — Feature Review Manifest and Contract Freeze

Status: Frozen and reconciled for the confirmed list, lookup, detail, write,
and approval contracts; two screenshot/source conflicts remain explicitly
unresolved, and one shared-base compatibility exception is recorded.

Review date: 2026-08-19

## Authority and scope

This review follows:

1. `F:\Shaban Documents\Shaban\sigma-erp\SIGMA_FEATURE_REVIEW_MASTER.md`;
2. the canonical list/filter/action/date/loading/translation blocks in
   `SIGMA_UI_PATTERNS.md`;
3. the canonical normal-entity, ListVM, filter, validation, mapping, action,
   and transaction blocks in `SIGMA_BACKEND_PATTERNS.md`.

The requested scope is the Lease Master Agreement feature:

- Angular: `SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseMasterAgreement/`;
- directly related API contracts: the Lease Master Agreement view models,
  mapper, service, interface, and controller under `SiGmaBackend`;
- directly related feature translations only where required by the new screen.

Existing unrelated working-tree changes, including Lease Quotation work and the
database snapshot/migration files, are preserved and are not part of this
scope. No generated recipe is edited. `Generate-SigmaRecipes.ps1 -Check` was
run before using any packet and reported all generated PHASE-00 through
PHASE-06 packets stale; canonical sources therefore govern this review and the
owner must regenerate and semantically review packets separately.

## Phase 0 functional evidence

Screenshots are functional/content evidence only. They do not override the
canonical component or API patterns.

### Evidence E1 — `C:\Users\shaban\Desktop\1.PNG`

| Visible evidence | Classification | Contract consequence |
|---|---|---|
| Title `Master Agreement` and subtitle `Manage Master Agreements` | Explicit | Use the existing `masterAgreement.title` and `masterAgreement.manage` terminology. |
| Filters for Master Agreement No, Approval Status, Quotation Ref No, Date Range, Customer | Explicit | Provide typed controls and send the frozen filter keys below. |
| Customer lookup/search affordance | Explicit | Use the canonical Customer `GetSelect` lookup contract. |
| Export to Excel and Refresh | Explicit | Keep both actions; export requests the complete filtered result. |
| Grid headers Actions, Master Agreement No, Date, Customer, Code, Quotation No, PO | Explicit, with one unresolved field | Implement confirmed columns; PO remains Missing because no source property exists. |
| Empty grid with pagination | Explicit | Use `app-data-table`, server paging, total count, and a translated empty state. |

### Evidence E2 — `C:\Users\shaban\Desktop\2.PNG`

| Visible evidence | Classification | Contract consequence |
|---|---|---|
| Rows contain LMA number, date/time, customer, customer code, quotation number | Explicit | Map the confirmed list response fields below. |
| Approval badges appear beside the agreement number | Explicit | Keep approval status in the response and render its badge in the number cell; do not add an unshown standalone column. |
| Row menu contains Print, Detail, and Approve | Explicit minimum action evidence | Detail and approve are supported vertically; Print is retained as a UI action only after a printable detail view is loaded. |
| Approved and not-approved states are visible | Explicit | `CanApprove`/status visibility is server-derived and revalidated by the API. |
| Date range `19/08/2024 - 19/08/2026` and a red border | Explicit value, uncertain validation meaning | Preserve range ordering and local date serialization; do not infer a new validation rule from border styling alone. |
| PO values are visible | Conflicting/Missing | No `PO` property exists on `LeaseMasterAgreement` or `LeaseQuotation`; do not invent a field or payload. |

## Selected canonical shapes and references

| Concern | Selected shape | Canonical/reference evidence |
|---|---|---|
| Backend | Pattern 1 — Normal entity, with a stateful approve action | Backend book Pattern 1 and action block; existing Lease Master Agreement approval invariant. |
| List/grid | Typed `app-data-table` with lazy paging and typed columns | UI blocks 5–6; `Fleet/VehicleService/components/list`. |
| Filters | Typed reactive form, flat `Filters[key]` query keys | UI block 4 and backend filter block. |
| Actions | Shared `ActionList`; confirmation dialog for approve/delete; row status controls visibility | UI block 7 and shared `ConfirmationDialogService`. |
| Export | Full filtered result, translated headers at click time | UI block 8. |
| Dates | PrimeNG range calendar; local `yyyy-MM-dd` query values | UI block 17; backend `FilterHelper`. |
| Detail | Read-only `app-editor-dialog` backed by a feature-owned minimal projection at `GetByWithNavigationsId` | UI block 15, shared editor dialog, and backend projection guidance. |
| Lookup | `Customer/GetSelect` returning `DropdownDto` (`id`, `value`, `no`) | Backend `CustomerService.SelectAsync`; UI block 16. |

## Frozen API and data contracts

### List response and grid columns

The feature-declared part of `LeaseMasterAgreementListVm` is narrowed to the
exact grid values plus the minimum action state. The frontend grid column list
is:

| Grid column | ListVM property | Source/binding |
|---|---|---|
| Actions | `Id`, `ApprovalStatus`, `CanApprove` | Shared action menu; no synthetic `actions` field. |
| Master Agreement No | `No` | `EntityBase.No`; fallback display is `Id` only when the number is absent. |
| Date | `Date` | `LeaseMasterAgreement.StartDate`; this is the same single-date convention used by the approved Rental Master Agreement list. |
| Customer | `CustomerName` | `Customer.Name`. |
| Code | `CustomerCode` | `Customer.No`, the confirmed inherited partner code. |
| Quotation No | `QuotationNo` | `Quotation.No`. |
| PO | — | **Missing**; excluded until an owner supplies a source field and migration/API decision. |

Feature-consumed ListVM properties: `Id`, `No`, `Date`, `ApprovalStatus`,
`CustomerName`, `CustomerCode`, `QuotationNo`, and `CanApprove`. No nested
navigation objects, notes, child collections, or unshown export-only fields are
declared by this feature. The canonical current VM convention uses
`ListBaseVm`, which also serializes shared tenant/audit compatibility metadata.
Removing that exposure consistently is backend-book backlog work and is not
handled through a one-off shared-contract divergence in this feature scope.

### Filters and paging

The client sends `pageNo`, `pageSize`, and exact-case `Filters[...]` keys:

| UI value | Query key | Semantics |
|---|---|---|
| Master Agreement No | `masterAgreementNo` | Trimmed contains match on `No`. |
| Approval Status | `approvalStatus` | Defined numeric `ApprovalStatus` value. |
| Quotation Ref No | `quotationRefNo` | Trimmed contains match on `Quotation.No`. |
| Range start | `fromDate` | Inclusive date on `StartDate`. |
| Range end | `toDate` | Inclusive through end of day/date. |
| Customer | `customerId` | Exact customer ID. |
| Table sort | `sortField`, `sortOrder` | Whitelisted fields and deterministic `Id` tie-breaker. |

The server clamps `pageNo` only to a minimum of 1 and page size to 1–200,
filters before `CountAsync`, rejects a reversed valid date range, returns
`PageNo`, `PageSize`, `TotalCount`, and `TotalPages`, and returns an empty
successful page when the requested page is past the last page. The client may
then request the calculated last page.

### Detail, add, and update

- `GET LeaseMasterAgreement/GetByWithNavigationsId/{id}` uses an `AsNoTracking`
  minimal projection and returns the read-only fields `Id`, `No`, `StartDate`,
  `EndDate`, `ApprovalStatus`, `CustomerName`, `CustomerCode`, `QuotationNo`,
  and `Notes`; it does not recursively load navigation graphs.
- `POST LeaseMasterAgreement` accepts only client-editable `StartDate`,
  `EndDate`, `CustomerId`, `QuotationId`, and `Notes`.
- `PUT LeaseMasterAgreement` accepts those fields plus the required `Id`; the
  server owns `No`, `SubscriptionId`, `ApprovalStatus`, navigations, and audit
  values.
- The generic `UpdateBaseVm` and `DetailBaseVm` constraints still expose their
  shared compatibility properties in the wire schema. Mapping ignores
  server-owned update values, and feature code does not consume the extra
  detail metadata. Removing those properties requires the shared generic-base
  backlog refactor, not a feature-local contract invention.
- Date order, quotation existence/approval, customer/quotation ownership,
  duplicate quotation linkage, approved-row edit/delete rules, and lease-child
  references are backend invariants.

### Approval action

`POST LeaseMasterAgreement/{id}/approve` has no client payload. It is offered in
the menu only when the server-projected `CanApprove` flag is true. That flag
requires a not-approved state, valid dates, valid same-tenant customer and
quotation ownership, and approved internal/customer quotation states. The
backend repeats those checks and returns the standard localized `Result`
failure channel. The shared confirmation dialog is required.

### Print and detail actions

Detail is a supported read action because the endpoint and detail DTO exist.
Print is a supported visible workflow only after the detail view is populated;
it uses the shared `ReportPrintService` and does not create a new report/API.

## Unresolved requirements and boundaries

1. **PO column — Missing.** The screenshot shows PO, but neither the entity nor
   the quotation source has a PO property. The column is not implemented and
   no client/server field is invented. An owner decision must name the source,
   persistence/API shape, and migration boundary before it can be added.
2. **Document number — Conflicting.** The screenshot shows `LMA...` numbers,
   while the current shared number generator has no LeaseMasterAgreement case
   and falls back to a tick-based value. This refactor preserves the existing
   server-owned `No` and does not modify the shared generator. Numbering should
   be resolved by the owner in a separate contract/migration review.
3. Screenshot border styling does not establish a date-validation rule beyond
   the confirmed start/end ordering and local date-range serialization.

## Route and provider contract

The existing lazy route `LeaseMasterAgreement` and `LayoutModule` service
provider are already wired. No new authorization mechanism is introduced (the
application has authentication but no authorization service). The feature adds
the child route `view/:id` for the read-only detail dialog; sidebar/menu wiring
remains unchanged.

## Implementation handoff

The confirmed contracts above are Frozen for the frontend and backend review.
Phase 2 read/grid, Phase 3 detail/write, and Phase 4 approve work may proceed
against this handoff. The unresolved PO and numbering rows remain outside the
implementation boundary and must remain visible in final reconciliation.

## Phase 6 final reconciliation

| Contract area | Reconciled result | Evidence/check |
|---|---|---|
| Grid and ListVM | Six visible data columns plus action state match across Angular and the backend projection; PO remains explicitly excluded. | Typed columns/models compared with `LeaseMasterAgreementListVm` and AutoMapper projection. |
| Filters, dates, sort, paging | Exact `Filters[...]` keys match; status `0` is retained; dates are local `yyyy-MM-dd`; the API rejects reversed ranges and preserves page-past-end semantics. | Service/query source comparison and focused service specification. |
| Detail and Print | Read-only routed dialog consumes only the flat minimal detail shape; print occurs after data load and print-only controls are hidden. | Route, component, service, detail VM, mapper, and service projection review. |
| Write invariants | Client DTOs omit approval status; create/update validate required dates, quotation approval, customer ownership, and duplicate quotation use. Approved rows cannot be edited/deleted. | View models, one-way mappings, and service boundary review. |
| Stateful actions | Approve visibility uses only `CanApprove`; confirmation is shared; the endpoint repeats all domain checks. | Angular actions and backend approve method comparison. |
| Concurrency | Add and update duplicate-check/save boundaries use serializable transactions pending a separately approved unique constraint. | Service transaction review; no schema files changed. |
| Localization and errors | Both Angular failure channels are handled; custom backend results use EN/AR resource keys. | Component/service subscriptions and parsed resource XML/key comparison. |
| Runtime wiring | Existing parent lazy route/provider remain valid; `view/:id` is wired in the feature. | Direct route/provider source inspection. |
| Mapping/calculation | Mappings are one-way and projection-safe; `CanApprove` is server-owned. No domain totals or other calculations apply. | Mapper/source review; no `ReverseMap`. |

Source-only checks found no stale feature aliases, obsolete table imports, PO
bindings, merge markers, missing localized service keys, or scoped whitespace
errors. The focused final audit findings were applied. Builds, tests, lint,
browser/runtime checks, database commands, and migrations remain pending for
the owner as required by the review boundary.
