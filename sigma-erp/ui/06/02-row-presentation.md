<!-- Part of UI block 6: see ../06-grid-and-footer.md. Same status and authority as the block. -->

**Stable post-save text rows (2026-10-17).** A text editor may return typed
canonical committed row snapshots to its existing parent. When the active
query is All, has no Search, and orders by immutable key, overriding text
cannot change row membership, ordering or count: merge visible matching keys
without refetching count/page. Require the same query/session/page and complete
snapshots for every changed key, including Save-and-Next. Reset must reload
its authoritative direct value before it is complete. Search, Empty filtering,
value ordering or any incomplete/mismatched result uses the normal server
refresh. Never infer filtered membership from JavaScript collation or change
counts locally. Existing explicit Refresh remains authoritative; no backend
or paginator contract changes. Evidence: Languages text editor/list follow-up.

**All-table vertical centering (explicit owner rule, 2026-10-15).** Every table
cell, header/body/footer and grouped/rowspan cell is vertically centered,
including native/legacy tables, shared DataTable, editable collections and
report output. `src/styles.scss` owns the universal `table th, table td`
`vertical-align:middle!important` rule to override vendor cell inheritance;
shared DataTable explicitly centers headers/body, including multiline wrap
cells. EditableCollectionTable follows UI14's same default, including
validation-capable control rows. No per-screen opt-in
is required. Remove contradictory table-cell top/bottom rules or offset padding
when found in scope; RentalPlanner's group-cell top rule/8px top offset is the
verified conflict removed with this general change. Keep horizontal alignment,
column sizes, row spans, sticky/scroll/paging and text wrapping unchanged.

Inputs, text, checkboxes, badges, file controls and row actions are centered as
their cell content; a field and its validation message form one centered group.
Do not give cells flex/block display or detach validation text just to center
one control. Ordinary form-grid top alignment outside tables remains. This rule
supersedes the prior table top-default/optional-middle guidance, including UI14's
legacy vertical-align token. Verify rows with mixed content heights, multiline
text/errors, row spans, empty states, Create/Edit/View, RTL/themes and print;
source review does not prove runtime/visual acceptance.

**Uniform row centering (owner correction,2026-10-31).** The owner's request to
center every element vertically supersedes the2026-10-23 first-control-track
exception. Editable rows with `app-field-error`, `.sigma-field-error` or
`app-file-field` keep the same middle alignment as all other cells. Remove the
shared top!important override and standalone-checkbox top offset; do not replace
them with feature CSS. Complete field/error or file/View/error groups remain in
normal flow and are centered as units; adjacent text, flags and actions center
in the full row. Shared toolbar items also align to their vertical center.
Keep34px controls,15px checkboxes, table semantics and all horizontal/payload
contracts. UI14 owns the implementation; source-only, mixed/error/RTL/theme/
narrow/print visual acceptance remains pending.
