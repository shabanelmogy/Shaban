## 24. Colors, icons, buttons

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [PrimeNG theme hooks, appbar presentation, Sass modules](24/01-primeng-theme-and-sass.md)
- [Shared summary/KPI cards](24/02-summary-cards.md)
- [Body-appended overlay styles and dark theme selectors](24/03-overlays-and-dark-theme.md)

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

### Permission catalogue tools (owner screenshot follow-up, 2026-11-15)

`PermissionTreeComponent` owns its catalogue toolbar across consumers. The owner's
subsequent same-day correction groups the labelled local search, Granted only,
the existing select-all/visible control, selected/total count and Expand all/
Collapse all in one flex row, aligned to the bottom of the search input. The
search has a220px flex basis and grows up to32rem; the filter/action groups
shrink and wrap only as needed within the actual pane width. This supersedes
the earlier two-row presentation. Use12px toolbar padding,10px block/14px inline
gaps, Sigma surface/border/text tokens, and a separate compact34px-minimum count
badge with centered tabular numerals. Native InputText/Button
directives and `sigma-field`/`sigma-secondary-button` retain the shared34px
control geometry. Visible action labels remain alongside decorative icons;
native labels, checked/indeterminate/disabled states and keyboard handlers keep
their existing owners. Do not change selection behavior as presentation work.

The existing `fixedToolbar` mode keeps this entire bar outside its bounded scroll
content (UI1). Content retains16px trailing padding; dialog consumers retain
their owning body scroll. Logical spacing and wrapping preserve RTL and narrow
panes; the existing print rule hides the expansion actions. Reuse the shared
toolbar rather than copying a feature variant. Compilation and source evidence
remain distinct from visual/keyboard/theme acceptance (UI27/29).

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
