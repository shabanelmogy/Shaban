# Charge Settings — Additional Charges Enablement Contract Freeze

Date: 2026-08-25  
Status: Frozen — implementation complete; owner runtime verification pending  
Scope: Repair the Administration Charge Settings whole-set editor and API
contract so active, non-closing Lease charge/rate pairs can be configured and
consumed by Lease Agreement Additional Charges.

## Authority and shape

- Authority: `SIGMA_FEATURE_REVIEW_MASTER.md`; canonical UI dropdown, typed
  form, editable-collection, validation, error, translation, accessibility,
  RTL/theme, and cancellation blocks; canonical backend Pattern 4 Settings,
  enum validation, mapping, and EF logical-key index blocks.
- Selected backend shape: canonical whole-set Settings aggregate, not record
  CRUD. The logical key is `(ModuleType, ChargeType, RateType)`.
- Selected UI shape: one module selector plus the shared editable-collection
  table. The visible rows are one module projection over a complete in-memory
  settings snapshot.
- Generated packets 00–06 are stale. Canonical sources and current source own
  this implementation; generated files are not edited.
- The Additional Charges screenshot is runtime evidence only. It proves the
  agreement context loaded and `chargeOptions` was empty; it contains no
  instructions.

## Feature Review Manifest

| Item | Frozen decision/evidence |
|---|---|
| Requested outcome | Allow valid Additional Charges rows to be added by repairing their Charge Settings authority. |
| Frontend scope | Administration Settings Charge Settings component/model/service, its three enum contracts, translations, and the Additional Charges empty guidance. |
| Backend scope | Charge Settings request/read DTOs, service/interface/controller contract, mapping, enum validation, deterministic read, and EF logical-key uniqueness. |
| Existing consumer | Lease Agreement Additional Charges consumes active Lease pairs with `OnlyForClosing == false`. |
| Authentication/authorization | Existing authenticated route only; no authorization API is invented. |
| Explicit exclusions | No automatic charge/rate seeding, no weakening of agreement validation, no voucher/invoice/allocation/JV behavior, no migration generation or execution. |

## Confirmed defects and evidence

| Finding | Evidence | Resolution |
|---|---|---|
| Frontend posts `items`; backend expects `chargeSettings`. | Current Angular `save()` and `ChargeSettingsAddVM`. | Freeze request property as `chargeSettings`. |
| Empty-bound request can synchronize an empty set and delete settings. | `SyncByKeyAsync` delete-by-omission semantics. | Typed contract, frontend payload parity, backend null/enum validation before mutation. Empty array remains an explicit delete-all request. |
| UI loads every row under the first row's module. | Current `fillForm()`. | Keep the complete snapshot; filter only the visible module and preserve drafts on module switches. |
| Shared frontend rate enum describes Lease Cost rates, not backend `RateTypeSettings`. | `ChargeRateTypeEnum` versus backend `RateTypeSettings`. | Add a Charge Settings-specific 15-value enum; do not alter Lease Cost Setting. |
| Frontend charge/module enum sets are incomplete. | Current enums versus backend `ChargeTypes` and `ModuleType`. | Align every numeric value and label with backend enum order. |
| Existing rows added before ModuleType migration defaulted to Rental. | Migration default `ModuleType = 0`. | Do not rewrite data automatically; expose all modules so the owner can configure Lease deliberately. |
| PrimeNG rejects readonly dropdown option arrays under strict templates. | `p-dropdown.options` is mutable `any[]`; the component exposed `ReadonlyArray<EnumOption<T>>`. | Keep the option properties non-reassignable while exposing mutable `EnumOption<T>[]` values to the control. |
| `Array.prototype.flatMap` is outside the configured ES2018 library. | `tsconfig.json` uses `lib: ["es2018", "dom"]`. | Build the same whole-set payload with typed nested iteration; do not broaden the global compiler target. |

## Frozen API and settings contract

| Operation | Contract | Behavior |
|---|---|---|
| Read | `GET ChargeSettings` → `Result<List<ChargeSettingVm>>` | Return the deterministic current-tenant, non-deleted settings in `entity`, ordered by ModuleType, ChargeType, RateType. No client IDs are required. |
| Save | `POST ChargeSettings` with `{ chargeSettings: ChargeSettingVm[] }` | Full tenant-set replacement. An omitted logical key is removed. Empty list explicitly removes all settings. |

