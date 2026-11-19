# Rental Booking Create Refactor Contract

## Settings tax source and inline tax amount — 2026-10-07

| Status | Frozen |
|---|---|
| Owner verification pending | yes |

Owner clarifications supersede the initial inline-amount interpretation below: the label reads the Settings percentage (`Tax 5 %`), the box contains the calculated amount readonly, and Booking has no Optional tax choice. Frozen final contract: initialize Create/editable Edit taxPercent from settings; always refresh it from the authoritative tariff response; display defaultTaxRate in the label. View preserves saved financial snapshot calculations while the label identifies the current settings rate as explicitly requested. Remove the optional select from this screen; do not change global settings or other documents. At the Booking write boundary accept only the configured standard rate (null resolves to settings), rejecting a different requested rate even if Common IsTaxOptional=true. Use existing JournalVoucherResolver.GetTaxRatePercentAsync/ITaxPolicyService; no alternate settings query or literal rate. Round the displayed discount/tax/total at BookingService's existing two-digit boundaries with shared roundMoney/TaxSettingsService.previewTax and format the readonly amount with MoneyPipe/shared numeric appearance. The display amount is not a form/request input. The following initial interpretation is retained as historical evidence only.

The owner requests that Booking tax use Settings and that its value appear beside the tax-field title. The communicated interpretation is the calculated tax amount beside the label, retaining the percentage inside its existing readonly/optional select control. Replace the fixed15% in CalculateRentalTariffAsync with the existing injected ITaxPolicyService.GetStandardRatePercentAsync and VatPolicy percentage calculation/financial precision, matching the inspected CalculateLeaseTariffAsync source. Load TaxSettingsService alongside Booking initialization so Create gets its settings default before selecting a vehicle/tariff. Tariff replies confirm the rate while the new document control remains pristine; retain explicit optional0 choices and historical saved tax snapshots in View/Edit. Existing BookingService.ResolveTaxRateAsync remains the authoritative write gate. Round discount/tax/total previews at the existing Booking backend's two-digit boundaries and display the inline amount through the inspected standalone MoneyPipe. No client tax amount/total is sent.

| Concern | Owning block | Actual inspected source/reference | Target match |
|---|---|---|---|
| Settings rate/default | BE15 rule8, UI19 Money and tax | TaxPolicyService.GetAsync/ResolveRateAsync; TaxSettingsService.load; Lease Details ngOnInit | Existing tenant settings owners; no feature literal rate, Create default only, optional0/saved snapshots retained |
| Tariff amount/percentage | BE15 rule8 | CalculateLeaseTariffAsync/VatPolicy.CalculateTax; BookingService.ValidateAndCalculateAsync rounding | Rental tariff returns percentage as-is, shared rounded calculation and unchanged response shape |
| Inline value | UI14/19/24 | Existing sigma-field label and MoneyPipe/formatMoney | Plain inline numeric value beside label; existing control/section geometry and translated taxAmount title, no new styles |

Shape remains the routed Booking editor and existing stateful aggregate/tariff service; phases01/03/scoped reconciliation apply, grid/domain-actions/runtime wiring are unchanged. No endpoint/schema/AutoMapper/migration change or new shared guidance. No agents because the form initialization and tariff-rate correction are a small coupled fix. Recipe check: phase01 current; PLAN00/phases00/02–06 stale, use canonical blocks and leave regeneration/semantic review pending. Build/runtime/browser/database verification pending under AGENTS.md.

### Final clarified tax reconciliation

Owner follow-up: display the tax label in red. Frozen presentation adjustment: add existing shared `text-danger` to the bookingTax label only; its themed colour comes from the imported Metronic helpers/_text.scss/--bs-text-danger owner (UI24). Keep percentage source, readonly amount, calculations and other labels unchanged; no local colour/style added. Final colour reconciliation: Implemented — source-only; labelled tax heading uses the shared important/theme rule, scoped diff whitespace check and Angular template parser pass, visual acceptance remains pending.

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |

Final owner wording is implemented: settings percentage only in the label (`Tax 5 %` when positive; no suffix at zero), calculated money amount only in the readonly box, no Optional/select. Final conformance supersedes the initial interpretation table: UI19/shared TaxSettingsService initialization is joined with options/detail before Create defaults or editable Edit population; defaultTaxRate labels the field and authoritative tariff responses refresh the form's internal rate. The settings-rate/optional0 canonical UI variation is deliberately omitted under the explicit owner instruction, localized to Booking. View keeps saved amount calculations and independent printed snapshots; Create/Edit use the current settings rate. MoneyPipe is exported from the inspected shared file and registered in standalone imports; the numeric text field selects shared sigma-numeric-input appearance directly because NumericFocusDirective only matches number inputs. Existing EN Tax/AR الضريبة and taxAmount accessibility translations are reused; no new translation or field CSS.

