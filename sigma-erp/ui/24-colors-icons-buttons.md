## 24. Colors, icons, buttons

> **Status: Canonical** — global tokens and shared buttons (shared-first rewrite 2026-10-01).
> Remaining legacy: primary-colour and icon-library forks elsewhere (backlog 1, 15); Statement of Account now uses shared tokens and Bootstrap Icons (2026-10-02, source-only).

### One project presentation owner (owner clarification, 2026-10-24)

Use Sigma's shared PrimeNG-based components as the application presentation and
interaction contract (Master5). Inspect their public inputs/events, installed
imports/directives and actual reference composition; do not bypass an existing
owner with a screen-specific library instance or private CSS/markup copy.
Extend that owner for missing reusable behavior. If no owner fits and the
candidate is genuinely reusable, extract it at the appropriate shared layer
and adopt it in the affected scope; do not make every helper a visual component.
The canonical block records the supported behavior and usage so future screens
reproduce the same controls, states and interaction, not just similar colors.

When an approved pattern uses a native PrimeNG directive plus shared Sigma
classes, apply the full base style and semantic modifier together, with the
directive imported by its actual owning component. A modifier alone is not a
complete control: for example, danger intent uses the base button geometry
plus the danger modifier from the action table below. Do not repair an omitted
base/import by adding a private screen skin. Preserve public contracts and
model-owned transitions; source inspection does not prove visual acceptance.

Shared native secondary/danger styling must cover the same element carrying
`.p-button` as well as the plain native button. Its base geometry and
hover/focus paint use compound selectors so publisher runtime CSS cannot
restore a solid primary background. Danger defines its idle surface explicitly,
with semantic danger text/border and a subtle danger hover/focus wash; set
the directive's `severity="danger"` too. Keep disabled/focus behavior, tokens
and native actions; do not fix this theme cascade with a feature-local skin
or `!important` (owner screenshot2026-10-24: blue Reject with red text;
source correction, visual acceptance pending).

### Shared scrollbar presentation (owner request 2026-10-23)

The general scrollbar skin is owned by
`SiGmaAngularFrontEnd/src/assets/sass/_sigma-scrollbars.scss`, imported once
from `src/styles.scss`. Existing scroll regions, including body-appended
overlays, inherit it without screen opt-in. Keep overflow, container sizing,
direction and scrollbar-gutter with their UI1/UI6/UI13 owners; do not introduce
page scrolling or a JavaScript scroll wrapper to change appearance.

For a fine pointer with hover and forced colors disabled, the WebKit scrollbar
track is 10px on both axes, transparent, with a rounded thumb (999px radius,
2px transparent border/inset, 40px minimum extent). Idle uses Sigma muted,
hover mixes primary75% with text, and dragging uses primary-hover. Engines
without those selectors use standard thin scrollbars and the same theme colors.
Set standard width/color to auto in the WebKit branch: non-auto standard values
override pseudo-element styling. Shared scrollbar-color/width declarations
alone use important to replace existing component paint; this does not permit
important layout overrides. Touch/no-hover and forced-colors retain native auto
scrollbars. Do not hide the scrollbar or remove native wheel/keyboard/touch
behavior. UI25 owns theme/direction and UI29 keeps actual browser appearance,
hover/drag, high-contrast and touch acceptance pending until verified.

### PrimeNG21 theme and component hooks (2026-10-22)

**Complete vendor presentation retirement (owner2026-10-22).** The owner then
authorized deletion of all old components and migration of every dependent
screen. This supersedes earlier staged instructions below to retain vendor
Sass/Popper/KT. Live shell/theme/domain helpers move to their native shared
owners (UI1); unused demos/plugins/Builder are deleted. The theme entry uses
only Sigma base/status/native-control/utility modules. No Bootstrap/Metronic
CSS, Sass, scripts or compatibility re-export tree remains. Preserve existing
shared component selectors, events, native form controls and business contracts.
Native migrated fields and ordinary secondary/danger buttons use PrimeNG
InputText/Button directives from the actual standalone owner or its shared
imports constant. Primary actions compose the existing PrimaryActionButton
owner, preserving submit/click, disabled/loading and native ID contracts; delete
temporary independent primary paint rules once these consumers migrate.
Existing actions retain the Sigma geometry/tokens; no second palette is
introduced. Existing native card/table surfaces and layout utilities
are centrally Sigma-owned, not copied vendor component CSS. Exact class tokens,
SCSS selectors, conditional class bindings, DOM queries and retained tests must
migrate together; semantic HTML tags and domain property names must not change.
Keep independent Bootstrap Icons and Font Awesome glyphs while used; the
`data-bs-theme` selector remains the established application theme contract.
`ThemeModeService` owns Sigma image/transition attributes and the Sigma theme
change event, preserving the stored preference keys. Source conformance and
rendered interaction/geometry evidence remain distinct from visual acceptance.

