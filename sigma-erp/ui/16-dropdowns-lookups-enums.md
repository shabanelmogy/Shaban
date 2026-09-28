## 16. Dropdowns, lookups, enums

> **Status: Canonical**

**Simple server lookup** — use `getSelectList` returning `DropDownSelect` when
the backend exposes the ordinary reusable select contract:

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

Some domains expose one typed options/configuration endpoint because the screen
needs several related option sets or metadata together. That is valid when it is
the confirmed backend contract; keep the response typed and bind each option set
to its real shape. `Accounts/Link Accounts/LinkAccounts` is the approved example:
its `getOptions()` returns a typed `LinkAccountsOptionsVM` while ordinary account,
branch and job-category selects still use their normal select endpoints. Do not
split a confirmed composite options contract merely to force every lookup through
`DropDownSelect`.

**Enum dropdown** — `EnumToArrayPipe` turns an enum into `{ key, value, id }[]`.
Map it once in memory when the component is created; mapping a small enum is
cheaper and safer than persisting it:

```ts
readonly documentTypeOptions = this.enumToArrayPipe.transform(DocumentTypeEnum);
readonly genderOptions = this.enumToArrayPipe.transform(GenderEnum);
```

For an enum dropdown bind `optionLabel="key"` and `optionValue="value"`.

**Legacy — do not copy.** Company caches these arrays under unversioned
`localStorage` keys such as `gender` and `documentType`. They can survive a
deployment after the enum changes, collide with another feature, and add storage
failure modes to a trivial transform. `CacheService.clearLocal()` and
`clearSession()` are worse: they wipe all storage, including the auth token and
`subscriptionId`. Do not use that cache for enum options and never call either
clear-all method.

The shared pipe currently declares `value: string`, but numeric enums such as
`GenderEnum` produce numbers at runtime. Keep the form control and payload
aligned with the real enum value. Correcting the shared generic return type is
part of backlog 22.

**Single dropdown border and appearance ownership.** A closed `.p-dropdown`
wrapper renders exactly one 1px border with `var(--sigma-control-radius)` (`6px` canonical). Its
nested `.p-dropdown-label` and trigger render no independent border, radius,
background, or box shadow, so they cannot cover the wrapper edge or create a
second outline. Use the shared surface/text/border tokens; do not create
feature-specific square, underline-only, pill, or double-border dropdowns.

Reset inherited inner `height`, `min-height`, and `max-height` constraints
because PrimeNG also puts `.p-inputtext` on the dropdown label; an oversized
label must never paint across the wrapper border. Do not target every
`.p-inputtext` under a field; scope input styling to the direct input or
`.p-calendar .p-inputtext`.

Keyboard focus uses the application primary color on the existing wrapper border
plus the common subtle focus ring (`0 0 0 3px` with a low-opacity
`--sigma-primary` mix). This is the same interaction treatment used by the
approved accounting workspaces and Chart of Accounts. Do not invent a different
focus halo per feature. The body-appended `.p-dropdown-panel` is a separate
overlay and may retain its single theme boundary. Give it a unique
`panelStyleClass` and style it in global `src/styles.scss` only when the feature
requires a real overlay variation.

When the dropdown is inside a canonical filter boundary from block 4, its
outer wrapper consumes `--sigma-filter-control-height`; do not replace that
shared 34px height in feature SCSS.

**Check:** lookup failures show a message, not silence · ordinary simple lookups
use `getSelectList`/`DropDownSelect`; confirmed composite/domain option endpoints
remain typed · `optionLabel`/`optionValue` match the source shape ·
`appendTo="body"` on every dropdown ·
`[showClear]` and `[filter]` instead of companion buttons · enum options mapped
once in memory · exactly one wrapper border with borderless label and trigger ·
inner label/trigger dimensions cannot cover the wrapper edge · focus changes
the existing border without an outer halo · filter dropdowns use the shared
34px height · no unversioned enum data stored in browser storage.

---

