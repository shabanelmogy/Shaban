# Data Import feature review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Requested outcome | Review `src/app/modules/Administration/DataImport` and apply the canonical Sigma screen/import patterns |
| Contract | [DATA_IMPORT_FRONTEND_CONTRACT_FREEZE.md](<DATA_IMPORT_FRONTEND_CONTRACT_FREEZE.md>) |
| Plan | [DATA_IMPORT_MAINTENANCE_EVOLUTION_PLAN.md](<DATA_IMPORT_MAINTENANCE_EVOLUTION_PLAN.md>) |

## Evidence and scope

No screenshots or videos were supplied. The authoritative evidence was the existing Angular routes/components/services/models, `ImportDataController`, `IImportDataService`, the eleven backend import request VMs, `ImportResult`, the shared CSV component, the approved shared list shell/table/action/state components, and the canonical Master/UI/Backend books. The recipe check passed for all generated packets before work. The backend working tree contained unrelated pre-existing edits; no backend file was changed for this task.

The screen type is a CSV import workspace with a complete local preview and a result/diagnostic table. It is not a CRUD list, paged server list, report or editor. The existing ImportData pipeline is a specialized import exception: it validates lookups and rows, maps entities and persists chunks, and can return partial success. No new entity, EF configuration, migration, calculation, approval or authorization contract was introduced.

The shared extraction was promoted to the owning UI6 book section and the `sigma-screen-refactor` skill, with a 2026-10-14 changelog row. Generated packets were regenerated through `Generate-SigmaRecipes.ps1` after that book change; the final `-Check` passed for PLAN-00 and PHASE-00 through PHASE-06.

## Decisions and contract comparison

| Screen | Exact CSV/grid column order | API request and response | Status |
|---|---|---|---|
| Vehicles | plateNo, fleetNo, chassisNo, carMake, carModel, branch, vehicleType, fleetType, ownership, year, engineNo, engineCapacity, interiorColor, exteriorColor, fuelTankCapacity, eTag, acrissCode, kMs, trafficFileId, purchaseDate, registrationDate, nextRegistrationDate, insuranceDate, nextInsuranceDate, insurancePolicyNo, warrantyInMonths, isActive, notes | `POST ImportData/Vehicles`, `{ vehicles }`, `ImportResult<VehicleImportVM>` | Matched; `kms` input alias retained for `kMs` |
| Staff | firstName, lastName, email, gender, dateOfBirth, dateOfJoining, mobileNo, phoneHome, phoneWork, address, city, state, zipCode, country, nationality, branch, department, role, shift, staffReportingTo, salesPersonDesignation, notes | `POST ImportData/Staff`, `{ staffs }`, `ImportResult<StaffImportVM>` | Matched |
| Suppliers | supplierName, vat, website, phone1, phone2, trn, otherDetail, contactGroup, taxExempted, fax, email, salesPerson, branch, address, city, state, zipCode, country | `POST ImportData/Supplier`, `{ suppliers }`, `ImportResult<SupplierImportVM>` | Matched |
| Companies | companyName, vat, website, phone1, phone2, debtCollector, otherDetail, isInactive, isBroker, trn, creditLimit, creditPeriod, invoicingRule, invoicingType, leaseInvoicingRule, leaseInvoicingType, rentalSalikSurcharge, rentalFineSurcharge, rentalType, leaseSalikSurcharge, leaseFineSurcharge, leaseType, tollsInvoice, salikLeaseType, salikRentalType, finesInvoice, leaseDarbSurcharge, rentalDarbSurcharge, customerWiseDiscount, taxRule, tariffCard, contactGroup, clubInvoicingCharges, isBlacklisted, emailInvoices, email, salesPerson, branch, address, city, state, zipCode, country | `POST ImportData/Companies`, `{ companies }`, `ImportResult<CompanyImportVM>` | Matched; `inActive` input alias retained for `isInactive` |
| Individual Partner | firstName, middleName, lastName, gender, contactGroup, dateOfBirth, email, website, mobileNo, phoneHome, phoneWork, address, city, state, zipCode, country, nationality, notes | `POST ImportData/IndividualPartner`, `{ individualPartner }`, `ImportResult<IndividualPartnerImportVM>` | Matched; unsupported generated `no` removed |
| Assets | title, assetType, purchaseDate, inServiceDate, detail, assetCostPrice, depreciationMethod, depreciationStartDate, openingDepreciation, residualValue, assetLifeYears, annualDepreciationRate, costCenter | `POST ImportData/Assets`, `{ assets }`, `ImportResult<AssetImportVm>` | Matched; unsupported `name`/`originalPrice` removed |
| Items | name, type, barCode, supplierItemCode, price, maximumQuantity, stockBranch, note | `POST ImportData/Items`, `{ items }`, `ImportResult<ItemImportVm>` | Matched |
| Rental Agreements | poNo, type, branch, startDate, endDate, dateAndTime, returnDateAndTime, vehiclePlateNo, makeAndModel, fuelLevel, kMs, customer, driver, additionalDriver, taxPercent | `POST ImportData/RentalAgreement`, `{ rentalAgreements }`, `ImportResult<RentalAgreementImportVm>` | Matched; `startDate/endDate` date-only, `*DateAndTime` wall-clock |
| Closed Rental Agreements | same 15 columns as Rental Agreements | `POST ImportData/Closed RentalAgreement`, `{ closedRentalAgreements }`, `ImportResult<RentalAgreementImportVm>` | Matched; creates closed records, does not close existing records |
| Lease Agreements | poNo, branch, dateAndTime, vehiclePltNo, fuelLevel, kMs, customer, driver, additionalDriver, taxPercent | `POST ImportData/LeaseAgreements`, `{ leaseAgreements }`, `ImportResult<LeaseAgreementsImportVm>` | Matched; `kms` alias retained for `kMs` |
| Closed Lease Agreements | poNo, branch, dateAndTime, vehiclePltNo, fuelLevel, kMs, customer, driver, additionalDriver, taxPercent | `POST ImportData/Closed LeaseAgreements`, `{ closedLeaseAgreements }`, `ImportResult<LeaseAgreementsImportVm>` | Matched; creates closed records, does not close existing records |

