<!-- Part of UI block 20: see ../20-report-page.md. Same status and authority as the block. -->


### Dense accounting tree/report table visual invariant

`Accounts/TrailBalance/components/list/` is the canonical visual reference for a
dense accounting report that renders hierarchical rows (its existing source uses
`p-treeTable`) or for a flat accounting report whose table serves the same
read-only role. New and reviewed reports with this UI role still use
`app-data-table`; add any missing hierarchy capability to that shared component
within the scoped report task. Preserve the same compact visual grammar rather
than inventing a feature-specific table treatment:

- keep each bounded section inside its layout boundary; the shared grid's row
  viewport is that section's scroll owner, never the surrounding report card;
- keep the table header sticky inside that grid and visually distinct with a
  soft themed surface, strong text, subtle vertical separators and a slightly
  stronger bottom rule; do not use an oversized or card-like header;
- target a compact header around `34px` high and compact data rows around `30px`
  high, with roughly `5-6px` header block padding and `3px` row block padding;
- numeric headers and cells align to logical end and use tabular numerals;
- the first account/description column aligns to logical start and receives the
  width needed to prevent hierarchy controls from crushing the label;
- hierarchy togglers stay compact (about `22px`) and must not inflate row height;
- when account code and account name are both shown, render them as separate
  visual parts: code is quieter/smaller, name is the primary readable label;
- hierarchy indentation must stay tight enough for dense accounting data. Do not
  add decorative nested cards, large left padding, or oversized tree icons;
- top-level hierarchy rows may receive a **subtle** weight/surface emphasis only;
  deeper levels rely on indentation and the tree control, not progressively
  louder backgrounds;
- preserve horizontal overflow when required by financial columns, but avoid a
  second nested vertical scrollbar inside the shared grid's hierarchy viewport;
- sticky-header, row-density and hierarchy styling must use logical properties
  (`inline-start`/`inline-end`) so Arabic RTL and English LTR remain equivalent;
- print mode removes height/overflow bounds and lets the complete table flow.

Use these rules for Trial Balance-like accounting reports and for any other
report with the same dense read-only tree/table role. The interaction model may
change shared-grid inputs or require a shared capability, but it does not permit
a feature-owned table or flattening the hierarchy; record the required shared
extension in review evidence.

`Accounts/TrailBalance/components/list/` is the reference consumer. A report review fails
final reconciliation if it reintroduces feature-local filter-strip or accounting
total-card styling when these shared classes fit the same UI role.
