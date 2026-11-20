<!-- Part of UI block 13: see ../13-modal-with-tabs.md. Same status and authority as the block. -->

### Shared accessible tabs

Use the shared component for every new or refactored custom editor tablist. The
feature supplies a typed key union and translation keys; the shared component
emits only a valid key from that list:

```ts
import {
  EditorTab,
  EditorTabsComponent,
} from 'src/app/modules/shared/components/editor-tabs/editor-tabs.component';

type FeatureEditorTab = 'general' | 'children' | 'documents';

readonly tabs: ReadonlyArray<EditorTab<FeatureEditorTab>> = [
  { key: 'general', label: 'feature.tabs.general', icon: 'bi bi-card-list' },
  { key: 'children', label: 'feature.tabs.children', icon: 'bi bi-list-check' },
  { key: 'documents', label: 'feature.tabs.documents', icon: 'bi bi-file-earmark-text' },
];

readonly currentTab = signal<FeatureEditorTab>('general');
```

`EditorTab.count?: number` optionally displays a shared count badge beside the
translated label. The feature supplies a nonnegative row count from its current
data; zero remains visible and omitting `count` leaves existing tabs unchanged.
Use a computed tab list when counts change. Keep counts separate from translation
keys and leave badge sizing, colours and dark/active states to the shared component.

Import `EditorTabsComponent` in the standalone feature component, then keep the
panels in the feature form:

```html
<app-editor-tabs
  [tabs]="tabs"
  [activeTab]="currentTab()"
  [ariaLabel]="'feature.editorSections' | translate"
  idPrefix="feature-editor"
  (activeTabChange)="currentTab.set($event)"
/>

@switch (currentTab()) {
  @case ('general') {
    <section
      id="feature-editor-panel-general"
      role="tabpanel"
      aria-labelledby="feature-editor-tab-general"
      tabindex="0"
    >
      …feature fields…
    </section>
  }
}
```

`idPrefix` is required and must be unique among simultaneously rendered tabsets.
Each panel ID must be `${idPrefix}-panel-${key}` and its `aria-labelledby` must
be `${idPrefix}-tab-${key}`. Tab labels are translation keys; `ariaLabel` is the
already translated accessible name. The shared component owns the tab-strip
styles and consumes the shared editor-dialog tokens plus the global Sigma
primary tokens. Feature SCSS owns only panel content and responsive layout.
The component also owns the dark theme: its stylesheet is encapsulated, so its
dark rules sit under `:host-context([data-bs-theme='dark'])` (block 25), and
their token fallbacks are the dark editor-dialog values. A host that defines
the `--app-editor-dialog-*` tokens (the dialog, the Link Accounts card) keeps
its own colours; a routed workspace that defines none still gets a dark strip.
Do not add feature SCSS or page tokens only to darken the tabs.

`app-editor-tabs` has two canonical appearances. `underline` is the default for
modal/detail editors. `workspace` is the routed dense-workspace appearance and
is the single source of the rounded tab strip, icon tile, active underline,
hover/focus treatment, compact width sharing, RTL keyboard behavior and dark
state used by both Opening Balances and Link Accounts. Use it as:

```html
<app-editor-tabs
  [tabs]="tabs"
  [activeTab]="currentTab"
  [ariaLabel]="'feature.sections' | translate"
  idPrefix="feature-workspace"
  appearance="workspace"
  (activeTabChange)="setCurrentTab($event)"
/>
```

Do not reproduce workspace-tab markup or styles in feature SCSS. When an older
workspace is refactored, remove its local tab button loop and point it to this
shared appearance so all routed workspaces stay visually and behaviorally
consistent.

**Horizontal tabs share one compact row without a scrolling rail.** Both appearances keep one horizontal row and share the
available container width with content-sized `flex:1 1 auto` buttons, zero minimum
width and a100% maximum. Use3px strip gaps,6px block/4px inline button padding,4px content gaps and
36px minimum button height. Horizontal workspace icon tiles use20px/5px radius
and12px glyphs; count badges use18px minimum width and3px inline padding.
Translated labels remain on one line, preserving the11px label font. Size each
button from its content rather than forcing equal tracks that wrap longer names.
At extremely narrow widths, ellipsize the label inside its shrinkable region;
keep the full translated text in the DOM/accessibility name and the button title.
The horizontal host does not shrink in a flex column. Keep every tab, icon,
count and focus state reachable; clipping overflow alone is not a fix for
oversized nonwrapping buttons. Do not hide labels, add a feature override or
require per-screen opt-in. The owner's explicit follow-up chose smaller widths
and spaces to retain one row, superseding the proposed multirow wrapping; the
next clarification reduced inline padding to4px and retained single-line labels.
RTL-aware Left/Right, Home/End, roving focus, IDs and typed events retain their
current contract. Vertical tabs retain their bounded vertical scroll/Up/Down
behavior and existing density. Verify long EN/AR labels, counts and short/narrow
layouts in both themes; source checks are not visual acceptance.

