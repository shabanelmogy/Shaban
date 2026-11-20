<!-- Part of UI block 1: see ../01-feature-folders-and-wiring.md. Same status and authority as the block. -->

### Global viewport and vertical-scroll ownership

The authenticated Sigma shell must not make the browser document and the
feature content competing vertical scroll owners. `LayoutComponent` owns the
`sigma-app-viewport` body class while the authenticated shell is active. That
class is bounded to one dynamic viewport, the flex ancestors use `min-height: 0`, and
`.app-content` is the shell's last-resort scroll owner. Under the *No page
scroll* rule below, no Sigma route may rely on it: every route fills its box and
scrolls inside its own components. The shell rule stays as the safety net:

```scss
html { height: 100%; }

body.sigma-app-viewport {
  height: 100dvh;
  min-height: 100dvh;
  overflow: hidden;
  overscroll-behavior: none;
}

body.sigma-app-viewport #kt_app_root,
body.sigma-app-viewport #kt_app_page,
body.sigma-app-viewport #kt_app_wrapper,
body.sigma-app-viewport #kt_app_main,
body.sigma-app-viewport #kt_app_main > .d-flex.flex-column.flex-column-fluid {
  min-height: 0;
  overflow: hidden;
}

body.sigma-app-viewport .app-content {
  min-height: 0;
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}

@media print {
  body.sigma-app-viewport.app-print-content-only,
  body.sigma-app-viewport.app-print-content-only #kt_app_root,
  body.sigma-app-viewport.app-print-content-only #kt_app_page,
  body.sigma-app-viewport.app-print-content-only #kt_app_wrapper,
  body.sigma-app-viewport.app-print-content-only #kt_app_main,
  body.sigma-app-viewport.app-print-content-only #kt_app_main > .d-flex.flex-column.flex-column-fluid,
  body.sigma-app-viewport.app-print-content-only .app-content {
    height: auto;
    min-height: 0;
    overflow: visible;
    overscroll-behavior: auto;
  }

  body.sigma-app-viewport.app-print-content-only .app-content {
    flex: none;
    scrollbar-gutter: auto;
  }
}
```

Add the class in `LayoutComponent` initialization and remove it
on destruction; do not use Metronic's persistent `app-default` class as the
lifecycle boundary. Authentication and error layouts then keep normal document
flow. Do not globally hide overflow without leaving one
keyboard- and touch-scrollable content region, and do not hide the content
scrollbar merely to imitate a short screenshot. Feature pages must not add a
second page-height calculation or body scroll lock. Dialogs continue to own
their bounded internal scroll. The `app-print-content-only` override must
release the shell height and overflow so multi-page reports are not clipped;
pair it with the print lifecycle in block 21.

**A bounded route fills the container the shell already sized — it does not
recompute the page height.** The shell gives the routed content an exactly-sized
box: `.sigma-shell__content` owns the bounded content region, and its
`.sigma-shell__route` child is `flex: 1 1 auto; min-height: 0`. So the route host only
has to claim it:

```scss
:host {
  display: block;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}
```

Do **not** calculate route height by subtracting header, toolbar, footer or
per-screen offsets from the viewport. The shell already owns those boundaries;
a second calculation can leave unused space or overflow when the shell changes.
Use the container-fill `height: 100%` contract above and bounded internal scroll
owners. Retired Metronic dimension variables do not describe the current shell.

The shared class `sigma-route-host` is this `:host` block (`host: { class: 'sigma-route-host' }`
in the component metadata); `Workshop/Job/components/list` is the reference. Do not repeat the
block in feature SCSS. Legacy screens still carrying a viewport calc are
unification debt: do not copy the calc, and replace it with `height: 100%` when
the feature is reviewed.

**Full available width — implementation and handoff gate.**
For a standard shared list/editor/workspace, implement this exact ownership chain:

1. Trace the live lazy route to its actual component. Declare
   `host: { class: 'sigma-route-host' }`; the shared `src/styles.scss` owner supplies
   its block layout and container-fill height. Write no feature `:host` geometry.
