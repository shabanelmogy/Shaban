<!-- Part of UI block 4: see ../04-filters.md. Same status and authority as the block. -->

**General narrow-screen collapse (owner instruction, 2026-10-11).** Every
`form[appFilterPanel]` has a shared Filters disclosure below1200px (screen media
max-width1199.98px), with no per-screen opt-in. It starts expanded and toggles
the main fields, any already-open advanced fields, Reset and projected actions
together. It is a native type=button with translated EN/AR label, contextual
Expand/Collapse accessible name, unique aria-controls and aria-expanded. It
uses the existing themed toggle/focus/chevron owner and busy gate.

Collapse only changes screen presentation: all currently mounted controls and
actions remain mounted, values/dirty state and advancedOpen are retained, and
no Search, Reset, form-disable or submit event is triggered. At1200px and above
the disclosure is hidden and normal filter content is visible irrespective of
the narrow-screen collapsed state; narrowing again restores that local state.
The separate More filters action retains its own semantics. Screen-only hiding
also leaves print independent of collapsed state. Keep direct main/advanced
grids and toolbar children so inline/stable/responsive layouts retain their
existing contracts; features add no collapse handlers or CSS. Shared guidance
is authored once in UserGuide/content/shared-screen-guidance.ts and shown in
each module guide's existing overview. Source-only, owner responsive, keyboard,
form-state, RTL/theme and print acceptance pending.

**Action spacing.** FilterPanelComponent owns the action flex-row gap through
its numeric `actionGap` input (pixels, default8), exposed internally as
`--sigma-filter-action-gap`. An explicit owner spacing request may select a
different value on the form; retain the shared default for other consumers.
The gap covers Reset and directly projected actions in both LTR/RTL and wrapped
rows. Keep `ng-container[appFilterActions]` so the buttons participate directly;
do not copy margins or action-toolbar CSS into a feature. Source inspection does
not certify visual spacing; desktop/narrow/RTL acceptance remains owner-pending.

**Field spacing.** `columnGap` optionally controls the horizontal gap shared by
the main and advanced filter grids (default `16px`). Use it for an explicit
screen density request such as a denser checkbox group; keep the shared
responsive stacking unchanged. An explicit vertical density request may select
the numeric `rowGap` input (pixels, default7) for main and advanced field rows;
Rental generation initially selected3, then1 under the owner's further
2026-10-12 spacing correction.
Label/control gap, reserved validation feedback, control height and toolbar
section gaps retain their owning rules. Feature code selects the public input,
not a local filter margin or grid override.

**Choices beside final-row actions (owner Rental correction, 2026-10-12).**
Feature-owned radio/check groups may project through the reusable
`appFilterToolbarStart` attribute (`FilterToolbarStartDirective` exported from
filter-panel.directives.ts). FilterPanel renders them at the toolbar's logical
start, opposite mandatory Reset and the existing `appFilterActions` projection,
instead of spending a separate full-width field row followed by an action row.
The slot is empty by default; existing main/advanced/inline consumers keep their
arrangement. Import/register the actual directive in standalone consumers.

Keep one feature FormGroup and the existing fieldset/legend/options semantics.
When visible option captions already explain the group, the legend may use the
existing Bootstrap `visually-hidden` accessibility utility, retaining its name
without a redundant heading line. Shared toolbar-start uses minimum control
height, actionGap, wrapping and min-width0; existing below720 toolbar stacking,
below1200 collapse, theme/RTL and busy behavior remain. Do not duplicate Reset,
remove validation reserves, shrink34px controls or add feature toolbar CSS to
make a card shorter. Rental generation moves its two merge-mode radios into this
slot and retains all seven filters; source-only, owner visual/keyboard/RTL and
short-height acceptance pending.

**Stable editing layout.** New or subsequently reviewed filter forms must use `[stableLayout]="true"`
on `FilterPanelComponent`. The shared stable modifier top-aligns the main and
advanced grid fields, bounds PrimeNG dropdown/calendar hosts and roots to their
field width and lets dropdown labels shrink within it. Text or selected labels
must not define a field's width. It also reserves an invisible active-count badge
slot when the count is zero, retaining toggle/chevron geometry while editing.
The owner's 2026-10-04 instruction requires controls in the same row to retain
the same vertical alignment, including when feedback appears. Adoption begins
with Item Issue; screens before it were adjusted by the owner and are not
bulk-edited again. The shared default remains compatibility-only for untouched
consumers. Compare the actual label/control start lines for native input,
dropdown and date range, rather than accepting equal control heights alone.
Keep label markup/font/spacing consistent and do not push neighboring fields
down with a validation message. Columns,
breakpoints, gaps, 34px control height, theme and RTL remain shared. Validated
filters reserve their inline feedback through `app-field-error reserveMessage`
(block19), rather than local minimum heights, clipped messages or feature CSS.
Customers, Suppliers and Staff Balance Summary opt in under the owner's
2026-10-03 filter-stability request; source-only, visual acceptance pending.
Item Issue adopts the same shared reference as Workshop Job list: three main
fields, stableLayout=true and date feedback reserved with
`reserveMessage="validationMessages.date"`. Existing earlier screens, widths,
queries, toolbar placement and responsive breakpoints remain unchanged.
