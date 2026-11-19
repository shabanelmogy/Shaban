<!-- Part of UI block 13: see ../13-modal-with-tabs.md. Same status and authority as the block. -->

### Shared source-document line picker
For equivalent document-cycle source-line selection, reuse
`shared/components/source-document-picker` (`app-source-document-picker`) with
EditorDialog, DataTable and QuantityInputDirective. No feature copy or new popup
palette. A blank source number opens eligible documents; an optional initial ID
opens that document. Read only its lines on demand, retain chosen lines and
quantities while changing documents, and apply only explicit selection. Cancel
leaves the parent draft intact; changed selection uses shared discard consent.
The adapter owns any dirty-parent replacement consent after Apply and the actual
parent mutation. Do not automatically import a whole order on Load.

Public contract: `documents` is a readonly list of numeric ID/label;
`initialDocumentId` is optional; `selections` holds document + line + quantity;
`loadDocument(id)` returns a finite `Observable<Result<SourcePickerDocumentDetails<T>>>`.
Optional `titleKey`, `lineLabelKey`, `orderedLabelKey`, `receivedLabelKey` and
`quantityLabelKey` keep source-specific wording accurate (requested/already
ordered for PR, ordered/received for GRN); defaults preserve existing consumers.
`layout="table"` is the compact known-source variant: one DataTable with line,
unit, remaining, checkbox selection and inline quantity to include. It omits the
document navigator and duplicate selected cards. Default `layout="split"` retains
multi-document navigation and selection summary. Use the compact variant when
the caller has already chosen one source; PR conversion now adopts it. Keep row
objects/arrays stable while typing quantities; resolve selection quantities by
source ID instead of rebuilding table inputs on each key. Missing stale lines
remain visible as unavailable rows until explicitly deselected or successfully
reloaded. Labels remain unique per picker instance; errors/Retry and server
validation remain the same in both layouts.

When the eligible document list is complete and owned by this picker, optional
`documentNavigation=true` extends compact table mode with an internal two-step
flow (GRN adoption, owner2026-10-24). With no initialDocumentId, show only the
complete document DataTable with per-source selected counts and UI4 FilterPanel
Search/Reset. An initial ID opens its compact line table directly. Local search
changes the displayed candidates only after Search; Reset clears it. Back in the
existing EditorDialog footer returns to the document table without closing,
discarding, emitting Apply or losing quantities. Insert is available from either
step for all retained valid picks. Cancel still compares the original session
baseline. Retained sources missing from a refreshed eligible list stay accessible
for review/removal; they gain no new eligibility or server capacity authority.
Loading/error/Retry/empty states stay within the active step; the picker keeps one
shell and one table scroll region at a time. The compact container uses the same
12px gap as the shared picker. Default documentNavigation=false preserves external
list adapters (PR-to-PO), and default split layout retains its existing behavior.

A compact picker whose caller owns an eligible-source list must retain an
explicit return path: optional `backLabelKey` projects the existing EditorDialog
footer action; `backRequested` returns cloned working selections and requests the caller's list. The picker compares
its own selection fingerprint before leaving, and optional
`backRequiresConfirmation` additionally guards a caller-owned review draft.
One discard decision covers these changes; Back never emits Apply.
For an approved multi-source contract, `retainOnBack=true` returns the working
picks without discard consent because the caller retains them; it does not
stage or save the parent editor. The caller keeps the original session baseline
through `discardBaseline` across table/list remounts, so Cancel still guards the
whole changed selection session. The source list may offer Insert for all retained
valid picks and shows per-document selection counts. Retain failed/unavailable
rows as disabled quantity rows that can still be deselected, including a failed
source read with no current document lines. Keep Cancel
separate: it closes selection-only callers without mutating their parent draft.
Multiple-source combination still requires the document's own frozen contract;
PR-to-PO allows compatible requests for one supplier, PO-to-GRN allows compatible
orders, and direct General/Job PO-to-Bill allows several orders of the same type,
supplier, effective currency and compatible bill branch. Bill uses this same
compact picker with internal document navigation and retained Back. Display all
selected source numbers and keep editable quantities/accounts in the main editor;
saved reload/print derive the complete source set from details. Keep source prices
and eligibility with the backend, preserve entered headers/files and account
choices across retries, and never let the picker save a bill. Receipt-based Bills
retain their existing multiple-receipt quantity selection and detail provenance.
For an editor-owned draft, Apply only stages typed source rows in
that editor; main Save alone persists, preserving entered header/attachments and
using the authoritative source command. A dedicated direct conversion may show
its populated review form before its final command; never persist from the line
picker itself.

Each line supplies numeric ID, display label/description/unit, ordered/received/
remaining/unitPrice and typed opaque `data`. Documents supply ID/label/effective
currencyId/code and lines. `applied` emits cloned selection wrappers; `closed`
requests unmount; `reloadDocuments` retries the eligible list. `documentLoading`
and `documentsError` reflect the adapter list read. `applyPending` freezes the
picker while parent consent runs; `applyError` surfaces parent validation within
its footer. Mount once under the owning editor with a conditional; DestroyRef
cancels unfinished reads and discard work. No per-candidate prefetch.

The picker owns positive whole quantities, remaining-balance and consistent
currency checks, duplicate selection keys, unavailable-line errors and selection
retention; it never clamps an invalid retained quantity after a source reload.
Fresh failed/missing source lines need Retry or removal. The adapter restricts
supplier, type, currency and eligible state; backend remains authoritative for
identity, price, capacity, atomic source locks and lifecycle. This UI does not
authorize another document to combine sources if its own contract forbids that.
Reads are operational and uncached. Do not reuse lookup-cache snapshots for
available quantity. Keep list/details/selections bounded, logical RTL styling,
shared secondary/danger actions, named quantity/search controls and EN/AR states.