There is no backend ListVM for these screens: the displayed table is the uploaded/returned import VM collection. The shared table uses complete local arrays (`lazy=false`) and local presentation paging; it does not invent a `totalCount`, server filter or sort contract. Identity and row actions are intentionally absent.

Every grid column above uses the shared default `text` type, preserving raw preview cells and returned failed-record values without introducing a display formula. No filters, list-query keys, Create/Edit/View DTO or row-action status apply. Import is the only confirmed mutation; download template and Reset are local operations. Read-only preview state has no editable form or dirty-discard contract.

Customers, Salik, Darb and Fines remain **Deferred / Unavailable**. Their existing menu routes and CSV fields are preserved for local preview, but the current backend source has no matching ImportData endpoint and no authoritative request/response/business contract. Their old services remain out of the mutation path and are no longer provided through `LayoutModule`; no replacement endpoint was invented.

## Implemented changes

- Added `CsvImportWorkspaceComponent<T>` as the shared owner of title shell, CSV controls, explicit Import action, local table, counters, declared/HTTP failure presentation, partial-result handling, retry guidance, reset and local paging.
- Added typed `CsvRowReader` and `CsvImportResult<T>`. Numeric, integer, boolean and date/date-time cells are validated before POST; invalid nonempty cells produce row/field diagnostics instead of silently becoming zero. Date transport preserves local wall-clock values without a UTC suffix.
- Migrated eleven supported screens to thin standalone consumers with explicit typed builders and the frozen route/body contracts. Services use the root `HttpClient`, `environment.baseUrl`, typed responses, and `X-Skip-Error-Interceptor` plus `X-Skip-Success-Toast`; the workspace owns the composite feedback.
- Replaced legacy `ms-lib` `table-list`, `ListCol`, feature SCSS and copied unrelated widget specs in the supported import screens. Deferred screens now render the shared local preview without a mutation callback.
- Extended the existing shared CSV parser with `CsvRecord` output and header-only file rejection while retaining aliases.
- Added bilingual EN/AR workspace messages and fifteen Administration guide topics. The guide documents prerequisites, template/format rules, partial saves, failed rows, connection recovery, reset semantics and deferred screens.
- Removed the duplicate DataImport service provider list from `LayoutModule`; affected services are already `providedIn: 'root'` and continue to use the single interceptor-enabled client.

## Conformance evidence

| Concern | Canonical owner/reference | Target evidence | Result |
|---|---|---|---|
| Route shell/title/fill | UI1/UI3; Workshop Job list shell | shared workspace host `sigma-route-host`, `sigma-list-page`, `sigma-list-panel`, `app-feature-title` inside card, shared `.sigma-list-table` | Matched source |
| Grid | UI5/UI6; `DataTableComponent` and Job list | one `app-data-table`, `fill=true`, `lazy=false`, complete local value, shared pager/empty state | Matched source |
| CSV/upload | UI18; `ImportCsvComponent` | existing parser/template/aliases reused; no file persistence or invented upload storage | Matched source |
| Loading/errors | UI22/UI28 | `finalize`, `takeUntilDestroyed`, both declared result and HTTP error channels, retained preview/result and one feedback owner | Matched source |
| Buttons/counters | UI24; `PrimaryActionButton`, `SummaryCards` | shared primary Import action and shared slim summary cards; no feature palette | Matched source |
| Date transport | UI17; `parseDateValue`/`toApiDateTime` | required/optional date readers and explicit clock validation, no `toISOString` | Matched source |
| Translation | UI23 | new `dataImportWorkspace` and `buttonImportCsv.emptyFile` keys in EN and AR; parity check 0 missing/case differences | Matched source |
| Guide | Master7 | `UserGuide/content/data-import-topics.ts`, appended to Administration guide, `/UserGuide/administration` existing menu entry | Matched source; owner navigation acceptance pending |

