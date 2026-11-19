# Lease Agreement Payment Instructions — Contract Freeze

Date: 2026-08-26  
Status: Frozen — implementation in the current task; build, runtime, and browser verification remain pending for the owner.

## Scope and authority

- Add a `Payment Instructions` action to the existing LeaseAgreement ActionList.
- Open the action in the existing `app-editor-dialog` pattern; do not add a route or a second modal shell.
- Persist one agreement-level payment-instruction record with either Direct Debit details or cheque rows.
- Preserve the existing LeaseAgreement action order and keep Print last; the new action is inserted immediately before Print.
- Screenshots are functional/content evidence only. The canonical Master Guide, UI pattern book, backend pattern book, and current source own implementation structure.
- The required generated PHASE-00 through PHASE-06 packets were checked before this freeze and all reported stale. They are derivative and remain unedited; the canonical sources and current source therefore own this contract.

## Feature Review Manifest

| Decision | Frozen contract and evidence |
|---|---|
| UI shape | Existing LeaseAgreement row action opens a standalone shared `app-editor-dialog` with a typed reactive form, translated EN/AR messages, loading/error states, dirty-discard handling, and existing theme/RTL tokens. |
| Backend shape | Feature-specific aggregate child synchronization on `LeaseAgreement`, following the existing LeaseAgreement child read/replace pattern. One `SaveChangesAsync` is sufficient for the tracked instruction and cheque graph, so EF Core's implicit transaction owns atomicity. |
| Payment method branch | The screenshot demonstrates the two visible branches `Direct Debit` and `Cheque`; these are represented by a new LeaseAgreement instruction enum because the existing `PaymentType` enum has no Direct Debit member. |
| Direct Debit fields | Account Type, Account No, Account Name, Bank Name, Branch, Branch Code, Invoicing Start Date, Day Of Month, and DDA Ref No. are persisted as the screenshot's editable inputs. Account Type has no confirmed source option set, so it remains a trimmed editable string rather than inventing option values. Day Of Month uses the confirmed 1–31 domain range already used by LeaseAgreement provisions. |
| Cheque rows | Cheque rows are persisted children with existing configured PaymentMethod reference, Cheque No, Cheque Date, Bank, and Amount. The existing PaymentMethod select list supplies row options; no new lookup table is introduced. |
| Empty method | A null method is accepted only as the replacement/clear state. Saving it removes the existing instruction and its owned cheque rows. A pristine new dialog cannot save until a method is selected. |
| Editability | The read contract returns `CanEdit = !IsClosed && !Invoiced`, matching existing LeaseAgreement child actions. The backend repeats the state check and never treats the UI flag as authorization. |
| Action state | The action is available for any valid agreement row while the parent list is not busy; server state controls whether the dialog is editable. No new permission API is invented. |
| Calculation | Amounts are entered values and are not recalculated, summed into LeaseAgreement totals, or posted to vouchers. Payment Instructions has no accounting side effect. |
| Mapping | No AutoMapper profile is added. The custom response projection and aggregate reconciliation need explicit child ownership, lookup projection, and branch clearing. |
| Persistence impact | Two new LeaseAgreement-owned tables and their EF configurations are required. No migration is created or edited; the owner must run `Add-Migration` before deployment. |

## Screenshot functional evidence

| Evidence | Required behavior | Classification |
|---|---|---|
| Payment1 | Payment Instructions modal opens with the agreement number, Payment Method, Cancel, and Save. | Confirmed minimum fields and dialog workflow. |
| Payment2 | Direct Debit selection reveals the nine named account/invoicing fields. | Confirmed branch and field names; Account Type option values are Missing. |
| Payment3 | Cheque selection reveals an editable row collection with Payment Method, Cheque No, Cheque Date, Bank, Amount, remove action, and Add Row. | Confirmed child-collection fields and behavior; initial blank-row count/default amount is not a contract. |
| Existing source | LeaseAgreement child actions use `GET /{id}/...`, `PUT /{id}/...`, `CanEdit`, typed forms, shared dialog, and translated failure handling. | Approved project pattern and compatibility evidence. |