Backend CalculateRentalTariffAsync now uses its existing ITaxPolicyService injection and VatPolicy/FinancialNumberPolicy instead of fixed15%, returning the configured percentage without multiplying it by100. BookingService uses the verified concrete JournalVoucherResolver.GetTaxRatePercentAsync method and rejects any different supplied rate; omitted rate resolves to settings. Standard configured0 remains valid, but a caller cannot bypass a nonzero configured rate even if global Optional is enabled. Other documents retain their existing Optional policy. Backend save still calculates charge subtotal, rounded discount percentage/amount, tax and total; frontend previews now match those existing positive two-digit boundaries. No tax amount/total is sent; no new endpoint/DTO/entity/AutoMapper/schema/migration.

Changed files: frontend Booking details HTML/TS; backend BookingService.cs and TariffCalculateService.cs. Reviewed complete scoped diffs in both confirmed Git repository roots, preserving earlier layout/Mileage/settlement changes. Angular template and TypeScript syntax parsers report zero errors; scoped git diff --check passes. Source search finds no fixed15% or taxRate×100 in the scoped backend and no Optional logic in the Booking template. Build/type/runtime/visual acceptance remains pending; source parsing does not certify compilation. Owner checks: configured5/other positive/0 rates, label/value before and after tariff selection, discount changes and save/reload, configured nonzero with Common Optional enabled still mandatory for Booking, tampered rate rejection, Create/Edit/View and RTL/themes. No build/tests/lint/browser/database/migrations/snapshots/Graphify/Sigma MCP/commit/push/deploy was run; no subagents for this small coupled fix. Suggested frontend commit: `fix(rental): show settings tax rate in label and calculated amount`; backend: `fix(rental): use configured mandatory tax for bookings`. Recipe regeneration/semantic review remains pending.

## Fines Surcharge omission follow-up — 2026-10-07

| Status | Frozen |
|---|---|
| Owner verification pending | yes |

The owner explicitly removes Fines Surcharge because it is absent from123.PNG. Extend the preceding Fines/Tolls omission decision to FinesSurcharge: remove it from the frontend fallback and backend options catalogue and exclude unpersisted/nonmandatory older API rows through the existing isBookingChargeVisible predicate. Retain enum38, stored rows, selected/mandatory data, other contract screens, calculation rules and API shapes. UI shape remains the routed Booking editor/shared editable collection; backend remains the existing Booking tariff/options producer. Conformance: Master2 (explicit owner content correction), UI14 (existing collection row rendering), BE3/14 (existing DTO and historical child persistence unchanged); references/shared owners are the already inspected Booking models/createDefaultBookingCharges/isBookingChargeVisible and RentalBookingChargeCatalog. No layout/shared control change, no migration or AutoMapper change. Phase03 catalogue adjustment and scoped reconciliation apply; other phases are unchanged. Recipe -Check still reports phase01 current and PLAN00/phases00/02–06 stale: canonical books govern and regeneration/semantic review stays pending. No agents: three directly related lines in a coupled catalogue/filter fix.

Final status: Implemented — source-only; owner verification pending=yes. Updated frontend models/details.ts and backend RentalBookingChargeCatalog.cs. Complete scoped diffs reviewed in both confirmed repository roots; git diff --check passes. FinesSurcharge remains only as the frontend enum identity and an exclusion condition, with the existing filter used by both options and tariff merges. It has no default entry in either producer; old saved/mandatory rows remain visible without data deletion. No API/formula/translation/schema/mapping changes or new migration. Owner compilation and Create/Edit/View/older-API runtime acceptance remain pending. No build/test/lint/browser/DB/migration/snapshot/Graphify/Sigma MCP/commit/push/deploy was run. Suggested commits only: frontend `fix(rental): omit fines surcharge from booking charges`; backend `fix(rental): remove fines surcharge from booking catalogue`. Packet regeneration and semantic review remain pending as recorded above.

## Mileage inputs and omitted screenshot rows — 2026-10-07

| Status | Frozen |
|---|---|
| Owner verification pending | yes |

The owner explicitly requests editable Allowed per Day and Excess Rate, tighter Mileage detail spacing, and removal of Fines/Tolls absent from the supplied image. This supersedes the earlier read-only Mileage snapshot and default-catalogue decisions for these elements only.

