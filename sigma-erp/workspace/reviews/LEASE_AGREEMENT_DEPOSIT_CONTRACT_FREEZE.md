# Lease Agreement Deposit — Feature Review Manifest and Contract Freeze

Date: 2026-08-22  
Scope: Lease Agreement list action, Lease Deposit create dialog, and the atomic
Receipt / Journal Voucher / Customer Deposit write path.

## Authority and packet status

- Canonical authority: `SIGMA_FEATURE_REVIEW_MASTER.md`, UI blocks 7, 13, 16,
  17, 19, 22, 23, 25, 27, and 28, and backend Pattern 3 with validation and
  transaction guidance.
- `Generate-SigmaRecipes.ps1 -Check` reports generated packets 00–06 as stale.
  Canonical sources own this implementation; generated packets require
  regeneration and semantic review.
- `5.PNG` is functional/content evidence only.

## Functional evidence classification

| Evidence | Classification | Frozen implication |
|---|---|---|
| Deposit action requested on Lease Agreement | Confirmed | Add a translated action-menu row identified by agreement `id`; opening the dialog is not a mutation. |
| `5.PNG`: Date, Branch, Amount, Currency Code, Amount In Words, Type | Confirmed content | The canonical dialog exposes typed controls; Currency is read-only AED and Type is implemented as the receipt-compatible Payment Method. |
| `5.PNG`: hold days, Notes, Additional Notes | Confirmed content | Hold days is an integer from 0; notes are bounded optional inputs. |
| `5.PNG`: Documents Add | Confirmed workflow | The dialog supports typed document-path rows populated through the existing Receipt document upload channel. |
| Owner follow-up: move Documents to a tab | Confirmed layout contract | Use canonical `app-editor-tabs` with typed Details and Documents panels; keep the existing document upload, validation, cleanup and payload behavior unchanged. |
| `5.PNG`: Save | Confirmed workflow | Save creates the complete financial aggregate once and refreshes the owning list after success. |
| `5.PNG`: Save and Print | Missing | No Deposit report, print component, or report endpoint exists. This action is not invented; a report contract is required before implementation. |

## Frozen detail/write contract

| UI input | Angular type | Add payload | Server validation/ownership |
|---|---|---|---|
| Date | `FormControl<string>` | `date` | Required; open fiscal year required. |
| Branch | `FormControl<number|null>` | `branchId` | Required active Branch; defaults from the agreement list action context. |
| Amount | `FormControl<number>` | `amount` | Required, rounded to two decimals, greater than zero, and cannot exceed the agreement's remaining expected deposit when expected Deposit is positive. |
| Currency | read-only | — | AED display only; no client-owned currency contract is invented. |
| Amount in words | `FormControl<string>` | `amountInWords` | Optional, trimmed, maximum 500. |
| Type / Payment Method | `FormControl<number|null>` | `paymentMethodId` | Required active receipt-compatible Payment Method and branch compatibility. |
| Bank | conditional `FormControl<number|null>` | `bankId` | Required only for Bank Transfer; backend resolves the selected Bank account. |
| Card metadata | conditional typed controls | transaction/batch/last four/expiry | Credit Card, Debit Card, and Card Refund only. Backend calculates commission, VAT, and actual amount from the Payment Method. |
| Hold after closing | `FormControl<number>` | `expiryDays` | Integer 0..3650. |
| Notes / Additional Notes | typed strings | `detail`, `additionalDetail` | Optional, trimmed, maximum 1000 each. |
| Documents | typed `FormArray` | `documents: string[]` | Non-empty uploaded paths only. |

Cheque is Not Applicable to this direct Receipt-backed Deposit action because
the current `CustomerDeposit` source contract assigns cheque deposits to
`PDCReceivable`. The backend rejects a cheque Payment Method with an actionable
message instead of creating the wrong source type.

## Action and integration contract

| Action | Source | Backend route | UI | Failure and refresh |
|---|---|---|---|---|
| Add Deposit | Existing Lease Agreement row with valid `id` | `POST LeaseAgreement/{id}/deposit` with `LeaseAgreementDepositAddVM` | Ordinary typed create dialog; dirty-close confirmation; duplicate-save guard | Preserve form and safe server message on failure; close and refresh current list page on success. |

The list contract gains `BranchId` only as the minimum action-context property;
the displayed grid columns remain unchanged. The dialog keeps the existing list
route and uses the interceptor-enabled service.

