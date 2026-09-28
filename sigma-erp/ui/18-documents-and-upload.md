## 18. Documents and upload

> **Status: Transitional** — rows carry server-owned `subscriptionId` and the
> reference cleanup is fire-and-forget, backlog 19 and 29

### Shared Documents/Images presentation

The Documents tab in **Create New Vehicle** is the visual reference for
document and image collection sections. Its reusable presentation lives in
global `src/styles.scss` behind the opt-in `sigma-documents` prefix. Use these
classes instead of copying the Fleet component SCSS:

| Concern | Shared class |
|---|---|
| Section card | `sigma-documents` |
| Header, icon and title | `sigma-documents__header`, `__icon`, `__title` |
| Add/delete/upload actions | `sigma-documents__actions`, `__action` plus `--add`, `--delete` or `--upload` |
| Content and file input | `sigma-documents__body`, `__file-row`, `__file-input`, `__file-name` |
| Collection table | `sigma-documents__table-wrap`, `__table`, `__row-actions` |
| File/image list | `sigma-documents__list`, `__list-item` |
| Empty state | `sigma-documents__empty` |

The global selector is intentionally opt-in; never style every `table`, file
input or `.document-*` element globally. Feature components retain their own
typed forms, upload workflow, validation and payloads. The shared pattern owns
presentation only and already includes light, dark, RTL and responsive rules.

`app-documents` is reusable across a step and a dialog tab. It takes the parent
form plus the array name, so one component serves both:

```ts
@Input() parentForm!: FormGroup;
@Input() arrayName: string = 'documents';

ngOnInit(): void {
  const documentsArray = this.parentForm.get(this.arrayName) as FormArray;
  if (!documentsArray) this.parentForm.addControl(this.arrayName, this.fb.array([]));
}
```

```html
<!-- inside the step -->
<app-documents [parentForm]="companyPartnerForm"></app-documents>

<!-- inside the driver dialog tab -->
<app-documents [parentForm]="driverDraft" arrayName="documents"></app-documents>
```

Upload stores a server path on the row; it does not hold the file in the form:

The reference implementation subscribes bare. Follow block 28 instead — tear
down, release the busy flag, and handle failure:

```ts
onFileSelected(index: number, file: File): void {
  if (!this.isAllowed(file)) {
    this.uploadError.set('companyForm.fileTypeOrSizeInvalid');
    return;
  }

  this.uploadError.set('');
  this.uploadingIndex.set(index);

  this.fileService.uploadFile('PartnerDocuments', file)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.uploadingIndex.set(null)),
    )
    .subscribe({
      next: (path) => {
        this.pendingPaths.add(path);
        const row = this.documents.at(index);
        if (!row) return; // retained in pendingPaths for cleanup
        row.patchValue({ documentPath: path });
        row.get('documentPath')?.markAsTouched();
      },
      error: () => this.uploadError.set('companyForm.uploadFailed'),
    });
}
```

### Validation and abandoned uploads

Client checks are convenience only; the backend must re-validate extension,
MIME/signature, size and storage path.

```ts
private static readonly ALLOWED = ['pdf', 'jpg', 'jpeg', 'png'];
private static readonly MAX_BYTES = 5 * 1024 * 1024;

private isAllowed(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return DocumentsComponent.ALLOWED.includes(ext)
    && file.size > 0
    && file.size <= DocumentsComponent.MAX_BYTES;
}
```

State the allowed types and size limit in the UI, not only in the validator.

**Abandoned uploads.** A file uploaded to the server before the parent form is
saved is an orphan if the user cancels. `Fleet/Vehicle` is the reference: it
tracks paths, but its current cleanup fires one unobserved request per path and
clears the sets before those requests succeed. That part is **Legacy — do not
copy**. Coordinate cleanup and retain failures:

```ts
private readonly pendingPaths = new Set<string>();   // uploaded, not yet saved
private readonly removedPaths = new Set<string>();   // saved, removed in this session
readonly fileCleanupRunning = signal(false);

private deleteTrackedPaths(paths: Set<string>): Observable<string[]> {
  const candidates = [...paths];
  if (!candidates.length) return of([]);

  return forkJoin(
    candidates.map((path) =>
      this.fileService.deleteFile(path).pipe(
        map(() => ({ path, deleted: true })),
        catchError(() => of({ path, deleted: false })),
      ),
    ),
  ).pipe(
    map((outcomes) => {
      const failed: string[] = [];
      outcomes.forEach((outcome) => {
        if (outcome.deleted) paths.delete(outcome.path);
        else failed.push(outcome.path);
      });
      return failed;
    }),
  );
}

// After the parent save succeeds, remove paths referenced by the saved form from
// the pending set. Anything left there was replaced/removed before Save and is
// an orphan. Delete it together with removed paths, retaining failures.
private finishSuccessfulSave(): void {
  const persistedPaths = new Set(
    this.documents.controls
      .map((control) => String(control.get('documentPath')?.value ?? '').trim())
      .filter(Boolean),
  );
  persistedPaths.forEach((path) => this.pendingPaths.delete(path));

  this.fileCleanupRunning.set(true);
  forkJoin({
    removedFailed: this.deleteTrackedPaths(this.removedPaths),
    orphanedFailed: this.deleteTrackedPaths(this.pendingPaths),
  })
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.fileCleanupRunning.set(false)),
    )
    .subscribe(({ removedFailed, orphanedFailed }) => {
      if (removedFailed.length || orphanedFailed.length) {
        this.uploadError.set('companyForm.fileCleanupFailed');
      }
      this.finish(true);
    });
}

// Before discard/close, wait for cleanup to settle. Failed paths remain in the
// set and are reported; the server must also expire abandoned temporary files.
private discardAndClose(): void {
  if (this.fileCleanupRunning()) return;
  this.fileCleanupRunning.set(true);
  this.deleteTrackedPaths(this.pendingPaths)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.fileCleanupRunning.set(false)),
    )
    .subscribe((failed) => {
      if (failed.length) this.uploadError.set('companyForm.fileCleanupFailed');
      this.close();
    });
}
```

Replacing a file adds the old path to `removedPaths` rather than deleting it
immediately, so a failed save does not destroy the previous document.
Browser cleanup is best effort: a tab can be killed before any request runs, so
temporary uploads also need a server-side expiry/orphan-cleanup policy.
Add `companyForm.fileCleanupFailed` to both `en.ts` and `ar.ts` before using the
example message.

Row shape as currently built: `id`, `subscriptionId`, `documentType`,
`documentNumber`, `issuedBy`, `issueDate`, `expiryDate`, `documentPath`.

**`subscriptionId` should not be there.** It is the tenant, which is server-owned
— the backend must take it from the authenticated principal, never from the
request. The driver draft does the same thing
(`subscriptionId: Number(localStorage.getItem('subscriptionId') || 0)`). Both are
**legacy**: leave them until the backend contract is corrected together (block
30, items 8 and 19), and do not add server-owned fields to a new child row.

Server-owned, never client-supplied: tenant/`subscriptionId`, record number,
`createdAt`/`createdBy` and other audit values, delete flags, approval status,
calculated totals.

**Check:** `arrayName` passed when the array is not called `documents` · no
server-owned fields in a new row contract · existing `documentPath` preserved when no new
file is chosen · removal clears the path and marks touched · empty state present ·
issue/expiry ordering validated · never store CVV or card data in a document row.

---

