# Invoice main filters — 2026-10-12 amendment
Status: Frozen for source-backed filters; Manual Agreement No visibly unavailable pending a persisted domain contract.
Request: owner screenshot 1.png + all filters on main screen + continue. Screenshots are functional evidence only. UI shape: shared server-paged DataTable/FilterPanel, Workshop Job reference; backend existing InvoiceBase read projection (BE9). Previous create routes/actions remain unchanged; Fines/Darb/Salik deferred. No new writer/schema/migration.

Filter keys are serialized as Filters[key], case-insensitive trimmed on backend; empty/null absent; zero/false retained.
|Control|Key/type|Source/semantics|
|Invoice number|no string|Contains InvoiceBase.No|
|Invoice number range|noFrom/noTo string|Optional inclusive lexical bounds, DB collation; not numeric suffix ordering; replaces no when selected|
|Agreement number|agreementNo string|Contains AgreementNo|
|Invoice type|invoiceType enum0..3|InvoiceCreatingType; separate from cross-feature menu catalog|
|Date range|fromDate/toDate yyyy-MM-dd|InvoiceDate inclusive calendar days; next-day exclusive upper bound|
|Customer/Branch/Sales person/Project|customerId/branchId/salesPersonId/projectId Int32|Existing persisted IDs; confirmed Customer/Branch/Staff/Project GetSelect|
|Status|status enum0..3|Existing allocation-based invoice status; preserve accounting logic|
|Vehicle|vehicleId Int32|Vehicle/GetSelect Id; Invoice.PlateNo matches selected Vehicle.PlateNo|
|Ownership|vehicleOwnership enum0..2|Vehicle.Ownership via plate subquery|
|Customer type|customerType enum0..1|Customer.PartnerType Individual/Company|
|Job/Master Agreement/Contact Group/Asset/Sale Origin/Agreement Status|jobNo/masterAgreementNo/contactGroup/asset/saleOrigin/agreementStatus string|Contains same named InvoiceBase field; no invented lookup catalogs|
|Agreement type|agreementType enum0..4|InvoiceBase.AgreementType|
|VIP|isVIP bool?|InvoiceBase.IsVIP; All null, Yes true, No false|
|Due Date|dueDateFilter enum0..1|Reviewer minimal semantics: DueDate=today, OverDue=before today, UTC server calendar; null excluded; no unpaid rule|
|Plate number (existing)|plateNo string|Invoice.PlateNo contains OR legacy Asset contains, preserving existing consumers|
|Manual Agreement No|no request key|Disabled visible field + bilingual explanation; domain field absent, must not alias AgreementNo|

Final owner steering supersedes the initial all-main decision: main row = Invoice No, Agreement No, Invoice Type and Date Range. Remaining confirmed controls are in ng-template[appFilterAdvanced], initially closed. Invoice Number Range is last (full row), with conditional From/To directly beside the intrinsic-width checkbox using existing flex-wrap/gap-2 layout. All controls remain in the same reactive form; closing does not clear values. Six main tracks (1/1/2/2), five advanced tracks >1250px, three <=1250, one <=720; expanded filters use intrinsic content height without an internal scrollbar per final owner instruction. Shared narrow collapse stays initially expanded below1200. Date range defaults to current month per UI17; clearing searches all dates. Reset restores current month, other empty/All values and page1. Advanced badge excludes main dates and inapplicable retained number bounds. Lookups preserve successful options/entered filters, show inline failure and Retry for both channels. No sort added; descending ID retained. CountAsync total and shared page bounds.

Evidence: InvoiceBase.cs, Invoice.cs, Vehicle.cs, Partner.cs, enum OwnerShip/DueDateFilter/AgreementType/InvoiceCreatingType/InvoiceStatus; CustomerService.SelectAsync and inherited GetSelect path. Source-only verification; build/test/browser/database prohibited unless owner asks. Manual field is the only unsupported screenshot filter; disclose at handoff.