The action is available for a valid row regardless of `CanEdit`: the adjacent
Add Receipt action has the same state contract, the existing Booking deposit
source accepts a Closed booking, and the supplied Deposit evidence includes a
hold period measured after agreement closing. No permission contract is
invented; the application has authentication but no authorization mechanism.

## Backend and accounting contract

- The endpoint reloads the Lease Agreement and owns CustomerId, AgreementId,
  and deposit amount-limit validation. The UI does not send customer identity.
- One serializable explicit transaction begins before the first mutation and
  covers the Journal Voucher, Receipt, and Customer Deposit saves.
- Journal Voucher: debit the selected Payment Method account, or selected Bank
  account for Bank Transfer; credit Customer Deposits Payable; totals are equal
  and the customer is attached to the liability line.
- Receipt: `DepositReceipt`, unallocated, agreement/customer/contact context,
  selected branch/payment method/bank, normalized metadata/documents, and the
  created JV id.
- Card financial values are backend-derived with the Receipt domain method.
- Customer Deposit: Receipt source, expiry days, In Hold, zero used amount, no
  Booking source.
- Existing entity and EF shapes already support this workflow; no migration is
  required.

## Override and mapping decisions

- No generic CRUD override is added. `AddDepositAsync` is a feature-specific
  aggregate command exposed through the interface and controller.
- `LeaseAgreement -> LeaseAgreementListVM` explicitly maps `BranchId` from the
  agreement Vehicle solely for the action context.
- No new AutoMapper write mapping is added; server-owned Receipt, JV, and
  Customer Deposit entities are constructed explicitly.

## Verification boundary

Final reconciliation is source-only. Build, tests, lint, browser/runtime,
database, migrations, commit/push, and deployment remain owner verification.

## Final reconciliation

| Concern | Result | Evidence |
|---|---|---|
| List action and modal ownership | Reconciled | The Lease Agreement row action passes only agreement id/no and Vehicle branch context; close-after-save refreshes the current list request. |
| Action state | Reconciled | A valid row id is required and list busy state disables opening; no `CanEdit` or invented permission gate is applied, consistent with the frozen receipt/closed-deposit evidence. |
| Angular / API route | Reconciled | The typed service posts `LeaseAgreementDepositCreateDTO` to `POST LeaseAgreement/{id}/deposit`, matching the controller and `LeaseAgreementDepositAddVM`. |
| Angular compilation root | Reconciled | The new standalone Deposit component is registered in the project's explicit `tsconfig.app.json` `files` list; its imported model remains transitively compiled. |
| Screenshot content | Reconciled with one Missing contract | Date, Branch, Amount, AED, Amount in Words, Payment Method, hold days, notes, additional notes, Documents, Cancel, and Save are represented through the canonical dialog pattern. Save and Print remains blocked by the missing report contract. |
| Payment-method behavior | Reconciled | Bank is conditionally required for Bank Transfer; optional card metadata is retained only for card types; cheque is rejected before persistence. |
| Tab and document presentation | Reconciled | Shared `app-editor-tabs` owns active colours, keyboard/RTL navigation and tab ARIA wiring. Per the owner's appearance follow-up, Add Document and Choose File use shared `--sigma-primary` tokens and both panels use the shared editor surface in light/dark themes. Feature-scoped styles still own the Documents panel because the UI guide's referenced global `sigma-documents` classes are absent from current source; current source wins and that documentation reference is drift. |
| Aggregate persistence | Reconciled | Remaining expected deposit is checked inside a serializable transaction; JV, Receipt, and Customer Deposit are saved and committed as one consistency boundary. |
| Voucher balance | Reconciled | Gross amount debits the resolved Payment Method/Bank posting account and credits Customer Deposits Payable; both accounts and the fiscal period are validated before persistence. |
| Existing downstream consumers | Reconciled | Receipt type/payment method/bank/card/JV fields preserve the existing Cash Deposit, card settlement, bank protection, and Customer Deposit source contracts. |
| Mapping and schema | Reconciled | Only the read-side `BranchId` action context map was added; write entities are explicit and no entity, EF configuration, migration, or snapshot changed. |
| Source hygiene | Reconciled | Scoped files were checked for route/type mismatch, stale references, merge markers, and whitespace errors; only repository line-ending notices remain. |
