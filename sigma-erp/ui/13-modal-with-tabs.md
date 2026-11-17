## 13. Modal with tabs

### Access changes while a body-appended editor is open — 2026-11-06

Adopted editors pass the explicit `accessRequirement` to the existing
`EditorDialogComponent` (or its explicit `accessBlocked` state for a composed
policy). The owner hides/inerts its projected body and hint, renders the shared
access state and prevents mutation footer/primary commands while the requirement
is unsatisfied. Preserve the mounted draft and an already sent write's outcome;
do not destroy the editor or force navigation to enforce a later UI snapshot.
Keep Close/Cancel under the existing closeDisabled/dirty decision contract.

The access boundary wrapper uses `display:contents` so existing forms retain
their flex/scroll ownership, with `[hidden]` explicitly `display:none!important`.
Hiding the route container alone does not cover portals appended to `body`.
Audit the adopted surface's nested preview/dialog/select overlays too: close a
publisher select through its public owner API or give a nested editor the same
owner requirement plus its own permission. MockData's `mockDataAccessRequirement`
and route/generation checks follow this rule; generation completion after lost
access must release a no-preview form freeze without applying proposed values.
UI26 owns the session policy; backend checks remain authoritative.

For a mounted editor whose document can expire while the same actor still has
route access, pass MockData's optional `mockDataPublicationAllowed` callback and
`mockDataCancelled$` notifier (2026-11-10). The callback rechecks the parent
document lifetime before generation, response, preview and Apply. The notifier
cancels a pending replace confirmation or generation, closes a completed preview
and releases its form freeze without changing the original draft. It remains
subscribed after generation completes; replacing the notifier unsubscribes the
old one. Undefined inputs retain existing consumers. Permission grants alone
do not establish mounted document identity. Source-written specifications cover
pending no-preview and completed-preview expiry; runtime execution is pending.
Each active generation also retains its access-denial watch after the finite
response completes, until Apply/Cancel releases it. Denial destroys the generated
candidates and closes the preview; a rapid regrant cannot revive that preview.
The parent notifier covers identity expiry even if the same grants remain valid.

### Shared mock-data form assistance (2026-10-13; owner instruction)

FormSection heading grouping (2026-10-17): non-collapsible icon and title/description
share one nonwrapping flex group; the copy can shrink/wrap within it while the
actions wrap as a separate group. Reuse existing12px/compact9px gaps and icon
sizes; never let a narrow card wrap its icon onto a separate row. Shared
showMockDataAction defaults true; a read-only reference card may explicitly set
false without changing projected actions, registration, tenant preferences or
other sections. Email Templates Data Fields is the scoped consumer. Preserve
RTL/theme/collapsible behavior; owner visual/keyboard acceptance pending.

Owner follow-up adds tenant Settings flags ShowButton/ShowPreview, both default
true. FormSection's existing header actions area now composes the shared
MockDataActionComponent from the nearest mock form context, generating only
supported rendered controls inside that section. Section registration suppresses
the repeated form toolbar; fields outside visible shared sections retain one
Test data heading action scoped only to those remaining fields. A form without
shared sections uses that fallback for its editable fields. Existing projected
Add/other header actions remain. Headings
and action groups wrap within the existing section at narrow sizes, with logical
spacing/theme owned by shared components. No per-screen markup copy is needed.

The root shared service loads preferences once for the current auth-token
session, hides actions until loaded, offers inline Retry on failure, cancels
stale preference reads after successful Save and resets for a changed session.
Monotonic cache revisions also reject older independently subscribed settings
reads that finish after a successful preferences Save; cancellation alone covers
only the cache-owned request.
Settings stores the flags through the same tenant settings owner; key input may
be blank while saving preferences. After a failed settings read, a replacement
key omits unknown flags and reloads status, preserving existing preferences.
Generate captures the preview preference: true keeps Review/Apply; false applies
valid candidates to the draft after generation without mounting a loading or
preview dialog (owner clarification, 2026-10-13). The section action shows loading
and a shared secondary Cancel action. Candidate readiness is independent of dialog
visibility. Frozen controls and root capture gates block click/submit handlers
during pending work, except the mock Cancel control; teardown removes listeners.
Both flows retain the independently configured overwrite confirmation, Cancel,
stale checks and manual business Save. Turning both preview and confirmation off
opens no mock-data modal.
Actual UI/runtime acceptance remains owner-pending.

**Compact heading choices (owner request, 2026-10-15).** When a section consists
only of a title and a small choice group, project that group through the existing
`form-section-actions` slot instead of adding a second content row. Use the
existing group controls/labels and flex wrapping utilities. FormSection's shared
heading wraps whenever its available width runs out, and its actions are bounded
to100% width at every breakpoint. If the shared content region is empty,
`:empty`/`:has` styling hides that empty region and removes only the heading's
bottom divider/padding/margin. Normal populated sections retain their styling;
no new feature input or deep selector is needed. Purchase Requests type radios
adopt this to keep choices beside the title while space permits. Preserve
keyboard/label semantics, read-only/busy gates, full card edges and printing.
Verify long EN/AR choices and intermediate widths as well as narrow screens;
source-only evidence retains owner visual/runtime acceptance.

The third default-true tenant option ShowConfirmation controls only the mock
generator's existing-value overwrite confirmation. Capture it with preview at
Generate start: disabled bypasses that confirmation, preserving the selected
preview flow, pending cancellation/stale checks and manual Save. Settings and
screen discard/domain confirmations retain their owners. This explicit owner
option supersedes the earlier always-confirm mock-data statement; it is not a
general switch for other confirmations. Old reads missing the flag default true;
omitted/null writes preserve it and failed-read key recovery sends no unknown flags.

The owner requested one DeepSeek mock-data capability across editable screens,
with preview and manual Save. `shared/components/mock-data/MockDataFormComponent`
(`appMockData`) and `MockDataFieldDirective`, exported by `MockDataFormsModule`,
own this assistance. Keep existing native form roots, controls, validators,
handlers, child-row Add actions, Save payloads and editor shells. New supported
reactive editors import the shared module and mark their root `[formGroup]`
container with `appMockData`; nested fields use the nearest root. Search/filter,
report, authentication, secret-settings and View/disabled forms are excluded.