`ChargeSettingVm` contains client-editable inputs only:

| Field | Type | Validation/behavior |
|---|---|---|
| `moduleType` | enum number | Required and `Enum.IsDefined(ModuleType)`. |
| `chargeType` | enum number | Required and `Enum.IsDefined(ChargeTypes)`. |
| `rateType` | enum number | Required and `Enum.IsDefined(RateTypeSettings)`. |
| `onlyForClosing` | boolean | When true, excluded from Agreement Additional Charges. |
| `mandatory` | boolean | Persisted setting; no new agreement behavior is invented here. |
| `taxable` | boolean | Persisted setting; no tax calculation is added here. |
| `isActive` | boolean | Active Lease rows are eligible for Agreement Additional Charges. |

Duplicate payload keys use the canonical deterministic last-wins policy. The
UI prevents duplicate Charge Type/Rate Type pairs within the selected module.
The backend validates the complete payload before mutating. One tracked context
and one `SaveChangesAsync` provide the atomic boundary.

The EF configuration adds a tenant-scoped filtered unique index on
`(SubscriptionId, ModuleType, ChargeType, RateType)` for non-deleted rows. The
owner must generate and apply the migration; this task does not modify a
migration or model snapshot.

## Frozen UI contract

- Module selector supports every backend `ModuleType` value and defaults to
  Lease when no settings exist.
- Module switching captures the current draft, then restores that module's
  draft without discarding edits in other modules.
- Charge Type supports all backend `ChargeTypes`; Rate Type supports all backend
  `RateTypeSettings`. Options are mapped once and translated in English/Arabic.
- Add Row creates a blank active, non-closing row. Remove requires the shared
  confirmation dialog and mutates only the pending draft.
- Save validates required fields and duplicate pairs, captures the visible
  module, combines every module draft/current server row, and sends the frozen
  full-replacement payload once.
- Both `isSuccess: false` and HTTP errors on read and Save keep the page state and show one safe
  inline error; success relies on the global mutation toast and reloads the
  authoritative set.
- The Lease Agreement Additional Charges empty state points the owner to
  Administration → Settings → Charge Settings instead of implying a modal
  failure.

## Phase handoff

| Phase | Result |
|---|---|
| 0 — discovery/evidence | Complete. Empty runtime state and all producer/consumer mismatches traced. |
| 1 — domain/API | Frozen. Whole-set replacement, DTO fields, enum authority, duplicate policy, and migration impact fixed. |
| 2 — read/grid | Not Applicable; deterministic settings read exists but no paged grid/ListVM. |
| 3 — detail/write | Complete. Typed module-projected settings editor and validated whole-set sync implemented. |
| 4 — domain action | Not Applicable; ordinary Settings Save. |
| 5 — integration/runtime | Complete. Existing Charge Settings route is retained, service contracts are aligned, and Additional Charges guidance identifies the configuration path. |
| 6 — reconciliation | Complete by source inspection. Frontend/backend enum parity, stale type references, localization resource parity/XML, route/service wiring, merge markers, and scoped whitespace diffs were checked. Builds, tests, browser, database, and migration verification remain owner-owned. |

## Final reconciliation

- Frontend and backend enum names and numeric values match exactly: 16 module
  types, 36 charge types, and 15 rate types.
- The obsolete Charge Settings CRUD DTOs have no remaining source references.
- English and Arabic backend resource key sets match, and both resource files
  are valid XML with no duplicate keys.
- The existing Lease Additional Charges query remains authoritative: only
  active, non-closing `ModuleType.Lease` pairs are offered.
- No migration or model snapshot was edited for the new Charge Settings index.
  The owner must generate a migration after reconciling any legacy duplicate
  logical keys.
- Source-only verification found no scoped merge markers, trailing whitespace,
  or `git diff --check` errors. Line-ending normalization warnings remain under
  Git's existing CRLF policy.
- Strict-template dropdown option compatibility and ES2018 payload flattening
  were reconciled locally without changing the frozen request or business rules.
