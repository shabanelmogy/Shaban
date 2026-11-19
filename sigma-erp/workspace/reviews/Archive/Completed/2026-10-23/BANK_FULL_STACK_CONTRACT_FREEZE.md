| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-05 |

# Bank full-stack handoff

Decision authority and schema/rollout choices: BANK_MAINTENANCE_EVOLUTION_PLAN.md. Root owns contracts; backend and frontend may implement in independent files after this freeze.

## Endpoints

| Operation | Method/route | Contract |
|---|---|---|
| List | GET /Bank | Results<BankListVM>; pageNo/pageSize; Filters[search], Filters[sortField], Filters[sortOrder]; search Name/LocalizedName/AccountNo/TRN; base clamp1–100/count/tie-break |
| Detail | GET /Bank/GetByWithNavigationsId/{id} | Result<BankDetailVM> |
| Create | POST /Bank | BankAddVM -> Result; atomic bank + LinkAccounts stub |
| Update | PUT /Bank | BankUpdateVM -> Result; tracked change-only save |
| Delete | DELETE /Bank?id={id} | Result; EF usages + linked/legacy GL blockers; unconfigured stub and bank soft-delete together |
| Activate | POST /Bank/handleActivate | {ids:number[], isActive:boolean} -> Result; inherited live/tenant validation |
| Currency choices | GET /Currency/GetSelect | Results<{id:number|string,value:string}> from existing owner |
| Cheque settings read | GET /Bank/{id}/ChequePrintingSettings | Result<BankChequePrintingSettingsVM> |
| Cheque settings write | PUT /Bank/{id}/ChequePrintingSettings | BankChequePrintingSettingsVM -> Result; route owns bank identity, no body id/tenant |

## Grid and response scope

Actions first; typed business fields in order: name(text), accountNo(text), trn(text), isActive(status). Id is action identity only. Backend list: Id, Name, AccountNo, TRN, IsActive. Remove inherited tenant/audit/No/GUID/valid/change fields and editor-only LocalizedName from list after targeted consumer search. Existing BankFullListVM remains compatibility-only unless proven dead. Default page15, choices10/15/20/50/100, default id descending, sort only stored displayed fields. Search/Reset apply text trimmed; paging/actions/export use applied search, not unsaved filter changes. Empty string omitted; no date/boolean/multi-select filter invented. Export fetchAllPages with max100 request size, all displayed columns and current-language headers/status; fail whole output on any page failure.

## Detail and write

Detail fields: Id:number, Name:string, LocalizedName:string?, AccountNo:string?, TRN:string?, CurrencyId:int?, CurrencyName:string?. Name required/max100; other bank strings optional/max100. Add carries these editable strings and CurrencyId only; Update adds Id. CurrencyName is read-only and omitted from writes. Checkbox is UI-only and derives from CurrencyId; checked requires positive currency selection; unchecked sends null. Currency FK tenant/live existence validated server-side. No subscription/audit/active/calculated fields in write forms. Currency is descriptive account metadata and never drives conversion, balances, or ledger writes in this scope.

