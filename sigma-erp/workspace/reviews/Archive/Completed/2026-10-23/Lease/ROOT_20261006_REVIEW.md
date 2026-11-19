# Lease tariff, SMS, closed-record and integration review — 2026-10-06

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Before-edit conformance evidence

| Concern | Owning block | Actual approved reference/symbol | Shared owner | Target/evidence and required correction |
|---|---|---|---|---|
| List fill/layout | UI1/3/6 | Job list template: sigma-list-page/panel/header/table, fill=true | styles.scss, DataTableComponent | TariffsComponent/Sms list have local page/panel/grid classes and no fill; replace without copying geometry. |
| Filters | UI4 | Job list form[appFilterPanel], stableLayout=true, resetRequested | FilterPanelComponent | Tariff simple search + Sms search need shared fields/reset/action projection. |
| Aggregate editor | UI13 D4-2 | Job editor sigma-editor-page/panel/form/body and fixed footer | styles.scss, EditorTabs/EditableCollectionTable | Tariff has rental/protection/mileage/extra arrays inside a modal: route it, preserving one typed form and yyyy-MM payload. |
| States/errors | UI19/22 | Job editor app-state-message and app-field-error | StateMessage/FieldError, apiErrorMessage | Tariff copies states, validationMessageKey and extraction; adopt shared components and skip header for inline errors. |
| Month entry | UI17 | shared DatePickerDirective and parseMonthValue/monthValueValidator | date-utils.ts | Tariff Date-only controls/private DatePipe serializer/picker-only inputs lack typed partial-month validation; accept Date|string|null, reject partial months, preserve yyyy-MM. |
| Routed return | UI10 | Job requestClose/returnQueryParams and shared read/writeListRoute | list-route-state.ts | Tariff passes applied search/page/size on navigation and restores it. Backend GetTariffByVehicleTypeIdAsync returns success/entity=null for no tariff, so Configure route retains automatic create/edit resolution; View stays read-only. |
| Closed agreements | UI1/2/6/15 | Agreement current typed grid/service and backend LeaseAgreement list isClosed filter | existing Agreement components | Replace dead controller/local first-page filtering with route-data adapter forcing isClosed=true and View; reuse aggregate viewer. |

## Root-owned confirmed contracts

Tariff grid: Actions, name(text), detail(text), notes(text); VehicleTypeListDTO uses id for configure plus these fields. Search serializes Filters[search], backend-paged VehicleType via existing service. Tariff detail reads id,name,isInactive,vehicleTypeId and all four collections. Editable payload remains isInactive,vehicleTypeId,rentalRates,protections,mileage,extras, plus id/child id on Update; no server number/tenant/total. Month strings remain yyyy-MM; backend validates ordered nonoverlapping ranges, positive vehicle type and amounts. Configure for a vehicle type loads existing tariff or prepares Create according to its established null-result contract; no separate tariff list API is invented.

Tariff branch settings stay the confirmed existing TariffSettingList workflow. Branch choice uses Branch/GetSelect, adjustment -100..100 and duplicate branch validator; no new delete endpoint or persistence semantics. Required options must load before Save. Existing omission/delete semantics remain backend-owned and are recorded if unresolved.

SMS grid: code,name,mobileNo,email,status; id required for page selection/simulation. Current typed service already suppresses inline-error interceptor, simulation is not actual SMS delivery. Selection clears on read replacement, preserves submitted IDs/message snapshot, and simulation feedback remains source-backed.

Closed grid reuses Agreement columns/ListVM and server paging. Closed route cannot submit standalone Create/Update/Delete. Existing backend transitions are untouched. No material accounting/access/destruction decision is introduced.

Phase2/3/5/6 apply; confirmed risky UI row removal/discard and settings Save use Phase4 presentation only. Backend Phase1 contract inspection only. No migration/schema/mapping/calculation change. AuthGuard remains authentication only.

## Final reconciliation

| Concern | Final source / decision | Result |
|---|---|---|
| Tariff/SMS lists | canonical route host/list shell/title/filter Reset/filled DataTable, standard page sizes, shared error/paging; SMS appliedSearch reset corrected and typed column-derived sort whitelist retained | Matches UI1/3/4/5/6/22/28; visual acceptance pending |
| Tariff aggregate | routed vehicle-type context with Create/Edit resolution and View; one typed form/four EditableRows owners; shared month validation/transport, fixed footer, selected fill collection panel, readonly numeric highlights | Matches UI13 D4-2/14/17; payload fields/IDs/ranges preserved |
| Dropdowns / validation / focus | ProtectionType options use enumOptions/enumKey/TranslateOptionsPipe and fixed180px column; branch settings column260px. Shared FieldError is sole field/month-order owner; focusField reveals internal regions; real PrimeNG ariaLabel/input IDs | Matches UI16/19/27; actual enum IDs and previous label meanings retained |
| Branch settings | complete settings and branch choices required; inline Retry; save disables parent form; confirmation/row identity guards; shared collection duplicate feedback; omitted-row snapshot semantics preserved | Matches frozen current endpoint, including known BE16 drift described below |
| Closed records | existing Agreement list/view imported by closed routes; closedOnly/listRoute guards integrated; compatibility details route remains View. Dead old components/models/service and dormant Item providers removed after consumer search | Phase5 source wiring reconciled; no standalone writer introduced |
| SMS | simulation-only endpoint unchanged, selected IDs/message snapshot retained, selection cleared on replacement, composer/grid each owns bounded internal scrolling, balanced loading and one inline failure owner | Operational exception preserved; no delivery side effect added |
| Shared integration | BaseService.getById optional skip-error options requested by Deposit context; default unchanged. UI2 + skill§6/history + UI preamble/changelog1.87 promote this verified reusable addition | Book/skill learning protocol followed. No new upload option remains: Deposit consumes existing FileField/DocumentUploadTracker whose actual validator already matches5MB |
| Locales | root reconciles EN/AR Quotation gaps, record subtitles, action names and exact-case RateType/ProtectionType aliases; static literal-key comparison passes | UI23/25 source verification; runtime language switch pending |

Complete root-owned source diffs and integration references were inspected. TypeScript/Angular parsing, local import/style/template reference checks and literal translation reconciliation are source-only; they do not certify application type compilation or rendering. Final aggregate counts/evidence and owner acceptance remain in `../LEASE_FEATURE_REVIEW.md`.

Current backend `TariffSettingService.UpdateSettingsAsync` deletes omitted branch rows from the complete snapshot. Newer BE16 ordinary settings guidance differs. This frontend handoff preserves the frozen existing endpoint/removal confirmation rather than inventing a delete API or altering destructive persistence semantics; changing that contract requires a separate owner-approved backend/settings decision. Backend source and migration boundaries remain untouched.

Shared-extraction decision: reuse shell/filter/state/field/rows/query/date/enum/focus owners. Existing confirmed DTO mapping, range/overlap validation and typed simulation transport stay feature-owned. No header-options abstraction is introduced merely to wrap identical primitive HTTP literals. Generated packets remain stale and must be regenerated/semantically reviewed by the owner; no generated edit was made. No build/test/lint/browser/database/migration/commit/push/deployment was run.