## API and data contract

### Operations

| Method | Route | Purpose |
|---|---|---|
| GET | `/LeaseAgreement/{id}/payment-instructions` | Return agreement number, editability, current method/Direct Debit values, cheque rows, and configured payment-method options. |
| PUT | `/LeaseAgreement/{id}/payment-instructions` | Replace the complete instruction. `PaymentMethod = null` clears the instruction and owned rows. |

### Response

`LeaseAgreementPaymentInstructionsVm` returns only:

- `LeaseAgreementId`, `AgreementNo`, `CanEdit`;
- nullable `PaymentMethod` (`DirectDebit` or `Cheque`);
- Direct Debit fields: `AccountType`, `AccountNo`, `AccountName`, `BankName`, `Branch`, `BranchCode`, `InvoicingStartDate`, `DayOfMonth`, `DdaRefNo`;
- `Cheques[]`: `Id`, `PaymentMethodId`, `ChequeNo`, `ChequeDate`, `Bank`, `Amount`;
- `PaymentMethodOptions[]` as existing `DropdownDto` values for cheque-row Payment Method.

### Update request

`LeaseAgreementPaymentInstructionsUpdateVm` contains only client-editable values:

- `LeaseAgreementId`;
- nullable `PaymentMethod`;
- the nine Direct Debit fields above;
- `Cheques[]` with existing child `Id` or `0`, `PaymentMethodId`, `ChequeNo`, `ChequeDate`, `Bank`, and `Amount`.

The request does not carry subscription, audit, agreement number, calculated totals, status, or navigation objects.

### Validation and ownership

- The agreement id in the route and body must match and must resolve through the tenant-scoped repository.
- Closed or invoiced agreements reject PUT with the existing `LeaseAgreementReadOnly` message.
- Method values are checked with `Enum.IsDefined`.
- Direct Debit values are trimmed and validated against the configured field lengths; optional `InvoicingStartDate` is date-only when supplied, and optional `DayOfMonth` must be 1–31 when supplied. The screenshots do not establish required markers for these fields.
- Cheque rows require a valid existing active receipt-capable PaymentMethod, a trimmed Cheque No and Bank within their lengths, a valid Cheque Date, and a positive amount with no more than two decimals. Duplicate child ids and foreign-parent child ids are rejected.
- Cheque rows are reconciled by omission, with owned rows removed only from this agreement. A single tracked aggregate save is used.
- Payment Instructions never changes `TotalCharges`, creates a receipt, creates a DDA transaction, creates a voucher, or changes agreement status.

## Route and integration contract

- LeaseAgreement remains a list-only lazy route; no child route is added.
- `LeaseAgreementService` gets matching typed `getPaymentInstructions` and `updatePaymentInstructions` methods.
- `LeaseAgreementsComponent` owns dialog visibility, agreement id/number, action placement, and refresh-on-save behavior.
- The new standalone component is explicitly added to `tsconfig.app.json` because the project has an explicit Angular `files` boundary.
- The authenticated/interceptor-enabled existing `HttpClient` scope is used through the existing services.

## Unresolved requirements

- Account Type dropdown option values are not present in the screenshot or current source. The frozen low-risk behavior is a typed string input that preserves the business value without inventing a list. If the owner has an authoritative option source, it can replace this field with a lookup in a later contract revision.
- Screenshot row count and repeated `1260` amount are not treated as defaults because no source rule establishes them. The editor shows persisted rows and uses Add Row for new rows.

## Owner verification

1. Open Payment Instructions for a normal agreement and confirm the action appears immediately before Print.
2. Confirm GET loads with no console/network error and shows the saved branch after reopening.
3. Select Direct Debit, enter the nine fields, save, reopen, and confirm all values are restored.
4. Select Cheque, add/remove rows, choose configured Payment Methods, enter cheque data, save, reopen, and confirm child rows are restored.
5. Clear the method and save; confirm the instruction and cheque rows are removed without changing agreement charges or vouchers.
6. Attempt to save a closed/invoiced agreement and confirm the server rejects the update while the UI remains consistent.
