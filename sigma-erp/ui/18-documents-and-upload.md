## 18. Documents and upload

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Scoped document storage and field lifetime](18/01-scoped-storage-and-field-lifetime.md)
- [Adopted attachment permissions](18/02-attachment-permissions.md)
- [Typed partner rows and isolated child drafts](18/03-partner-rows-and-child-drafts.md)

> **Status: Canonical** — `DocumentUploadTracker` + `FileUploadService.upload/remove` (2026-10-01).
> Legacy: rows still carrying `subscriptionId` (backlog 8, 19) and the 21 screens that upload
> without tracking (backlog 29)

### One documents presentation

**`app-file-field`.** A single file control is
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

**Atomic multipart actions.** When an existing endpoint owns file storage,
attachment persistence and rollback cleanup together, use the same field with
`[selectionOnly]="true"` and a typed `FormControl<File | null>`. It validates through
`FileUploadService.validationError`, marks the local selection dirty/touched and never uploads,
deletes or mutates a tracker. The owning action sends the File to its existing multipart
endpoint. `folder` and `DocumentUploadTracker` are unnecessary in selection mode; stored-path
mode retains the required editor tracker and its cleanup lifecycle. Do not route an atomic
attachment through Media first or duplicate feature file validation/markup. Reviewed Agreement
documents and Movement View consume this opt-in mode.

**Shared atomic storage failure cleanup.** `FileStore.Upload` accepts
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

**Saved-file links.** Use `app-file-link [path]="savedPath"` for a read-only
stored-file action. It resolves root-relative/relative or same-origin absolute paths against
the current API origin, accepts HTTP(S) only and opens with `noopener noreferrer`. It shows no
action for an absent/invalid path. Return persisted `documentPath` in the read DTO rather than
inferring a file from `hasDocument` or a name. This reuses the existing FileStore/static-file
contract; it introduces no new file access policy. Reviewed identity and supporting-file
readers share it. Preserve historical files independently of current type upload eligibility.

**Private authenticated images.** When FileLink
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

**Source-order private documents.** The same closed
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

**Rental agreement private documents.** The closed
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

**Aligned file/action row.** When an existing
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

**Document column space.** The reusable
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
