# Lease Agreement Delivery Date — Contract Freeze

Status: Frozen for implementation

## Evidence

The supplied `333.PNG` is functional/content evidence for a row action that
opens a small editor titled `Agreement: (agreement number)` with one editable
`Delivery Date` field and Cancel/Save actions.

The current agreement model has no separate `DeliveryDate` property. Its
existing `Agreement.DateAndTime` is displayed as the agreement start/delivery
date and time, is used by the agreement-period calculations, and is returned
through the existing list and detail contracts. Therefore the action edits the
date portion of that existing value and preserves its time portion.

The required recipe check reported stale generated packets for PHASE-00 through
PHASE-06. The canonical Master Guide and canonical backend/UI pattern books
were used directly; generated packets were not edited.

## Frozen contracts

### Row action

Add `Change Delivery Date` to the existing Agreement action list after the
currently registered actions. It is visible only when the existing `canEdit`
row state is true and is disabled by the existing transient busy state. No new
list property is required.

### Dialog

The dialog is a standalone typed-form component using the canonical shared
`app-editor-dialog` in create mode. It contains only the screenshot-demonstrated
`Delivery Date` date-only control and Cancel/Save actions. It uses the shared
top-positioned, body-appended modal shell and the existing Sigma date-picker
pattern. Closing a dirty form uses the existing confirmation dialog service.

### API

`GET /LeaseAgreement/{id}/delivery-date-context` returns
`Result<LeaseAgreementDeliveryDateContextVm>` containing the agreement id,
agreement number, current `DateAndTime` value as `DeliveryDate`, and the
agreement `EndDate` as read-only reference data.

`POST /LeaseAgreement/{id}/delivery-date` accepts
`LeaseAgreementDeliveryDateUpdateVm` with the client-editable `DeliveryDate`
only and returns the normal `Result` contract.

### Business rules

- The agreement must exist.
- Closed, voided, and invoiced agreements are read-only and cannot use this
  action.
- The requested date is required and cannot be later than the agreement end
  date.
- The dialog displays the existing `EndDate` as a read-only reference and uses
  it as the date picker maximum; the update contract remains `DeliveryDate`
  only.
- The requested date replaces only `DateAndTime.Date`; the existing time of
  `DateAndTime`, `EndDate`, charge rows, and calculated totals are preserved.
- A no-op date submission succeeds without creating an activity log.
- A changed date is saved with one existing `Agreement is modified` log row.
- The agreement list is refreshed after a successful save so its displayed
  start/delivery date remains current.

### Mapping and migration boundary

No AutoMapper mapping is required because the action uses dedicated context and
update contracts and applies the controlled date mutation in the service. No
new persisted field is introduced, so no migration is required for this
feature.

## Required vertical slice

Backend: context VM, update VM, service methods, controller routes, and
English/Arabic backend validation/save messages.

Frontend: typed action models, service methods, standalone dialog, exact
`tsconfig.app.json` component entry, row-action/list wiring, translations, and
loading/empty/error/validation/dirty-close handling.