Shared extraction: workspace, row reader/result and root `CsvImportService` own repeated UI, conversion and transport. Business-specific field mappings remain in their screen consumers; no second distinct import UI owner was created. UI2/UI6 and the skill/history are synchronized. Regenerated phase-02, phase-03 and phase-05 dependency fingerprints match the updated canonical blocks; all eight generated packets pass the final check. Approved reference roles and inherited CRUD/report recipes are unchanged.

## Final reconciliation

| Path | Final producer/consumer evidence | Result |
|---|---|---|
| Eleven POST paths | Per-screen service `postImportedData` → root `CsvImportService.post` → frozen route/body → `ImportDataController` | Exact paths/keys retained |
| Column/payload scope | `csvColumns` ↔ explicit `prepare` ↔ import DTO ↔ owning C# import VM | Required fields/casing/types reconciled; no tenant/audit/system identity |
| Local paging | `DataTableComponent` `lazy=false`, complete arrays, `resolveListPaging`, default15 | No API slicing invented; first resets after preview/failed-record replacement |
| Outcomes | `ImportResult.SavedRows > 0` semantics ↔ `showResult` | Full/partial/declared failure inspected; HTTP failure retains body counters/records or original preview |
| Lifetime/feedback | `takeUntilDestroyed`, `finalize`, busy/parsing/attempted guards, both skip headers | Single presentation owner; no automatic mutation retry |
| Root HTTP chain | Root screen services → root CsvImportService → AppModule interceptor-enabled HttpClient | No manual token or provider fork; authentication runtime pending |
| User guide | 15 bilingual topics → Administration guide → existing reader/sidebar `/UserGuide/administration` | Existing unrelated topics preserved; navigation/runtime pending |
| Deferred mutations | Owner explicitly deferred Customers/Salik/Darb/Fines | Preview-only, advisory, no submit callback |
| Schema/mappings/calculations | No task-owned backend changes | No migration, AutoMapper or formula change |

Phases applied: 0 discovery, 1 transport freeze, 2 local grid, 3 CSV preparation/import, 5 provider/guide integration and 6 final source reconciliation. Phase4 independent transitions is not applicable; the four existing agreement endpoints create open/closed records and do not introduce an existing-record transition.

### Responsive source matrix

| Width/condition | Arrangement/source evidence | Verification |
|---|---|---|
| Wide desktop and intermediate widths above650px | Shared container-fill shell, title/table8px inset; toolbar flex-wrap, feedback≤45% of panel; fill grid receives remaining height | Source reviewed; visuals pending |
| 650px boundary and neighbouring/intermediate widths | FeatureTitle inherits shared wrapping; CSV/action toolbar wraps with min-width0 file control; no fixed page width/viewport subtraction | Source reviewed; visuals pending |
| Narrow screens, Arabic, long diagnostics or short height | Title/action toolbar remain fixed; keyboard-accessible feedback scrolls internally; summary owner bounds/wrap and table rows/pager retain shared owners | Source reviewed; keyboard/visual acceptance pending |

Agent utilization: two inherited-model workers owned non-overlapping sets of six master-data imports and five agreement/company imports after root contract freeze. They completed edits and source findings before hitting a usage limit during their final replies. Root integrated their files, extracted common transport, completed shared/deferred UI, guide/translations/docs and reviewed final source. Parallelization reduced independent field-mapping time without overlapping file ownership. Unrelated Branches/Countries/CustomerRequests/nav/translation/guide edits that arrived during the task were preserved; no claim is made about their completion.

The user requested only currently supported mutations after the missing-contract question. Remaining unsupported APIs are deferred work, not unresolved requirements of this handoff. Owner should download current Asset and Individual templates because unsupported `name`/`originalPrice`/`no` headers are deliberately absent. Whole numbers enforce Int32 transport; decimal precision/business bounds remain backend-owned and need owner runtime acceptance.

## Verification and remaining risks

Performed: recipe `Generate-SigmaRecipes.ps1 -Check` (all packets OK), translation parity for `importData`, `buttonImportCsv`, and `dataImportWorkspace` (0 missing/case differences), direct source/route/body/VM comparisons, scoped `git diff --check`, stale legacy import searches, and review of both affected repository status/diffs. No application build, tests, lint, browser/runtime, database, migration, commit or push was run under project policy.

