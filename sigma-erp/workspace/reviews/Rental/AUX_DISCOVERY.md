# Rental auxiliary discovery and contract audit — 2026-10-06

| Item | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Scope | RentalTariff, TariffCard, DriverTimeSheet, RentalPlanner; directly related backend contracts |
| Authority | `F:/My Work/Sigma/AGENTS.md`; Master blocks 4/5/7; canonical UI/BE blocks selected below; frozen planner contract |
| Source repositories | `F:/My Work/Sigma/SiGmaAngularFrontEnd`, `F:/My Work/Sigma/SigmaBackend` |
| Verification boundary | Source-only; no build, test, lint, runtime, browser, database, migration, commit, or push |

## Governance and reference selection

The recipe check on 2026-10-06 reported generated drift for PLAN-00 and
PHASE-00 and PHASE-02 through PHASE-06; PHASE-01 was the only packet reported
OK. Canonical books and the frozen feature artifacts therefore remain the
authority. The existing `reviews/Archive/Completed/2026-10-23/RENTAL_PLANNER_DISCOVERY_CONTRACT_FREEZE.md`
is preserved, including its specialized grouped timeline matrix exception and
read-only status semantics.

Applicable canonical conformance closure:

| Concern | Canonical block | Source evidence / owner | Recommendation |
|---|---|---|---|
| Route host, page fill, one scroll owner | UI 1 | Rental components use local `*-page`/`*-panel`/`*-shell` classes; planner owns matrix overflow | Move ordinary pages to shared route/list/editor shells. Keep planner's feature-local matrix wrapper only for the frozen exception and keep its internal scroll owner. |
| Title, filters, grid/actions | UI 3–7 | Tariff and cards use `app-feature-title`, `app-data-table`, but local filter/table styles; DriverTimeSheet uses `app-form-section` plus editable collection | Reuse shared title/filter/table/action owners and remove duplicated geometry. DriverTimeSheet remains an editable aggregate collection shape. |
| Editor/dialog/tabs and dirty close | UI 10, 13–15 | Tariff and card use `EditorDialog`; tariff uses `EditorTabs`; DriverTimeSheet is a routed workspace | Preserve existing close confirmations, modes, and typed forms while aligning headers/body/footer to shared owners. |
| Lookups, validation, loading/errors | UI 16, 19, 22, 28 | Typed dropdowns and `Result/Results` wrappers are present; local error extraction is repeated | Use shared lookup/error/loading adapters where available; retain both `isSuccess:false` and transport-error handling. |
| RTL, dark theme, keyboard/numeric behavior | UI 24–27 | Scoped SCSS contains feature tokens, raw colors, `::ng-deep`, and native numeric inputs | Replace known rogue tokens and adopt shared numeric/focus/RTL owners during implementation; visual/runtime acceptance remains pending. |
| Tariff aggregate and child writes | BE 1–8, 13–14, 18 | `TariffService` validates selection, checks ownership, reconciles four child collections, and saves one tracked graph | Preserve `TariffAddVM`/`TariffUpdateVM`, `GetEditor`, child IDs, and implicit single-save transaction. Do not broaden payloads or alter calculation ownership. |
| TariffCard normal entity | BE 1–8, 13 | `TariffCardController` and `TariffCardService` own paged list, options, writes and guarded delete | Preserve exact endpoints and nullable period/discount semantics. |
| DriverTimeSheet operational aggregate | BE 1–8, 14, 18 | `DriverTimeSheetController` exposes agreement options, agreement rows, `AddList`, `EditList`; service expands agreement days and protects invoiced rows | Preserve full-period replacement, date/duplicate/ownership checks, holiday derivation, and server-owned overtime. |
| Planner operational report exception | BE 17 plus frozen contract | `GET /RentalPlanner` derives vehicle/status/booking/agreement intervals | Preserve read-only matrix, query keys, status mappings, date overlap and no migration. |

## Confirmed contracts

### RentalTariff

Frontend `RentalTariffService` calls:

- `GET Tariff/GetEditor?vehicleTypeId={id}&type={RentalAgreementType}&tariffCardId={id?}`;
- `POST Tariff` with `TariffCreateDTO`;
- `PUT Tariff` with `TariffUpdateDTO`.