Conformance (source evidence, final):
|Concern|Owning block/reference|Target compared behavior|
|Shell/grid|UI1/6, Workshop Job list HTML|InvoicesComponent same route/list/header/table shells and DataTable fill, typed server page query and totalCount|
|Filters/actions|UI4, Job list form/FilterPanel|Same form/directives, stableLayout, mandatory Reset and submit Search; owner-selected four main filters is recorded deviation from Job fields; other fields advanced and number range last|
|Lookups|UI16/22, Job loadLookups|Inherited getSelectList skip-error option, DropDownSelect value/id, local loading, both failure channels and Retry; new thin ProjectService adapts confirmed Project endpoint, not CustomerProject|
|Dates/errors|UI17/19, Job dateRange|Shared currentMonthRange/dateRangeValidator/parseDateRange/appDatePicker; reserveMessage date; invalid submit touches and focuses main date field|
|Localization|UI23|Numeric enum IDs remain fixed; translateOptions caches current-language labels; English/Arabic keys reconciled, no duplicate object properties|
|Backend|BE9, existing InvoiceService.GetManyAsync/FilterHelper/NormalizePaging|Trimmed case-insensitive local snapshot after MVC binding; exact filters before count/page; status accounting and legacy aliases preserved; AgreementType explicit namespace import|

Scope exclusions: creation/workflow routes/actions unchanged from previous frozen refactor; existing unrelated payroll edits/migrations remain untouched. No schema change. Manual Agreement No remains an explicit unsupported field, not an alias. Reference Job domain actions do not apply to this filter-only amendment; existing View/Create links preserved. Authorization still uses existing Invoice and lookup routes; no permissions changed. Only GetManyAsync override changes: it owns heterogeneous InvoiceBase projection/status allocation predicates and uses existing shared filter/paging helpers.

Final owner2026-10-12 placement: Number Range checkbox and enabled From/To boxes share the same last advanced row; existing flex-wrap/align-items-end/gap-2 utilities place the checkbox at intrinsic width and the conditional boxes directly beside it; narrow widths wrap. No feature CSS.


## Final reconciliation — 2026-10-12
Status: Source implementation reconciled for every source-backed filter; Manual Agreement No explicitly unavailable pending domain storage. No schema/EF/migration changes.

Changed source: frontend Invoice list TS/HTML, typed models/filters.ts and InvoiceService filter type re-export; new thin shared ProjectService; shared FilterPanel reuses its original presentation without source changes; matching EN/AR Invoice translations; existing Invoice user-guide content and one guide link under Vouchers sidebar. Backend InvoiceService GetManyAsync plus local parsers and explicit Agreement enum import. Previous refactor routes/editors/accounting delegates were not changed in this amendment; existing unrelated payroll files were preserved.

Guide: UserGuide/content/invoice-guide.ts; topic route /Invoice, reader /UserGuide/invoice through existing :sectionId reader and INVOICE_GUIDE registration. Vouchers menu now exposes invoice.guideTitle in EN/AR. Covers first-row/advanced split, same last row range, calendar validation/default/reset, due/VIP semantics, lookup recovery, query vs Refresh and unsupported manual number.

Verification: complete scoped source reads/diff review including enum namespaces, inherited select methods, wrappers, active filter snapshot and both error channels. TypeScript AST parse and Angular parseTemplate syntax inspection passed; EN/AR object duplicate-property scan and Invoice key-set comparison passed; this is NOT type checking or compilation. git diff --check passed for frontend and scoped backend (normal line-ending notices). No build/tests/lint/browser/application/database/migrations/commits/pushes run. Recipe PHASE00/01/02/06 selected; PHASE03/04 not applied (no writer/action change), PHASE05 runtime pending owner. Temporary shared-scroll guidance was removed when the owner rejected filter scrolling; original book/skill behavior restored, packets regenerated and all eight -Check entries OK. PHASE02/06 rules/reference roles reviewed against owning books.