**Shared vendor independence (owner2026-10-22).** Keep Sigma shared components
and replace their vendor internals in place. Dynamic ButtonsComponent composes
PrimaryActionButton for solid primary intent, and PrimeNG native buttons for
secondary/danger/link intents; it retains ButtonModel IDs, labels/tooltips,
supplied classes and emitted action IDs. A non-navigating link intent uses a
native button with disabled semantics. Do not copy a second primary palette.
PrimaryActionButton's optional buttonId/buttonTitle/buttonClass inputs forward
to its real native button for this compatibility composition; defaults remain
unchanged and custom classes are not a license for new feature palette forks.

Sigma semantic status tokens live in assets/sass/_sigma-status-tokens.scss,
independent of vendor imports: success/info/warning/danger plus text-emphasis,
bg-subtle/border-subtle and danger-strong. Preserve the existing light/dark solid
palette and light-base tint/shade feedback values while migrating shared
SummaryCards/error/state/CSV/quantity/alert consumers from --bs-* variables.
Keep data-bs-theme as the application selector and Bootstrap Icons as the
canonical independent icon font. Shared hidden text uses sigma-visually-hidden,
with the same accessible clipping behavior, rather than a vendor utility.

Shared row command menus and compact CSV command Popovers use bounded global
sigma-row-action-menu/sigma-command-popover hooks because they append to body;
Sigma tokens own their surface/text/primary,170px minimum width,34px command
height and8px radius. Keep the compact action trigger's existing sizing and
publisher layering above legacy nested dialogs, plus explicit print hiding.
Remove the old DropdownPortalDirective/portal CSS only after both shared
consumers migrate. Global vendor CSS/JS/Ngb remain until their other direct
consumers are proven retired; this slice does not authorize package removal.

**Interactive runtime retirement (owner2026-10-22, later authorized stage).**
After live Settings dropdowns move to the shared command owner and remaining
Ngb imports/selectors, test providers and isolated dead modal roots are retired,
remove the global Bootstrap JS entry and bootstrap/ng-bootstrap/types packages
together through the package manager. Keep the repository-owned Bootstrap Sass,
independent bootstrap-icons and data-bs-theme selector until their separate
style migration. Popper remains while legacy KT source/spec roots import it;
absence from the active shell is not proof of complete package retirement.

Configure the Lara preset through `providePrimeNG` and `@primeuix/themes` in
the root config/shared theme owner. Consume existing Sigma primary/radius tokens
and the actual `[data-bs-theme="dark"]` selector. Removed `primeng/resources`
styles must not be restored. Shared SCSS retains field sizing, logical layout
and body-overlay ownership; feature styles do not fork the publisher theme.

PrimeNG21 Select and DatePicker put their root classes on the host itself.
Do not target a second nested `.p-select`/`.p-datepicker` root. Root styles own
Select's full-height flex label track for every consumer; compact field/filter
owners retain their padding and height tokens. DatePicker uses the direct
`.p-datepicker-input-icon-container` and `.p-datepicker-clear-icon`; detect their
presence with `:has`, reserve logical-end space for the actual controls, and do
not restore removed clearable/input-icon-wrapper modifiers. Keep text/clear/icon
alignment in both directions and themes. The Company's selected/placeholder
branch text and the shared date controls are regression consumers, not opt-ins.

