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

**Saved-file links (2026-10-03).** Use `app-file-link [path]="savedPath"` for a read-only
stored-file action. It resolves root-relative/relative or same-origin absolute paths against
the current API origin, accepts HTTP(S) only and opens with `noopener noreferrer`. It shows no
action for an absent/invalid path. Return persisted `documentPath` in the read DTO rather than
inferring a file from `hasDocument` or a name. This reuses the existing FileStore/static-file
contract; it introduces no new file access policy. Reviewed identity and supporting-file
readers share it. Preserve historical files independently of current type upload eligibility.

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
