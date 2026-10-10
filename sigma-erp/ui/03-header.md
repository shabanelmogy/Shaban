## 3. Header

> **Status: Canonical**

Always `app-feature-title` with the Create button in its slot. Never a second
title in the Metronic toolbar.

`app-feature-title` owns the default title inset: 8px from the panel's top, left,
and right edges with 16px separation below, matching the component host margin.
The shared report/workspace alignment exceptions are defined below. A
feature must not compensate by re-padding the title or the panel; where the
title needs a compensating offset, match the responsive panel padding instead.

**Owner general presentation choice, 2026-10-03:** the title card uses the same
surface wash, border, shadow, 8px radius and 3px logical-start primary accent as
the shared filter card. Its padding is 8px/10px, matching the list filter panel;
the existing 64px minimum height, title/subtitle/icon and action layout remain.
`FeatureTitleComponent` consumes `--sigma-filter-panel-background`,
`--sigma-filter-panel-border` and `--sigma-filter-panel-shadow`; it does not
maintain a separate card palette. The background token is resolved in both root
and dark-theme scopes (block 4). The shared component owns white, readable,
shadow-free title cards in print.

Canonical report panels align the direct title's inline edges with the filter
by default, as defined in [block 20](20-report-page.md#title-and-filter-card-width).
The earlier scoped modifier remains compatible but is no longer required.
Ordinary lists retain their shared 8px inline inset. Full-width tree/settings
workspaces use `sigma-list-panel sigma-list-panel--workspace`; `src/styles.scss`
removes the title host's and workspace filter panels' inline margins so their
edges match the workspace frame, tabs and content cards. Their vertical spacing
and internal presentation remain shared. Account and LinkAccounts opt into this
modifier. Full-width tabbed editors use `sigma-editor-panel--workspace`, with
the same shared title/filter alignment for a direct title and nested tab filters;
OpeningBalances adopts it across all eight tabs. Features add no local width or card
style overrides. This general owner request supersedes the earlier scoped
report alignment decision; source-only evidence is recorded in
`F:/My Work/Sigma/reviews/SHARED_TITLE_FILTER_CARD_FEATURE_REVIEW.md`.

**Equal card widths (owner general rule, 2026-10-05).** All full-width cards and
region frames on the same layout level in a page share the same available width
and logical start/end edges: title, filters, summary region, content/grid/tree
frame and footer cards. Their shared shell/layout owner supplies one consistent
inline inset. Do not let an extra title margin, double wrapper padding or a local
fixed width misalign a card. Verify both edges at desktop and narrow breakpoints,
in LTR and RTL. Intentional columns and nested cards align within their own
container; when stacked, cards on the same level share its width. Individual
summary tiles retain the shared SummaryCards grid/row sizing; align the whole
summary region with its sibling frames. Apply this rule in new work and subsequent
screen reviews; the present implementation adopts it in Chart of Accounts and
LinkAccounts and OpeningBalances, including title, tab, filter and table frames.

The optional shared `sigma-list-summary` placement class on SummaryCards uses
8px logical inline margins to match ordinary list title/filter/table; direct
workspace children use zero margins. Budget adopts it without changing card
internals or values. Other SummaryCards placements keep their existing bounds.

Import `PrimaryActionButtonComponent` in the standalone feature and use the
shared primary action from block 24. The feature supplies translated content
and behavior; it does not recreate primary-button markup or styling.

The title sits in the shared list shell (block 1); a feature adds no page, panel or header
class of its own:

```html
<section class="sigma-list-page">
  <div class="sigma-list-panel">
    <header class="sigma-list-header">
    <app-feature-title
      [title]="'companyPartners.title' | translate"
      [subtitle]="'companyPartners.manage' | translate"
      icon="bi bi-buildings"
    >
      <app-primary-action-button
        [label]="'companyPartners.addNew' | translate"
        (pressed)="openCreate()"
      />
    </app-feature-title>
    </header>
```

The solid title-icon tile is owned by `app-feature-title`. Its glyph must be
explicitly white by targeting the nested `i` element; feature pages must not
recreate or override that styling. The same explicit-white rule applies to the
icon inside the solid Create button.

A screenshot-confirmed Create action is a functional requirement, not optional
decoration. Do not omit it merely because the write contract is initially
missing, and do not ship it as a disabled or nonfunctional placeholder. When
backend work is in scope, finish Phase 1 and freeze the Add contract before
wiring the editor and enabled Save action. When backend work is outside scope,
record the Add contract as Missing and report the feature blocked instead of
silently changing the demonstrated workflow.

**Check:** icon set · title and subtitle translated · Create inside
`app-feature-title` · shared inline edges match sibling cards/frames (ordinary
list 8px inset; full-width workspace modifier; report default) · 16px separation
below · white glyph in the
solid title-icon tile · white glyph on the solid Create button.

---