Owner verification remains pending: Angular compilation/template type checking, supported and deferred route loading, valid/invalid/empty CSV files, all ImportResult branches, partial persistence and connection-error recovery, duplicate prevention, Arabic/RTL, light/dark themes, keyboard focus, intermediate responsive widths, and actual authenticated API writes. The backend import controller has inconsistent `[Authorize]` coverage across existing endpoints; this review records the eleven mutation endpoints as authorization candidates and does not invent or change a permission mechanism.

No backend entity, property, nullability, max length, EF index/relationship or model snapshot changed by this task; `Add-Migration` is not required. Frontend import DTO nullability was aligned to the existing C# import VMs without changing schema.

Suggested frontend commit: `refactor(data-import): unify CSV preview and import result handling`.
Suggested documentation-layer commit for the review artifacts: `docs(data-import): record import contracts and guide coverage`.

Prohibited commands were not run: builds, tests, lint, migrations, database commands, browser/application automation, commits, pushes and deployment.

## Changed file inventory

Task-owned DataImport and shared source paths (M modified, D removed, A new). Shared `layout.module.ts`, EN/AR vocabs and `administration-guide.ts` also have task-owned edits; preserve unrelated edits in those shared files when staging. No task-owned backend files.

```text
M	src/app/modules/Administration/DataImport/ImportAssets/components/list/list.component.html
D	src/app/modules/Administration/DataImport/ImportAssets/components/list/list.component.scss
D	src/app/modules/Administration/DataImport/ImportAssets/components/list/list.component.spec.ts
M	src/app/modules/Administration/DataImport/ImportAssets/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportAssets/models/list.ts
M	src/app/modules/Administration/DataImport/ImportAssets/services/import-assets.service.ts
M	src/app/modules/Administration/DataImport/ImportClosedLeaseAgreements/components/list/list.component.html
D	src/app/modules/Administration/DataImport/ImportClosedLeaseAgreements/components/list/list.component.scss
D	src/app/modules/Administration/DataImport/ImportClosedLeaseAgreements/components/list/list.component.spec.ts
M	src/app/modules/Administration/DataImport/ImportClosedLeaseAgreements/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportClosedLeaseAgreements/models/list.ts
M	src/app/modules/Administration/DataImport/ImportClosedLeaseAgreements/services/import-closed-lease-agreements.service.ts
M	src/app/modules/Administration/DataImport/ImportClosedRentalAgreements/components/list/list.component.html
D	src/app/modules/Administration/DataImport/ImportClosedRentalAgreements/components/list/list.component.scss
D	src/app/modules/Administration/DataImport/ImportClosedRentalAgreements/components/list/list.component.spec.ts
M	src/app/modules/Administration/DataImport/ImportClosedRentalAgreements/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportClosedRentalAgreements/models/list.ts
M	src/app/modules/Administration/DataImport/ImportClosedRentalAgreements/services/import-closed-rental-agreements.service.ts
M	src/app/modules/Administration/DataImport/ImportCompanies/components/list/list.component.html
D	src/app/modules/Administration/DataImport/ImportCompanies/components/list/list.component.scss
D	src/app/modules/Administration/DataImport/ImportCompanies/components/list/list.component.spec.ts
M	src/app/modules/Administration/DataImport/ImportCompanies/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportCompanies/models/list.ts
M	src/app/modules/Administration/DataImport/ImportCompanies/services/import-companies.service.ts
M	src/app/modules/Administration/DataImport/ImportCustomers/components/list/list.component.html
M	src/app/modules/Administration/DataImport/ImportCustomers/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportDarb/components/list/list.component.html
M	src/app/modules/Administration/DataImport/ImportDarb/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportFines/components/list/list.component.html
M	src/app/modules/Administration/DataImport/ImportFines/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportIndividualPartner/components/list/list.component.html
D	src/app/modules/Administration/DataImport/ImportIndividualPartner/components/list/list.component.scss
M	src/app/modules/Administration/DataImport/ImportIndividualPartner/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportIndividualPartner/models/list.ts
M	src/app/modules/Administration/DataImport/ImportIndividualPartner/services/import-individual-partner.service.ts
M	src/app/modules/Administration/DataImport/ImportItems/components/list/list.component.html
D	src/app/modules/Administration/DataImport/ImportItems/components/list/list.component.scss
D	src/app/modules/Administration/DataImport/ImportItems/components/list/list.component.spec.ts
M	src/app/modules/Administration/DataImport/ImportItems/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportItems/models/list.ts
M	src/app/modules/Administration/DataImport/ImportItems/services/import-items.service.ts
M	src/app/modules/Administration/DataImport/ImportLeaseAgreements/components/list/list.component.html
D	src/app/modules/Administration/DataImport/ImportLeaseAgreements/components/list/list.component.scss
D	src/app/modules/Administration/DataImport/ImportLeaseAgreements/components/list/list.component.spec.ts
M	src/app/modules/Administration/DataImport/ImportLeaseAgreements/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportLeaseAgreements/models/list.ts
M	src/app/modules/Administration/DataImport/ImportLeaseAgreements/services/import-lease-agreements.service.ts
M	src/app/modules/Administration/DataImport/ImportRentalAgreements/components/list/list.component.html
D	src/app/modules/Administration/DataImport/ImportRentalAgreements/components/list/list.component.scss
D	src/app/modules/Administration/DataImport/ImportRentalAgreements/components/list/list.component.spec.ts
M	src/app/modules/Administration/DataImport/ImportRentalAgreements/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportRentalAgreements/models/list.ts
M	src/app/modules/Administration/DataImport/ImportRentalAgreements/services/import-rental-agreements.service.ts
M	src/app/modules/Administration/DataImport/ImportSalik/components/list/list.component.html
M	src/app/modules/Administration/DataImport/ImportSalik/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportStaff/components/list/list.component.html
D	src/app/modules/Administration/DataImport/ImportStaff/components/list/list.component.scss
D	src/app/modules/Administration/DataImport/ImportStaff/components/list/list.component.spec.ts
M	src/app/modules/Administration/DataImport/ImportStaff/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportStaff/models/list.ts
M	src/app/modules/Administration/DataImport/ImportStaff/services/import-staff.service.ts
M	src/app/modules/Administration/DataImport/ImportSuppliers/components/list/list.component.html
D	src/app/modules/Administration/DataImport/ImportSuppliers/components/list/list.component.scss
D	src/app/modules/Administration/DataImport/ImportSuppliers/components/list/list.component.spec.ts
M	src/app/modules/Administration/DataImport/ImportSuppliers/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportSuppliers/models/list.ts
M	src/app/modules/Administration/DataImport/ImportSuppliers/services/import-suppliers.service.ts
M	src/app/modules/Administration/DataImport/ImportVehicles/components/list/list.component.html
D	src/app/modules/Administration/DataImport/ImportVehicles/components/list/list.component.scss
D	src/app/modules/Administration/DataImport/ImportVehicles/components/list/list.component.spec.ts
M	src/app/modules/Administration/DataImport/ImportVehicles/components/list/list.component.ts
M	src/app/modules/Administration/DataImport/ImportVehicles/models/list.ts
M	src/app/modules/Administration/DataImport/ImportVehicles/services/import-vehicle.service.ts
M	src/app/modules/shared/components/import-csv/import-csv.component.ts
A	src/app/modules/UserGuide/content/data-import-topics.ts
A	src/app/modules/shared/components/csv-import-workspace/csv-import-workspace.component.html
A	src/app/modules/shared/components/csv-import-workspace/csv-import-workspace.component.scss
A	src/app/modules/shared/components/csv-import-workspace/csv-import-workspace.component.ts
A	src/app/modules/shared/service/csv-import.service.ts
A	src/app/modules/shared/utils/csv-import.ts
```

