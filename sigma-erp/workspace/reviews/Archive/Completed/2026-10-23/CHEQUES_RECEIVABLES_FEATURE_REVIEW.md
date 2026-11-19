| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Manifest

Latest owner amendment: Create Receivable now follows the owner-named Create PDC Payable presentation (shared1040px shell and direct four-column grid). Create/View/Edit remain a content-sized shared modal over the retained list; Mature Cheque opens its calendar on click, and Resubmit height is560px. The dated follow-ups below supersede earlier shell/focus descriptions in this source snapshot.

Outcome: implement confirmed document/screenshot requirements and guide conformance. Frontend repository scope ChequesReceivables; backend PDC entity/VM/service/controller/config and direct consumers only. Scoped frontend initially clean; both repositories contain extensive unrelated user changes that must be preserved. Recipe drift check: all eight packets OK on 2026-10-06. Plan and contract: CHEQUES_RECEIVABLES_MAINTENANCE_EVOLUTION_PLAN.md / CHEQUES_RECEIVABLES_SCREEN_CONTRACT_FREEZE.md, Frozen. Applicable phases0–6; source-only. AuthGuard authentication, no invented permission service. Exclude unrelated modules, accounting-formula redesign, migrations/snapshots, runtime execution.

Screenshots are English/LTR desktop, role/capture version/date Unknown; business references, no design authority.

## S1 — 1.PNG
| Classification | Evidence | Implementation |
|---|---|---|
| Explicit | Receipt/Cheque/Status/Type/Date range/Customer/Branch/Agreement filters; cheque/creation date choices | Frozen filter query and shared panel |
| Explicit | ReceiptNo/ChequeNo/ChequeDate/MatureDate/Bank/Customer/AgreementNo/Amount/Status/Notes | Frozen row/grid fields |
| Explicit | Cleared row offers Return Cheque (Bounce), Print; Report/Excel/Search | Typed return action; complete output |

## S2 — 2.PNG
| Classification | Evidence | Implementation |
|---|---|---|
| Explicit | Bounce chequeNo/date/amount read-only, bounce date/reason, Cancel/Save | Existing ReturnCheque payload and EditorDialog |

## S3 — 3.PNG
| Classification | Evidence | Implementation |
|---|---|---|
| Explicit | Add PDC, Mature Cheque(Bulk), Import PDC | One existing owner per workflow |

## S4 — 4.PNG
| Classification | Evidence | Implementation |
|---|---|---|
| Explicit | Contact, On Agreement, Payment Method, ChequeNo/Date, Bank, Amount, Notes | API-aligned record form; routed shell due financial lifecycle |
| Strong inference | Agreement picker when OnAgreement | Existing AgreementId; required only when checked, source-validated |

## S5 — 5.PNG
| Classification | Evidence | Implementation |
|---|---|---|
| Explicit | Pending cheque selection, VoucherNo/ChequeNo/Date/Amount/Bank | Paginated Pending-only grid, page-only checkbox selection |

## S6 — 6.PNG
| Classification | Evidence | Implementation |
|---|---|---|
| Explicit | Mature Date, Bank Account, Cancel/Save | Existing bankId resolver contract, labelled bank account; no ledger ID invention |

## S7 — 7.PNG
| Classification | Evidence | Implementation |
|---|---|---|
| Explicit | Sample download/file/reset/import preview/status, ContactCode/Name, PaymentMethod, ChequeNo/Date, BatchNo, Bank, Amount, Notes, Cancel/Save | Shared CSV + atomic typed import and nullable batch field |
| Uncertain | File extension, max rows, exact printed output | Reviewer standing rule: existing CSV, max1000, current grid/full record print; no invented cheque stationery |

Reference-action coverage: Job list Create/View/Edit/Delete/Export supported generically; labour-time/invoice/gate-pass/close-job Not Applicable (PDC lacks job labour/invoice aggregate). PDC's own four transition endpoints are all preserved. Full contract, pre-edit reference table and reviewer decisions are in the frozen handoff. Source reconciliation is recorded below; owner compilation/runtime acceptance remains pending.

## Result and phases

Implemented the screenshot-backed workflows in the existing owner: shared list/filter/paging, routed Create/Edit/View, maturity single/bulk, return/bounce, resubmit, CSV import with row diagnostics, complete Excel/report output. Existing accounting directions and receipt/JV owners remain unchanged. BatchNo is now persisted as an optional field.

