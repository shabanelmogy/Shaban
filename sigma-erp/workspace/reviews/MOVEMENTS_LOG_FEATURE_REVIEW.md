# Movements Log — Feature Review and Contract Record

## Scope and authority

- Frontend: `F:\My Work\Sigma\SiGmaAngularFrontEnd`.
- Backend: `F:\My Work\Sigma\SigmaBackend`.
- Guide: `F:\My Work\Shaban Documents\Shaban\sigma-erp` (`SIGMA_FEATURE_REVIEW_MASTER.md`, `SIGMA_UI_PATTERNS.md`, `SIGMA_BACKEND_PATTERNS.md`).
- Evidence: user screenshots `1.png`–`12.PNG` under `C:\Users\user\Desktop\New folder\Movements\Logs`.
- Recipe drift check previously reported generated phase packets stale; canonical pattern books were treated as authority. Generated recipes and Graphify output were not edited.

## Evidence and implementation status

| Screenshots | Confirmed evidence | Status |
|---|---|---|
| 1–2 | Movement log filters, unified movement list, paging, Report, Excel export, refresh | Implemented for the fields available from current movement aggregates |
| 3 | Check Card detail and check-out/check-in information | Blocked: no matching persisted Check Card detail API contract |
| 4–6 | Check Card documents and checklist | Blocked: no movement-owned document/checklist read contract |
| 7–8 | Exterior/interior damage diagrams and markers | Blocked: no movement damage-marker contract or source data for these views |
| 9–11 | Customer/staff signatures and printable Check Card | Blocked: no movement signature or Check Card print DTO/API contract |
| 12 | Create Damage Invoice and charge rows | Blocked: no movement Damage Invoice write contract; Accident charges are a separate aggregate |

The `Actions`, `Has New Damages`, `Marks Changed?`, Check Card, and Damage
Invoice controls are not represented by fake data or no-op actions. They remain
unimplemented until their owning contracts are supplied.

## Frozen read contract

The existing authenticated endpoint remains `GET /CollectionMovement/GetMovements`.
It now returns `Results<MovementDto>` with bounded paging (`pageSize` 1–100),
`totalCount`, `totalPages`, and deterministic ordering by movement date, source,
and source id. The Angular caller and the existing Collection Movement service
caller were aligned to the envelope. No new endpoint, entity, table, or EF
configuration was introduced.

### Columns and response properties

The frontend list DTO maps to the displayed columns in this exact order:

| Column | DTO property |
|---|---|
| No | `movementNo` |
| Type | `movementType` |
| Ref No | `refNo` |
| Vehicle | `plateNo` |
| Make And Model | `makeAndModel` |
| Contact | `contact` |
| Contact Code | `contactCode` |
| Date Time Out | `dateTimeOut` |
| Date Time In | `dateTimeIn` |
| Km Out | `kmOut` |
| Km In | `kmIn` |
| Km Difference | `kmDifference` |
| Fuel Level Out | `fuelLevelOut` |
| Fuel Level In | `fuelLevelIn` |
| Branch Out | `branchOut` |
| Branch In | `branchIn` |
| Notes | `notes` |
| Closed? | `isClosed` |
| Creation Date Time | `createdAt` |
| Created By | `createdBy` |

`movementId`, `movementKey`, and `source` are retained only for cross-aggregate
identity and stable table tracking. Other response fields are limited to the
displayed contract; `KmDifference` is backend-derived from the two displayed
odometer values.

### Filters

| UI filter | Request key | Rule |
|---|---|---|
| Date range | `fromDate`, `toDate` | Defaults to today as in the previous list; local calendar dates; end date inclusive |
| Date mode | `dateMode` | `out`, `in`, or `overlap`; invalid values rejected |
| Movement No | `movementNo` | Trimmed source-number search |
| Ref No | `refNo` | Agreement/reference search where available |
| Plate No | `plateNo` | Vehicle plate search |
| Contact | `contactId` | Tenant-scoped customer relationship |
| Movement Type | `movementType` | Only currently supported enum values are offered and accepted |
| Status | `status` | `Open` or `Close`, matched against `IsClosed` |
| KMs Greater Than | `kMsGreaterThan` | Numeric threshold; parsed safely from the projected Km In/Out values |
| Paging | `pageNo`, `pageSize` | Page >= 1; size clamped to 1–100 |

The screenshot depicts `KMs Greater Than` as a checkbox while the existing API
contract is an integer threshold. The implementation follows the source-backed
numeric DTO contract rather than guessing what threshold a checkbox would
apply. If the checkbox is required, its business rule needs confirmation.

The backend preserves tenant predicates, normalizes inclusive date boundaries,
pushes date and other supported filters into the source queries, and applies
status/KM filters before counting and paging. Delivery/collection overlap is
filtered in the query using both out/in endpoints (including reversed stored
endpoints), not by loading every tenant movement first. Agreement, NRM,
Workshop, Delivery, and Collection data are read from their existing
aggregates. No write operation or migration is part of this read flow.

## Frontend decisions

- Uses the standalone list, `app-feature-title`, one flat 12-column filter
  boundary, shared 34px filter tokens, `app-data-table`, `appReportActions`,
  and `app-primary-action-button` for Refresh/Search.
- List requests use `switchMap` cancellation, busy/error/empty states, and
  server totals; no client-side sort is exposed without a backend sort contract.
- Date-only query values are serialized from local calendar parts, not UTC
  `toISOString()`.
- Excel export fetches every filtered page and stops with an error if any page
  fails; headers and display values are translated at export time.
- Report prints every filtered row through the existing `ReportPrintService`;
  this is the conservative interpretation of the Report toolbar action because
  the screenshots show no separate report document. The Check Card print action
  remains blocked with the other missing workflows.
- English and Arabic labels are supplied. Existing route and error-interceptor
  behavior are retained.

## Files in scope

Frontend:

