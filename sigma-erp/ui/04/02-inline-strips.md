<!-- Part of UI block 4: see ../04-filters.md. Same status and authority as the block. -->

**Compact inline actions (owner request, 2026-10-05).** A simple search strip
may bind `[inlineActions]="true"` on the shared FilterPanelComponent to place
its existing Reset/actions beside the main grid, aligned with the input line.
This is default-off and is applied only without an advanced template; advanced
filters retain their separate toolbar. The shared layout owns a flexible main
grid and auto-sized actions, removes the empty toolbar-start placeholder and
uses configured mainColumns above 720px and stacks fields below it, keeping
actions beside the last input line without compressing several fields into
unusable narrow columns. Use it for short, simple unvalidated strips: LinkAccounts
uses one search field or two with its active-tab selector; OpeningBalances uses
1/2/3 columns for Suppliers, Customers/Deposit and Prepaid. Dense or validated
filters retain the normal responsive layout. Mandatory
Reset, busy state, resetRequested, labels, 34px control heights, theme and RTL
remain unchanged. Never duplicate Reset or restyle the shared toolbar locally.
**Validated inline actions — explicit owner placement, 2026-10-05.** A reviewed
short validated strip may combine inlineActions/stableLayout with the optional
`inlineActionCaption="general.actions"`. The shared toolbar reserves an invisible,
aria-hidden translated caption with the same single-line label font/line height
and4px gap, and top-aligns the grid/actions so feedback below a field does not
move the buttons. Field labels retain full accessible text with visual ellipsis;
validators and FieldError reserved feedback remain unchanged. Budget uses its
two configured field columns with Reset/Search/Export beside the input line.
Below720px this caption mode stacks actions below one-column fields and hides
the caption, retaining shared wrapping34px buttons/theme/RTL. Empty caption
retains the original unvalidated inline layout; advanced filters retain their
separate toolbar. No feature offset/padding or duplicated Reset. Source-only;
owner desktop/narrow/validation/visual acceptance pending.

**Intermediate inline layout (owner correction, 2026-10-11).** A dense inline
strip may opt into numeric `responsiveColumns` (default null). At viewport widths
<=1365px, the shared panel moves actions below the full-width field grid, hides
the now-unneeded action caption and uses this number of tracks; <=720px uses
one field track. Other consumers retain their existing breakpoint behavior.
Leave selects6 intermediate tracks for three span2 fields; Holiday selects2
for Name/Date Range. Keep existing labels,34px controls, reserved feedback,
button wrapping, RTL and theme. Do not override this in feature styles.

Related boolean fields can use shared `sigma-filter-checks`: three equal tracks
within a span3 desktop grid item. In the opted-in intermediate layout and on
mobile it spans the full field row, retaining three checks on one row even
when ordinary fields stack. Labels wrap within their own shrinking column;
never clip labels or overflow the page to retain the row. When this group is
on a separate row, shared styles remove the empty neighbouring-label track
and keep the checkbox/label centred in a minimum34px control track. Leave
uses it for Rejected/Pending Approval/Pending Rejoining. Source-only;
owner1365/720 boundary, narrow, Arabic and theme acceptance remains pending.

Full-width workspace filter cards consume the UI3 workspace modifier so their
inline edges align with title, tabs and content cards.
