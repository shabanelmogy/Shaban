# Companies source review and confirmed fixes — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Request | Review `src/app/modules/Customers/Companies` and correct errors |
| Application repository | `F:/My Work/Sigma/SiGmaAngularFrontEnd` |
| Backend | `F:/My Work/Sigma/SigmaBackend`, related contract evidence only |
| Handoff | `COMPANIES_SOURCE_FIXES_CONTRACT_FREEZE.md`, Frozen |
| Shared extraction plan | `COMPANIES_LOOKUP_MAINTENANCE_EVOLUTION_PLAN.md`, Frozen |

## Result and evidence boundary

Confirmed source defects are corrected in the active CompanyPartner list/editor and nested driver draft. The work preserves the existing Company API, owned-row snapshot semantics, five editor steps, list filters/sort/export, and driver upload transfer. No screenshots, video or runtime reproduction were supplied; observations are source-derived. There is no unresolved Missing/Conflicting business or API decision in the implemented slice. Build, browser and persistence acceptance remain pending.

Authority: `F:/My Work/Sigma/AGENTS.md`, Master 1/3–7, applicable UI blocks and screen 03, BE 3/7/9/14, generated phase packets and the required `sigma-screen-refactor` skill. The approved references are Job for a paged master list, IndividualPartner for a routed step editor, and VehicleService/shared EditorDialog for the nested dialog. Existing known customer backlog decisions were consulted; this task does not reopen card-data policy, old backend endpoints or unrelated feature work.

G18 ownership checks were repeated on continuation and before write phases. Companies file times matched discovery plus this task's writes. The initial `resolveListPaging` change in the Company list belonged to the owner and is retained; it is not counted as a new behavioral fix here. External Individual/report/shared-control/translation/configuration changes were preserved. Other work later adopted the new select helper; this task did not edit Individual.

## Confirmed findings and fixes

| Finding | Source evidence / effect | Implemented resolution |
|---|---|---|
| Billing can pass cleared non-null numbers | Number inputs can write null despite a nonNullable control; PartnerBillingInfo Add/Update VMs require non-null CreditPeriod, CreditLimit, CustomerWiseDiscount and both Darb surcharges | Required validators/labels; period additionally rejects fractions and values above int.MaxValue; decimal fields allow fractional input |
| Lookup failure has no recovery | Main editor required Branch failure blocks Save; driver country request runs only once; list lookup failures disable related controls/actions | Inline Retry and request guards/finalize; failures remain visible until recovery; main Save waits for lookup completion |
| Duplicate lookup error surfaces | Company list/editor show inline warnings while their ordinary select calls also invoke the global error dialog | Existing skipErrorInterceptor option on these lookup calls; mutation feedback stays interceptor-owned |
| Saved driver labels disappear | Country response replaces options, so a saved country/nationality absent from the select response has no matching label | Seed actual saved pairs and merge through shared mergeSelectOptions; incoming labels/order win and number/string IDs compare through String(id) |
| Upload can lose its owner through UI teardown | Document Remove remains available during upload; nested tab selection destroys the file field; validation-summary focus can also select a tab | Collection mutations unavailable while uploading/cleaning; shared tabs disabled; focusPath uses the same busy guard |
| Driver error summary becomes stale | Invalid fields were recomputed on Save only | Refresh on value/status/language changes with DestroyRef lifetime; Save still marks touched and validates before transfer |
| Editor wiring/readability drift | Routed editor duplicates BaseComponentService route/router/loading injections; compressed executable callbacks/if blocks conflict with Master G10 | Inherit the existing base members, explicit label/title keys, and expand affected executable blocks |
| Borrowed TRN label | Billing references StatementOfAccount's namespace | Use existing exact EN/AR `mangeDetails.trn` |

The shared extraction returns a new array without mutating inputs, inventing labels or normalizing form IDs. Fallback presentation does not bypass backend foreign-key validation. The generic shared table's editable toggle removes only its Add/Remove/action chrome; its tracked projected row templates stay rendered, so the busy gate does not itself tear down the uploading file control.

## Decisions and contracts