| Phase | Outcome |
|---|---|
| PLAN-00 | Existing writers/readers identified, alternatives rejected and impact/rollout frozen before implementation |
| 0 | Seven screenshots classified; canonical books/skill and actual shape references read; all eight generated packets passed drift check |
| 1 | List/filter/detail/write/action/route/interceptor/import contracts frozen; integration clarifications appended without rewriting history |
| 2 | Lean list projection, actual counts/paging, shared filter/grid, complete export and report |
| 3 | Typed routed record form, saved labels, nullable IDs/payment, date/money validation, dirty navigation |
| 4 | Existing stateful actions exposed in typed dialogs; bank/state/preflight checks, atomic batch import |
| 5 | Routes/provider/title/interceptor/event/refresh wiring reconciled |
| 6 | Authored scoped diffs and new files reviewed separately in both repositories; source-only checks below |

No applicable phase was skipped. Aggregate children, documents/attachments, tax/discount calculations and job-specific actions are Not Applicable. File parsing is local CSV; no storage/upload cleanup contract is required. Build, tests, lint, browser, runtime and database acceptance were not executed under the project boundary.

## Decisions and evidence

| Concern | Final decision / source evidence |
|---|---|
| UI shapes | UI1/3/4/6 Job list; UI13 routed editor for financial lifecycle; UI13/17 JobClose + EditorDialog for date/reason workflows. Screenshots supply fields/actions, not layout authority |
| List DTO ↔ grid | Actions first (shared table). Grid fields: `receiptNo,chequeNo,chequeDate,maturityDate,bankName,customer,agreementNo,amount,status,notes,paymentMethod,createdBy,createdAt,no`. ListVM properties: `Id,ReceiptNo,ChequeNo,ChequeDate,MaturityDate,BankName,Customer,AgreementNo,Amount,Status,Notes,PaymentMethod,CreatedBy,CreatedAt,No`. Only `Id` is not a visible column; it owns actions/selection. No unused tenant/flags/navigation graph |
| Filters | `receiptNo,chequeNo,status,paymentMethod,customerId,branchId,agreementNo,fromDate,toDate,dateMode`; six main controls and three advanced controls. Current month default, enum0 preserved, blanks omitted. Generic scalar filters plus owning receipt/agreement/date hooks |
| Paging | Frontend15; shared choices10/15/20/50/100, `resolveListPaging`, actual TotalCount. Backend inherited GetMany, Id descending. Both paging inputs absent preserves unpaged compatibility; missing paged size defaults10, range1–100 |
| Detail/write | Create/Update only editable inputs, Update addsId. Detail adds saved identifiers/status/labels. BankName is text; PaymentMethod is0/1 enum. Amount positive decimal(18,2), no client-derived status/tenant/audit fields. OnAgreement requires AgreementId |
| Labels/lookups | GetById projects saved customer/contact/agreement/branch/receipt labels. View does not depend on lookup success; Edit preserves current selected labels with shared mergeSelectOptions; backend remains authoritative for live reference validation |
| Actions | Pending→Cleared maturity; Cleared→Bounced return; Bounced→Pending resubmit; editPending/deletePendingOrCancelled. Bulk rejects any missing/non-Pending target instead of silently saving a subset. Bank/GetSelect returns BankId; JournalVoucherResolver owns ledger resolution |
| Save/transactions | Ordinary tracked save uses shared base reference validation. Import validates every row before AddRange + one SaveChanges (implicit transaction). Existing financial multi-save actions retain explicit transactions and check false save results before commit/success |
| Import | Screenshot7 plus shared ImportCsv: nine CSV headers, sample/reset/preview/save,1–1000 rows. Exact live tenant Contact.No; optional ContactName verification; no contact creation, no invented contact text caps, no posting |
| Import failure | Complete false diagnostics mean no rows saved and may be retried. Unexpected persistence/transport or malformed response locks replay and requests reconciliation. Confirmed success IDs must be positive/unique/complete |
| Report/output | Minimal source-supported list/row print, shared ReportPrintService, full applied-filter snapshot for report/Excel. No cheque stationery or new accounting report formula inferred |
| Mapping | Four one-way AutoMapper maps; flatten only required labels, customer fallbackContact. No ReverseMap or unnecessary Ignore. Explicit lean DetailVM supported by current base constraints |
| Calculations | Amount is input; existing maturity Bank debit/AR credit and bounce AR debit/Bank credit preserved. No client totals, tax, allocations or domain calculations introduced |
| API/error ownership | AuthGuard/interceptor-enabled root BaseService preserved. Reads/lookup failures inline; ordinary mutations use one existing interceptor feedback owner. Import skips error/success interceptor and owns row/inline feedback; controller preserves validation entityHTTP200 and persistence failureHTTP500 |
| Localization | EN/AR feature block103 keys each, exact parity;101 literal feature references present. BE38 matching PDC resource keys; scoped DataAnnotation resource accessor, generated Designer untouched |
| Schema | Nullable `BatchNo`, max100, no value/backfill/unique/accounting meaning. Owner migration required |

