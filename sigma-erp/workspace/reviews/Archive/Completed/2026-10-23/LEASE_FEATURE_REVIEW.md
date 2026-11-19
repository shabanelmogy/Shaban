# Lease frontend review and implementation — 2026-10-06

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Scope, manifest and authority

User request: review `src/app/modules/Lease` and implement documentation-supported changes. Repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`. The frontend was clean at discovery. Direct backend producers were inspected read-only in `F:/My Work/Sigma/SigmaBackend`; no backend edits are required by this frontend handoff. No screenshots were supplied with this request. Historic screenshots/contracts remain functional evidence in their earlier artifacts and are not reclassified as current visual acceptance.

Authority: `F:/My Work/Sigma/AGENTS.md`, mandatory `.agents/skills/sigma-screen-refactor/SKILL.md`, Master4/5/7, UI screen catalog and owning blocks1–8/10/13–19/22–28/30, and applicable backend contracts. Before implementation, the root froze `LEASE_FRONTEND_CONTRACT_FREEZE.md`; shape-specific reference conformance is recorded in `Lease/ROOT_20261006_REVIEW.md`, `Lease/AGREEMENT_20261006_REVIEW.md`, `Lease/DOCUMENTS_20261006_REVIEW.md` and `Lease/SETTINGS_20261006_REVIEW.md`. These form the review manifest and exact contract evidence.

Recipe `Generate-SigmaRecipes.ps1 -Check` reported derivative drift: every checked packet except Phase1 was stale. Canonical books were used. Generated packets were not edited; regeneration and semantic review remain an owner task.

## Decisions and grid contracts

Actions are supplied through the shared table action column. The following lists explicitly match grid columns to response properties; action/identity properties are the justified additional fields. No backend ListVM was expanded.

| Feature / shape | Visible grid fields in order | Frontend ListVM and minimum action properties | Decision and source evidence |
|---|---|---|---|
| LeaseAgreement / routed aggregate | no,isClosed,agreementType,poNo,vehiclePlateNo,permanentVehicle,customerName,customerCode,driverName,dateAndTime,endDate,branchName | Same fields plus id,isVoided,canEdit,canReplaceVehicle,canReplaceDriver,canExtend,canClose,canDelete,canVoid,branchId | Preserve server eligibility and four child collections/totals; existing models/service and current action contexts. Job list/editor and close-job dialog shared owners govern presentation. |
| closedLeaseAgreements / filtered read | Same Agreement columns | Same Agreement row | Force server `isClosed=true`, including restored filters/export. View only. Existing list and aggregate viewer replace nonexistent `closedLeaseAgreementss` writer and first-page filtering. Keep `details/:id` as View compatibility route. |
| LeaseClause / list + modals | name | id,name; clauses exists only in ClauseTypeDetailsDTO | Parent reusable template contract owns children/default selection. Normalize received numeric IDs at string-wrapper input boundary; no identity or endpoint change. |
| LeaseCostParameter / list + modal | name,order | id,name,order | Scalar editor from row snapshot; backend owns uniqueness/reference deletion validation. |
| LeaseCostSetting / list + single-child modal | makeAndModelName,markUpPercent | id,makeAndModelName,markUpPercent | Parent full snapshot owns items. Hydrate rows directly in View, load selectable lookups only in editable modes, preserve detail names. |
| LeaseInquiry / list + single-child modal | no,date,customerName,customerCode,salePersonName,stage | id,no,date,customerName,customerCode,salePersonName,leaseInquiryStage,leaseInquiryStageText | Stage0 remains New. Existing ChangeStage{id,stage,notes}/logs endpoints remain; shared date/filter/error/collection owners. |
| LeaseQuotation / routed document | no,date,customerName,customerCode,internalApproval,customerApproval | id,no,date,customerId,customerName,customerCode,internalApproval,customerApproval and existing canEdit/canDelete/canApproveInternally/canRejectInternally/canApproveByCustomer/canRejectByCustomer/canRevise/canUnapprove/canCreateMasterAgreement | Preserve action flags and full item snapshot. Backend five `rateMonth*YearLease` fields are nullable DateTime despite names: preserve their existing date semantics and unchanged stored values. No monetary reinterpretation. |
| LeaseMasterAgreement / list + routed View | no (existing approval badge),date,customerName,customerCode,quotationNo | id,no,date,approvalStatus,customerName,customerCode,quotationNo,canApprove | Create remains quotation action; View is routed and returns list query state. Approval endpoint unchanged. |
| LeaseTariff / vehicle-type list + routed aggregate | name,detail,notes | VehicleTypeListDTO id,name,detail,notes | Four collections require routed editor. Identity is confirmed vehicle-type context: GetTariffByVehicleTypeId returns success/null when no tariff, so Configure resolves existing Edit or Create. No tariff-ID lookup invented. View with no tariff shows explicit missing state. |
| LeaseCustomerSms / operational simulation list | code,name,mobileNo,email,status | id,code,name,mobileNo,email,status | Preserve top-level search/sort query accepted by its dedicated controller and page selection. Simulation remains simulation; no SMS provider/delivery integration introduced. |
| LeaseCostSettingItem / dormant unsupported root | none | none | Parent freeze rejects standalone writes. No registered route, selector consumer or application explicit root; remove dead source and LayoutModule import/providers. Parent child DTOs/management remain. |

Exact filter/DTO/action-state contracts and reference/shared-owner comparisons are in the four workstream artifacts. Lists with an existing date range default to the current month under UI17; clearing a range remains a distinct restored state. Unsubmitted filter drafts do not change paging/export snapshots. No new filter, permission API, accounting transition or calculated write field is introduced.

## Implemented behavior

- Lists use `sigma-route-host`, canonical title/filter/grid containers, fill tables, standard page-size options, shared Reset where filters exist, shared paging/query/export/error owners and balanced loading/cancellation.
- Editors/dialogs use the owning shared shell, internal scroll regions, fixed actions, typed forms/collections, shared state/field feedback, date controls/validators, actual enum values, stable dropdown columns and readonly numeric highlights. Record identifiers appear in translated subtitles.
- CostSetting View retains saved children; Clause numeric IDs no longer call `.trim()` on JSON numbers. Failed details/lookups have visible retry states; required failed lookups block Save. Deleting a final page row steps back where needed.
- Quotation rejection/master-creation dialogs close successfully after mutation. Pending confirmations and writes gate conflicting Save/remove/close operations; removal re-resolves row identity. Agreement Close/Extend writers and collection controls honor existing canClose/canExtend context flags. Closing requires both context and branch options; a partial/transport read failure keeps Save locked and offers Retry.
- Deposit uses the existing FileField/DocumentUploadTracker lifecycle and actual shared5MB type/extension/size validation. Failed committed-save cleanup is retried without submitting another receipt. Atomic Agreement document actions retain their original multipart owner.
- Inline failures suppress duplicate interceptor feedback. Ordinary mutation successes retain the global success owner; composite Deposit success is emitted once after attachment cleanup. `BaseService.getById` gains an optional skip-error flag for the Deposit payment-method context; defaults remain unchanged. This reusable addition is promoted to UI2, skill§6/history, UI preamble1.87 and documentation changelog.
- EN/AR missing Quotation groups and record subtitles/enum aliases are reconciled. Closed subset routes reuse live Agreement components; unsupported duplicate source is retired.

## Backend, contracts and known drift

Backend source, entities, EF configuration, AutoMapper, migrations and snapshots are unchanged. Backend calculations, financial precision/wording, tenant boundaries, action eligibility and persistence reconciliation remain their existing owners. No Add-Migration is required and no backend commit is suggested.

Current `SiGma.Business/Services/TariffSettingService.cs` reconciles a complete branch-settings snapshot and deletes omitted rows. The newer BE16 ordinary-settings no-delete-by-omission rule differs from this established endpoint. This frontend task preserves the confirmed current snapshot semantics and its removal confirmation; it neither invents a delete API nor silently changes destructive persistence behavior. An owner-approved backend/settings contract review is required to change that behavior. The frontend setting Save still loads the complete settings response before enabling edits.

Tariff Configure's vehicle-type route identity and SMS's top-level search/sort parameters are explicit source-backed deviations from generic CRUD conventions. Authentication remains AuthGuard; hiding an action is not described as authorization.

## Phase reconciliation

| Phase | Outcome |
|---|---|
| 0 discovery | Applied: scoped source/evidence/reference inventory, clean frontend baseline, recipes checked. |
| 1 freeze | Applied: frontend contract handoff Frozen, read-only verification of producer contracts. |
| 2 reads/grids | Applied to all live Lease lists; paging/applied filters, full export where existing, stable shared presentation. |
| 3 details/writes | Applied to existing editors/dialogs/upload workflows; no new business workflow. |
| 4 actions | Applied only to existing confirmed actions and confirmation/error/locking presentation. Existing transition/persistence rules preserved. |
| 5 integration | Applied to routes, dead providers, shared opt-in detail request and EN/AR vocabulary. |
| 6 reconciliation | Final source review and verification recorded below. Runtime/visual/type compilation acceptance remains owner-pending. |
| Backend implementation / migration / deployment | Not applicable to this frontend request; not run. |

## Source verification and owner acceptance

Final integrated source verification passed: 53 changed TypeScript files and 36 changed Angular templates parsed without syntax errors; changed local import/template/style references resolved; EN/AR static Lease translation keys reconciled; source-only template member-reference scan found no stale handlers; scoped git diff --check passed. Complete root/worker-owned source diffs and final integration were reviewed. The backend working tree remains clean. The frontend inventory below records 150 modified/deleted files. TypeScript AST and Angular template parsing establish syntax only; they do not establish type correctness, application compilation or visual acceptance. No build, test, lint, browser automation/runtime, database, migration, commit, push or deployment command has been run.

Owner acceptance should cover:

1. Application compilation, then desktop/narrow layout, Arabic RTL and dark theme: no page scrolling; title/filters/paginators/footer fixed and each editor/grid/dialog region scrolls internally.
2. Page-size-only changes, next-page sort, applied filter versus draft, Reset/current-month/cleared-range restoration and complete filtered export.
3. Create/Edit/View and failed detail/lookup retry; CostSetting saved View children; Clause exactly-one-default; Quotation original nullable DateTime values and action dialogs; Tariff missing/existing configuration and month input/range/overlap validation.
4. Ordinary HTTP failure and `isSuccess=false` feedback once; successful mutations once; rapid double Save/remove/close and row identity after confirmation.
5. Deposit valid/invalid5MB files, replacement/removal, failed upload, failed receipt Save, successful receipt with failed cleanup and Retry without duplicate creation; atomic documents and existing action states.
6. Closed list server-only filtering/page count, View/return filters and absence of standalone mutation; SMS simulation selection/message/result and no delivery side effect.

Suggested frontend commit: `refactor(lease): align screens and workflows with canonical UI patterns`. Suggested documentation commit for task-owned additions only: `docs(sigma): document opt-in detail error feedback`. Suggestions only; no commits made. Existing unrelated documentation changes must remain separate.

## Agent utilization

Three bounded inherited-model workstreams owned Agreement, Inquiry/Quotation/Master, and Clause/CostParameter/CostSetting. Initial agents were resumed through replacement agents after their turns failed at a usage boundary; old agents were no longer running, so ownership did not overlap. Root owns Tariff/SMS/closed routes/shared/vocabulary, freezes, integration and final report. No model override was used. Parallelism reduced wall-clock time across independent feature directories; each worker inspected its complete owned diff and reported source-only evidence. Root integrates and reconciles the scoped repository result.

## Changed-file inventory

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Status M means modified; D means removed after scoped consumer/root checks. No source additions are untracked.

```text
M	src/app/_metronic/layout/layout.module.ts
M	src/app/modules/Lease/LeaseAgreement/components/additional-charges/additional-charges.component.html
M	src/app/modules/Lease/LeaseAgreement/components/additional-charges/additional-charges.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/additional-charges/additional-charges.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/billing-history/billing-history.component.html
M	src/app/modules/Lease/LeaseAgreement/components/billing-history/billing-history.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/billing-history/billing-history.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/closing/closing.component.html
M	src/app/modules/Lease/LeaseAgreement/components/closing/closing.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/closing/closing.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/delivery-date/delivery-date.component.html
M	src/app/modules/Lease/LeaseAgreement/components/delivery-date/delivery-date.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/delivery-date/delivery-date.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/deposit/deposit.component.html
M	src/app/modules/Lease/LeaseAgreement/components/deposit/deposit.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/deposit/deposit.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/details/details.component.html
M	src/app/modules/Lease/LeaseAgreement/components/details/details.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/details/details.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/discounts/discounts.component.html
M	src/app/modules/Lease/LeaseAgreement/components/discounts/discounts.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/discounts/discounts.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/documents/documents.component.html
M	src/app/modules/Lease/LeaseAgreement/components/documents/documents.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/documents/documents.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/driver-replacement/driver-replacement.component.html
M	src/app/modules/Lease/LeaseAgreement/components/driver-replacement/driver-replacement.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/driver-replacement/driver-replacement.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/extend-period/extend-period.component.html
M	src/app/modules/Lease/LeaseAgreement/components/extend-period/extend-period.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/extend-period/extend-period.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/extend-period/extend-rate-period.component.html
M	src/app/modules/Lease/LeaseAgreement/components/extend-period/extend-rate-period.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/extend-period/extend-rate-period.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/list/list.component.html
M	src/app/modules/Lease/LeaseAgreement/components/list/list.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/list/list.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/logs-dialog/logs-dialog.component.html
M	src/app/modules/Lease/LeaseAgreement/components/logs-dialog/logs-dialog.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/logs-dialog/logs-dialog.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/payment-instructions/payment-instructions.component.html
M	src/app/modules/Lease/LeaseAgreement/components/payment-instructions/payment-instructions.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/payment-instructions/payment-instructions.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/vehicle-replacement/vehicle-replacement.component.html
M	src/app/modules/Lease/LeaseAgreement/components/vehicle-replacement/vehicle-replacement.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/vehicle-replacement/vehicle-replacement.component.ts
M	src/app/modules/Lease/LeaseAgreement/components/void/void.component.html
M	src/app/modules/Lease/LeaseAgreement/components/void/void.component.scss
M	src/app/modules/Lease/LeaseAgreement/components/void/void.component.ts
M	src/app/modules/Lease/LeaseAgreement/services/leaseagreement.service.ts
M	src/app/modules/Lease/LeaseClause/components/clauses/clauses.component.html
D	src/app/modules/Lease/LeaseClause/components/clauses/clauses.component.scss
M	src/app/modules/Lease/LeaseClause/components/clauses/clauses.component.ts
M	src/app/modules/Lease/LeaseClause/components/details/details.component.html
D	src/app/modules/Lease/LeaseClause/components/details/details.component.scss
M	src/app/modules/Lease/LeaseClause/components/details/details.component.ts
M	src/app/modules/Lease/LeaseClause/components/list/list.component.html
D	src/app/modules/Lease/LeaseClause/components/list/list.component.scss
M	src/app/modules/Lease/LeaseClause/components/list/list.component.ts
M	src/app/modules/Lease/LeaseClause/models/clause-type.ts
M	src/app/modules/Lease/LeaseClause/services/leaseclause.service.ts
M	src/app/modules/Lease/LeaseCostParameter/components/details/details.component.html
D	src/app/modules/Lease/LeaseCostParameter/components/details/details.component.scss
M	src/app/modules/Lease/LeaseCostParameter/components/details/details.component.ts
M	src/app/modules/Lease/LeaseCostParameter/components/list/list.component.html
D	src/app/modules/Lease/LeaseCostParameter/components/list/list.component.scss
M	src/app/modules/Lease/LeaseCostParameter/components/list/list.component.ts
M	src/app/modules/Lease/LeaseCostParameter/services/leasecostparameter.service.ts
M	src/app/modules/Lease/LeaseCostSetting/components/details/details.component.html
D	src/app/modules/Lease/LeaseCostSetting/components/details/details.component.scss
M	src/app/modules/Lease/LeaseCostSetting/components/details/details.component.ts
M	src/app/modules/Lease/LeaseCostSetting/components/list/list.component.html
D	src/app/modules/Lease/LeaseCostSetting/components/list/list.component.scss
M	src/app/modules/Lease/LeaseCostSetting/components/list/list.component.ts
M	src/app/modules/Lease/LeaseCostSetting/services/leasecostsetting.service.ts
D	src/app/modules/Lease/LeaseCostSettingItem/components/details/details.component.html
D	src/app/modules/Lease/LeaseCostSettingItem/components/details/details.component.scss
D	src/app/modules/Lease/LeaseCostSettingItem/components/details/details.component.spec.ts
D	src/app/modules/Lease/LeaseCostSettingItem/components/details/details.component.ts
D	src/app/modules/Lease/LeaseCostSettingItem/components/list/list.component.html
D	src/app/modules/Lease/LeaseCostSettingItem/components/list/list.component.scss
D	src/app/modules/Lease/LeaseCostSettingItem/components/list/list.component.spec.ts
D	src/app/modules/Lease/LeaseCostSettingItem/components/list/list.component.ts
D	src/app/modules/Lease/LeaseCostSettingItem/leasecostsettingitem.routes.ts
D	src/app/modules/Lease/LeaseCostSettingItem/models/create.ts
D	src/app/modules/Lease/LeaseCostSettingItem/models/details.ts
D	src/app/modules/Lease/LeaseCostSettingItem/models/list.ts
D	src/app/modules/Lease/LeaseCostSettingItem/services/leasecostsettingitem.service.ts
M	src/app/modules/Lease/LeaseCustomerSms/components/list/list.component.html
M	src/app/modules/Lease/LeaseCustomerSms/components/list/list.component.scss
M	src/app/modules/Lease/LeaseCustomerSms/components/list/list.component.ts
M	src/app/modules/Lease/LeaseCustomerSms/services/lease-customer-sms.service.ts
M	src/app/modules/Lease/LeaseInquiry/components/details/details.component.html
M	src/app/modules/Lease/LeaseInquiry/components/details/details.component.scss
M	src/app/modules/Lease/LeaseInquiry/components/details/details.component.ts
M	src/app/modules/Lease/LeaseInquiry/components/list/list.component.html
M	src/app/modules/Lease/LeaseInquiry/components/list/list.component.scss
M	src/app/modules/Lease/LeaseInquiry/components/list/list.component.ts
M	src/app/modules/Lease/LeaseInquiry/components/logs-dialog/logs-dialog.component.html
M	src/app/modules/Lease/LeaseInquiry/components/logs-dialog/logs-dialog.component.scss
M	src/app/modules/Lease/LeaseInquiry/components/logs-dialog/logs-dialog.component.ts
M	src/app/modules/Lease/LeaseInquiry/components/stage-dialog/stage-dialog.component.html
M	src/app/modules/Lease/LeaseInquiry/components/stage-dialog/stage-dialog.component.scss
M	src/app/modules/Lease/LeaseInquiry/components/stage-dialog/stage-dialog.component.ts
M	src/app/modules/Lease/LeaseInquiry/services/leaseinquiry.service.ts
M	src/app/modules/Lease/LeaseMasterAgreement/components/details/details.component.html
M	src/app/modules/Lease/LeaseMasterAgreement/components/details/details.component.scss
M	src/app/modules/Lease/LeaseMasterAgreement/components/details/details.component.ts
M	src/app/modules/Lease/LeaseMasterAgreement/components/list/list.component.html
M	src/app/modules/Lease/LeaseMasterAgreement/components/list/list.component.scss
M	src/app/modules/Lease/LeaseMasterAgreement/components/list/list.component.ts
M	src/app/modules/Lease/LeaseMasterAgreement/services/leasemasteragreement.service.ts
M	src/app/modules/Lease/LeaseQuotation/components/details/details.component.html
M	src/app/modules/Lease/LeaseQuotation/components/details/details.component.scss
M	src/app/modules/Lease/LeaseQuotation/components/details/details.component.ts
M	src/app/modules/Lease/LeaseQuotation/components/list/list.component.html
M	src/app/modules/Lease/LeaseQuotation/components/list/list.component.scss
M	src/app/modules/Lease/LeaseQuotation/components/list/list.component.ts
M	src/app/modules/Lease/LeaseQuotation/components/master-agreement-dialog/master-agreement-dialog.component.html
M	src/app/modules/Lease/LeaseQuotation/components/master-agreement-dialog/master-agreement-dialog.component.scss
M	src/app/modules/Lease/LeaseQuotation/components/master-agreement-dialog/master-agreement-dialog.component.ts
M	src/app/modules/Lease/LeaseQuotation/components/rejection-dialog/rejection-dialog.component.html
M	src/app/modules/Lease/LeaseQuotation/components/rejection-dialog/rejection-dialog.component.scss
M	src/app/modules/Lease/LeaseQuotation/components/rejection-dialog/rejection-dialog.component.ts
M	src/app/modules/Lease/LeaseQuotation/models/details.ts
M	src/app/modules/Lease/LeaseQuotation/services/leasequotation.service.ts
M	src/app/modules/Lease/LeaseTariff/components/details/details.component.html
M	src/app/modules/Lease/LeaseTariff/components/details/details.component.scss
M	src/app/modules/Lease/LeaseTariff/components/details/details.component.ts
M	src/app/modules/Lease/LeaseTariff/components/list/list.component.html
M	src/app/modules/Lease/LeaseTariff/components/list/list.component.scss
M	src/app/modules/Lease/LeaseTariff/components/list/list.component.ts
M	src/app/modules/Lease/LeaseTariff/leasetariff.routes.ts
M	src/app/modules/Lease/LeaseTariff/services/leasetariff.service.ts
M	src/app/modules/Lease/closedLeaseAgreements/closedLeaseAgreements.routes.ts
D	src/app/modules/Lease/closedLeaseAgreements/components/details/details.component.html
D	src/app/modules/Lease/closedLeaseAgreements/components/details/details.component.scss
D	src/app/modules/Lease/closedLeaseAgreements/components/details/details.component.spec.ts
D	src/app/modules/Lease/closedLeaseAgreements/components/details/details.component.ts
D	src/app/modules/Lease/closedLeaseAgreements/components/list/list.component.html
D	src/app/modules/Lease/closedLeaseAgreements/components/list/list.component.scss
D	src/app/modules/Lease/closedLeaseAgreements/components/list/list.component.spec.ts
D	src/app/modules/Lease/closedLeaseAgreements/components/list/list.component.ts
D	src/app/modules/Lease/closedLeaseAgreements/models/create.ts
D	src/app/modules/Lease/closedLeaseAgreements/models/details.ts
D	src/app/modules/Lease/closedLeaseAgreements/models/list.ts
D	src/app/modules/Lease/closedLeaseAgreements/services/closedLeaseAgreements.service.ts
M	src/app/modules/i18n/vocabs/ar.ts
M	src/app/modules/i18n/vocabs/en.ts
M	src/app/modules/shared/service/base-service.service.ts
```

Task-owned documentation additions in `F:/My Work/Shaban Documents/Shaban`:

- `sigma-erp/ui/02-service-and-response-wrappers.md`: optional getById detail error-feedback option.
- `sigma-erp/ui/00-preamble.md`: version1.87 and this task's change summary only.
- `sigma-erp/CHANGELOG.md`: new1.87 row only.

Existing unrelated documentation edits are preserved; the repository diff includes those earlier edits and must not be committed wholesale as this task. Required local instruction digest: `F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md`, §6 inline-detail rule and its revision row. No generated packet was modified.

Local review artifacts: `LEASE_FRONTEND_CONTRACT_FREEZE.md`, this report, `Lease/ROOT_20261006_REVIEW.md`, `Lease/AGREEMENT_20261006_REVIEW.md`, `Lease/DOCUMENTS_20261006_REVIEW.md`, `Lease/SETTINGS_20261006_REVIEW.md`. The frozen handoff remains historical; implementation status and owner acceptance are reconciled in this report and the four current fragments.

## Owner compiler feedback and documentation repair — 2026-10-06

The owner subsequently supplied failed-compilation evidence. The earlier parser/path/template-name checks did not detect semantic consumer errors: three wrong FilterActionsDirective export paths; missing Agreement FieldError registration; unsupported warning StateMessageKind; a remaining informational MessageService call after its injection was removed; and unsupported DestroyRef.destroyed under installed Angular17.3.12. These are repaired in seven existing consumer files, with exact source evidence and final reconciliation in `LEASE_COMPILER_FEEDBACK_REVIEW.md`. The original contracts, backend, shared public APIs and150-file frontend inventory remain unchanged.

The owner's explicit instruction to address the cause in documentation promotes exact export/standalone registration/input/member/API checks to UI1/4/22/28 and skill§1/3.4/6/history. UI preamble/changelog are now1.88, retaining1.87 and all earlier edits. Additional documentation files for this follow-up: `sigma-erp/ui/01-feature-folders-and-wiring.md`, `sigma-erp/ui/04-filters.md`, `sigma-erp/ui/22-loading-empty-error-toast.md`, `sigma-erp/ui/28-request-cancellation-and-stale-responses.md`; earlier unrelated changes in these files remain preserved. Filter directives retain their existing owner; deferred print uses RxJS cancellation, and the existing non-API email info notice retains explicit injection. No aliases/schemas/framework upgrade are introduced.

Expanded source inspection:90 runtime TypeScript files and36 Angular templates parsed; local named exports and relevant standalone registrations/state literals checked, zero findings. Scoped frontend/documentation diff whitespace passes. Fresh successful compilation/runtime acceptance and generated recipe regeneration/semantic review remain owner-pending; no prohibited command is run. See the focused compiler-feedback report for commit suggestions and owner checks.

## LeaseInquiry inline filter actions — 2026-10-06

The owner explicitly requested LeaseInquiry buttons beside the search fields. Its existing simple four-field form now sets mainColumns=4, inlineActions=true and inlineActionCaption=general.actions on the shared FilterPanelComponent, following canonical UI4's validated inline action recipe. Projected Export/Refresh/Search use ng-container[appFilterActions], placing them alongside the shared mandatory Reset in the action flex row. The shared caption reserves label geometry; existing date-range reserved feedback retains alignment when validation appears. Create remains in the existing feature-title slot. No field, query, reset default, action handler, API, shared component or feature CSS changes.

Source acceptance: Angular template parsing succeeds; the actual shared input declarations and Inquiry standalone registrations were checked; scoped Lease diff whitespace passes. Shared narrow-screen stacking, 34px controls, theme and RTL remain owned by the panel. Owner desktop/narrow/date-validation/RTL/theme visual acceptance and compilation remain pending under the source-only execution boundary. Implementation status remains Implemented — source-only; owner verification pending: yes.

## LeaseQuotation inline filter actions — 2026-10-06

Owner follow-up: increase visible spacing between filter buttons. Before implementation, the shared action flex row in FilterPanelComponent SCSS has gap=8px; both LeaseInquiry and LeaseQuotation project buttons directly with ng-container. UI4 owns spacing. Add optional shared actionGap with default8 and select12 in these two consumers only; keep wrapping, Reset, caption alignment, height, RTL and other consumers' default spacing. This is a scoped owner preference, not a new global spacing default.

The owner extended the same placement request to LeaseQuotation. Its existing four-field list form now uses mainColumns=4, stableLayout=true, inlineActions=true and inlineActionCaption=general.actions; Export/Refresh/Search are projected through ng-container[appFilterActions] beside the shared Reset. Conformance: UI4 owns inline placement; FilterPanelComponent inputs and its shared caption/34px/narrow-screen rules supply the implementation; Workshop/Job remains the canonical base filter reference, and the owner's explicit placement selects the documented inline alternative. Create stays in the title. Fields, handlers, query/payload contracts, translations, backend and shared CSS remain unchanged.

Source reconciliation: the complete scoped template diff was reviewed, Angular template parsing and diff whitespace checks passed, actual panel inputs and standalone registrations matched. Only the frontend template and this review addendum changed for this follow-up. Phase2 presentation and focused Phase6 reconciliation apply; backend/write/action phases are unaffected. No new business decision or migration is required. Owner compilation and desktop/narrow/RTL/theme visual checks remain pending; existing generated-packet regeneration/semantic review remains pending. No subagents were used for this small sequential fix; no prohibited command ran. Suggested frontend commit: `fix(lease): align quotation filter actions with search fields`. Status remains Implemented — source-only; owner verification pending: yes.

Spacing reconciliation: shared actionGap=input(8) drives --sigma-filter-action-gap consumed by the existing action flex row; Inquiry/Quotation bind12. Source parsing passes for the shared TypeScript and both templates; scoped diff whitespace passes. UI4, skill and UI1.89 history document the reusable input while the12px preference remains feature-owned. Four frontend files changed in this follow-up (two templates and panel TS/SCSS). Shared public presentation input extended only; all business/API contracts retained. Owner compilation and desktop/narrow/RTL visual acceptance remain pending; no prohibited commands ran.

## LeaseMasterAgreement inline filter actions and spacing — 2026-10-06

Owner extends the same presentation to LeaseMasterAgreement. Source evidence before edits: five existing fields, stableLayout=true, reserved date validation, registered FilterPanel/FilterActions/FieldError, no advanced template, and a div-wrapped action group. Conformance: canonical UI4 owns placement/spacing; actual FilterPanelComponent supplies mainColumns/inlineActions/inlineActionCaption/actionGap and its shared wrapping/34px/RTL rules. Select five columns, inline caption alignment and12px action gap, and project the existing Search/Export/Refresh directly through ng-container beside shared Reset. This owner-directed presentation affects neither field/action order nor filters/defaults/handlers/API contracts. Workshop/Job remains the canonical base filter reference; the explicit owner instruction selects the shared inline alternative.

MasterAgreement reconciliation: template parsing and scoped diff whitespace pass; full template diff reviewed, actual shared inputs and standalone imports match. Date feedback stays reserved. Only the list template and this addendum changed in this follow-up; UI4 already documents the recipe. Phase2 presentation/focused Phase6 apply; backend, write and action phases are unaffected. No migrations, subagents or prohibited commands. Status: Implemented — source-only; owner verification pending: yes (compilation, desktop/narrow/RTL/theme and validation visual checks). Suggested frontend commit: fix(lease): align master agreement filter actions.
