# Equipment Master Agreement — Sales Orders Contract Freeze

## Scope

Add the row action shown after an Equipment Master Agreement is approved. The
action opens an in-place Sales Orders modal for the selected agreement.

## Evidence

| Evidence | Classification | Confirmed behavior |
|---|---|---|
| `C:\Users\user\Desktop\123.PNG` | Explicit functional evidence | Modal title identifies the agreement, rows select Sales Orders, Issue Date, Expiry Date and Amount are displayed, rows can be added/removed, and Save/Close are available. |
| Current `SaleOrder` entity and service | Authoritative source | Sale Orders already exist as master-detail vouchers and their amount is derived from item rows. |
| Current `EquipmentMasterAgreement` entity | Authoritative source | Approval state exists, but no Sales Order relation exists. |

## Frozen interpretation

The screenshot is a Sales Order association editor, not a new voucher editor:
the displayed amount is derived from an existing Sales Order and the screen has
no Sale Order item fields required by `SaleOrderAddVM`. The modal therefore
loads existing Sales Orders for the agreement customer and saves the selected
associations.

## Contracts

| Concern | Decision |
|---|---|
| Action visibility | Visible only when `ApprovalStatus == Approved`; backend revalidates the same state. |
| Read route | `GET /EquipmentMasterAgreement/{id}/sale-orders`; returns selectable customer Sales Orders and currently selected rows. |
| Write route | `PUT /EquipmentMasterAgreement/{id}/sale-orders`; body contains only selected Sales Order IDs. |
| Write validation | Agreement exists, is approved, selected orders exist in the current tenant, and every selected order belongs to the agreement customer. Duplicate IDs are rejected. |
| Persistence | Add nullable `EquipmentMasterAgreementId` to `SaleOrder` with an explicit restrictive FK. Existing Sales Orders remain unassigned. |
| UI row fields | Sale Order, Issue Date, Expiry Date and Amount are read-only projections; only the Sale Order selection is editable. |
| Empty state | Open with one empty row when no order is selected; the user may add/remove rows. |
| Save behavior | Backend owns the relation; success closes the modal and refreshes the parent list. Both HTTP failures and `isSuccess: false` are rendered. |
| Confirmation | No confirmation for opening or saving; row removal is an ordinary form edit, not a destructive record deletion. |
| Migration | Required because the entity and EF relationship change. The owner must create and run `Add-Migration`; this task does not create or run migrations. |

## Grid/action contract

The parent grid does not gain a new column. The action is a row action and is
placed after View/Approve/Delete in the existing `ActionList[]`; its visibility
is based on the approved status.

## UI shape

Use `app-editor-dialog` and the existing Equipment Quotation Purchase Orders
dialog as the modal-shell reference. Use typed Angular models and the current
feature service; do not add a route or sidebar item.

## Calculation and mapping decisions

Sale Order Amount remains the existing backend projection from Sale Order item
amount-plus-tax values. The association request does not accept amount, dates,
customer, tenant, approval, audit or calculated fields. No AutoMapper write map
is needed for the association request.

## Unresolved items

No permission API exists in the application, so visibility is state-based only
and is not authorization. The Sales Order module has no Angular editor in the
current source; the new modal is limited to association management and does not
invent a full Sales Order creation workflow.