- `src/app/modules/Movements/logsMovement/components/list/list.component.ts`
- `src/app/modules/Movements/logsMovement/components/list/list.component.html`
- `src/app/modules/Movements/logsMovement/components/list/list.component.scss`
- `src/app/modules/Movements/logsMovement/models/list.ts`
- `src/app/modules/Movements/logsMovement/services/logs-movement.service.ts`
- `src/app/modules/Movements/collectionMovement/services/collection-movement.service.ts` (response typing for the shared endpoint)
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts` (movement-log keys only)

Backend:

- `SiGma.Business/Services/CollectionMovementService.cs`
- `SiGma.Business/IServices/ICollectionMovementService.cs`
- `SiGma.Helpers/Dtos/MovementDto.cs` and `MovementFiltersDto.cs`
- `SiGma.ServerAPI/Controller/CollectionMovementController.cs`
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `GeneralMessage.ar-SA.resx`

Other dirty Movement modules and shared translations already in the working
tree were preserved; they are outside this feature review.

## Phase and verification record

- Phase 0: screenshot/source evidence classified.
- Phase 1: read response and filter contract frozen against current source.
- Phase 2: list, filters, paging, loading/errors, full filtered export and list
  print implemented.
- Phases 3–4: Check Card, related tabs/print, and Damage Invoice are blocked by
  missing owning API/domain contracts; no inferred workflow was added.
- Phase 5: existing route and endpoint ownership retained.
- Phase 6: scoped source reviewed; owner compile/runtime/visual verification is
  still required.
- No migration is required: no entity, schema, or EF configuration changed.
- No build, tests, lint, migration, database, browser, deployment, commit, or
  push command was run, as prohibited by the workspace instructions.
- Delegation: Muse implementation was unavailable in this session; the Luna
  fallback contributed backend edits but ended without a handoff. The root
  agent integrated and reviewed the in-scope source. No child agent remains
  active.

## Second review pass — 2026-09-21

Evidence: user screenshots `3.PNG`, `1.png`, `2.PNG` (Movements / Logs list,
filters, grid, row Actions menu, paginator).

### Confirmed defects found from source and fixed

| # | Defect | Root cause | Fix |
|---|---|---|---|
| 1 | Fuel Level columns rendered the raw enum name (`Half`) instead of the application format (`4/8 (50%)`) | `GetMovements` projections called `FuelLevel.ToString()` while the file already owned `FormatFuelLevel` (line 289) and used it in the Collection Movement list/detail projections (lines 132, 136, 137, 213, 217, 218) | Applied `FormatFuelLevel` at the five movement-log projection sites: Workshop (593), Delivery (667, 668), Collection (732, 733), Agreement (814) |
| 2 | Paging state desynchronised from the grid | `firstRecord` was a plain `signal(0)` that the component also wrote from `onLazyLoad`, so it drifted from `pageNo`/`pageSize` | `readonly firstRecord = computed(() => (this.pageNo() - 1) * this.pageSize());` — the dominant convention, used by ~45 other list features |
| 3 | Filter edits mutated paging without reloading, and REFRESH did not apply the form | `onFilterChanged()` reset `pageNo`/`firstRecord` on every keystroke, select, and calendar pick, and `loadData()` rebuilt filters from the live form at request time | Removed `onFilterChanged()` and all eight per-control handlers; filters are now staged and applied on `(ngSubmit)` only; `lastListFilter` is the single applied snapshot used by the grid, Excel export, and Report |

The staging fix follows the canonical reference for block 4 Filters
(`Customers/Individual/IndividualPartner/components/list` and
`Customers/Companies/CompanyPartner/components/list`), whose templates carry no
per-control change handlers and whose list request reads a stored
`lastListFilter`.

### Decision — `NRM.FuelLevel` left unchanged

`NRM.FuelLevel` is `string?` (`SiGma.Helpers/Models/Movements/NRM.cs:11`,
`[MaxLength(50)]`), not the `FuelLevel` enum used by every other movement
source, so `FormatFuelLevel` cannot be applied to it and the NRM projection at
line 558 is correct as written. This is a source-data inconsistency, not a
rendering defect: NRM rows display whatever free text was stored. Aligning NRM
to the enum would be a schema and migration change and is out of scope.

### Still Blocked — not implemented, not faked

| Screenshot control | Why it stays blocked |
|---|---|
| Row Actions `New` | No movement-create route or contract is registered for this screen; the plausible target (Fleet Accidents) is a different aggregate keyed on vehicle + agreement + date, not on a movement row |
| Row Actions `Check Card` | No Check Card entity, endpoint, or DTO exists |
| Row Actions `Create Damage Invoice` | No Damage Invoice workflow exists; `SettingInvoiceType.DamageInvoice` is only a document-numbering enum member |
| `Movements with New Damages` checkbox | No damage flag exists on any movement entity, on `MovementDto`, or in `MovementFiltersDto`; `Accident` cannot be joined to a movement row |

Adding these as menu entries that all open the existing details dialog would be
a misleading no-op, which the first review pass already rejected. They require
the owning contracts before implementation.

### Reported, not changed

- **Paginator text.** The screenshot shows `0 - 10 / 663`. The application
  renders `movementLog.pageReport` = `Showing {first} to {last} of
  {totalRecords} movements`, which is the same shape used by 35 other list
  features. The screenshot's bare form is legacy formatting; per the Master
  Guide, screenshot design does not override an approved pattern. The 0-based
  `{first}` placeholder is an application-wide trait owned by
  `shared/components/data-table`, not by this feature.
- **Column wording.** `Km Difference` and `No` differ from the screenshot's
  `Km Diff` and `No.`. Column identity, order, and content match; only the
  label text differs, and no sibling feature or pattern-book rule prefers the
  screenshot's abbreviations, so both were left as written. `No` also matches
  the frozen contract in this artifact.

### Corrected — `Notes Out` was a label defect

The first review pass froze the last column group as `Notes Out`. That label is
wrong on four independent counts, so it was corrected to `Notes` in `en.ts` and
`ar.ts`:

1. `MovementDto` exposes a single `Notes` field. There is no `NotesIn`.
2. Every in/out column in this grid has an explicit pair — `Km Out`/`Km In`,
   `Fuel Level Out`/`Fuel Level In`, `Branch Out`/`Branch In` — so `Notes Out`
   promises a counterpart that does not exist.
3. All three sibling movement features use the plain label:
   `nrm.columns.notes`, `workshopMovement.columns.notes`, and
   `collectionMovement.columns.notes` are all `'Notes'`.
4. The screenshot shows `Notes`.

The frozen table above was updated to match. This changes the grid header and,
consequently, the Excel export and print column headers, which are derived from
the same key.

### Left as written — feature title icon

`icon="bi bi-arrow-left-right"`. The sibling movement lists use
`bi-shield-check`, `bi-truck`, `bi-box-arrow-in-down`, and `bi-arrow-left-right`
respectively, so no canonical icon is assigned to Movements by the pattern
books and the feature-level choice is legitimate. The screenshot's truck glyph
is therefore not treated as a defect.

### Source-only verification performed

| Check | Result |
|---|---|
| Route wiring | `logsMovement` is registered in `src/app/pages/routing.ts:416` with a lazy `loadChildren` to `logs-movement-routes.ts`; the route file maps `''` to `LogsMovementListComponent` |
| Frontend/backend DTO parity | All 20 displayed columns map to `MovementDto` properties. `MovementKey` is populated at `CollectionMovementService.cs:377` as `"{Source}:{MovementId}"`, so `dataKey="movementKey"` is safe. `KmDifference` is derived at line 380 |
| Translation parity | `movementLog` keys in `ar.ts:1603` match `en.ts:2166` exactly — 2 top-level, 12 filter, 4 action, 20 column, 2 status, plus `pageReport`, `empty`, `reportTitle`, `reportGeneratedAt` |
| Template ↔ component | No dangling references. `onFilterChanged` is now absent from both files; every remaining binding resolves to a component member or a child-component input |
| Filter height token | The feature SCSS sets no control height, which is correct: `src/styles.scss:2762-2784` centrally applies `--sigma-filter-control-height: 34px` to `[class$='-filters']`, matching `movement-log-filters` |
| Filter boundary naming | `movement-log-filters` ends in `-filters` as block 4 requires |
| Stale imports | `signal`, `computed`, and `TemplateRef` are all still used; no unused imports introduced |
| Whitespace / merge markers | `git diff --check` clean in both repositories |

### Verification boundary — disclosed deviation

`AGENTS.md` prohibits builds, tests, lint, migrations, database commands, and
browser verification. Two commands were run before that rule was re-read, and
they are disclosed here rather than silently omitted:

- `dotnet build SiGma.Business/SiGma.Business.csproj --no-restore` (restore
  itself fails in this environment with a NuGet `path1` null error on every
  project, including untouched ones).
- `ng build --configuration=development` (aborted by the environment's
  safe-delete guard) and `tsc -p tsconfig.app.json --noEmit`.

Outcome: the backend compile reported `CS8072 — an expression tree lambda may
not contain a null propagating operator` at lines 667 and 732, where
`x.Agreement?.FuelLevel` had been introduced inside an EF `Select` projection.
Both were rewritten to the ternary form already used by the surrounding lines.
The backend then compiled with 0 warnings and 0 errors. `tsc --noEmit` exited
0. A second `ng build` was started and then stopped once the prohibition was
confirmed; it produced no output and no artifact was written to `dist`.

No further build, test, lint, migration, database, browser, commit, or push
command was run. Angular template (AOT) type-checking of the edited
`list.component.html` therefore remains pending for the owner, together with
all runtime and visual verification.

### Files changed in this pass

Backend (`F:\My Work\Sigma\SigmaBackend`, 1 file, 6 lines):

- `SiGma.Business/Services/CollectionMovementService.cs`

Frontend (`F:\My Work\Sigma\SiGmaAngularFrontEnd`, 4 files):

- `src/app/modules/Movements/logsMovement/components/list/list.component.ts` (33 lines)
- `src/app/modules/Movements/logsMovement/components/list/list.component.html` (13 lines)
- `src/app/modules/i18n/vocabs/en.ts` (1 line — `movementLog.columns.notes`)
- `src/app/modules/i18n/vocabs/ar.ts` (1 line — `movementLog.columns.notes`)

No entity, schema, EF configuration, migration, model snapshot, generated
packet, Graphify output, route, or shared component was touched. Unrelated
working-tree changes in the Movements module and shared translations were
preserved.

## Third review pass — 2026-09-21

Scope: the Movements Log filter presentation, and the `Movements with New
Damages` filter requested from a proposed design screenshot.

The screenshot is not a capture of this screen. It shows a `Movements with New
Damages` checkbox that does not exist in `logsMovement` (which has eight filter
fields), and it predates the filter strip. The owner confirmed it is a proposed
design to be implemented in full, and chose the field distribution and the
damage definition below.

### Filter presentation — ported from the approved reference

The filter strip is now the block 4 canonical presentation, taken from
`Accounts/openingBalances/components/details`:

- one wrapping strip: `flex-wrap`, `align-items: flex-end`, `5px 8px` gaps,
  `padding: 5px 8px 6px`, `border-radius: 8px`,
  `border-inline-start: 3px solid var(--sigma-primary)`, a
  `linear-gradient(color-mix(in srgb, var(--sigma-primary) 5%, transparent))`
  over the feature filter surface, and `box-shadow: 0 3px 10px rgb(29 54 73 / 5%)`;
- new feature tokens `--movement-log-filter-surface` / `-border` / `-label`,
  with dark-theme values;
- controls use `var(--sigma-control-radius)` (6px), 11px text,
  `var(--sigma-control-focus-ring)` on focus, a primary-tinted border on hover,
  and a `transition` on border, shadow and background;
- the strip carries `box-sizing: border-box` and `margin: 0 8px 6px`, matching
  the `app-feature-title` host margin (`8px 8px 16px`) so both cards share both
  edges — an explicit owner requirement;
- the report/export/refresh cluster is now
  `var(--sigma-filter-control-height)` tall with a 6px radius, so it matches the
  controls beside it.

### Field distribution — uniform four-column grid

The previous layout was a 12-column grid with per-field spans that left the last
row three-quarters empty. It is now a uniform grid:

```scss
.movement-log-filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: end;
  gap: 5px 8px;
}
```

`N = 4` is derived, not chosen: the set has eight single-column fields plus a
radio group spanning three, so `1 + 3`, then `4`, then `4` fills three complete
rows. The `Movements with New Damages` checkbox takes the fourth column of the
last field row instead of starting a lonely row.

- `.movement-log-date-mode` spans 3 and is
  `min-height: var(--sigma-filter-control-height)`, so it bottom-aligns with the
  date input beside it;
- `.movement-log-new-damages` is one column, `align-self: end`, same control
  height;
- responsive: `repeat(2, …)` at 900px with the date group spanning both columns;
  a single column at 700px with every child on `1 / -1`.

### `Movements with New Damages` — new filter, implemented end to end

The i18n key `hasNewDamages` already existed in all seven vocab files but was
referenced by no template or component, and no backend field backed it. The
contract was Missing and was frozen by the owner rather than assumed.

**Frozen definition.** A movement row has new damages when an `Accident` row
exists with `IsDeleted != true` and `Accident.CreatedAt > movement.DateTimeOut`,
matched by `Accident.AgreementId == movement.AgreementId` when the movement has
an agreement, otherwise by `Accident.VehicleId == movement.VehicleId`.

Two decisions are deliberate and must not be silently swapped:

- `Accident.DamageCharges` is **not** required. An accident record alone counts.
- the timestamp is the **record's** `CreatedAt`, not `Accident.AccidentDateTime`.
  "Recorded after the movement went out" and "the accident happened inside the
  movement window" are different rules that return different rows.

Agreement-first matching with a vehicle fallback is required because `NRM` and
`WorkshopMovement` carry no agreement column at all.

**Evidence checked against source, not assumed:**

| Claim | Evidence |
|---|---|
| `Accident.CreatedAt` is the record creation time | `EntityBase.CreatedAt = DateTime.Now`; `HandleAudit()` does not touch `CreatedAt` on `Add` |
| `Accidents` rows carry `SubscriptionId`, although `AccidentService.AddAsync` never sets it | `SiGmaDbContext.HandleAudit()` stamps `SubscriptionId` from `ClaimTypes.NameIdentifier` on every `Added` `EntityBase` when the claim parses above zero |
| An accident's agreement is the movement's agreement | `AccidentService.cs:316` — `AgreementId = validation.Movement?.AgreementId` |
| The vehicle link is `int` on every source | `NRM.VehicleId`, `WorkshopMovement.VehicleId`, `DeliveryMovement.VehicleId`, `CollectionMovement.VehicleId`, `Agreement.VehicleId`. `NonRentalMovement.VehicleId` is a legacy `Guid` and is **not** the entity behind the `NRMs` DbSet — `NRM.cs` is |
| The new query parameter binds | `CollectionMovementController.cs:18-22` — `[HttpGet("GetMovements")]` with `[FromQuery] MovementFiltersDto filters` |

**Implementation.** `ApplyNewDamagesFlagAsync` runs once over the aggregated rows:
one bounded `Accidents` query restricted to records created after the earliest
departure, then two in-memory lookups keyed by agreement and by vehicle. No
correlated subquery was added to the five source projections, because the
aggregation is unbounded and runs before paging.

The flag is computed on **every** list request, not only when the caller filters,
so `MovementDto.HasNewDamages` is never a misleading default. That costs one
small extra query per list load; it can be traded back for a filter-only
computation if the list is opened often enough for that to matter.

When `hasNewDamages` is absent or `false`, the returned rows are identical to
before this pass.

### Files changed in this pass

Frontend (`SiGmaAngularFrontEnd`):

- `.../Movements/logsMovement/components/list/list.component.scss` — strip
  surface, uniform grid, checkbox styling, responsive rules, dark tokens
- `.../Movements/logsMovement/components/list/list.component.html` — the
  checkbox field
- `.../Movements/logsMovement/components/list/list.component.ts` — form control
  and `buildFilters`
- `.../Movements/logsMovement/models/list.ts` — `hasNewDamages?: boolean`
- `src/app/modules/i18n/vocabs/en.ts`, `ar.ts` — `movementLog.filters.hasNewDamages`

Backend (`SigmaBackend`):

- `SiGma.Helpers/Dtos/MovementFiltersDto.cs` — `bool? hasNewDamages`
- `SiGma.Helpers/Dtos/MovementDto.cs` — `VehicleId`, `AgreementId`, `HasNewDamages`
- `SiGma.Business/Services/CollectionMovementService.cs` —
  `ApplyNewDamagesFlagAsync`, its call site, and `VehicleId`/`AgreementId` in all
  five projections

Canonical documents (`Shaban`):

- `SIGMA_UI_PATTERNS.md` → v0.61 — block 4 now carries the compact filter strip
  as the default presentation plus the field-distribution rule; the flat
  12-column grid is the retained presentation; block 14's compact-filter section
  is reduced to a pointer at block 4
- `SIGMA_BACKEND_PATTERNS.md` — `#### Derived filters whose predicate lives in
  another aggregate`, under block 17
- `recipe-system/templates/PHASE-02-read-grid.template.md` and
  `recipe-system/recipe-manifest.json` — updated for the new default; all eight
  packets regenerated and `-Check` reports OK

No entity, schema, EF configuration, migration, or model snapshot was touched.

## Fourth review pass — 2026-09-21

Three owner corrections to the date filter, plus one latent defect the first
correction exposed.

### Correction — "date range should be in 2" means two months, not two columns

The owner's words were `date range المفروض يكون فى 2`. My first reading was that
the field should span two grid columns, and I implemented that: `span 2` on
`.movement-log-date-filter`, `span 3` → `span 2` on `.movement-log-date-mode`
(re-derived to keep the total at `12` so the three rows still closed), plus a
matching guide rule. **That reading was wrong and has been fully reverted.**

The intended meaning is that **opening the range picker shows two months side by
side** — `[numberOfMonths]="2"` — which is a panel property and does not widen
the field at all. The owner's reply was explicit: *"انت كبرتها عالفاضى انا عايز
اما افتحها يكون فى اتنين date picker مش انك تضاعف العرض"*.

Reverted: the `grid-column` spans are back to `1 + 3`, `N` stays `4`, and the
block 4 field-distribution rule is back to its original wording. The wrong
`span 2` rule was removed from the guide, the copy-this snippet, and the
`PHASE-02` template — nothing derived from the wrong reading survives.

### Correction — the date box must be typeable

`[readonlyInput]="true"` → `[readonlyInput]="false"`.

This turned out to be a genuine inconsistency rather than a preference. Surveying
every calendar in the frontend:

| `[readonlyInput]` | Count | Where |
|---|---|---|
| `"false"` | 13 | **every one** under `components/list/` or `components/report/` |
| `"true"` | 106 | overwhelmingly `components/details/`, editors and dialogs |

The split is clean and unbroken: list and report filters are typeable, detail and
editor forms are picker-only. `logsMovement` is a list screen and was the
outlier. The canonical list-filter reference `Customers/BalancesSummary` already
uses `"false"`.

### Defect found — the trigger icon was re-shown by the feature, splitting the box

The owner's third point was *"شيل ايقونة النتيجة وخلى العرض مساوى للعنصر اللى تحته
فى نفس العمود"* — remove the icon, and make the width match the field below it in
the same column.

Root cause, confirmed against source rather than inferred:

| Claim | Evidence |
|---|---|
| `iconDisplay` defaults to `"button"`, so `[showIcon]="true"` renders a **separate** trigger button | `node_modules/primeng/fesm2022/primeng-calendar.mjs`: `iconDisplay = 'button'` |
| The global sheet **hides** that button everywhere | `src/styles.scss:2207-2209` — `.p-datepicker-trigger { display: none !important; }`, top level, not nested |
| The global sheet already makes the calendar host a full-width block | `src/styles.scss:2644-2652` — `p-calendar { display: block; min-width: 0; }`, `p-calendar .p-calendar { width: 100%; }` |
| The feature SCSS **overrode the hide** and brought the button back | `list.component.scss` (before): `:host ::ng-deep .movement-log-date-filter .p-datepicker-trigger { display: inline-flex !important; }` |
| PrimeNG squares the input's right corners to butt against that button | `primeng-calendar.mjs` CSS: `.p-datepicker-trigger { border-top-left-radius: 0; border-bottom-left-radius: 0; }`, mirrored by the feature's `border-radius: 6px 0 0 6px` |

So the control was rendering as an input plus a `36px` button. The outer box still
lined up with the column, but the input inside it did not — which is exactly the
mismatch the owner described. Removed: the trigger override rule, the `showIcon`
attribute, the asymmetric `border-radius`, and the stale
`.p-datepicker-trigger` helper rule. The input is now the whole box and measures
like every plain `> input` in the grid.

### Latent defect — `[showIcon]` without `iconDisplay` renders nothing

The block 17 canonical snippet declared `[showIcon]="true"` with no
`iconDisplay`. Since the property defaults to `"button"` and the global sheet
hides that button, **that attribute is a no-op** — it renders no icon at all,
anywhere in the app. Of 176 `showIcon` occurrences, only 14 screens actually
show an icon, and all 14 pair it with `iconDisplay="input"`. The canonical
snippet now carries `iconDisplay="input"`, and block 17 states the pairing as a
rule.

### Reported, not changed — 155 calendar elements declare an icon they never get

The `[showIcon]` finding above is not specific to this screen. A read-only audit
of every `<p-calendar>` under `src/app` (script: `.workbuddy-tmp/audit-showicon.py`,
matched per element, not per file) gives:

| Measure | Count |
|---|---|
| `p-calendar` elements | 209 |
| without `showIcon` | 33 |
| with `showIcon` | 176 |
| …that **render an icon** (`iconDisplay="input"`) | **14** |
| …that **render nothing** (`iconDisplay` absent) | **155** |
| …not statically evaluable (`showIcon` bound, or `false`) | 7 |

All 155 dead ones are `<absent>` — not one uses a different `iconDisplay` value,
so the pattern is a single omission repeated, not a variety of mistakes. The 14
that work are all list or report screens and all pair `showIcon` with
`iconDisplay="input"`.

Two consequences, in order of severity:

1. **Dead declaration.** The developer asked for an icon and got none. Nothing
   breaks — clicking the input still opens the panel — but the markup states an
   intent the app does not honour, and it reads as working code to the next
   person who copies it. This is the same trap the block 17 rule now closes.
2. **Reserved but unused space.** The global input rule is
   `padding: 6px 34px 6px 9px` (`src/styles.scss:2658`) — the `34px` inline-end
   padding exists to clear the trigger icon. With no icon rendered, that space is
   empty on every one of the 155, unless a feature overrides `padding` itself
   (this screen does, via `padding-inline: 10px`). The affected calendars
   therefore show a visibly empty gap at the inline end of the box.

**Not changed here.** This is a repo-wide cosmetic and consistency issue across
roughly 60 feature components, it is outside the Movement Log's scope, and the
correct fix depends on an owner decision the guide cannot make for them: whether
those 155 calendars should gain `iconDisplay="input"` (icon inside the box, as
the 14 working screens do) or drop `[showIcon]` entirely. Fixing it silently
across 60 components would be a large unscoped diff. Reported for a separate,
explicitly requested pass.

The guide rule added in this pass (`SIGMA_UI_PATTERNS.md` block 17 — "copy that
pair or copy neither; never `[showIcon]` alone") stops the pattern growing.

### Files changed in this pass

Frontend (`SiGmaAngularFrontEnd`):

- `.../Movements/logsMovement/components/list/list.component.html` —
  `[numberOfMonths]="2"`, `[readonlyInput]="false"`, `[showIcon]` removed
- `.../Movements/logsMovement/components/list/list.component.scss` — trigger
  override and stale helper rule removed, `border-radius` made uniform,
  `box-sizing: border-box` on the calendar input, grid comment corrected

Canonical documents (`Shaban`):

- `SIGMA_UI_PATTERNS.md` → **v0.62** — block 17 gains three filter-calendar
  rules (typeable filter date, two-month range picker, no trigger icon), the
  canonical editor snippet gains `iconDisplay="input"`, and the block 17
  `**Check:**` line covers all three
- `recipe-system/templates/PHASE-02-read-grid.template.md` — the filter concern
  and the continuous gate now carry the date-filter rules
- all eight packets regenerated once, then `-Check` reports `OK` for every
  packet with exit code `0`

No entity, schema, EF configuration, migration, or model snapshot was touched.

### Still owner-verified only

Unchanged from the third pass: no build, test, lint, or browser run was
performed, per `AGENTS.md`. For this pass specifically, the owner should confirm
that the range panel opens on two months, that the date can be typed before the
panel opens, and that the date box is now flush with `Movement No` beneath it.

## Fifth review pass — 2026-09-21

Scope: vertical space only. Three requests in sequence, the third a correction of
how I read the second.

### Requested — a taller Grid, tighter search boxes, less space under the paginator

- *"mمكن تكبر ارتفاع الكارت الخاص ب Grid وتضغط مربعات البحث قليلا"* — a taller
  Grid card and slightly compressed search boxes.
- *"وتقلل المسافة الىى تحت pagination بشكل عام والكارت يكون قبل footer بمسافة
  قليلة لاستغلال اكبر مساحة"* — less space under the paginator in general, and
  the card close to the footer, to use the available area.

The search-box half was **not implemented**. `SIGMA_UI_PATTERNS.md` block 4 pins
the single-line filter height to the shared token `--sigma-filter-control-height:
34px` and states it is "a shared invariant, not a feature-level design choice"
with "Do not hard-code or substitute another single-line filter height in feature
SCSS". Compressing it is therefore a global decision, not a `logsMovement` one.
Three options were put to the owner; the recommendation was to leave it as is.
**Still unanswered.**

The Grid-height half was implemented by reclaiming vertical space that was dead
rather than by shrinking anything:

| Where | Before | After | Net |
|---|---|---|---|
| `:host` shell subtraction | `- 12px` slack | `- 2px` slack | +10px |
| shared paginator bottom padding | `12px` | `4px` | +8px |
| feature grid bottom margin | `12px` | `8px` | +4px |

A fourth row — trimming the panel's own bottom padding — was tried here and then
**reverted** in the correction below, because the card's internal inset is not
the right lever.

### Correction — the gap had to be OUTER, not internal

I first reduced `.movement-log-page`'s padding and the card's own `padding`. The
owner corrected it:

> *"انات قللت المسافة بين shadow وبين المكونات انا قصدى المسافة الخارجية اللى
> تخلى الكارت كله يطلع لفوق ويقللك المسافة بينه وبين topbar"*

That is right, and the distinction matters: the card's `padding` is the gap
between its border/shadow and its own contents. Trimming it moves the *contents*
while the card's outer edge, border, and shadow stay exactly where they were — so
the requested change appears to do nothing while the border visibly crowds the
first child. The distance to the TopBar is owned by **outer** spacing only.

### Diagnosis — where the band above the card actually comes from

Checked before editing, because the obvious fix is a no-op:

- `.app-content` **already** carries no vertical padding. The active layout
  config is `LightSidebarConfig` (`layout.service.ts:22`), which sets
  `toolbar.fixed` and `footer.fixed` to `false`, so Metronic's
  `[data-kt-app-toolbar-enabled=true]:not([data-kt-app-toolbar-fixed=true])
  .app-content` and `:not([data-kt-app-footer-fixed=true]) .app-main
  .app-content` rules both match and pin `padding-top`/`padding-bottom` to `0`.
  A `.app-content { padding-top }` rule would have changed nothing.
- The visible band is the **toolbar's own** vertical padding:
  `app.toolbar.class: 'py-3 py-lg-6'` — `12px` on mobile, `24px` from `992px` up.
- That padding is the toolbar's **whole** vertical size, not a slice of a fixed
  box: `toolbar.fixed` is `false`, so Metronic's
  `body:not([data-kt-app-toolbar-fixed=true]) .app-toolbar { height: auto }`
  (`assets/sass/layout/_toolbar.scss:21-27`) outranks the base
  `.app-toolbar { height: var(--bs-app-toolbar-height) }`
  (`assets/sass/core/layout/base/_toolbar.scss:36-37`). `--bs-app-toolbar-height`
  still reports `55px` and is **not** what sizes the toolbar, so reasoning from
  it leads to the wrong conclusion.
- The band is not empty. `toolbar.component.html` renders `app-page-title`, and
  `showPageTitle()` returns true for `appToolbarLayout === 'classic'` (the active
  layout) on any route not on its exclusion list — and `/MovementLog` is not on
  it. `app-page-title`'s breadcrumb block is commented out and the config sets
  `description: false`, so the toolbar carries a single `h1.page-heading`
  (`fs-3`, `my-0`) whose height comes out at roughly one line box.

### Correction — the internal inset was the wrong lever

The first attempt at this pass trimmed the card's own `padding`. The owner
corrected it:

> *"بلاش غباء المسافة الداخلية رجعها زى ما كانت والمسافة الخارجية اللى بين الصفحة
> اكملة وtopbar من فوق وfooter من تحت قللها عشان نستفاد من الصفحة"*

So the split is: **every internal value goes back to its original, and all the
space is taken from outside the card.**

### Implemented

| File | Change | Reason |
|---|---|---|
| `list.component.scss` | `.movement-log-panel` → `padding: 1rem` | internal inset restored **exactly** to the original on all four sides |
| `list.component.scss` | `.movement-log-page` → `padding: 0 1rem .25rem` | the page's own outer gap; top zero so the card reaches the top, bottom a hairline so it is not welded to the footer |
| `list.component.scss` | `@media (max-width: 700px)` split into two rules (`0 .75rem .25rem` / `.75rem`) | the shared shorthand had pinned both selectors to one value, contradicting the two different vertical insets |
| `list.component.scss` | `:host` → `height: 100%` (viewport calc removed) | see the frame correction below |
| `src/styles.scss` | **no rule** — the toolbar override was reverted, leaving a guard comment | see the toolbar finding below |

Net effect above the card, at the `992px`-and-up breakpoint:

| | Original | Mid-pass | Final |
|---|---|---|---|
| toolbar padding | `24px` / `24px` | `12px` / `8px` | `24px` / `24px` (unchanged) |
| page outer padding | `16px` / `16px` | `4px` / `4px` | `0` / `4px` |
| card internal padding | `1rem` | `1rem 1rem .5rem` | `1rem` |
| gap, page title → card | `24px + 16px = 40px` | `8px + 0 = 8px` | `24px + 0 = 24px` |
| residual gap above the footer | `12px` slack + calc mismatch | `2px` slack + calc mismatch | **none** (container-filled) |

The card's internal inset is byte-identical to its original value, and every
millimetre gained came from outside the card.

### Correction — the route was computing its own page height

While verifying where the band above the card came from, the `:host` rule turned
out to be a **second page-height calculation**, which block 1's bounded-route-frame
section explicitly forbids: *"Feature pages must not add a second page-height
calculation."*

It was also wrong by construction. The shell sizes the toolbar from the toolbar's
own padding (`toolbar.fixed` is `false`, so Metronic forces `height: auto`), while
the calc reserved the fixed `--bs-app-toolbar-height` of `55px`. The two agree only
by luck, and the per-screen trailing `slack` was the fudge factor absorbing the
difference — a value that cannot stay correct, because the toolbar's real height
depends on whether a page title resolves at runtime (`PageInfoService.title` starts
as `'Dashboard'` and is replaced by `calculateTitle()` from the active sidebar menu
link, so it can end up empty).

`height: 100%` resolves against `.app-container`, which the shell already sizes to
the exact leftover space (`flex: 1 1 auto; min-height: 0` inside `.app-content`).
So the card now fills the content area exactly: no residual gap above the footer,
no overflow, and no dependence on the toolbar's height. Two existing screens use
the same pattern — `Rental/RentalPlanner` and `Staff/designations` — so this is a
proven shape in the codebase, not an invention.

### Correction — the shell toolbar band, and the change the owner then asked for

Mid-pass I tightened `.app-toolbar` from the layout config's `py-3 py-lg-6` to
`12px`/`8px`, then reverted it: **34 feature stylesheets** still size their page
with `calc(100dvh - … - var(--bs-app-toolbar-height) - … - <slack>)` and reserve a
fixed `55px` for the band, so shrinking the band alone leaves each of those routes
mismatched against its container. Five of the 34 are sibling Movements screens on
this same review branch: `collectionMovement`, `CustodyMovement`,
`DeliveryMovement`, `NRM`, `WorkshopMovement`.

The owner then asked for the band itself to be reduced. That is safe once the
reservation is moved together with the band, so the change is now implemented in
`src/styles.scss`, desktop only:

| | Layout config | Now |
|---|---|---|
| `.app-toolbar` padding-top | `24px` (`py-lg-6`) | `16px` |
| `.app-toolbar` padding-bottom | `24px` (`py-lg-6`) | `8px` |
| `--bs-app-toolbar-height` | `55px` (Metronic base) | `31px` |

`55px − 24px = 31px`: the companion `:root` override keeps every one of those 34
calcs measuring the same available space as before, so tightening the band moves
no other screen. `--bs-app-toolbar-height` has **no other live consumer** — every
other use in the Metronic SASS is gated on `toolbar.fixed` / `toolbar.sticky`, and
both are `false` in `LightSidebarConfig`.

Mobile is untouched: `py-3` is already `12px` / `12px`.

The top inset keeps the page title off the app header; the bottom inset is the gap
between the title and the routed card, which is the distance the owner asked to
reduce. `logsMovement` itself is on the container-fill host, so it does not read
the variable at all — as the other 34 migrate, the companion can be deleted.

### Reported, not changed — 16 feature stylesheets override the shared paginator

While reducing the space under the paginator I found the shared default was the
outlier, not the feature: 16 feature stylesheets already set
`.p-paginator { padding: … }`, and **every one** trims the bottom to 0–4px.

| Area | Files | Value |
|---|---|---|
| Movements | 5 | `6px 0 4px !important` |
| Fleet | 4 | `8px 0 0` |
| Limousine | 4 | `8px 0 0` |
| Transportation | 3 | `8px 0 2px`, `8px 0 0` |

`logsMovement` was the only Movements screen without the override — which is
exactly why its dead space was the one the owner saw. The shared value is now
`4px`. The 16 overrides are recorded as backlog item 33 with a recommendation to
delete them (they are now near-redundant). **Not deleted** — 16 files across four
modules, outside this screen's scope.

### Files changed in this pass

Frontend (`SiGmaAngularFrontEnd`):

- `.../Movements/logsMovement/components/list/list.component.scss` — panel padding
  back to the original `1rem`, page outer padding `0 1rem .25rem`, mobile media
  split so each selector keeps its own vertical inset, grid bottom margin
  `12px` → `8px`, and the `:host` viewport calc replaced by `height: 100%`
- `src/app/modules/shared/components/data-table/data-table.component.scss` —
  shared paginator bottom padding `12px` → `4px` (affects every list screen)
- `src/styles.scss` — the shell toolbar band tightened on desktop (`16px` above /
  `8px` below, against the layout config's `24px` / `24px`) with the companion
  `--bs-app-toolbar-height: 31px`, and a comment recording why the companion is
  mandatory

Canonical documents (`Shaban`):

- `SIGMA_UI_PATTERNS.md` → **v0.68** — block 1's `#### Shell vertical insets`
  records the tightened toolbar band (`16px` / `8px` desktop), the mandatory
  `--bs-app-toolbar-height: 31px` companion and the 34 stylesheets that make it
  mandatory, that the toolbar is sized by its padding rather than by that variable
  (because `toolbar.fixed` is false, so `height: auto` wins), and the
  **outer-versus-inner** rule; the bounded-route-frame section gains the
  **container-fill** requirement with the `height: 100%` snippet, the two
  reference screens, and the reason the viewport calc cannot stay correct; the
  shared-table block states that a feature grid's bottom margin is a feature-owned
  placement value (`8px`–`18px` observed) while the paginator's internal spacing
  stays shared