Final source comparison: all eleven supported CSV/payload/model field sets match (13/10/15/43/18/8/10/15/22/18/28); every service route matches an actual ImportDataController HttpPost. This is source comparison only, not a compile or runtime test. Final translation parity: EN209/AR209, 0 missing and 0 case-only differences. Final scoped diff whitespace check passed; no merge markers found.

## Presentation improvement — 2026-10-14

Status remains **Implemented — source-only**, owner verification pending **yes**.
Owner requested a more attractive template-download card and remaining Import
Data components. The Frozen presentation amendments in the existing plan and
frontend handoff preceded source edits. This section supplements the historical
implementation above; its API/business contracts remain unchanged.

### Changes and scope

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- `shared/components/import-csv/import-csv.component.{html,scss,ts}`: shared
  template/file cards, Bootstrap spreadsheet/upload icons, CSV format badge,
  template-column count and ordered-header disclosure; keyboard-operable
  Choose/Change file action, parsing feedback and valid-read filename. Error
  presentation uses the existing standalone StateMessage component.
- `shared/components/csv-import-workspace/csv-import-workspace.component.{html,scss}`:
  FeatureTitle subtitle, bounded setup/feedback composition, fixed Import/Reset
  toolbar with reset icon, preview heading/count, styled diagnostic disclosure
  and semantic success/partial/failure tones. Workspace TypeScript, table
  contract and import-result computation are unchanged.
- `Banking/ChequesPayables/components/import/import.component.ts`: three-line
  metadata compatibility bridge: query the existing CSV control and call its
  reset from existing clearPreview. Confirmation, Save, payload and persisted
  data remain unchanged. Receivables already re-instantiates its CSV control;
  Overtime already calls reset, so those consumers require no source edits.
