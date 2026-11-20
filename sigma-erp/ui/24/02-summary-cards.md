<!-- Part of UI block 24: see ../24-colors-icons-buttons.md. Same status and authority as the block. -->

### Shared summary/KPI cards

#### Pending values and animated operational counts
The owner's Dashboard loading request explicitly scopes blank initial values
and count-up motion to Dashboard. Extend the existing shared owner rather than
copying its markup: `SummaryCardsComponent.valuesPending` and `animateValues`
both default to false, preserving the other report/editor consumers. Pending
keeps labels/icons/card geometry but blanks values, suffixes, secondary values,
hints and numeric titles; its list exposes aria-busy. `animateValues` uses the
shared count for finite numeric number-format primary values. Money/text and
secondary values retain their existing formatters and do not animate.

`shared/components/animated-count/AnimatedCountComponent` owns presentation only:
`value: number|null = null`, `pending = false`, `digitsInfo = '1.0-0'`. Pending
reserves an inline number slot with no numeric text; null/non-finite values
after pending render an em dash. A finite first value counts from zero over
1100ms with quartic ease-out; changed values continue from the current presentation,
unchanged values do not restart. Replacement, pending/context reset and
destruction cancel the preceding animation frame. The supplied final number,
never an intermediate value, remains the business value. Angular formatNumber
owns display precision/localization. Reduced motion, a hidden document, print
or unavailable animation support displays the final value immediately. Screen
readers and print receive final text; intermediate text is decorative. The
shared inline host owns tabular numerals and minimum line/character space,
inherits surrounding typography/colors and adds no palette or focus target.

The owner's follow-up selects motion in the blank slots during actual waiting,
then the count after data arrives. The later motion-refinement request replaces
the flat strip with three token-based rounded strokes (.28em width, heights
.55/.78/.42em, .18em gap) in a3ch/1em blank slot. Staggered1.5s opacity/scaleY
breathing and a1.8s transform-only light sweep create the waiting motion, with
the sweep reversed in RTL. No number/percent/time promise, spinner or loading
text is introduced. On pending completion the number fades/rises by.18em over
360ms; an invisible final formatted string occupies the same inline-grid cell
to reserve the exact final width while counting. Only decorative text moves;
screen readers and print retain final values. Reduced motion stops all CSS
motion and the number animation, forced colors retain static system-color
strokes, and print hides placeholders/sizing/decorative text. It stays in
AnimatedCountComponent rather than per-card CSS; surrounding shared owners
retain backgrounds/typography/themes.

Dashboard adopts it for shared KPI values, metric badges, ring total and numeric
table cells. DashboardCards keeps label/link/ring/business ownership; table
empty feedback requires a successful snapshot. Realtime/same-filter refreshes
retain values and animate only changed counts. Do not animate snapshots,
business totals, financial previews, print or export payloads themselves.

**Stable initial card geometry and reusable waiting motion.**
The owner requests final card dimensions from first paint and the same waiting
animation for the branch dropdown. The three-stroke/sweep markup and styles now
belong to standalone `PendingMotionComponent` (`app-pending-motion`, no inputs):
decorative/aria-hidden,3ch constrained to parent width,1.2em height, token colors,
reduced-motion/forced-colors static fallback, print hidden. AnimatedCount and
Dashboard's decorative table rows reuse it. Owner2026-10-26 supersedes the
earlier branch-loading adoption: ShellHeader's Select loadingicon and background
refresh badge now use UI22's unified JV ring, alongside startup/page/dialog and
compact shared controls. PendingMotion remains the decorative data-placeholder
owner, not a second request-loading appearance. No numeric-counter semantics
are attached to a branch lookup and no duplicated spinner/animation CSS is added.

AnimatedCount uses the same1.2em line box and minimum3ch in pending and resolved
states, with final-text sizing and overflow ellipsis/full-value title constrained
to available width. Print releases the bound for complete final values. Shared
SummaryCards adds `reservedHintKey: string|null = null`: when supplied, the
translated hint occupies its ordinary space even while pending or when a card
has no current hint; that reserved-only content is invisible and aria-hidden.
Dashboard supplies its existing unavailable explanation so conditional hints
cannot change KPI height. Defaults preserve other consumers. Never insert a
fake number or branch label to reserve dimensions.

Dashboard spans still determine responsive widths. Metric numeric columns
reserve max(44px,7ch), preserving the static label width; full larger numbers
remain available through count title/accessibility. Its three table cards use
a360px final block from initial pending through success/empty/error, with actual
column headings rendered immediately and four aria-hidden decorative rows
during pending. The bounded table region is keyboard-focusable, owns both-axis
scroll and stable gutter, and keeps column headings sticky. Header/note do not
shrink; print releases height/overflow and sticky positioning for all rows.
Table layout is fixed before data: row label gets25% and the other75% is shared
equally among numeric columns; minimum table width is180px plus96px per numeric
column. Long translated column/row labels wrap; large numbers stay constrained
with final title/accessibility. Horizontal overflow preserves that contract on
small screens. Print restores natural column sizing and removes the minimum.
This is the explicit stable-frame decision for an unknown future branch count,
not a guessed row count or hidden data. The surrounding dashboard region owns
scrolling between cards. Owner responsive/RTL/theme/print acceptance pending.

