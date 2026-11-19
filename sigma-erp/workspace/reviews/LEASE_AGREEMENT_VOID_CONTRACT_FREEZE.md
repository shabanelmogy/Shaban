# Lease Agreement Void Contract Freeze

Status: Frozen  
Scope: Lease Agreement void action, including the Agreement list and the LeaseAgreement API.

## Evidence and business decision

The supplied request asks for a Void row action and the preceding web review supports a separate, auditable void state rather than physical deletion. A voided agreement remains available for history and audit, requires a reason, and is not treated as a closed agreement. Existing Agreement action ordering remains authoritative for the row menu.

## Frozen domain contract

- `LeaseAgreement` owns `IsVoided`, `VoidReason`, `VoidedDate`, and `VoidedBy`; the common `Agreement` base is not changed.
- Void is allowed only when the agreement is not already voided, closed, or invoiced and has no financial or operational records that would make reversal unsafe.
- The server records the trimmed reason, UTC timestamp, and authenticated user. The client cannot set status, timestamp, or user.
- Configured child data (documents, discounts, additional charges, payment instructions, provisions, clauses, and pre-termination rules) is retained for audit and is not itself a blocker.
- Void is blocked when a receipt, PDC receivable, accident, vehicle service booking, traffic fine, transportation invoice, collection/custody/delivery movement, debit note, credit note, invoice, opening-balance deposit/customer record, vehicle replacement, driver replacement, or positive agreement advance/deposit exists.
- A voided row remains readable and printable. Edit, extend, replace, close, delete, invoice selection, receipt creation, deposit creation, upload, and other mutating Agreement actions are blocked or hidden. Billing history remains readable.
- The grid exposes the retained row with a Voided status badge. `CanVoid` is the minimum list action-state flag; dependency blockers are revalidated by the backend and return a localized reason.

## Frozen API contract

- `POST /LeaseAgreement/{id}/void`
- Request body: `LeaseAgreementVoidRequestVm { Reason }`, required and maximum 500 characters.
- Response: existing `Result` envelope. On success the result message is localized and the list is refreshed.
- Failure paths include both a normal `isSuccess: false` response and transport/error handling in the frontend.

## Frozen UI contract

- Add Void after Delete and before the existing final Print action.
- Open a shared `app-editor-dialog` reason form. This is a typed form workflow, not a yes/no confirmation, because a reason is required.
- Use existing Agreement status/action styling and translation conventions; no new shared visual pattern.

## Migration and verification boundary

- No migration is created, edited, or run in this task. The owner must run `Add-Migration` for the four new LeaseAgreement columns before deployment.
- Source-only checks and scoped Git diff review are required. Builds, tests, lint, browser verification, database commands, commits, and deployment are intentionally not run.

