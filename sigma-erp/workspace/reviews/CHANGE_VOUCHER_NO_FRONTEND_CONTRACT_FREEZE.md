| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Change Voucher No — safe frontend handoff

## Scope and evidence

Owner requested review and confirmed fixes for `Administration/changeVoucherNo` against the documentation, with screenshot E1. On discovering missing persistence, the owner replied: «شوف الانسب الللى ميعملش مشاكل». This authorizes conservative source-supported choices, not an invented accounting transition. This handoff freezes presentation, local draft and navigation only. It does not freeze or authorize a backend renumbering contract.

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Backend inspected read-only: `F:/My Work/Sigma/SigmaBackend`. Existing source modifications include the target button's `bi bi-check2-circle`, toolbar, vocabularies and Administration guide; retain their intent and all unrelated changes.

Canonical authority: Master 2/4/5/7; UI 1/3/10/13/16/19/22–29; backend 3/5/8/15. Recipe `-Check` passed for all eight packets. Applicable packets: phases 00, 01, 03, 04 (blocked persistence), 05 and 06. No Maintenance/Evolution implementation is introduced: business expansion remains blocked; this pass fixes confirmed frontend defects only.

## Frozen decisions

| Concern | Decision | Evidence/status |
|---|---|---|
| Shape | Small action input workspace; keep its independent `/ChangeVoucherNo` route and use the shared routed editor shell | UI1 exception: this action has no parent list or selected record; opening an automatic modal over an empty route adds no workflow. UI09 reference `Workshop/Job/components/close-job` owns typed action controls/discard, not this feature's business state |
| Fields | `voucherType: VoucherTypeEnum \| null`, `currentVoucherNo: string`, `newVoucherNo: string`; local draft only | Existing controls; E1; keep leading zeros and prefixes; not an Add/Update DTO |
| Types | Retain the seven existing enum values and explicit typed translation keys | Existing string enum `Receipt`, `Payment`, `JournalVoucher`, `CreditNote`, `DebitNote`, `PurchaseOrder`, `SalesInvoice`; no backend ID mapping is asserted. Current numeric-only `enumOptions` would turn these string values into NaN, so use an explicit keyed option inventory and TranslateOptionsPipe |
| Validation | All three inputs are structurally necessary; required field feedback through FieldError | Low-risk reviewer decision. Do not invent server lengths, uniqueness checks, formats or accounting eligibility |
| Change action | Keep the visible Change control disabled and explain the unavailable operation inline | Current `save()` only logs; no renumber endpoint/service/request found. No HTTP write, mutation confirmation or success feedback is simulated |
| Reset/navigation | Shared deferred discard confirmation freezes the draft; cancel preserves it; pristine navigation is silent | UI10 and shared `freezeFormState`; retain mock pending gate |
| Presentation | FeatureTitle, FormSection, PrimaryActionButton, shared `sigma-editor-*` and `sigma-field` | No feature CSS, custom palette or cloned cards; fixed title/footer, one internal form scroll |
| Mock assistance | Keep existing `appMockData`; generated values remain local and cannot persist | Existing owner adoption; exclude submission entirely; do not imply a generated current number identifies a real voucher |
| Authorization | Existing AuthGuard only; no new permission API | UI26; disabled action represents missing implementation, not security |
| Guide | Add unavailable Change Voucher No topic to existing Administration guide | Master7; content will match final source, existing reader/menu reused |

## Blocked backend handoff

`EntityBase.No` is system-owned. InvoiceBase/Receipt/Payment/Bill/CreditNote/DebitNote/CardTransactionBankTransfer carry JournalVoucherId. JournalVoucher has IsGenerated/IsPosted/IsVoided/ApprovalStatus and allocation protection. AccountingPeriodService checks open fiscal years and months. GRN has no equivalent confirmed approval/posting state on its header. These sources establish why general renumbering cannot be implemented as a scalar CRUD Update.

Search evidence: no `change.?voucher`, `change.?no`, `renumber`, `currentVoucherNo`, `newVoucherNo`, `currentNo` or `newNo` action in ServerAPI/Controller and directly relevant voucher service/interface sources. ChangeRequestModel and ChangeDescriptionModel are unrelated CRUD models. PurchaseOrderService has no renumber action. Current frontend has no request service or response handling.

Still required before a financial write: exact supported entities (including what “Invoice” means), enum wire values, eligible states, source/journal number propagation, textual reference handling, uniqueness/generation collision rules, concurrency and audit contract, and treatment of closed periods. Conservative owner reply is recorded; these material contracts remain Missing/Uncertain under AGENTS.md. No guessed API is created.

## Conformance gate before edits

| Concern | Book | Actual reference/shared symbol read | Target plan |
|---|---|---|---|
| Container and scroll | UI1 | `Workshop/Job/components/editor/editor.component.html`; `src/styles.scss` sigma-editor-page/panel/form/body/scroll/footer | Same shared chain; three field tracks, shared responsive reductions |
| Title | UI3 | FeatureTitleComponent title/subtitle/icon; toolbar showPageTitle | One title inside panel; scoped toolbar exclusion |
| Controls | UI16/19 | DropdownModule inputId/options/optionValue; TranslateOptionsPipe; FieldErrorComponent control/reserveMessage | Explicit string values, body overlay, actual labels and reserved feedback |
| Action | UI24 | PrimaryActionButtonComponent disabled/type/icon | Change unavailable; preserve existing check icon; no request |
| Draft discard | UI10/28 | ConfirmationDialogService.confirmDiscard; freezeFormState; close-job requestClose | Deferred route/reset decision, teardown and restored draft |
| Form sections/mock | UI13 | FormSectionComponent title/icon/density; MockDataFormComponent.isPending | Existing shared owners only |

Grid/ListVM/filter/paging/export, Detail read, mapping, domain calculations and migration: Not Applicable to this local frontend handoff. Backend source remains unchanged.

## Owner amendment — temporary sidebar removal

After freezing the local frontend handoff, the owner requested: «واحذف القائمة حاليا من sidebar». Remove only the Change Voucher No navigation entry from `sidebar-menu-data.ts`, preserving the authenticated route and the module guide. Update the guide to identify the temporarily removed entry and the direct route. This is an explicit temporary navigation change, not a permission policy, route retirement or authorization to delete the feature. The original route decision remains the historical record; this amendment owns current sidebar behavior.
