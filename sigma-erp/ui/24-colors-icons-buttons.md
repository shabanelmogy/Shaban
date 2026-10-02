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