- `i18n/vocabs/en.ts`, `ar.ts`: ten shared CSV keys plus workspace subtitle and
  previewCount in both languages; count parameters use double braces.
- `UserGuide/content/data-import-topics.ts`: existing common supported/deferred
  topics explain the two cards, ordered headers, Choose/Change, filename, local
  row count and Reset, without suggesting automatic saving or retry.

Shared presentation reaches fifteen Administration import routes and three
direct CSV consumers (ChequesPayables, ChequesReceivables, Overtime process).
Existing local-preview-only Customers/Salik/Darb/Fines remain deferred by the
earlier owner instruction. No new endpoint, permission, parser rule, template
value, required field or drag/drop behavior was introduced.

Initial working tree already contained the preceding Import Data implementation
and unrelated CustomerRequest/Branch/Currency/Country translation edits. These
were preserved. The full scoped tracked diff was inspected; untracked workspace
and guide sources were read in full and checked separately. Existing import
transport/payload/date conversion and backend changes were not rewritten.

### Source conformance and final reconciliation

| Concern / owning block | Actual producer/consumer evidence | Final comparison |
|---|---|---|
| Shared owner; Master5/UI6 | ImportCsvComponent and CsvImportWorkspaceComponent; fifteen shared-workspace routes + three direct consumers | One presentation owner; no feature card copies/opt-in |
| Shell/title; UI1/3 | Existing Job list shell; sigma-route-host/list-page/list-panel and FeatureTitle.subtitle | Container-fill shell/insets retained; new subtitle uses public input |
| Controls; UI18/24/27 | PrimaryActionButton.label/icon/disabled/loading/pressed, native CSV input, Papa callbacks | Existing typed CSV contract; button opens native picker; no server upload |
| Filename lifetime | ImportCsv selectedFileName signal and complete/fail/reset; workspace reset; Payable clearPreview bridge | Name appears only after valid parsing, clears on replacement/failure/reset; consumer save guards retained |
| Geometry; UI6/25/29 | Shared card SCSS:14px inset,12px gap,44px icon tile,12px radius;580px container query | Exact promoted values; logical layout, themed primary wash, long-name wrapping |
| Scroll; UI1/6 | Cards and feedback inside controls(max45%,overflow:auto); toolbar/preview outside; shared fill table | Setup/feedback has its bounded scroll owner; actions/header/pager remain fixed; no viewport-height subtraction |
| Feedback; UI22/24 | StateMessage error input; existing sigma-alert danger/warning + Bootstrap success tokens | Success/partial/failure presentation follows existing outcome, not HTTP status |
| Counters/table; UI6/24 | Existing SummaryCards slim/row/min140/max80; DataTable fill/local array | Backend counters, columns, paging and no-repeat-after-attempt guard unchanged; preview count is displayed rows, not saved rows |
| Translations; UI23 | buttonImportCsv and dataImportWorkspace in EN/AR |39 matching keys per language in touched blocks; no missing/case-only keys |
| Guide; Master7 | DATA_IMPORT_TOPICS imported by administration-guide in existing UserGuide reader | Bilingual topics updated; no reader/menu duplication; purpose/partial/deferred contracts retained |

The shared-extraction gate is satisfied by extending the existing shared CSV
owners. UI6, matching skill digest/revision row and CHANGELOG record the owner
decision and source values. Documentation repository root verified as
`F:/My Work/Shaban Documents/Shaban`. `PHASE-02-read-grid` was regenerated only
through Generate-SigmaRecipes.ps1, because it is the packet depending on UI6.
Semantic review preserved Job list/TrialBalance report reference roles and the
specialized complete-array CSV exception. Initial/final checks pass for all
eight recipes; no template/manifest edits or unrelated packet refresh needed.

### Responsive source matrix

| Range/context | Expected arrangement and evidence | Acceptance |
|---|---|---|
| Component width>580px, including intermediate desktop/dialog widths | Two equal minmax(0,1fr) card columns, independent card content; wrapping shared actions | Source traced; owner visual pending |
| Component width580px and below; test580/579 and above581 | One card column; headings/filenames/keys wrap; icon remains44px | Source traced; owner visual pending |
| Narrow320/375 viewport and long Arabic/filenames | Container breakpoint follows actual available width, logical insets; action group wraps; disclosure remains keyboard reachable | Source traced; owner visual pending |
| Short viewport / expanded long template / diagnostics | Setup region scrolls within45% cap; fixed toolbar/preview; shared table rows/pager retain their owner | Source traced; owner runtime/visual pending |
| Banking dialogs1100/1280 and Overtime760 with narrow resizing | Shared control adapts to actual container; existing EditorDialog/scroll wrappers and Save/Reset owners preserved | Direct consumers read; owner interaction/visual pending |
| Light/dark and LTR/RTL at each interval | Sigma and Bootstrap semantic tokens, logical spacing, bdi filename, native details/shared action focus | Source traced; owner visual pending |