- UI shape: existing routed Booking aggregate editor with shared EditableCollectionTable. Backend shape: existing stateful Booking aggregate, explicit child snapshots and authoritative tariff calculation; no generic CRUD replacement.
- Accept the existing nullable BookingChargeInputVM fields only on Mileage: nonnegative Int32 allowance, nonnegative decimal excess rate, money rounding to two digits. ExcessRate's upper limit9999999999999999.99 comes from the existing BookingChargeConfig decimal(18,2) storage and matches RentalTariff's amount validators; use decimal-typed invariant Range at the API and the equivalent check for direct service callers. Blank/omitted inputs fall back to tariff values; explicit zero overrides them. Native number controls match the actual RentalTariff allowance/rate reference (allowance is a distance limit, not a Quantity field). Create/Edit accept input, View retains numeric badges. Keep shared 96px boxes and outside units.
- Persist Mileage input snapshots even when unselected, with IsSelected=false and TotalCharge=0: entering allowance/excess does not select or bill a charge. Existing selected/included rules remain authoritative. Changed mileage allowance affects the existing /KM formula using allowance × billable days; unchanged allowance retains the tariff's original proportional multiplier, including consolidated tariff rows. Excess Rate is a saved contract input, not an extra charge added at booking.
- Retain dirty mileage overrides and saved non-null Mileage snapshots across tariff refresh, while untouched new controls adopt refreshed defaults. Server calculation uses effective inputs, never the client's displayed total.
- Mileage-only structural gaps/start separation reduce from 7px to 2px; shared control height stays34px.
- Owner follow-up requests heavier text for every Booking Charges heading: use semantic strong for the main charge-type label only, preserving the existing shared row-check spacing, colours and details typography (UI14/24); no feature control styles.
- Remove Fines/Tolls from frontend/backend default catalogue. Filter unpersisted non-mandatory Fines/Tolls supplied by older options/tariff APIs so they do not reappear. Keep existing saved rows and mandatory tariff rows to avoid deleting historical data or changing fees silently; do not remove enum members or alter other contract screens.

| Concern | Book | Actual inspected reference/symbol | Target/shared owner |
|---|---|---|---|
| Editable mileage/validation | UI14/19/27, BE3 | RentalTariff details Mileage allowedPerDay/excessRate native controls; BookingChargeInputVM Range attributes | Typed controls, min0, allowance max2147483647/integer, FieldError; NumericFocusDirective and table inputs |
| Numeric width/units | UI14 | EditableCollectionTable __input-unit--fixed/__number96px and34px owner | Existing public shared classes, outside /Day and /KM captions |
| Calculation/persistence | BE14 | PurchaseOrderService server Recalculate before save; BookingService ValidateAndCalculateAsync/Create/Update explicit child construction | Existing service remains authority; zero unselected total and nullable tariff fallback |
| Content/order | Master2 | Owner explicit omission correction; frontend createDefaultBookingCharges/backend RentalBookingChargeCatalog Entries | Driver directly after Damage; Overtime after last Fuel item; saved historical rows retained |

Phases01/03 and scoped final reconciliation apply; grid/domain-actions/runtime wiring are unchanged. Existing recipe drift remains: phase01 current, PLAN00/phases00/02–06 require owner regeneration and semantic review; canonical blocks govern. No new schema/AutoMapper/endpoint change; no new migration. No agents: the small change shares one tightly coupled calculation and form contract. Build/runtime/browser/database checks remain pending under AGENTS.md.

### Mileage and content final reconciliation

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |

Changed frontend Booking details HTML/SCSS/TS and models/create.ts/models/details.ts; backend BookingService.cs, RentalBookingChargeCatalog.cs and BookingChargeInputVM.cs. No shared-owner/reference files changed for this follow-up. The final conformance table matches: existing96px number/34px control owners; Mileage-only2px gaps; native translated labelled numeric controls with existing FieldError/NumericFocus standalone registration; integer allowance and decimal storage validation; strong main labels; Driver immediately follows Damage and Overtime follows Driver as the last Fuel item. Fines/Tolls are absent from both default catalogues and filtered from unpersisted/nonmandatory older API rows; saved rows and enum identities remain intact.

