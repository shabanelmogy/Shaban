| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Debt collection correction handoff — 2026-10-02

## Scope and evidence

User authorizes review and confirmed fixes in `Customers/debtCollection`, and reports that adding a note with Promised removes results. Tier M: existing screen corrections, no new business capability. Historical `DEBT_COLLECTION_DISCOVERY_CONTRACT_FREEZE.md` remains unchanged. This handoff records subsequent source-supported corrections; its D2 transport ceiling remains in force.

Frontend scope: the debtCollection folder, its existing EN/AR `reports` translations and direct shared dependencies (read-only). Backend correction: only the follow-up projection inside `CustomerService.GetDebtCollectionAsync`. Both repositories already contain substantial pending changes, including the scoped files; preserve them. Baseline copies/hashes captured before edits. No screenshots were supplied. Written defect report is Explicit; exact runtime reproduction remains owner verification.

UI shape: report with existing collection workflow row actions (historical exception), shared local presentation paging over the retained first-page contract; history View dialog and small typed action dialogs. Backend read Pattern 5; FollowUp/BlackList existing generic writes. References: Customer Statement `print`/`onTablePage`, Job list `bindListQueries`, Job close action dialog, shared DataTable/EditorDialog/date helpers/confirmation/translateOptions. Routes: `/DebtCollection` -> empty child route, no new modes. APIs: GET Customer/DebtCollection, GET FollowUp/Customer/{id}, POST FollowUp, POST BlackList. Root owns integration; a read-only luna_explorer audit owns backend contract tracing, with no edits.

## Frozen decisions

Scope amendment before the final integration edit: UI block 3 and the existing `app-feature-title` require one page title inside the report. `ToolbarComponent.showPageTitle` currently lacks `/DebtCollection` in its route exclusions. Authorize the minimal route exclusion in `src/app/_metronic/layout/components/toolbar/toolbar.component.ts`; preserve every existing route exclusion and implementation. Baseline captured separately before this edit. Shared dependencies otherwise remain read-only. The history grid also displays its existing `IsPromised` field as a translated Yes/No badge, making the saved promise visible without changing the DTO.

| Concern | Decision and evidence |
|---|---|
| Promised checkbox | Unchecked means no promise filter; checked sends `Filters[promised]=true`. Current component sends false through toFilterParams; backend's presence check then selects only latest false follow-ups and excludes customers without follow-ups. Omit the unchecked value in this consumer. Preserve backend explicit false semantics for other callers. |
| Dates | AsOfDate and optional NextFollowup use valid masked date controls and `parseDateValue` -> yyyy-MM-dd strings. Follow-up DateTime uses `toApiDateTime` at submission, retaining wall-clock time. Form validity blocks partial dates. Backend DateTime missing from anonymous projection is restored so the existing date/Id latest ordering can compile. No timestamp policy change. |
| Read refresh | One switchMap/defer report stream cancels a superseded request. User Search resets presentation page; successful row actions refresh the last applied filters and retain/clamp page. Form disable/enable emitEvent=false does not invalidate results. Same for history requests: cancel on close/customer change and reject stale identity. |
| Writes | Guard duplicate submissions; disable submitted forms; restore entered data on failure; successful blacklist save hides/resets directly rather than calling a close method that rejects saving=true. No new blacklist removal workflow or permission restriction. |
| Dirty exit | All editable dialog exits (X/Cancel/Escape) use existing confirmDiscard preset and reports.discard keys. View/pristine exits silently; in-flight writes cannot close. |
| Feedback | Report/history reads own inline errors and send X-Skip-Error-Interceptor. Standard mutations retain the global error/success owner and recover locally without a duplicate message. |
| Print/export | Print disables presentation slicing/scrolling for one render frame, restores controlled page/size, and cancels scheduled preparation on destroy. Excel reuses dataTableExportRows for grid-identical fields, including latest note and date. Both cover all returned rows only. |
| Dataset ceiling | GET retains PageNumber=1, PageSize=100, Result<List<DebtCollectionResultDto>>, no total metadata. Owner explicitly requested removing the visible ceiling message during final reconciliation; omit it from screen/print and remove its unused keys. Document the ceiling in this handoff and final review. Historical O1 remains unresolved: no claim of complete dataset when more than 100 customers match. No speculative all-page loop or new API shape. |
| Translation/layout | Existing shared shell host is restored to sigma-route-host sigma-print-flow. translateOptions resolves filter option labels in active language using existing numeric API IDs (current project enums for customer/type/blacklist are string translation enums, unsuitable for numeric enumOptions). Retain non-accounting KPI counts/layout, remove duplicated shared tile typography/palette. |
| Page title | Exclude `/DebtCollection` from the outer toolbar title; keep the report's `app-feature-title`. Existing route matching convention, UI block 3. |
| Finance/schema | Preserve all existing money/aging/allocation calculations. No entity/EF/map change, no migration. Financial calculation concerns are reported separately and not silently redefined. |

## Filter and response contract

