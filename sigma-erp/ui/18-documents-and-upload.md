## 18. Documents and upload

> **Status: Canonical** — `DocumentUploadTracker` + `FileUploadService.upload/remove` (2026-10-01).
> Legacy: rows still carrying `subscriptionId` (backlog 8, 19) and the 21 screens that upload
> without tracking (backlog 29)

### One documents presentation

**`app-file-field` (2026-10-01).** A single file control is
`<app-file-field [inputId] folder="…" [accept] [control]="form.controls.path" />`
(`shared/components/file-field`): it draws the box below, uploads through the editor's
`DocumentUploadTracker`, checks `accept` and the shared size/type rules, marks a replaced or
removed saved file for deletion after save, shows a rejected file with `app-field-error`, and shows
the name only when the control is disabled. The feature writes no upload code.

Stored-path `app-file-field` optionally emits `storedFile` after a successful upload with
`{ originalFileName, filePath }`. Use it only when the existing API preserves the original
filename separately from the server path (Job Estimation logs). The control and tracker
still own path/dirty/cleanup state; no emission is made for failed or selection-only
uploads. Consumers clear obsolete metadata when their path is cleared. No API/storage
contract is introduced by this additive output.

The shared file field passes both its bound `control` and its upload-rejection `message`
to `app-field-error`. A nonempty rejection message takes precedence; otherwise touched/dirty
control errors (such as the document/profile path length) appear through the same shared
presentation. Do not add a second feature-local file error below the shared field.

**Atomic multipart actions (2026-10-03).** When an existing endpoint owns file storage,
attachment persistence and rollback cleanup together, use the same field with
`[selectionOnly]="true"` and a typed `FormControl<File | null>`. It validates through
`FileUploadService.validationError`, marks the local selection dirty/touched and never uploads,
deletes or mutates a tracker. The owning action sends the File to its existing multipart
endpoint. `folder` and `DocumentUploadTracker` are unnecessary in selection mode; stored-path
mode retains the required editor tracker and its cleanup lifecycle. Do not route an atomic
attachment through Media first or duplicate feature file validation/markup. Reviewed Agreement
documents and Movement View consume this opt-in mode.

**Shared atomic storage failure cleanup (2026-10-14).** `FileStore.Upload` accepts
an optional cancellation token and removes only the file created by that attempt
when copying fails or is cancelled, after disposing its stream. A failed
`CreateNew` must never remove an existing file. Cleanup failure is logged internally
and preserves the original exception. Atomic multipart callers pass their request
token and clean earlier successful uploads if a later upload or persistence fails;
they never remove historical saved paths on that failure. Existing callers retain
the optional-token signature and normal signature/type/size/tenant validation.
This shared storage repair serves Media and atomic attachment consumers; source
conformance does not prove runtime cancellation, disk failure or process-crash
recovery. No background orphan sweeper is implied.

**Saved-file links (2026-10-03).** Use `app-file-link [path]="savedPath"` for a read-only
stored-file action. It resolves root-relative/relative or same-origin absolute paths against
the current API origin, accepts HTTP(S) only and opens with `noopener noreferrer`. It shows no
action for an absent/invalid path. Return persisted `documentPath` in the read DTO rather than
inferring a file from `hasDocument` or a name. This reuses the existing FileStore/static-file
contract; it introduces no new file access policy. Reviewed identity and supporting-file
readers share it. Preserve historical files independently of current type upload eligibility.