Generate captures the form and control identities, freezes the prior editable
state with UI10's helper, confirms replacement through the shared confirmation
service when configured, and opens the padded shared dialog during generation
and preview only when the preview option is enabled.
Cancel/teardown cancels the request and restores the prior disabled state;
Apply rejects stale form/control/value snapshots, rechecks current options and
validators, uses public control events, and marks applied inputs dirty/touched.
It never submits or persists business records. Existing dependent lookups and
backend calculations remain authoritative. Explain skipped candidates and leave
unsupported/grouped/range/custom widgets with their existing screen owner.

**Current-year mock dates (owner instruction, 2026-11-02).** The shared field
adapter constrains generated `date`, `dateTime` and `month` candidates to the
device's current local calendar year, intersecting the real field's existing
minimum/maximum. It sends these effective bounds through the existing metadata;
the backend's strict candidate validation enforces them. Do not hardcode a year
or alter actual control bounds, validators, manual input or Save. Exclude a field
whose allowed range has no intersection with that year, preserving its value.
Time-only candidates retain their existing time bounds. Backend example dates
must use effective bounds first and a dynamic current year for unbounded callers.
Keep ordinary cross-field/domain validation and manual review authoritative.

An editable field derived from other generated inputs may opt out through
`[mockDataIgnore]="true"` on its existing shared field adapter. Its ordinary
manual editing, validation and persistence remain with the feature. For example,
Rental Agreement's day-count shortcut is derived from dates and also changes the
return date when committed; generate the source dates rather than an independent
random count that could overwrite them outside their allowed year.

Only field structure, constraints, route patterns and opaque choice tokens go
to the provider. Current values, record identifiers, secrets and lookup labels
stay local. Owner explicitly requests synthetic Card Number/CVV candidates:
typed `mockDataPaymentField="cardNumber"|"cvv"` marks only native card inputs,
with matching named controls or explicit direct FormControls. This narrow opt-in
permits a masked password input only for cvv; ordinary passwords/secrets/API keys/
tokens and unmarked payment inputs remain excluded. Shared adapter supplies
canonical text names, mock lengths16/3 and validates ASCII digit strings while
retaining leading zeros. Individual/Company card templates mark both inputs;
manual validators/input types/payloads remain. These are generation constraints,
not payment eligibility/type/issuer or new business validation. Server schema/
example/prompt/strict digits validation follow BE18. Current card values never
leave the client; cancellation/stale checks/Add-first/manual Save remain.
Native legacy date/time controls retain string values; PrimeNG
calendars receive local `Date` values without UTC conversion (UI17). Do not add
new native temporal controls as a result of this compatibility adapter.

Settings follow-up2026-11-01: the reviewed24-page Administration Settings unit
now uses UI1's shared parent/child bounded composition. Its previous API-Key-only
parent exception below is superseded for this unit; Google/DeepSeek save/guard
and mock-data contracts remain. Common, Document Number and Fields adopt the
existing vertical EditorTabs without introducing another tab implementation.

The current adoption inventory is `reviews/AI_MOCK_DATA_ADOPTION.json` (254
editor roots, including two inline dialogs). Preview reuses EditorDialog's
public 780px width/540px height and viewport bounds, DataTable's local unpaged
fill layout, and existing button/state owners; feature SCSS owns toolbar placement
only. The existing Settings/API Key route retains independent DeepSeek and Google
sections with one internal content scroll and a fixed action footer. After the
2026-11-01 Settings review, its parent and the other23 children use UI1's shared
settings allocation. The former API-Key-only parent bound remains historical
evidence in its feature freeze, not the current settings-shell contract.
Source conformance only; owner runtime/visual acceptance remains pending.

> **Status: Canonical composite** — use `app-editor-dialog` for the modal shell,
> `app-editor-tabs` for accessible navigation, the shared declarations and snippet below for
> modal integration, and block 10 for controlled dirty-close behavior

Reference correction (2026-10-07): Fleet/Vehicle and Fleet/VehicleService currently use routed editors. They are not a modal integration reference. For a type01 editor, use the actual shared EditorDialog/EditorTabs declarations and this block's controlled modal composition; Job remains the list-shell reference. Do not copy a routed feature and call it modal conformance. Source-only; owner visual acceptance pending.

Use for Create, Edit, and View editors with real peer sections. A modal having
tabs does not create a new shell shape: it uses the same shared
`app-editor-dialog` as a single-section editor and projects `app-editor-tabs`
plus its feature-owned tab panels into the body.

**Modal or routed page — decision rule (owner decision D4-2, 2026-10-01).** Create, View and Edit
of one record always use the same editor and pass an explicit `create | view | edit` mode:

| The record has… | Editor |
|---|---|
| fields only, or one small child list, and no totals | **modal** — `app-editor-dialog` (this block) |
| two or more child collections, **or** totals, **or** approval/posting | **routed page** — the shared editor shell (block 1) and *Routed full-page editor* below |

Examples: branches, categories, activities, simple settings rows and time logs are modals;
Job, quotations, invoices, bills, purchase orders, GRNs and vouchers are routed pages. A screen
that fits the rule needs no separate approval; a deliberate exception is recorded in its review.
View reuses the same detail contract and editor, makes controls read-only, hides Save and offers
Close (or Edit).

For a model with a frozen approval lifecycle, its **saved** routed editor may
include an Approval tab while the list offers a separate Approval Status action
modal (UI block 7). The tab and modal share the server status/history and
  decision eligibility, including Approve/UnApprove/Reject controls required by the
  model's frozen adoption contract. Reuse the shared document approval panel for
  both surfaces (UI7), including reason forms and the terminal rejected state;
  the modal is not a second Create/Edit editor and does not change the
routed-editor choice above. Do not mount the approval tab for an unsaved draft,
repeat its name as a visible internal heading, or show Settings policy fields
inside the model form. Future configurable steps are owned in Settings per
model; current manual steps are labelled as such.

The shared `DocumentApprovalCycleComponent` owns the approval region's internal
scroll. Its thin feature adapter fills the bounded dialog body or filled
FormSection directly, as in PurchaseOrder. Do not place that adapter inside a
second `.sigma-editor-scroll`: its auto-height child rule conflicts with the
adapter/panel's zero-basis flex chain and can collapse the approval content.
Apply this composition to the saved tab and the row status dialog across the
frozen purchasing rollout (PR/PO/GRN/Bill/PurchaseReturn). Verify actual imports,
saved ID, matching tab/panel IDs, same GET context and refresh events in both
surfaces; an existing tab definition alone does not prove working integration
(owner clarification2026-10-24; source-only runtime acceptance pending).

