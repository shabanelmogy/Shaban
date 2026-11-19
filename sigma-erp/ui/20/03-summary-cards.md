<!-- Part of UI block 20: see ../20-report-page.md. Same status and authority as the block. -->


### Shared summary/KPI cards across screen types

Any new or reviewed summary, KPI or total-card region on a list, report,
dashboard, routed editor or dialog uses the one shared `app-summary-cards`
component from `shared/components/summary-cards/`. It accepts a readonly typed
`SummaryCard[]` with stable `id`, translated `labelKey`, authoritative display
`value`, Bootstrap `icon`, approved `accent`, optional `format` (`number`,
`money` or `text`), translated `suffixKey`, `hintKey`/`hintParams` and an
optional secondary value. The component fetches nothing, derives no totals,
changes no business state and owns the card geometry, palette, typography,
surface, icon tile, focus and print treatment.

Width is container-responsive through auto-fit columns and the public
`minCardWidth` input (190px default); height follows content with equal row
stretching. The optional numeric `maxHeight` input defaults to null. When it is
supplied, the shared internal card list owns its vertical scroll and receives
keyboard focus/tabindex with visible focus; when absent, cards remain natural
height. Features may place or bound the host and choose public `density`
(`comfortable`, `compact` or `dense`), `layout`, `minCardWidth`, `maxHeight`, `selectable`,
`selectedId` and `disabled`; they never override card internals, colors, padding,
radius or fonts. Selectable cards use native buttons, `aria-pressed`, visible
focus and a stable-id `cardSelected` output; static cards have no card-level
click affordance or tab stop. Number formatting uses Angular `formatNumber`,
monetary values use the shared `formatMoney` owner, and BalancesSummary
preserves absolute magnitude with a translated Dr/Cr suffix. Print removes any
card-list bound (`maxHeight: none; overflow: visible`) while retaining every
card and hint.
**Projected value controls.** When a summary card
contains an existing editor control, import `SummaryCardValueDirective` in the
consumer and project `<ng-template appSummaryCardValue="stable-card-id">` inside
SummaryCards. The matching nonselectable card replaces only its formatted primary
value with that template; `$implicit` is the typed SummaryCard. Label, icon,
accent, hint, secondary value, responsive geometry and print skin stay shared.
The feature binds its existing typed FormControl, translated accessible input
name, validators, error and disabled/View lifecycle; the shared card never owns
discount rules, mutations or form state. Bind the control explicitly when the
strip is outside the form element. Do not cap an editable strip so validation
is clipped. Unmatched/absent templates retain normal values; selectable cards
ignore value templates to avoid controls inside their button. Keep stable unique
template IDs, natural validation height, RTL/theme and native input focus. The
strip may sit directly before the fixed editor footer outside the growing form,
with the table/body owning the remaining space; never imitate card internals or
remove a gap through guessed negative margins. RentalQuotation's discount card
uses this additive slot; existing consumers retain their defaults.

The row option fits all cards into equal columns on a container wider than
1100px, wrapping through the shared auto-fit/minimum-width rule below that
threshold; it does not leave a last card outside the screen. Dense density
provides smaller figures through the same shared owner (UI 24). Print wraps
all cards independently of screen layout. No new accounting/status formulas
are introduced by the visual component.

The shared component is the approved adoption target for Dashboard,
FollowUpReport, DebtCollection, Customers/Alerts, BalancesSummary and
ReceivableAgeAnalysis. Their public sizing contracts are Follow Up
`minCardWidth=220`/`maxHeight=180`, Debt compact `170`/`180`, Alerts compact
`180`/`160`, Receivable Age dense/row `140`/`180` with 12px bottom separation on
the host, Balances main compact `180`
with a host bound of `320` plus three dialog compact cards at `180` without a
card bound, and Dashboard default `190` at natural height. Existing consumers
migrate when explicitly in scope, so this rule does not claim that every legacy
screen has already migrated. Follow Up keeps its report-specific metrics,
paging, tabs, drill-down and complete output contracts below; those formulas
remain in the feature contract/review.

DebtCollection and ReceivableAgeAnalysis keep 12px bottom separation from the
following grid on the shared component host (UI 24); keep card internals owned
by the shared component and do not duplicate an existing parent gap.

For an explicitly approved dense accounting report that keeps its controls
visible, the routed report may be bounded to the available shell height. Each
visible section chooses its own layout boundary and shared-grid row viewport;
keep the feature title, filter strip, lookup/error messages and accounting
summary outside those scrolling regions. The active grid owns vertical rows and
any required horizontal overflow, and its header remains sticky inside that
grid. Do not put vertical scroll on the surrounding card/results container or
introduce a nested hierarchy scrollbar. Printing releases each section's bounds
so the full report can flow across pages.
