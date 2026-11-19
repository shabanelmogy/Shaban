# Sales Quotation

The feature preserves the supplied compact Sales Quotation screens. The list supports quotation number, customer, date range, internal approval, and customer approval filters; Excel export; refresh; server paging; and status-dependent row actions.

## User workflow

1. Select **Create New Sales Quotation**.
2. Enter the date and customer, then complete at least one line. Line amount, tax, amount with tax, remaining amount, and per-installment amount are calculated automatically.
3. Enter the down payment, installment count, and terms, then save. New quotations start as Pending.
4. Use the row menu to view, print, edit, approve, reject, revise, delete, open an agreement, or generate a down-payment receipt when the current status permits it.
5. Rejection requires a 5–500 character reason.
6. **Open Agreement** preloads the approved quotation customer, line quantities/prices, payment terms, down payment, and monthly installment plan. Complete the fleet/year/chassis and payment-method information before saving.
7. **Generate Down-Payment Receipt** opens the Receipt form with quotation, customer, amount, receipt type, date, and description prefilled. Select the branch and payment method before saving; no accounting receipt is posted silently.

## Status actions

| Status | Available actions |
|---|---|
| Pending | View, Internally Approve, Internally Reject, Print, Edit, Delete |
| Internally Approved | View, Customer Approve, Customer Reject, Print, Revise |
| Internally Rejected | View, Print, Edit, Delete |
| Customer Approved | View, Unapprove, Print, Open Agreement, Generate Receipt |
| Customer Rejected | View, Print |

The form warns before discarding unsaved changes, prevents duplicate save clicks, focuses the first invalid control, and supports the project dark-theme, responsive, and RTL conventions.

## Shared UI conventions

The list uses the shared `app-data-table` with five default rows and server-side paging, the shared primary action button, and submit-driven filters. The editor uses the shared validation summary and editable collection table; line-item removal always uses the shared confirmation dialog. Keep these shared blocks when extending the feature instead of adding feature-specific table, primary-action, or discard-flow implementations.
