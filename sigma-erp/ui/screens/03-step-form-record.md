# Screen 03 — Step-form record

> Navigation layer: adds no rule and restates no value. The cited blocks win.

| | |
|---|---|
| Use when | A long routed record with several ordered groups or child collections (UI block 12) |
| Do not use when | The sections are peers that the user switches between freely (tabs in [01](01-list-with-modal-editor.md)), or the record is one header with one bounded child collection ([02](02-list-with-routed-master-detail-editor.md)) |
| Owning block | [12 Step form](../12-step-form.md) |
| Approved reference | `shared/components/step-form/` + `shared/components/form-section/` + `shared/components/form-validation-summary/` on the shared editor shell (UI block 1) + `Customers/Individual/IndividualPartner/components/details` (Company predates the shell, UI backlog 41) |
| Backend pattern | 1 or 2, by whether the record owns child collections |
| Contracts to freeze first | Detail/Add/Update contract per step, including child collections; step gating rules (Master block 4) |

## Read in this order

| # | Block | Decides for this screen |
|---|---|---|
| 1 | [1 Feature folders and wiring](../01-feature-folders-and-wiring.md) | Route shape; `detailsForm/<section>/` folders (spelled `detailsForm` in new features) |
| 2 | [12 Step form](../12-step-form.md) | One parent form, step navigation, gating, invalid-field summary and focus |
| 3 | [14 Editable collection table](../14-editable-collection-table.md) | Child collections inside steps |
| 4 | [18 Documents and upload](../18-documents-and-upload.md) | Only when a step holds documents |
| 5 | [11 Small modal on top](../11-small-modal-on-top.md) | Nested child dialogs |
| 6 | [15 View mode](../15-view-mode.md), [10 Confirm: discard](../10-confirm-discard.md) | Read-only mode and dirty exit |
| 7 | [16](../16-dropdowns-lookups-enums.md), [17](../17-dates.md), [19](../19-validation-messages.md) | Controls present in the steps |

Then the cross-cutting blocks listed in the [catalog](00-catalog.md); block 27
covers step keyboard behaviour.

## Close with

Block 29 verification expectations and the block 12 check list.