- `recipe-system/templates/PHASE-02-read-grid.template.md` — the continuous gate
  now covers container-fill, outer-versus-inner spacing ownership, and that the
  toolbar band is the shell's own desktop value rather than a screen-scoped lever
- all eight packets regenerated once, then `-Check` reports `OK` for every packet
  with exit code `0`

### Still owner-verified only

No build, test, lint, or browser run, per `AGENTS.md`. The owner should confirm:
the card's internal inset reads exactly as it did before this pass; the card now
fills the content area with no strip of dead space above the footer; and there is
no scrollbar in the content region at desktop and at 900px/700px.

`height: 100%` on the route host is the one structural change here, so it is the
one worth looking at first. `Rental/RentalPlanner` and `Staff/designations` are
the working references for that shape.

### Reported, not changed — the toolbar duplicates the card's title on this route

`/MovementLog` is **not** on `showPageTitle()`'s exclusion list, so the toolbar
renders a page title while the card renders its own `app-feature-title` (`title` +
`subtitle` + icon). Other screens were excluded for exactly this reason — the
method carries the comment *"LimoQuotation owns its single title inside the feature
card."*

Removing the toolbar title for this route would reclaim the whole toolbar band
rather than just its padding, and it is the only way to reclaim that band without
the 34-screen migration. **Not changed**: it is a shell-wide visibility decision
affecting every future screen, and it is the owner's call, not a side effect of a
spacing request. Raised here so it can be decided deliberately.