### Verification and handoff

Phases0/1: previous business/API handoff retained, presentation scope and
compatibility amendment Frozen. Phases2/3: shared preview/control presentation
and filename metadata. Phase5: direct consumers, standalone imports, resets and
guide integration. Phase6: full scoped source diff, book/skill values, semantic
packet review, whitespace/merge-marker and translation checks. Phase4 skipped:
no domain transition. No screenshots supplied; design is governed by shared
owners/tokens, not an invented reference screen.

Bootstrap5.3.2 and installed icon CSS were inspected; all four new file/upload
icon names exist. StateMessage/FeatureTitle/PrimaryActionButton named inputs and
standalone declarations were inspected. No new runtime file/tsconfig expansion
is needed; existing runtime import paths remain. Source review is not proof of
Angular compilation, file-dialog behavior, emitted CSS budget or visual quality.

Owner checks: compile normally; download and inspect unchanged header order;
choose/change a valid file, cancel picker, invalid/empty/header-mismatch files,
Reset in workspace and direct dialogs; check partial/full/HTTP failure outcomes
and saved counters without repeating saved rows; inspect both sides of580px,
intermediate/short heights, Arabic/English, themes and keyboard access.

Agent utilization: one inherited-model `terra_worker` role (mapped terra model
not selectable) owned translations, guide, UI6/skill/changelog and generated
packet maintenance. Root owned shared source, consumer bridge, artifacts and
integration. Non-overlapping ownership allowed documentation synchronization
while root implemented; existing changes preserved. Final bounded read-only
audit of shared source/guide/consumer reset found no concrete source issue;
runtime/visual acceptance remains pending.

Backend, API, mapping, domain calculations and schema: no changes. **No migration
required.** Builds, tests, lint, browser/runtime/database verification, migrations,
commits, pushes, deployment, Graphify and Sigma MCP were not run.

Suggested commits (suggest only; preserve unrelated work):
- Frontend: `feat(data-import): improve shared template and preview controls` —
  only the paths above.
- Documentation: `docs(ui-book): record shared CSV card presentation` — UI6,
  CHANGELOG and generated Phase02; the Sigma skill/reviews remain local artifacts
  under their current ownership arrangement.

## Compiler-feedback repair — 2026-10-14

Owner reported NG5002 at import-csv.component.html:52 and cascading TS2339 for `fileName`. Applied the existing UI1 Angular17 rule: keep parsing as the first condition, put the selected-file primary `@if (...; as fileName)` inside its `@else`, and keep the empty-file fallback inside that nested block. The alias now exists only in the selected-file branch. Scope: `SiGmaAngularFrontEnd/src/app/modules/shared/components/import-csv/import-csv.component.html` only; prior card/file/parser changes preserved. No API, TypeScript, translations, style or user workflow contract changed; existing bilingual import guidance remains accurate.

Source-only verification: installed Angular `parseTemplate` reports0 syntax diagnostics; complete scoped Git diff reviewed and `git diff --check` passes. Recipe -Check green, no generated packet edit/refresh needed. Owner rebuild/runtime still pending; no build/test/lint/browser/database/migration/commit/push/deployment command run. Tier S repair uses existing shared owner and rule; no new extraction or learning rule, no subagent (single small sequential fix). Suggested frontend commit: `fix(csv-import): scope filename alias to primary if block`.

## Sidebar overlap and explicit desktop control — 2026-10-14

Status: Implemented — source-only; owner verification pending: yes. Owner reports content under the sidebar and a sidebar that does not remain closed. Frozen navigation plan: SHARED_SIDEBAR_TOGGLE_MAINTENANCE_EVOLUTION_PLAN.md; historical import API/CSV/partial-save contracts remain intact.

Source establishes a concrete overlap path: desktop configs and SidebarComponent enable hover reopening; core sidebar CSS expands the minimized rail to actual full width on hover while wrapper CSS reserves only the minimized75px. ToggleComponent releases its animating guard after300ms, permitting that expansion with the pointer still on the toggle. The active fluid container, flex-row-fluid min-width0 and existing table-wrapper overflow were inspected; no fixed-width/missing-root-minimum fix is justified by this evidence. Runtime replay is still required to prove this is the complete cause of the owner's observed screen.