Frontend sends allowedPerDay/excessRate only on Mileage, retaining null/zero distinctions. Saved non-null snapshots and dirty edits survive tariff refresh; the internal allowance preview helper runs independently of the UI's loading guard during row replacement. Backend consumes both fields, persists unselected Mileage with zero TotalCharge, rejects duplicate Mileage and invalid bounds, and retains tariff defaults when inputs are null. Changed /KM allowance uses the same allowance×billableDays multiplier in frontend/backend; unchanged defaults retain proportional source pricing. Existing detail projection returns both persisted values. Excess Rate remains snapshot data, without new accounting effects. AutoMapper, routes, endpoints, derived-total exclusion and state locks remain unchanged. No new migration is required; earlier snapshot-column migration requirements remain historical owner work.

Reviewed the complete scoped diffs separately in each actual repository and preserved earlier dirty work, including the unrelated pre-existing settlement-lock hunk in BookingService. Angular template parser: zero errors; TypeScript source syntax parsers: zero errors; formControlName comparison retains all32 earlier occurrences and adds only allowedPerDay/excessRate (34 total). Scoped git diff --check passes. New Range uses the decimal-typed invariant API supported by the project's net10.0 framework; syntax checks are not compilation/type/runtime certification. Existing labels/translations and direct standalone imports cover the two inputs; no new translation is needed. No unresolved business decision in this scope; generated packet drift and runtime acceptance remain pending.

Owner checks: build frontend/backend; Create/Edit enter integer allowance and decimal excess, test zero/blank/negative/fractional allowance/storage maximum feedback, update tariff dates, save/reload; verify unselected Mileage leaves booking total unchanged; inspect compact rows/heavier labels/equal boxes in desktop/narrow/RTL/both themes and View. No build/tests/lint/browser/database/migrations/snapshots/Graphify/Sigma MCP/commit/push/deploy ran. No subagents used because work was small and tightly coupled. Suggested frontend commit: `fix(rental): edit mileage inputs and refine booking charge rows`; backend: `fix(rental): persist validated booking mileage overrides` (suggestions only).

Status: Frozen for the confirmed source contract. Generated recipe packets were reported stale by `Generate-SigmaRecipes.ps1 -Check`; canonical guides were used directly.

## Owner layout alignment — 2026-10-07

| Status | Frozen — implementation authorized |
|---|---|
| Owner verification pending | yes |

Owner explicitly requests `RentalBooking/create` arranged like `LeaseAgreement/create`. This authorizes a bounded presentation adjustment in the shared Booking Create/View/Edit template and structural stylesheet. Adopt the named Lease details/charges workspace arrangement: left details at1fr with a two-column field grid and its own internal scroll; right charges at1.2fr, a bounded shared row table, four existing monetary inputs and existing summary fixed below the table. Match the reference's10px workspace gap and900px stacking breakpoint. Keep all Booking controls, charge selection/calculation handlers, document tab, routes, API/form contracts, expected advance/deposit labels, save/dirty/file behavior and independent print data. Do not copy Lease fields, contracts or reference-prefixed styles. This is UI13's routed financial editor with a bounded collection, not a business migration.

| Concern | Book | Actual inspected reference/shared owner | Target contract |
|---|---|---|---|
| Shell and workspace | UI1/3/13 | Lease details HTML/SCSS `lease-agreement-workspace`; Job routed shell; shared editor body/FormSection | Existing shared shell/footer retained; feature-owned Booking structural workspace uses reference1fr/1.2fr,10px,900px, zero-minimum flex bounds |
| Master fields | UI1/13/19 | Lease `sigma-editor-grid sigma-editor-scroll` setting2; shared FieldError | Booking's existing controls flattened into two-column scroll grid; duration retained, notes full width; actual values/validators/lookup options unchanged |
| Charges scrolling | UI14 | Lease charges-table-area and actual EditableCollectionTable `fillHeight`/`stickyHeader` public inputs | Bounded shared table frame is the only charge scroll owner; rows/columns/handlers remain;620px internal horizontal minimum retained |
| Totals | UI14/24 | Lease totals-grid and slim SummaryCards | Existing discount/tax/expected advance/deposit inputs plus existing summary under the charge table; one visible summary per selected tab; footer fixed |
| Narrow and print | UI1/13/21 | Lease900px stacked bounded panes; current Booking dedicated print template | Two shrinking stacked panes at900px; print data/template retained, structural wrappers release in print; no page-scroll or fixed viewport calculation |

Recipe check rerun: phase01 current; PLAN00 and phases00/02–06 stale. Canonical books govern; derivative regeneration and semantic review remain owner-pending. Implementation and final source checks are recorded below after the edit.