The initially Uncertain file format/row count/print shape are resolved conservative choices under the standing screenshot rule, not screenshot facts: CSV (existing shared owner),1000 rows (bounded import), existing list output (minimum sufficient print). No Missing/Conflicting/Uncertain contract blocks implemented scope. Runtime/visual acceptance is still Uncertain until owner checks it. Legacy unconsumed FullListVM and unrelated Customers/PDCReceivable remain outside scope. No reusable new guide rule was established; feature decisions remain here and in the freeze.

## Final reference conformance

| Concern / book | Actual reference/shared owner | Final target symbols and compared values | Source status |
|---|---|---|---|
| List chain UI1/3/6 | Workshop/Job list + shared list styles/DataTable | PDCReceivablesComponent host`sigma-route-host`; HTML`sigma-list-page/panel/header/table`; FeatureTitle inside panel; grid`fill=true`, fixed paginator, no local SCSS | Reconciled |
| Filter geometry UI4 | JobsComponent/list.html + FilterPanel | PDC HTML`stableLayout=true`, range`numberOfMonths=2`, `reserveMessage=validationMessages.date`; advanced branch/agreement/dateMode; shared controls/labels/actions | Reconciled |
| Requests/count UI2/8/28 | JobsComponent.bindListQueries + list-query helpers | PDC.bindQueries uses switchMap/defer/finalize/takeUntilDestroyed; actual totalCount; resolveListPaging before changing page; getAllList100 follows fetchAllPages | Reconciled |
| Form chain UI1/13/19 | Job routed editor + shared editor styles/FormSection | Details host route chain; one sigma-editor-scroll inside body/form; compact FormSection grid; footer outside scroll. Typed controls and exact nullable/numeric payload | Reconciled |
| Action dialog UI13/17/22 | JobCloseComponent + EditorDialog | Actions width860px matches JobClose, contentPadded=true, focusOnShow=false, shown focuses first active date. Shared maxWidth viewport−24px/maxHeight viewport−24px and breakpoints1099/767 retained; bulk650px/form480px definite bounds for inner scroll, no local CSS. Title screen name + action/record subtitle; one close confirmation | Reconciled; narrow-height visual check pending |
| Import UI18/22 | ImportCsvComponent/CsvRecord + DataTable/EditorDialog | Import wraps shared local CSV and its template, mapped nine header values; complete diagnostics checker; shared parser recreated on reset to detach stale callbacks. No parser/control copy | Reconciled |
| Print UI21 | ReportPrintService.createSession + shared print styles | PDCReport session withDestroyRef, sigma-report-print-dialog + sigma-dialog-print; printing disables paginator/scroll/fill, all rows retained, print heading included.1200px width with shared viewport cap; definite min720px/viewport−24px height | Reconciled; print pagination/visual check pending |
| Read DTO/mapping BE3/4/7/9/13 | BranchProfiler/BranchService + Service hooks | PDC profiler four one-way maps; explicit15-member ListVM; inherited counts/paging, ApplyListFilters/Order/Materialize hooks. Detail projects only consumed labels | Reconciled |
| Writes/actions BE8/15 | Base.InvalidInputAsync + InvoiceService/JournalVoucherResolver | PDC.Update uses tracked mapping/save; Add delegates base after metadata validation; maturity/return transactions preserve existing posting directions and resolver | Reconciled; accounting/runtime check pending |