```text
shared/components/editor-dialog/editor-dialog.component.ts
shared/components/editor-dialog/editor-dialog.component.html
shared/components/editor-dialog/editor-dialog.component.scss
shared/components/editor-tabs/editor-tabs.component.ts
shared/components/editor-tabs/editor-tabs.component.html
shared/components/editor-tabs/editor-tabs.component.scss
```

`app-editor-dialog` owns the body-appended PrimeNG shell, header hierarchy,
close control, responsive width, Create/Edit Save action, View Edit action, and
Cancel/Close action. `app-editor-tabs` owns the tablist markup, translated tab
labels, stable tab IDs, `aria-controls`, roving `tabindex`, active presentation,
LTR/RTL arrow navigation, Home/End navigation, and focus movement. The feature
projects its body and optional `editorDialogHint`, supplies translated labels,
and handles the emitted close, edit, save, Escape and shown events. The feature
remains responsible for mode state, typed active-tab state, matching tab panels,
forms, validation, dirty detection, confirmation and persistence. Keep the
feature's own class prefix for projected panel content; never import another
feature's SCSS or recreate the shared tab-button styles.

**Addressable initial close focus (2026-10-10; UI27).** The optional
`closeButtonId` input gives the shell's header close button a stable element id;
the default empty string emits no id and preserves existing consumers. A modal
that sets `focusOnShow=false` to keep its calendar closed can bind a unique close
id and, after `shown`, reuse shared `focusField(id, { openOverlay:false })` to
move keyboard focus inside the dialog without opening a picker. The consumer
checks its visible session before requesting focus; shell focus trap, Escape,
closeDisabled and dirty-close ownership stay unchanged. No feature DOM query,
private close-button markup or calendar focus handler is needed. Deduction
record and import dialogs are the in-scope consumers; source-only, owner
keyboard/focus-return/runtime acceptance remains pending.

```html
<app-editor-dialog
  [visible]="editorVisible()"
  [title]="pageTitleKey() | translate"
  [subtitle]="'feature.editorSubtitle' | translate"
  icon="bi bi-pencil-square"
  [mode]="editorMode()"
  dialogClass="feature-editor-dialog"
  [closeDisabled]="saving() || closeConfirmationPending()"
  [primaryActionVisible]="!loading() && !loadError()"
  [primaryActionDisabled]="saving()"
  [saving]="saving()"
  [closeLabel]="'general.close' | translate"
  [cancelLabel]="'general.cancel' | translate"
  [editLabel]="'general.edit' | translate"
  [saveLabel]="'general.save' | translate"
  (closeRequested)="requestClose()"
  (editRequested)="enableEditing()"
  (saveRequested)="save()"
  (escapeRequested)="onDialogEscape($event)"
  (shown)="onEditorShown()"
>
  <div class="feature-editor-content">…tabs or form…</div>

  @if (isEditableMode()) {
    <p editorDialogHint>{{ 'feature.requiredFieldsHint' | translate }}</p>
  }
</app-editor-dialog>
```

**Conditional footer projection (Angular 18, 2026-10-22).** Keep a conditional
`editorDialogHint` in a dedicated `@if` whose only root is the matching hint
element, as in the example above. Do not place it beside the form or other
body roots inside one `@if`/`@else`: Angular cannot project that multi-root
block into the selected footer slot (NG8011). Preserve the original visibility
condition and keep body content outside the hint slot; do not suppress the
diagnostic or wrap the whole form in a hint container. Fleet/ServiceLog is the
upgrade repair example; compiler verification and visual acceptance are separate.

### Shared source-document line picker (owner2026-10-24)

For equivalent document-cycle source-line selection, reuse
`shared/components/source-document-picker` (`app-source-document-picker`) with
EditorDialog, DataTable and QuantityInputDirective. No feature copy or new popup
palette. A blank source number opens eligible documents; an optional initial ID
opens that document. Read only its lines on demand, retain chosen lines and
quantities while changing documents, and apply only explicit selection. Cancel
leaves the parent draft intact; changed selection uses shared discard consent.
The adapter owns any dirty-parent replacement consent after Apply and the actual
parent mutation. Do not automatically import a whole order on Load.

Public contract: `documents` is a readonly list of numeric ID/label;
`initialDocumentId` is optional; `selections` holds document + line + quantity;
`loadDocument(id)` returns a finite `Observable<Result<SourcePickerDocumentDetails<T>>>`.
Optional `titleKey`, `lineLabelKey`, `orderedLabelKey`, `receivedLabelKey` and
`quantityLabelKey` keep source-specific wording accurate (requested/already
ordered for PR, ordered/received for GRN); defaults preserve existing consumers.
`layout="table"` is the compact known-source variant: one DataTable with line,
unit, remaining, checkbox selection and inline quantity to include. It omits the
document navigator and duplicate selected cards. Default `layout="split"` retains
multi-document navigation and selection summary. Use the compact variant when
the caller has already chosen one source; PR conversion now adopts it. Keep row
objects/arrays stable while typing quantities; resolve selection quantities by
source ID instead of rebuilding table inputs on each key. Missing stale lines
remain visible as unavailable rows until explicitly deselected or successfully
reloaded. Labels remain unique per picker instance; errors/Retry and server
validation remain the same in both layouts.

When the eligible document list is complete and owned by this picker, optional
`documentNavigation=true` extends compact table mode with an internal two-step
flow (GRN adoption, owner2026-10-24). With no initialDocumentId, show only the
complete document DataTable with per-source selected counts and UI4 FilterPanel
Search/Reset. An initial ID opens its compact line table directly. Local search
changes the displayed candidates only after Search; Reset clears it. Back in the
existing EditorDialog footer returns to the document table without closing,
discarding, emitting Apply or losing quantities. Insert is available from either
step for all retained valid picks. Cancel still compares the original session
baseline. Retained sources missing from a refreshed eligible list stay accessible
for review/removal; they gain no new eligibility or server capacity authority.
Loading/error/Retry/empty states stay within the active step; the picker keeps one
shell and one table scroll region at a time. The compact container uses the same
12px gap as the shared picker. Default documentNavigation=false preserves external
list adapters (PR-to-PO), and default split layout retains its existing behavior.

