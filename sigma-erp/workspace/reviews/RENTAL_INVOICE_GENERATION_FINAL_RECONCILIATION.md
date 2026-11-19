# Rental invoice generation — final reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-12 |
| Scope | Rental1/Rental2 generation, source pricing, grouping, persistence and directly affected existing invoice consumers |
| Contract | [Frozen contract](<F:/My Work/Sigma/reviews/RENTAL_INVOICE_GENERATION_API_CONTRACT_FREEZE.md>) |
| Starting-state/evolution evidence | [Historical plan and implementation continuation](<F:/My Work/Sigma/reviews/RENTAL_INVOICE_GENERATION_MAINTENANCE_EVOLUTION_PLAN.md>) |

## Outcome and owner decisions

Rental Create now uses a dedicated source-selection/grouping/preview workspace. The backend discovers unbilled persisted-contract periods, applies the actual company MergeByProject preference or explicit manual groups, and generates one invoice per compatible group with every source period saved. The existing IInvoiceService/InvoiceController boundary and legacy public endpoints remain available. Lease and the other invoice creation workflows are not converted into this rental generator.

Owner decisions applied: Option B invoice header plus source rows; timing follows saved customer Advance/Post; recurring charges and discount allocated by days, nonrecurring charges once in the first period, preserving the contract value; Fines/Salik/Darb deferred; invoice Void remains flag-only with no reverse journal. These approvals supersede historical pending financial gates in the plan/contract. No remaining unanswered material decision blocks this scope.

The conserved financial value is the rounded eligible contract net charges minus their eligible discount. Deferred fines/tolls and their proportional discount remain outside this run. VAT follows the existing BE15 D4-4 decision: calculate once per rate on each final invoice, then allocate its exact tax to source rows. Splitting the same contract into several invoices can therefore change tax rounding by small amounts compared with the contract's single estimated tax; no compensating tax adjustment is invented. Receipts/deposits do not reduce invoice value or count as billing sources.

## Canonical shapes and evidence

Applied authority: `F:/My Work/Sigma/AGENTS.md`, required `F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md`, Master4/5/7/8, UI1/2/3/4/6/10/13/14/16/17/19/22/23/28/29, BE2/3/4/5/8/9/14/15/18. This is a financial generation workspace, not generic CRUD. Backend uses focused source/generation services through the existing facade; financial persistence uses pattern3 and existing accounting/JV owners. Frontend uses the approved Job list shell plus the shared selection/feedback/form-state controls; screenshots establish fields/actions/columns rather than overriding canonical styling.

| Concern | Owning rule / compared source | Target evidence and result |
|---|---|---|
| List/workspace shell | UI3; `Workshop/Job/components/list/list.component.html` | Rental HTML uses sigma-route-host → sigma-list-page → sigma-list-panel, feature title, filter form and sigma-list-table; no new feature SCSS |
| Geometry | UI3/4; `src/styles.scss`, shared FilterPanel SCSS | Same flex/min-width0/min-height0 shell, panel padding6px12px/gap0.45rem; filter margin0 8px6px/padding8px10px; 4 declared tracks with inherited responsive rules |
| Filters | UI4; actual FilterPanel public inputs | stableLayout=true, mainColumns=4, mandatory Reset, shared busy/field-error behavior; pictured seven filters and two modes retained |
| Table selection | UI6; `shared/components/data-table/data-table.component.ts` | Actual selectable/selection/selectionDisabled/selectionPageOnly/selectAllAriaLabel/rowSelectionAriaLabel declarations consumed. No showSelection alias |
| Counts and totals | UI3/19; SummaryCards and server preview | density=slim/layout=row/minCardWidth140/maxHeight80; selected sources, preview invoice count, generated count distinct; no local money calculation |
| Mutation/cancel | UI10/22/28; freezeFormState, ConfirmationDialogService, HttpClient | Forms freeze without emitting edits; deferred discard preserves state on cancel; requests cancel on destruction, revision checks reject stale results; one mutation-success feedback owner |
| Read/detail/print | UI15, BE3/4 | Tenant-scoped DetailAsync explicitly projects RentalItems; Core View/Print renders all rows and hides misleading singular source fields; generic Edit blocked in hints and write service |
| Accounting/concurrency | BE8/14/15; UnitOfWork write guard and InvoiceAccountingService | Agreement → RentalAgreement → InvoiceBase generation locks; authoritative reads and all dependent saves in outer transaction; fiscal/accounts preflight before persistence |