2. Put the shared page (`sigma-list-page` or `sigma-editor-page`) directly inside
   that host, then its shared panel. Their normal block/column stretch fills the
   available route width, excluding only the shared page inset. Keep title,
   filters, summaries and the bounded body on that panel's logical edges.
3. Inspect the actual shared declarations **and every feature-local override**
   affecting this chain: display, flex direction/growth, grid tracks, alignment,
   width/inline-size, max-width/max-inline-size and ancestor wrappers. In
   particular, a feature `:host { display: flex; }` defaults to a row; a page
   child with default `flex: 0 1 auto` can become content-width. A shared class
   name does not cancel a more specific encapsulated host rule. Do not repair
   this by adding another width rule, `100vw`, viewport calculations or a fixed
   max-width; remove the conflicting feature geometry and reuse the shared owner.
4. If the screen has a documented multi-pane exception, put its layout on the
   **inner workspace**, preserving the outer host/page/panel contract. A new
   reusable capability belongs to the existing shared owner under Master5;
   record a source-supported exception before introducing different outer geometry.
   An approved flex-parent exception must explicitly grow/stretch its direct
   page child (`min-width: 0; flex: 1 1 auto`, or its shared equivalent) and
   preserve scroll containment and print release; it is not the standard host.
5. In the existing screen review, record the route/component, shared and local
   selectors, before/after winner and width/stretch contract at each link.
   Reconcile empty, loading, error/Retry and populated states: data must not be
   what makes the card reach full width. Keep the body/table as the single scroll
   owner. UI29 owns the responsive/visual acceptance matrix; pending browser
   verification is explicit and never inferred from class-name or syntax checks.

The Monthly Posting correction is the concrete failure example: deleting its
local flex host restores the existing shared block host. Do not copy the removed
host rule into the next screen. This gate applies to new and reviewed screens;
it does not authorize unrelated screen rewrites or browser/build execution.

#### Shared list page shell

> **Status: Canonical** — classes in `src/styles.scss`; reference `Workshop/Job/components/list`
>.

A list route writes **no** page, panel, header, alert or table-fill SCSS. It uses:

| Where | Use | Replaces the feature copy of |
|---|---|---|
| Component metadata | `host: { class: 'sigma-route-host' }` | the container-fill `:host` block above |
| Page | `<section class="sigma-list-page">` | `.feature-page` |
| Card | `<div class="sigma-list-panel">` (dark shadow included) | `.feature-panel` |
| Title | `<header class="sigma-list-header"><app-feature-title>` | header wrapper rules |
| Filters | `form[appFilterPanel]` (block 4) | the filter strip |
| Alerts | `div.sigma-alert` (danger), `sigma-alert--warning` | `.feature-alert` |
| Secondary actions | `button.sigma-secondary-button` (Export, Reset, header actions) | `.feature-secondary-button` |
| Grid | `<div class="sigma-list-table"><app-data-table [fill]="true">` (block 6) | the table wrapper and the `::ng-deep` fill block |

The chain below is what these classes implement. A screen that needs something they do not
express records it as an exception in its review; it does not restyle the shared classes.

#### Shared editor page shell

> **Status: Canonical** — classes in `src/styles.scss`; reference `Workshop/Job/components/editor`
> (step 3 of the shared-first rewrite, 2026-10-01).

A routed editor (block 13 *Modal or routed page*) writes no page, panel, alert, field, totals or
footer SCSS. It uses:

