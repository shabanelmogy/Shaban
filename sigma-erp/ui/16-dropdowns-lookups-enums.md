## 16. Dropdowns, lookups, enums

> **Status: Canonical**

### PrimeNG21 public controls (2026-10-22)

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

### Working-branch defaults (owner decision, 2026-10-18)

The topbar branch is a default for screens with a real branch selector, not an
authorization scope. Use the root `CurrentBranchService.defaultBranchId()` for
initial typed branch filters and `applyDefault(control)` for eligible empty,
enabled, pristine Create controls. The caller owns mode and value type. Preserve
route-restored/manual selections, deliberate clears, the branch of a saved
record and a parent-derived branch. Convert string/array contracts explicitly;
never place an id in a branch-name text filter or invent a filter an API lacks.
Transfer source and destination remain different roles. Do not use a subscription
that refills a cleared control or silently rewrites an already open screen.

For an actual branch dropdown, trace its option value and backend predicate
together. When the existing API/entity supports `BranchId`, use its numeric
equality filter; a branch-name `Contains` predicate can match more than the
selected branch. Correct a legacy mislabeled name-valued selector through its
form key, template, lookup value and initial query together, without adding an
API field. Eight voucher lists supply this source-backed correction. Numeric
URL hydration uses `filterBranchId(ParamMap)` to distinguish an explicit value,
a restored clear (saved pageNo), and a fresh screen's default. Existing special
full-state markers remain screen-owned.

The authenticated shell resolves active tenant choices and the saved preference
before mounting initial screen content (UI1). Preference, matching valid login
branch, then no branch is the fallback order; never choose the first option
arbitrarily. The selection remains user-changeable. No interceptor adds a hidden
branch filter and no save payload has its branch forced. Allowed-branch and
operation permissions remain deferred to the comprehensive authorization owner
(UI26). Evidence/consumer inventory: current-branch-defaults plan/review under
Sigma reviews; source-only, owner runtime acceptance pending.

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

**Stable dropdown width (owner rule, 2026-10-01).** Every dropdown's closed field
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

**Simple server lookup** — use `getSelectList` returning `DropDownSelect` when
the backend exposes the ordinary reusable select contract:

For an inline lookup warning/retry, use the inherited optional
`getSelectList<Results<DropDownSelect>>({ skipErrorInterceptor: true })` rather than
copying the GET into a feature service. The feature handles both failure channels,
uses local loading, and keeps the warning visible (block 22); default consumers
continue using the global error interceptor.

Classify required read lookups separately from edit-only lookups. Keep Search
available when an edit-only lookup fails or is loading. Give the edit lookup
its own retry/error state and gate the controls and submissions that depend on
it. Use the read DTO's saved labels in read-only mode (UI26).

Distinguish a required edit source from a lookup needed only when assigning or
changing an optional value. Give the conditional source its own loading, error
and retry state. A failure must leave successful required options usable.
Keep a saved label from the detail DTO when the contract permits retaining the
value. Allow Save with a permitted empty or unchanged value. If a draft
contains a change that needs the source, preserve the entered value and block
that submission until the requirement is met or the user explicitly reverts
the change. Apply the same rule when permission is withdrawn.

```ts
export interface DropDownSelect {
  id: number | string;
  value: string;
  no?: string;
}
```

```ts
private loadBranches(): void {
  this.branchService
    .getSelectList<Results<DropDownSelect>>()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        if (response.isSuccess) this.branchOptions.set(response.entities ?? []);
      },
      error: () => this.showError('companyPartners.lookupLoadError'),
    });
}
```

Bind `optionLabel="value"` and `optionValue="id"` — that matches
`DropDownSelect`, so do not invent other field names.

Accounts report dropdowns cache their translated option arrays by source-array
identity and current language, avoiding rebuilding a large lookup on every
change-detection pass. A replaced lookup array or language change supplies fresh
labels. Large report selectors may opt into descriptor `virtualScroll: true`;
the shared template uses PrimeNG's public virtualScroll/virtualScrollItemSize
inputs and a body-appended `sigma-report-select-panel--virtual` overlay. Its
shared 38px border-box rows match the 38px scroller size, with zero block padding;
full options, filtering, selection and clear behavior remain. Other selectors
retain nonvirtual rendering. Budget Variance Account adopts it after the owner's
opening/responsiveness report; runtime root cause and visual acceptance remain
pending. Do not add feature panel CSS or truncate the source options.

The same shared 38px virtual-row geometry is available to ordinary large
single-line reference selectors through `sigma-select-panel--virtual` on their
body-appended panel (2026-11-01). Pair the class with the public
`virtualScroll=true` and `virtualScrollItemSize=38` inputs; the report alias
remains compatible. Item Return's Job and Item editors adopt it for the owner's
dropdown-opening delay, preserving the complete option arrays, existing filter,
clear, values, disabled state and server eligibility. This bounds rendered option
rows, not response size or server query work. Do not apply fixed row geometry to
grouped/multiline custom templates without verifying their actual heights.
Source conformance does not establish measured opening latency, keyboard,
RTL/theme or scrolling acceptance; verify first/last choices and filtering with
representative large data. Other selectors retain their existing contracts.