Approved references remain unchanged in this continuation. Job supplies the shell, shared DataTable supplies selectable behavior, existing InvoiceAccountingService/JournalVoucherResolver supply financial posting; unrelated Payroll/HRM files, migrations and snapshot changes already present were preserved.

## Producer/consumer reconciliation

| Contract/path | Producer | Consumer | Final evidence/status | Action |
|---|---|---|---|---|
| As of Date and seven pictured filters | RentalGenerationComponent form/payload | GET RentalCandidates / RentalInvoiceSourceService | Exact keys asOfDate, customerType, customerId, salesPersonId, masterAgreementNo, agreementNo, agreementType, mergeType; actual Master.No used | Owner request replay |
| Candidate grid | RentalInvoiceCandidateVM | RentalInvoiceCandidate / columns | Agreement, Customer, Project, Plate, Rate, StartDate, InvoicingRule, Period in pictured order; rateUnit/group/reason added for review | Owner visual acceptance |
| Pagination | Standard Results metadata | resolveListPaging, pageNo/pageSize/totalCount | Real server count and page; 1000 agreements/10000 periods bound explicit, selected items≤500; no fake truncation | Owner paging checks |
| Manual groups | Identity-only item.groupKey | BuildPreviewAsync | Customer required; same customer+branch only; different projects allowed; ungrouped source gets separate invoice | Owner interaction checks |
| Customer Rule | Actual Company.InvoiceGenerationMethods enum0 MergeByProject | Source suggested key / preview compatibility | Same customer+project+branch; absent preference/project keeps agreements separate with explanation | Owner policy checks |
| Preview | POST PreviewRental Result / groups / fingerprint | Preview table and source details | Server-owned amount/tax/total; all items and counts visible; source detail money columns included | Owner rounding checks |
| Generate | POST GenerateRental identity selection + fingerprint | Rebuilt locked preview and aggregate writer | Source/policy/currency change or already-consumed interval fails; no frontend totals trusted | Owner race/rollback checks |
| Saved invoice sources | RentalInvoiceItem / Invoice.RentalItems | Detail VM / details.ts / Core source grid | Snapshot agreements, plates, project, periods, rate/unit, rule, amount/tax/total reconciled | Schema + owner print checks |
| Hub filters | Persisted source links | InvoiceService.GetManyAsync | Grouped agreement/master/project/staff/type/status/vehicle/plate filters include real sources, with old-header fallback | Owner grouped filter checks |
| Edit and removal | Source-aware action hints and service guard | Hub / Core editor / RemoveAsync | New source invoices cannot use generic Edit; posted/approved/allocated/voided history deletion blocked; draft cleanup and billing flags use all source links | Owner state checks |
| Compatibility | IInvoiceService/InvoiceController old methods | Old consumers/routes | New APIs additive; old generation remains, takes shared rental locks and rejects consumed source agreements; Lease routes unchanged | Owner regression checks |
| Feedback/lifecycle | Interceptor HttpClient + Result wrappers | Component declared/HTTP error handling | Read/preview/generate failure inline; preview suppresses success toast; Generate uses default single success owner; busy/retry/dirty-exit paths reviewed | Owner failure/navigation checks |
| User guide | invoice-guide.ts INVOICE_GUIDE | Existing reader and /UserGuide/invoice sidebar entry | Dedicated bilingual Rental generation topic with real fields/modes, timing, charges, preview, states and limitations | Owner reader/RTL check |

## Financial/source implementation