Responsive source matrix: >1250px main1/1/2/2 tracks and advanced5;721..1250px shared3 tracks (wide fields wrap naturally);<=720px shared1 track with wide reset, range group wraps as space requires. Shared narrow whole-panel disclosure below1200 retains form state. Owner rejects internal filter scrolling: shared panel uses its original content height, no caps or overflow-y auto added. Body-appended overlays remain. Open advanced content and the existing bounded list shell need owner visual acceptance at short/mobile viewports; no runtime claim. Runtime boundary/intermediate/small-height checks remain pending, including long EN/AR lookup labels, dark theme and keyboard reachability.

Owner checks: compile frontend/backend; open /Invoice, confirm main four filters and Advanced toggle; close/reopen retains values; number range check and two boxes occupy the last row, No field becomes readonly while range is active; Search vs Refresh snapshots; clear/current-month Reset; zero enums and VIP No; due UTC boundary/null behavior; customer/vehicle/ownership/project filters and filtered totals; page/change-size requests; lookup failures/Retry; source-backed records with all invoice types. Verify EF SQL translation for lexical bounds and vehicle subqueries. Manual agreement filter remains unavailable. No migration is required. Suggested commits: frontend `feat(invoice): organize and connect invoice filters`; backend `feat(invoice): support typed list filters and bounded paging`.

Final owner steering: no scrollbar inside filters. Removed every temporary shared filter scroll/cap change and its unadopted book/skill/changelog entries. There is no shared component source diff. No generic extraction required: existing panel/grid/date/lookup/error/translation/paging helpers cover the final layout. Backend source-backed filtering remains.

Latest owner detail: clicking Number Range reveals both boxes directly next to the checkbox, with shared gap-2 spacing and no reserved one-third checkbox column. Turning it off hides boxes; values remain in the form and are excluded from ordinary-number searches. No internal filter scrolling.

## Compile correction — mixed invoice source, 2026-10-23

Status: Frozen bounded tierS correction; owner verification pending: yes.
Owner reports CS1503 in InvoiceService.GetManyAsync after shared column filtering.
The actual source is IQueryable<InvoiceBase>, deliberately including Workshop,
TaxAdvance, Equipment, Limousine and other invoice subclasses; the generic service
is closed over Invoice, so its ApplyGridFilters cannot accept that query.
Do not narrow/cast the query to Invoice or lose sources to satisfy the compiler.
BE9 and current shared GridFilter.Apply<T> own the predicate; InvoiceProfiler's
existing InvoiceBase->InvoiceListVM map owns the heterogeneous projection.
Apply the shared filter to the existing InvoiceListVM projection before Count
and Skip/Take. Preserve source/main filters, ID-desc ordering, page20 default,
status amounts/action hydration and list DTO/route contracts. No business/financial
effect or schema change. Root performs the tightly coupled correction locally;
no subagent required. Runtime translation/compilation remain owner verification.

Implemented — source-only. Shared GridFilter.Apply<InvoiceListVM> now filters the
existing InvoiceBase projection before CountAsync and the same query's Skip/Take.
No cast/OfType restriction was added, so the heterogeneous invoice sources remain
available. Existing InvoiceProfiler maps, descending identity ordering, main
filters, page20 default and action hydration remain unchanged. The shared generic
service/helper was inspected as reference and not edited. GridFilter resolves
through actual Business GlobalUsing.cs; no namespace shim or duplicate helper.

User-guide invoice topic now states supported-source filtering before count/page
in EN/AR, through existing /UserGuide/invoice reader and /Invoice topic. Scoped
backend/frontend diffs reviewed independently and whitespace checks pass; all
eight recipe checks pass. Phases1/2/6 apply proportionally; no new write/action/
routing or financial contract. No screenshot or material unresolved decision.
No migration required. Suggested backend commit: `fix(invoice): filter mixed
invoice projection before paging`; guide change may accompany the frontend docs
commit. No build/test/lint/browser/database/migration/commit command run. Owner
checks: rebuild Business then ServerAPI, verify server filter count/paging across
Rental/Workshop/AdvanceTax and other source types, and EF filter translation.
