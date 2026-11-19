# Lease documents frontend follow-up — 2026-10-09

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Scope: LeaseInquiry, LeaseQuotation and LeaseMasterAgreement frontend only. Implements confirmed follow-up defects under LEASE_FRONTEND_FOLLOWUP_CONTRACT_FREEZE.md; existing historical contracts remain unchanged. No screenshots supplied. Recipe check is root-owned; stale Phase3 uses canonical books. Backend is read-only. Authentication remains AuthGuard; no authorization API is introduced.

## Before-edit conformance evidence

| Concern | Owning block | Actual reference/symbol | Shared owner | Target comparison before edits |
|---|---|---|---|---|
| Lists, filters, paging | UI1/4/6/28 | Workshop/Job/components/list/list.component.html and bindListQueries | FilterPanel, DataTable, list-route-state, resolveListPaging | Inquiry/Quotation/Master use container-fill list shell, fixed titles/filter strip, fill table and switchMap requests. Existing columns/filter keys/applied snapshots retained. |
| Modal composition and action headers | UI13/19/22 | shared/components/editor-dialog/editor-dialog.component.ts; Workshop/Job/components/close-job | EditorDialog, FieldError, StateMessage | Inquiry and stage/rejection/master dialogs use controlled visible, translated title and separate record subtitle, contentPadded=true, shared feedback. |
| Routed document exit | UI10/13 | Workshop/Job/components/editor/editor.component.ts requestClose/canDeactivate/saveCompleted | Router CanDeactivateFn, ConfirmationDialog, freezeFormState | Quotation Cancel prompts locally, but routes lack CanDeactivate, so external navigation can discard without confirmation. Replace with one deferred route decision, freeze controls and allow successful Save. |
| Pending modal discard | UI10/28 | canonical UI10 pending decision; shared/utils/form-state.ts freezeFormState | ConfirmationDialog, freezeFormState | Inquiry/stage/rejection/master pending signals gate buttons but leave reactive controls live. Add snapshot freeze and editor identity/visibility checks. |
| Editable rows | UI14/10 | Job editor childRows/rowsOf; shared/utils/editable-rows.ts | EditableRows | Inquiry/Quotation retain typed arrays, parent dirty ownership and same-row checks; adopt root-owned opt-in freezeParentOnConfirmation=true. |
| Saved picker dates | UI17 | Fleet/Vehicle fillForm partnerPickerDate; date-utils.ts toPickerDate | toPickerDate, parseDateValue | Inquiry/Quotation/default master dates and Inquiry/Master restored ranges use local copies. Replace with validated local Date hydration. Quotation backend DateTime rate values remain preserved verbatim when untouched. |

## Frozen implementation decisions

- Keep existing fields, endpoint shapes, business eligibility, approval/rejection behavior, child snapshots and server calculations. Changes affect control/exit lifecycle and calendar hydration only.
- Capture Inquiry context with requestSequence/id/mode; action dialogs capture opening context. A stale confirmation cannot close or enable a replacement editor. Rejection input updates must not enable a pending form.
- Quotation cancel navigates once and lets the route guard own the decision. Guard confirmation is created only on subscription; duplicate/stale/busy decisions return false. Successful Save sets saveCompleted before navigation.
- Use shared snapshot restoration, retaining intentional disabled state and destruction cancellation. Row confirmations adopt the shared opt-in; no local form traversal is added.
- Source-only verification. Builds/tests/lint/browser/database/migrations/commits/push/deployment remain owner-pending/prohibited.

## Reconciliation

| Concern | Final source evidence | Outcome |
|---|---|---|
| Inquiry discard | details.requestClose captures requestSequence/id/currentMode; stage.close captures editorSequence/id; defer starts confirmation and freezeFormState; visibility/busy/identity gates protect close/restoration | Source matched UI10; Cancel keeps values and dirty state. |
| Quotation routed exit | leasequotation.routes canLeaveQuotation on create/view/edit/details; details.cancel only navigates; canDeactivate defers confirmation and rechecks captured quotation/mode; save sets saveCompleted before finish | Source matched UI10; one owner for Back/Cancel/external route navigation; successful Save bypasses discard. |
| Nested discard | Rejection.close and MasterAgreementDialog.close defer/freeze controls and capture opening context; rejection.ngOnChanges does not enable a pending current form; master hiding invalidates requestSequence | Source matched UI10/28; old result cannot close or restore replacement editor. |
| Row removal | Inquiry.itemRows and Quotation.itemRows pass freezeParentOnConfirmation=true to root-owned EditableRows | Existing same-row/mutation gates and complete snapshots retained; shared restoration final audit belongs to root. |
| Calendar hydration | Inquiry.patchDetails.date; Inquiry/Master list.restoreRouteState endpoints; Quotation loadQuotation/createItem; master-dialog loadQuotation default start/end all call toPickerDate | Saved picker values are actual validated local Dates. Only new Date() current-date defaults remain. Quotation.toUpdateItem still copies untouched saved rate strings exactly. |
| Enum labels | Inquiry list/stage, Quotation two approval filters and Master approval filter use TranslateOptionsPipe, standalone imports and key/value descriptors | UI16 shared owner reused; numeric enum values and existing EN/AR keys preserved. Five duplicate item/selectedItem template pairs removed. |
| Safe lookup failures | Inquiry.loadLookups catches preserve apiErrorMessage and first failed result message; list.loadCustomers preserves declared message; feature services use X-Skip-Error-Interceptor | Both failure channels have one inline owner; View does not expose edit-only lookup warning. Retry handlers/buttons honor pending discard/removal gates. |
| Services and typed contracts | All three services providedIn:'root', typed Results/Result; no feature HttpClient provision; installed @angular/router declaration exports CanDeactivateFn | No service/provider/DTO/schema change; root owns LayoutModule integration. |

