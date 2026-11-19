# Lease Agreement Closing — Contract Freeze

Date: 2026-08-26  
Status: Implemented — source-only reconciliation complete; build, runtime, and browser verification remain pending for the owner.

## Scope and authority

- Add a separate `Close Agreement` action to the existing LeaseAgreement ActionList.
- Add the screenshot-demonstrated closing dialog and its typed Angular form.
- Add the LeaseAgreement close context/request API and the domain transition.
- Exclude closed/invoiced agreements from agreement selector endpoints.
- Render the LeaseAgreement grid status as the canonical status badge.
- Preserve the existing `Extend Period` and `Extend Rate and Period` actions.
- Add a read-only `Billing History` action showing the agreement billing summary.
- No schema change, migration, new route, accounting voucher, receipt, or unrelated LeaseAgreement refactor.

Canonical authority is `SIGMA_FEATURE_REVIEW_MASTER.md` plus the applicable canonical UI and backend pattern blocks. The generated PHASE-00 through PHASE-06 packets were checked with `Generate-SigmaRecipes.ps1 -Check` and reported stale; canonical sources and current project source therefore own this freeze. The supplied `CloseAgreement.PNG` is functional/content evidence only: it identifies the return fields, charge rows, totals, and Save/Cancel workflow, but does not define API names or persistence side effects.

## Feature Review Manifest

| Decision | Frozen contract and evidence |
|---|---|
| UI shape | Existing LeaseAgreement row ActionList opens the canonical shared `app-editor-dialog`; typed reactive form, loading/error states, dirty-discard confirmation, translated EN/AR messages, and existing appearance tokens. |
| Backend shape | Explicit domain action on the tracked LeaseAgreement aggregate, with one serializable transaction because agreement, vehicle, movement, and status history change together. |
| Open state | Action is available only when `!IsClosed && !Invoiced && VehicleId.HasValue`; the server repeats this check. |
| Agreement selectors | `LeaseAgreement/GetSelect` and the existing `RentalAgreement/GetSelect` consumer return only `!IsClosed && !Invoiced` records; the generic selector base remains unchanged. |
| Grid status | The existing `isClosed` column uses the canonical typed `cellTemplate` badge pattern, with open and closed states translated from the existing keys. |
| Context | `GET /LeaseAgreement/{id}/close-context` returns server-owned agreement/vehicle/customer/driver data, current vehicle return snapshot, active booking charges, discount, tax, additional-charge total, and existing term month count. |
| Save | `POST /LeaseAgreement/{id}/close` accepts only return date/time, return fuel, return mileage, return branch, and booking-charge selection/rates. Client totals are never trusted. |
| Target state | Mark the LeaseAgreement closed, persist the final server-calculated total, update the current vehicle mileage and branch, append a CollectionMovement, and append VehicleStatus `Available`. |
| Existing actions | `Extend Period` and `Extend Rate and Period` remain separate and unchanged; Close Agreement is added after the existing extension actions and before Print. |
| Billing history | Existing LeaseAgreement row ActionList opens a canonical read-only `app-editor-dialog` after Close Agreement and before Print; the dialog contains only Total Charges, Received, Due, loading/error/empty states, and Close. |
| Authentication | Existing authenticated application behavior; no authorization API or permission contract is invented. |

## Functional evidence table

| Screenshot evidence | Required behavior | Implementation |
|---|---|---|
| Lease Agreement Closing title and agreement number | Open for the selected agreement and show its number read-only. | Parent row action plus server-loaded context and dialog title. |
| Date Time Out, Vehicle, Customer, Driver | Show current agreement/vehicle data read-only. | Context projection; for a replaced vehicle, the existing incoming-vehicle snapshot helper supplies the active vehicle's latest outbound state. |
| Date Time In | Required editable return date/time; cannot precede the current vehicle's recorded outbound time. | `p-calendar`, client validation, and server validation. |
| Fuel Level Out / In | Show outbound fuel and accept a defined inbound fuel level. | Existing `FuelLevel` enum and typed dropdown. |
| Mileage Out / In and KM Used | Show outbound mileage, accept non-negative inbound mileage, and calculate used KM for display. | Typed numeric control; inbound mileage cannot be lower than the server snapshot. |
| Branch In | Select an active return branch. | Existing Branch select list; server validates existence and activity. |
| Charges table | Show active booking charges with selection, rate, and calculated charge. | Server-owned charge type/rate-unit rows; monthly and one-time calculations follow current LeaseAgreement conventions. |
| Discount, Tax, Total Charges | Preserve agreement discount/tax and show the calculated result. | Read-only summary; server recalculates and persists `TotalCharges`. |
| Save / Cancel | Save valid close details; cancel safely handles dirty changes. | Shared editor lifecycle and confirmation service. |
| Billing History screenshot | Show the selected agreement number, Total Charges, Received, Due, and Close only; this screenshot does not demonstrate a transaction-level billing table. | Billing History action loads a server summary and uses the shared view-mode editor dialog with the primary action hidden. |