A compact picker whose caller owns an eligible-source list must retain an
explicit return path: optional `backLabelKey` projects the existing EditorDialog
footer action; `backRequested` returns cloned working selections and requests the caller's list. The picker compares
its own selection fingerprint before leaving, and optional
`backRequiresConfirmation` additionally guards a caller-owned review draft.
One discard decision covers these changes; Back never emits Apply.
For an approved multi-source contract, `retainOnBack=true` returns the working
picks without discard consent because the caller retains them; it does not
stage or save the parent editor. The caller keeps the original session baseline
through `discardBaseline` across table/list remounts, so Cancel still guards the
whole changed selection session. The source list may offer Insert for all retained
valid picks and shows per-document selection counts. Retain failed/unavailable
rows as disabled quantity rows that can still be deselected, including a failed
source read with no current document lines. Keep Cancel
separate: it closes selection-only callers without mutating their parent draft.
Multiple-source combination still requires the document's own frozen contract;
PR-to-PO allows compatible requests for one supplier, PO-to-GRN allows compatible
orders, and direct General/Job PO-to-Bill allows several orders of the same type,
supplier, effective currency and compatible bill branch. Bill uses this same
compact picker with internal document navigation and retained Back. Display all
selected source numbers and keep editable quantities/accounts in the main editor;
saved reload/print derive the complete source set from details. Keep source prices
and eligibility with the backend, preserve entered headers/files and account
choices across retries, and never let the picker save a bill. Receipt-based Bills
retain their existing multiple-receipt quantity selection and detail provenance.
For an editor-owned draft, Apply only stages typed source rows in
that editor; main Save alone persists, preserving entered header/attachments and
using the authoritative source command. A dedicated direct conversion may show
its populated review form before its final command; never persist from the line
picker itself.

Each line supplies numeric ID, display label/description/unit, ordered/received/
remaining/unitPrice and typed opaque `data`. Documents supply ID/label/effective
currencyId/code and lines. `applied` emits cloned selection wrappers; `closed`
requests unmount; `reloadDocuments` retries the eligible list. `documentLoading`
and `documentsError` reflect the adapter list read. `applyPending` freezes the
picker while parent consent runs; `applyError` surfaces parent validation within
its footer. Mount once under the owning editor with a conditional; DestroyRef
cancels unfinished reads and discard work. No per-candidate prefetch.

The picker owns positive whole quantities, remaining-balance and consistent
currency checks, duplicate selection keys, unavailable-line errors and selection
retention; it never clamps an invalid retained quantity after a source reload.
Fresh failed/missing source lines need Retry or removal. The adapter restricts
supplier, type, currency and eligible state; backend remains authoritative for
identity, price, capacity, atomic source locks and lifecycle. This UI does not
authorize another document to combine sources if its own contract forbids that.
Reads are operational and uncached. Do not reuse lookup-cache snapshots for
available quantity. Keep list/details/selections bounded, logical RTL styling,
shared secondary/danger actions, named quantity/search controls and EN/AR states.
Actual visual/keyboard/theme acceptance remains owner-pending after source checks.

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

**Horizontal tabs share one compact row without a scrolling rail
(owner2026-10-31).** Both appearances keep one horizontal row and share the
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

**Vertical section navigation (owner2026-10-31, TripBooking).** The existing
EditorTabs owner exposes `orientation: 'horizontal' | 'vertical'`, default
`horizontal`. Use `orientation="vertical"` for an explicitly requested side
column; do not rotate or copy tab markup in feature CSS. The owner publishes
matching aria-orientation, uses Up/Down independent of RTL in vertical mode,
retains Home/End and roving focus, and keeps RTL-aware Left/Right in horizontal
mode. Disabled behavior and typed activeTabChange/IDs stay unchanged. Vertical
labels wrap, the strip scrolls inside its allocated block size, and workspace
selection uses a logical-start marker; existing theme tokens own the paint.

**Stable vertical navigation viewport (owner bug report2026-10-31).** The
vertical EditorTabs host is a bounded flex column with overflow:clip, and its
tablist fills that allocated block size with min-block-size:0. Only the tablist
scrolls; disable its scroll anchoring and reserve its scrollbar gutter so panel
replacement or selection does not resize or scroll a second hidden host. Keep
the existing keyed buttons mounted when changing the active panel. For vertical
arrow/Home/End navigation, focus with preventScroll and reveal an offscreen tab
only within that tablist, without scrolling clipped ancestors or the page. A
visible tab requires no scroll. This immediate tab-navigation operation belongs
to EditorTabs; form validation continues using focusField and its rendering/
overlay lifetime. Horizontal tabs retain their existing behavior. Source-only
conformance does not establish the runtime cause or visual acceptance of a
reported jump; check pointer, keyboard, narrow/short layouts and theme/RTL.

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

**Internal Settings groups (owner2026-11-02).** When a settings section has
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
Forms/Fields supply the adoption evidence. Source-only checks do not certify
keyboard/short-height/RTL/theme/focus/save acceptance.
Their panel visibility and full-report print contract follow blocks 20 and 21;
the editor `@switch` example above is not suitable when printing requires every
report section to remain rendered.

**Settings tab search (owner 2026-11-03).** Use the shared TabSearch for
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

### Routed document editor baseline

Owner generalization, 2026-10-15: apply the following together to each comparable
document editor in scope. Select the shape first; this checklist does not turn
a simple modal, ordered step workflow, settings page or report into this shape.
The owning blocks below hold the rules/values; this table routes their combined
implementation and final reconciliation. Record Match, Not Applicable with a
reason, or a governing exception for every row before handoff.

| Concern | Required adoption | Owning block |
|---|---|---|
| Section tabs | Shared workspace EditorTabs; Basic Information, Details and separate Documents when those sections exist; one full-height active panel, one persistent parent form | UI13 full-height tabs above |
| Type choices | Keep a small choice group beside the title through FormSection header projection; singular enum uses radios/real IDs; wrap without an extra empty content row | UI13 compact heading choices; UI16 |
| Wide header row | Short inputs together, including Discount when present; Notes on its own full-width row; public grid-column count and shared responsive fallback | UI1 dense document header row |
| Equal card edges | One shared width/inset for sibling title/type/tabs/content/whole-summary/footer frames in every tab; no extra width100% host margins | UI3 |
| Row scrolling | Trace every flex host/wrapper to the shared fillHeight/sticky frame; both axes remain in that frame, with fixed section actions; never page scroll | UI14 bounded row scrolling |
| Type-aware fields | Record feature-specific visibility/requiredness; revalidate retained/new/imported rows immediately and enforce the same rules on server writes | UI16; BE8 |
| Totals and footer | Existing SummaryCards public sizing, fixed footer and a small host gap below totals; no private card CSS or duplicated gap | UI24 |
| Invalid Save | Activate the owning tab before shared field focus; missing required lines opens Details | UI13; UI27 |
| Pending work | Guard tab/type changes during Save/uploads/cleanup/confirmations, retain controls and draft values, preserve dirty-exit and cleanup-only retry owners | UI10/13/18 |
| View and print | Same record editor in all modes; read-only View; print all required saved sections independent of active tab, with released height/scroll bounds | UI13/15/21 |
| Responsive/help | Review actual intermediate/breakpoint/short-height layouts, long EN/AR, RTL/themes; update existing in-app guide and leave runtime acceptance explicit | UI29; Master5/7 |