Final layout status: Implemented — source-only; owner verification pending=yes. Only Booking details HTML and structural SCSS changed. Lease reference source was not edited. The final source matches the table above:1fr/1.2fr workspace with10px gap,900px two-row stack, filled section hosts, flat two-column master scroll and bounded shared charges table with620px minimum, fillHeight/stickyHeader and100% maximum. Existing four monetary inputs and slim summary sit outside the row scroll; only the visible tab instantiates its summary (booking within charges, documents in its existing footer position). Booking's two duration cards retain their source values with public minCardWidth70 to fit the master grid cell. The inactive checkbox now has the shared checkbox-field/label arrangement. Group-specific display-contents wrappers/headings were removed to match the named flat Lease master layout.

Angular template parsing returned zero errors. Source comparison against the repository baseline confirmed all32 literal formControlName occurrences and multiplicities are preserved. Reviewed both changed source diffs, shared public inputs, bound flex/grid/scroll chains and the dedicated print block; scoped git diff --check passed. No TS, API, translations, calculations, routes or print-data changes. No build/tests/lint/browser/runtime/database/migration/snapshot/Graphify/Sigma MCP/commit/push/deploy was run. Owner acceptance remains pending for desktop/narrow/RTL/theme layout, left and right independent scrolling, visible totals/footer, charge selection/rate interactions, errors, documents and print. No new schema change is required by this layout follow-up; earlier migration decisions below remain outside this layout work.

Suggested commit subject only: `style(rental): align booking editor layout with lease agreement`.

## Scope and canonical shape

### Booking Charges presentation follow-up — 2026-10-07

#### Owner row-order correction — 2026-10-07

| Status | Frozen |
|---|---|
| Owner verification pending | yes |

User explicitly requests Driver Charges immediately beneath Damage Charges. UI14 assigns the feature its row collection/order and the shared EditableCollectionTable its presentation. The actual source owner is `models/details.ts:createDefaultBookingCharges`, consumed by `mergeDefaultBookingCharges` for Create/Edit catalogue normalization. Move only the DriverCharges catalogue entry directly after DamageCharges, retaining every type, enum value, unit, default selection and pricing/payload behavior. Existing saved View snapshots retain their historical response order. Source-only phase03 correction; other phases/backend/schema/translation changes not applicable. No agents for a one-line presentation reorder. Recipe phase01 current, other packets stale; canonical sources govern and regeneration/semantic review remain pending.

Owner also requests equal-width numeric boxes in Booking Charges. Freeze a consumer-local96px numeric-width choice through opt-in shared EditableCollectionTable `__number` and `--sigma-editable-number-width`, applied to Rate/protection excess inputs and rate/allowance/excess/total read badges. Shared owner supplies width/bounds/centering, feature retains only detail-row geometry.96px fits the minimum106px content width of the existing20% total column at620px table minimum; longer unit groups sit beside the box. Preserve source units/number formatting, field controls and existing widths outside the charge table. This extends UI14's shared numeric owner rather than adding feature input/badge CSS.

Additional owner instruction puts Driver Overtime Charges immediately beneath Fuel. Move that one existing catalogue entry, preserving type21 and `/Day`; the rest of the catalogue retains its relative order. The two order changes supersede earlier documented catalogue ordering without removing any rows. Numeric unit groups use external units and the explicit shared `__input-unit--fixed` modifier (no style-attribute selector); detail geometry0.75fr/1.25fr retains space for96px inputs and unit captions at620px. Final verification to follow.

Owner emphasizes equal alignment as well as width. Shared fixed unit groups now use grid tracks96px/54px (6px gap), with start-aligned unit captions, so `/Day`, `/Liter`, `/Incident` and `One Time` cannot shift the numeric-box position across rows. Total badges retain shared centering within their own numeric column. At the620px minimum, the Rate column's168px content and detail value pane's177.5px fit the156px group; the Total column's106px content fits its96px numeric box. All choices are presentation-only; actual desktop/narrow/RTL/theme visual acceptance stays pending.

Final owner clarification: Driver Overtime Charges belongs after the last item in Fuel's block, not immediately after the Fuel heading. This supersedes the preceding immediate-Fuel placement. Final catalogue order is Fuel → PAI → GPS → Baby Seat → Damage Charges → Driver Charges → retained Fines/Tolls → Driver Overtime Charges → Delivery/Collection/VMD/Roof/TP, followed by the existing later headings/items. Restore the existing block boundary after Tolls while retaining the requested Driver directly after Damage. This is ordered presentation of existing rows, with no new persisted category/group contract, no removed extra rows, and no pricing/selection change. Final source order/diff rechecked; only catalogue order changes after the preceding successful template/field/width checks.