**Vertical section navigation.** The existing
EditorTabs owner exposes `orientation: 'horizontal' | 'vertical'`, default
`horizontal`. Use `orientation="vertical"` for an explicitly requested side
column; do not rotate or copy tab markup in feature CSS. The owner publishes
matching aria-orientation, uses Up/Down independent of RTL in vertical mode,
retains Home/End and roving focus, and keeps RTL-aware Left/Right in horizontal
mode. Disabled behavior and typed activeTabChange/IDs stay unchanged. Vertical
labels wrap, the strip scrolls inside its allocated block size, and workspace
selection uses a logical-start marker; existing theme tokens own the paint.

**Stable vertical navigation viewport.** The
vertical EditorTabs host is a bounded flex column with overflow:clip, and its
tablist fills that allocated block size with min-block-size:0. Only the tablist
scrolls; disable its scroll anchoring and reserve its scrollbar gutter so panel
replacement or selection does not resize or scroll a second hidden host. Keep
the existing keyed buttons mounted when changing the active panel. For vertical
arrow/Home/End navigation, focus with preventScroll and reveal an offscreen tab
only within that tablist, without scrolling clipped ancestors or the page. A
visible tab requires no scroll. This immediate tab-navigation operation belongs
to EditorTabs; form validation continues using focusField and its rendering/
overlay lifetime. Horizontal tabs retain their existing behavior.

The feature owns only the inner sidebar/content allocation under UI1's unchanged
route/page/panel chain. Preserve the requested tab hierarchy: TripBooking keeps
its existing General/Documents tabs horizontal, and uses vertical tabs only for
the six existing groups inside General (booking, schedule, pricing, vehicle/driver,
guest and additional information). Each level has independent active state and
unique tab/panel ID prefixes. Validation activates both the parent and the owning
child section before focusing its invalid control, including cross-field errors;
switching panels preserves the parent FormGroup and its draft.
TripBooking uses150–190px navigation beside the selected group's shrinkable
content,12px gap, and stacks the still-vertical navigation above content below700px.
For these six inner tabs, the narrow stack allocates two fractional tracks to
navigation and three to content, both with zero minima, so the navigation and
field region can scroll independently in short viewports without consuming each
other's whole height.
Totals/footer stay outside that workspace; print hides navigation and releases
its grid into ordinary flow while the existing print session prepares panels.
Keep the same fields, parent form, validation-tab activation and draft state in
Create/Edit/View. This opt-in capability changes no other consumer's default
orientation; source-only, keyboard/RTL/theme/short-height/print visual acceptance
remains pending.

Read-only reports may reuse `appearance="workspace"` for section navigation.

**Internal Settings groups.** When a settings section has
several existing groups, compose its inner horizontal tabs with
`editor-tabs/SettingsGroupTabsComponent` and direct
`ng-template[appSettingsGroup]` declarations. The companion delegates navigation,
paint and keyboard behavior to EditorTabs; it owns only group template lifetime,
selection and bounded content allocation. Supply a unique idPrefix per parent
section, a translated label, stable group key/groupLabel, and groupControls for
reactive invalid-field navigation. Required directive/component imports belong
to each actual standalone consumer. A single group needs no extra tab strip.

Render every projected group through NgTemplateOutlet and hide inactive panels,
keeping their FormGroup/controls and draft mounted. Each nesting level has its
own state and matching tab/panel IDs. The real section activates first, then
the existing revealInvalidSettingsSection callback selects the matching inner
group through its public revealControl method, before shared focusField runs.
Retain one content scroll owner: the inner group body, while its enclosing
settings-content/panel is bounded; a form-type context card stays fixed above
its field-group tabs. Do not move Save into groups or perform reads/saves on
tab selection. Repeated FormSection titles use showTitle=false, preserving
their actions and print headings. Print hides strips and releases every mounted
panel. Common, Document Number, Fields, Notifications, User Management and
Forms/Fields supply the adoption evidence.
Their panel visibility and full-report print contract follow blocks 20 and 21;
the editor `@switch` example above is not suitable when printing requires every
report section to remain rendered.

