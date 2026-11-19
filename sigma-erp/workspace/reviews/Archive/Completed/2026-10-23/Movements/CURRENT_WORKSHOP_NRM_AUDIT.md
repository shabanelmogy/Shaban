# Current Workshop, Workshop Movement and NRM audit

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Movements/Workshop, WorkshopMovement and NRM frontend only |
| Contract | MOVEMENTS_CURRENT_FRONTEND_CONTRACT_FREEZE.md; historical MOVEMENTS_FRONTEND_CONTRACT_FREEZE.md retained |

Root completed initial recipe `-Check` and froze the handoff before delegation. UI01 list with controlled modal applies to all three; Workshop Movement owns one document collection (BE14), Workshop and NRM retain normal entity contracts (BE13). Backend, reference modules and generated packets are read-only. No screenshots were supplied.

## Before-change conformance evidence

| Concern | Book | Actual reference/owner | Target comparison |
|---|---|---|---|
| Bounded list, title, filters, grid | UI1/3/4/6 | Workshop/Job/components/list/list.component.html; styles.scss; FilterPanel/DataTable | All three targets already use sigma-route-host, shared list shell, app-feature-title, real filter form and app-data-table fill=true with authoritative server count/page. No feature stylesheet exists. |
| Controlled modal and record subtitle | UI10/13/15 | shared/components/editor-dialog public inputs and handleEscape; UI13 composition | All use controlled visible, mode and record subtitle. Shared shell owns mask/Escape; parent emits close only after its decision. |
| Pending decisions | UI10/14/28 | shared/utils/form-state freezeFormState; shared/utils/editable-rows requestRemove | Existing parent discard already freezes. Workshop Movement child Documents removal does not freeze parent; Documents template editable binds parentForm.enabled and tracker busy, so parent snapshot can safely freeze fields/Add/Remove. |
| Requests, feedback and recovery | UI2/22/28 | Job bindListQueries; apiErrorMessage/composedReadErrorMessage; service skip-error headers | Lists already switchMap reads and export applied snapshots. Detail and lookup callbacks check session. Lookup Retry is only gated by lookupsLoading, allowing retries during pending parent decisions; saves restore with blanket enable instead of saved control state. |
| Validation and focus | UI17/18/19/27 | DatePickerDirective; createDocumentRow/documentPayload; Documents.fieldId; scalar int32ValueValidator | Frozen validators match signed nullable Int32 Workshop Movement mileage and nullable string NRM mileage. WM invalid documents attempts focus at nonexistent workshopMovement-documents rather than actual child input. |
| Upload cleanup | UI18/28 | DocumentUploadTracker discard/finishSave | WM uses actual pending paths and Retry without repeating Save. Pristine discard does not freeze controls during asynchronous cleanup, and failure/Retry error callbacks lack full identity gates. |
| Readable source | Master5 G10 | Job list structured source | Target TS files contain multi-statement lines/inline blocks and templates compress complete regions. Expand source without changing contracts. |

## Confirmed findings to implement

1. Gate lookup retries and freeze parent controls through the shared snapshot while lookups run; cancel obsolete lookup batches on identity changes.
2. Preserve intentional disabled control state after failed saves through the same shared owner.
3. Freeze WM document-removal decisions with a bounded parent effect observing the actual shared confirmation signal. Do not change the approved Documents reference.
4. Freeze pristine WM discard cleanup; gate deferred cleanup and callbacks by current record/session/mode, retain cleanup Retry and never repeat successful Save.
5. Focus the first actual invalid WM document input and include loading/export in Add presentation gates.
6. Expand compressed source under G10 and review the scoped diff.

## Handoff

Implementation and final conformance pending. Root owns shared integration, translations if needed, existing movements user guide and overall closure. Owner compilation/runtime/browser/theme/RTL/print and cleanup acceptance remain pending; prohibited commands will not be run.

## Final root reconciliation

All six confirmed findings are implemented. Save/lookup/discard use the shared snapshots; obsolete lookup batches cancel before session replacement. The parent observes the actual Documents pending signal without changing the reference module. Document validation focuses actual input IDs. Pristine cleanup and callbacks are identity-gated. Root also implemented existing UI22 composite success ownership: suppress the POST toast and emit one success only after tracker cleanup, with Retry retaining the saved draft and never repeating POST. List presentation gates match handler guards. Nine existing spec import corrections across Movements include five files in this stream; no test/assertion added or executed. Runtime TS formatting has been reconciled by normalized AST and direct semantic diff. Syntax/import/translation and whitespace checks pass. Seven EN/AR guide topics and root reconciliation are complete in ../MOVEMENTS_CURRENT_FEATURE_REVIEW.md; owner runtime/visual/cleanup/print acceptance remains pending.
