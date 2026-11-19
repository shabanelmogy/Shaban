# Lease Agreement Extend Period — Contract Freeze

Status: Implemented — expanded five-screenshot workflow source-only reconciled; build, runtime, and browser verification remain pending for the owner.

## Scope

- Existing Lease Agreement list ActionList `Extend Period` action.
- Existing Extend Lease Agreement modal and its Current Detail/New Detail editor.
- Backend Lease Agreement service/controller, DTOs, aggregate reconciliation, and translations directly required by this action.
- No schema migration, extension-history entity, or unrelated Lease Agreement refactor.

## Evidence classification

The five supplied screenshots are functional and content evidence:

- `ExtendLeaseAgreement.PNG`: modal header, Agreement No, Customer, Current Detail/New Detail tabs, current agreement fields, charge rows, financial totals, Carry Forward Previous KMs, Cancel, and Save.
- `ExtendLeaseAgreement1.PNG`: New Detail > Detail fields and editable charge/financial rows.
- `ExtendLeaseAgreement2.PNG`: New Detail > Provisions rows with Provision For and After Every plus Add Row.
- `ExtendLeaseAgreement3.PNG`: New Detail > Clauses rows with Clause Type and Clause Detail plus Add Row.
- `ExtendLeaseAgreement4.PNG`: New Detail > Pre-Termination rows with Months From, Months To, Type, and Value plus Add Row.

The screenshots do not define API names, persistence history, permissions, posting, or voucher side effects. Canonical UI/backend patterns and current source define those contracts.

## Confirmed current-source findings

- The existing action, route, service methods, simple Extend DTOs, and aggregate update already exist from the earlier approved Extend Period slice.
- The existing LeaseAgreement aggregate already owns the persisted fields for end date, vehicle/customer/driver/staff references, fuel level, KMs, notes, booking charges, provisions, clauses, pre-termination rules, discount, tax, advance, deposit, and total charges.
- Existing Lease Agreement detail editor supplies the canonical `EditorTabsComponent`, `EditableCollectionTableComponent`, typed child forms, lookup loading, and child validation patterns.
- Existing backend update reconciliation supports booking charges, clauses, and pre-termination rules. Provision entities own `FirstDate`/`LastDate`; new extension rows can use the agreement period as their schedule boundary without changing the schema or posting a voucher.
- Closed and invoiced agreements are already read-only for direct Lease Agreement mutations.

## Frozen implementation contract

1. The action updates the existing LeaseAgreement aggregate. No extension entity, audit/history table, or migration is added.
2. GET `LeaseAgreement/{id}/extend-context` returns the header and two-detail contract:
   - Header: agreement number and customer name.
   - Current Detail: agreement type, date/time out, current total months, vehicle, vehicle make/model, fuel level out, mileage out, fuel level in, mileage in, driver, and additional driver.
   - New Detail: date/time, target total months, vehicle, make/model, current fuel level, current KMs, driver, additional driver, sales person, notes, booking charges, discount, tax percent, advance, deposit, total, provisions, clauses, and pre-termination rules.
3. POST `LeaseAgreement/{id}/extend` accepts only client-editable values: Current Detail fuel level in/mileage in, New Detail target months/current fuel level/current KMs/sales person/notes, booking-charge selection and rates, financial inputs, and child rows. Server-owned agreement number, customer, agreement type, dates derived from the term, vehicle, make/model, driver names, charge type/rate unit, child ownership, and totals are not trusted from the client.
4. `NoOfMonths` is the target total calendar-month term using the existing year/month difference. It must be greater than the current term. The new end date is persisted `EndDate` plus the target-minus-current month difference, preserving the time component. Save remains clickable when the rule is not met; the server and the translated editor message reject it after submit.
5. Current Detail fuel level out and mileage out are read-only projections from the existing aggregate. Because the schema has no separate persisted “in” fields, the displayed Current Detail fuel level in/mileage in are workflow inputs used as the handoff to New Detail. `CarryForwardPreviousKMs` is a transient request option: when checked, the persisted agreement KMs use Current Detail mileage in; otherwise they use New Detail current KMs. No new persistence field is introduced.
6. New Detail vehicle, make/model, driver, and additional driver remain server-owned display values. Sales Person and Notes are editable aggregate fields. New Detail current fuel level and KMs are the values persisted to the aggregate; fuel levels must be valid enum values and mileage must be non-negative and parseable by the existing mileage rules.
7. Monthly booking rows calculate as `rate * targetNoOfMonths`; one-time rows calculate as `rate`; unknown existing rate units retain their persisted amount because no conversion rule exists. Charge type and rate unit remain server-owned. Totals are calculated server-side as `subtotal - discount + tax`, with tax based on `max(subtotal - discount, 0) * taxPercent / 100`, rounded to two decimals. Advance and deposit remain stored values and are not subtracted from total charges.
8. Existing active booking-charge rows are carried forward. Clauses and pre-termination rows use the existing owned-child reconciliation and validation rules. Existing provisions retain journal/provision-detail history fields. New provision rows use the existing `Provision` entity, derive `EntryDate`/`FirstDate` from the agreement start date and `LastDate` from the newly calculated agreement end date, and do not create a journal voucher. Existing unscheduled fields remain supported by the current entity contract; no new recurrence field is invented.
9. Active separately configured Additional Charges are preserved and included in the server-side extension total using the same aggregate-total boundary used by the existing Lease Agreement update/additional-charge flows. They are not edited by this modal.
10. The save is one tracked aggregate `SaveChangesAsync` operation. It creates or updates no invoice, receipt, journal voucher, deposit, replacement, document, discount, or other downstream record.
11. Only agreements that are not closed and not invoiced can be extended. Stale, duplicate, invalid, or foreign child IDs fail the request. The list action uses the existing `CanExtend = !IsClosed && !Invoiced` state.
12. The UI uses the canonical `app-editor-dialog`, outer `Current Detail/New Detail` tabs, inner `EditorTabsComponent` tabs (`Detail`, `Provisions`, `Clauses`, `Pre-Termination`), typed reactive forms, existing editable collection tables, dirty-discard confirmation, translated EN/AR errors, loading/empty states, and the existing action styling. This richer screenshot flow has only Cancel and Save; Save and Print is not exposed by this editor.

## Reviewer assumptions accepted for implementation

- The existing action and route are the requested action; no duplicate list action is created.
- “Extend” modifies the same agreement and increases its end date by the term delta; it does not create a second agreement.
- Separate fuel/mileage “in” values are transient because the current aggregate has only one persisted fuel/KMs pair. The explicit carry-forward checkbox selects which screenshot value becomes that persisted pair.
- New provisions use the existing agreement period as `Provision.FirstDate`/`LastDate`, because those are the only persisted schedule boundaries in the current entity and the screenshots do not expose a separate schedule definition.
- Active Additional Charges are preserved in extension totals because the existing Lease Agreement update and Additional Charges flows include them in `TotalCharges`.
- No downstream voucher/posting behavior is inferred from these editor screenshots.

## Required handoff

The frozen vertical slice is implemented. The scoped route, DTOs, child ownership rules, calculations, translations, save behavior, and diffs were reconciled source-only. Build, runtime, database, and browser verification remain pending for the owner because the workspace instructions prohibit those commands.