**Private authenticated images (source adoption,2026-11-09).** When FileLink
consumes a private authenticated image endpoint, use its optional
`protectedImage`, `accessRequirement`, `preview` and `imageAlt` inputs instead
of a direct static `img`/anchor. The existing FileLink owner fetches the typed
image blob through the interceptor-enabled HttpClient, retains one object URL,
and revokes it on path/access/context changes or destruction. Its denied watcher
also invalidates a completed read and survives rapid revoke/regrant through a
fresh read; failures retain explicit Retry without a loop. Only JPEG/PNG blobs
become preview/link targets. Preview reads use UI22's page loading owner, while
busy/aria-busy/error remain on the file. A viewer already opened by the browser
cannot be retracted; do not claim that revoking an object URL erases a download.
Ordinary FileLink consumers retain their existing same-origin static contract.
The current image opt-in is AccidentImages at `Media/accident-image`, guarded by
Media.ReadAccidentImage plus the owning editor requirement. The same owner also
accepts the closed `protectedResource='vehicle-document'` input, using
`Media/vehicle-document` and Media.ReadVehicleDocument. This resource accepts
JPEG/PNG/PDF blobs; PDF is linked without an image preview. Callers cannot supply
arbitrary authenticated URLs, and changing resource expires the previous read.
The closed resource set also includes `correction-attachment` at
`Media/correction-attachment`, with Media.ReadCorrectionAttachment and the
owning correction request/model View grant. This resource accepts the same
JPEG/PNG/PDF types. A body-appended editor dialog sets `localReadProgress=true`;
FileLink then renders its existing local StateMessage and does not acquire a
page lease. Capture that progress scope at subscribed read start for both the
host and finalize; input changes must not introduce competing progress or
release another request's count. The default remains page progress for existing
consumers. Correction ownership/history and schema remain in its feature contract.
Backend company,
record/branch and draft-owner checks remain authoritative and are not inferred
from these inputs. The private server store is outside wwwroot and its former
static folder is denied; file lifecycle/schema decisions belong to the frozen
feature contract. Source conformance and source specifications2026-11-09;
browser/SQL/storage acceptance pending.

**Source-order private documents (source-only,2026-11-10).** The same closed
FileLink owner accepts `purchase-order-document` with
`Media.ReadPurchaseOrderDocument` and the source editor's requirement. Canonical
root-relative `/tenant/PurchaseOrderDocuments/…` paths also select this resource
in existing saved-file viewers, preventing a static-link fallback for the new
private files. Reuse the same JPEG/PNG/PDF validation, actor/path/resource
invalidation, object-URL cleanup and dialog-local progress. Storage, draft
uploader/claim rules and retained saved ownership remain in the frozen
LeaseQuotation source-order contract; this does not certify older PO files or
general PurchaseOrder permission adoption. Source specifications are written;
runtime/storage/browser acceptance is pending.

**Rental agreement private documents (source-only,2026-11-10).** The closed
`rental-agreement-document` resource uses `Media/rental-agreement-document`
and requires RentalAgreement.View and RentalAgreement.GetDocuments. Canonical
`/tenant/RentalAgreementDocuments/…` paths select the same resource in saved
viewers. The FileLink owner still checks the allowed JPEG/PNG/PDF content types.
An adopted mounted document viewer supplies `contextAllowed` and
`contextCancelled$` when its document can expire while the file link is
mounted. The predicate guards reads and object URL publication. The notifier
cancels in-flight reads and revokes published object URLs even if the actor and
grants remain unchanged. Protected reads in the dialog use local progress.
Storage and agreement linkage belong to the frozen feature contract. Runtime
and storage acceptance remain pending.

**Aligned file/action row (owner clarification,2026-10-22).** When an existing
FileField is followed by FileLink for the same path, project that existing link
inside FileField instead of rendering it on a second line. FileField owns an
internal `.sigma-file-field__row`: shrinking file box, then the intrinsic-width
link,8px apart, both on the34px control track. Existing upload/clear icons remain
inside the file box; full-width FieldError remains below the whole track. An
empty/invalid link adds no action or phantom gap. Do not add View to consumers
that did not already expose it or alter FileLink's same-origin URL guard.

Use this composition for existing adjacent pairs; preserve path/control/folder,
print classes and handlers. EditableCollectionTable owns vertical middle
alignment and matching34px Remove height for attachment rows (UI14), including
when file validation grows the row. The file/View/error group stays together
and is centered as one unit; adjacent row actions center in the full row under
the owner's2026-10-31 correction. Preserve column/table semantics, native
labels, filename ellipsis/title, RTL/theme, disabled controls and internal table
scrolling. No local table-cell flex conversion, per-screen attachment stylesheet
or duplicated upload/cleanup logic. Verify long/empty names, validation and
narrow widths with real shared controls in both directions/themes.