- Periods are half-open [from,to), using the saved return as the final boundary. DateToDate follows saved Daily/Weekly/Monthly agreement type from the original start anchor; CalendarMonth uses month boundaries; ThirtyDays uses fixed30-day cycles. Adjacent boundaries do not overlap. Advance is due by period-start calendar day; Post by period-end calendar day. AsOfDate is the invoice date for this run.
- Authoritative eligible selected charges exclude included amounts, tax/discount rows and deferred fines/tolls. /Day,/Week,/Month and contractual mileage with AllowedPerDay recur; other eligible charges appear once in period1. Saved rent rate/unit remain display values; current tariff and already-taxed TotalCharges are not used to reprice.
- Rounded charge totals are spread by actual interval duration with floor shares and the longest-period balance. Discount starts day-weighted, caps each period at gross capacity and redistributes only over remaining capacity, conserving the exact eligible discount without negative net periods. Zero-net periods are not emitted as payable invoices.
- VAT uses ITaxPolicyService against the saved contract rate; conflicting settings require translated review feedback rather than silent repricing. Shared VatPolicy preserves ordinary allocation; exceptional nonnegative-source negative remainder floors other shares and gives the exact balance to the largest line. Intermediate decimal overflow alone uses ratio-first arithmetic. Preview validates aggregate amount storage bounds before VAT and all saved amount/tax/total bounds before writes. Eligible-discount multiplication has the same overflow-only protection.
- Root tenant/soft-delete query scope and loaded navigation ownership/liveness are checked. Foreign customer billing currency fails explicitly: only current base-currency accounting is supported. Both currency identities, timing/rule, billing/merge policy, monetary precision, tax settings and contract input snapshots join the hash; same-precision currency changes invalidate preview.
- Contract Invoiced retains has-an-invoice semantics and existing edit/lifecycle protection. Persisted consumed intervals, not that coarse flag, determine remaining candidates. Void does not release consumed periods. Legacy header-only billing history is excluded/blocked until explicitly reconciled; no guessed historic backfill.
- Generate preflights source refs, fiscal period and accounts, saves document/source rows/JV and agreement flags atomically, and returns IDs/numbers. Participating rental Update/Remove/Unclose/Void/delivery-date/salesperson writes use the same Agreement/RentalAgreement lock order. Generic edit rejects live source rows before mutation. Draft deletion cleans children and recalculates all member flags; generated posted invoices remain protected.

## File inventory for this continuation

