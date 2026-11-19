# Individual customers (IndividualPartner) — Feature review

| | |
|---|---|
| Status | Closed |
| Owner verification pending | no — owner tested the screen 2026-10-01 ("انا جربت كده تمام") |
| Date | 2026-10-01 |
| Requested as | "refactor : IndividualPartner — عشان نتأكد من صحة نظام docs بعد التعديل" |
| Tier | M (one screen end to end) — Master block 1 |
| Screen type | 03 Step-form record (`ui/screens/03-step-form-record.md`) with its list |
| Backend pattern | 2 — the partner owns documents and credit cards (single-row address and billing info) |
| Guides | Master Guide; UI blocks 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 17, 18, 19, 22, 23, 28; backend blocks 3, 5, 7, 8, 9, 13, 18; packets `-Check` 8×OK before and after |

## 1. Manifest

| Layer | Files |
|---|---|
| Backend | `Services/Bases/Service.cs` (new `MaterializeListAsync` hook), `Services/Customers/IndividualPartnerService.cs`, `MapperConfig/IndividualPartnerProfiler.cs`, `ViewModels/IndividualPartner/IndividualPartnerListVM.cs`, `ViewModels/PartnerBillingInfo/PartnerBillingInfo{Add,Update}VM.cs`, `GeneralMessage.resx` / `.ar-SA.resx` (19 keys) |
| Frontend | `Customers/Individual/IndividualPartner/{models/*, services/individualpartner.service.ts, components/list/*, components/details/*}`; shared `field-error.component.ts`, `src/styles.scss`; `i18n/vocabs/en.ts`, `ar.ts` |
| Removed | `list.component.scss` (572 lines), `details.component.scss` (520 lines), the global `.individual-*` dialog and scroll-lock rules in `src/styles.scss` |

## 2. Decisions (Master block 4)

| # | Decision | Evidence |
|---|---|---|
| 1 | Screen type 03 list + routed step-form editor | Three ordered groups (details, documents, billing & cards) and two child collections — block 13 rule sends it to a page; block 12 step form |
| 2 | Editor shape: shared editor shell (`sigma-editor-*`) + `app-step-form` + `app-form-section` | UI block 1 *Shared editor page shell*, block 12 |
| 4 | Grid columns vs ListVM | See §3 — every column is a ListVM member; `contactGroupId` is the only non-displayed member (Edit contact group pre-selection) |
| 8 | Style ownership | No feature stylesheet. Shared gaps added to `src/styles.scss`: `sigma-editor-scroll`, `sigma-field--check`, `sigma-file-field` |
| 15 | Filter contract | `branchId`, `contactGroupId`, `isInactive` = generic property filter; `search`, `agreementStatus` = `ApplyListFilters`; `sortField`/`sortOrder` = `ApplyListOrder` allow-list; paging 10 default, 1–100 (base) |
| 17 | Service registration | `providedIn: 'root'`, `environment.baseUrl`; the list request sends `X-Skip-Error-Interceptor` (inline error) |
| 22 | Child collections | Full snapshot (D4-3): documents and cards send every row, saved rows with `id`; base `UpdateAsync` reconciles |
| 24 | Authorization candidates | Delete customer; Edit contact group; card export (full card data) — no permission model yet (deferred plan) |
| 25 | Business correctness | CVV never exported, card numbers masked; one default card; contact number no longer falls back to the next-of-kin number (a different person) |

## 3. Contracts

**Grid ↔ ListVM**

