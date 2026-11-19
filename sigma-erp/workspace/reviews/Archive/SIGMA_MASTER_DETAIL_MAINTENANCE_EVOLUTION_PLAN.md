# Sigma master-detail toolkit and editor shell — Maintenance / Evolution Plan (step 3)

| | |
|---|---|
| Status | Implemented — source-only (M1–M4, 2026-10-01) |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Requested as | "ابدأ الخطوة التالتة" — step 3 of `SIGMA_DOCUMENTATION_SYSTEM_AUDIT.md` A4.3 |
| Packet | `PLAN-00-maintenance-evolution.md` (drift check 8×OK, 2026-10-01) |
| Guides | UI 1, 12, 13, 14, 15, 18 · Backend 1, 2, 5, 8, 14, 15 · Master 4, 5 |
| Method | Read-only source inspection. No build, test, browser, migration or commit |
| Findings covered | A4-11 … A4-20, A4-41, A4-42, A4-61, A4-64 (A4-60 was done in step 2) · decisions D4-2, D4-3, D4-8 |

## 1. Outcome

A master-detail editor — a header plus one or more child collections, with totals — is built from
shared pieces:
- the same page shell;
- the same child-row helper;
- the same documents handling;
- the same backend validation and delete behaviour.

Job becomes the reference for routed editors, as it already is for lists.

**Non-goals:**
- Migrating existing editors (each moves in its own review).
- Changing any API contract or business rule.
- Authorization (deferred).

## 2. Existing-State Inventory

| Concern | Current state | Evidence |
|---|---|---|
| Child rows in Angular | 77 components use `FormArray`, 66 call `removeAt`, 25 declare private row factories. Each rewrites add + `markAsDirty`, remove with confirmation, loading rows from the detail, `id` handling in the update payload, and focus on the first invalid field | grep; `Rental/RentalQuotation/components/details` 200–360 |
| Row removal confirmation | Every removal confirms, even for a blank new row; the Job editor does not follow the rule | UI 14, Job editor |
| Editor page shell | No shared shell. The Job editor carries ≈350 lines of feature SCSS (`job-editor-page/-panel/-body/-field/-workspace/-footer`); other editors are similar | `Workshop/Job/components/editor/editor.component.scss` |
| Modal vs routed | UI 13 says "modal unless a routed page is approved"; Job is routed without a recorded approval; multi-collection documents do not fit a modal | UI 13, A4-14 |
| Routed variant height | UI 13 routed variant uses `maxHeight="clamp(120px, calc(100dvh - 540px), 240px)"` | UI 13, A4-15 |
| Child draft snippet | Mutable fields (`this.visible = true`) instead of signals | UI 13, A4-17 |
| Documents | One `app-documents` (Company, 2 users). UI 18 claims global `sigma-documents__*` classes, but **none exist in `styles.scss`** (doc drift). 24 screens upload files; only 3 track uploaded-but-unsaved paths, so the rest leave orphans on cancel | grep |
| View mode | UI 15 disables the whole form but does not say that `form.value` then drops disabled controls (payload must use `getRawValue()`), nor readonly vs disabled for derived/server values | UI 15 |
| Backend FK checks | `PurchaseOrderService` (the BE 14 reference) validates Item/AssetType/Vehicle/UoM/Job ids with `ExistsAsync(x => ids.Contains(x.Id))` in Add **and** Update (10 checks): passes when any one id exists (backlog 3). The same idiom is hand-written elsewhere | `PurchaseOrderService` 75–110, 151–190 |
| Delete of an aggregate | `SaveChanges` turns every delete into a soft delete (`HandleAudit`). Base `RemoveAsync` loads the parent alone (`FindById`), so owned children are never marked and stay active; reports that read child tables count lines of deleted documents. No PO `RemoveAsync` override | `SiGmaDbContext.HandleAudit`, `Service.RemoveAsync` |
| Cascade config | 2,411 `Cascade`, 4,342 `Restrict`, 300 `NoAction`, 101 `SetNull` — a soft delete (UPDATE) never fires any of them | EF configurations |
| Soft delete + unique index | Unique indexes without `[IsDeleted] = 0` block re-adding a deleted name (A4-41) | BE 2, 8 |
| Child collection semantics | Base `UpdateAsync` skips a child collection that is `null` (leave alone) and reconciles a sent list (missing ids are removed). Nothing states the contract | `Service.UpdateAsync` |

## 3. Decisions

