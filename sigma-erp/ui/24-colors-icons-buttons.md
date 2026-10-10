## 24. Colors, icons, buttons

> **Status: Canonical** — global tokens and shared buttons (shared-first rewrite 2026-10-01).
> Remaining legacy: primary-colour and icon-library forks elsewhere (backlog 1, 15); Statement of Account now uses shared tokens and Bootstrap Icons (2026-10-02, source-only).

### Button roles

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
| `loading` | Swaps to the busy icon, sets `aria-busy`, disables execution, and prevents double submission |
| `loadingIcon` | Optional busy-icon override; defaults to `bi bi-arrow-repeat` |
| `pressed` | Click/keyboard action for `type="button"`; form submit buttons normally rely on `(ngSubmit)` |

The shared component consumes `--sigma-primary` and
`--sigma-primary-hover`, keeps the solid glyph white, provides visible focus,
spins the busy icon, and reverses directional arrow glyphs in RTL. Consumers
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

A feature uses these tokens and declares **no** palette of its own (`--feature-text`,
`--feature-surface`, … and their dark copies). It may declare one token only for a real domain
colour that no shared token expresses (for example a vehicle-status colour), with its dark
value. The 108 feature stylesheets that still declare palettes (2026-10-01) switch to the
global tokens in their reviews.

### Shared summary/KPI cards

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
`ariaLabel`, `density`, `layout`, `minCardWidth`, `maxHeight`, `selectable`, `selectedId` and
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

Keep 12px separation between a summary-card region and the following grid. Use
the parent's existing gap when it already supplies this separation; otherwise
place margin-block-end on the component host, not its private card/list
selectors. DebtCollection and ReceivableAgeAnalysis use this host placement.

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

**Check:** shared primary component, `sigma-secondary-button` and `sigma-danger-button`
instead of raw Bootstrap or feature-local button classes · colours from the global
`--sigma-*` tokens, no feature palette · glyph white on solid · loading disables double execution · both
themes declared · dialog variables declared on the overlay class ·
`aria-hidden` and `aria-label` correct.

---

