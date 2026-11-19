<!-- Part of UI block 14: see ../14-editable-collection-table.md. Same status and authority as the block. -->

### Bounded row scrolling in routed editors (owner clarification, 2026-10-15)

For every new or reviewed similar master-detail editor, verify the complete
height chain, not just the table inputs. Use the bounded route/form/body from
UI1 and a remaining-space FormSection host with `[fill]="true"`. Its content
is already a bounded flex column. Every intervening table-area wrapper must
also be a bounded flex column: use existing `sigma-editor-pane` from UI1,
plus only the feature's workspace allocation. A wrapper with `flex:1` and
`overflow:hidden` but `display:block` does not pass allocated height to its
fillHeight child: extra rows can grow inside it and be clipped without a
vertical scrollbar. Do not solve that by increasing a pixel height or enabling
page scrolling.

Reserve header space independently of row count. In a stacked editor with a
bounded header share, that header must not shrink to feed the collection's
intrinsic height; keep its workspace allocation non-shrinking. Give the
remaining-space details host a zero flex basis (`flex:1 1 0; min-height:0`),
not an auto basis derived from all rows. Carry the zero basis through the
intervening table-area wrapper. Otherwise large row counts can consume the
header allocation and make Basic Information disappear even after the inner
wrapper becomes a flex column. The feature owns the header share (Purchase
Requests retains40%); do not impose a universal pixel height or ratio on other
screen shapes. Verify header visibility and row scrolling together. This rule
describes the stacked variant: Purchase Requests subsequently moved to the
owner-selected full-height tabs in UI13 and no longer uses a40% header basis.

```text
bounded editor body
  → remaining-space app-form-section [fill]=true
    → shared section content (flex column, min-height:0)
      → optional table-area.sigma-editor-pane (flex column, min-height:0)
        → app-editable-collection-table [fillHeight]=true [stickyHeader]=true
          → shared fill root → shared frame (overflow-x/y:auto)
```

The frame owns both horizontal and vertical scrolling, with sticky column
headers. Keep section title/Add actions above it, and document totals/footer
outside its scrolling rows. Do not wrap the same collection in
`sigma-editor-scroll` or add feature selectors for the shared frame. Preserve
the print lifecycle that releases bounds and prints the complete saved rows.
Other scrolling sections (such as header fields/documents) have their own
separately bounded region; they do not scroll these rows.

Source verification traces every rendered wrapper, including conditional
wrappers, through host and component styles. Owner runtime acceptance must add
enough rows to exceed the available height, reach the last row with the table's
vertical scrollbar, reach the last column horizontally, and confirm fixed
section actions/totals/footer and sticky headings. Cover Create/Edit/View,
empty/error rows, short heights, responsive boundaries/intermediate widths,
RTL/themes and complete printing. Source-only checks cannot certify a visible
scrollbar. Purchase Requests supplies the missing-wrapper evidence; existing
out-of-scope consumers adopt this rule when implemented or reviewed.


### Complete report print flow (2026-10-27; UI21)

Mark a printed EditableCollectionTable host with the existing `sigma-print-flow`
class. Its shared print rules release the host, inner fill wrapper and scroll
frame, override max-height/table/column minimum widths, unstick cells, wrap long
text and use white paper with dark text in either theme. Toolbar actions,
validation, required markers and row Actions columns do not print; headings and
all projected rows remain. Projected business cells/data still belong to the
consumer. No new input, local shell rule or separate print lifecycle is needed.

The consumer prepares all mode-applicable rows/panels through UI21's existing
ReportPrintService session, marks every outer bounded wrapper for print flow and
keeps the on-screen fill/scroll contracts. This class does not fetch, unslice or
restore rows omitted from the DOM. The component uses ViewEncapsulation.None, so
its rules are scoped through `app-editable-collection-table.sigma-print-flow`,
not an ineffective `:host` selector. Lease Agreement adopts this for all four
saved sections; full multi-page/RTL/theme output remains owner acceptance.