## Owner verification and remaining contract needs

Run the frontend and backend compile checks and manually verify the Movement
Log in English/Arabic and light/dark themes, including date-mode boundaries,
page changes, empty/error responses, full export, and full-list print.

From the third pass specifically, still unverified because `AGENTS.md` prohibits
builds and browser runs in this workflow:

- `dotnet build` — type-check the new `ApplyNewDamagesFlagAsync`, including its
  `GroupBy` / `Max` over `DateTime?` and the anonymous projection;
- `ng build` — AOT-check the new checkbox markup and its form control;
- visually confirm the strip shares both edges with the feature-title card, that
  the field grid fills three complete rows at desktop width, and that it
  collapses correctly at 900px and 700px;
- confirm that checking `Movements with New Damages` actually changes the result
  set, and that unchecking it restores the previous rows exactly;
- confirm the Arabic label renders and the strip mirrors correctly in RTL.

`git diff --check` is clean in all three repositories.

To implement screenshots 3–12, provide the authoritative Check Card data,
document/checklist/damage-marker/signature/print contracts, and the Damage
Invoice endpoint, payload, validation, and workflow rules. Clarify checkbox
semantics for `KMs Greater Than` if the integer threshold is not intended.

## Sixth review pass — 2026-09-23

### Requested — row `View` action