## Final reconciliation

| Contract/path | Producer | Consumer | Final source evidence | Status / required action |
|---|---|---|---|---|
| Screenshot content | S1–S7 evidence + freeze | list/editor/action/import/report | All visible content and required business paths represented; shared layout replaces screenshot presentation | Source reconciled |
| Row/filter/page | ListVM + PDC service hooks/baseGetMany | FE models/list/service | Fields above; `Filters[key]` boundary and stable enum0; actual metadata consumed | Source reconciled; owner paging/filter checks |
| Write/detail | Add/Update/Detail VMs + profiler/service | models/create/details + editor | Numeric IDs, nullable fields, saved labels, money/date/max lengths; no server-owned inputs | Source reconciled; owner compilation/input checks |
| Actions/state | MatureSingle/Bulk/Return/Resubmit + existing resolver | action payloads/dialog + list visibility | Existing POST paths; allowed states and whole-batch checks; successful child close emits one parent refresh | Source reconciled; owner posting/rollback/race checks |
| Import | ImportAsync/controller/resultVMs | importRows + hasCompleteDiagnostics/failureResult | Exact headers/row numbers/status/id contract, all-or-none diagnostics, ambiguous replay guard | Source reconciled; owner atomicity/recovery checks |
| Output | frozen appliedFilters + getAllList | dataTableExportRows + report session | Excel/report fetch all pages; no partial file on failure; row print snapshot; close cancels report load | Source reconciled; owner print/Excel checks |
| Routing/DI | route modes/dirty guard + root service | list/editor/shared shell | create/view/edit; legacydetailsredirect; query state carried; layout duplicate provider removed; toolbar avoids duplicate PDC title | Source reconciled; owner navigation checks |
| Feedback/auth | existing shared HttpClient/interceptors/AuthGuard | service/components/controller | Ordinary mutation once; reads/import explicitly skipped with owned feedback; Resultfalse and HTTPerror both handled | Source reconciled; owner notifications/auth checks |
| Translations/styles | EN/AR + BE resources + shared components/styles | all feature TS/HTML/annotations | Parity/source checks passed; no feature SCSS/colors/control forks; labels/ARIA/RTL classes retained | Source reconciled; owner language/theme/responsive checks |
| Plan/rollout | frozen maintenance plan | BatchNo EF/API/UI + above workflows | Existing owners extended in place; migration boundary respected | Source reconciled; owner schema rollout pending |

## Files changed

Paths below are relative to the named repository. Unrelated pre-existing dirty changes remain present, including shared translations/layout/resources; only the targeted changes listed here belong to this task.

Frontend `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Banking/ChequesReceivables/components/list/list.component.ts` and `.html` — replace legacy list.
- `.../components/details/details.component.ts` and `.html` — typed routed editor.
- New `.../components/actions/actions.component.ts` and `.html` — four action dialogs.
- New `.../components/import/import.component.ts` and `.html` — CSV preview/save/recovery.
- New `.../components/report/report.component.ts` and `.html` — shared print preview.
- `.../models/list.ts`, `create.ts`, `details.ts`; new `models/actions.ts` — explicit contracts; retain externally imported Bank/PaymentMethod compatibility exports.
- `.../services/pdc-receivable.service.ts`; `.../pdc-receivable.routes.ts` — typed endpoints/query/route guard.
- Deleted empty `components/list/list.component.scss`, `components/details/details.component.scss` and their obsolete `.spec.ts` files (incorrect unrelated component smoke specs); runtime imports no longer reference them.
- `src/app/modules/i18n/vocabs/en.ts`, `ar.ts` — targeted PDC block entries.
- `src/app/_metronic/layout/layout.module.ts` — remove PDC-only duplicate provider/import; `.../components/toolbar/toolbar.component.ts` — PDC title exclusion. Other pre-existing edits preserved.

Backend `F:/My Work/Sigma/SigmaBackend`:

