| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Stock existing-editor lifecycle contract — 2026-10-09

Scope: existing Item/ItemType/UnitsOfMeasures and ItemRequisition/ItemIssue/
ItemReturn/StockTransfer editors, Issue/PurchaseRequest actions, their current
list/print/report interactions. Existing DTOs/routes/filters/statuses/minimums,
lookup and backend semantics remain authoritative. No new persisted field,
calculation, transition, stock ledger, permission or access restriction.

## Frozen decisions and source evidence

Item input remains name/type/barCode/supplierItemCode/price/maximumQuantity/
stockBranchId/unitsOfMeasuresId/note; UOM name; ItemType name/type. Aggregate
inputs remain dateAndTime/jobId (transfer destination branchId), complete owned
row snapshot with retained IDs; Return has notesReturnReason; Requisition rows
include notes. Quantities remain existing positive Int32 rules. Transfer keeps
the prior frozen source/destination interpretation and unique item/source pair.

Requisition Issue remains POST `{id}/Issue` with dateAndTime and selected positive
`{requisitionItemId, quantity}` lines bounded by authoritative remaining quantity.
PurchaseRequest remains POST `{id}/PurchaseRequest` with existing supplier/date/
branch/quotation/notes/discount/documents and editable row quantity/UOM/unitPrice/
description. Source item/job/status/remaining and persisted totals remain server-owned.
No endpoint, payload or backend behavior changes are approved by this lifecycle slice.

### Existing uniqueness preflight consumer amendment

ItemTypeService and UnitsOfMeasuresService already declare Name in UniqueColumns;
the authenticated generic `SiGmaControllerBase.CheckUnique` and
`Service.CheckUniqueAsync` accept `{fieldName:'Name', value:trimmedName,
excludeId:positiveEditId|null}`, query tenant/live rows, exclude self and return
`entity.isAvailable`. Existing BaseService.checkUnique suppresses both feedback
interceptors for inline validation. UI12/BE8 require the name blur validator and
`settleStepValidation` before Save. Add those missing consumers using existing
async-uniqueness helpers; no new endpoint/schema/index/business uniqueness rule.
Item.type remains its own direct ItemTypeEnum; ItemTypes uses ItemCategory and
no itemTypeId relationship is introduced.

`canDeactivate` must be side-effect-free until subscription: capture the same
record/lifetime, use `defer`, recheck visibility/finished/busy/identity, freeze
controls using shared `freezeFormState`, set pending then open one confirmation.
Reject stale/duplicate decisions and preserve dirty values on cancellation.
Restore prior disabled state only for the same active editor without saving or
attachment cleanup. X/Cancel/Escape and route guard share this decision; committed
Save bypasses discard. EditableRows removal opts into existing freezeParentOnConfirmation
and supplies accurate canMutate/confirmationPending gates. Retain intentionally
disabled View/state-locked/lookup-error controls.

Any other source-confirmed conformance fix may reuse existing shared owners
without altering these frozen API/business contracts; new business or access
decisions need a separately recorded amendment first.

## Reference conformance before edits

| Concern | Owning block | Actual source/reference inspected | Shared owner | Required match |
|---|---|---|---|---|
| Modal versus routed | UI13 D4-2/catalog | EditorDialog public declarations and controlled composition; current Stock source | EditorDialog/global editor shell | Ordinary small rows modal; PR existing document routed |
| Discard guard | UI10 | Movements collectionMovement details.canDeactivate defer/version checks | ConfirmationDialogService + freezeFormState | Subscription-time identity/busy check; preserved disabled controls |
| Row removal | UI14/10 | shared/utils/editable-rows.ts requestRemove/canMutate/confirmationPending | EditableRows | Freeze pending form and recheck same row before mutation |
| Validation | UI19/27 | FieldError, scalar-validators and current typed forms | FieldError/focusField | Existing validators/messages, focus invalid; no changed business bounds |
| Feedback/lifetime | UI22/28 | Shared StateMessage, takeUntilDestroyed, installed Angular17 DestroyRef | Existing feedback/lifecycle | Both failure channels, balanced loader, no destroyed property |
| Guide | Master7 | Existing UserGuide reader/module guides | UserGuide | Stock module guide and route/menu with accurate current workflows |

References selected from canonical UI catalog/books, not a recent feature's
appearance. Syntax/source checks cannot certify compilation or visual behavior.
Backend audit and standalone-child contracts continue independently; no worker
may silently replace/remove their live routes or weaken parent ownership rules.

## Source reconciliation

Implemented all nine deferred exit consumers and five pending-row freeze opt-ins.
Each returned deferred guard makes at most one decision, including when its first
subscription becomes stale/blocked. Masters blur the focused text before deciding
dirty state, preserving existing updateOn blur validation. Type/Unit Name consumers
use the frozen existing CheckUnique contract and shared settleStepValidation;
validation gates preserve controls until checks settle. Shared helpers/inputs and
installed Angular declarations were checked; no new state framework, field or
endpoint. Final feature report records the owner-approved child amendment,
translated Issue subtitle, shared date hydration/feedback and source-only guide
verification. Compiler and interaction acceptance remain pending.