| Where | Use |
|---|---|
| Component metadata | `host: { class: 'sigma-route-host' }` |
| Page / card | `section.sigma-editor-page` > `div.sigma-editor-panel` (same values as the list shell) |
| Title | `app-feature-title` with a Back button `button.sigma-secondary-button.sigma-icon-button` in `feature-title-leading` |
| Alerts | `div.sigma-alert`, `sigma-alert--warning` |
| Form region | `form.sigma-editor-form` > `div.sigma-editor-body` — the bounded region; each pane inside owns its scroll. A one-pane editor (step form, plain record) puts its sections in `div.sigma-editor-scroll`, the single scroll owner; its children keep their content height (`flex: 0 0 auto`), so a section is never squeezed under the next one |
| Fields | `div.sigma-editor-grid` (`--sigma-editor-columns`, default 4; 2 under 1024px, 1 under 700px) of `div.sigma-field` (label + one control of exactly `--sigma-editor-control-height` — 34px, the filter height — for inputs, dropdowns, calendars and numbers; cells align to the top, so an error under one control never moves its neighbours; `sigma-field__read` for a read-only value, `--full` spans the row, `--check` for a checkbox with its label) and `app-field-error` (block 19); a file is `div.sigma-file-field` (block 18) |
| Document totals | `div.sigma-editor-totals` (`__grand` for the total) with the `money` pipe; Debit/Credit summaries use `sigma-report-summary-bar` (block 14) |
| Footer | `footer.sigma-editor-footer`: Cancel `sigma-secondary-button`, then the primary action |