**Settings tab search.** Use the shared TabSearch for
routed Settings links and the EditorTabs `searchLabel` input for internal
strips. A strip with one tab needs no search. Match the translated label in
the current language with the same text normalization as menu search. Use
the shared single-line field, clear behavior and a translated live empty
state above the existing navigation viewport. Keep selection, panel IDs,
mounted form controls and drafts while typing. The tab stop falls back to
the first result when the selected tab is filtered out. Arrow/Home/End
navigation uses the result set; a programmatic activation excluded by the
query clears that strip's search. Enter in search does not submit the owning
form. Search is local to its strip, with no reads, saves or print output.

Do not keep a feature-local `onTabKeydown`, tab-button loop, or duplicate tab
styles after adopting `app-editor-tabs`.

**Full-height record tabs (generalized owner choice, 2026-10-15).**
For a section whose title repeats its owning tab, reuse FormSection's
`showTitle=false` to hide the noncollapsible heading label/icon/description on
screen while preserving projected/mock actions. An actionless header leaves no
empty row. Keep its required translated title for printed section headings;
collapsible sections retain their disclosure label. `showHeading=false` still
removes the whole header and its actions, and is not a title-only substitute.
Default showTitle=true preserves other consumers; apply the title-only option
only to repeated section names, not distinct subsections within a tab.
Evidence: Sales Agreement repeated tab-name correction2026-10-27, shared public
contract and source-only conformance; owner visual/RTL/theme/print check pending.

For comparable routed documents with peer header/details/documents sections,
use tabs by default when implementing or reviewing that screen. Replace its stacked
header/details allocation with a fixed shared workspace tab strip and one
remaining-space active panel (`flex:1 1 0; min-height:0`). Use separately named
Basic Information, Details and Documents panels when those sections exist;
each retains its own bounded field/document scroll or UI14 fill/sticky row
frame. Do not retain the stacked header's percentage basis inside tabs. Keep
one parent form and all controls/values when conditional panel views change,
plus fixed totals/Save/Close outside them. Tab changes are not Save or discard.
When a panel contains a subscribed read owner, retain its mounted instance
across tab changes rather than repeating initialization reads. Native hidden
with the existing shared hidden rule can select the visible panel while keeping
the same form controls and DocumentCurrency/policy read lifetime. The shared
print session reveals every required panel and restores visibility afterward;
do not add a local cache to compensate for remounting. Evidence: SalesQuotation
tab adoption2026-10-27 and DocumentCurrency initialization/source tracing;
source-only, owner network/print acceptance pending.
Prevent switching during upload, Save, cleanup, pending child confirmation or
other work that must keep its controls mounted. Invalid Save selects the
owning section before shared invalid-field focus; an empty required collection
selects its Details tab. Match shared tab/panel IDs and ARIA linkage.

Print must mount every required saved section independent of the active tab,
hide the tab strip and release pane bounds; never print only the active panel.
Use the shared print session to prepare this state before output. Verify all
three modes, entered values across switching, invalid fields in inactive tabs,
upload/cleanup guards, row overflow and printing from each tab. The owner's
later generalization makes this the default for comparable peer-section
documents, not authorization for a bulk migration of every legacy screen.
Ordered workflows retain UI12 steps; special/three-pane shapes and explicit
owner exceptions retain their documented architecture.


### Hidden tab panels and first-activation reads
CSS hiding alone does not defer component creation or its subscribed reads;
do not mistake it for lazy initialization. Reads required for the whole record
still start with the record. For an
expensive independent tab read, start it on first activation and retain the
loaded instance/data while switching tabs for the same saved record. Reset the
instance and request state when the record ID, reload or tenant/context changes,
while preserving busy/dirty/print guards, cancellation, teardown, error and
Retry. A direct tab link activates the same panel and first-activation read;
do not duplicate the request in link and tab-change handlers. Keep the tab's
progress owner and draft state compatible with the shared modal shell; UI22
still governs whether that read is global, local or silent.
