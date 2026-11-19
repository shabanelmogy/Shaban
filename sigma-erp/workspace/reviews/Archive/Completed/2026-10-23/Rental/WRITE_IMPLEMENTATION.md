# Rental write implementation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Authority: full Sigma AGENTS, sigma-screen-refactor skill; frozen CORE and WRITE handoffs. Root recipe check reports all packets stale except Phase01; canonical books govern. Shape: routed document editor (UI13 D4-2) and typed domain-action/read dialogs. No business/API/calculation changes.

| Concern | Book | Actual reference and shared owner | Target decision before editing |
|---|---|---|---|
| Routed shell | UI1/3/13 | Workshop/Job/editor template; styles.scss sigma-editor-page/panel/form/body/scroll/footer | Agreement/Booking replace fixed-position local screen and viewport CSS with container-fill; one scroll per editor region |
| Totals/duration | UI14/24 | Workshop Job summary; SummaryCardsComponent public slim/row/min140/max80 | Replace local cards, preserve preview vs persisted values |
| Fields/dates | UI16/17/19/27 | Job/editor sigma-field and appDatePicker; FieldError, date-utils validators/transport, TranslateOptionsPipe | Direct shared imports; local date/time wire; no UTC shift |
| Dirty exits | UI10/13 | Fleet/Vehicle/DetailsComponent.canDeactivate; ConfirmationDialogService | feature CanDeactivateFn gates every routed exit |
| Upload lifecycle | UI18 | Vehicle DetailsComponent save/retryCleanup; DocumentUploadTracker.finishSave/discard | await cleanup, retain failed paths; retry never repeats persistence |
| Child removals | UI14 | EditableRows.requestRemove and confirmationPending/canMutate | Booking document helper with same-row re-resolution |
| Dialog lifecycle | UI13/22/28 | EditorDialogComponent; Fleet/VehicleService details controlled visibility | padded body, muted identifier subtitle, shared states, pending-close lock |

The table above records the pre-edit decisions. Final source reconciliation follows; owner build/runtime/browser/RTL/theme/print verification remains pending.

## Final reconciliation

Root completed the partial write work: Agreement/Booking shared routed shells, typed lookup metadata, numeric/error/date owners, SummaryCards, shared invalid-field focus and guarded route exits. Pending Save/discard locks the form. Typed date-only text uses parseDateValue; date-time uses local toApiDateTime; stored Booking document dates reload at local midnight.

Booking aggregate documents and Agreement deposit receipts use editor-scoped DocumentUploadTracker. Confirmed discard retains saved originals and waits for pending upload cleanup. Successful persistence enters a cleanup-only state; failure exposes Retry without another aggregate/deposit save, and success toast/navigation wait for cleanup. Booking child removal uses EditableRows. Agreement's immediate saved document endpoint retains selectionOnly FileField and its original persistence workflow.

Agreement/Booking child dialogs retain their existing reason/date/deposit/history/journal/print/document contracts with shared dialog padding/title/subtitle/state/error owners. Required lookup failures gate Save and expose recovery. No calculated totals, new APIs, permissions or backend writes were invented.

Final conformance and owner cases: `F:/My Work/Sigma/reviews/RENTAL_FEATURE_REVIEW.md`. Complete source-only check evidence: `F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/Rental/FINAL_SOURCE_VERIFICATION.md`. No prohibited commands ran.