Final row-order/width status: Implemented — source-only; owner verification pending=yes. Changed `models/details.ts`, details HTML/structural SCSS, and opt-in shared EditableCollectionTable SCSS; UI14/skill/history updated for the shared numeric width capability. Source checks confirm DriverCharges immediately follows DamageCharges and DriverOvertimeCharges immediately follows Fuel, with all25 catalogue entries retained. Angular parseTemplate reports zero errors and all32 formControlName occurrences/multiplicities remain unchanged. Reviewed the complete scoped frontend diffs; git diff --check passed. Six numeric input/read positions select shared96px width; unit captions remain outside the boxes. No backend/DTO/enum-value/format/calculation/selection/translation/document/print-data changes, no migration. Owner visual/input/RTL/theme/Create/Edit acceptance pending. No build/test/lint/browser/DB/migration/Graphify/Sigma MCP/commit/push/deploy run. Suggested frontend commit only: `style(rental): reorder driver charges and unify numeric widths`.

| Status | Frozen |
|---|---|
| Owner verification pending | yes |

Owner requests better Booking Charges spacing/alignment and checkbox colour, then supplies `C:/Users/user/Desktop/123.PNG` as the functional reference (English/LTR; capture version, date, role and viewport Unknown). Scope is the shared Booking editor's charge cells, column configuration and shared unit presentation only. Preserve the catalogue, selection eligibility/locks, typed form, calculations, payloads, tariff loading, totals, documents and print.

| Image evidence | Classification | Source and implementation decision |
|---|---|---|
| Charge Type, Rate with unit, Charges | Explicit | Existing `chargeType`, `rate`/`rateUnit`, `totalCharge`; retain three columns, balance public fixed column widths 50%/30%/20% within existing620px scroll minimum |
| Selectable row checkbox; Mileage Included | Explicit | Existing selectableChargeTypes/selection locks and Included handlers; use native reactive checkbox with existing shared15px primary accent and34px row-check label, preserving visible conditions and disabled state |
| Mileage Included/Allowed/Excess breakdown | Explicit | Existing included/allowedPerDay/excessRate snapshots; align labelled detail rows; allowance/excess remain read-only according to current contract, since the image does not prove their editability. Correct Allowed's display unit to `/Day` and Excess to `/KM` per screenshot and field semantics, rather than using the main rateUnit for both. Retain the current raw unit-string convention; main pricing denominator still comes from source |
| Rent, Super CDW, Mileage, Fuel, PAI, GPS, Baby Seat, Damage, Driver/Overtime, Delivery/Collection, VMD, Roof/TP, Other, Tyre, Pre-Termination, Extra2, Attachment, Stamp Duty, Recovery | Explicit | Existing catalogue labels/types/units retained; current extra rows absent from the image are retained as required by Master2 |
| Teal checkbox and underline inputs | Visual only | Canonical Sigma primary/native checkbox, shared inputs and blue numeric badges own appearance; do not copy image palette/chrome |

| Concern | Book | Actual reference/shared symbol | Frozen target |
|---|---|---|---|
| Three cells/headers | UI14 | EditableCollectionTable colgroup/column.width; Job item Price/Charges cells | Public fixed percentages with centered numeric headings/read values; no table cell overrides |
| Choice spacing/colour | UI14/24/25 | Shared native checkbox and `__row-check`15px/6px/34px | Adopt existing shared label and primary accent; native template reference passes checked boolean to unchanged handlers |
| Charge detail arrangement | UI1/14 | Existing Booking detail rows and shared field/value/input owners | Feature owns only two-column detail geometry; labels and corresponding values align; errors remain under their own input |
| Rate/unit spacing | UI14 | Shared34px input and numeric value owners | Opt-in shared input/unit wrapper with shrinking input,6px gap and muted non-error unit; existing consumers unchanged |

No backend/API/calculation/schema work is required. No agents: this is a small, tightly coupled presentation change. Canonical phase03 followed source-only; phase01 business contract unchanged and phase02/04/05 skipped as unrelated. Final checks follow below.