Purchase Requests is the observed consumer for this consolidation; shared
FormSection/EditorTabs/EditableCollectionTable/SummaryCards/styles remain the
presentation owners. Do not copy its service, DTOs, enum values, required UOM,
calculations, linked locks or deferred approval/PO decisions into other domains.
Shared presentation fixes inherit through their existing owners; screen
adoption happens in scope, with no claim that all legacy screens are migrated.

### Screenshot functional evidence + named modal shell

When the owner supplies screenshots **and** explicitly names an existing Sigma
modal whose style must be reused, split the acceptance criteria instead of
choosing only one reference:

- the screenshots identify functional content: visible fields, labels, logical
  groups, diagrams/images, actions, and the captured state. Classify each item
  under the Master Guide evidence policy; do not infer completeness;
- `app-editor-dialog` controls the shared shell: overlay, width constraints,
  header/title/description, close-button position, approved group presentation,
  field layout, content padding (through `[contentPadded]`, see *Body padding*
  below) and scrolling, footer, Cancel/Save order,
  button/icon treatment, responsive behaviour, accessibility, RTL and dark
  theme;
- inspect the shared editor component and the owner-named feature's projected
  content before editing; never reproduce either from memory;
- apply the same shell to Create, Edit and View. Change only the mode-specific
  title, read-only state and available actions;
- keep the target feature's own class prefix and business logic for projected
  content. Do not import another feature's SCSS or copy its feature-specific
  controls and payloads.

The screenshot evidence establishes the feature data and logical groups;
`app-editor-dialog` determines the shell and `app-editor-tabs` determines the
projected tab navigation. The feature still owns its panel implementation. If
required content does not fit, use the approved responsive and scrolling
pattern. Do not infer modal width or breakpoints from the captured viewport.

The shared shell means: an internal `p-dialog` appended to `body`; a full-width
flex header with icon, title, optional description and close control at the
logical edge; one bounded scrolling body; and a footer with the optional hint
separated from mode-aware actions. Its default width is `1040px`, with `94vw`
and narrow-screen breakpoints. Override the width inputs only when confirmed
content requires it. `app-editor-tabs` and the feature-owned panels remain
projected editor body content.

### Body padding — `[contentPadded]`

**Bounded body chain (source checked 2026-10-01).** The shared PrimeNG content and
`.app-editor-dialog-content` pass a shrinking flex column (`min-height: 0`) to the
projected editor. A long form uses `sigma-editor-form` → `sigma-editor-body` →
`sigma-editor-scroll`; the inner region scrolls while dialog header/footer stay fixed.
Do not restore a viewport-height calculation or scroll owner in feature SCSS.

**Definite height for flex editors.** When projected content uses that zero-basis
flex chain, give `app-editor-dialog` a definite `height` through its shared input,
such as `height="min(720px, calc(100dvh - 24px))"` when a fixed workspace is needed.
A maximum height alone does not supply available height to zero-basis flex
descendants; they can collapse under an auto-height dialog. The shared shell
still owns maximum height, header/footer and content bounds; the inner editor
scrolls. Default dialogs retain auto height when the input is omitted. Do not
patch `.p-dialog-content` or copy viewport-height selectors into a feature.
Recheck this contract when converting a content-sized form to tabs: adding a
zero-basis form/body/scroll chain without setting the shared height can hide the
entire projected body. WorkshopMovement's2026-10-31 first correction used a680px
viewport-bounded height. Creation retains that workspace; after the owner's
size correction, View uses the fully auto-basis content-sized alternative below.
Syntax parsing alone does not verify nonzero geometry or appropriate empty space.

**Content-sized dialog alternative.** For a form that should fit its content
without blank space, omit `height`, keep a shell `maxHeight`, and use existing
`sigma-u-flex-fill` (`flex: 1 1 auto`) on every projected link of that editor chain:
form, body and inner scroll region. This retains intrinsic content sizing while
allowing the inner region to shrink/scroll at the shell limit; keep `min-height: 0`
and overflow ownership from the shared classes. Do not leave a zero-basis child
in the auto-height chain. Company Driver draft uses this alternative with
`maxHeight="90dvh"` after the owner requested removal of unused space.

**Compact action forms (owner screenshot, 2026-11-15).** Choose a single-column
field layout through the shared `--sigma-editor-columns` contract. Keep loading,
error, explanation and multiline field blocks full-span (`sigma-field--full`)
so the shared intermediate two-column breakpoint cannot place them side by
side. A Reason textarea can keep native rows and maxlength, with its description
associated by aria-describedby. Use the existing content-sized form/body/scroll
chain above; when EditorDialog owns padding, existing `sigma-u-p-0` on its body
avoids a second workspace inset. Shared `sigma-u-m-0` keeps an alert inside that
grid aligned with its fields. The current utility owner is
`assets/sass/_sigma-utilities.scss`; do not use the retired unprefixed flex-fill
name. Native shared utilities own those values, not feature CSS. Preserve the
shared shell/footer, access boundary and request behavior. Compilation does not
establish nonzero geometry, scrolling, focus or visual acceptance (UI29).

Item Return's basic/items panels adopt this content-sized alternative in
Create/Edit/View (owner2026-11-01); all three projected links keep the shared
auto-basis utility. Its approval adapter retains a definite bounded shell height
because that independent panel uses a zero-basis scroll chain. The same editor
uses the existing workspace tab appearance, as requested against Link Accounts,
and one compact FormSection card around Items in every mode. Hide the repeated
tab/collection titles through the owners' existing showTitle/headingVisible
inputs; the FormSection keeps its editable mock action while the collection
keeps Add/Remove and validation. No feature tab/card CSS or private toolbar.
Source conformance only; content sizing, tab switching and long-row scrolling
remain owner visual acceptance.

