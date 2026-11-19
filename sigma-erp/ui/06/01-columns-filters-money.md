<!-- Part of UI block 6: see ../06-grid-and-footer.md. Same status and authority as the block. -->

### Shared percentage columns (owner request, 2026-10-24)

Use `DataTableColumn.type: 'percentage'` for authoritative numeric percentage
points, e.g.50 means50%, with null/undefined indicating unavailable. Existing
DataTable owns the presentation using the installed PrimeNG ProgressBar: a
two-decimal percentage label beside a52px wide,4px high decorative track,
8px gap, Sigma primary fill and border-token track. The bar can shrink to20px;
do not add feature templates/paint or a second progress component. Current
adopters are PR consumptionPercent and PO receiptPercent, including the PO
report's reused column descriptors.

Zero is a valid empty bar. Missing/non-finite values show an em dash without a
bar. Only visual fill clamps to0..100: negative/over100 text stays visible,
never rewrite source numbers or infer business status/threshold colors. No
animation; fill starts at logical start for RTL. Visible text carries the
value for accessibility; decorative progress is aria-hidden. Print hides the
bar, and existing export writes the same two-decimal percent text. Numeric
filter/sort values remain the raw finite number, not the decorated text or
clamped fill. Existing value callbacks, templates, hierarchy/link composition
keep precedence. Columns must deliberately declare their semantic type;
do not reinterpret tax rates, variances or arbitrary numeric fields as progress.
Source formatting/filter/export contracts are shared with data-table.format;
no backend fields, calculations or API changes. Verify owner visual/print
acceptance separately from source conformance.

**Shared first-column freeze and advanced filtering (owner, 2026-10-23).**
The shared read table freezes the first **rendered** column at the logical start of
the scroll frame. The rendered order remains selection (when present), Actions
(when present), then the declared data columns; the freeze must not reorder those
columns or add a second frozen business column. Flow/non-scrollable and print
tables clear the sticky positioning. Header and body cells use the same frozen
ownership and existing opaque row/header surfaces, so the sticky cell stays above
the scrolling cells without changing the row scroll owner, widths, themes or RTL
direction.

The shared PrimeNG column menu applies to flat read tables. Text, numeric, boolean
and calendar constraints combine through its AND/OR rules, Apply and Clear. A
complete local `value` is filtered before local paging, using private view values
and retaining original row objects for actions/selection. Display callbacks remain
the visible-value owner; money filters are numeric and dates are calendar dates.
Local report filtering does not recalculate authoritative totals or redefine its
complete print/export contract. Hierarchies retain their existing ancestor/subtotal
and expansion contract; do not silently filter a flattened visible branch.

For server/lazy reads, `withGridFilters` preserves the applied feature filter
snapshot and serializes the same rules under `Filters[grid]` (BE9), before count,
page and all-pages export. `gridFilters` restores the applied menu state; Reset
clears it, a changed rule returns to page one, and absent event metadata preserves
the snapshot. Existing screen filters remain ANDed. Shared count-only paging emits
the same metadata. Never locally filter a server page, fetch all server pages just
for filtering, or use an interceptor/ambient global state to hide endpoint ownership.
The common `ListQuery.filters` type owns optional `grid` alongside its typed screen
fields, including inline filter shapes; do not require a different API for those
consumers or weaken typed serialization with an any cast.
The shared serializer must preserve that generic filter shape at its function
boundary: `toListParams<TFilters extends object>(query: ListQuery<TFilters>)`.
Fixing it to `ListQuery<object>` erases the screen keys and causes excess-property
errors for inline filter literals once the shared optional grid field is present.

The owning typed response/query projection is the server field whitelist. Public
`filterField`, `filterType` and `filterOptions` cover source-supported scalar
aliases, stable nullable types and translated enum choices; sorting retains its
original whitelist. Explicit server expression maps own composite display aliases.
Action-only/positional or genuinely non-filterable enriched columns use documented
`filterable:false`; the server rejects unsupported fields/operators with a localized
400 instead of silently dropping them. Column menus do not create a business field.
Read projection/filter expression conformance must be checked for custom materializers;
an AutoMapper map is not evidence that a post-page calculation is filterable.

PrimeNG21 empty constraints must remain inactive, including `notEquals`; the
shared table scopes its FilterService correction to its own provider. Clear/reset
restores an empty default constraint for every menu, including after a remote
snapshot restore. The dynamic report owner's complete flat branch reuses this
same DataTable; its tree branch retains its own ancestor/expansion contract.
Stable-choice menus include a translated No value choice for historical nulls.
Keep its internal marker distinct from Clear, serialize it as a real JSON null,
restore it on return, and compare missing local values through the scoped filter
provider. A source-derived badge resolves its translated option before its raw
field when a complete local report reuses remote column metadata.
An in-place post-save merge is safe only when it cannot alter membership/order
or counts under the applied snapshot. Active advanced rules require an
authoritative refresh when an edited value can enter or leave the result; the
Language texts fast path therefore also requires no applied grid rules.

Source evidence: shared DataTable/list-query, generic Service.GridFilterProjection,
typed custom list projections and the 2026-10-23 owner-approved unified contract in
`reviews/SHARED_TABLE_REMOTE_FILTER_CONTRACT_FREEZE.md`. Runtime/SQL/visual acceptance
remains owner verification; the source-only review must name compatibility exclusions.

**Exact monetary comparisons (2026-11-04).** An opted-in `exactMoney` column
retains numeric equals/notEquals/lt/lte/gt/gte menus but uses a text input. For
complete flat local data, its private view cell is a scale6 BigInt parsed by
`currencyAmountUnits`; the table-scoped FilterService compares exact units.
Original rows, selection, callbacks and formatted exports remain unchanged.
Installed PrimeNG21 sorting compares these nonstring primitives through `<`/`>`;
do not convert units to Number or serialize the private view rows. No stateKey
is introduced. Unknown/invalid monetary text cannot become zero. A source read
aggregate uses `moneyAggregate:true` to preserve its wider output, while filter
thresholds retain the16-whole/6-fraction monetary text bound and strict lexemes.

For remote adoption, pass the opted-in backend field names to
`withGridFilters(filters,event,exactMoneyFields)` (and `gridFilterString` when
used directly), and configure the same names/scale in BE9's GridFilter owner.
The serializer preserves nonempty whitespace for those fields so the server
rejects it rather than silently dropping the filter; empty string is Clear.
Other fields retain their current empty-text behavior. Shared filters do not
establish SQL/query/runtime conformance; explicitly reconcile both sides and
complete report/export scope before marking adoption complete.

**PrimeNG21 scroll owner (2026-10-22).** The actual row viewport is
`.p-datatable-table-container`, a direct child of `.p-datatable`; the old
`.p-datatable-wrapper` no longer exists. Shared DataTable owns this hook in
fixed-height, scrollable, fill and flow modes. Preserve the existing height/flex,
overflow, sticky header and fixed paginator contracts when upgrading it; never
copy viewport selectors into features. The publisher row-count Select uses
`.p-paginator-rpp-dropdown`. Do not revive an obsolete selector by re-enabling
pointer events on a disabled control. Root shared styles give this paginator-role
Select intrinsic width and no flex growth, overriding full-width form-control
sizing. Keep it beside the report/page actions whenever their combined width
fits; retain responsive wrapping and no horizontal overflow at narrow widths.
Do not change form/filter Select widths or copy a per-screen footer override.
Rendered shared-control tests complement,
but do not replace, actual screen/print acceptance (UI29).