| Concern | Decision | Evidence |
|---|---|---|
| Shapes | Server-paged master list; routed five-step aggregate; isolated nested driver dialog | UI catalog/screen 03, live routes and components |
| Grid versus ListVM | Grid: Actions, no, companyName, contactGroup, contactNo, website, email, isInactive. ListVM: Id, No, CompanyName, ContactGroup, Phone1, Phone2, Website, Email, IsInactive, ContactGroupId | contactNo is phone1 then phone2; Id identifies actions; ContactGroupId seeds the contact-group dialog; no surplus contract member |
| Filters/paging/sort | branchId, trimmed search, agreementStatus 0/1/null; unchecked inactive is no filter, checked is true; default page 10 and maximum 100; sort allowlist from columns | Company list, toListParams, CompanyService/AgreementStatusFilter; UI 4/5/6 and BE 9 |
| Export | All pages with applied filters, same displayed columns, click-time translated headers/status; no cards | CompanyPartnerService.getAllList + fetchAllPages + dataTableExportRows; UI 8 |
| Write inputs | Existing CompanyAdd/Update payload and full owned-row snapshots, new child id 0 and saved identity retained; no server-owned/audit/calculated inputs added | companyPayload/driverPayload/shared row mappers and backend Company VMs/UpdateCoreAsync |
| Billing | Zero remains a valid default; reject null for non-null fields, negative amounts, fractional/out-of-int-range period; nullable surcharges stay nullable | PartnerBillingInfoAddVM/UpdateVM declarations and range attributes |
| Read-only/edit load | View uses saved labels without edit-only lookups; loaded snapshot required before Edit Save; failure keeps entered data | ready/detail loading/mode/form disable and shared saved-option merge |
| Delete/contact group | Existing confirmation, busy guard, both failure channels and refresh preserved; last-row delete decrements page; no new transition | CompanyController, CompanyService, CompanyPartnerService, list methods |
| Route/providers/client | `/CompanyPartner` list/create/view/edit/details alias; return query parameters preserved; root HttpClient/interceptors reused | pages/routing.ts, companypartner.routes.ts, sidebar-menu-data.ts, AppModule/LayoutModule; borrowed lookup providers present |
| Authorization | Existing AuthGuard/authenticated API; no new permission contract | Current root chain/controllers; authorization candidates remain DELETE, contact-group and billing/blacklist writes |
| Shared extraction | One pure option merge for both in-scope consumers; keep default shared UI behavior and no new CSS/component/API | Frozen maintenance plan, DropDownSelect number/string identity, actual Company/Individual saved-option logic |

## Final source conformance reconciliation

All application paths in this table are relative to `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules`.

| Concern / owning block | Actual reference producer | Shared owner | Target symbols / compared behavior | Result |
|---|---|---|---|---|
| List shell/filter/grid — UI 1/3/4/6 | Workshop/Job list template | sigma-list shell, FeatureTitle, FilterPanel, DataTable | Company list uses the same page/panel/header/table chain, title inside panel, appFilterPanel/resetRequested and fill=true; no feature stylesheet or viewport calc | Matched in source |
| Request lifetime/read state — UI 2/28 | Job.bindListQueries | list-query/list-route-state | Company.bindListRequests uses Subject → switchMap → defer; state/loader reset in finalize; filters applied on Search, current paging/sort used for requests/export | Matched; preserved owner paging fix |
| Step validation/scroll — UI 12/19/27 | Individual.goToStep/navigateToInvalidField and editor template | StepForm, ValidationSummary, invalidStepFields/focusField, editor shell | Company header/Next go through goToStep; forward validation, full Save validation, ready/busy gating, actual field IDs; body/scroll/footer chain and fill=true | Matched in source |
| Nested dialog — UI 11/13/18 | VehicleService dialog/shared EditorDialog; current DriverDraft isolation | EditorDialog/EditorTabs/DocumentUploadTracker | Driver draft maxHeight=90dvh and flex-fill form/body/scroll chain; parent commit on draft Save, transferTo(owner), discard on Cancel; tab click/keyboard and summary navigation busy-gated | Matched in source; visual acceptance pending |
| Rows/documents/cards — UI 14/17/18 | shared EditableRows, partner-editor-forms, FileField | typed row factories/mappers and DatePickerDirective | Company/Driver use DocumentRow/numeric wire enum/CustomerDocuments, required issue/expiry and order, dateInputMask; documents editable requires idle tracker; saved original paths cover whole removed driver rows | Matched; no second upload framework |
| Lookups/labels/errors — UI 15/16/22/23 | Individual saved selections; inherited select service option | mergeSelectOptions, TranslateOptionsPipe, apiErrorMessage | Company.mergeSavedOption/loadLookups and Driver.loadLookups preserve real selected pairs; incoming-first order and String(id) deduplication; View no lookup; inline retries share one feedback owner | Matched in source |
| Write/reconciliation — BE 3/14 | CompanyService.UpdateCoreAsync | tracked snapshot/reconcile helpers | frontend full payload mirrors existing Company inputs; backend validates child ownership before mapping and reconciles driver grandchildren; unchanged by task | Contract retained |

## Files changed by this task

Under `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner`:

- `components/details/details.component.ts` and `.html`: base wiring, saved-option reuse, lookup recovery/loading and Save gate, explicit titles, executable formatting.
- `components/list/list.component.ts` and `.html`: inline lookup ownership/retry/loading, executable formatting. Existing resolveListPaging behavior retained.
- `components/detalisForm/billing-info/billing-info.component.html`: required numeric presentation, integer/decimal steps, neutral TRN key and indentation.
- `components/detalisForm/documents/documents.component.html`: idle-tracker collection mutation gate.
- `components/detalisForm/drivers/driver-draft.component.ts`: live validation summary and executable formatting.
- `components/detalisForm/drivers/driver-fields.component.ts` and `.html`: saved country options, lookup recovery, explicit labels, tab/focus busy gates.
- `utils/company-form.ts`: billing validators.