> **Status: Canonical** (2026-09-28)

The dialog header and footer carry the global inset from `src/styles.scss`
(`.app-editor-dialog .p-dialog-header` / `.p-dialog-footer`), but the body is
deliberately unpadded (`contentStyle` sets `padding: 0`) so tabs, toolbars and
full-bleed tables can reach the edges. Without a body inset, fields touch the
dialog edge and do not line up with the title and the footer buttons.

`app-editor-dialog` owns that inset through an opt-in input:

```html
<app-editor-dialog
  [contentPadded]="true"
  …
>
```

- **New and refactored editors set `[contentPadded]="true"`.** The shell then
  applies the body inset that matches the header and footer. Do not add
  `padding` to the feature's own content wrapper, and do not restate the value in
  feature SCSS.
- Leave it `false` only when the body is full-bleed by design (an
  `app-editor-tabs` strip or a table that must reach the edges); the tab panels
  or sections then own their inner spacing.
- Existing editors that pad their own wrapper keep working because the input is
  off by default. Move them to `[contentPadded]="true"` when the screen is next
  touched and remove the feature padding in the same change (backlog 36).

### Nested child draft variant

The CompanyPartner driver component is the reference integration for a nested
child draft with shared dialog, tabs, form sections and collection summary. It
owns draft isolation, validation, dirty-close approval and parent commit; it
does not own any dialog/tab/section shell markup or styling. Define
`driverTabs` and `currentDriverTab` with the typed shared-tab contract above.
The parent collection changes only after child Save succeeds:

```html
<app-editor-dialog
  [visible]="visible"
  [title]="driverTitleKey() | translate"
  [subtitle]="'companyForm.driverDialogDescription' | translate"
  icon="bi bi-person-vcard"
  [mode]="driverDialogMode()"
  width="1280px"
  [breakpoints]="{ '1199px': '94vw', '767px': 'calc(100vw - 16px)' }"
  [closeDisabled]="saving || closeConfirmationPending"
  [saving]="saving"
  [closeLabel]="'general.close' | translate"
  [cancelLabel]="'general.cancel' | translate"
  [saveLabel]="'general.save' | translate"
  (closeRequested)="requestClose()"
  (escapeRequested)="onDialogEscape($event)"
  (saveRequested)="saveDriver()"
>
  @if (driverDraft) {
    <div [formGroup]="driverDraft" class="company-driver-editor">
      <app-editor-tabs
        [tabs]="driverTabs"
        [activeTab]="currentDriverTab()"
        [ariaLabel]="'mangeDetails.driver' | translate"
        idPrefix="company-driver"
        (activeTabChange)="currentDriverTab.set($event)"
      />

      @switch (currentDriverTab()) {
        @case ('detail') {
          <section id="company-driver-panel-detail" role="tabpanel"
                   aria-labelledby="company-driver-tab-detail" tabindex="0">
            … field groups …
          </section>
        }
        @case ('documents') {
          <section id="company-driver-panel-documents" role="tabpanel"
                   aria-labelledby="company-driver-tab-documents" tabindex="0">
            <app-documents [parentForm]="driverDraft" arrayName="documents"></app-documents>
          </section>
        }
      }
    </div>
  }

</app-editor-dialog>
```

Draft in, parent touched only on Save:

```ts
readonly visible = signal(false);
readonly draft = signal<FormGroup<DriverControls> | null>(null);
private editIndex: number | null = null;

openDialog(): void {                     // Add
  this.editIndex = null;
  this.draft.set(this.createDriverForm());
  this.visible.set(true);
}

editDriver(index: number): void {        // Edit: a copy, so Cancel leaves the row untouched
  this.editIndex = index;
  this.draft.set(this.createDriverForm(this.drivers.at(index).getRawValue()));
  this.visible.set(true);
}

saveDriver(): void {
  const draft = this.draft();
  if (!draft) return;
  if (draft.invalid) { draft.markAllAsTouched(); return; }
  if (this.editIndex !== null) this.drivers.setControl(this.editIndex, draft);
  else this.drivers.push(draft);
  this.parentForm.markAsDirty();
  this.close();
}
```

Build the draft from the row's raw value (`createDriverForm(value)`), not with `patchValue`
alone: `patchValue` does not create the rows of a nested `FormArray` (for example a driver's
documents).

Field groups are declarative, so the template loops instead of repeating markup:

```ts
private readonly driverFieldGroupDefinitions = [
  { key: 'identity', titleKey: 'companyForm.driverIdentity',
    descriptionKey: 'companyForm.driverIdentityHint', icon: 'bi bi-person-vcard',
    fieldNames: ['firstName', 'middleName', 'lastName', 'gender', 'nationality', 'birthDate'] },
  { key: 'contact',  … fieldNames: ['email', 'mobileNo', 'phoneHome', 'phoneWork'] },
  { key: 'address',  … fieldNames: ['address', 'city', 'state', 'zipCode', 'country'] },
  { key: 'additional', … fieldNames: ['notes'] },
];
```

**Single-section variant:** use the same `app-editor-dialog`, drop
`app-editor-tabs`, and keep the groups. Use tabs only for real peer groups such
as Detail + Documents.

### Correction-record family composition (source-only, 2026-10-14)

`Data Entry Corrections/shared/CorrectionEditorComponent` composes the existing
EditorDialog, FormSection, EditableCollectionTable, FileField and tracker for the
two correction record APIs; it owns their common description/SLA/attachment draft,
while each API retains its own persistence and the request alone owns Open/Closed.
`CorrectionWorkspaceComponent` and `CorrectionApiService` reuse the same list
lifecycle/transport without a second route or grid implementation. These are
feature-family owners, not replacement visual controls or a universal CRUD engine.

Tracker cleanup emits its accepted value before finalize releases `cleaning`.
An accepted close callback therefore checks the same visible session and independent
load/save/upload gates rather than rejecting its own successfully completed cleanup
because that flag is still set. Failed cleanup retains the editor for cleanup-only
Retry; successful Save must never be repeated. Existing shared controls retain
their appearance and interaction contract; owner runtime acceptance is pending.

