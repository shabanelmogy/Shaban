<!-- Part of UI block 16: see ../16-dropdowns-lookups-enums.md. Same status and authority as the block. -->

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

**Type-driven choices and required fields.**
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
