<!-- Part of UI block 13: see ../13-modal-with-tabs.md. Same status and authority as the block. -->

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