Applied through the shared owner for all sidebar consumers: explicit native button replaces the logo's Metronic data-kt-toggle registration; it toggles only the existing minimize/collapse body attribute and derives active icon/aria-expanded/labels from it. Enter/Space work natively, click propagation stops, and the desktop control hides below992px through existing Bootstrap utilities. SidebarComponent clears the legacy hover flag even when a stored layout config says true, without editing storage. Light/Dark sidebar defaults use false. Core widths/offsets/transitions, RTL, mobile drawer and menu-group/pin owners remain. No DataImport route/table layout code, CSS width/margin/z-index patch, resize listener or mutation/API change was needed.

### Files changed in this repair

Under `F:/My Work/Sigma/SiGmaAngularFrontEnd/`:

- `src/app/_metronic/layout/components/sidebar/sidebar.component.ts` and `.html`.
- `src/app/_metronic/layout/components/sidebar/sidebar-logo/sidebar-logo.component.ts` and `.html`.
- `src/app/_metronic/layout/core/configs/light-sidebar.config.ts` and `dark-sidebar.config.ts`.
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`: only neutral general.minimizeSidebar/expandSidebar labels.
- `src/app/modules/UserGuide/content/shared-screen-guidance.ts`: common bilingual explicit-sidebar guidance, rendered by the existing GuideReader overview including /UserGuide/administration. No new guide/menu entry.

Documentation: UI1 Desktop sidebar minimize block, sigma-screen-refactor §6 rule7 + revision row and UI CHANGELOG synchronized; existing Data Import freeze amended; new bounded shared navigation plan frozen. Generated packets refreshed only through generator. UI1-dependent Phase00/02/03/05 fingerprints match the updated block; existing shape references and no-business/no-runtime boundaries remain. All eight generated outputs were produced by the generator and final -Check is green; no manual packet edit. Skill reuse/new rule promoted in the same task.

### Conformance and responsive source reconciliation

| Concern | Canonical / current source owner | Target result |
|---|---|---|
| State/control | UI1; existing Sidebar/Logo + core sidebar body attribute contract | One native toggle, same on/absent state; no double plugin handler or alternate store |
| Persistent minimize | Owner clarified instruction; current hover CSS + legacy cached config | Clear desktop hover globally; rail stays75px until explicit expand |
| Keyboard/label/focus | UI24/27; native button + existing btn geometry/focus utilities | type=button, aria-controls=kt_app_sidebar, expanded state and EN/AR labels; semantic icon remains decorative |
| Content / wide table | UI1/6; current app-wrapper offset, CsvImportWorkspace bounded chain and DataTable scrolling | Keep; no copied layout/sidebar widths or page scrolling |
| >=992px including intermediate desktop widths | Core wrapper/sidebar CSS, logo d-lg-flex | Expanded uses actual sidebar width; minimized rail75; both offset and width derive from existing CSS state |
| <=991.98px | Native toggle d-none, existing DrawerComponent activation | Desktop toggle hidden; mobile drawer keeps its own open/close and overlay |
| CSV card580px, title650px, short heights, long names, LTR/RTL/theme | Existing shared import/card/title/table owners | Source geometry unchanged; owner visual/interaction acceptance pending |

### Verification and handoff

Source syntax parsing reports0 diagnostics for7 touched TS files and2 templates; this is parse-only, not Angular compilation or type checking. Complete scoped sidebar/config/guide source diff and exact translation deltas against pre-task snapshots reviewed. Added labels match EN/AR; translation companion reports0 missing/case differences for those two keys. Shared-file prior edits preserved. Old toggleButtonClass/toggleState/toggleAttr bindings and the desktop hover re-enabling path are gone; remaining ToggleOptions.toggleState belongs to other plugin controls. -Check green and whitespace checks pass. No backend/mapping/entity/domain calculation/schema or migration change.

Phases0/1: scope/evidence/policy frozen; Phase5: native toggle/config integration; Phase6: source/reference/guide/packet reconciliation. Import read/preparation/mutation business phases2–4 have no contract change. No subagents used: one tightly sequential shared navigation owner, no independent implementation workstream.

Owner replay: rebuild/reload; open Import Assets/Vehicles and Customers local preview; minimize with the pointer left on the arrow/menu, expand and repeat; Tab/Enter/Space, route changes, old saved hover=true layouts, wide CSV rows and short viewport; both sides992px plus intermediate widths; Arabic/English, RTL/LTR and both themes; mobile drawer and other ordinary lists. Build/tests/lint/browser/application/database commands, migrations, commits/pushes/deployment, Graphify and Sigma MCP were not run. Source conformance does not establish final visual resolution.

Suggested frontend commit: `fix(sidebar): keep desktop minimize explicit and accessible` — stage only this repair's deltas, preserving other pending changes. Suggested documentation commit: `docs(ui-book): document explicit desktop sidebar control` — UI1, CHANGELOG and generated affected packets; local skill/reviews retain current ownership.
