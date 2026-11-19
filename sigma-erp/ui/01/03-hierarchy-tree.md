<!-- Part of UI block 1: see ../01-feature-folders-and-wiring.md. Same status and authority as the block. -->

### Hierarchy tree workspace — canonical composite

Use this shape only when the domain is intrinsically hierarchical and the primary
operation is navigating parent/child nodes, not paging flat records. The canonical
reference is `Accounts/Account/components/list` with its embedded
`components/details` pane. A hierarchy tree is a deliberate exception to the
standard `app-data-table` list pattern; do not flatten it merely to reuse Grid
chrome.

Required composition:

- one `app-feature-title` inside the workspace card; do not duplicate the title in
  the Metronic toolbar;
- a compact toolbar containing search plus neutral Expand All / Collapse All
  actions; search controls consume `--sigma-filter-control-height`;
- one tree navigation region with `min-height: 0` and internal vertical scrolling;
- each child level adds a clear logical-axis indentation; the current Chart of Accounts reference uses `2rem` `padding-inline-start` per nested level plus a subtle `border-inline-start`/connector line. Keep the value large enough that parent/child depth is obvious without wasting horizontal space, and implement it with logical properties so RTL mirrors correctly;
- one embedded detail/editor pane for the selected node or Add Child workflow;
- desktop may use a tree/detail split; at narrow breakpoints stack the detail pane
  below the tree instead of forcing two unusably narrow columns;
- tree selection is navigation. Nested Add/Delete/Edit controls must stop
  propagation so they do not also select/open the node;
- preserve expanded ancestors when restoring a selected node after Save/Delete;
- a local tree search may filter already-loaded nodes and retain matching ancestors;
  it must not pretend to be server paging or a complete server-side search;
- root/fixed nodes and leaf/parent capabilities come from backend/domain state.
  Hide unavailable mutations or explain the restriction; do not infer permissions
  from indentation or label text when typed metadata exists;
- use `ConfirmationDialogService` for destructive actions and shared primary
  actions for Create/Save. Do not add feature-local `p-confirmDialog` markup;
- every tree/detail request handles declared and transport failures and releases
  loading in `finalize`;
- server-owned tenant/subscription, generated codes, hierarchy level and other
  protected values are never added to write payloads merely because the detail
  response contains them;
- use logical CSS properties, visible focus, translated accessible labels, and
  light/dark tokens. Avoid inline `style`, DOM `onmouseover/onmouseout`, and raw
  English tooltips in a refactored hierarchy workspace.

Viewport contract: the workspace participates in the existing authenticated shell
and may be bounded like other dense editors. The outer page/card/detail ancestors
use `display:flex`, `min-height:0`, and `overflow:hidden`; the tree viewport is the
single vertical scroll owner for hierarchy rows. Do not make the browser page and
the tree compete for the same row scrolling.

For Chart of Accounts specifically, preserve these domain-facing UI rules from the
backend contract: Level 1 accounts are fixed, Level 5 accounts are leaves, parent
identity is immutable on update, accounts with children/transactions may block
specific mutations, and Add Child is offered only when the selected parent may
accept children. These are reference-specific examples, not universal tree rules.

**Check:** true hierarchy confirmed · no `app-data-table` conversion · one feature
title · compact toolbar · internal tree scroll · responsive tree/detail split ·
selection restored after refresh · nested actions stop propagation · shared
confirmation/actions · `finalize` cleanup · both failure channels · no server-owned
write fields · translated RTL/dark/focus states.