**File cell (shared, 2026-10-01).** A file control — in a field or in a collection cell — is
`div.sigma-file-field`, drawn as one 34px control box like the other fields: the hidden
`input[type=file]`, then `span.sigma-file-field__name` with the file name (`is-empty` when none), then
the icon actions at the end — an upload `label.sigma-secondary-button.sigma-icon-button` that opens
the input (upload state from `DocumentUploadTracker.uploading()`) and a remove `sigma-icon-button`
that calls `markRemoved`. Markup order is visual order (name, upload, remove). In an editable table the file column
is headed with a plain word (*Attachment*, not *Document Path*) and gets `minWidth: '220px'` so the name
and both icons fit inside the box. A file the picker rejects (`DocumentUploadTracker.validate`) shows below it with
`<app-field-error [message]="key" />`. Reference: `Customers/Individual/IndividualPartner/components/details`.

A document or image collection is an `app-editable-collection-table` (block 14) whose rows are
the document fields plus a file cell (file input, file name/link, upload state). There is no
separate documents stylesheet: the former `sigma-documents__*` classes this block described do
**not** exist in `src/styles.scss` (verified 2026-10-01), and screens must not add them.
`app-documents` (Company) is the current reusable component on that table.

**Document column space (owner request,2026-10-31).** The reusable
`app-documents` allocates explicit UI14 column widths: type280px, number240px,
issuer240px, issue/expiry180px each, attachment320px and international140px,
with a1680px table minimum. This keeps complete day/month/year inputs and wider
text/file controls available in dialog tabs and other consumers. Use the
existing column metadata and shared horizontal frame overflow; do not squeeze
these controls to the dialog width or add feature cell styles. Arbitrarily long
text/file names retain their normal editing/ellipsis behavior. Dates, validation,
upload ownership and print behavior are unchanged; visual/RTL/theme acceptance
remains pending when verification is source-only.

`app-documents` is reusable across a step and a dialog tab. It takes the parent
form, array name and an `idPrefix`, so one component serves both. The parent creates
the typed `FormArray<DocumentRow>` before rendering; the child never creates an
unrelated empty form when that array is missing.

```ts
@Input() parentForm!: FormGroup;
@Input() arrayName: string = 'documents';
@Input() idPrefix = 'company-document';

ngOnInit(): void {
  const documentsArray = this.parentForm.get(this.arrayName) as FormArray<DocumentRow>;
  // EditableRows reads this existing parent-owned array.
}
```

```html
<!-- inside the step -->
<app-documents [parentForm]="companyPartnerForm"></app-documents>

<!-- inside the driver dialog tab -->
<app-documents [parentForm]="driverDraft" arrayName="documents"></app-documents>
```

### Scoped document storage and field lifetime — 2026-11-12

The reusable Company DocumentsComponent accepts optional `uploadFolder`,
`fileAccessRequirement`, `fileAllowed` and `fileCancelled$`. Its default folder
remains CustomerDocuments for existing consumers. A parent with a reviewed
private server contract supplies that folder rather than replacing this table.
The child passes the access requirement, operation/publication predicate and
publication cancellation into the existing FileField; it does not implement a
second uploader or grant access by selecting a folder. DocumentUploadTracker
still owns sent upload settlement and cleanup. Do not make its publication
predicate depend on its own uploading busy flag.