MultiSelect's host also keeps its publisher inline-flex root. Its direct
`.p-multiselect-label-container` is a stretching flex track and the direct
`.p-multiselect-label` grows/stretches and centers its content vertically.
Without that intermediate flex track, filter-owned zero vertical label padding
leaves placeholder/selected text at the top of the34px control. Apply this in
the existing global control owner for every consumer; retain publisher chip/gap,
ellipsis, logical padding, clear/dropdown tracks, disabled state, RTL/theme and
filter/editor height ownership. Do not add feature offsets or fixed text heights.
Evidence: installed PrimeNG21/PrimeUIX MultiSelect template/style and the owner
ServiceBookings Status report2026-10-26. Source-only; placeholder, one/many/chip
selections, narrow/theme/RTL and runtime acceptance remain pending.

The shared numeric InputNumber root and Sigma quantity classes are on the same
host too; UI27's2026-10-23 owner expansion adopts this existing producer for all
editable numeric roles without a second visual component.
Use `.sigma-quantity-input-host.sigma-quantity-input.p-inputnumber`, not an old
descendant-root selector. Keep that host inline-flex and the22px stacked button
rail in normal flex flow (`position:static`); publisher absolute positioning
otherwise overlays the right-aligned number and intercepts clicks intended for
the input. Invalid border states also target that same host. Verify actual input
width, step-rail non-overlap and input hit-testing in a bounded editable table,
in addition to CVA values/events. A synthetic key event can update a hidden or
covered input and does not prove a user can see or click it. Retain existing
34px geometry, theme tokens, numeric direction and feature min/max/precision.

Stable list/report filters must retain those host displays. Do not override
`p-select`/`p-datepicker` with display:block: Select's publisher label starts at
width1% and needs its flex parent to grow, while the dropdown/clear remain in the
same control track. Shared FilterPanel/report stability rules own field alignment
and validation slots, not a second widget-root layout. Cover both stable and
ordinary consumers, including readable label width and trigger/clear bounds.

DatePicker disables the actual native input rather than adding p-disabled to its
host. Shared disabled colors target `:has(> .p-datepicker-input:disabled)` and the
input, using existing theme tokens; normal hover rules exclude that native state.
Do not rely only on the host class or let normal input colors override disabled.

The global native clear service must preserve publisher-owned IconField children:
PrimeNG21 anchors its search icon with first/last-child selectors. Put the extra
clear button in the containing position host, outside `.p-iconfield`; measure
visible logical-end adornments and reserve separate clear/text space in LTR/RTL.
Restore any service-owned padding override when unbinding. A hidden appended
button still changes structural selectors. Select/MultiSelect filter search uses
the actual header `.p-inputicon`, not obsolete filter-icon classes. Cover opening,
typing and clearing in both themes/directions without changing the selected value.

Use publisher hooks: Select overlay/option-selected, MultiSelect
overlay/list/option-selected, DatePicker panel/day-selected/day-selected-range/
month-selected, paginator page-selected and Toast close-button/close-icon.
Checkbox/radio checked and disabled states are on their component root; visible
keyboard focus follows the native input's `:focus-visible`. Do not put old
`p-highlight`, `p-focus` or disabled classes on inner boxes. A clearable Select
is detected through its clear icon, not an obsolete root class. Verify the
installed publisher source before migrating selectors; a compiling stylesheet
does not prove it still reaches the rendered DOM. Both themes/directions,
keyboard, overlays and responsive behavior need owner visual acceptance.

### Appbar presentation across framework migrations (owner2026-10-22)

Replacing a template's interaction engine does not approve replacing its
established visual hierarchy with plain publisher defaults. The owner preferred
the former Sigma Appbar after the PrimeNG shell migration. Current shared owner
`app/layout/ShellHeaderComponent` uses PrimeNG Select selectedItem/item/header
slots and Popover templates to retain the Navbar/UserInner visual vocabulary:
42px branch/language cards,30px leading tile/two-line branch copy,40px icon
buttons with11px corners, token-based surface wash/shadow, and a structured
account identity/actions menu. These shell-specific values do not replace the
34px feature-form controls. Existing AppbarShortcuts keeps its shared styling.
The owner's later alignment amendment gives only the desktop navigation
boundary toggle32px/9px corners; it remains40px on mobile. UI1 owns the shared
brand/aside width, boundary placement and nested-menu spacing.

Read flags from language metadata through flagCountryCode; use a language icon
when none exists. At header width<480px the language control is48x42px and
shows the flag/icon while its full applied-language name remains in ariaLabel
and title; its popup keeps readable full names. The branch name remains visible.
Account initials derive only from the current Login name; no invented presence
or notifications. Selected theme shows a check and the trigger follows the
resolved light/dark mode. Header styling applies to all existing route consumers.

