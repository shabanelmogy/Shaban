# Fiscal Years Feature Review Manifest

## Manifest

| Item | Frozen decision or evidence |
|---|---|
| Requested outcome | Refactor all of `SiGmaAngularFrontEnd/src/app/modules/Accounts/FiscalYears` and its directly related .NET contracts. |
| Source scope | Angular route, list, editor, close workflow, models, service and EN/AR translations; .NET FiscalYear ViewModels, mapper, service/interface and controller. |
| Existing user changes | The frontend list page-size default was already changed to 5 for this feature and is preserved in the canonical refactor. Backend was clean at discovery. |
| Evidence | Current Fiscal Years source, current backend close rules and the canonical Sigma guides. No screenshot was supplied for this request. |
| UI shapes | Canonical shared server-paged list/grid; controlled ordinary CRUD editor dialog; exceptional four-step Fiscal Year close workflow. |
| Backend pattern | Normal tenant-scoped entity plus an explicit, guarded Close domain transition. |
| Approved references | `shared/components/data-table` + `Fleet/VehicleService/components/list`; `shared/components/editor-dialog` + `Fleet/VehicleService/components/details`; shared primary action and confirmation services. |
| Routes and modes | Existing `/FiscalYear` list route; list owns `create | view | edit`, selected id and Close workflow state. |
| Actions | Create; View; Edit only while Open; Close only when backend `CanClose` is true. No Delete action is introduced. |
| Permission mechanism | Authenticated layout through existing `AuthGuard`; no authorization API is invented. |
| Applicable phases | 00 through 06. Phase 04 owns the Close transition; Phase 05 owns the success-toast suppression header for read-only POST checks. |
| Packet status | Generated PHASE-00 through PHASE-06 packets are stale. Canonical Master/UI/Backend books are authoritative; generated packets are not edited. |
| Explicit exclusions | Fiscal-year overlap prohibition, deletion policy, accounting redesign, migrations, reports and unrelated modules. |

## Functional Evidence Table

| Evidence | Classification | Required behavior | Owner | Decision |
|---|---|---|---|---|
| Existing Angular grid | Confirmed | Actions, Start Date, End Date and Status with page-size 5 | Phase 02 | Shared data table with exact server total, paging and sort. |
| Existing editor | Confirmed | Create/View/Edit Start and End dates | Phase 03 | Controlled `app-editor-dialog`, typed form and local date-only serialization. |
| Existing close workflow | Confirmed | Eligibility, voucher approvals, consistency, then Close | Phase 04 | Preserve four stages; checks do not show mutation toasts; final Close requires shared danger confirmation. |
| Backend close service | Confirmed | Only oldest completed Open fiscal year can close | Phase 01/04 | Expose `CanClose` in ListVM and repeat all checks under Serializable transaction at mutation time. |
| Existing route/provider | Confirmed | Lazy list route and Layout-level service provider | Phase 05 | Preserve current wiring; do not add a provider or route pattern. |

## Grid and ListVM Contract

| Order | Grid label | Angular property | Backend ListVM property | Transformation | Sortable |
|---:|---|---|---|---|---|
| 1 | Actions | `id`, `status`, `canClose` | `Id`, `Status`, `CanClose` | Shared action menu; server-owned action state | No |
| 2 | Start Date | `startDate` | `StartDate` | `dd/MM/yyyy` | Yes |
| 3 | End Date | `endDate` | `EndDate` | `dd/MM/yyyy` | Yes |
| 4 | Status | `status` | `Status` | Semantic translated Open/Closed badge | Yes |

The ListVM contains only `Id`, `StartDate`, `EndDate`, `Status` and `CanClose`. Tenant, audit, soft-delete and generic plumbing fields are excluded.

## Paging and Sort Contract

| UI state | Query/API | Backend rule | Default |
|---|---|---|---|
| Page | `pageNo` | Clamp to at least 1 | 1 |
| Page size | `pageSize` | Clamp to 1..200 | 5 |
| Sort field | `Filters[sortField]` | Whitelist `startDate | endDate | status` | `startDate` |
| Sort order | `Filters[sortOrder]` | `1` ascending, `-1` descending | `-1` |

Every sort ends with `ThenBy(Id)` and returns exact `TotalCount`, `PageNo`, `PageSize` and `TotalPages`.

## Detail and Write Contract

| UI control | Angular type | Detail | Add | Update | Validation owner |
|---|---|---|---|---|---|
| Identity | dialog input | `id` | — | `id` | Dialog guard + backend lookup |
| Start Date | `FormControl<Date|null>` | `startDate` | `startDate` | `startDate` | Required and valid in both layers |
| End Date | `FormControl<Date|null>` | `endDate` | `endDate` | `endDate` | Required; must be on/after Start Date |
| Status | read-only detail state | `status` | — | — | Server-owned; controls Edit availability |