| # | Decision | Recommendation (reviewer) | Why |
|---|---|---|---|
| **D4-2** | When is an editor a modal, when a routed page? | **Modal** for a record with one section or a single small child list and no totals (master data, settings rows, small dialogs). **Routed page** for a document with two or more child collections, totals, or approval/posting (Job, quotations, invoices, bills, PO). A routed page no longer needs a separate approval | The rule stays objective; Job, PO and invoices fit it; the owner does not have to decide each screen |
| **D4-3** | What does a child collection mean in an Update payload? | **Full snapshot.** The client always sends the whole collection: a missing row is removed; an empty list clears it (only when the business allows zero rows). The base keeps "`null` = leave alone" only for old clients; new and reviewed screens never send `null` | One rule for every editor; it matches what base `UpdateAsync` already does for a sent list |
| D4-8 | Filtered unique indexes | Per entity when its screen is reviewed (owner runs each migration) | Same as audit recommendation |
| Soft delete of children | Explicit per aggregate | The base offers `RemoveWithChildrenAsync(id, children…)`, which loads the named owned collections and marks each child deleted. It is **not** automatic for every entity, because 2,411 `Cascade` configurations include non-owned relations (for example a Branch), which must never be soft-deleted with their principal | Safe and explicit |
| Row confirmation | Confirm only when the row has data or is saved | A blank new row is removed directly |

## 4. Slices

| Slice | Outcome | Files |
|---|---|---|
| **M1 Frontend shared code (additive)** | See the list below | `shared/utils/editable-rows.ts`, `shared/service/document-upload-tracker.ts`, `src/styles.scss` |
| **M2 Backend (small)** | See the list below | `Services/Bases/Service.cs`, `PurchaseOrderService.cs`, resx |
| **M3 Books** | See the list below | docs |
| **M4 Reference adoption** | The Job editor moves its page, panel, body, footer and field styling to the shared classes, with the same look, and uses `EditableRows` where it fits. It becomes the routed-editor reference | `Workshop/Job/components/editor/*` |