WorkshopMovement selects WorkshopMovementDocuments and the closed FileLink
resource `workshop-movement-document`, requiring WorkshopMovement.View and
Media.ReadWorkshopMovementDocument. It uses dialog-local read progress and the
mounted document's context predicate/cancellation notifier. Canonical paths
select the same protected resource automatically, never a static URL fallback.
Backend ownership and historical-branch validation are defined in
AUTHORIZATION_140_144_REMEDIATION_CONTRACT_FREEZE; storage lives outside wwwroot.
Previously stored public paths are not accepted by new writes. Their known
WorkshopMovement ownership also denies their static access, including deleted
ownership history, without opening general CustomerDocuments access.
Source specifications and integration checks are distinct from pending
storage/HTTP/browser acceptance; selecting this resource grants no runtime proof.

### Adopted attachment permissions — 2026-11-07

Permission adoption stays in the existing editor tracker and FileField, not
the shared FileUploadService transport. An adopted editor calls
`DocumentUploadTracker.setAccessRequirements(uploadPermission?, cleanupPermission?)`.
Undefined requirements preserve existing consumers. `canUpload()` and
`canCleanup()` use the same current-session evaluator as UI26; no HTTP per file
control. Fleet requires Media.UploadMedia plus Media.DeleteMedia before a new
stored upload and Media.DeleteMedia alone for cleanup.

`FileField.permission` optionally adds the owning editor requirement. Stored
upload and local removal check that requirement plus the tracker's corresponding
capability in both presentation and handlers; selectionOnly checks its owning
requirement without requiring Media grants. The filename and existing FileLink
remain available under the owning screen's read contract.

An adopted editor can supply `FileField.operationAllowed` to fence both picker
results and clear events against the mounted document's current lifetime. This
guard applies when the native file chooser returns as well as when the control
opens. Keep the separate publication predicate and notifier for the outcome of
an upload that has already started.

An upload is checked inside defer before HTTP. Its returned path and pending
tracking survive revocation inside the editor tracker. **Publication correction
(2026-11-09):** FileField must not apply that returned path, mark the previous
saved file removed or emit storedFile into a revoked/replaced field. Capture
actor, control, old value, folder and input identity before sending, and use the
owning permission's denied notifier to expire publication permanently, including
rapid revoke/regrant. Compare the capture again before publication. This does
not cancel the sent POST or forget its path: cleanup remains tracker-owned.
The optional `publicationCancelled$` and `publicationAllowed` inputs express a
mounted document/route lifetime. Returning to the same route later cannot revive
an expired callback. They fence publication, never sent tracker bookkeeping.
The same publication predicate travels as CAN_PRESENT_API_OUTCOME through the
optional HttpContext accepted by DocumentUploadTracker.upload and
FileUploadService.upload, so a late failed upload cannot open a global error
dialog for the replacement actor/document. Keep the one existing interceptor
feedback owner for a currently owned upload; do not cancel a sent upload to
suppress its feedback.
The earlier storedFile-survives-revocation wording is superseded. Each upload
operation shares its one sent source in the editor
tracker with `share` and a `ReplaySubject(1)` connector after defer, with
`resetOnError`, `resetOnComplete` and `resetOnRefCountZero` all false. The local
RxJS `shareReplay` resets after errors and would resend the same operation's
POST on a later subscription; retaining both success and error outcomes prevents
that replay. An explicit retry creates a new upload operation. A destroyed
tracker rejects a new subscription before sending HTTP; an already sent POST has
no tracker-destruction cancellation. Destroying a FileField, unsubscribing its
consumer or destroying the editor therefore cannot cancel that mutation before
the returned path reaches pending bookkeeping. Field publication still expires
on destruction. This does not initiate cleanup after destruction or provide
durable orphan recovery; server orphan lifecycle remains a separate contract.
Do not repeat a POST by subscribing twice to the same operation. markRemoved
remains local. finishSave/discard may succeed without a
Delete grant when no path needs deletion; each actual new DELETE checks cleanup
inside defer. Denied/failed paths stay pending and return as failures for the
existing cleanup-only Retry. A sent successful DELETE is accepted even when the
grant is later withdrawn. Never gate that cleanup on an editor write permission
which may have been withdrawn after a successful aggregate Save.