Cheque DTO fields (all nullable): ChequeWidth, ChequeHeight, DateMarginLeft, DateMarginTop, PayToMarginLeft, PayToMarginTop, AmountMarginLeft, AmountMarginTop, AmountInWordsMarginLeft, AmountInWordsMarginTop, FontSize (decimal; 0..9999.99; persisted18,2), FontColor (string #RRGGBB max7). Transport uses camelCase. No identity/tenant/audit in settings body. Save settings changes these fields only; bank editor does not carry them. Null stays null; no fabricated default values. AutoMapper directional maps only; settings maps are feature-specific additional maps, no ReverseMap or defensive Ignore chains. Decimal rounding at save is configuration precision only, no financial calculation.

## Action and route contracts

| Action | Source -> target | UI/endpoint | Dependency, recovery and refresh |
|---|---|---|---|
| View/Edit/Create | same live record/new record | one bank EditorDialog with explicit mode | edit requires loaded detail; Save hidden in View; failure keeps draft, Retry detail; success closes and refreshes applied page |
| Cheque settings | live record -> same record configuration | typed edit dialog and dedicated GET/PUT | loaded snapshot required; own dirty-close; failure retains data; no bank-name overwrite |
| Delete | live unreferenced/unlinked -> soft-deleted | shared confirmDelete / DELETE | confirmation and execution reject repeats; reference failure leaves list; last row deletion moves back page |
| Activate/deactivate | IsActive != true -> true / true -> false | shared confirmation / handleActivate | no invented role restrictions; referenced deactivation allowed per BE12; refresh same applied page |
| Discard | dirty edit -> closed | shared confirmDiscard | all X/Cancel/Escape through requestClose; lock Save/Edit/close during confirmation |

List route /Bank only; remove obsolete Bank/create and Bank/details/:id after consumer search. Parent owns modal visibility and record; close+saved event refresh. Root services use environment.baseUrl and the existing root interceptor-equipped HttpClient. Existing LayoutModule BankService provider is a directly related redundant provider to remove, preserving peer edits. Errors: inline list/detail/lookup/settings reads use X-Skip-Error-Interceptor + apiErrorMessage; standard mutations use interceptor feedback once; preserve draft on both failure channels. finalize releases local/global loaders; switchMap cancels list queries; unmounted dialogs cancel reads and verify identity.

## Overrides and reference action coverage

Backend SearchColumns/UniqueColumns declarations: supported. Add override justified by two saves and LinkAccounts stub; must call InvalidInputAsync and roll back failure. UpdateCore override justified by independent settings/activation preservation; no redundant UpdateAsync. Remove override justified by polymorphic mappings and usage helper. Other CRUD, list, select and activation inherited. Reference Job close/labour time/invoice/gate-pass actions: Not Applicable because Bank has no job state/children/invoice source; View/Edit/Delete supported. No posting/approval actions for Bank metadata. Authorization candidates: create/update/delete/activation/settings endpoints; AuthGuard + API Authorize and tenant checks only, no permission system invented.

## Reference conformance before edits

| Concern | Book | Actual reference/shared owner | Target decision |
|---|---|---|---|
| Layout/title | UI1/3 | Job list section.sigma-list-page, header FeatureTitle; styles.scss | Bank list same host/fill/shared shell, no local stylesheet |
| Filter | UI4 | Job form[appFilterPanel]; FilterPanelComponent stableLayout/control34px/Reset | Bank single search, stable=true/mainColumns1/inlineActions, shared Reset |
| Table/paging | UI5/6/28 | Job.bindListQueries; DataTableComponent fill and default page helper | typed Bank columns; switchMap/defer/finalize; base count, resolveListPaging |
| Modal/body/footer | UI13/15 | VehicleService details and EditorDialogComponent contentPadded/controlled outputs | Bank and settings small fields-only modals; public width680px/height560px; shared header/footer; one sigma-editor-scroll |
| Validation/discard | UI10/19/27 | FieldErrorComponent, ConfirmationDialogService presets, focusField | typed forms, explicit labels/specs and shared failure/confirmation owners |
| Backend | BE3/4/8/13 | BranchService; Service.InvalidInputAsync/RemoveWithChildrenAsync | normal entity with documented multi-save/poly-link exceptions; preserve one record identity |

Implementation must reconcile actual target symbols against these values; runtime/visual acceptance remains pending.

## Read-path amendment: list projection (2026-10-06)

The reported GET /Bank 500 prompted source tracing. The inherited MaterializeListAsync materializes every Bank scalar before mapping, although the frozen list requires only five fields. Bank now owns a feature-specific MaterializeListAsync override using ProjectTo<BankListVM> after the inherited filters/order/paging. This keeps list reads limited to Id/Name/AccountNo/TRN/IsActive and does not read editor/settings-only columns. The response, filtering, count, tenancy and sorting contracts do not change. Governing evidence: BE7/13 and actual Service.MaterializeListAsync; this projection exception replaces the earlier decision to inherit that hook. New schema is still required for currency/settings and full Bank writes; this is not a migration substitute. Runtime cause remains unconfirmed until Response/server exception is available.

## Owner-requested amendment: compact Create dialog

The later user instruction to reduce unused height in the new-bank screen supersedes the original shared 560px height for Create only. Bank Create now passes height440px through EditorDialog's public input; Edit/View and cheque settings retain height560px. Width680px, padded content, shared header/footer, fields, validation and internal body scroll remain as frozen. This is an authorized presentation-only change; no API or business contract changes.