The feature keeps only its workspace layout (for example Job's group list and detail panes).

**Preserve working composition during shared adoption.** Replacing feature chrome with shared owners does not authorize
flattening an existing two-pane workspace, removing semantic field groups,
changing field spans/column counts or moving charges/totals into the same scroll.
Capture the previous composition from current source, relevant Git history and
owner evidence before replacing layout rules. Carry its pane placement, group
order, responsive behavior, internal scroll and print contracts through the
shared shell unless the owner requests a layout change or a documented defect
requires one. Record a before/after composition comparison and preserve current
business bindings; never restore whole historical files over later logic fixes.
Finding a grid declaration or using shared class names is source evidence only,
not visual acceptance (Master5; UI29). Rental Agreement's removed workspace and
Booking's flattened schedule/vehicle/customer groups are the motivating source
regressions; preserve their existing composed structure rather than copy their
old palette or fixed overlay positioning.

**Dense document header row.** For comparable
routed document headers, arrange short inputs in one equal-track row when the
wide-screen space supports readable controls. Include Discount with the other
short header inputs when that field belongs to the document; Notes keeps
`sigma-field--full` on a separate row. Set the existing public
`--sigma-editor-columns` to the visible field count, including conditional
fields, instead of fixed widths or feature grid CSS. Purchase Requests uses6
for General and5 for its other types; these counts are evidence, not universal
defaults. Keep the shared two-column1024px/one-column700px fallback and internal
scroll; do not force a single unreadable row at narrow widths. Preserve the
feature's actual field order, validators and data contract. Apply the complete
comparable-editor checklist in UI13 rather than adopting this row in isolation.

**Shared three-pane editor.** Job and JobEstimation
use `form.sigma-editor-form--three-pane` and
`div.sigma-editor-body--three-pane` with three rendered siblings:
`sigma-editor-pane--master`, `sigma-editor-pane--jobs`, and
`sigma-editor-pane--detail` (each also `sigma-editor-pane`). The shared owner
in `src/styles.scss` uses 240–280px / 170–200px / remaining-width columns,
10px gaps and bounded full-height panes. Master fields use
`sigma-editor-grid sigma-editor-pane-fields` inside `sigma-editor-scroll`
for one field column; the Jobs list and selected detail retain their own
internal scroll, fixed summary and outside Save/Cancel footer. An Angular
`ng-container formArrayName` groups the latter two without a DOM grid wrapper,
preserving the existing control hierarchy. A named inline-size container on
the form responds to available width: at 900px the master spans the first
column and Jobs/details stack in the second; at 620px all three stack in source
order. Print releases this layout. Features do not copy these grid/breakpoint
rules. One component serves Create/Edit/View; content and financial contracts
remain unchanged.

**Check boxes (G9, 2026-10-01).** Every boolean field is its own
`<div class="sigma-field sigma-field--check">` with the input before its label. Two check boxes
never share one field or one label.

#### No page scroll — one scroll owner per region

Owner requirement (2026-09-28): **the page never scrolls, at any breakpoint.**
`.app-content` must not show a scrollbar. Only components scroll, each inside
its own bounded box:

```text
.sigma-route-host        height: 100%; overflow: hidden        (container-fill, above)
 └ .sigma-list-page      flex column; min-height: 0; overflow: hidden
    └ .sigma-list-panel  flex column; min-height: 0; overflow: hidden
       ├ .sigma-list-header / app-feature-title   flex-shrink: 0   (fixed, block 3)
       ├ form[appFilterPanel]                      flex-shrink: 0   (fixed, block 4)
       └ .sigma-list-table   flex: 1 1 auto; min-height: 0; overflow: hidden
          └ app-data-table [fill]   rows are the single scroll owner, paginator fixed (block 6)
```

An editor or workspace that is not a list uses the same chain with its own region
(form pane, master/detail pane) as the scroll owner, until the shared editor page shell
(step 3 of the shared-first plan) exists.

- A region has exactly **one** vertical scroll owner: grid rows (block 6), a
  form or master/detail pane (blocks 12 and 14), or the dialog body (block 13).
  Never nest two scroll owners for the same content.
- Narrow widths rearrange panes (stacking, fewer filter columns) but never hand
  scrolling back to the page. Do not switch outer containers to
  `overflow: visible` and do not add content-sized minimum heights at a
  breakpoint.
- The panel is the primary card, `sigma-list-panel`. Its padding, border, surface, shadow,
  gap and dark values live in `src/styles.scss`; do not restate them in a feature or in
  review notes. Legacy `.card` / `.card-body` wrappers are not used.

**Fixed workspace tools.** Keep a fixed search/action
bar as a nonshrinking sibling before its bounded scroll content. The content owns
`min-block-size: 0` and `overflow: auto`; the parent retains `overflow: hidden`.
Do not implement this contract with sticky positioning or viewport offsets.
`PermissionTreeComponent.fixedToolbar` adopts that structure for the Roles preview:
the shared host fills a bounded flex column, its toolbar remains outside
`permission-tree__content`, and optional `[permissionTreeContentStart]` status
content scrolls with the groups. The scroll region is keyboard focusable and
labelled; print releases its overflow. This input defaults to false because the
existing Role dialog owns its body scroll and supplies no bounded tree region.
Logical spacing and Sigma tokens preserve direction and theme. Source compilation
and Sass checks verify structure; owner visual/keyboard acceptance stays pending.

#### Base component

List and details components extend `BaseComponentService`
(`shared/service/base-component.service.ts`). It already provides `loading`,
`router`, and `activatedRoute`, so do not inject a second `Router`. It also
exposes `subscriptionId`, read from `localStorage`. Never put that value in a
request payload: the tenant is server-owned, and the per-screen cleanup is block 2
*Write payloads carry client inputs only* (backlog 8 and 19).

#### Retired Metronic shell instructions

The former toolbar-band geometry, cached layout configuration and
`--bs-app-toolbar-height` synchronization instructions were removed on
2026-10-23 after complete vendor retirement. They described deleted shell/Sass
owners and must not guide current work. Current shell composition is owned by
this block's *Supported platform and root composition* and *Sigma authenticated
shell — PrimeNG* sections, together with the container-fill/no-page-scroll contract above.
The decision and source reconciliation remain in
`reviews/Archive/Completed/2026-10-23/COMPLETE_VENDOR_RETIREMENT_FINAL_RECONCILIATION.md`.

Reducing space above a card changes the route's outer inset or current shell
placement, not the card's internal padding. Shared owners retain the card's
internal inset; changing it moves its contents without moving the card edge.

**Routed editor pages:** a record that block 13's decision rule (D4-2) sends to a page uses the
shared editor page shell above: container-fill host, `min-height: 0`, `overflow: hidden`, a fixed
`sigma-editor-footer` outside the form body, and only the panes inside `sigma-editor-body` own
vertical scroll. Records the rule keeps in a modal use `app-editor-dialog` (block 13).
**Routed settings-workspace exception:** when a routed settings or account-mapping
workspace is designed without main-page scrolling (every Sigma route is, under
*No page scroll*), bound the route surface with the container-fill host and use
`overflow: hidden` on the route/card flex chain. Keep the
feature header, Save action, workspace tabs and compact search/filter controls
outside the scrolling region. Exactly one feature-owned content viewport may use
`overflow-y: auto`; child sections and editable tables must grow naturally and
must not add a second vertical scrollbar unless a separately bounded collection
is an explicit business requirement. Horizontal tab/table overflow remains
allowed. On narrow screens, preserve this single vertical-scroll owner rather
than falling back to nested page + child scrolling.

**Settings parent/child composition.** Administration Settings
uses the shared route/page/panel at its parent only. Its real route links remain
native anchors with an accessible navigation label and current-page state;
the separately bounded wrapping navigation cannot consume more than25% of the
card. `sigma-settings-outlet` bounds the lazy child, whose shared route host
contains `sigma-settings-page`. That shared column keeps FeatureTitle and
`sigma-editor-footer` outside `sigma-settings-content`, the content scroll
owner. A child form uses `sigma-editor-form`; do not add another page/card inset
or a feature host geometry rule. Ordinary settings keep their existing groups;
Holiday uses a fixed filter and `sigma-list-table`/DataTable fill instead.

For explicitly requested internal vertical groups, reuse
`sigma-settings-sections`:150–190px navigation,12px gap and shrinkable content;
below700px stack zero-minimum2:3 tracks. EditorTabs owns orientation, stable
IDs, keyboard, paint and navigation scrolling (UI13), while the content owns
its independent scroll. Keep keyed panels/models mounted with matching
tab/panel IDs and hidden inactive panels; selection performs no HTTP or save.
Common and Document Number use shared `revealInvalidSettingsSection` with their
actual section/control map: mark touched, select the invalid field's panel and
delegate reveal/focus to `focusField` without opening a picker. FieldError owns
inline feedback. Fields retains its template-driven graph and exposes only
returned entity blocks. Print releases the shared allocation and shows the
mounted sections. API Key retains its independent Google/DeepSeek saves and
guard. This replaces its former parent-only bounded compatibility exception
for the reviewed Settings unit; it authorizes no backend/API migration.

**Settings field composition.** Inside that bounded content,
use existing compact FormSection for semantic groups rather than loose large
headings and accumulated legacy column margins. Keep business groups, controls,
validation and read/save ownership. A title that repeats the active tab uses
FormSection's existing showTitle=false; distinct subgroups keep their headings.
`sigma-settings-fields-grid` owns three equal shrinkable tracks, two when the
actual content pane is960px or narrower and one at520px or narrower. It uses
the existing sigma-field controls/34px owner; features do not create a new
control-height contract or style publisher internals. Separate ordinary inputs
from Boolean choices within the same semantic group, preserving bound values.

`sigma-settings-options-grid` owns two equal tracks, one when the pane is760px
or narrower. `sigma-settings-option` is the shared Boolean row:46px minimum,
10px/12px block/inline padding,10px control/label gap, existing control radius
and Sigma surface/border/text tokens. Both the checkbox and its full wrapping
label are centered vertically, including multiline labels; no legacy label
palette, fixed text height, clipping or feature override. Retain native/PrimeNG
input-label IDs and focus semantics. FormSection owns card paint/spacing/theme;
the content owner separates cards by12px. The existing DDA mapping matrix uses
shared mapping rows instead of nesting independent field grids; it stacks its
field label above mapping/required below520px. Collection tables retain their
existing owner and semantics. No second content scrollbar, changed save fragment,
new request, cache opt-in or numeric/financial policy follows this composition.

**Routed financial collection editors** (Opening Balances) follow the same container-fill chain;
the editable table is the row-scroll owner through `[fillHeight]` + `[stickyHeader]` (block 14).
The former route-level `calc(100dvh - …)` grow-until-cap boundary is legacy and is removed in
the screen's review.