Keep typed confirmed-state selectors, async rollback, disabled guards, focus,
responsive/RTL/theme and print behavior while editing these templates. Target
actual publisher host/overlay hooks; body-appended surfaces and directional
arrows use the shared marked overlay boundary. Source comparison and rendered
geometry/interaction tests do not establish subjective visual acceptance.
Evidence: the owner visual amendment in the PrimeNG shell maintenance plan.
### Sass module ownership (2026-10-22)

The global theme uses Sass `@use` and namespaced built-ins. The former licensed
Bootstrap5.3.2 compatibility source and its configuration bridges were retired
after their consumers migrated under the owner's complete-removal instruction.
Do not restore vendor theme imports, patch node_modules, suppress deprecations
or downgrade Sass for a feature stylesheet. Sigma base owns root typography
(13px desktop,12px below992px), reset and native theme tokens; shared native
controls and the `sigma-u-*` utility module own migrated presentation. Utilities
use logical spacing and insets so one rule serves both directions. Existing
spacing scale is .25rem per step and responsive boundaries remain576/768/992/
1200/1400px where used; feature-specific layouts retain their own ownership.

Sass modules scope `@extend`; preserve existing heading/small/button-group/container
aliases explicitly when moving rules between modules. Preserve cascade positions
when a previously repeated partial intentionally emitted rules twice. For a theme
dependency upgrade, compare complete parsed CSS selectors, declaration values and
rule order against the pre-change output, then run only authorized builds. A clean
compile proves neither visual equivalence nor responsive acceptance (UI29).

### Button roles

The unused Keenicon component, demo files and fonts were retired with the old
template. Record collections still require stable identities; use positional
tracking only for truly decorative or fixed ordered slots.

| Role | Approved implementation | Used for |
|---|---|---|
| Primary | `app-primary-action-button` | Create, Search, Next, Save, Edit from View |
| Secondary | `button.sigma-secondary-button` (`src/styles.scss`) | Cancel, Close, Export, Reset, Previous, header secondary actions |
| Destructive | `button.sigma-secondary-button.sigma-danger-button` | Delete/void outside a dialog footer, always behind its confirmation (block 9) |
| Dialog footer actions | `app-editor-dialog` | Mode-aware Save/Edit and Cancel/Close inside the shared editor shell |
| Row icon | Feature-owned semantic icon button | Edit or another nonstandard child-row action |
| Child row remove | `app-editable-collection-table` | Standard confirmed Remove request in an editable child collection |
| Add row | `app-editable-collection-table` → `app-primary-action-button` | Add/select under a compact child table |

Never leave a raw `btn-primary` / `btn-danger` in a new or refactored feature
template. Use `app-primary-action-button` for solid primary actions. Destructive
actions use their approved confirmation or action pattern; they are not primary
actions.

### Shared primary action — canonical

In every UI3 FeatureTitle context, at <=650px the
shared primary button selects32px minimum height,10px inline padding,10px font
and4px icon gap, a small reduction from35px/16px/11px/6px. Visible translated
label, icon, focus, disabled/loading and RTL/theme behavior remain unchanged.
The owner's generalization on2026-10-11 supersedes the earlier Leave/Holiday-only
opt-in. Every primary button projected into app-feature-title inherits it;
buttons outside titles retain their existing sizing. Never copy this into
feature CSS.

`shared/components/primary-action-button` is the single owner of solid primary
action markup and styling. Import its standalone component in each direct
consumer:

```ts
import { PrimaryActionButtonComponent } from
  'src/app/modules/shared/components/primary-action-button/primary-action-button.component';

@Component({
  standalone: true,
  imports: [PrimaryActionButtonComponent],
})
```

The component contract is:

| Input/output | Contract |
|---|---|
| `label` | Required, already translated visible label and accessible name |
| `icon` | Bootstrap Icon classes; defaults to Create/Add |
| `type` | `button` by default; use `submit` inside a real form |
| `iconPosition` | `start` by default; use `end` for forward actions such as Next |
| `disabled` | Business-disabled state |
| `loading` | Shows UI22's shared ring when no global progress owner is active, sets `aria-busy`, disables execution, and prevents double submission |
| `loadingIcon` | Legacy compatibility input; accepted but does not override UI22's single loading appearance |
| `pressed` | Click/keyboard action for `type="button"`; form submit buttons normally rely on `(ngSubmit)` |