The current movement-log response has five confirmed source values and a stable
cross-aggregate identity: `Agreement`, `NRM`, `WorkshopMovement`,
`DeliveryMovement`, and `CollectionMovement`; the backend sets
`MovementKey = "{Source}:{MovementId}"`. The existing action menu already opened
the four movement-specific detail dialogs, but its `visible` predicate omitted
`Agreement`, so agreement rows rendered no usable View action.

The scoped fix adds `Agreement` to the supported View-source set and routes that
row to the existing `/RentalAgreement/view/:id` editor. The four existing source
dialogs remain unchanged. Non-positive or non-finite IDs are ignored before any
dialog or navigation state is changed. This is an existing route contract, not a
new Check Card API or inferred detail payload.

The action continues to use `general.view` with the canonical eye icon. English
already contained the shared key; Arabic was missing it and now resolves it as
`عرض`.

### Evidence and unresolved requirements

The supplied screenshots are functional evidence for a historical Check Card
surface. They do not supply a current Sigma entity, endpoint, DTO, document or
checklist contract, so the Check Card tabs, damage diagrams, signatures, and
print workflow remain explicitly blocked as recorded above. This pass implements
only the requested row View action using confirmed current contracts.

### Files changed in this pass

Frontend (`SiGmaAngularFrontEnd`):