| Form control | Transport key | Value/default | Backend consumer |
|---|---|---|---|
| asOfDate | Filters[asOfDate] | required yyyy-MM-dd; today | DateTime.TryParse -> Date |
| customerType | Filters[customerType] | null omitted; 0 Individual, 1 Company | PartnerType comparison |
| agreementStatus | Filters[agreementStatus] | null omitted; 0 Open, 1 Closed | Agreement.IsClosed |
| agreementType | Filters[agreementType] | null omitted; 0..4 | rental Type / LeaseAgreement subtype |
| isBlacklisted | Filters[isBlacklisted] | null omitted; 0/1 | BlackListEnum predicate |
| dueFollowUpToday | Filters[dueFollowUpToday] | false no constraint; true today | latest NextFollowup date |
| promised | Filters[promised] | false omitted; true promised only | latest IsPromised |
| showOnlyExceedLimit | Filters[showOnlyExceedLimit] | false no constraint | Balance > CreditLimit |

Grid order beside response fields: Actions(CustomerId/status), CustomerName(CustomerCode), ContactNo, CreditPeriod, CreditLimit, P1_0_30, P2_31_60, P3_61_90, P4_91_120, P5_121_150, P6_151_180, P7_181_Plus, SubTotal, UnAllocated, Balance, NextFollowup(LatestNote), DebtCollector(DebtCollectorName). `Promised` supports the KPI. No generic ListVM is invented; existing report DTO and money values remain. History: Id, DateTime, Notes, NextFollowup, IsPromised; CustomerId/name identify its owning dialog. Writes carry CustomerId + Notes/NextFollowup/IsPromised/DateTime or Reason/IsBlackList only.

## Pre-edit conformance evidence

| Concern | Book | Reference/shared owner | Actual target mismatch |
|---|---|---|---|
| Optional filters | UI 2/20; BE 9 | toFilterParams / GetDebtCollectionAsync | promised=false is not absent; source excludes saved promises and no-history customers |
| Print/paging | UI 6/21 | Statement.print/onTablePage, DataTable paginator/scrollable | Debt.print has no preparation; uncontrolled grid offset can point beyond refreshed rows |
| Async reads | UI 28 | Job.bindListQueries switchMap/defer | loading guard drops refresh; history reads overlap and can update another customer |
| Validation/transport | UI 17/19 | DatePickerDirective.validate, parseDateValue, FieldError | report ignores date control validity; nextFollowup has no field error; DateTime can predate actual submission |
| Save/close | UI 7/13/22 | EditorDialog + confirmed standard mutation cycle | blacklist success calls close while saving, so close is rejected; duplicate-save guards absent |
| Feedback | UI 22 | errorInterceptor/BaseService | history inline errors duplicate interceptor; mutations write report/history inline errors without skip header |
| Shared reuse | UI 8/10/16 | dataTableExportRows/confirmDiscard/translateOptions | handwritten export omits note; init-only dropdown labels; dirty forms close silently |
| Fill host | UI 1/20 | Statement host + styles.sigma-route-host | Debt component host lacks shared class |

Applicable phases: 0 discovery, 1 compatible contract reconciliation, 2 report/history reads and output, 3 note/blacklist typed forms, 4 existing blacklist action lifecycle only, 5 wiring/events, 6 scoped diff reconciliation. No CRUD editor, upload, accounting transition, permission, migration or new feature phases.

## Pending decisions

### Owner-approved presentation refinement — 2026-10-03

Frozen frontend-only scope: report HTML/SCSS, report host class, two EN/AR subtitle strings, and a scoped full-width shell opt-in in shared styles. Explicit owner asks for improved visual design and full-width cards. Keep the aligned-title modifier, existing report/grid/form/date/button owners and all request/save/print/paging/KPI calculation contracts. Arrange the five existing fields as equal-width columns; move existing checkbox criteria and Search/Refresh/Reset to a second row; place existing Print/Excel actions in the title. Render the same six operational counts with semantic icons and larger count typography, using existing shared tile borders/surfaces/semantic tokens. This non-accounting presentation exception is owner-approved (UI 20), with no accounting totals added. New `sigma-route-host--full-width` opt-in releases only the enclosing `.app-container` max-width for this consumer, preserving shell heights/sidebar and other routes. Grid rows remain the scroll owner. Shared primary/secondary actions, translation and RTL/theme rules remain in force. References: UI 1/3/20/24/25; Statement header alignment and existing shared report controls/tiles. Visual/browser/build verification is pending; source-only reconciliation required. No new business, API, mapping, schema or permission contract.

### Owner-approved title alignment follow-up — 2026-10-02

Frozen scope: the owner explicitly requests the title card to have the filter card's width. Apply only the existing `sigma-report-panel--aligned-title` modifier to the debt report panel in `report.component.html`. Evidence: UI blocks 3/20, skill §6.1, Customer Statement's report panel, and `src/styles.scss` direct-child margin-inline rule. Current title margin-inline is -6px; filters use zero. The modifier sets title inline margins to zero, retaining shared responsive padding and block spacing. No shared-style, API, financial, translation or schema edit is needed. This is a small frontend-only follow-up, with source-only verification and visual acceptance pending.

Historical O1 (complete dataset beyond 100) and O2 (authorization mechanism for blacklist) remain. Existing balance/UnAllocated/aging semantics need their own accounting contract before any formula change. Build/test/runtime/DB/browser verification remains pending under AGENTS. No new material business decision is required for the corrections above.
