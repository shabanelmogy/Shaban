<!-- Part of UI block 6: see ../06-grid-and-footer.md. Same status and authority as the block. -->

### CSV import workspace extraction (2026-10-14)

A reviewed standalone import route with the confirmed ImportResult envelope, no context editor, and a complete locally read or returned failed-record collection uses the shared `app-csv-import-workspace`. The shared owner composes `app-feature-title`, `app-button-import-csv`, `app-primary-action-button`, `app-summary-cards`, `app-state-message` and `app-data-table`; it owns local preview paging, explicit Import execution, busy/finalize state, declared and transport failures, partial result counters and retained diagnostics. Each consumer owns its ordered CSV columns, header aliases, typed row builder, body key and endpoint. Selecting a file never mutates the server; after a mutation attempt the same preview cannot be submitted again, because chunked imports may have partially persisted. The consumer must preserve the backend import envelope and must not invent a list filter, server pager, CRUD action or retry policy. Source-only adoption evidence: Administration/DataImport; owner compile, runtime, API and responsive acceptance remain pending.

The owner's presentation amendment (2026-10-14) extends the existing shared
`ImportCsvComponent` for all current consumers. Template and local-file controls
use two equal token-based cards with 14px inset, 12px gaps, 44px icon tiles and
12px card radius; at a component container width of 580px or less they stack in
one column. The template card exposes its exact ordered headers in a native
`details` disclosure beside the existing Download Template action. The file card
opens its hidden native CSV input through a keyboard-operable shared
PrimaryActionButton Choose/Change action, shows parsing state, and displays a
filename only after valid parsing. Replacement selection, parse failure and
Reset clear that filename. Cards have no whole-card action or drag-and-drop
contract; file selection remains local reading, never a server upload or save.
The Administration workspace places these cards and feedback in one bounded
setup/feedback scroll region capped at 45% of the panel height. Title/subtitle,
Import/Reset toolbar, preview heading/count and table pager remain fixed; table
rows keep their own scroll owner. Preview count describes the displayed table
collection, never saved rows. Existing SummaryCards counters, diagnostics and
partial-save guards retain their owners and values. Shared logical spacing,
theme tokens, focus and long-text wrapping own the presentation; consumers add
no card or table-internal styling. The existing bilingual import guide covers
the template disclosure, Choose/Change, valid filename, local preview and Reset.
Source conformance does not certify visual or runtime behavior: owner acceptance
remains pending for both sides of 580px, intermediate/short-height layouts,
long filenames/Arabic, LTR/RTL, both themes and direct-dialog consumers.

**Compact import options in a dense editor (owner scoped request, 2026-10-20).**
The same ImportCsvComponent exposes optional compact=true; false retains the
existing card presentation. Select the compact mode for an explicitly scoped
dense editor, such as Bill Loan Payment Plan. The shared owner renders one
secondary Import dropdown with Download Template, Choose/Change CSV and exact
ordered columns. Reuse DropdownPortalDirective and the existing Bootstrap menu
for body placement, clipping recovery, RTL/theme and outside close. Compact
ImportCsv handles menu Arrow Up/Down and Escape locally: a body-portaled menu
no longer has the trigger sibling Bootstrap's delegated key handler expects.
Escape stops propagation, closes through the native trigger and returns focus,
so it does not also close the parent loan dialog. Tab/Enter retain native flow.
Keep one native file input and the existing parser, events, disabled/parsing
gates, reset, error and valid-filename semantics across both modes. Compact
host bounds and filename ellipsis belong to ImportCsv, never feature deep CSS;
retain the full filename for assistive text/title. Features may project this
control beside Prepare/Add through FormSection header actions; hide the nested
collection heading/Add when the parent already owns them. Opening options does
not parse, save or change draft rows. Existing card consumers do not opt into
compact mode automatically because this owner request is screen-scoped. Source
checks do not certify popup/focus/RTL/short-height runtime acceptance.



### Incremental flat datasets (owner2026-10-31; UtilizationReport)

DataTable owns append-on-scroll presentation for a source-approved bounded page
contract. Public inputs: incremental=false, hasMore=false, loadMoreError='';
output loadMoreRequested emits no business payload. Existing loading disables
requests; printAllRows suppresses the sentinel. This opt-in changes transport
semantics and therefore does not automatically enable every complete report.
Keep feature paging/filter identity, totals, cancellation and full output outside
the grid; no private publisher selectors or page-scroll listener in a feature.

Observe a sentinel in tbody after the last loaded row, never a sticky table
footer. One request latch and observer generation prevent duplicate requests;
rebind after append/loading settles so a short initial batch can fill the
viewport. Stop automatic requests on error and show the shared error plus a
translated native Retry/Load More button reachable by keyboard. No inline loader
is added: report data reads retain UI22's page owner. Disconnect observers/cancel
pending frames on destruction, target replacement and disabled states. Without
IntersectionObserver the explicit button remains usable. Existing hierarchy
and printing keep their owners; incremental append is for flat unpaged view data.

Preserve existing source/view-row identity while appending, including local
format wrappers. Partial collections must not apply local column filters or
sorting as if they were the entire report: suppress those controls/constraints
until completeness. For this opt-in alone, recreate the publisher table view at
a new partial dataset boundary and print/screen switches to discard its retained
filteredValue cache through the shared template lifecycle, never private access
or clear-event side effects. Do not remount per append; ordinary grids retain
stable default behavior. UI20 owns explicit report transport and complete output.
Source/metadata verification is separate from actual scroll/focus/RTL/theme and
performance acceptance.