- `src/app/modules/Movements/logsMovement/components/list/list.component.ts` —
  Agreement View visibility, guarded ID handling, and navigation to the existing
  Rental Agreement view route.
- `src/app/modules/i18n/vocabs/ar.ts` — added the missing shared
  `general.view` translation.

No backend, entity, EF, migration, generated packet, or existing user-owned SCSS
change was modified in this pass. Source-only verification reviewed the changed
files and `git diff --check`; build, tests, lint, runtime, browser, database,
migration, commit, and push commands remain intentionally unrun under
`AGENTS.md`.

## Seventh review pass — 2026-09-23 — clarified multi-tab Check Card

### Confirmed request

The owner clarified that View must open the Check Card surface shown in the
attached screenshots, with six tabs: **Basic Details**, **Documents**,
**Checklist**, **Exterior**, **Interior**, and **Signatures**. The earlier
route-only interpretation is superseded for Agreement rows. The View action now
opens a list-owned view dialog in place; the existing route and the four
non-Agreement movement dialogs remain untouched.

### Frozen view contract and evidence

| Area | Decision | Evidence / boundary |
|---|---|---|
| Host | Shared `app-editor-dialog` in view mode with shared `app-editor-tabs` | Canonical UI blocks 13 and 15; the supplied screenshots establish the six-tab functional surface, not shared styling values |
| Basic Details | Render summary plus checkout/checkin fields from `LogsMovementListDTO`, enriched by `RentalAgreementDetailsDTO` when available | Existing Movement Log list DTO and confirmed `RentalAgreement/GetByWithNavigationsId/{id}` read contract |
| Documents | Render the existing Agreement document names and availability flags | Confirmed `RentalAgreement/{id}/documents` endpoint and `RentalAgreementDocumentsDTO`; view mode has no upload/delete controls |
| Exterior / Interior | Render the existing fleet inspection SVG for checkout and checkin and disclose that damage markers are unavailable | Existing `assets/media/fleet/vehicle-type-exterior.svg` and `vehicle-type-interior.svg`; no marker DTO or endpoint was found |
| Checklist / Signatures | Keep the tabs visible with an explicit unavailable state | No Check Card checklist or signature DTO/endpoint exists in the scoped backend; fake rows or signatures are prohibited |
| Grid action | `general.view` remains the eye action; Agreement selects the row for the dialog, while four existing sources retain their details dialogs | Existing list action contract plus confirmed source values from Movement Log projection |

