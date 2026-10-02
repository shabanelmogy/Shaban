# Screen 09 — Action dialog

> Navigation layer: adds no rule and restates no value. The cited blocks win.

| | |
|---|---|
| Use when | A small typed form that runs one domain action on an existing record: close a job, log labour time, extend or close an agreement, void with a reason, deliver |
| Do not use when | It only asks yes/no (use the shared confirmation, UI block 9); it edits the record itself (use the record's editor) |
| Owning blocks | [13](../13-modal-with-tabs.md) `app-editor-dialog`; [7](../07-action-button-cycle.md) action cycle and state; [19](../19-validation-messages.md) field errors and money; [22](../22-loading-empty-error-toast.md) single error and success owner |
| Approved reference | `Workshop/Job/components/close-job` |
| Backend pattern | A domain transition of the record's pattern (2 or 3): an explicit service method with legal source/target states, validated inputs, one save or one transaction |
| Contracts to freeze first | Action-state contract (who can run it, from which state, what changes, what it posts) and the dialog's input contract (Master block 4) |

## Read in this order

| # | Block | Decides for this screen |
|---|---|---|
| 1 | [13](../13-modal-with-tabs.md) | Controlled `app-editor-dialog`, title plus record subtitle, dirty close |
| 2 | [7](../07-action-button-cycle.md) | Row action visibility from the record state; refresh after success |
| 3 | [16](../16-dropdowns-lookups-enums.md), [17](../17-dates.md), [19](../19-validation-messages.md) | The dialog's controls, `app-field-error`, money and tax rules |
| 4 | [22](../22-loading-empty-error-toast.md), [28](../28-request-cancellation-and-stale-responses.md) | One error and success owner; a late response for another record is ignored |
| 5 | Backend [12](../../backend/12-activate-and-deactivate.md), [14](../../backend/14-pattern-2-master-detail-no-financial-effect.md) or [15](../../backend/15-pattern-3-master-detail-with-financial-effect.md) | The transition method and its state checks |

Then the cross-cutting blocks listed in the [catalog](00-catalog.md).