Final charge presentation status: Implemented — source-only; owner verification pending=yes. Changed Booking `details.component.html`/`.scss` and only `chargeColumns` in `.ts`, plus opt-in shared EditableCollectionTable unit classes. UI14 and the screen-refactor skill/revision history document the reusable unit owner in the same task. Final conformance matches the frozen table: shared15px primary native checkboxes,34px row labels, fixed50/30/20 columns,6px shared input/unit gap, muted isolated unit text, and aligned7px/8px structural detail gaps. Existing choice conditions, locks, readonly expressions and handlers are retained; native refs supply booleans and attr.disabled preserves DOM disablement without changing FormControl state. The complete scoped frontend diffs were reviewed, including previous owner layout changes preserved in the working tree. Angular parseTemplate returned zero errors; all32 formControlName occurrences/multiplicities match the repository baseline; git diff --check passed. CheckboxModule remains used by the inactive/document controls. No changes to catalogue, DTOs, backend, mappings, calculations, validators, routes, translations, documents or print data; no migration needed.

Owner verification: confirm desktop/narrow three-column alignment and internal horizontal scrolling, selection and Included behavior, locked/read-only states, rate/excess entry and feedback, Mileage units, RTL and both themes. Browser/runtime/compilation remain pending. No build, tests, lint, browser automation, database, migration, snapshots, Graphify, Sigma MCP, commit, push or deploy was run. Suggested frontend commit only: `style(rental): align booking charge controls and units`. Recipe regeneration/semantic review remains pending from the recorded drift check.

- Scope: the routed Rental Booking create/view/edit editor because all three routes share `DetailsComponent`.
- UI shape: canonical routed full-page detail editor with one typed parent form, approved shared section/tab/editable-collection components, a bounded charges collection, a separate Documents peer tab, and a footer outside the form content.
- Backend shape: existing stateful Booking aggregate with overridden create/update validation and server-owned tariff calculation. The charge-detail addendum extends the persisted child snapshot while leaving client write inputs unchanged.

## Functional evidence

| Screenshot evidence | Classification | Frozen decision |
|---|---|---|
| Booking type, pickup/drop-off dates and branches, duration | Direct visible content; source-confirmed | Keep typed required controls and calculated duration display. |
| Vehicle type, optional vehicle, make/model, inactive flag | Direct visible content; source-confirmed | Keep existing option contracts. Selecting a vehicle continues to populate its model. |
| Customer, Self/Staff/Other, driver, additional driver, sales person, sale origin, notes | Direct visible content; source-confirmed | Present customer type as the screenshot radio choice using the existing enum; keep canonical searchable dropdowns for lookups. |
| Charge selection, rates, units, totals, discount, tax, advance, deposit | Direct visible content; source-confirmed | Render tariff rows returned by the backend. Send only selected charge types and editable inputs; backend remains calculation owner. |
| Documents and Add | Direct visible content; source-confirmed | Keep the existing typed document collection in a peer tab and move Add to the enclosing section action. |
| Other pickup/drop-off location checkboxes | Visible but contract missing | Do not add: no API field, persistence rule, or address/lookup behavior exists. |
| Separate lookup-search buttons | Visual interaction hint only | Use existing filterable canonical dropdowns; do not invent lookup dialogs. |
| Print and Email on an unsaved booking | Static action evidence only; Email contract missing | Preserve print for a persisted booking. Do not invent unsaved-print or email workflow/API. |
| Screenshot-specific charge groups/rows | Visible example data only | Do not hard-code rows. Active tariff configuration determines available charges. |

## Frozen write contract

`BookingCreateDTO` / `BookingAddVM` client inputs:

`type`, `pickUp`, `pickUpLocationId`, `dropOff`, `dropOffLocationId`, `vehicleTypeId`, `inactive`, `vehicleId`, `makeAndModelId`, `customerId`, `customerType`, `driverId`, `additionalDriverId`, `salesPersonId`, `saleOriginId`, `discount`, `advance`, `deposit`, `taxPercent`, `notes`, `charges[{chargeType,isSelected}]`, `documents[...]`.

Update adds only `id`. Rates, charge totals, duration, tax amount, discount amount, grand total, status, booking number, and action state are not trusted from the client.

## Validation and actions

- Required: type, pickup/drop-off, both branches, vehicle type, customer, customer type, and primary driver.
- Drop-off must be after pickup.
- Additional driver must differ from the primary driver.
- Document expiry cannot precede issue date.
- At least one tariff-provided charge must be selected.
- Save remains available while editing and surfaces validation when pressed; it is disabled only during an in-flight or dependent tariff request.
- Update is allowed only when backend `CanEdit` is true / status is New.
- Dirty Cancel uses the shared confirmation dialog.
- Global success handling owns the single success toast; the component handles `isSuccess: false` and HTTP errors.

## Integration and persistence