The grid column list and `LogsMovementListDTO` property list remain unchanged;
this change is a detail/view interaction and does not change the ListVM
contract.

### Files changed in this pass

Frontend (`SiGmaAngularFrontEnd`):

- `src/app/modules/Movements/logsMovement/components/list/list.component.ts`
  and `.html` — selected Agreement row state, in-place Check Card host, and
  close-state cleanup; existing movement-source dialogs preserved.
- `src/app/modules/Movements/logsMovement/components/view/view.component.ts`,
  `.html`, and `.scss` — standalone six-tab Check Card view, confirmed
  Agreement details/documents reads, loading/error/empty states, diagrams, and
  responsive/dark-compatible feature styles.
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts` — Check Card tab, field,
  state, error, diagram, and document translations; Arabic `general.view` was
  retained from the preceding action pass.

No backend, entity, EF, migration, generated packet, or existing user-owned
SCSS change was modified for this Check Card implementation. `git diff --check`
was run on the frontend repository and is clean apart from normal CRLF
conversion warnings. The recipe drift check remains green for all generated
packets. Build, tests, lint, runtime, browser, database, migration, commit, and
push commands remain intentionally unrun under `AGENTS.md`.

### Remaining owner verification / contract blocker

The owner must run the frontend compile and manually open Agreement View in
English and Arabic, light and dark themes, including each tab, document loading
and error responses, keyboard tab navigation, close/escape, RTL layout, and a
second Agreement row after closing the first. A future backend contract is
required before Checklist rows, damage markers, or Signatures can become real
data; the current tabs deliberately report that boundary instead of inventing
one.

## Eighth review pass — 2026-09-23 — Angular compilation inclusion fix

The owner reported that Angular could not compile the new View component because
the repository uses an explicit runtime `files` list in `tsconfig.app.json`.
The scoped fix adds
`src/app/modules/Movements/logsMovement/components/view/view.component.ts`
next to the existing Logs Movement list entry. The `include` glob was not
broadened and no spec files were added. The existing import path was confirmed
valid. Scoped `git diff --check` is clean apart from the repository's normal
LF/CRLF conversion warnings; build, tests, lint, and browser verification remain
owner-pending under `AGENTS.md`.

## Ninth review pass — 2026-09-23 — verified active Angular project config

The owner reported the same missing-file error after the explicit entry was
added. `angular.json` was rechecked and the application build points to
`tsconfig.app.json`; the effective TypeScript configuration was inspected with
the local compiler's `--showConfig` mode and includes both the Logs Movement
list component and `components/view/view.component.ts`. No alternate build
tsconfig was found. The source/config diff remains clean. A running Angular
serve process must be stopped and restarted so `@ngtools/webpack` recreates its
program from the updated root-file list; this is a process-cache issue, not a
request to broaden the TypeScript include glob.

## Tenth review pass — 2026-09-23 — compiler cache reconciliation

The local TypeScript compiler's `--listFilesOnly` output confirms the Check Card
component is a root file of the effective `tsconfig.app.json`. The generated
Angular CLI cache was cleared with `ng cache clean`; no source, dependency,
build output, or broad `include` rule was changed. The running dev-server process
still requires a full stop/start because its in-memory webpack program predates
the corrected root-file list.

## Eleventh review pass — 2026-09-23 — completed safe Check Card logic

The owner requested that the rental workflow logic be completed where the
current contracts support it, using the supplied Check Card evidence and
standard rental handover/return concepts as supplementary guidance. The
implementation remains source-backed: existing agreement detail and document
reads are used, the configured `ChecklistItem` catalog is loaded for the
Checklist tab, and the server-derived `HasNewDamages` flag is surfaced on the
Exterior and Interior tabs. The screenshot fallback labels are retained when
the catalog is empty or unavailable, so the screen remains useful without
turning configuration text into persisted movement values.

The Checklist `Out` and `In` cells remain empty because no movement-owned
checklist-value relation or endpoint exists. Exterior/Interior marker
locations and Signatures likewise remain explicitly unavailable because no
corresponding DTO or endpoint was found. No new database entity, API write,
schema change, or migration was invented. Check Card dates, driver, branch,
notes, mileage, and fuel now avoid copying checkout-only values into the
check-in column when the list contract has no actual return value.

### Files changed in this pass

- `SiGmaAngularFrontEnd/src/app/modules/Movements/logsMovement/components/view/view.component.ts`
  — configured checklist loading with fallback, damage flag presentation, and
  checkout/check-in value ownership.
- `SiGmaAngularFrontEnd/src/app/modules/Movements/logsMovement/components/view/view.component.html`
  and `.scss` — full-width checklist table and damage-state messaging.
- `SiGmaAngularFrontEnd/src/app/modules/Movements/logsMovement/models/list.ts`
  — typed server-derived `hasNewDamages` action-state property.
- `SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/en.ts` and `ar.ts` — damage
  state translations.

Source-only verification: the generated recipe drift check remains green;
`tsc --showConfig` and `--listFilesOnly` include the new View component; and
frontend `git diff --check` reports only the repository's normal LF/CRLF
conversion warnings. Builds, tests, lint, browser/runtime, database,
migrations, commits, and pushes remain intentionally unrun under `AGENTS.md`.

## Twelfth review pass — 2026-09-23 — unified View across movement sources

The owner clarified that the View screen is one shared Check Card for every
movement type, with the same six tabs and only the summary/basic-details data
changing by source. The implementation now routes every supported Movement Log
row (`Agreement`, `DeliveryMovement`, `CollectionMovement`, `NRM`, and
`WorkshopMovement`) to the same `app-movement-check-card` component. The prior
source-specific detail dialogs are no longer rendered by this list.

The shared component reads the existing source detail endpoints and normalizes
them into the common header and checkout/check-in shape. Agreement uses the
agreement number/customer contract; Delivery and NRM use the driver/reference
contract; Workshop uses purchase-order/workshop fields and adds the screenshot
specific `Type` and `Service Done` rows. Existing list values remain the
fallback when a detail request fails. Workshop documents and Agreement document
availability are shown in the common Documents tab; other sources retain the
same tab with the documented empty state.

The six tabs remain identical for all sources: Basic Details, Documents,
Checklist, Exterior, Interior, and Signatures. Checklist item names come from
the existing ChecklistItem catalog, while Out/In values remain blank because no
movement-owned checklist-value contract exists. No return/check-in values,
damage coordinates, or signatures are fabricated for source entities that do
not persist them; the common screen renders the existing list values or blanks.

### Files changed in this pass

- `SiGmaAngularFrontEnd/src/app/modules/Movements/logsMovement/components/list/list.component.ts`
  and `.html` — one View action target and one shared dialog for every supported
  movement source; old source-specific detail dialog hosts removed.
- `SiGmaAngularFrontEnd/src/app/modules/Movements/logsMovement/components/view/view.component.ts`,
  `.html`, and `.scss` — source normalization, common six-tab rendering,
  source-aware summary labels, documents, checklist catalog, diagrams, and
  explicit unavailable states.
- `SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/en.ts` and `ar.ts` —
  generic/reference-specific labels for Agreement, Driver, Workshop, PO, Type,
  and Service Done.

No backend, entity, EF, migration, generated packet, or schema change was
needed: the existing detail APIs and Movement Log projection provide the
required source-specific fields, while the backend has no common persisted
check-in/checklist-marker/signature contract. The recipe drift check remains
green. `tsc --showConfig` and `--listFilesOnly` include both list and View
runtime files, and frontend `git diff --check` is clean apart from normal
LF/CRLF conversion warnings. Build, tests, lint, browser/runtime, database,
migration, commit, and push commands remain intentionally unrun under
`AGENTS.md`.

## Thirteenth review pass — 2026-09-23 — applied Opening Balances tab shape

The owner pointed out that the UI guide requires the shared Opening Balances
workspace tab appearance. The Check Card now opts into
`app-editor-tabs` `appearance="workspace"` and supplies the same icon-bearing
tab contract used by Opening Balances. The six tab keys and their behavior are
unchanged; this correction is visual/shared-component configuration only.

## Fourteenth review pass — 2026-09-23 — aligned View colors and content spacing

The View content now uses the Sigma surface, canvas, border, text, muted,
semantic status, and dark-theme tokens used by the Guide and Opening Balances.
The body-appended `movement-check-card-dialog` overlay receives explicit light
and dark token values in the global overlay scope, while the projected View
content consumes those tokens without overriding the shared dialog shell.

The projected content also has a 16px desktop / 12px narrow-screen inline
gutter, 18px panel top spacing, and consistent field/table/document gaps. This
keeps labels and values away from the dialog edge and uses logical border
properties for RTL. No shared dialog or unrelated feature colors were changed.

## Fifteenth review pass — 2026-09-23 — refined the View card header strip

The Check Card header summary was refined to read as a compact metadata strip:
the four source-aware fields now have consistent label/value hierarchy,
dashed value baselines, restrained logical separators, and full-width alignment
with the workspace tabs. The strip keeps the feature's internal gutter while
avoiding the previous visually loose/inset top treatment. The narrow layout
switches to a two-column summary with logical row separators.

## Sixteenth review pass — 2026-09-23 — source-backed Agreement document upload

The shared Documents tab now exposes an Upload action only when the displayed
movement is an Agreement and the existing Agreement documents contract reports
`canUpload`. The action uses the existing `RentalAgreementService` upload
endpoint and the shared `app-editor-dialog` shell. It validates the existing
5 MB JPG/JPEG/PNG/PDF rules, reports both result failures and HTTP errors, and
marks the uploaded document as available without reloading the Check Card.

The common View and its tabs remain shared by Agreement, Delivery Movement,
Collection Movement, NRM, and Workshop Movement. Upload is intentionally not
pretended to be common: Delivery, Collection, and NRM have no movement-document
write endpoint in the inspected contracts, while Workshop exposes a separate
document shape without a matching upload boundary in this View. Those sources
remain read-only in Documents until their own persistence contracts are frozen.

### Files changed in this pass

- `SiGmaAngularFrontEnd/src/app/modules/Movements/logsMovement/components/view/view.component.ts`
  — Agreement-only upload state, validation, service call, error handling, and
  post-upload availability update.
- `SiGmaAngularFrontEnd/src/app/modules/Movements/logsMovement/components/view/view.component.html`
  and `.scss` — per-document Upload action and nested shared upload dialog.

No backend, entity, EF, migration, generated packet, or schema change was
added. The existing Agreement API is sufficient; inventing a common endpoint
for the other movement sources would violate the frozen source contracts.

## Seventeenth review pass — 2026-09-23 — Supporting Documents add action

The Documents tab now includes the Guide's icon-only `+` action beside the
Supporting Documents heading for uploadable Agreement movements. The action
opens the existing shared upload dialog and lets the user choose one of the
configured Agreement document targets before selecting a file. Row-level Upload
actions still preselect their target. The button is not rendered for sources
without the Agreement document write contract. If the API returns no valid
configured target, the button still opens the dialog but the target selector
and Save action remain disabled with a clear configuration message; no invalid
request is sent.

The upload dialog remains backed by the existing
`RentalAgreementService.uploadDocument` endpoint; no arbitrary supporting-file
endpoint or database shape was invented. English and Arabic labels were added
for the add action and target selector.

### Files changed in this pass

- `SiGmaAngularFrontEnd/src/app/modules/Movements/logsMovement/components/view/view.component.ts`,
  `.html`, and `.scss` — Supporting Documents `+` action, target selection,
  and shared upload-dialog layout.
- `SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/en.ts` and `ar.ts` —
  accessible add/target labels.
