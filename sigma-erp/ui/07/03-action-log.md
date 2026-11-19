<!-- Part of UI block 7: see ../07-action-button-cycle.md. Same status and authority as the block. -->

### Document action log (owner decision 2026-10-22)

**One label (owner2026-10-24).** Use **Log** in English and **السجل** in Arabic
for the document row action and its dialog title, through `documentLog.title`.
Do not mix Audit Trail and Log across document screens. Decision history
stays inside Approvals and is distinct from this captured write log. A technical
audit administration screen can keep its own descriptive title.

Where a document exposes a Log action, open a read-only dialog using the shared
document-action-log component. Supply its identity and a typed feature loader;
the feature endpoint checks record existence and view access, then reads the
tenant-scoped central audit stream. Show actor/time, translated action, optional
reason, and available field changes; show loading, empty, transport/business
errors and Retry. Keep the log component and field-change formatter shared so
similar documents adopt the presentation without copying feature-specific UI.
For a new consumer, add a saved-row Log action, a typed service method calling
its feature read endpoint, and a dialog host supplying the saved numeric record
ID and `loadEntries` callback to `app-document-action-log`. Use the translated
dialog title with the document number as subtitle. Refresh when record identity
changes; do not offer Log for an unsaved draft. Map both unsuccessful Result and
HTTP failure to visible feedback and Retry. Preserve the shared formatter's
redaction/empty-detail presentation instead of parsing audit JSON per feature.
The audit stream captures successful tracked create/edit/delete and state writes;
older metadata-only records and out-of-band/bulk writes cannot gain fabricated
details. The list action remains separate from Approval Status, which owns
decision controls and eligibility. A reason-required correction uses a typed
form dialog and backend guard, not the log viewer. Refresh the row and any open
log after a successful write or decision; the Log viewer never changes state.
Backend block 18 owns the per-model write/identity/transition checklist and
the detached-update before-value verification caveat. Purchase Order Log is
the first consumer, not a universal permission or approval policy.