**M1 — shared frontend pieces:**
- `EditableRows<TGroup>`: a small helper around a `FormArray` for:
  - add (marks dirty, focuses the new row's first control);
  - confirmed remove (confirmation skipped for a blank new row);
  - replace from the detail;
  - duplicate-key check;
  - `id` handling in the update payload.
- `DocumentUploadTracker`: component-provided; tracks pending and removed paths, cleans up after save and on discard.
- Editor shell classes: `sigma-editor-page/-panel/-body/-footer/-section/-grid` and `sigma-field` (label + 34px control + read value).

**M2 — backend:**
- Base helpers:
  - `AllExistAsync<TEntity>(ids)` — a distinct-count check;
  - `RemoveWithChildrenAsync(id, params children)`.
- `PurchaseOrderService` uses them: 10 FK checks fixed (backlog 3), and `RemoveAsync` soft-deletes the details.

**M3 — books:**
- **UI:**
  - UI 13: D4-2 rule; routed variant on `fillHeight`/`stickyHeader`; child-draft snippet on signals.
  - UI 14: `EditableRows`; confirmation rule; focus, per-row errors, duplicates, max rows.
  - UI 15: `getRawValue`; readonly vs disabled.
  - UI 18: one documents approach, the `DocumentUploadTracker`; the non-existent classes removed.
  - UI 1/12: editor shell.
- **Backend:**
  - BE 1/2: soft delete and filtered unique index.
  - BE 5/8: `AllExistAsync`, `RemoveWithChildrenAsync`.
  - BE 14: reference fixed; D4-3 snapshot rule; Misc Invoice transaction row (A4-20).
- **Records:** skill, backlog, versions, packets.

Order: M1 and M2 are independent; M3 follows them; M4 last.

## 5. Compatibility

- **M1 and M2 are additive.** Existing editors are unchanged; the base helpers are opt-in.
- **Purchase Order behaviour changes on purpose:**
  - an unknown item/vehicle/UoM/job id alongside a valid one is now rejected (it used to be accepted);
  - deleting a PO now soft-deletes its detail lines.
- **M4 changes the Job editor's source, not its look.** It needs a visual check by the owner.
- No migration is needed. Filtered unique indexes come per entity in later reviews.

## 6. Verification (owner)

| Check | |
|---|---|
| `dotnet build`, `ng build` | compile |
| Purchase Order | save with valid rows (works); an invalid id among valid ones is rejected with a message; delete a PO and confirm its lines no longer appear in PO-line reports |
| Job editor (M4) | light/dark, RTL, narrow width: same layout; add/remove group rows; blank new row removes without a prompt; saved row asks; save and reload |

## 7. Implementation record (2026-10-01)

Owner: D4-2 explained and accepted ("موافق نفذ"); the rule is recorded as stated in §3. D4-3 was approved with the go (full snapshot).

### M1 — frontend shared code (`SiGmaAngularFrontEnd`)

| File | Piece |
|---|---|
| `shared/utils/editable-rows.ts` (new) | `EditableRows<TRow, TSeed>`: `add` (dirty + focus), `replace`, `requestRemove` (untouched new row removed directly, others confirmed; index re-resolved after the dialog), `duplicateIndexes`, `savedId`, `onRemoved` |
| `shared/service/document-upload-tracker.service.ts` (new) | `DocumentUploadTracker` (component-provided): `validate`, `upload`, `markRemoved`, `finishSave`, `discard`, `uploading`/`cleaning` signals |
| `shared/service/file-upload.service.ts` | New `validationError`, `upload` (errors instead of returning a message as the path) and `remove`. The legacy `uploadFile`/`deleteFile` are marked, unchanged |
| `src/styles.scss` | Editor shell: `sigma-editor-page/-panel` (sharing the list shell rules), `-form`, `-body`, `-grid`, `sigma-field` (+`--full`, `__read`), `sigma-editor-totals` (+`__grand`), `sigma-editor-footer`, `sigma-icon-button`, title rule |
| `shared/components/field-error/field-error.component.ts` | Shows once the control is touched **or dirty** (the same rule the Job editor used) |

### M2 — backend (`SigmaBackend`)

| File | Change |
|---|---|
| `Services/Bases/Service.cs` | `AllExistAsync<TOther>(ids)`; `RemoveWithChildrenAsync(id, ct, children…)`, which loads each named collection through `Entry().Collection().LoadAsync()` and marks the active children deleted |
| `Services/VouchersServices/PurchaseOrderService.cs` | The ten detail-reference checks (Add + Update) go through one `InvalidDetailReferenceAsync` on `AllExistAsync`. New `RemoveAsync` override deletes the details with the header |

### M4 — Job reference (`SiGmaAngularFrontEnd`)

**Editor template:**
- Shared shell classes: page, panel, alerts, form, body, grid, fields, read values, totals, footer, and the Back/Cancel buttons.
- Six `app-field-error` with `requiredMessage`.
- Totals use `| money`.

**Editor code:**
- Host class `sigma-route-host`.
- `enumOptions` for the job and labour types.
- Group and row removal through `EditableRows`. Removal used to have **no** confirmation; now untouched new rows go directly and others are confirmed.
- New keys `job.editor.removeRowTitle/Message` and `removeGroupTitle/Message` in en and ar.

**Editor SCSS:** 350 → 150 lines. Only the workspace, group list and detail tables remain; the local error token became `--bs-danger`.

**List:** the private `enumOptions`, `currentMonthRange`, `parseDateRange`, `formatApiDate` and `formatDateText` were replaced by the shared utilities; route restore uses `parseDateValue`.

### M3 — books

- **UI 0.91:** blocks 0, 1, 13, 14, 15, 18 and 30.
- **Backend 0.41:** blocks 0, 2, 8, 14 and 19. The Miscellaneous Invoice row was re-verified: `AddAsync` always runs in one explicit transaction and posts the journal when it has lines.
- **Records:** `CHANGELOG.md`; skill §10 plus a revision row; packets regenerated, with `-Check` reporting 8×OK.
- **`Check-Translations.ps1`:** now reads several `key: 'value'` pairs per line. `job` + `validationMessages` hold 250 keys each, with no gaps. The whole-file figures are 1,528 keys missing from `ar`, 358 missing from `en`, and 5 case-only differences.

### Behaviour changes to verify (owner)

- **Build:** `dotnet build` and `ng build`.
- **Purchase Order:** an unknown detail id beside valid ones is rejected. Deleting a PO soft-deletes its lines.
- **PO and GRN are not linked** (corrected 2026-10-01). No entity references a purchase order or its lines by id: a GRN keeps only the text `LPONo`. Deleting a GRN does not touch the PO (the GRN has no `RemoveAsync` override), and deleting a PO affects only its own lines. Business question for the PO/GRN review: should a GRN reference the PO (received quantities, blocking the delete of a received PO)?
- **Job editor visuals:** light/dark, RTL, narrow widths. Expected small differences:
  - the field-error text now has an icon and is 11px;
  - Cancel uses the shared secondary button size;
  - an alert has 6px bottom margin.
- **Job editor behaviour:**
  - removing a saved group or row asks for confirmation;
  - an untouched new row is removed without asking;
  - Save and reload work as before.

### Suggested commits (not committed)

- `SiGmaAngularFrontEnd`: `Master-detail step: EditableRows, DocumentUploadTracker, FileUploadService upload/remove, shared editor shell classes; Job editor and list on the shared pieces`
- `SigmaBackend`: `Master-detail step: AllExistAsync and RemoveWithChildrenAsync in the base service; PurchaseOrder detail references and delete with lines`