The Angular create/update payloads exclude subscription, No, audit, validity and status. Dates are normalized to local calendar dates and equality is valid.

## Invariants and Persistence

| Invariant | Add | Update | Close | Evidence |
|---|---|---|---|---|
| Valid ordered date range | Required | Required | Existing range retained | Current service and UI |
| Exact range unique within current tenant | Exclude existing row | Exclude self | — | Existing unique index and service |
| Closed year immutable | — | Block update | Already closed blocks transition | Existing service |
| Close eligibility | — | — | Open, completed and oldest Open year | Existing close service |
| Voucher readiness | — | — | All non-void vouchers approved and posted | Existing close service |
| Journal consistency | — | — | Details present, valid debit/credit lines and balanced totals | Existing close service |

Add and Update use one tracked aggregate and one `SaveChangesAsync`; EF implicit transaction is sufficient. Close retains an explicit Serializable transaction because guarded checks and the mutation form one concurrency boundary.

## Action-State Contract

| Action | Visibility | Confirmation | Success | Failure |
|---|---|---|---|---|
| Create | Always | Dirty-discard only | Close editor and refresh list | Keep data; show inline error |
| View | Every valid row | None | No mutation | Show load error in dialog |
| Edit | `status == Open` | Dirty-discard only | Close editor and refresh list | Keep data; show inline error |
| Close | `canClose == true` | Shared danger confirmation after all three checks pass | One success toast, refresh list, keep result visible until Close | Keep workflow open with actionable result |

Check endpoints are read-only workflows despite using POST. They carry `X-Skip-Success-Toast`; the final Close request does not.

## Route, Provider and Runtime Contract

| Surface | Frozen decision |
|---|---|
| Route | Preserve existing `/FiscalYear` lazy list route. |
| Provider | Preserve existing Layout-level `FiscalYearService` provider; do not duplicate it. |
| Interceptors | Token/error interceptors remain global. Add a generic opt-out for success toast and use it only for close checks. |
| Refresh | Initial/lazy list request; refresh current valid page after create/update/close. |
| Failure channels | Handle both `isSuccess: false` and transport errors; release loading in `finalize`. |

## AutoMapper and Calculation Decisions

Use explicit one-way maps. No `ReverseMap()` is required. The update map ignores `Id`, tenant and server-owned `No`; `CanClose` is ignored in the entity projection map because it is computed from the current cross-row close-eligibility rule. Fiscal Year has no client-owned totals or domain calculation changes in scope.

## Unresolved Requirements Register

| Requirement | Status | Safe boundary |
|---|---|---|
| Overlapping but non-identical fiscal-year ranges | Uncertain; no current source rule proves they are prohibited | Preserve exact-range duplicate validation only. |
| Delete Fiscal Year | Missing business rule and not exposed by the UI | Do not add a Delete action or override. |

## Final Reconciliation

| Check | Result |
|---|---|
| Frontend implementation | Complete: Fiscal Years now uses the canonical shared data table, server paging/sort contract, typed editor dialog, translated states, and guarded Close workflow. |
| Backend implementation | Complete: list projection/paging/sort, date and closed-year validation, exact-range duplicate protection, `CanClose` action state, and the existing atomic Close checks are aligned with the frontend contract. |
| Contract alignment | Complete: list columns are `Actions, Start Date, End Date, Status`; ListVM properties are `Id, StartDate, EndDate, Status, CanClose`; create/update payloads contain only editable dates. |
| Error and toast behavior | Complete in source: both business failure and transport-error channels are handled; read-only Close checks suppress the global success toast, while the final Close keeps the normal success toast. |
| Routing/provider | Preserved existing Fiscal Year route and Layout-level service provider; added the lazy Fiscal Years list component to the existing `tsconfig.app.json` entry-file list so Angular includes it in the compilation program. No duplicate runtime wiring added. |
| Migration boundary | No entity or EF configuration changed. No `Add-Migration` is required for this refactor. |
| Source-only diff review | Complete separately in `SiGmaAngularFrontEnd` and `SigmaBackend`; no stale scoped imports, legacy Fiscal Year grid types, merge markers, or whitespace errors found. |
| Verification limits | Build, tests, lint, runtime/browser, database and migration commands were not run, as prohibited by the workspace instructions. |

Generated phase packets were checked before work and reported stale for PHASE-00 through PHASE-06; the canonical Master/UI/Backend books were used as the authority and generated packets were not edited. Remaining owner verification is to build the two applications and exercise list paging/sorting, create, view, edit, closed-year action visibility, and the four Close checks in the normal authenticated environment.
