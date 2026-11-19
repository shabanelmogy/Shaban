# Lease Agreement Log — Contract Freeze

Status: Frozen for implementation

## Evidence

The supplied `111.PNG` is functional evidence for a read-only Agreement Log
dialog. It demonstrates the title `Agreement Log: (agreement number)`, the
columns `DATE AND TIME`, `USER`, and `DETAIL`, descending activity rows, and a
Cancel action. The screenshot does not define persistence, endpoint names, or
when an activity row is created.

The source behavior reference is the existing Lease Inquiry logs flow:

- `LeaseInquiryStageHistory : EntityBase` stores append-only history metadata.
- `LeaseInquiryService.GetLogsAsync` returns `Results<LeaseInquiryLogVM>` in
  descending `CreatedAt`/`Id` order.
- `LeaseInquiryController` exposes a custom GET log route.
- `LeaseInquiryLogsDialogComponent` uses the shared `app-data-table`, typed
  columns, loading, empty, and both failure channels.

The required recipe check reported stale generated packets for PHASE-00 through
PHASE-06. The canonical Master Guide and canonical backend/UI pattern books
were used directly; generated packets were not edited.

## Frozen contracts

### Main Agreement grid and row action

The main grid contract is unchanged. Its displayed columns remain:

`Actions`, `Agreement No`, `Agreement Type`, `PO No`, `Vehicle`,
`Permanent Vehicle`, `Customer`, `Customer Code`, `Driver`, `Start Date`,
`End Date`, `Status`, and `Branch`.

The existing `LeaseAgreementListVM`/`LeaseAgreementDTO` remains responsible for
those columns and its existing action-state flags. The new `Agreement Log` row
action consumes only the existing `id` and `no`; no new ListVM property is
required. The action is read-only and is visible for open, closed, and voided
agreements. Transient list busy state continues to use `disabled`.

### Log dialog grid

| Dialog column | Angular property | Backend property | Contract status |
|---|---|---|---|
| Date and Time | `dateTime` | `DateTime` | Confirmed by screenshot/reference shape |
| User | `user` | `User` | Confirmed by screenshot/reference shape |
| Detail | `detail` | `Detail` | Confirmed by screenshot; persisted detail |

The dialog is read-only, has no paging, uses descending newest-first ordering,
and closes without refreshing the Agreement grid. Its shell uses the canonical
shared `app-editor-dialog` in view mode, with the shared Sigma header/footer,
responsive sizing, top positioning, and `appendTo="body"` overlay behavior so
it opens above the agreement action menu and other page content. The shared
dialog owns the modal stacking and button styling; the feature owns only its
content states and table data.

### API

`GET /LeaseAgreement/{id}/logs` returns `Results<LeaseAgreementLogVM>`.

- Invalid or missing agreements return the normal `LeaseAgreementNotFound`
  failure contract.
- The repository query supplies subscription and soft-delete isolation.
- The response is ordered by `CreatedAt DESC`, then `Id DESC`.
- No request payload is accepted.
- For agreements created before this log entity exists, the service derives one
  read-only `Agreement is opened` row from the agreement's existing
  `CreatedAt`/`CreatedBy` metadata when no persisted opening row exists; it does
  not write during GET.

### Persistence and event rule

`LeaseAgreementLog` is an `EntityBase` child of `LeaseAgreement` with:

- `LeaseAgreementId` and required `LeaseAgreement` navigation;
- required `Detail`, maximum 1000 characters;
- inherited `CreatedAt` and `CreatedBy` as the displayed date/time and user;
- tenant-scoped index on `(SubscriptionId, LeaseAgreementId, CreatedAt)`.

The service appends one log in the same save/transaction as a successful
agreement mutation:

- successful `AddAsync`: `Agreement is opened`;
- successful agreement update, extension, payment-instruction, document,
  discount, additional-charge, deposit, driver-replacement, or
  vehicle-replacement operation: `Agreement is modified`;
- successful close: `Agreement is closed`;
- successful void: `Agreement is voided`.

Failed operations and no-op child saves do not create log rows. A GET that opens
the details or log dialog is deliberately side-effect free; `Agreement is
opened` is the creation event represented by the screenshot terminology, not a
new write caused by viewing a record.

### Mapping and calculations

No AutoMapper mapping is required. The log response is projected explicitly in
the service, following the Lease Inquiry reference. The feature has no client
or server calculation contract.

### Migration boundary

Adding the log entity, relationship, index, and DbSet changes the EF model. No
migration is created or edited here. The owner must run `Add-Migration` and
apply the resulting database migration before the endpoint can return stored
rows.

## Required vertical slice

Backend: entity, EF configuration, DbSet, response VM, service method, and
controller route.

Frontend: typed log model, service method, standalone logs dialog, explicit
`tsconfig.app.json` component entry, Agreement action, list wiring, translations
in English and Arabic, and loading/empty/error/close behavior.
