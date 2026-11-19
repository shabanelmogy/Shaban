# Company driver removal and Next diagnosis

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

2026-10-02. Owner reports two saved drivers, removes one during Company Edit,
then encounters an error on Next. Error text and exact trigger requested;
no application source changes made for this report.

## Source evidence

- DriversComponent uses EditableRows.requestRemove. Confirmation re-resolves
  the row identity, FormArray.removeAt removes its validation participation,
  and the parent is marked dirty. No minimum-driver-count validator exists.
- Company Next calls goToStep and validates current step only; no API call.
  Drivers is the last of five steps, where the footer offers Save.
- Save validates all remaining fields, then builds drivers from the current
  FormArray. The removed driver is omitted from the full-snapshot payload.
- CompanyService.UpdateCoreAsync checks ownership and calls RemoveDroppedAsync
  for omitted drivers. Real external usages block that removal. The shared
  inheritance-link exclusion from the preceding fix also applies to Driver.

No source evidence currently proves that deleting a driver leaves a stale
validator or stale array index. A remaining invalid driver/document, another
invalid step, and a backend usage rejection are distinct possible causes.
Do not remove validation or usage checks without the reported error evidence.

## Pending evidence and verification

Need message/screenshot and confirmation whether the trigger is Next, Save,
or row deletion. If Save returns an HTTP error, need response message/errors
without private driver data. Owner runtime verification pending. No builds,
tests, browser automation, database commands, migrations or commits run.
Canonical UI 12/14 and BE 8/14 used; generated phase packets are stale and
require regeneration/semantic review. No agents used for this sequential trace.

## 2026-10-02 response evidence and fix

Owner supplied HTTP 400 PUT /Company with "A selected value from Partner no
longer exists." This is MissingReferenceAsync, before RemoveDroppedAsync,
not frontend Next validation or the external-usage deletion check.

Confirmed source defect: MissingReferenceAsync enumerated TPT inheritance
foreign keys and read VM Id as a selected Partner/base-row reference. It
rejects identity 0 on new nested Update rows and redundantly validates saved
identities as external selections. Skip foreignKey.IsBaseLinking(), using the
installed EF Core metadata API already used in the deletion fix. Ordinary
business FK checks and OwnsEveryRow remain; deleted drivers stay omitted from
the frontend snapshot. No frontend, DTO, model or migration change required.
Exact failing payload has not been supplied, so this source defect is fixed
without claiming runtime reproduction proves the reported case resolved.

BE 0.70 block 8, skill checklist/history and changelog reconciled. Scoped
source/whitespace and book-reference checks passed. Owner should restart
backend and save the two-driver company with one omitted; also check adding
a driver/contact while editing and rejection of invalid business references.
No build/test/runtime/database commands run. Suggested backend commit:
fix inherited row identity validation in aggregate updates.