**Completed child close events (source-only,2026-10-30).** An embedded editor's
`closed(saved)` output, emitted only after its own exit guard accepts, is a
completion event. The parent verifies the same visible child session and hides/
resets it directly, refreshing once when saved. Do not call the child's or
parent's `canDeactivate` again inside that output: RxJS emits the accepted
decision before `finalize` releases discard/cleanup busy flags, so the second
guard can reject its own completed decision and leave a frozen editor open.
Keep route-departure guards for independent navigation and keep unconfirmed
close intents behind the child's existing guard. Equipment Quotation's embedded
Purchase Order consumers adopt this; the approved Purchase Order owner and its
save/discard behavior remain unchanged. This is source evidence, not runtime
verification.

### Routed full-page detail form with a bounded child collection

> **Status: Canonical composite variant** — for records that the decision rule above sends to a
> routed page

References:

```text
Workshop/Job/components/editor/                 (shared editor shell, EditableRows, field errors)
Rental/RentalQuotation/components/details/      (single child collection with a summary)
shared/components/form-section/
shared/components/editable-collection-table/
```

Use this shape when the editor must occupy the authenticated viewport as a
route-level page. Keep one typed parent form and use the shared section and
editable-table components; the feature owns only the route state, controls,
payload, validation, and business behavior.

When the owner needs Details / Jobs / selected Job details side by side, use
the shared three-pane editor variant from UI1, rather than a capped master
section above a feature-local two-column workspace. Job and JobEstimation
consume that shared form/body/pane layout, one-column master fields and
container-responsive placement. Preserve `formArrayName` through a non-DOM
`ng-container`, so group bindings and the existing typed form remain intact.

The routed shell is the shared editor shell (block 1 *Shared editor page shell*): the host fills
the box the shell sized, with `min-height: 0` and `overflow: hidden`, and no browser/page
scroll. The form body is a flex column: the first section keeps its intrinsic
height, the child-collection section fills the remaining height, and the
Save/Cancel footer is a non-shrinking sibling outside the clipped form body.

Use the section header action projection for Add. Do not render a second Add
toolbar inside the child table when the enclosing section already owns the
visible title:

```html
<app-form-section
  title="feature.items"
  icon="bi bi-list-check"
  density="compact"
  [fill]="true"
>
  <app-primary-action-button
    form-section-actions
    [label]="'general.add' | translate"
    icon="bi bi-plus-lg"
    [disabled]="!isEditable()"
    (pressed)="addItem()"
  />

  <div class="feature-items-table-area sigma-editor-pane">
    <app-editable-collection-table
      title="feature.items"
      [headingVisible]="false"
      [columns]="itemColumns"
      [editable]="isEditable()"
      [fillHeight]="true"
      [stickyHeader]="true"
      tableMinWidth="1200px"
      (removeRequested)="requestRemoveItem($event)"
    >
      <!-- projected typed cells only -->
    </app-editable-collection-table>
  </div>

  <div class="feature-summary" aria-live="polite">
    <!-- totals, discount and grand total; never place this inside the table frame -->
  </div>
</app-form-section>
```

`app-form-section [fill]="true"` makes the section and its content a bounded
flex column. The feature table area gets `min-height: 0`, `flex: 1 1 0`, and
`overflow: hidden`, and uses existing `sigma-editor-pane` so it is itself a flex
column. Apply UI14's complete bounded-row-scrolling chain to every similar
editor; sizing a block wrapper alone does not bound its table child (2026-10-15).
`app-editable-collection-table [fillHeight]="true" [stickyHeader]="true"`
makes its frame the flex child and the single row scroll owner (block 14). No viewport
arithmetic (`calc(100dvh - …)`) sizes the frame. The summary
must be `flex: 0 0 auto`, so it remains visible when the row frame acquires a
vertical scrollbar. Use logical properties and existing light/dark/RTL tokens;
do not add a feature body scroll or a second page-height calculation.

The page action footer is outside the form's overflow region and remains
reachable at all row counts:

```html
</form>
<footer class="feature-page-actions">
  <button type="button" class="sigma-secondary-button" (click)="requestClose()">
    {{ (isView() ? 'general.close' : 'general.cancel') | translate }}
  </button>
  @if (!isView()) {
    <app-primary-action-button
      [label]="'general.save' | translate"
      icon="bi bi-check2-circle"
      (pressed)="save()"
    />
  }
</footer>
```

**Check:** the record meets the routed-page rule (or its exception is recorded) · shared editor
shell classes, no feature page/panel/field/footer SCSS · one parent
`FormGroup` · fixed shell ends above the normal app footer · no page/body scroll
introduced · section Add is projected into the title row · child table owns the
only row scroll · totals/discount/grand total remain outside the table frame and
visible · action footer is outside the clipped form body · `Save` is hidden in
View mode · logical properties, RTL, dark theme and print overrides remain
valid.

### Closing a dirty tabbed modal — canonical

The shared editor shell is controlled, but the feature still owns the decision
to close because only the feature knows whether its form or child drafts are
dirty. A two-way visibility/onHide reset allows PrimeNG to hide the surface
before the feature decides whether changes may be discarded.

For every editable tabbed dialog, use **controlled visibility**: the dialog never closes
itself, every close attempt goes through one method, and reset happens only after
the close is agreed.

```html
<app-editor-dialog
  [visible]="visible()"
  [title]="titleKey() | translate"
  [mode]="mode()"
  [closeDisabled]="closeConfirmationPending() || saving()"
  [saving]="saving()"
  (closeRequested)="requestClose()"
  (escapeRequested)="onDialogEscape($event)"
  (editRequested)="enableEditing()"
  (saveRequested)="save()"
>
  <div class="feature-editor-content">…tabs and field groups…</div>
</app-editor-dialog>
```

The shared shell disables PrimeNG's own exits, so the header X, Cancel/Close and
scoped Escape output all funnel into `requestClose()`. Do not add a `document`
Escape listener: it also sees Escape from a dropdown or the discard confirmation
and can immediately open a second confirmation.

