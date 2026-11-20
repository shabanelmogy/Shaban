<!-- Part of UI block 6: see ../06-grid-and-footer.md. Same status and authority as the block. -->

**Report row viewport width.** The shared row
wrapper reads public `--sigma-data-table-scrollbar-gutter` in both ordinary and
scrollable modes, defaulting to `stable` for existing consumers. Canonical report
panels set it to `auto` (UI20), so a report does not reserve an empty strip after
its final column when no vertical scrollbar is needed. Keep native scrolling,
column minima and the complete frame width. Classic scrollbars still occupy
their required space on actual overflow; do not hide them or compensate with
negative margins or fixed pixel additions. Fill/flow, paginator and print
owners remain.


**Optional complete-report hierarchy (Accounts review, 2026-10-05).**
`DataTableHierarchy<T>` retains the backend's nested rows. The feature supplies
stable `rowKey`, `children`, optional code/label and existing inline navigation;
the shared grid owns expansion, accessible native toggle buttons, logical 14px
depth indentation and stable visible-row materialization. `defaultExpanded`
initializes each identity once. `printAllRows` traverses every descendant without
changing screen expansion, and the report exporter traverses the same complete
source independently of expansion. A deliberately flat report may use the public
column `indent` callback; it must not invent children. No hierarchy input means
the ordinary grid retains its previous behavior. Column `link` represents an
existing cell navigation action, without changing row selection/action semantics.
Optional hierarchy `activateEnabled` keeps structural headings/subtotals as
plain text while retaining their expansion toggle; omitted guards keep existing
navigation. The owner-requested CashFlow tree groups each complete response
activity array under its matching display root, without inventing account-parent
relationships. Its local stable IDs, default-expanded children and closing
subtotals retain the existing accounting row tones. The root repeats the server
net amount so a collapsed activity still shows its net; no UI sum is added.
Print traverses all children and explicit Excel reads original complete arrays
independently of expansion.
This is a presentation capability, not new paging or accounting aggregation.
The public column `cellClass: 'sigma-data-table__cell--wrap'` also wraps its
shared inline navigation label; the shared stylesheet owns this opt-in rule.
Ordinary links retain ellipsis/nowrap. CashFlowStatement adopts wrapping for
long account names without changing link activation or exported values.
Source conformance is reviewed; owner compilation/visual/print acceptance remains
pending.

**Report tree bulk controls — mandatory owner rule, 2026-10-05.** Every report
with a real hierarchy provides Expand All / Collapse All through the one shared
`ReportTreeActionsComponent`. DataTable renders it automatically when its
`hierarchy` input is present; ordinary flat/indent-only tables do not render it.
The toolbar uses the existing ReportActions owner and native secondary buttons,
translated labels and accessible toolbar name, wrapping, theme/RTL and no-print.
Disable it while loading or when no branch exists; omit it during print preparation.
Bulk actions visit the complete supplied hierarchy, including hidden descendants,
initialize all visited identities and then rebuild visible rows once. Collapse
must not let defaultExpanded reopen previously hidden branches when a parent is
opened again. Return the row viewport to the start; preserve per-row toggles and
screen expansion state through printAllRows. No fetching, hierarchy flattening,
new child relationships, UI totals or mutation of backend rows. Canonical complete
print and export remain independent of screen collapse. The existing shared dynamic
Reports TreeNode adapter consumes the same controls with a recursive local clone
of its existing nodes; a new source array drops that bulk override, and repeated
commands work after individual toggles. Its existing output behavior and tree body/paginator remain
compatibility-only for this bounded action addition, not a canonical table
reference; full report-body reviews still follow the mandatory shared-table rule.

**Optional accounting statement rows (CashFlow owner request, 2026-10-05).**

DataTable `rowTone` returns section/subtotal/total/null. The shared stylesheet
owns themed heading surfaces, bold net subtotals with a single rule and a
double-rule final total. Feature display rows retain complete source values;
totals come from backend fields, never a UI sum. Public column `width` applies
to matching header/body cells; optional `link.enabled` renders plain text for
non-navigable headings/totals and guards activation. Omitted inputs preserve
ordinary grid behavior. CashFlow uses78%/22% Account/Amount columns and the
existing32rem minimum, with tabular LTR amounts via shared numeric cell class.
Full print retains every statement row and the shared white print surface.