`app-summary-cards` (`shared/components/summary-cards/`) is the single visual
owner for summary, KPI and total cards on any screen shape: list, report,
dashboard, routed editor or dialog. It uses the existing Sigma/Bootstrap tokens
for surface, border, text, primary and semantic accents. The Dashboard KPI strip
is the visual reference: comfortable cards use 14px vertical/16px horizontal
padding, a 44px icon tile with a 14% accent wash, 10px radius, 12px gap, a
1.6rem value, a 9% accent gradient wash and a 3px logical-start accent stripe.
Compact density uses 10px
vertical/12px horizontal padding, a 32px icon tile, 8px gap and a 1.35rem value.
Dense density uses 8px/10px padding, a 24px icon, 6px content gap, 1.05rem
values and 0.6875rem labels with vertical icon/copy placement for narrow tiles.
Slim density is for totals beside a master-detail workspace: 6px vertical/10px
horizontal padding, a 20px icon beside the copy, 6px card/content gaps, 1rem
values and 0.6875rem labels. It reduces height without feature card overrides.
Workshop Job, JobEstimation and WorkOrder select slim/row/min140/max80 after
the owner's 2026-10-04 request to preserve detail visibility. The 80px bound
keeps wrapped totals internally scrollable; print releases it. This is an
opt-in presentation choice; other densities and authoritative values remain.

CashFlowStatement's later explicit accounting-format decision supersedes its
slim-card experiment: its five authoritative figures sit within one shared
statement table using UI6's optional section/subtotal/total rows. These are
accounting document rows, not bespoke KPI cards. Other card consumers retain
their shared sizing and appearance.

Approved accents are primary, success, info, warning, danger and neutral, using
the existing Sigma/Bootstrap theme tokens. Debit, credit and balance consume
the existing accounting-value tokens and retain their non-semantic accounting
meaning; colors never change a formula or become a success/error assertion.

The shared owner renders one `<ul class="sigma-summary-cards">` wrapper with
private component SCSS, auto-fit columns, a 190px default public `minCardWidth`,
content-sized height with equal row stretch, readable wrapped labels, tabular
values and text access to truncated amounts. Features may place or bound the
host and pass public density/layout/minimum-width/maximum-height/selection inputs; they do not override
card geometry, colors, padding, radius, font or icon-tile styling. The earlier
report-specific insights draft is retired; there is no global insights variant.
The old compact accounting summary bar remains compatibility-only for
out-of-scope consumers. New/reviewed financial cards use the shared `formatMoney`
owner plus translated Dr/Cr suffixes, while number cards use Angular
`formatNumber` for authoritative values; this visual owner never adds accounting
or status formulas.

The typed `SummaryCard` shape carries `id`, `labelKey`, `value`, `icon`,
`accent`, optional `format` (`number`/`money`/`text`), `suffixKey`,
`hintKey`/`hintParams` and `secondary`. The component inputs are `cards`,
`ariaLabel`, `density`, `layout`, `columns`, `equalHeight`, `verticalPadding`, `minCardWidth`, `maxHeight`, `selectable`, `selectedId` and
`disabled`; `cardSelected` emits only the stable card id. A money card may carry
`moneyDecimalPlaces` from its owning financial snapshot; the shared owner uses
that precision and defaults to two for legacy callers. It fetches nothing and
does not derive or mutate business state. `density` is comfortable, compact,
dense or slim. `layout` defaults to grid; row fits the actual card count into equal
`minmax(0, 1fr)` tracks above a 1100px container width, then wraps through
auto-fit/public minimum width in smaller containers. Do not render an off-screen
horizontal rail. Optional numeric `maxHeight` (pixels, null by default) bounds
the shared internal list; it owns its scroll and keyboard/visible focus while
the surrounding table retains usable height. Natural-height consumers keep
their existing scroll owner. These inputs change space usage, not card colors
or business scope.

Optional `columns` (positive integer, null by default) fixes the shared grid to
that many equal tracks, including row-layout responsive wrapping. Optional
`equalHeight` (false by default) uses equal fractional rows across the whole
card grid, keeping all cards the same height. Features select these public
inputs instead of overriding card-grid internals. Leave details selects two
columns/equalHeight after the owner's 2026-10-11 correction, retaining all eight
values/hints/order and original comfortable density. Optional `verticalPadding`
(nonnegative pixels, null by default) changes only vertical content padding;
Leave selects10px instead of14px after the owner's second small spacing reduction,
preserving original fonts/icons/horizontal padding. Defaults preserve every other consumer;
print retains its natural wrapping. Natural content remains reachable through
the existing scroll owner if a viewport cannot fit it; source inspection cannot
certify a no-scroll visual result.

Keep 12px separation between a summary-card region and the following grid. Use
the parent's existing gap when it already supplies this separation; otherwise
place margin-block-end on the component host, not its private card/list
selectors. DebtCollection and ReceivableAgeAnalysis use this host placement.

For comparable routed document editors whose totals directly precede a fixed
Save/Close footer, retain a small visible gap below the whole SummaryCards
region. Use the existing `mb-2` utility on its host, as Purchase Requests does,
or the parent's existing equivalent gap; do not add both. This footer separation
is distinct from the12px summary-to-grid rule above. Keep the whole region
aligned to sibling card edges (UI3), footer outside row scrolling and the
existing public summary sizing/print behavior. Never reproduce card internals
or hide overflowing rows to create space. This presentation requirement is
part of UI13's comparable-editor checklist.

Selectable cards are native buttons with `aria-pressed`, visible focus, disabled
busy guard and a stable-id selection output. Static cards have no click affordance
or card-level tab stop; a bounded or row-layout list remains keyboard-focusable.
Print removes the height bound/overflow and wraps every row-layout card. It uses
compact white cards, neutral borders/text, wrapped values
and hints, break-inside avoidance, and hides decorative icon tiles/washes/stripes
while preserving captions and authoritative values in both themes and directions.