The backend `TariffController` owns the same `GetEditor` signature. Add and
update payloads contain only `type`, `isInactive`, `vehicleTypeId`, nullable
`tariffCardId`, and the four child collections (`rentalRates`, `protections`,
`mileage`, `extras`). Detail adds `id`, `name`, and `isSavedForSelection`.
`TariffService` derives `Name` from the tenant vehicle type, validates the
enum/card/vehicle type, rejects duplicate
`VehicleTypeId + Type + TariffCardId`, proves positive child IDs belong to the
aggregate, reconciles removals/additions, and uses one `SaveChangesAsync`.
`TariffGroup` is persisted legacy data and is not an editor input.

The list owner is the VehicleType endpoint, not a Tariff list: grid properties
are `id`, `name`, `detail`, `notes`, with one configure action. The settings
dialog calls `GET TariffSetting` and `PUT TariffSetting/TariffSettingList` with
`{ branchId, adjustment }[]`; empty means full replacement to no active rows,
duplicates and non-tenant branches fail, and adjustment is -100 through 100.

Confirmed implementation recommendations: retain all existing tariff type
and card selection behavior; keep unsupported protection types and calculation
rules unresolved; migrate presentation to shared collection/dialog owners;
apply shared numeric replacement/focus rules to editable rates and settings;
and preserve feature-owned date/card-label formatting until its shared date
owner is selected.

### TariffCard

Frontend calls `GET TariffCard`, `GET TariffCard/GetById/{id}`,
`GET TariffCard/GetEditorOptions`, `POST TariffCard`, `PUT TariffCard`, and
`DELETE TariffCard?id={id}`. The backend list is paged and ordered by descending
ID; editor options are name/ID ordered and include period metadata. Add/update
inputs are `name`, `applicableForPeriodOnly`, nullable `fromDateTime` and
`toDateTime`, `paymentDiscountOnDefaultPeriod`, and nullable
`discountPercentage`. Backend normalization enforces name length, period date
ordering, and 0–100 discount range; delete rejects cards referenced by Tariff
or PartnerBillingInfo.

Confirmed recommendations: preserve this independent normal-entity editor and
its shared confirmation/mode behavior; replace local shell/error styling with
canonical owners; retain date-time and discount transport decisions pending
owner runtime verification.

### DriverTimeSheet

The live Rental screen is
`src/app/modules/Rental/DriverTimeSheet`, not the older Equipment Rental
`TimeSheet` folder. Its service calls:

- `GET DriverTimeSheet/agreements` → `DriverTimeSheetAgreementOptionVm`;
- `GET DriverTimeSheet/GetDriverTimeSheetsByAgreement/{agreementId}` → a row for every agreement day;
- `POST DriverTimeSheet/AddList` for all-new rows;
- `PUT DriverTimeSheet/EditList` when any existing row is present, including mixed new/existing rows.

Rows contain `id`, `agreementId`, `driverId`, `driverName`, `workDay`,
`dayName`, `workingHours`, server-owned overtime values, `isHoliday`, and
`canEdit`. Add/update payloads contain only agreement, driver, workday and
working hours (plus ID for update). Backend includes/excludes closed
agreements according to `SettingsCommonModel.GetCloseAgreementsForDriverTimeSheet`,
blocks edits for invoiced agreements, expands every agreement date, rejects
missing/duplicate/out-of-range days and foreign IDs, and derives holiday and
overtime fields. No schema change is indicated.

Confirmed recommendations: preserve the full-period replacement contract and
server-owned overtime/holiday values; keep the `canEdit` gate; align the
editable collection to shared quantity/numeric and fill/scroll owners; and
remove bespoke page/table styling without changing row payloads.

The older `Equipment Rental/TimeSheet` module is a separate, stale contract:
its service targets `/TimeSheet`, while the backend `TimeSheetAddVM` and
`TimeSheetUpdateVM` expose only date/range, delivery/customer/agreement and
integer hour fields. The frontend sends additional shift, decimal, document,
plate and chassis fields and expects detail/list properties absent from those
VMs. This is a confirmed mismatch and must not be silently merged into
DriverTimeSheet. Treat that module as a separate blocked/retirement decision;
the owning files are its `services/timesheet.service.ts`, models, components,
route and any exact route/provider references.