The shared component consumes `--sigma-primary` and
`--sigma-primary-hover`, keeps the solid glyph white, provides visible focus,
uses UI22's unified ring for local progress, and reverses directional arrow glyphs in RTL. Consumers
must not override its internal class or duplicate its SCSS. Keep
`app-editor-dialog` for dialog footer actions because that composite owns its
mode-aware Save/Edit behavior.

### Icon rule

An icon on a **solid** coloured action must have the same high-contrast foreground
as its label. Shared components such as `app-primary-action-button` and
`app-editor-dialog` own this internally; consumers must not reach into their
classes to restyle the nested `i`. For a genuinely feature-owned semantic icon
button, make the icon inherit `currentColor` and define the foreground on the
button itself. On a white or transparent surface use the semantic text colour,
never forced white.

### Loading swap

Set `[loading]` on the same shared button; do not conditionally render a second
button or duplicate the icon swap:

```html
<app-primary-action-button
  [label]="'general.save' | translate"
  icon="bi bi-check2-circle"
  [loading]="saving()"
  (pressed)="save()"
/>
```

### Standard icons

| Action | Icon | Action | Icon |
|---|---|---|---|
| Create / Add | `bi bi-plus-lg` | Save | `bi bi-check2-circle` |
| Search | `bi bi-search` | Cancel / Clear | `bi bi-x-lg` |
| Busy | `bi bi-arrow-repeat` | Discard | `bi bi-x-circle` |
| View | `bi bi-eye` | Excel export | `bi bi-file-earmark-excel` |
| Edit | `bi bi-pencil-square` | History | `bi bi-clock-history` |
| Delete | `bi bi-trash3` | Warning | `bi bi-exclamation-triangle` |
| Back | `bi bi-arrow-left` | Next | `bi bi-arrow-right` |
| Step done | `bi bi-check-lg` | Field error | `bi bi-exclamation-circle` |

Decorative icons always get `aria-hidden="true"`; icon-only buttons always get
`aria-label`.

### Tokens

The application primary action color is global. It is declared once in
`src/styles.scss`, using the clearer blue already proven by the Staff feature:

```scss
:root {
  --sigma-primary: #3498db;
  --sigma-primary-hover: #2587c5;
}
```

All features use `var(--sigma-primary)` and
`var(--sigma-primary-hover)` for primary borders, solid primary actions, active
tabs, focus accents, and checkbox/radio accents. Do not introduce
`--<feature>-primary` aliases or repeat the hex values in each module. A
body-appended overlay inherits the global token from `:root`, so it does not
need to redeclare the primary color on its overlay root.

**Semantic colours are global too** (decision D4-6, 2026-10-01). `src/styles.scss` defines them
once for light (`:root`) and dark (`[data-bs-theme='dark']`):

| Token | Use |
|---|---|
| `--sigma-text`, `--sigma-muted` | body text, secondary text |
| `--sigma-surface`, `--sigma-surface-soft`, `--sigma-canvas` | cards, soft bands, page background |
| `--sigma-border`, `--sigma-border-strong` | borders |
| `--sigma-debit-*`, `--sigma-credit-*`, `--sigma-balance-value` | accounting accents (non-semantic, block 14) |
| `--sigma-filter-*`, `--sigma-data-table-*`, `--app-editor-dialog-*` | owned by their shared component |

Shared output actions (Export and Print) use the existing primary-blue palette through the global sigma-output-action role and the existing report output selector. Their 34px height, inline-flex alignment, 6px gap, 10px padding, 1px solid 4px-radius border, 0.75rem/700 text and no-shadow geometry are declared once in src/styles.scss, together with the light-blue surface wash, primary/strong-border mix, balance text and hover/focus wash; native buttons, report variants and shared primary buttons use the same style, labels, loading and disabled behavior. Existing output icon buttons are matched by their Bootstrap/Font Awesome output glyphs for compatibility. Features do not declare an export or print palette.