- Routes remain `/RentalBooking/create`, `/view/:id`, and `/edit/:id`.
- Existing Booking and Tariff endpoints remain unchanged.
- AutoMapper remains unchanged; aggregate children and calculated fields are explicitly owned by `BookingService`.

## Booking Charge Details addendum

Status: Frozen from the split Booking screenshots plus the existing Rental Tariff contract.

- The Booking charge collection must retain the tariff detail needed by the visible Mileage breakdown: `included`, `allowedPerDay`, and `excessRate`.
- Protection excess is retained as `excess` because it is already part of the same source tariff contract, even though this screenshot does not expose a separate protection sub-row.
- These values are server-derived snapshots. They are returned by tariff calculation and Booking detail reads, copied into persisted `BookingCharge` children, and never accepted through `BookingChargeInputVM`.
- Rent and tariff rows marked Included remain selected on the backend even if a client omits them. This repeats the business invariant at the write boundary.
- Negative rate, total, allowance, excess-rate, or excess values are rejected before the calculated charge snapshot is persisted.
- The charge table uses the canonical editable-collection projection contract: the shared component owns each `<tr>` and the feature projects only typed `<td>` cells.
- Mileage displays Included, Allowed per Day, and Excess Rate below the main charge row while generic charge rows retain the common rate/unit/charge presentation.
- The special charge-type catalogue and other screenshot-specific cases are outside this addendum and remain unchanged until their individual contracts are supplied or source-confirmed.

This addendum changes the `BookingCharge` entity/configuration and therefore requires an owner-generated EF migration. Migration and model-snapshot files remain outside the implementation boundary.

## Booking charge catalogue addendum

Status: Frozen from the complete split Add New Booking screenshots and the current Booking options/tariff flow.

- The create editor displays the complete booking-charge catalogue as soon as Booking options load. Vehicle type and tariff selection are not prerequisites for rendering the rows.
- The backend owns the primary catalogue contract through `BookingOptionsVM`. The frontend also carries the same typed fixed catalogue as a compatibility fallback because the create screen must render all rows before Vehicle Type selection even when the currently running API omits `bookingCharges` or returns an empty collection.
- Catalogue order and units follow the supplied screenshot: Rent `/Day`; Super CDW `/Day`; Mileage `/KM`; Fuel `/Liter`; PAI `/Day`; GPS `/Day`; Baby Seat `/Day`; Damage Charges `One Time`; Fines `One Time`; Tolls `One Time`; Driver Charges `/Day`; Driver Overtime Charges `/Day`; Delivery Charges `One Time`; Collection Charges `One Time`; VMD Charges `/Day`; Roof Insurance Charges `/Day`; TP `One Time`; Other `One Time`; Tyre Insurance Charges `/Month`; Pre-Termination Penalty `One Time`; Extra 2 Charges `One Time`; Attachment Charges `/Week`; Fines Surcharge `One Time`; Stamp Duty Charges `One Time`; Recovery Service `/Liter`.
- `InsuranceCharges` remains the persisted enum value for the screenshot's PAI row. The Booking-specific label is PAI. Rental CDW tariff rows map to `SuperCDW`; `DamageCharges` remains the separate one-time catalogue row.
- Missing enum members are appended after all existing values: `BabySeat`, `AttachmentCharges`, `FinesSurcharge`, `StampDutyCharges`, and `RecoveryService`. Existing enum numeric values are unchanged.
- Rental tariff calculation overlays calculated values and source details onto matching catalogue rows, consolidates each charge type into one visible row, and retains unmatched catalogue rows with zero rate/charge values. The frontend repeats the merge for compatibility with older partial tariff responses. Calculated types outside the baseline catalogue remain available after the baseline rows.
- Rent remains selected and locked. Tariff-included rows remain selected and locked. Other zero/default rows remain unselected until the user selects them.
- Invalid or unavailable tariff responses leave the options catalogue visible and surface the existing tariff error. They no longer clear the charge collection.
- Create uses the options catalogue immediately. Editable existing bookings merge their saved charge snapshots over the current catalogue; read-only view continues to show the saved historical rows.
- Create/update payloads remain `charges[{chargeType,isSelected}]`; rates, units, totals, catalogue membership, and tariff details remain server-owned.
- A valid active tariff remains required to save. The zero/default catalogue is presentation and selection context, not a fallback pricing authority.
- No new endpoint is introduced. Existing Booking options and Tariff booking-charge endpoints are extended compatibly.
- Appending enum values does not itself require a schema migration. The previously frozen nullable `BookingCharge` snapshot columns still require the owner-generated migration described above.
