<!-- Part of UI block 16: see ../16-dropdowns-lookups-enums.md. Same status and authority as the block. -->

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