Repository roots: `F:/My Work/Sigma/SigmaBackend` and `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Paths below are relative to their stated root; earlier invoice/action/workshop changes coexist in some of these files and were retained.

| Repository | Files | Responsibility |
|---|---|---|
| Backend | SiGma.Business/IServices/IRentalInvoiceSourceService.cs, IRentalInvoiceGenerationService.cs; Services/VouchersServices/RentalInvoiceSourceService.cs, RentalInvoiceGenerationService.cs | New authoritative source/period pricing and focused grouping/generation |
| Backend | SiGma.ViewModels/ViewModels/Invoice/RentalInvoiceCandidateVM.cs, RentalInvoiceGenerationItemVM.cs, RentalInvoiceGenerationVM.cs, RentalInvoicePreviewGroupVM.cs, RentalInvoicePreviewVM.cs, RentalInvoiceGenerationResultVM.cs, RentalInvoiceItemDetailVM.cs | Public query/identity/preview/result and saved source contracts, one class per file |
| Backend | SiGma.Helpers/Models/Vouchers/RentalInvoiceItem.cs, Invoice.cs; SiGma.DataAccess/Configuration/RentalInvoiceItemConfig.cs | Additive source graph/schema, restricted references, decimal precision and live-period unique index |
| Backend | SiGma.Business/IServices/IInvoiceService.cs; MapperConfig/InvoiceProfiler.cs; Services/VouchersServices/InvoiceService.cs, InvoiceActionService.cs; SiGma.ServerAPI/Controller/InvoiceController.cs; SiGma.ViewModels/ViewModels/Invoice/InvoiceDetailVM.cs | Facade/endpoints, read/filter/detail, compatibility, edit/delete and hints |
| Backend | SiGma.Business/Services/AgreementServices/RentalAgreementService.cs | Participating rental source writer locks, public signatures retained |
| Backend | SiGma.Helpers/Helpers/VatPolicy.cs; Localization/Shared/GeneralMessage.resx, GeneralMessage.ar-SA.resx | Directly consumed VAT corrections and bilingual financial/config feedback |
| Frontend | src/app/modules/Vouchers/Invoices/Invoice/models/rental-generation.ts; services/rental-generation.service.ts; components/rental-generation/rental-generation.component.ts/.html | Typed dedicated workspace, real endpoints, source selection/manual groups/preview/result/navigation |
| Frontend | Invoice/invoice.routes.ts; Invoice/models/details.ts; Invoice/components/core-editor/core-editor.component.ts/.html | RentalCreate route/guard and all saved source detail/print |
| Frontend | src/app/modules/i18n/vocabs/en.ts, ar.ts; tsconfig.app.json | New bilingual generation/rule/reason text; three new runtime entries registered explicitly |
| Frontend | src/app/modules/UserGuide/content/invoice-guide.ts | Final bilingual in-app guide; existing reader/sidebar registration reused |
| Documentation | backend/15-pattern-3-master-detail-with-financial-effect.md; sigma-screen-refactor/SKILL.md; existing changelog entry and all8 generator-produced packets | Reusable positive VAT remainder/numeric-bound lesson promoted to its owner and digest |

Scoped tracked diffs and new source files were reviewed; relevant DTO/mapping/provider/model/route declarations reconciled. Service DI uses the existing scoped AsImplementedInterfaces assembly scan; sealed source EF configuration is found by ApplyConfigurationsFromAssembly. No private duplicate container registration or controller replacement was added. Earlier action/UI errors are not claimed as newly discovered changes in this continuation.

## Responsive, translation and guide acceptance

| Interval/concern | Source evidence | Acceptance |
|---|---|---|
| Wide >1250px | Four filter tracks; fill result area; shared min-width0 shell/controls and matching logical margins | Owner visual pending |
| 721–1250px | Shared FilterPanel three tracks; shared below1200 disclosure preserves mounted values | Owner boundary/intermediate visual pending |
| ≤720px | Shared one-track filter grid and full-width choice group; shared shell spacing | Owner visual/short-height usability pending |
| ≤650px title/actions | Shared FeatureTitle wrapping/compact sizing | Owner long Arabic/keyboard pending |
| Footer | Fixed shared footer and existing Bootstrap flex-wrap utility; no feature CSS; all manual/group actions remain available | Owner narrow/long-label visual pending |
| RTL/dark/numeric values | Shared logical spacing/theme tokens/money formatting, EN/AR labels and rule translation helper | Owner theme/RTL/print pending |

No browser preview or responsive screenshot was produced. Source inheritance is evidence of the selected mechanism, not visual acceptance. Unknown legacy rule text retains its raw value; known rule names use both languages. The guide documents explicit legacy billing/config/currency constraints, deferred content, preview invalidation and no payment creation. Existing /UserGuide/invoice route/menu/reader registration was verified in source.

## Verification performed and boundaries

- Complete scoped source reconciliation, including independent bounded backend audit findings and root integration fixes. Controlled BE/FE workstreams had frozen contracts and nonoverlapping ownership; root owned pricing, compatibility, guide and final review. Existing backend worker was reused for read-only financial/source audit; no unbounded parallel edits.
- Source-only TypeScript parser:9 files, zero parse diagnostics. Both generation and Core templates parse with zero Angular template parse errors. This does not certify TypeScript type checking, Angular binding compilation, C# compilation, serialization, EF SQL translation or runtime.
- EN/AR vocabulary object-property scan: zero duplicate properties; generation key parity checked. Both BE resources parse as XML, zero duplicate resource names,15 RentalInvoice keys each and zero missing localization keys consumed by the two new services.
- New three generation runtime files appear in tsconfig.app files. Existing imported feature roots retain their wiring. Merge-marker/temporary-pricing/AsFactory search returned no matches. InvoiceService contains no unmatched region directives (0/0).
- Scoped Git diff --check reports no whitespace errors; Git LF/CRLF notices are informational. No unrelated changes were reverted or claimed as part of this feature.
- Canonical VAT lesson promoted in BE15 and skill; all8 packets regenerated through Generate-SigmaRecipes.ps1 and all8 -Check results OK. Semantic check: refreshed backend.15 provenance matches the new rule, shared/reference editor roles remain unchanged; generated packets never edited directly. PLAN00 + PHASE00–06 maintenance completed.
- No build, tests, lint, database access, migrations, model snapshot edits, browser/runtime interaction, financial writes, commit, push or deployment performed. Existing unrelated migration/snapshot files were preserved.

Phases: PLAN00 and00 discovery/evidence,01 freeze,02 query/grid,03 write/detail,04 source lifecycle/action integration,05 source wiring/guide,06 source reconciliation applied. Phase05 runtime activities and compiler/database/browser acceptance were skipped under the project boundary. Upload work is inapplicable: this generator has no new upload contract. External Odoo/SAP sources remain conceptual evidence in the historical plan, not additional Sigma contracts.

## Owner verification and schema handoff

Schema delta: new RentalInvoiceItem table with tenant/audit columns, invoice/agreement/project/branch references, source snapshots, From/To, Rate/RateUnit/rule, Amount/TaxPercent/Tax; restricted FK deletes; filtered unique tenant+agreement+From+To live index. Required owner migration suggestion: `Add-Migration RentalInvoiceSourcePeriods`. Inspect/apply it in the normal project workflow before executing source queries against the new schema. No migration or snapshot was generated here.

| Manual check | Expected result |
|---|---|
| Advance vs Post before/on cutoff | Upcoming active period at start for Advance; only completed period for Post; no receipt generated |
| Jan31/leap month, daily/weekly/monthly/calendar/30-day and partial final period | Correct original anchor, shared boundary, final saved return, no overlapping or missing consumed interval |
| Recurring + first-period fee + large discount + tiny periods | Eligible saved net reconciles exactly; nonrecurring once; discount capped/rebalanced; no negative period |
| Many tiny VAT rows, large valid values, storage-bound groups | Tax lines sum to document tax/nonnegative; no intermediate overflow; oversized total rejected before write |
| Company MergeByProject, missing project/policy, manual groups | Automatic customer/project/branch groups; explained separate agreements; manual crosses projects only within customer/branch |
| Multiple pages/selection limit/group/ungroup/dirty exit | Basket retains selected rows; limit500; groups accurate; cancel discard preserves values; busy prevents duplicate operation |
| Contract/tax/currency policy change between preview and generate | Stale preview/config feedback; no guessed conversion/repricing |
| Duplicate click/concurrent legacy and new generation/source edit | One consumption; other run rejected/refreshed; writer locks respected |
| Accounts missing/closed fiscal period/later save failure | No partial invoice, source consumption, journal or billing flag committed |
| Legacy header-only invoice and flag-only Void | No automatic historic backfill or rebilling of consumed periods; no reverse journal |
| Grouped View/Print, hub source filters, blocked generic edit/delete | Every included source visible; no arbitrary singular identity; lifecycle restrictions match actual server checks |
| Existing routes/callers/Lease/actions + guide reader | Legacy consumers remain compatible, Rental uses dedicated route; existing other workflows retained; guide content reachable |
| Wide/intermediate/breakpoint/mobile, long EN/AR, dark theme/keyboard/print | Shared geometry and all fields/actions usable; source-only report does not preaccept visual behavior |

Possible compiler/runtime risks remain unverified until the owner builds both repositories and executes the schema/financial/concurrency/route checks above. Foreign-currency conversion and migration/backfill of ambiguous legacy billing history are explicitly outside this contract. Other invoice types and deferred fines/toll generation await their own screenshots/contracts.

Suggested backend commit: `feat(invoice): generate rental invoices from persisted contract periods`. Suggested frontend commit: `feat(invoice): add rental source selection and grouping workspace`. No commits created.

## Owner continuation — compact filter card and raised actions

Status: Implemented — source-only. Owner verification pending: yes. The owner requests a shorter card, buttons in the final filter row, then smaller vertical spacing between search boxes. This is the Rental workspace from the completed generation handoff; no query/API/schema/pricing changes.

Final source: Rental's existing merge fieldset now has appFilterToolbarStart instead of sigma-filter-field--full. FilterToolbarStartDirective is exported from the actual shared directives file and imported/registered in Rental standalone metadata. Shared FilterPanel projects the group into toolbar-start opposite its existing mandatory Reset and Search. The legend retains its translated accessible name through the existing visually-hidden utility; both radio labels stay visible. Removing the separate choice grid row leaves a single final choice/action row. All seven filters remain in their existing responsive grid. New public rowGap defaults7px; Rental explicitly selects3px. The main/advanced grid consumes --sigma-filter-row-gap; no private density CSS or altered validation/control sizes.

Shared changes: filter-panel.component.html/.scss/.ts and filter-panel.directives.ts. Consumer changes: rental-generation.component.html/.ts and invoice-guide.ts. No new runtime files or translation keys. UI4, UI0 version1.98, CHANGELOG and skill rule/revision synchronized; all8 derivative packets refreshed by the generator, all8 -Check OK. Semantic inspection confirms refreshed UI0/UI4 provenance and unchanged approved reference roles.

Conformance against the frozen correction: toolbar-start logical placement and shared gap/min-width0/wrap preserve existing empty-slot and advanced/inline arrangements; :empty still ignores projection comments; main/advanced fields and actions remain mounted on collapse. Grid spacing7→3 applies at wide/intermediate/single-column breakpoints. Above1250px fields keep four tracks;721–1250px keep three;≤720px keep one and the toolbar stacks via existing rules. Choice options wrap with their shared minimum34px track. Validation reserves, labels, busy/Reset/submit behavior, source selection and preview invalidation remain. Keyboard/RTL/dark/long-label/short-height visual acceptance is pending.

Source-only checks:4 TypeScript files and2 templates parse without diagnostics; complete shared diff and consumer changes reviewed; scoped diff --check clean. No build/test/lint/browser/database/migration/commit command. Backend/write phases inapplicable to this presentation continuation; guide/contract/source reconciliation updated. No subagents: small sequential fix. Owner checks: desktop final-row alignment, narrow wrapped Arabic options/buttons, validation appearance and same filter payload/Reset behavior. Suggested commit: `refactor(invoice): compact rental filters and align final-row actions`.

Further owner spacing correction: Rental rowGap3→1px in rental-generation.component.html. Source state reviewed through the existing public input/SCSS contract, all field controls/validation unchanged. The existing bilingual guide's compact-spacing description remains accurate and needs no text change. UI4/skill current value and packet provenance refreshed; source-only template parsing remains distinct from pending visual acceptance. No backend/schema/API change, migration or subagents for this one-element adjustment. Suggested commit: `style(invoice): reduce rental filter row spacing`.

Owner title Back addition: rental-generation.component.html now projects the existing translated icon Back button through feature-title-leading. Compared FeatureTitle template/leading flex styles and approved Workshop Job editor: same shared sigma-secondary-button/sigma-icon-button and arrow glyph, native type=button and accessible general.back name; no local CSS/new component/import. Busy gates the button; existing close(), returnParams() and RentalCreate canDeactivate route guard preserve destination/context/discard behavior. Bilingual invoice-guide.ts adds Back/Close and cancellation guidance; existing /UserGuide/invoice registration unchanged. UI3/title source and UI10/guard contracts reused, no new shared lesson. Source-only template/guide parsing and scoped source review; owner click/cancel/keyboard/narrow/RTL visual acceptance pending. No backend/schema/API/migration, build/tests/browser/commit or subagents. Suggested commit: `feat(invoice): add rental generation title back action`.

## Owner continuation — remove pagination from invoice creation

Status: Implemented — source-only. Owner verification pending: yes. This supersedes the earlier Rental creation paging/basket description and multiple-pages acceptance row above. The invoice hub retains its existing pagination.

RentalCandidateQuery now carries filters only. The candidate service uses the existing toFilterParams helper, so one request omits PageNo/PageSize. Actual ListSmBase declares both nullable without defaults; existing GetCandidatesAsync returns the complete bounded authoritative result when neither is provided. Backend paging support remains compatible for other callers. No backend, endpoint, DI, schema, pricing or write-transaction change; no all-pages request loop or artificial large page size.

The shared candidate DataTable sets lazy=false, paginator=false and selectionPageOnly=false. Paging signals, metadata assignments, events and imports were removed. Selection now uses the full returned set directly while retaining the500-source limit, busy/preview guards and manual grouping. The1000-agreement/10000-period source bounds remain explicit. Filtering, switchMap cancellation, preview invalidation, grouping, Generate and guarded Back/Close retain their behavior. Installed PrimeNG dataToRender returns every supplied row when paginator=false, so disabling pagination does not leave a hidden first-page slice. The grid retains its existing scrolling container.

Scoped frontend inventory: rental-generation.ts; rental-generation.service.ts; rental-generation.component.ts/.html; en.ts/ar.ts; invoice-guide.ts. The select-all accessible label now says all displayed sources in both languages; guide content explains the complete result,500-source selection limit and narrowing filters when the source bound is exceeded. Existing /UserGuide/invoice registration is unchanged. No new runtime file, shared capability or canonical book rule was needed: UI2 unpaged request and UI6 public table inputs already provide the mechanism, with the owner's explicit creation-workspace exception frozen before edits.

Source verification: six changed TypeScript files parse without syntax diagnostics; Rental HTML parses without Angular template diagnostics. Vocabulary property scans find no duplicates. No stale paging state/events/imports, ListQuery/toListParams or selectPage references remain in the Rental component/model/service. Scoped Git diff --check is clean; LF/CRLF notices are informational. All eight existing recipe -Check results are OK. These are source checks, not compilation or visual acceptance.

Owner checks: a search with more than15 results displays every matching period; selection/select-all within500 preserves the correct preview groups; selecting more than500 reports the limit without replacing the prior selection; source-bound feedback allows narrowing filters; Generate and dirty-exit behavior still work; invoice-hub pagination remains available. Large-result rendering, narrow/RTL layouts and keyboard interaction remain owner-pending. No build/tests/lint/browser/database/migration/snapshot/commit/push/deployment or subagent work for this small sequential correction. Suggested commit: `refactor(invoice): remove rental generation pagination`.

## Owner continuation — closer title and filter cards

Status: Implemented — source-only. Owner verification pending: yes. The owner requests slightly less space between the title and filters. Pre-edit contract records the shared decision under the standing general-presentation rule; this is not a Rental-only override.

Frontend changes: shared/components/feature-title/feature-title.component.scss changes :host margin8px8px16px to8px, reducing the bottom margin by8px. Rental and approved Workshop Job list both use sigma-list-header with FeatureTitle followed by appFilterPanel. Final source matches the contract: title top/inline inset8px, card min-height64px/padding8px10px, panel gap0.45rem and FilterPanel margin-top0 remain. Workspace inline overrides remain; the more-specific report margin-8px0px16px in src/styles.scss retains UI20's existing geometry. Default title consumers inherit the smaller gap at all screen widths without a new input or feature CSS. Controls, handlers, source selection and financial behavior are unchanged.

Documentation: UI3 default margin/checklist, UI0 version1.99, CHANGELOG and required skill digest/history synchronized. All eight PLAN00/PHASE00–06 derivative packets regenerated through the generator, all eight -Check OK; refreshed UI0/UI3 provenance reviewed and approved reference roles retained. Bilingual invoice-guide.ts explains the smaller title spacing through the existing /UserGuide/invoice reader; its untracked complete source was read separately, while the complete tracked shared SCSS diff was reviewed. TypeScript source parsing reports zero guide syntax errors; scoped Git diff --check clean. No new component/runtime registration, translations, route/API/backend/AutoMapper/domain/schema change; migration unnecessary for this correction.

Applied proportional discovery/freeze/UI implementation/guide/final source reconciliation. Backend/write/runtime phases inapplicable or owner-pending. No new screenshot evidence or unresolved content requirement. Owner visual checks: title/filter cards are8px closer in Rental and ordinary shared title consumers, preserve both edges and Back, and remain separated at650px/720px/1200px boundaries/intermediate widths, long EN/AR and both themes. No build/tests/lint/browser/database/migration/snapshot/commit/push/deployment. No subagents: one-element sequential change below the delegation gate. Suggested frontend commit: `style(ui): reduce shared title bottom spacing`.

## Owner continuation — identify invalid rental agreement and charge, 2026-10-13

| Item | Status |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Owner-approved diagnostic-only change after RentalInvoiceSourceInvalid. Changed application files: RentalInvoiceSourceService.cs; GeneralMessage.resx; GeneralMessage.ar-SA.resx; invoice-guide.ts. Preserved existing unrelated invoice/payroll changes. Source service and guide are currently untracked, so their complete content was read separately; resource Git diffs were reviewed in the actual backend repository. Frontend repository scope was checked independently.

ReadAsync now formats the trusted saved agreement number (record ID fallback for a blank number) plus the existing failing rule. It identifies customer/billing/vehicle/project/master reference failures, mismatched master customer, inactive customer, invalid dates/type/discount/number/vehicle branch, selected charge amount/rate/type/unit, and exact selected Rent count. Charge-specific failures include saved item ID, without reading labels from invalid references. Discount-distribution and invalid period-amount failures identify the agreement; period amount feedback includes its date/time boundaries. Existing billing configuration, currency, tax review and per-agreement period-limit feedback also include agreement context. Broad source/history bounds before an agreement is selected and internal generation fallback messages remain unchanged.

Conformance: BE5's bilingual IStringLocalizer owner formats reasons through existing typed Result envelopes; formatter methods return text, not duplicate Fail helpers. Validation predicates/order match the previous source checks, and candidate/preview/generate still stop at the first invalid source rather than skip or repair it. Optional null reference handling, eligibility queries, half-open periods, due timing, charge and discount allocation, tax calculations, merge keys, fingerprint, amount storage guards and candidate response shape are unchanged. No DTO/controller/route/provider/AutoMapper/entity/schema/financial decision changed; no migration is required.

Actual UI22 consumer evidence: RentalGenerationService already sends X-Skip-Error-Interceptor; bindQueries uses Result.message for unsuccessful results and apiErrorMessage for HTTP failures. Preview uses the same inline error owner. GetCandidatesAsync and PreviewAsync forward the source Message/Errors/ErrorStatusCode. No new toast/dialog or feature error parser. The bilingual guide at src/app/modules/UserGuide/content/invoice-guide.ts explains agreement/item identity, first-invalid-search failure, correcting saved agreement/customer settings and repeating Search. Existing /UserGuide/invoice registration remains.

Source checks: both complete resource XML documents parse and contain no duplicate keys; all31 Rental source keys exist once in both languages with matching placeholders, including24 new diagnostic keys. Guide TypeScript syntax parses without diagnostics. Scoped Git diff --check passes in both repositories. Manual source review compared each split predicate with its previous combined condition and inspected unchanged calculation/output methods. All eight recipe checks passed; no canonical book/shared capability changed, so regeneration is unnecessary. Source review is not compilation or runtime acceptance.

Applied proportional discovery/contract freeze, backend localized-message implementation, UI guide update and final reconciliation. Grid/detail-write/action/runtime implementation phases have no new work for this continuation. No new screenshot requirement or unresolved business decision. No subagents: small sequential change below the delegation gate. No build/tests/lint/browser/database/migration/snapshot/commit/push/deployment commands were run.

Owner verification: rebuild/restart the backend, repeat the previously failing Rental Search in EN and AR, confirm agreement number and actual reason (and charge item ID when applicable), correct the identified saved source, and retry. Check preview still propagates the same detailed source error and valid agreements retain the same preview amounts. Suggested backend commit: `fix(invoice): identify invalid rental source agreements and charges`. Suggested frontend commit: `docs(invoice): explain rental source validation recovery`.
