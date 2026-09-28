# Screen 07 — Report

> Navigation layer: adds no rule and restates no value. The cited blocks win.

| | |
|---|---|
| Use when | The user picks filters, presses Search, and gets one read-only document with sections and totals |
| Do not use when | The output has row actions or server paging; that is a list ([01](01-list-with-modal-editor.md)) |
| Owning blocks | [20 Report page](../20-report-page.md), [21 Report print](../21-report-print.md) |
| Approved reference | `shared/components/report-page/` + `shared/components/report-actions/` + `Customers/StatementOfAccount/components/list`; dense accounting tree/table variant `Reports/TrailBalance/components/list` |
| Backend pattern | 5 Report |
| Contracts to freeze first | Report filter contract; sectioned response and backend-owned totals (Master block 4) |

## Read in this order

| # | Block | Decides for this screen |
|---|---|---|
| 1 | [20 Report page](../20-report-page.md) | Shared shell, filter bar, validate-then-run search, sections, rows and numbers, totals footer, export |
| 2 | [21 Report print](../21-report-print.md) | `ReportPrintService` print flow |
| 3 | [1 Feature folders and wiring](../01-feature-folders-and-wiring.md) | Route wiring and the single scroll owner |
| 4 | [3 Header](../03-header.md) | Title inside the report card |
| 5 | [16](../16-dropdowns-lookups-enums.md), [17](../17-dates.md) | Filter controls |
| 6 | [22 Loading, empty, error, toast](../22-loading-empty-error-toast.md) | Not-run, empty, and error states |

Then the cross-cutting blocks listed in the [catalog](00-catalog.md).

## Close with

Block 29 verification expectations (the item for reports) and the block 20 check list.