**Cleanup teardown boundary (source reconciliation,2026-11-09).** Keep tracker
destruction cancellation on the idle-upload wait upstream of `switchMap(work)`.
Do not start cleanup when destruction itself releases that wait. Once cleanup
has sent its DELETEs, tracker teardown must not cancel those mutations; the
consumer suppresses stale UI callbacks and retains the existing per-request
Media check. Together with the sent-POST lifetime correction (2026-11-10),
destruction cancels an idle cleanup wait while the sent upload completes without
starting a deferred DELETE. This creates no durable orphan storage and does not
authorize cleanup under a replacement actor. Source-written upload/cleanup
lifetime specifications remain unexecuted under the source-only boundary.

Use EditableRows' row-specific canRemove/onRemoving hooks for attachment rows
(UI14): a pathless row does not require Media.DeleteMedia, and a denied or
cancelled removal never marks its path for deletion. These opt-in policies do
not create a server file-access policy or claim that a hidden control secures a
static URL. Regression evidence includes denied new requests, sent outcomes,
cleanup Retry, and unchanged unadopted file layout/controls.

**Replacement permission lifetime (source reconciliation,2026-11-09).** Keep
FileField's `permission` as the owning editor requirement. Its optional
`uploadPermission` adds selection/replacement requirements to `canPick` and the
permanent sent-upload publication expiry watcher, without restricting `canRemove`.
For a saved vehicle document, replacement requires UploadMedia and DeleteMedia;
clearing requires the editor and cleanup grants without UploadMedia. Pass a
row-specific requirement that does not depend on upload busy state: the editor
disables the form while the upload is sent. A revoked replacement requirement
must expire publication even after rapid regrant; retain the original control
and track the new upload for cleanup. Never use control.disabled as this lifetime
signal or mark the original removed after expiry. Existing consumers that omit
uploadPermission retain their current contract. Source specifications cover
cleanup withdrawal during replacement and clearing without upload; execution
and browser/storage acceptance remain pending.

Upload stores a server path on the row; it does not hold the file in the form. The editor
provides one `DocumentUploadTracker` (`shared/service/document-upload-tracker.service.ts`), which
tracks what was uploaded but not yet saved and what was removed, and cleans up:

```ts
@Component({ …, providers: [DocumentUploadTracker] })
export class FeatureEditorComponent {
  readonly uploads = inject(DocumentUploadTracker);

  onFileSelected(index: number, file: File): void {
    const invalid = this.uploads.validate(file);          // 'validationMessages.fileType' | 'fileSize'
    if (invalid) { this.uploadError.set(invalid); return; }
    this.uploadError.set('');
    const row = this.documents.at(index);
    this.uploads.upload('CustomerDocuments', file, index).subscribe({
      next: (path) => {
        this.uploads.markRemoved(row.controls.documentPath.value);   // the replaced saved file
        row.controls.documentPath.setValue(path);
        row.markAsDirty();
      },
      error: () => this.uploadFailedRow.set(index),   // the interceptor showed the message; the row keeps its file
    });
  }

  removeDocument(index: number): void {                    // after the row confirmation
    this.uploads.markRemoved(this.documents.at(index).controls.documentPath.value);
    this.documents.removeAt(index);
  }

  private afterSave(saved: FeatureDTO): void {
    this.uploads.finishSave(saved.documents.map((d) => d.documentPath)).subscribe((failed) => {
      this.cleanupCompleted(failed);
    });
  }

  private discardAndClose(): void {
    this.uploads.discard().subscribe((failed) => this.cleanupCompleted(failed));
  }

  private cleanupCompleted(failed: string[]): void {
    if (failed.length) {
      this.uploadError.set('feature.fileCleanupFailed');
      return; // remain open; Retry repeats this cleanup, never the successful save
    }
    this.close();
  }
}
```