```ts
readonly visible = signal(false);
readonly closeConfirmationPending = signal(false);

onDialogEscape(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
  this.requestClose();
}

requestClose(): void {
  if (this.closeConfirmationPending()) return;

  if (!this.driverDraft?.dirty) {
    this.close();
    return;
  }

  this.closeConfirmationPending.set(true);
  this.confirmationDialog
    .confirm({
      severity: 'warning',
      title:   { key: 'companyForm.discardDriverTitle' },
      message: { key: 'companyForm.discardDriverMessage' },
      icon: 'bi bi-exclamation-triangle',
      confirmLabel: { key: 'companyForm.discard' },
      cancelLabel:  { key: 'general.cancel' },
      confirmIcon: 'bi bi-x-circle',
    })
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.closeConfirmationPending.set(false)),
    )
    .subscribe((confirmed) => {
      if (confirmed) this.close();
    });
}

// Hide first, then reset. Never reset from a visibility hook.
private close(): void {
  this.visible.set(false);
  this.driverDraft = null;
  this.editIndex = null;
}
```

Order matters: hide, then reset. Resetting inside `(onHide)` runs before the user
has answered, which is the defect being replaced. The confirmation dialog is
appended to body, so it correctly stacks above this dialog (block 11).

**Check:** the feature consumes `app-editor-dialog` rather than declaring a
feature-owned `p-dialog` shell · width/breakpoint overrides are passed only
through supported shared-component inputs when the content genuinely needs them ·
child draft mutates its parent only in Save · close intent goes through one
method that applies the discard rule, then `close()` hides and resets · no reset
in `(onHide)` · nested dropdowns and calendars use their approved body-appended
overlay contract · rebuild translated field config on `onLangChange` when the
feature stores translated configuration.

Optional workflow footer actions (2026-10-17; Languages): the existing
`EditorDialogComponent` exposes readonly `EditorDialogFooterAction[]` through
`footerActions`, defaulting to an empty array, and emits the selected stable
action id through `footerActionRequested`. Each action supplies its translated
label, optional icon and disabled state. The shared shell renders them before
Cancel/Close using its existing secondary-button owner and disables them during
Save. The feature owns navigation, validation, dirty-discard and independent
busy guards. Use this extension for Previous or Save-and-Next; do not repurpose
Save-and-Print, duplicate the dialog footer, or add feature footer styling.
An empty array preserves existing consumers. Source conformance does not certify
keyboard, responsive, RTL or theme acceptance; those remain owner verification.
The shared actions group wraps within min-width0, aligns to logical end and
retains its existing8px gap. Previous/Next chevrons mirror through the existing
global body-overlay owner `[dir='rtl'] .app-editor-dialog`, since the dialog is
appended to body and feature-host ancestry cannot own its direction selectors.

The shared `app-editor-dialog` owns `appendTo="body"`, modal/drag/resize behavior,
the header hierarchy and close control, responsive shell sizing, footer action
markup, primary-icon contrast, focus styling, RTL, dark theme and Escape output.
Do not recreate its `pTemplate="header"`, footer buttons, or internal classes in
feature templates/SCSS. A feature owns projected content and may supply only the
documented public inputs, outputs and `dialogClass` hook.

**Shared branch-setting consumer evidence (2026-10-09; Master5 extraction gate):**
`shared/components/branch-tariff-settings/BranchTariffSettingsComponent` owns the
existing tenant-wide branch/percentage settings workflow used by RentalTariff,
LeaseTariff and TariffCard. All three mount the same controlled editor and delegate
its deferred discard decision from their list route guards. It uses the public
720px width, viewport-bounded 560px definite height, padded shared flex body and
the UI14 fill/sticky collection. The Add toolbar is independent of saved row
count; successful empty loading remains editable. Lookup or settings failure
blocks partial replacement and offers inline Retry. Invalid inputs leave Save
available to reveal field/duplicate feedback; pending reads, Save and confirmations
retain their gates. This business owner composes existing EditorDialog,
EditableRows and freezeFormState; do not copy its form/request implementation
into consumers or infer separate rental/lease settings from the entry location.
The source API has no module/card discriminator; that contract stays in the
feature freeze. Source-only evidence, owner runtime/visual acceptance pending.

---


### Composite source segments and modal lifetime (2026-10-25)

When one receipt line offers several selectable segments (unbilled quantity and
individual original bill lines), the adapter identity is the complete source
pair, never the current array index. If SourceDocumentPicker requires numeric
line IDs, retain a component-lifetime map from that composite key to numeric IDs
across source refreshes and reopen. Retained unavailable rows have remaining=0;
do not raise current eligibility to the old selected quantity. Apply only stages
the editor's rows; the backend rechecks capacity at Save and approval.

A projected collection toolbar action must have a rendered shared toolbar:
headingVisible=false plus no Add/validation removes that region. Keep the shared
heading or an owning visible toolbar instead of feature-local positioning. Freeze
parent mutation while its picker/modal is active, keep failures inside the typed
action dialog, and restore the form after harmless Cancel. Same-route ID changes
must reload the new saved record instead of retaining the previous document.
Read/Retry never overwrites a dirty matching draft. Actions remain guarded by
matching loaded ID, actual server eligibility, current busy and read-error state.

Evidence: PurchaseReturn Goods editor, SourceDocumentPicker/EditableCollectionTable
public declarations and the frozen supplier-return contract. Existing shared
inputs/events are reused; no competing picker or dialog shell was added. Source
conformance only; visual/RTL/theme/keyboard/runtime acceptance remains pending.

### Hidden tab panels and first-activation reads (2026-10-25)

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

### Shared document-journal read dialog (2026-10-25)

When a document's Journal action must open a read-only dialog, use the neutral
shared `DocumentJournalComponent` rather than routing the action to View or
copying Bill journal markup. Its public contract is `recordId:number`,
`title:string` (translation key), `subtitle:string` (display text), optional
`typeLabel(value:string|null):string`, required
`loadJournal(id):Observable<Result<VoucherJournalLine[]>>`, and a closed
output. The shared shell is `app-editor-dialog` at the approved 1250px ×
700px size, with no Save action; the table owns Date, Account, Contact, Type,
Voucher No, Description, Debit and Credit, and `SummaryCards` owns the
Debit/Credit totals.

The feature supplies the endpoint, type formatting and eligibility. The shared
component owns only read presentation and lifecycle: one local
`StateMessage` inside the body-appended dialog, no duplicate table progress indicator,
finite direct uncached loading, Result and HTTP error/Retry handling,
loaded-identity/version cancellation fences, reset on `OnChanges`, close
abort plus closed emission, and shared Close focus. It contains no financial
rules, allocation policy or source-document inference. Keep View and Print
owned by their existing feature actions; reading a journal does not mutate or
approve the document.
