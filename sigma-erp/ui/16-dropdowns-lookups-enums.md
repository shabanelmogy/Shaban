## 16. Dropdowns, lookups, enums

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Working-branch defaults](16/01-working-branch-defaults.md)
- [Server lookups, selectable records, typed, saved and translated options](16/02-server-lookups-and-saved-options.md)
- [Enum dropdowns, type-driven choices and legacy enum pipes](16/03-enums-and-typed-choices.md)

> **Status: Canonical**

### PrimeNG21 public controls
Shared adapters must call the public disabled signal on Select/MultiSelect,
InputNumber, DatePicker and Checkbox (`disabled()`). Testing the function itself
is always truthy and wrongly excludes enabled controls. Keep the owning form's
disabled/readonly guard too. MockDataFieldDirective's enabled/disabled discovery
and typed existing-option application are regression contracts; do not fabricate
lookup values or duplicate a CVA.

Use `Select`/`SelectModule` from `primeng/select` and `<p-select>` for single
lookups; the former Dropdown entry point was removed. Preserve typed option
values, filtering, clearing and the owning form validators. Where the old Chips
control represented free text tokens, use AutoComplete with `multiple=true`,
`typeahead=false` and the same separator. Set `unique` explicitly to the
inverse of the old `allowDuplicate` contract: old Chips defaulted to duplicates
allowed, whereas AutoComplete defaults to unique values. PrimeNG21 supports
comma/Enter addition; a static unknown attribute on an older component is
not evidence of working behavior.

Checkbox and radio text uses an external native label associated with the
component's `inputId`. Use the shared `sigma-checkbox-field` wrapper where an
inline label is needed. Repeated controls require a record/field/option-based
unique identifier, never one fixed id for all loop iterations. Preserve the
translated text, existing control value, disabled state and label-click target.

**Lookup identity provenance (Customer Requests review, 2026-10-14).** Trace the
actual select producer before connecting a legacy form: a controller name is
not proof of the returned identity's entity type. `Customer/GetSelect` returns
Individual/Company `Partner` ids with Name/No/CUS00+Id labels, while the old
CustomerRequest FK targeted `Customer:PersonBase`. Reconcile picker values,
typed form/payload, EF principal and server validation as one contract (BE8).
Do not cast or relabel incompatible ids to make the picker appear connected.
A persisted relationship change needs the owner's legacy-data decision and a
reported migration; current Customer Requests owner confirms empty/test data.
This evidence does not authorize bulk changes to other legacy consumers.

**Stable dropdown width.** Every dropdown's closed field
has a layout-defined width independent of its placeholder or selected label.
In forms and filters, fill the allocated responsive grid field (`width: 100%`);
the grid owns available width. In editable tables, declare a fixed `width` on
each dropdown column through `EditableCollectionTableColumn` (block 14), such as
200px for Company Contact Designation and 180px for Card Type. Choose the width for the
field's content; 180px is not a universal size. The shared table owns fixed
layout and long-label clipping, with horizontal scrolling inside its frame.
Keep the option panel appended to body. Do not size a closed dropdown from its
selected text or add feature-specific width selectors. Apply this rule in new
work and when reviewing existing screens; this decision is not a bulk rewrite.

The shared three-pane editor applies `min-width:0`, `width:100%` and
`max-width:100%` to `sigma-field` dropdown hosts/wrappers. Its closed label
shrinks and uses ellipsis, while the trigger keeps its width and the option
panel remains appended to body. This fixes long Work Order labels in Create
Job without resizing the Details column or feature CSS (2026-10-04,
source-only; owner narrow/RTL/visual acceptance pending).

**Single dropdown border and appearance ownership.** A closed `.p-select`
wrapper renders exactly one 1px border with `var(--sigma-control-radius)` (`6px` canonical). Its
nested `.p-select-label` and trigger render no independent border, radius,
background, or box shadow, so they cannot cover the wrapper edge or create a
second outline. Use the shared surface/text/border tokens; do not create
feature-specific square, underline-only, pill, or double-border dropdowns.

Reset inherited inner `height`, `min-height`, and `max-height` constraints
because PrimeNG also puts `.p-inputtext` on the dropdown label; an oversized
label must never paint across the wrapper border. Do not target every
`.p-inputtext` under a field; scope input styling to the direct input or
`.p-datepicker .p-inputtext`.

Keyboard focus uses the application primary color on the existing wrapper border
plus the common subtle focus ring (`0 0 0 3px` with a low-opacity
`--sigma-primary` mix). This is the same interaction treatment used by the
approved accounting workspaces and Chart of Accounts. Do not invent a different
focus halo per feature. The body-appended `.p-select-overlay` is a separate
overlay and may retain its single theme boundary. Give it a unique
`panelStyleClass` and style it in global `src/styles.scss` only when the feature
requires a real overlay variation.

When the dropdown is inside a canonical filter boundary from block 4, its
outer wrapper consumes `--sigma-filter-control-height`; do not replace that
shared 34px height in feature SCSS.

**Empty value is `null`.** PrimeNG 17 shows the `[showClear]` icon whenever the
model is not `null` and an option matches it, so a dropdown control is typed
`FormControl<T | null>` and starts at `null`, never `''`. A text-valued option
list (`optionValue="value"`) must also drop blank values, otherwise `''` matches
a blank option and the clear icon appears on an empty-looking field.


**Check:** lookup failures show a message, not silence · ordinary simple lookups
use `getSelectList`/`DropDownSelect`; confirmed composite/domain option endpoints
remain typed · `optionLabel`/`optionValue` match the source shape ·
`appendTo="body"` on every dropdown ·
`[showClear]` and `[filter]` instead of companion buttons · dropdown controls
start at `null`, never `''`, and text-valued options drop blanks · enum options from
`enumOptions` once in memory · exactly one wrapper border with borderless label and trigger ·
inner label/trigger dimensions cannot cover the wrapper edge · focus changes
the existing border without an outer halo · filter dropdowns use the shared
34px height · no unversioned enum data stored in browser storage · no `EnumToArrayPipe`, hand list or index ids for a new or reviewed screen.

---
