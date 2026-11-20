## 13. Modal with tabs

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Access changes while a body-appended editor is open](13/01-access-while-open.md)
- [Shared mock-data form assistance](13/02-mock-data.md)
- [Shared source-document line picker](13/03-source-document-picker.md)
- [Shared document-journal read dialog](13/04-document-journal-dialog.md)
- [Shared accessible tabs and hidden tab panels](13/05-accessible-tabs.md)
- [Routed document editor baseline and routed full-page detail form](13/06-routed-editors.md)
- [Closing a dirty tabbed modal](13/07-dirty-close.md)
- [Body padding and nested child draft variant](13/08-body-padding-and-nested-drafts.md)

> **Status: Canonical composite** — use `app-editor-dialog` for the modal shell,
> `app-editor-tabs` for accessible navigation, the shared declarations and snippet below for
> modal integration, and block 10 for controlled dirty-close behavior

Reference correction (2026-10-07): Fleet/Vehicle and Fleet/VehicleService currently use routed editors. They are not a modal integration reference. For a type01 editor, use the actual shared EditorDialog/EditorTabs declarations and this block's controlled modal composition; Job remains the list-shell reference. Do not copy a routed feature and call it modal conformance.

Use for Create, Edit, and View editors with real peer sections. A modal having
tabs does not create a new shell shape: it uses the same shared
`app-editor-dialog` as a single-section editor and projects `app-editor-tabs`
plus its feature-owned tab panels into the body.

**Modal or routed page — decision rule.** Create, View and Edit
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
surfaces; an existing tab definition alone does not prove working integration.

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

### Correction-record family composition
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

**Completed child close events.** An embedded editor's
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

### Composite source segments and modal lifetime
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