### RentalPlanner

The historical frozen contract is live and matches source:

- `GET /RentalPlanner` with inclusive local `startDate`/`endDate` and optional `carMakeId`/`plateNo`;
- Make lookup reuses `GET CarMake/GetSelect`;
- response rows are `vehicleId`, `vehicleType`, `plateNo`, `makeAndModel`, nullable current `statusCode`, and clipped `reservations` with `start`, `end`, and `BKG`/`HIR`;
- status mapping is Workshop→WRK, NRM/NotReady→NRM, Available/ReadyToGo→IDL, Hired/Rented→HIR;
- planner is read-only, has no paginator or cell mutation, and uses grouped date/hour headers with bounded matrix scrolling.

The specialized `p-table`/feature-local timeline is an approved exception
because shared `app-data-table` cannot express the two-level date/hour headers
and vehicle-type row spans. Preserve that business and layout exception while
aligning title/filter/error/loading shell behavior. Do not add persistence,
cell actions, or a migration.

## Confirmed findings and implementation ownership proposal

| ID | Finding | Severity | Proposed owner files |
|---|---|---|---|
| R-AUX-01 | RentalTariff, TariffCard, DriverTimeSheet, and Planner use local page/panel/filter/table SCSS instead of shared route/list/workspace owners; this is a UI conformance finding, not an API change. | P1 | Each scoped component `list.component.html/.scss/.ts`; tariff `details.component.html/.scss/.ts`; root owns shared routing/provider/translation files. |
| R-AUX-02 | Scoped SCSS contains bespoke fallback/raw colors and feature-local dark-theme tokens; planner additionally uses raw `#dc3545`, `#f0b400`, and `#20b9c5`. | P1 | The four scoped feature SCSS files; preserve planner matrix semantics and map visual tokens through shared owners. |
| R-AUX-03 | DriverTimeSheet editable working-hours input is native `type=number`; the current application rule requires shared numeric replacement/focus behavior and reviewed editable numeric controls to use shared owners. | P1 | `Rental/DriverTimeSheet/components/list/list.component.html/.ts/.scss`; no payload/formula change. |
| R-AUX-04 | The older Equipment Rental `TimeSheet` frontend contract does not match backend `TimeSheet` DTOs. | P0 blocked decision | Root/owner must choose retirement or a separately frozen API repair; do not alter as part of DriverTimeSheet implementation. |
| R-AUX-05 | Planner date/matrix behavior matches the frozen exception; its local matrix should remain feature-owned while shell/error/filter adapters move toward canonical owners. | P1 | `RentalPlanner/components/list/list.component.html/.ts/.scss`; backend planner files are contract-frozen and should remain unchanged unless a new source finding appears. |

## Decisions and blocked items

| Decision | Status | Evidence |
|---|---|---|
| Planner specialized matrix | Frozen | `RENTAL_PLANNER_DISCOVERY_CONTRACT_FREEZE.md`; current controller/service/frontend match it |
| Tariff child IDs and full snapshot update | Frozen | Tariff VM/service reconciliation and frontend payload builders |
| Tariff calculations / Weekly/Monthly booking selection | Missing | Existing `TariffCalculateService` legacy day-based path; no source-supported selection contract |
| Roof Insurance / Theft Protection and fixed extra units | Missing/Uncertain | `ProtectionType` only CDW/PAI; extras accept arbitrary charge text and no unit |
| DriverTimeSheet permissions | Frozen as current behavior | AuthGuard exists; no authorization mechanism; `canEdit` is business state from invoicing |
| Equipment Rental TimeSheet repair/retirement | Blocked | Frontend/backend shape mismatch above; requires owner scope decision |
| Schema/migration | None for scoped confirmed changes | All current contracts use existing entities/tables; migration files remain prohibited |

## Source-only reconciliation

Both repository working trees contain unrelated pre-existing changes, but no
scoped Rental or Tariff/Planner/DriverTimeSheet diff was present at audit time.
No source files were edited by this audit. Builds, tests, lint, runtime,
database, migrations, browser verification, commits, and pushes were not run.