## API and data contract

### List/action state

The existing LeaseAgreement grid columns remain exactly:

`no`, `agreementType`, `poNo`, `vehiclePlateNo`, `permanentVehicle`, `customerName`, `customerCode`, `driverName`, `dateAndTime`, `endDate`, `isClosed`, `branchName`.

The matching `LeaseAgreementListVM` properties are `Id`, `No`, `AgreementType`, `PONo`, `VehiclePlateNo`, `PermanentVehicle`, `CustomerName`, `CustomerCode`, `DriverName`, `DateAndTime`, `EndDate`, `IsClosed`, `BranchId`, `BranchName`, `CanEdit`, `CanExtend`, `CanReplaceDriver`, `CanReplaceVehicle`, and `CanClose`. `BranchId` and the `Can*` properties support row actions and are not displayed as grid columns. `CanClose` is projected as `!IsClosed && !Invoiced && VehicleId.HasValue`.

The grid continues to sort and filter on `isClosed`; its cell now renders a translated open/closed status badge. Selector endpoints for LeaseAgreement and RentalAgreement exclude closed and invoiced agreements, while the generic base selector is unchanged so unrelated entities are not affected.

### Close context

`LeaseAgreementCloseContextVm` contains only data needed by the dialog: agreement identity/number, outbound snapshot, vehicle/customer/driver display values, default inbound values, branch, existing calendar-month term, active booking-charge rows, discount, tax, additional-charge total, current total, and `CanClose`.

### Close request

`LeaseAgreementCloseRequestVm` contains:

- `DateTimeIn`
- `FuelLevelIn`
- `MileageIn`
- `BranchInId`
- `BookingCharges[]` with existing child `Id`, `IsSelected`, and editable `Rate`

Agreement number, vehicle identity, fuel/mileage outbound values, charge type, rate unit, discount, tax, totals, tenant fields, and state are server-owned.

### Billing history read contract

`GET /LeaseAgreement/{id}/billing-history` returns `LeaseAgreementBillingHistoryVm` with `LeaseAgreementId`, `AgreementNo`, `TotalCharges`, `Received`, and `Due`. `TotalCharges` is the persisted agreement total. `Received` is the sum of linked `Receipt.Amount` values for the agreement where the receipt is not deleted and not voided. `Due` is `max(TotalCharges - Received, 0)`. All three money values are normalized to two decimal places by the backend. The repository query remains tenant-scoped through the existing repository behavior.

## Domain and calculation decisions

- The close action is a transition, not a generic LeaseAgreement update.
- The existing `GetIncomingVehicleSnapshotAsync` helper determines the current vehicle's outbound date, fuel, mileage, and prior branch, including agreements with earlier vehicle replacements.
- Monthly charge rows use `Rate * CalculateMonthSpan(agreement.DateAndTime, agreement.EndDate)`; one-time rows use `Rate`. Existing unsupported rate units retain their persisted charge because no other conversion rule exists in current source.
- Subtotal is active additional charges plus selected booking charges. Tax is calculated as `max(subtotal - Discount, 0) * TaxPercent / 100`; total is `subtotal - Discount + tax`, rounded to two decimals. The client preview is informational only.
- The single tracked `DbContext` save is wrapped in a serializable transaction because the operation appends movement/status history and changes the agreement and vehicle together.
- No invoice, receipt, deposit, journal voucher, discount row, document, replacement row, or new agreement is created by closing.
- Billing History is read-only and creates no receipt, voucher, invoice, or other persistence side effect. It intentionally reports a summary only because the supplied screenshot contains no billing transaction rows.

## Reconciliation and verification limits

- Frontend and backend contracts, endpoint strings, translations, list action wiring, and stale imports were reviewed source-only.
- Both repository roots were confirmed independently: `SiGmaAngularFrontEnd` and `SigmaBackend`.
- `git diff --check` passed in both repositories; only Git line-ending warnings were reported.
- No migration or model snapshot was changed. Owner-run `Add-Migration` is not required.
- Builds, tests, lint, database checks, browser/runtime checks, commits, and deployment were not run because the workspace instructions prohibit them.

## Owner verification

1. Open an open, non-invoiced LeaseAgreement with a vehicle and confirm `Close Agreement` appears after both extension actions.
2. Confirm the modal loads the outbound vehicle snapshot, current branch, fuel, mileage, charges, discount, tax, and total.
3. Change inbound date, fuel, mileage, branch, and charge selection/rates; confirm validation and displayed totals.
4. Save and verify the agreement becomes closed, the vehicle receives inbound mileage/branch, a CollectionMovement is created, and the latest vehicle status is Available.
5. Reopen the list and confirm Close, Edit, Extend, and replacement action states reflect the closed agreement while the old extension actions remain present.
6. Verify a stale/closed/invoiced agreement is rejected by the API even if the dialog was already open.
7. Open Billing History for an agreement with valid, voided, and deleted receipts; confirm only valid linked receipts are included, the persisted total is shown, and Due is never negative.