| Grid column (`field`) | Sortable | ListVM member |
|---|---|---|
| `no` | yes | `No` (base) |
| `name` | yes | `Name` (new; the partner's full name) |
| `contactGroup` | yes | `ContactGroup` (projected `ContactGroup.Name`) |
| `mobileNo` | yes | `MobileNo` |
| `contactNo` (home, else work) | no | `PhoneHome`, `PhoneWork` |
| `email` | yes | `Email` |
| `branch` | yes | `Branch` (projected `Branch.Name`) |
| `isInactive` (status badge) | yes | `IsInactive` |
| — (action state) | — | `ContactGroupId` |

Removed from the ListVM: `FirstName`, `MiddleName`, `LastName`, `Gender`, `BranchId` (not shown). Other screens (Collection reports) read `name` from this list and received `undefined` before; they now get the name.

**Detail / Add / Update** — unchanged members, plus `BillingInfo.EmailInvoices` on Add/Update: the checkbox existed in the editor and in the entity but was missing from the write VMs, so it never saved (Company billing benefits too). The payload carries no `subscriptionId` and no `no`; dates are `yyyy-MM-dd` (`toApiDate`), never `toISOString()`.

**Actions** — View, Edit (route with the list's query parameters), Agreements history (read-only dialog, client-paged `app-data-table`), Edit contact group (small modal, dirty-close confirm), Delete (confirmation; blocked by any agreement, booking, master agreement, invoice, receipt, payment, journal line or opening balance; documents and cards deleted with the customer through `RemoveWithChildrenAsync`).

## 4. Findings fixed

| # | Layer | Finding | Fix |
|---|---|---|---|
| 1 | BE | Custom `GetManyAsync` (default page size 20, its own paging) | Base list + `ApplyListFilters` / `ApplyListOrder` / `MaterializeListAsync` |
| 2 | BE | Base list mapped entities without navigations → branch/contact-group names empty for any hook-based list | New base hook `MaterializeListAsync`; this service projects with `ProjectTo` (BE 13) |
| 3 | BE | Literal English messages | 19 localized keys (en/ar), `BusinessFailure` |
| 4 | BE | Delete left documents and cards active | `RemoveWithChildrenAsync(x => x.Documents, x => x.CreditCards)` |
| 5 | BE | Receipts were checked by `ContactId` only | `ContactId` or `CustomerId` |
| 6 | Contract | `EmailInvoices` never saved | Added to billing Add/Update VMs |
| 7 | FE | Feature filter strip, buttons, page/panel CSS | Shared list shell, `form[appFilterPanel]`, `app-primary-action-button` |
| 8 | FE | Feature error and success toasts, private `extractErrorMessage` | Interceptor owns mutation messages; list error inline with `apiErrorMessage` |
| 9 | FE | Hand-built agreements dialog with its own pager | `app-editor-dialog` + `app-data-table` |
| 10 | FE | Card export wrote the CVV and full card number | Removed / masked (UI block 8) |
| 11 | FE | Keys used but never defined (`individualPartners.errors.*`, `export.*`, `pageReport`, `empty`, `pager.*`, `errorSummary`) | Defined or replaced by shared keys; `Check-Translations` 0 missing; all 172 used keys exist |
| 12 | FE | Editor: ~60 hand-written error blocks, Bootstrap grid, read-only typeless calendars with icons | `sigma-field` + `app-field-error`, typeable calendars without icon (UI 17) |
| 13 | FE | Dates through `toISOString()` (birth date one day early at UTC+4) | `toApiDate` |
| 14 | FE | `subscriptionId` in the payload | Removed (UI block 2) |
| 15 | FE | Hand-rolled upload/delete bookkeeping | `DocumentUploadTracker` |
| 16 | FE | Untyped `any` form and payload | Typed form, rows and payload models |
| 17 | FE | Editor returned to an unfiltered list | Returns with the list's query parameters (UI 10); list keeps filters/page/sort in the URL |
| 18 | FE | Contact groups of every type offered | Customer groups only (`getSelectByType(Customer)`) |

## 5. Documentation-system findings (the purpose of this review)

| # | Finding | Action |
|---|---|---|
| D1 | The type 03 reference (Company) predates the shared editor shell | Catalog and screen 03 now name Individual; UI backlog 41 for Company |
| D2 | The editor shell had no one-pane scroll owner, checkbox field or file field | Added to `src/styles.scss`; UI blocks 1 and 18 |
| D3 | `app-field-error` needed a control even for a rejected file | `message` input; UI block 19 |
| D4 | No export rule about secrets | UI block 8 *No secrets in a file* |
| D5 | Base hook lists lost navigation names | BE 13 / BE 5 `MaterializeListAsync` |
| D6 | Card data storage (CVV, full number) | BE backlog 28 — owner decision |

The books, packets (`-Check` 8×OK), `Check-BookReferences.ps1` (clean) and the skill were updated in the same task.

## 6. Reconciliation (source-only)

| Check | Result |
|---|---|
| Grid columns ↔ ListVM ↔ sort allow-list | Match (§3); backend sort keys `no, name, contactgroup, mobileno, email, branch, isinactive` |
| Payload ↔ Add/Update VMs | Match; server-owned fields absent |
| Translations | en/ar parity 0 missing; every used key resolves |
| TypeScript lib es2018 | No `flatMap`/`at`/`replaceAll` |
| Whitespace | `git diff --check` clean in both repositories |
| Migration | **None** — no entity or EF configuration changed |

## 7. Owner checks

1. `dotnet build`, `ng build`.
2. Individuals list: search, branch, agreement status, inactive-only; sort by each column; paging; Reset; export (same columns); card export (no CVV, masked number).
3. Branch and contact-group names appear in the grid (they were empty before).
4. Create and edit an individual through the three steps; validation summary jumps to the field; birth date saves the same day; upload/remove a profile picture and a document; cancel deletes unsaved uploads; *Email invoices* now saves.
5. Delete a customer with and without documents; with an agreement → localized Arabic message.
6. **Decision pending:** card data storage (BE backlog 28).

## 8. Owner feedback — 2026-10-01

| Request | Cause | Fix |
|---|---|---|
| "اما اضغط على ERROR BADGE يوجهنى على INPUT اللى فيه الخطأ" | The badge switched step and focused the control, then the step's deferred scroll-to-top ran and undid the jump; two badges shared one `controlPath` | Shared `shared/utils/focus-field.ts`; the badge path changes step without scroll-to-top; unique paths (UI block 12) |
| "كل مربعات الفلاتر نفس الارتفاع" | The 34px rule in `src/styles.scss` matched only forms with a `*-filters` class; this list's `form[appFilterPanel]` had none (block 4 rule 7 asked for it — missed here) | `.sigma-filter-panel` added to the five height rules: every shared filter panel is 34px without a feature class (UI block 4) |
| "step الخاصة ب billing and card متلخبطة خالص" | Every billing control was poured into one grid in form-model order (rental and lease mixed, amounts away from their calculation type) | Four groups: credit & tax (+ the three flags on their own row), invoicing (rental row, lease row, fines/tolls), surcharges (5 columns: amount beside its type; rental row, lease row), cards (UI block 12) |
| "لو الناقص dropdown … يفتح dropdown" | — | `focusField` opens a dropdown after the scroll settles (UI block 12) |
| "كل الادوات فى الفورم نفس الارتفاع … بينزل العنصر لتحت" | Fields set only a 34px minimum (PrimeNG controls taller) and stretched with the row, so a neighbour's error pushed the control down; table cells were centred | Exact 34px controls in fields and tables, top-aligned grid cells and table cells (UI blocks 1, 14); the shared token is 34px (was 36px) |
| Billing step sections overlapped (screenshot) | `app-form-section` has `min-height: 0` and the new scroll owner squeezed it | `.sigma-editor-scroll > * { flex: 0 0 auto; }` (UI block 1); the three section keys were inserted into another vocabulary block and were moved into `individualForm` |
| "expirydate على الاقل يكون بعد تاريخ الاصدار بيوم" | The form validator already required expiry > issue, but the picker offered earlier dates and the backend did not check | Expiry picker `[minDate]` = issue + 1 day (`minExpiryDate`, cached per row); backend rejects `ExpiryDate.Date <= IssueDate.Date` on Add/Update (`IndividualPartnerDocumentExpiryNotAfterIssue`, en/ar) |

Company's step form has its own navigation code with the same race (hidden by timer order); it moves to `focusField` in its review (UI backlog 41).

## 9. Shared-extraction gate — 2026-10-01

Owner standing rule: "بعد الانتهاء من اى مرحلة لو فى مكونات ينفع تكون مشتركة تتنفذ". It is now Master block 5 *Shared-extraction gate*, Master 7, the skill, and memory.

Applied to this screen:

| Repeated pattern | Shared piece | Adopted here |
|---|---|---|
| 8 date-picker attributes plus a click handler on every calendar | `shared/directives/date-picker.directive.ts` (`appDatePicker`) | 5 calendars |
| `pTemplate` item/selectedItem pair to translate enum options | `shared/pipes/translate-options.pipe.ts` (`translateOptions`) | 16 dropdowns |
| File box markup with upload, remove and validation code | `shared/components/file-field` (`app-file-field`) | profile picture and document rows; the editor TS has no file code |
| Discard and delete confirmation options | `ConfirmationDialogService.confirmDiscard` / `confirmDelete` | list and editor |
| List URL state (filters, page, sort) | `shared/utils/list-route-state.ts` | list |
| Hand-built invalid-field badges | `shared/utils/step-form-fields.ts` (`StepFormFieldSpec`, `rowFields`, `invalidStepFields`) | editor |
| `if (id.HasValue && !Exists…)` per reference; `if (Exists…) return` per delete blocker | base `ExistsOrNullAsync<T>`, `FirstBlockingReferenceAsync` | `IndividualPartnerService` |

The other screens are counted in UI backlog 39 and move to these pieces when they are reviewed. Job (the list reference) still writes its own list-URL state and calendars; it moves on its next change.

## Paging-helper adoption — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes — this follow-up has not been executed in the app |
| Authorization | Owner requests the same helper adoption in Customers/Individual |
| Scope | IndividualPartner/components/list/list.component.ts; this review appendix |

The Closed status and owner acceptance above are historical and do not certify this follow-up. Scoped discovery found one server-paged list handler in Customers/Individual. No new rule, backend contract or UI shape is required: this is the list portion of screen type 03.

| Concern | Owning block | Actual reference / shared owner | Frozen target |
|---|---|---|---|
| Paging conversion and comparison | UI 6; Phase-02 packet | Job list onLazyLoad; shared utils/list-query.ts resolveListPaging | Use the existing helper against previous pageNo/pageSize before signal writes. Size-only changes reload; unchanged page/size/sort skips. |
| Page-size bound | Existing Individual list contract | onLazyLoad, restoreStateFromRoute, IndividualPartnerListQuery/toListParams | Preserve minimum 10 and maximum 100; cap the event to 100 before shared page conversion. Initial default remains 10. |
| Sorting | UI 5/6 | Job typed column whitelist; Individual columns/currentQuery | Preserve column-derived allowed fields, nullable sort field and sort-order fallback. A sort-only change still requests data. |
| Request and route state | UI 28/22 | Job bindListQueries; Individual bindListQueries/requestList/writeStateToRoute | Retain existing switchMap/defer, loader finalization, inline errors, full-query deduplication, activeFilters and route restore/write. |

All eight generated packets passed the drift check before work. The shared helper and rule already exist, so canonical books, skill and packets require no content change for this adoption. One small handler change; no subagents or unrelated edits.

Final reconciliation: the application diff contains only the helper import and onLazyLoad adoption. The handler resolves page/size against the previous signals and compares sort separately before updating state. It then retains the original route write and typed currentQuery/requestList flow. Source traces: changing page 1 from 10 to 50 requests again; identical page/size/sort returns; first 100 / rows 50 maps to page 3; sort-only changes still request; an unsupported sort field retains the previous field. Existing switchMap cancellation and forced Search/refresh remain intact. These traces are reasoning from source, not executed tests. Scoped diff, whitespace and merge-marker checks passed. No build, tests, lint, app/browser execution, database commands, migrations, commits or pushes. Owner runtime acceptance is pending for page-size changes, sorting, rapid paging and returning from the editor. Suggested frontend commit: `refactor(individual): reuse shared list paging helper`.