- **`upload`** validates the type (pdf, jpg, jpeg, png) and the size (5 MB), shows `uploading()` per row, and errors instead of returning a message as a path. The legacy `FileUploadService.uploadFile` returns messages like "Invalid file type." as its value — never use it in new or reviewed code.
- **Deletion timing.** A replaced or removed saved file is deleted only after a successful save, so a failed save never loses the previous document. `discard` deletes only unsaved uploads.
- **Server side.** Browser cleanup is best effort (a tab can close first), so the server must also expire abandoned uploads, and it re-validates the extension, signature, size and path.
- **Translations.** Add the feature's cleanup-failure key to both `en.ts` and `ar.ts`.

### Typed partner rows and isolated child drafts

Partner editors reuse `shared/models/partner-editor.ts` and
`shared/utils/partner-editor-forms.ts`: `DocumentRow`, `CardRow`, their factories
and payload mappers, address controls, optional date validation and issue/expiry ordering.
Required card text uses the shared factory's nonblank validation before payload trimming;
whitespace-only card number, security code, holder name or bank name cannot pass as filled.
The row contract is `id`, numeric `documentType`, `documentNumber`, `issuedBy`,
`issueDate`, `expiryDate`, `documentPath`, `isInternational`.

**One rule set for partner documents (G5, decided 2026-10-01).**
`CustomerDocument` is shared by individuals, companies and drivers. It has one row factory, one
validator set, one upload folder and one payload mapper (the shared ones above), and every
partner screen adopts them; a screen-local variant is a finding.

| Field | Rule |
|---|---|
| `documentType`, `documentNumber`, `issueDate`, `expiryDate` | Required: expiry alerts and the issue/expiry order depend on them |
| `issuedBy`, `documentPath`, `isInternational` | Optional |
| Upload folder | `CustomerDocuments` |

The backend VM carries the same `[Required]` set. Individual, Company and the nested driver
draft adopt the shared rows/factories and explicit wire enum (2026-10-01, source-only).
`PartnerDocumentType` mirrors explicit backend wire values; do not calculate IDs from
string-enum positions. Older rows carrying tenant/audit controls remain backlog 8 and 19;
reviewed Company and Driver writes contain none.

An isolated nested editor provides its own `DocumentUploadTracker`. Cancel calls its
`discard()`, leaving the parent's saved files and other drafts alone. Draft Save validates
the child form, then calls `draftUploads.transferTo(parentUploads)` and commits the form to
the parent. It does not call `finishSave`: only successful aggregate persistence makes the
files saved. Block draft Save/Close during upload or cleanup. When a collection helper removes
a whole row, retain the original saved paths and compare them with the successful payload to
mark paths that disappeared; include nested documents in that comparison.

**Concurrent uploads and cleanup (2026-10-01).** The tracker counts subscribed uploads,
including overlapping controls, and remains busy until all finish. Cleanup waits for uploads
before taking its pending-path snapshot and blocks new uploads while cleaning. Transfer
requires idle trackers. Editor Save, step navigation and Close use that complete busy state.
Nested tab navigation uses the shared `app-editor-tabs.disabled` input while
uploading/cleaning, and document collection mutations are unavailable during
that same period. Otherwise removing a row or destroying its file-control tab
tears down the subscribed upload before its path can reach the owning tracker.
Company Documents and Driver fields consume these existing shared busy signals;
no separate upload-state framework is introduced (2026-10-02, source-only).
Keep failed cleanup paths for retry and show one localized inline message; do not close on
cleanup failure or repeat the successful aggregate save. A discard failure also keeps the
editor open. Tracker cleanup requests suppress interceptor presentation because the editor
owns that one feedback channel.

Server-owned, never client-supplied: tenant/`subscriptionId`, record number,
`createdAt`/`createdBy` and other audit values, delete flags, approval status,
calculated totals.

**Check:** one `DocumentUploadTracker` per editor, `upload`/`remove` (never `uploadFile`) ·
cleanup after save and on discard · documents on `app-editable-collection-table` ·
`arrayName` passed when the array is not called `documents` · no
server-owned fields in a new row contract · existing `documentPath` preserved when no new
file is chosen · removal clears the path and marks touched · empty state present ·
issue/expiry ordering validated · never store CVV or card data in a document row.

---
