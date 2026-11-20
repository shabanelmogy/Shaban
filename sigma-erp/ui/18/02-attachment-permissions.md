<!-- Part of UI block 18: see ../18-documents-and-upload.md. Same status and authority as the block. -->

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