New shared application file: `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/utils/select-options.ts`.

Instruction-layer promotion (required by the extraction learning protocol): `F:/My Work/Shaban Documents/Shaban/sigma-erp/ui/16-dropdowns-lookups-enums.md`, `ui/18-documents-and-upload.md`, `ui/00-preamble.md`, `CHANGELOG.md` (Companies version 1.44 row), plus `F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md` sections 6/10/history. Later external version 1.45 and other documentation rows are preserved. Generated packets were not edited by hand.

Review artifacts: the two Frozen files above and this report, under `F:/My Work/Sigma/reviews`.

## Phases, backend and migration

| Phase | Applied work / boundary |
|---|---|
| PLAN-00 | Small shared lookup-maintenance plan Frozen before extraction; no new business feature |
| 0–1 | Scoped discovery, authority/reference selection, existing domain/read/write/action/integration contract freeze |
| 2 | List read/export/action source audit plus lookup recovery; no read DTO/query redesign |
| 3 | Company billing/editor/driver/document confirmed fixes |
| 4 | Existing delete/contact-group action cycle inspected; no new domain transition to implement |
| 5 | Imports, injected providers, root HTTP chain, mode and route return wiring inspected |
| 6 | Complete scoped application diff reviewed, contract/reference reconciliation, source-only checks and report |

Backend source, AutoMapper, entities/EF, calculation ownership and API contracts are unchanged by this task. Company remains backend Pattern 2; financial calculations/posting are not introduced. No schema change or migration is needed; the owner does not need Add-Migration for these fixes. No migration or snapshot file was modified.

Suggested commits only:

- Frontend: `fix(customers): recover company lookups and guard driver uploads and billing inputs`
- Documentation repository: `docs(sigma): record saved lookup merging and upload navigation guards`
- Backend: no commit for this task.

Instruction/review files outside the repositories remain local records under the current AGENTS artifact ownership rule.

## Verification and owner acceptance

Source checks passed: complete scoped frontend diffs reviewed; `git diff --check` for Companies has no whitespace errors; no conflict markers; new helper inspected; directly related imports/signatures/providers and root wiring checked. New code uses the supported ES2018 language APIs and introduces no any typing, feature HttpClient, legacy ms-lib or feature styles.

`Check-Translations.ps1 -Block companyForm,companyPartners,partnerForm,validationMessages`: 215 EN / 215 AR keys, zero missing and zero case differences. Exact literal/prefix audit of Companies source: 194 entries resolve in both dictionaries, including case-sensitive mangeDetails.trn; all 65 enum-derived labels resolve in both dictionaries too. Unrelated historic mangeDetails parity debt is not bulk-edited. `Check-BookReferences.ps1`: every checked reference resolves. `Generate-SigmaRecipes.ps1 -Check`: all eight packets OK. These are documentation/source checks, not application tests.

Owner checks still required:

1. Build/type/template-check the frontend with the owner's normal workflow; no compilation was executed here.
2. Create/Edit/View a Company, traverse five steps, return to restored list filters/page, and confirm normal Save/error recovery.
3. Clear each required billing number, enter a fractional/oversized CreditPeriod, and then restore valid zero/decimal values; invalid values must block Save and focus their fields.
4. Fail/delay each lookup, verify one inline warning, guard repeated Retry, recover successfully, and keep an existing nationality/country absent from the option response visibly selected. View must not request edit-only options.
5. Start overlapping Company/Driver document uploads; Add/Remove, driver tabs, error-summary tab navigation, Save/Close must respect busy state. Then correct a driver field/change language and confirm its summary refreshes. Check commit/cancel and failed-cleanup Retry without repeating aggregate Save.
6. Confirm paging/page-size/sort/export with applied filters, all/inactive checkbox semantics, contact-group success/failure, agreement history and dependency-blocked/last-row delete.
7. Inspect responsive/RTL/light/dark editor/dialog/table rendering and internal scroll behavior, including the document action column while busy.

The remaining material limitation is unexecuted compilation/runtime/persistence verification, including the integration of concurrent external shared changes. The report does not claim visual or database acceptance.

Agent utilization: one bounded read-only `luna_explorer` on `gpt-5.6-luna` was dispatched after freeze for list/model/service/routes/API evidence, with no write ownership. This was the smallest independent parallel audit expected to reduce wall time/cost. It could not start because its usage allowance was exhausted, returned no usable work and made no edits; root performed the complete audit, implementation and reconciliation.

No build, test, lint, migration, database command, browser automation/application run, Graphify, Sigma MCP, commit, push or deployment was executed. No persistent Git configuration was changed.