## Grid/filter and write contracts retained

| Screen | Displayed grid columns | Frontend List DTO properties | Filters |
|---|---|---|---|
| Inquiry | no, date, customerName, customerCode, salePersonName, leaseInquiryStage | id, no, date, customerName, customerCode, salePersonName, leaseInquiryStage, optional leaseInquiryStageText (existing server text remains unused by displayed enum label) | no, dateFrom/dateTo, stage, customerId |
| Quotation | no, date, customerName, customerCode, internalApproval, customerApproval | id, no, date, customerId, customerName, customerCode, internalApproval, customerApproval, canEdit/canDelete/canApproveInternally/canRejectInternally/canApproveByCustomer/canRejectByCustomer/canRevise/canUnapprove/canCreateMasterAgreement | quotationNo, customerId, internalApproval, customerApproval; existing dateFrom/dateTo sent null |
| Master | no (approval badge in number template), date, customerName, customerCode, quotationNo | id, no, date, approvalStatus, customerName, customerCode, quotationNo, canApprove | masterAgreementNo, approvalStatus, quotationRefNo, fromDate/toDate, customerId |

Existing backend list/detail projections are retained by the frozen frontend boundary. No broadening or invented fields. Inquiry inputs: date, salePersonId, customerId, optional contactPersonId and item makeAndModelId/vehicleTypeId/quantity/periodYears plus retained update identities. Quotation inputs: date, customerId, contactPersonId, notes and item carModelId/vehicleTypeId/units/five nullable rate fields plus retained update identities. Master creation remains the quotation action with startDate/endDate/customerId/quotationId/notes. Master View remains read-only; approval remains its list action. No server-owned number, tenant, flags or calculated totals added to requests.

Backend read evidence: SiGma.ViewModels/ViewModels/LeaseQuotationItem/{LeaseQuotationItemAddVm,LeaseQuotationItemDetailVm}.cs confirms all five rate fields are nullable DateTime, not numeric prices. Inquiry Add and Master Detail fields match their frontend contracts. LeaseInquiryController confirms ChangeStage/GetLogs; LeaseQuotationController confirms six existing transition routes; LeaseMasterAgreementController confirms approve. Backend/mapping/calculation source unchanged; no migration required by this work.

## Coverage and verification limits

Owned runtime source inventory reviewed: all three routes/services/models and their list/detail templates; Inquiry stage/logs dialogs; Quotation rejection/master dialogs. Spec files were not executed or modified. Master View deferred print uses timer(0) with takeUntilDestroyed; detail print still requires loaded detail/readiness. List streams retain switchMap/defer/finalize and applied filters; return state remains query parameters. Shared shell, fixed title/footer and internal scrolling remain unchanged. No new missing business decision or material contract conflict was found in the owned slice.

Frontend source edits: Inquiry details TS/HTML, list TS/HTML, stage TS/HTML; Quotation details TS/HTML, list TS/HTML, rejection TS, master-dialog TS, routes; Master list TS/HTML (15 files). Complete owned diff inspected in F:/My Work/Sigma/SiGmaAngularFrontEnd with per-command safe.directory override; git diff --check found no whitespace errors. Shared capability exports/public contracts and standalone pipe imports inspected directly. This is not compilation or runtime acceptance.

Phases2/3 and existing action-presentation Phase4 applied; Phase5 route guard integration applied within owned routes. Root owns full Phase5 guide/provider integration and Phase6 final reconciliation. No backend implementation/migrations needed. Shared pieces reused: freezeFormState, EditableRows opt-in, toPickerDate, TranslateOptionsPipe and apiErrorMessage; no feature utility owner or duplicated control traversal introduced. Authorization candidates remain deferred under UI26/backlog20.

Owner checks pending: Create/Edit dirty external navigation and Back/Cancel (one prompt); Cancel confirmation retains values/dirty state and restores editable controls; row removal pending locks all inputs; current/hidden/reopened dialog identity; successful Save exits without prompt; failure retains values and allows Retry; saved/default dates and restored filters keep calendar day; untouched Quotation rate strings retain precision; EN/AR dropdown labels update; narrow/RTL/light/dark/print interaction. Root owns the Lease UserGuide handoff.

Suggested frontend commit message: `fix(lease): protect document discard decisions and reuse picker hydration` (suggestion only).

No builds, tests, lint, browser/runtime verification, database commands, migrations, snapshots, commits, pushes or deployments were run. All peer/user changes preserved; writes confined to owned feature directories and this review fragment.
