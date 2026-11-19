# Bills — saved installments action

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-20 |

## Scope and evidence

Owner requests an Installments action when a saved Bill has installments. Screenshots a/b/c prove a saved-loan window, schedule statuses, Overall/Paid/Due summary and downstream Pay, asset detail, settlement and restructuring actions. They do not specify payment postings, interest accounts, asset/principal attribution or restructure accounting. Current LoanEMI has Date/EMI/Interest/Principal/Status and plan FK only; no Payment/PV link. PaymentService has no installment writer. Therefore the independently executable slice is a saved, read-only installment viewer; payment/settlement/restructuring effects remain outside this frozen slice pending the exact financial contract. No no-op or disabled future buttons.

## Frozen read contract

- Reuse GET Bill/{billId:int}/loan-payment-plan, typed Result<LoanPaymentPlanDetailVM>. Enrich that existing read VM with billNo:string?, billDate:DateTime?, supplierName:string?, isVoided:bool. Existing billId, terms, account names, loanEMIs and footerSummary remain.
- BillListVM and BillDetailVM add only canViewInstallments:bool. True only when an actual same-tenant, nondeleted Bill-owned plan has at least one same-tenant nondeleted owned installment. This is a historical read: no approval/IsLoan/void exclusion. Deleted/cross-tenant children never establish visibility or leak into the read. The endpoint rechecks actual ownership and availability; stale/no-plan fails safely.
- Existing tenant-filtered repository queries; no arbitrary planId or payment supplied by client. Query only necessary saved fields, no Save, no preview/recalculation, no model or schema change. Supplier/account labels require live same-tenant lookup ownership.
- Return live owned rows in Date/Id order. Status remains persisted Paid=0/Unpaid=1; unknown numeric values render Unknown. No frontend inference from Bill allocation or settlement.
- Replace the legacy hardcoded zero Paid summary: derive overall/paid/due principal and interest from valid saved live rows and their persisted statuses; gross is principal+interest. If rows contain unknown status, invalid monetary decomposition/nonpositive EMI, or totals conflict with available persisted header totals, footerSummary is null. Do not fabricate paid amounts, change rows, repair history or call a payment paid based on allocation. Missing header values remain null. Summary is a read of the existing all-or-nothing persisted status; no partial-payment support is implied.

## Frozen UI contract and conformance

| Concern | Owner | Actual reference/shared symbol | Target |
|---|---|---|---|
| Financial parent | BE15; UI screen08 | InvoiceService financial boundary; existing BillService | Existing Bill lifecycle unchanged; read only |
| Child dialog | UI13 controlled composition | EditorDialogComponent title/subtitle, mode=view, contentPadded, fixed height | Screen title plus separate Bill identifier, Close only |
| Read rows/status | UI6/7 | DataTableComponent public fill/status/number/money/date columns | SR/date/EMI/interest/principal/status; local paging/internal row scroll |
| Layout | UI1/13 | Existing shared sigma-editor-form/body/pane/scroll owners; existing loan-plan placement | Narrow terms pane plus wide saved schedule; responsive stacking; no duplicated tab title |
| Summary | UI24 | SummaryCardsComponent slim or DataTable read summary | Overall/Paid/Due with principal/interest/gross, server values only |
| Read lifecycle | UI22/28 | LoadingService + apiErrorMessage + takeUntilDestroyed | paired finalize, both Result/HTTP failures, retry, stale/cancel/destroy guards |

One new standalone BillInstallmentsComponent reused from list and saved View header. Action visible only by canViewInstallments; parent busy/navigation gates include the child; no unsaved editor action. No confirmation on opening/closing a read. Existing draft loan preparation remains distinct and unchanged. Explicit tsconfig runtime registration; bilingual keys and existing Bills guide updated by root.

## Implementation ownership and verification

Screenshot-field reconciliation: Financing Type and Payment Plan Type labels are preserved as read-only blank/em-dash values because the persisted model has neither. Do not label a historical payment method Monthly merely because draft schedule preparation uses a monthly cadence; the screenshot's Direct Debit is not that cadence. No fake lookup, DTO value, guessed historical default or editable financial method is introduced. This is a reviewer decision under Master2's owner-standing missing-detail rule, preserving explicit labels with no invented data.

After freeze, backend worker owns Bill service read/lifecycle flags, Bill/loan detail VMs/profile and necessary localized read errors. Frontend worker owns new installments component/model, Bill service method/list+details integration and tsconfig registration. Root owns translations, guide, this contract/review, cross-layer integration and final source diff. No overlapping edits.

Phases 0/1 discovery+freeze; 2 action flag; 3 saved read/dialog; 5 integration; 6 source reconciliation. Phase4 payment mutations are not authorized by this read contract. Recipe initial all8 checks passed. No migration/snapshot/DB/build/test/lint/browser/commit/push/deploy. Owner compilation/runtime/visual verification pending.