**Selectable records and historical labels.** Source ordinary entity choices
from the owning select endpoint (or the confirmed typed domain lookup below),
not from the navigation graphs of documents that reference them. A live
document may still reference a soft-deleted entity for
historical display. When that entity is no longer selectable, keep its name in
the Detail DTO and render it as read text in View; do not put it back into the
current choices. A missing historical relation has no invented label. The
write validator remains authoritative; keeping the old label visible does not
authorize saving a deleted reference. Closed Lease Agreements' Clause Type
picker uses `ClauseType/GetSelect`, while View reads `clauseTypeName` from the
agreement detail (2026-10-03, source-only).

**Typed option arrays (2026-10-03).** PrimeNG's `p-select.options` input in the current
application expects a mutable array. A feature getter returning a freshly filtered list
declares `T[]`, not `readonly T[]`; preserve readonly source collections by making a mutable
copy before binding when necessary. Do not hide an input mismatch with an untyped cast.
The owner-reported Logs Movement TS4104 was corrected by returning `CheckCardDocument[]`.

**Saved select options (2026-10-02).** Use the pure shared
`mergeSelectOptions(incoming, saved)` from `shared/utils/select-options.ts`
when a loaded record has selected IDs/names that a lookup does not return.
Fetched options keep their order and labels; append saved detail-derived pairs
whose IDs are absent, comparing number/string IDs through `String(id)`. Never
invent a label or change the form's stored ID. Company editor and nested Driver
country/nationality controls adopt it; other feature copies move during their
own review (backlog 39). Presentation fallback does not bypass backend reference
validation. Inline lookup failures keep their error and explicit Retry, with
the existing `skipErrorInterceptor` option, so one error owner remains.

Some domains expose one typed options/configuration endpoint because the screen
needs several related option sets or metadata together. That is valid when it is
the confirmed backend contract; keep the response typed and bind each option set
to its real shape. `Accounts/Link Accounts/LinkAccounts` is the approved example:
its `getOptions()` returns a typed `LinkAccountsOptionsVM` while ordinary account,
branch and job-category selects still use their normal select endpoints. Do not
split a confirmed composite options contract merely to force every lookup through
`DropDownSelect`.

**Translated options (2026-10-01).** Bind `[options]="genderOptions | translateOptions"` with
`optionLabel="label"` (`shared/pipes/translate-options.pipe.ts`): the pipe adds the translated label,
caches it per language, and the dropdown filter searches the translated text. No
`pTemplate="item"`/`"selectedItem"` pair just to translate a key.

**Enum dropdown** — `enumOptions(Enum, keyPrefix)` from `shared/utils/enum-options.ts`
(2026-10-01) builds `{ id, key }[]` once, when the component is created. `id` is the enum's own
value and `key` a translation key (`<prefix>.<Member>`), so a new or reordered member can never
shift the ids sent to the backend:

```ts
readonly labourTypeOptions = enumOptions(JobLabourType, 'job.labourTypes');
```

```html
<p-select formControlName="labourType" [options]="labourTypeOptions"
            optionLabel="key" optionValue="id" appendTo="body">
  <ng-template pTemplate="item" let-option>{{ option.key | translate }}</ng-template>
  <ng-template pTemplate="selectedItem" let-option>{{ option.key | translate }}</ng-template>
</p-select>
```

For read-only display use `enumKey(Enum, keyPrefix, value) | translate`.

**Type-driven choices and required fields (owner generalization, 2026-10-15).**
When a small singular enum controls the form shape, show its actual values as
one reactive radio group with associated translated labels; use `enumOptions`
and the installed PrimeNG control, not one boolean per choice or reindexed IDs.
Use UI13's compact heading slot when the group fits beside its section title.
If the contract allows multiple independent choices, keep its checkbox
semantics instead; visual marks do not change the field's cardinality.

Freeze a per-type field matrix from the owning feature contract: displayed,
required, optional, hidden and retained values. Revalidate all existing rows
immediately after the type changes; new/hydrated/imported rows use the same
conditional rules. Required markers, field errors, CSV validation where present
and inactive-tab invalid-field navigation must agree. Do not clear hidden draft
values merely because their controls disappear, and still validate every
supplied reference. Coordinate server enforcement with BE8; visibility alone
does not enforce a required field. Purchase Requests demonstrates this wiring,
but its General/Stock/Asset requirements are not requirements for other domains.

**Journal voucher source text (Bank Reconciliation review, 2026-10-05).**
For the backend's string `VoucherTypeName.ToString()` contract, reuse
`voucherTypeText(value, translate)` from `shared/utils/voucher-type-text.ts`.
Its explicit mapping uses neutral `voucherTypeNames.*` EN/AR keys for the current
journal source names; an unknown name retains its source text and null remains
empty. Grid and `dataTableExportRows` call the same transformation with the
current translator, so switching language changes display and export together.
This is presentation only: no ID renumbering, new enum contract, query or payload
change. Bank Reconciliation adopts it; the existing Customer Statement local
mapping remains counted in backlog39 for its own review.

**Legacy — do not copy.** `EnumToArrayPipe` (67 files at 2026-10-01) declares `value: string`
although numeric enums produce numbers, and its optional `startId` numbers options by index.
Company also caches enum arrays under unversioned `localStorage` keys (`gender`,
`documentType`), which survive deployments and collide across features;
`CacheService.clearLocal()`/`clearSession()` wipe all storage, including the auth token. Replace
the pipe with `enumOptions` when a screen is reviewed, never cache enum options, and never call
either clear-all method.

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
