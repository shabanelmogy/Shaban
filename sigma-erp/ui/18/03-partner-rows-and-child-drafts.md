<!-- Part of UI block 18: see ../18-documents-and-upload.md. Same status and authority as the block. -->

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

**Concurrent uploads and cleanup.** The tracker counts subscribed uploads,
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