A feature uses these tokens and declares **no** palette of its own (`--feature-text`,
`--feature-surface`, … and their dark copies). It may declare one token only for a real domain
colour that no shared token expresses (for example a vehicle-status colour), with its dark
value. The 108 feature stylesheets that still declare palettes (2026-10-01) switch to the
global tokens in their reviews.

### Shared summary/KPI cards

#### Pending values and animated operational counts (2026-10-25)

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
retain backgrounds/typography/themes. Source-only visual acceptance pending.

Dashboard adopts it for shared KPI values, metric badges, ring total and numeric
table cells. DashboardCards keeps label/link/ring/business ownership; table
empty feedback requires a successful snapshot. Realtime/same-filter refreshes
retain values and animate only changed counts. Do not animate snapshots,
business totals, financial previews, print or export payloads themselves.
Source-only conformance; owner build/motion/theme/RTL/runtime acceptance pending.

**Stable initial card geometry and reusable waiting motion (owner2026-10-25).**
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
`disabled`; `cardSelected` emits only the stable card id. It fetches nothing and
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
part of UI13's comparable-editor checklist (owner generalization, 2026-10-15).

Selectable cards are native buttons with `aria-pressed`, visible focus, disabled
busy guard and a stable-id selection output. Static cards have no click affordance
or card-level tab stop; a bounded or row-layout list remains keyboard-focusable.
Print removes the height bound/overflow and wraps every row-layout card. It uses
compact white cards, neutral borders/text, wrapped values
and hints, break-inside avoidance, and hides decorative icon tiles/washes/stripes
while preserving captions and authoritative values in both themes and directions.

### Where body-appended overlay styles belong

A `p-dialog`, dropdown panel or calendar with `appendTo="body"` is moved outside
the component's host element. It therefore **cannot** be styled by
component-scoped rules and does **not** inherit `:host` custom properties.
`:host ::ng-deep .my-dialog` will not match it.

Ownership rule:

| Concern | Where it lives |
|---|---|
| Overlay shell: width, radius, header/body/footer chrome | global `src/styles.scss`, scoped by the overlay's unique `styleClass` |
| Overlay dark theme | global `src/styles.scss` under `[data-bs-theme='dark'] .my-dialog` |
| Overlay RTL | global `src/styles.scss` under `[dir='rtl'] .my-dialog` |
| Overlay z-index / stacking | global `src/styles.scss` |
| Content inside the overlay that is still part of your component template | component SCSS, plus the variables redeclared on the overlay root |

`src/styles.scss` already carries the shared body-appended dialog and dropdown
overlay rules. Put new overlay rules beside the matching existing rules rather
than recording volatile selector counts or fighting encapsulation with
`::ng-deep`.
`app-data-table` content remains owned by its shared component and follows
block 6.

Always give the overlay a unique `styleClass` so the global rule cannot leak to
every dialog in the app.

### Dark theme selector inside a component

For an **ordinary component** element, `[data-bs-theme='dark']` written inside
component SCSS will not match, because the attribute sits on `<html>` which is
outside the component's scope. Use `:host-context`:

```scss
:host-context([data-bs-theme='dark']) {
  --vehicle-status-reserved: #f0b35a;   // a feature-owned domain token only (block 25)
}
```

Use the bare `[data-bs-theme='dark'] …` form only in **global** `styles.scss`,
where it is the correct selector for body-appended overlays. Feature-owned
direct table rules use `:host-context([data-bs-theme='dark'])`.

EditorDialog workflow footer actions use its public typed `footerActions` /
`footerActionRequested` contract (UI13). Shared secondary-button geometry,
wrapping, icons, focus, RTL and theme apply; the feature supplies translated
content and state, never copied footer markup or a separate button palette.
Empty actions retain the existing footer.
The shared footer group wraps with min-width0/end alignment and the existing8px
gap. The global app-editor-dialog body-overlay selector mirrors Previous/Next
chevrons in RTL; a feature-host selector cannot target the moved overlay.

**Check:** shared primary component, `sigma-secondary-button` and `sigma-danger-button`
instead of raw Bootstrap or feature-local button classes · colours from the global
`--sigma-*` tokens, no feature palette · glyph white on solid · loading disables double execution · both
themes declared · dialog variables declared on the overlay class ·
`aria-hidden` and `aria-label` correct.

---