- `SiGma.Helpers/Models/Banking/PDCReceivable.cs`; `SiGma.DataAccess/Configuration/PDCReceivableConfig.cs` — BatchNo.
- `SiGma.Business/MapperConfig/PDCReceivableProfiler.cs`; `IServices/IPDCReceivableService.cs`; `Services/BanksServices/PDCReceivableService.cs` — lean projections/read hooks, validation, atomic import/action corrections.
- `SiGma.ServerAPI/Controller/PDCReceivableController.cs` — Import and result status handling; remove redundant list override.
- `SiGma.ViewModels/ViewModels/PDCReceivable/`: changed `PDCReceivableAddVm.cs`, `PDCReceivableUpdateVm.cs`, `PDCReceivableDetailVm.cs`, `PDCReceivableListVm.cs`, `PDCMatureRequestVM.cs`, `PDCMatureSingleVM.cs`, `PDCReturnChequVM.cs`, `PDCResubmitVM.cs`.
- Same VM folder: new `PDCImportRequestVM.cs`, `PDCImportRowVM.cs`, `PDCImportResultVM.cs`, `PDCImportRowResultVM.cs`, `PDCReceivableWriteValidation.cs`, `PDCReceivableValidationMessages.cs`; every named class in its own file.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`, `GeneralMessage.ar-SA.resx` —38 PDC keys only; preserve unrelated entries/BOM state; generated Designer unchanged.

Local review artifacts: this feature review, Frozen maintenance plan and Frozen screen contract (with dated integration clarification). No reference module, shared control, migration or snapshot authored.

## Verification performed and limits

- Separate repository ownership and complete authored scoped diffs reviewed, including added files and deleted obsolete files. Shared file hunks distinguished from extensive unrelated changes.
- Read-only TypeScript parser and Angular template parser:11 TS +5 HTML files, zero syntax/parse issues. This is not TypeScript type checking, Angular compilation, build or runtime verification.
- AST/local import resolution:102 local imports resolve to existing source/declarations; no unresolved named imports. Not a compiler diagnostic.
- Feature EN/AR key parity103/103, zero missing/case differences;101 literal feature references present in both. BE resource XML parsed, PDC38/38 parity and no duplicate keys.
- Scoped git diff --check in both repositories passed; Git emits only existing LF→CRLF normalization notices. New files checked as source additions.
- Source scans for stale feature imports/payloads, legacy ms-lib, merge markers, routes/provider/event wiring, API field alignment and AutoMapper maps reviewed. Removed backend DTO members have no directly related external consumers. The known CardTransactionBankTransfer FE compatibility imports remain valid.
- No builds, tests, lint, browser automation/application verification, DB commands, migrations/model snapshots, Graphify, Sigma MCP, commits, pushes or deployments were run. Owner verification pending remains yes; no release-readiness claim.

## Risks, rollout and owner checks

1. Before running the updated API, the owner must create/review/apply `Add-Migration AddPdcReceivableBatchNo`: nullable max100 BatchNo for existing PDC records, no backfill. No migration/snapshot was created here.
2. Compile both repositories with the owner's normal checks, then exercise Create/View/Edit and nullable selections, OnAgreement, amount boundaries/precision and complete date inputs. Parser checks do not prove type compatibility or EF/AutoMapper execution.
3. Verify all filters including status0/payment0, cheque vs creation date, current month/all dates, receipt/agreement text, page/count/last-page delete, and query restoration after navigation. Verify every applied row in Excel/report, not just the current page.
4. Verify maturity single/bulk creates the existing receipts/JVs with Bank debit/AR credit; bounce reverses AR debit/Bank credit and receipt state; resubmit returns Pending. Verify invalid bank/branch/partner configuration, stale/non-Pending selection, and a failed later save roll back the entire action.
5. Import the downloaded sample with exact live Contact.No, numeric/named payment, ISO/DMY dates, batch/notes; verify all rows persisted once as Pending and no posting. Then include one invalid/contact-name-mismatch/overlength/precision row and verify zero saved rows plus full diagnostics. Simulate transport/persistence/malformed-result ambiguity and confirm replay lock, preview retention and list reconciliation before retry.
6. Check dirty Cancel/Back/route navigation, duplicate Save guards, lookup retry, both Resultfalse/HTTPfailure channels and exactly one mutation feedback. Check EN/AR, keyboard/focus/ARIA, RTL/light/dark, narrow viewport/dialog height and print page flow.

Residual source risks retained by scope: existing PDC read→state-update concurrency races (no new concurrency token/lock); no import idempotency guarantee; legacy inherited bulk-write service entrypoints; historical FK consistency assumes existing tenant data integrity. JS number transport cannot represent every decimal(18,2) extreme: CSV rejects loss of cents, and owner should check manual large-amount behavior. Automatic host binding failures retain existing ProblemDetails conventions; import handles absence of complete diagnostics conservatively. BatchNo rollout is mandatory even for reads once the entity model changes.

Suggested commits (suggest only): frontend `Refactor receivable cheques UI and complete action/import workflows`; backend `Refactor receivable cheque contracts and add atomic PDC import`. Review and stage only task hunks because both repositories contain unrelated work.

## Agent utilization

Root performed discovery/contracts/reference selection, FE list/models/service/routes/report/translations/layout integration and final reconciliation. Three bounded agents were used only after freeze under the applicable AGENTS delegation gate: record_editor owned details TS/HTML and obsolete local files; actions_import owned only the four new action/import files; backend owned only PDC BE files and targeted resource additions. All inherited the orchestration model because full-history forks inherit model selection; no speculative model override. Isolated FE and BE work reduced wall-clock time without overlapping writers; one action/import follow-up repaired complete-diagnostic/ambiguity integration, and the BE follow-up completed annotation localization. Every output was integrated and source-reviewed by root. Agents did not declare overall completion or run prohibited commands.

## Owner follow-up — modal and click-only calendar — 2026-10-06

Request: «خلى الشاشة modal لانها صغيرة»; Mature Cheque must open its date picker only on intentional click. Presentation amendment frozen before edits in the screen contract; API/accounting contracts unchanged.

| Path / concern | Final change and evidence | Source reconciliation |
|---|---|---|
| Details TS/HTML | Replace routed page/title/footer with shared EditorDialog for all three modes.860px width, two field columns, auto content height capped90dvh; contentPadded=true, focusOnShow=false, flex-fill on form/body/scroll and p-0 on body to avoid duplicated padding. Existing controls/payloads/lookups/validation retained | UI13 content-sized alternative and actual shared shell compared; no local CSS |
| Modes/dirty close | Shared mode-aware Save/Edit/Cancel/Close footer. Edit offered in View only for Pending. X/Cancel/Escape call requestClose; existing CanDeactivate owns confirmation and blocks saving/duplicate confirmation | Dirty protection retained for dialog and external navigation |
| Routes/list | List becomes retained parent with modal child routes and RouterOutlet. Existing create/view/edit/details URLs remain compatible. refresh skips route rewriting while a child is active, protecting deep links; deactivate checks editor.wasSaved and refreshes the applied list snapshot once without navigating | Deliberate UI1 compatibility exception to normal list-only modal URL; no duplicate editor or standalone full-page shell |
| Mature Cheque picker | Remove shown binding and onShown queue→focusField call. That helper synthesizes an input click and caused automatic overlay opening. Action validation focus now sets openOverlay=false; shared DatePickerDirective sets showOnFocus=false and opens on input click | No lifecycle focus/overlay call; shared directive reused, no local picker handler |
| Other contracts | No backend/entity/mapping/calculation/translation/service change in this follow-up | Prior BatchNo rollout requirement remains; no additional migration |

Files changed in this follow-up: details.component.ts/html, list.component.ts/html, pdc-receivable.routes.ts, actions.component.ts/html in `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/ChequesReceivables`, plus the local review/freeze amendments. Previous and unrelated working-tree changes preserved.

Applicable phases:1 owner presentation amendment,3 modal form,4 action presentation only,5 child-route/refresh integration,6 source reconciliation. Backend and phase2 grid/query contracts need no new implementation. No new reusable guide rule. No subagents used for this small connected change.

Verification: all11 feature TS and5 HTML files parse with zero syntax diagnostics; scoped git diff --check passes (LF→CRLF notices only). Reviewed all authored follow-up changes, direct lazy route, standalone RouterOutlet/EditorDialog imports, mode/guard/return query flow, existing translations, and absence of shown/lifecycle calendar opening. This is parser/source verification, not type checking, build or runtime acceptance. No prohibited command was run.

Owner acceptance pending: open Add/View/Edit over the retained list; check content height and internal scroll on small viewports/RTL/themes; test dirty X/Cancel/Escape and external navigation with both discard answers; successful save refreshes once while Cancel retains draft filters/page; direct create/view/edit and legacy details links remain modal. Open Mature single and bulk: calendar closed on show and tab-focus, opens when clicking the date field; test invalid Save focus and retry. Possible runtime risks are nested-route outlet/guard event behavior and intrinsic modal flex sizing, which source parsing cannot prove.

Suggested frontend commit for the follow-up: `Show receivable cheque editor as modal and prevent date auto-open`. No new backend commit or migration required for this follow-up.

## Owner follow-up — taller Resubmit — 2026-10-06

Owner requests a small height increase to remove normal-height scrolling. Changed only the Actions HTML shared height input: Resubmit480→560px; Bulk650px and other actions480px. Shared EditorDialog still caps at viewport−24px and retains inner scrolling where short screens require it. UI13/skill shared-input recipe reused; no CSS, API, mapping, calculations, translations or schema changes. Scoped phases1 amendment,3 presentation and6 source check; other phases do not need changes. No subagents for this one-element fix. Source/template and whitespace checks performed; visual acceptance of no scroll at the owner's viewport remains pending. No prohibited commands run. Owner check: open Resubmit at the normal viewport and verify full fields/footer visible; confirm short viewport still scrolls internally. Suggested FE commit: `Increase receivable cheque resubmit dialog height`; no additional migration/backend commit.

## Owner follow-up — Create Receivable like Create PDC Payable — 2026-10-06

Owner explicitly names Create PDC Payable as presentation reference. Read its current details HTML/TS and empty SCSS, shared EditorDialog public inputs/styles and shared grid before editing; freeze amended first. Payable remains read-only despite its pre-existing dirty files. UI13 named-reference rule and content-sized alternative own this presentation; SIGMA_FEATURE_REVIEW_MASTER and applicable detail/reconciliation packets remain authoritative, with all eight recipes passing drift check.

| Compared concern | Named Payable/shared source | Final Receivable consumer |
|---|---|---|
| Shell | EditorDialog default width1040px; auto height/maxHeight90dvh; receipt icon; contentPadded=true/focusOnShow=false | Remove860px width override; same shared shell values, icon, create description, translated footer hint |
| Grid | Direct sigma-editor-grid, shared default4 columns;2 below1024px/1 below700px; gap7px16px | Remove two-column override and inner FormSection card/heading; direct grid consumes identical shared geometry |
| Body chain | Outer sigma-editor-form + form/body/scroll flex-fill | Same chain and shared body spacing; one scroll owner; shared fixed header/footer |
| Content order | Party selections/branch/payment, cheque dates, bank/amount/batch, full-width3-row notes | Customer/contact/branch/payment, chequeNo/chequeDate/maturityDate/bankName, amount/batchNo/OnAgreement/AgreementId, saved identity/status if present, Notes. All13 existing form-control bindings retained |
| Feature boundary | Payable has supplier/bank ID contracts | Retain Receivable textBankName, own nullable inputs/validators/date behavior/money precision and dirty/mode/route handling; no payable business/API copied |

Files changed only: Receivable details HTML, details TS (remove unused FormSection import), EN/AR PDC block (editorSubtitle/requiredFieldsHint, EN create title aligned with Create wording), and local review/freeze amendments. No local stylesheet/shared-control/reference-source change. Same editor shell serves its existing Create/Edit/View modes. No backend, mapping, domain calculation or schema change, and no additional migration requirement.

Source reconciliation: template/TS/translation parsing has zero syntax issues;105 feature keys in each language, exact parity, no missing template keys. Compared before/after control bindings: same13 names; all field validators and backend DTOs unchanged. Authored changes and final shell/body/grid/footer inputs reviewed; scoped diff whitespace check passed (Git normalization notices only). This is source/parser verification, not build/type check/browser acceptance. No prohibited commands run. No new general guide rule; no subagents for this small connected presentation edit.

Applicable phases:1 presentation amendment,3 editor/labels and6 source reconciliation. Other phases need no changes. Owner check: compare Create Receivable and Create PDC Payable at the same viewport, verify four/two/one-column behavior, matching shell/body/footer spacing and notes width; check Arabic/RTL/dark mode, optional Agreement requirement, validation, dirty exits and save. Remaining risk: visual/intrinsic-height parity cannot be proven by source parsing alone. Suggested FE commit: `Align receivable cheque editor with payable cheque presentation`; no new backend commit.
