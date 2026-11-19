# LeaseAgreement conformance review — 2026-10-06

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Scope: Agreement frontend only; root frozen LEASE_FRONTEND_CONTRACT_FREEZE and historical individual action freezes govern. Later action source supersedes the old discovery missing-action inventory. No new screenshots; supplied historic screenshot classifications remain preserved. Recipes stale (root drift check), canonical books govern. Backend read-only, APIs/payloads/transitions/calculation owners preserved.

## Before-edit conformance evidence

| Concern | Book | Reference file / symbol actually inspected | Shared owner | Target before edits / required correction |
|---|---|---|---|---|
| List bounds/title/filter/table | UI1/3/4/6 | Workshop/Job/components/list/list.component.html, host metadata | styles.scss sigma-route-host/list shell; FilterPanel; DataTable.fill | bespoke Lease page/panel/filter SCSS, no fill; replace |
| Routed aggregate editor | UI1/13 | Workshop/Job/components/editor/editor.component.html/scss | sigma-editor-page/panel/form/body/footer; FormSection | fixed host overlays shell; bespoke fields/footer; replace |
| Action dialog titles/state | UI13/22 | Workshop/Job/components/close-job/close-job.component.html title/subtitle/state | EditorDialog; StateMessage | number in some titles, bespoke loading/error; replace |
| Validation/dates | UI17/19/27 | close-job closeForm, calendar appDatePicker, field errors | date-utils, DatePickerDirective, FieldError, NumericFocus | readonly calendars/private parsers/manual error markup; replace |
| Editable child collections | UI14 | Job editor EditableRows; close-job invoiceRows/canEdit | EditableCollectionTable/EditableRows | main editor shared table, immediate removals/no pending lock; correct |
| Error/success/loading | UI2/22/28 | close-job service calls/save/load finalizers; Job list bindListQueries | apiErrorMessage/composedReadErrorMessage; LoadingService | inline + interceptor duplicates/private extractors; no skip headers; auxiliary global loading; correct |
| Closed subset adapter | root freeze | Agreement list buildFilters/openEditor + Details save/requestClose | same Agreement owner | root authorizes reuse with route closedOnly/listRoute; forced filter/View only |

## Implemented conformance and reconciliation

Implementation preserves the frozen contract below. The owned source diff contains 49 Agreement files (list, routed aggregate editor, action/read dialogs and their service); no model, backend, test or migration source was changed. Root owns cross-feature integration and overall closure. Owner verification remains pending.

| Concern | Canonical owner and inspected source | Final target evidence | Result / deviation |
|---|---|---|---|
| List shell, filters, bounded table | UI1/3/4/6; Workshop Job list; sigma-route-host/list shell, FilterPanel and DataTable.fill | `components/list/list.component.html` shared shell/filter/table; `.ts` paging, appliedFilters, export and query return state | Matched from source; only feature status badges remain in list SCSS |
| Paging, Search and Export | UI6/17; shared resolveListPaging, toListParams and fetchAllPages | List page-size signal/choices and page state; export uses the last applied filter snapshot; `services/leaseagreement.service.ts#getList` uses shared serialization | Matched; deliberately cleared date range survives return using the pageNo marker; new visits default to current month |
| Routed Create/Edit/View | UI13; Workshop Job editor; sigma-editor-page/form/body/footer, FormSection and EditorTabs | `components/details/details.component.html/.ts/.scss` | Matched shared shell; retained bounded two-pane aggregate composition, feature charge detail, responsive/print structure and status semantics |
| Dialog title, body, feedback and totals | UI13/22/28; Workshop close-job; EditorDialog, StateMessage and SummaryCards | Closing, DeliveryDate, Deposit, Discounts, Documents, DriverReplacement, ExtendPeriod, ExtendRatePeriod, AdditionalCharges, BillingHistory, PaymentInstructions, Logs and Void | Matched; record identifier is subtitle, feature title is stable; body/sections/controls have no copied shared appearance or alternate scroll owner |
| Typed child rows and numeric values | UI14/27; EditableCollectionTable, EditableRows and NumericFocus | Details and extension collections; shared table conversions in action/read dialogs; fixed dropdown widths and shared numeric read highlight | Matched shared mechanics; confirmation captures the actual row identity, pending confirmation locks mutation and submit |
| Field feedback and dates | UI17/19; FieldError, DatePicker, date-utils and focusField | All owned typed date controls use shared masks/validators/adapters; Deposit native date inputs removed; private generic validation mappers removed; invalid submit reveals its tab and delegates focus | Matched; field-specific business errors remain explicit overrides only when the individual control is valid; date-only/local datetime wire shapes remain unchanged |
| Stored-path Deposit attachments | UI18; actual FileUploadService/FileField/DocumentUploadTracker source | `components/deposit/deposit.component.ts/.html` component-provided tracker, shared FileField, typed document paths; finishSave/discard and Retry cleanup | Matched without shared capability exception: existing shared jpg/jpeg/png/pdf, MIME and 0<size<=5MB checks match Deposit. Save is composite, final success occurs after cleanup; a committed deposit cannot be saved again |
| Atomic Agreement document upload | UI18; FileField selectionOnly and existing service uploadDocument endpoint | `components/documents/documents.component.ts/.html` typed per-type File controls and shared table | Matched; existing atomic upload boundary remains the owner. No invented stored path or separate staged-upload cleanup owner |
| Server eligibility and read readiness | Frozen action contract; existing canClose/canExtend/canEdit fields | Closing save/primary predicate requires complete context+branch read and canClose; retry restores both reads. Both extensions require canExtend; ExtendRate requires valid lookups and gates every Add/Remove controller/template | Matched; reactive graph is disabled during writes and failed required reads; API eligibility fields were reused without new permissions |
| Failure/success/loading ownership | UI2/22/28; shared apiErrorMessage/composedReadErrorMessage, LoadingService and interceptor | Agreement service inline-owned failure headers, explicit mutation endpoints; standard mutations use interceptor success. Deposit suppresses initial success and emits one final success after successful attachment cleanup | Matched; auxiliary reads remain local, writes have shared loading, cleanup failures preserve dialog and provide Retry |
| Closed agreements subset | Root freeze; same list/detail owners | `closedOnly`/`listRoute` adapter, forced isClosed=true, View-only actions and preserved return query | Matched source; root owns route wiring. No parallel closed editor or write endpoint |

The last semantic reconciliation corrected Closing's read success branch to be explicitly braced and null-safe, made required branch lookup success part of write readiness, and applied the extension context eligibility flag consistently to all three child collections and both Save actions. Shared editor grids replace removed feature grid styling; no additional shared styles were introduced.

## Verification and handoff

- Reviewed the owned source/diff for shells, typed forms, list state, child-row callbacks, date adapters, action eligibility, upload lifecycle and asynchronous completion/error paths.
- TypeScript source parsing: 37 scoped `.ts` files, no syntax diagnostics. Angular `parseTemplate`: 16 scoped HTML templates, no parse errors. This is source syntax verification, not type checking or runtime verification.
- Scoped `git diff --check` passed. Existing component spec files have no diff. No build, tests, lint, browser, database, migration, commit, push or deployment was performed.
- Frontend read/grid, detail/write and action implementation are applied under the frozen API shapes; root owns Phase 5 integration and Phase 6 overall reconciliation. Migration required: no.
- Translation request `leaseAgreement.depositDialog.errors.cleanupAfterSave` was fulfilled by root in EN/AR; no outstanding owned translation request remains.
- Owner runtime checks: list Search/paging/sort/export and return-query restoration; Create/Edit/View and closed subset; partial typed dates and local datetime transport; child Add/Remove confirmation, required lookup failure/Retry and failed Save; RTL/themes/bounded scrolling; server-ineligible Close/Extend; Deposit upload, failed Save, discard cleanup failure, committed-save cleanup Retry and one receipt save/one final success; atomic Documents upload and validation.

Suggested commit: `refactor(lease): align agreement screens and actions with shared UI contracts`.

## Exact frozen contracts

Grid order: no, isClosed (Voided/Closed/Open badge), agreementType, poNo, vehiclePlateNo, permanentVehicle, customerName, customerCode, driverName, dateAndTime, endDate, branchName. ListVM fields below include identity/action state/branchId minimums consumed by dialogs. Filter keys remain agreementNo/manualAgreementNo/branchId/plateNo/permanentVehicle/isClosed/customerId/salesPersonId/ownership/fromDate/toDate/sortField/sortOrder. Current-month default replaces the legacy two-year UI default under UI17. All mutation methods remain explicit original service endpoints, with unchanged typed editable request fields. Create/Edit/View routed because four child collections and totals; closed route consumes same View editor and preserves query snapshot.

Actions: View/Print use detail route; Edit/DeliveryDate canEdit; VehicleReplacement canReplaceVehicle; DriverReplacement canReplaceDriver; both extensions canExtend; Close canClose; Delete canDelete; Void canVoid; Receipt/Deposit !isVoided. Documents/Discounts/AdditionalCharges/BillingHistory/PaymentInstructions/Logs retain server-owned context eligibility. Email remains informational unavailable. No permission API invented. Standard mutation success owned by interceptor; inline failure owner sends skip-error header. Calculations remain existing previews only; payload omits totals and server-owned fields.

### additional-charges.ts
```ts
export interface LeaseAgreementAdditionalChargeOptionDTO {
  chargeType: number;
  chargeTypeName: string;
  rateType: number;
  rateTypeName: string;
}

export interface LeaseAgreementAdditionalChargeDTO {
  id: number;
  date: string;
  chargeType: number;
  rateType: number;
  amount: number;
}

export interface LeaseAgreementAdditionalChargesDTO {
  leaseAgreementId: number;
  agreementNo: string;
  canEdit: boolean;
  chargeOptions: LeaseAgreementAdditionalChargeOptionDTO[];
  additionalCharges: LeaseAgreementAdditionalChargeDTO[];
}

export interface LeaseAgreementAdditionalChargesUpdateDTO {
  leaseAgreementId: number;
  additionalCharges: LeaseAgreementAdditionalChargeDTO[];
}

```

### billing-history.ts
```ts
export interface LeaseAgreementBillingHistoryDTO {
  leaseAgreementId: number;
  agreementNo: string;
  totalCharges: number;
  received: number;
  due: number;
}

```

### closing.ts
```ts
export interface LeaseAgreementCloseContextDTO {
  leaseAgreementId: number;
  agreementNo: string;
  dateTimeOut: string;
  vehicleName: string;
  fuelLevelOut: number | null;
  mileageOut: number | null;
  fuelLevelIn: number | null;
  mileageIn: number | null;
  customerName: string;
  driverName: string;
  branchInId: number | null;
  noOfMonths: number;
  bookingCharges: LeaseAgreementCloseChargeContextDTO[];
  discount: number;
  taxPercent: number | null;
  additionalChargesTotal: number;
  totalCharges: number;
  canClose: boolean;
}

export interface LeaseAgreementCloseChargeContextDTO {
  id: number;
  chargeType: number;
  isSelected: boolean;
  rate: number;
  rateUnit: string;
  totalCharge: number;
}

export interface LeaseAgreementCloseDTO {
  dateTimeIn: string;
  fuelLevelIn: number;
  mileageIn: number;
  branchInId: number;
  bookingCharges: LeaseAgreementCloseChargeUpdateDTO[];
}

export interface LeaseAgreementCloseChargeUpdateDTO {
  id: number;
  isSelected: boolean;
  rate: number;
}

```

### create.ts
```ts
import { ClauseTypeEnum } from 'src/app/_metronic/shared/enums/clauseType';
import { FuelLevelEnum } from 'src/app/_metronic/shared/enums/fuelLevel';
import { VoucherSubTypeEnum } from 'src/app/_metronic/shared/enums/voucherSubType';

export enum LeaseAgreementCustomerType {
  Self = 0,
  Staff = 1,
  Other = 2,
}

/** A client-editable booking-charge draft.  IDs are only sent on update. */
export interface BookingChargeDraft {
  id?: number | null;
  chargeType: number;
  isSelected: boolean;
  rate: number;
  rateUnit: string;
  totalCharge: number;
  included?: boolean | null;
  allowedPerDay?: number | null;
  excessRate?: number | null;
  excess?: number | null;
}

/** Only client-editable charge choices cross the write boundary. */
export interface BookingChargeSelectionDTO {
  id?: number | null;
  chargeType: number;
  isSelected: boolean;
  rate: number;
  included?: boolean | null;
}

export interface ProvisionCreateDTO {
  id?: number | null;
  voucherSubType?: VoucherSubTypeEnum | number | null;
  entryDate?: string | null;
  title?: string | null;
  dayOfMonth?: number | null;
  numberOfMonths: number;
}

export interface ClauseCreateDTO {
  id?: number | null;
  clauseTypeId: number | null;
  clauseDetail: string;
}

export interface PreTerminationRuleCreateDTO {
  id?: number | null;
  monthsFrom: number;
  monthsTo: number;
  type: LeasePreterminationTypeEnum | number;
  value: number;
}

/**
 * Add payload.  Server-owned identity, tenant/audit metadata, status, and
 * calculated totals intentionally do not appear here.
 */
export interface LeaseAgreementCreateDTO {
  dateAndTime: string;
  endDate: string;
  vehicleId: number;
  permanentVehicle: boolean;
  makeAndModelId: number;
  fuelLevel: FuelLevelEnum | number | null;
  kMs: string | null;
  customerId: number;
  customerType: LeaseAgreementCustomerType | number;
  driverId: number;
  additionalDriverId?: number | null;
  salesPersonId: number;
  notes?: string | null;
  bookingCharges: BookingChargeSelectionDTO[];
  discount?: number;
  taxPercent?: number;
  advance?: number;
  deposit?: number;
  provisions: ProvisionCreateDTO[];
  clauses: ClauseCreateDTO[];
  poNo?: string | null;
  preTerminationRules: PreTerminationRuleCreateDTO[];
}

export interface LeaseAgreementUpdateDTO extends LeaseAgreementCreateDTO {
  id: number;
}

// Kept as a named export for older consumers that imported this enum from the
// lease-agreement feature.  The API accepts the numeric enum values.
export enum BookingChargeTypes {
  Rent,
  SuperCDW,
  Mileage,
  Fuel,
  CollectionCharges,
  VMDCharges,
  RoofInsuranceCharges,
  TheftProtection,
  Other,
  TyreInsuranceCharges,
  PreTerminationPenalty,
  Extra2Charges,
  Sales,
  Discount,
  Tax,
  DeliveryCharges,
  GPS,
  DamageCharges,
  Fines,
  Tolls,
  DriverCharges,
  DriverOvertimeCharges,
  TP,
  Wifi,
  InsuranceCharges,
  Rental,
  Fine,
  Toll,
  Parking,
  Insurance,
  Damage,
  AdditionalDriver,
  YoungDriver,
  CollisionDamageWaiver,
  PersonalAccidentInsurance,
  OtherCharges,
  BabySeat = 36,
  AttachmentCharges = 37,
  FinesSurcharge = 38,
  StampDutyCharges = 39,
  RecoveryService = 40,
}

export enum LeasePreterminationTypeEnum {
  CustomerInitiated = 1,
  LessorInitiated = 2,
  MutualAgreement = 3,
  Buyout = 4,
  InsuranceTotalLoss = 5,
  AssetReplacement = 6,
}

// Legacy aliases retained only to avoid breaking imports in old templates.
export { ClauseTypeEnum };

```

### delivery-date.ts
```ts
export interface LeaseAgreementDeliveryDateContextDTO {
  leaseAgreementId: number;
  agreementNo: string;
  deliveryDate: string;
  endDate: string;
}

export interface LeaseAgreementDeliveryDateUpdateDTO {
  deliveryDate: string;
}

```

### deposits.ts
```ts
export interface LeaseAgreementDepositCreateDTO {
  date: string;
  branchId: number | null;
  amount: number;
  amountInWords: string;
  paymentMethodId: number | null;
  bankId: number | null;
  transactionNo: string;
  batchNo: string;
  lastFourDigits: string;
  expiry: string | null;
  expiryDays: number;
  detail: string;
  additionalDetail: string;
  documents: string[];
}

export interface LeaseAgreementDepositPaymentMethodDetails {
  id: number;
  type: number;
  commissionPercentage: number | null;
}

```

### details.ts
```ts
import { FuelLevelEnum } from 'src/app/_metronic/shared/enums/fuelLevel';
import { VoucherSubTypeEnum } from 'src/app/_metronic/shared/enums/voucherSubType';
import {
  BookingChargeDraft,
  BookingChargeTypes,
  LeaseAgreementCustomerType,
  LeasePreterminationTypeEnum,
} from './create';

export interface LeaseAgreementChargeSummaryDTO {
  bookingCharges: BookingChargeDraft[];
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export function createDefaultLeaseAgreementCharges(): BookingChargeDraft[] {
  const row = (
    chargeType: BookingChargeTypes,
    rateUnit: string,
    isSelected = false,
  ): BookingChargeDraft => ({
    id: null,
    chargeType,
    isSelected,
    rate: 0,
    rateUnit,
    totalCharge: 0,
    included: null,
    allowedPerDay: null,
    excessRate: null,
    excess: null,
  });

  return [
    row(BookingChargeTypes.Rent, '/Month', true),
    row(BookingChargeTypes.SuperCDW, '/Month'),
    row(BookingChargeTypes.Mileage, '/KM'),
    row(BookingChargeTypes.Fuel, '/Liter'),
    row(BookingChargeTypes.InsuranceCharges, '/Month'),
    row(BookingChargeTypes.GPS, '/Month'),
    row(BookingChargeTypes.BabySeat, '/Month'),
    row(BookingChargeTypes.DamageCharges, 'One Time'),
    row(BookingChargeTypes.Fines, 'One Time'),
    row(BookingChargeTypes.Tolls, 'One Time'),
    row(BookingChargeTypes.DriverCharges, '/Month'),
    row(BookingChargeTypes.DriverOvertimeCharges, '/Day'),
    row(BookingChargeTypes.DeliveryCharges, 'One Time'),
    row(BookingChargeTypes.CollectionCharges, 'One Time'),
    row(BookingChargeTypes.VMDCharges, '/Month'),
    row(BookingChargeTypes.RoofInsuranceCharges, '/Month'),
    row(BookingChargeTypes.TP, 'One Time'),
    row(BookingChargeTypes.Wifi, '/Month'),
    row(BookingChargeTypes.Other, 'One Time'),
    row(BookingChargeTypes.TyreInsuranceCharges, '/Month'),
    row(BookingChargeTypes.PreTerminationPenalty, 'One Time'),
    row(BookingChargeTypes.Extra2Charges, 'One Time'),
    row(BookingChargeTypes.AttachmentCharges, '/Week'),
    row(BookingChargeTypes.FinesSurcharge, 'One Time'),
    row(BookingChargeTypes.StampDutyCharges, 'One Time'),
    row(BookingChargeTypes.RecoveryService, '/Liter'),
  ];
}

export interface LeaseAgreementDetailsDTO {
  id: number;
  no?: string | null;
  isClosed?: boolean;
  isVoided?: boolean;
  invoiced?: boolean;
  totalCharges?: number | null;
  dateAndTime: string;
  endDate: string;
  poNo?: string | null;
  vehicleId: number | null;
  permanentVehicle: boolean;
  makeAndModelId: number | null;
  fuelLevel: FuelLevelEnum | number | null;
  kMs?: string | null;
  customerId: number | null;
  customerType: LeaseAgreementCustomerType | number;
  driverId: number | null;
  additionalDriverId?: number | null;
  salesPersonId: number | null;
  notes?: string | null;
  bookingCharges: BookingChargeDraft[];
  discount?: number | null;
  taxPercent?: number | null;
  advance?: number | null;
  deposit?: number | null;
  provisions: ProvisionDetailsDTO[];
  clauses: ClauseDetailsDTO[];
  preTerminationRules: PreTerminationRuleDetailsDTO[];
}

export interface ProvisionDetailsDTO {
  id?: number;
  voucherSubType?: VoucherSubTypeEnum | number | null;
  entryDate?: string | null;
  title?: string | null;
  dayOfMonth?: number | null;
  numberOfMonths: number;
}

export interface ClauseDetailsDTO {
  id?: number;
  clauseTypeId: number | null;
  clauseDetail: string;
}

export interface PreTerminationRuleDetailsDTO {
  id?: number;
  monthsFrom: number;
  monthsTo: number;
  type: LeasePreterminationTypeEnum | number | null;
  value: number;
}

export interface SelectedItem {
  key: string;
  value: string | number;
}

/** Compatibility lookup retained for existing invoice consumers. */
export interface CustomerDTO {
  id: number;
  name: string;
  displayName: string;
  no?: string | null;
}

```

### discounts.ts
```ts
export interface LeaseAgreementDiscountDTO {
  id: number;
  fromDate: string;
  toDate: string;
  discount: number;
}

export interface LeaseAgreementDiscountsDTO {
  leaseAgreementId: number;
  agreementNo: string;
  canEdit: boolean;
  discounts: LeaseAgreementDiscountDTO[];
}

export interface LeaseAgreementDiscountsUpdateDTO {
  leaseAgreementId: number;
  discounts: LeaseAgreementDiscountDTO[];
}

```

### documents.ts
```ts
export interface LeaseAgreementDocumentDTO {
  agreementDocumentId: number;
  name: string;
  hasDocument: boolean;
}

export interface LeaseAgreementDocumentsDTO {
  leaseAgreementId: number;
  agreementNo: string;
  canUpload: boolean;
  documents: LeaseAgreementDocumentDTO[];
}

```

### driver-replacements.ts
```ts
export interface LeaseAgreementDriverReplacementDriverOption {
  id: number;
  name: string;
  mobileNo: string | null;
}

export interface LeaseAgreementDriverReplacementContextDTO {
  leaseAgreementId: number;
  agreementNo: string;
  incomingDriverId: number;
  incomingDriverName: string;
  incomingDriverMobileNo: string | null;
  incomingDateTimeOut: string | null;
  outgoingDrivers: LeaseAgreementDriverReplacementDriverOption[];
}

export interface LeaseAgreementDriverReplacementCreateDTO {
  incomingDriverId: number;
  outgoingDriverId: number;
  replacementDate: string;
}

```

### extend-rate-period.ts
```ts
import { FuelLevelEnum } from 'src/app/_metronic/shared/enums/fuelLevel';
import { LeasePreterminationTypeEnum } from './create';

export interface LeaseAgreementExtendPeriodContextDTO {
  leaseAgreementId: number;
  agreementNo: string;
  customerName: string | null;
  currentDetail: LeaseAgreementExtendCurrentDetailDTO;
  newDetail: LeaseAgreementExtendNewDetailDTO;
  canExtend: boolean;
}

export interface LeaseAgreementExtendCurrentDetailDTO {
  agreementType: string;
  dateTimeOut: string;
  noOfMonths: number;
  vehicleName: string | null;
  makeAndModelName: string | null;
  fuelLevelOut: FuelLevelEnum | number | null;
  mileageOut: string | null;
  fuelLevelIn: FuelLevelEnum | number | null;
  mileageIn: number | null;
  driverName: string | null;
  additionalDriverName: string | null;
}

export interface LeaseAgreementExtendNewDetailDTO {
  dateAndTime: string;
  noOfMonths: number;
  vehicleName: string | null;
  makeAndModelName: string | null;
  currentFuelLevel: FuelLevelEnum | number | null;
  currentKMs: string | null;
  driverName: string | null;
  additionalDriverName: string | null;
  salesPersonId: number | null;
  salesPersonName: string | null;
  notes: string | null;
  bookingCharges: LeaseAgreementExtendPeriodChargeContextDTO[];
  provisions: LeaseAgreementExtendProvisionDTO[];
  clauses: LeaseAgreementExtendClauseDTO[];
  preTerminationRules: LeaseAgreementExtendPreTerminationRuleDTO[];
  discount: number | null;
  taxPercent: number | null;
  advance: number | null;
  deposit: number | null;
  additionalChargesTotal: number;
  totalCharges: number | null;
}

export interface LeaseAgreementExtendPeriodChargeContextDTO {
  id: number;
  chargeType: number;
  isSelected: boolean;
  rate: number;
  rateUnit: string;
  totalCharge: number;
}

export interface LeaseAgreementExtendProvisionDTO {
  id: number;
  voucherSubType: number | null;
  entryDate: string | null;
  title: string | null;
  dayOfMonth: number | null;
  numberOfMonths: number;
}

export interface LeaseAgreementExtendClauseDTO {
  id: number;
  clauseTypeId: number | null;
  clauseDetail: string;
}

export interface LeaseAgreementExtendPreTerminationRuleDTO {
  id: number;
  monthsFrom: number;
  monthsTo: number;
  type: LeasePreterminationTypeEnum | number | null;
  value: number;
}

export interface LeaseAgreementExtendPeriodDTO {
  currentDetail: LeaseAgreementExtendCurrentDetailUpdateDTO;
  newDetail: LeaseAgreementExtendNewDetailUpdateDTO;
  carryForwardPreviousKMs: boolean;
}

export interface LeaseAgreementExtendCurrentDetailUpdateDTO {
  fuelLevelIn: FuelLevelEnum | number | null;
  mileageIn: number | null;
}

export interface LeaseAgreementExtendNewDetailUpdateDTO {
  noOfMonths: number;
  currentFuelLevel: FuelLevelEnum | number | null;
  currentKMs: string | null;
  salesPersonId: number | null;
  notes: string | null;
  bookingCharges: LeaseAgreementExtendPeriodChargeUpdateDTO[];
  provisions: LeaseAgreementExtendProvisionUpdateDTO[];
  clauses: LeaseAgreementExtendClauseUpdateDTO[];
  preTerminationRules: LeaseAgreementExtendPreTerminationRuleUpdateDTO[];
  discount: number;
  taxPercent: number | null;
  advance: number;
  deposit: number;
}

export interface LeaseAgreementExtendPeriodChargeUpdateDTO {
  id: number;
  isSelected: boolean;
  rate: number;
}

export interface LeaseAgreementExtendProvisionUpdateDTO {
  id: number;
  voucherSubType: number | null;
  entryDate: string | null;
  title: string | null;
  dayOfMonth: number | null;
  numberOfMonths: number;
}

export interface LeaseAgreementExtendClauseUpdateDTO {
  id: number;
  clauseTypeId: number | null;
  clauseDetail: string;
}

export interface LeaseAgreementExtendPreTerminationRuleUpdateDTO {
  id: number;
  monthsFrom: number;
  monthsTo: number;
  type: number;
  value: number;
}



```

### extend.ts
```ts
/** Read-only agreement information and editable charge inputs for an extension. */
export interface LeaseAgreementExtendPeriodContextDTO {
  leaseAgreementId: number;
  agreementNo: string;
  manualAgreementNo: string | null;
  dateAndTime: string;
  noOfMonths: number;
  endDate: string;
  vehicleName: string | null;
  vehicleCurrentKMs: number | null;
  fuelLevel: number | null;
  kMs: string | null;
  customerName: string | null;
  driverName: string | null;
  additionalDriverName: string | null;
  bookingCharges: LeaseAgreementExtendPeriodChargeContextDTO[];
  discount: number | null;
  taxPercent: number | null;
  advance: number | null;
  deposit: number | null;
  totalCharges: number | null;
  canExtend: boolean;
}

export interface LeaseAgreementExtendPeriodChargeContextDTO {
  id: number;
  chargeType: number;
  isSelected: boolean;
  rate: number;
  rateUnit: string;
  totalCharge: number;
}

/** Contains only the values that the Extend Period dialog permits the user to change. */
export interface LeaseAgreementExtendPeriodDTO {
  noOfMonths: number;
  bookingCharges: LeaseAgreementExtendPeriodChargeUpdateDTO[];
  discount: number;
  taxPercent: number | null;
  advance: number;
  deposit: number;
}

export interface LeaseAgreementExtendPeriodChargeUpdateDTO {
  id: number;
  isSelected: boolean;
  rate: number;
}

```

### list.ts
```ts
export interface LeaseAgreementDTO {
  id: number;
  no: string | null;
  agreementType: string;
  poNo: string | null;
  vehiclePlateNo: string | null;
  permanentVehicle: boolean;
  customerName: string | null;
  customerCode: string | null;
  driverName: string | null;
  dateAndTime: string;
  endDate: string;
  isClosed: boolean;
  isVoided: boolean;
  canEdit: boolean;
  canReplaceVehicle: boolean;
  canReplaceDriver: boolean;
  canExtend: boolean;
  canClose: boolean;
  canDelete: boolean;
  canVoid: boolean;
  branchId: number | null;
  branchName: string | null;
}

export type LeaseAgreementSortField =
  | 'no'
  | 'poNo'
  | 'vehiclePlateNo'
  | 'permanentVehicle'
  | 'customerName'
  | 'customerCode'
  | 'driverName'
  | 'dateAndTime'
  | 'endDate'
  | 'isClosed'
  | 'branchName';

export interface LeaseAgreementListFilters {
  agreementNo?: string;
  manualAgreementNo?: string;
  branchId?: number;
  plateNo?: string;
  permanentVehicle?: boolean;
  isClosed?: boolean;
  customerId?: number;
  salesPersonId?: number;
  ownership?: string;
  fromDate?: string;
  toDate?: string;
  sortField?: LeaseAgreementSortField;
  sortOrder?: 1 | -1;
}

export interface LeaseAgreementListQuery {
  pageNo: number;
  pageSize: number;
  filters?: LeaseAgreementListFilters;
}

export interface LeaseAgreementLogDTO {
  dateTime: string;
  user: string;
  detail: string;
}

/** Shared by the existing vehicle-price report until that report owns its lookup model. */
export interface MakeAndModelDTO {
  id: number | string;
  name: string;
  makeAndModel?: string | null;
  makeAndModelId?: number | null;
}

```

### payment-instructions.ts
```ts
import { DropDownSelect } from 'src/app/modules/shared/models/dropdown-select';

export enum LeaseAgreementPaymentInstructionMethod {
  DirectDebit,
  Cheque,
}

export interface LeaseAgreementPaymentInstructionChequeDTO {
  id: number;
  paymentMethodId: number | null;
  chequeNo: string | null;
  chequeDate: string | null;
  bank: string | null;
  amount: number;
}

export interface LeaseAgreementPaymentInstructionsDTO {
  leaseAgreementId: number;
  agreementNo: string;
  canEdit: boolean;
  paymentMethod: LeaseAgreementPaymentInstructionMethod | null;
  accountType: string | null;
  accountNo: string | null;
  accountName: string | null;
  bankName: string | null;
  branch: string | null;
  branchCode: string | null;
  invoicingStartDate: string | null;
  dayOfMonth: number | null;
  ddaRefNo: string | null;
  cheques: LeaseAgreementPaymentInstructionChequeDTO[];
  paymentMethodOptions: DropDownSelect[];
}

export interface LeaseAgreementPaymentInstructionChequeUpdateDTO {
  id: number;
  paymentMethodId: number | null;
  chequeNo: string;
  chequeDate: string | null;
  bank: string;
  amount: number;
}

export interface LeaseAgreementPaymentInstructionsUpdateDTO {
  leaseAgreementId: number;
  paymentMethod: LeaseAgreementPaymentInstructionMethod | null;
  accountType: string;
  accountNo: string;
  accountName: string;
  bankName: string;
  branch: string;
  branchCode: string;
  invoicingStartDate: string | null;
  dayOfMonth: number | null;
  ddaRefNo: string;
  cheques: LeaseAgreementPaymentInstructionChequeUpdateDTO[];
}

```

### vehicle-replacements.ts
```ts
export interface LeaseAgreementVehicleReplacementVehicleOption {
  id: number;
  name: string;
  branchId: number | null;
  branchName: string | null;
  currentMileage: number | null;
  currentFuelLevel: number | null;
}

export interface LeaseAgreementVehicleReplacementContextDTO {
  leaseAgreementId: number;
  agreementNo: string;
  incomingVehicleId: number;
  incomingVehicleName: string;
  incomingDateTimeOut: string | null;
  incomingFuelLevelOut: number | null;
  incomingMileageOut: number | null;
  incomingBranchOutId: number | null;
  incomingBranchOutName: string | null;
  outgoingVehicles: LeaseAgreementVehicleReplacementVehicleOption[];
}

export interface LeaseAgreementVehicleReplacementCreateDTO {
  incomingVehicleId: number;
  incomingDateTimeIn: string;
  incomingFuelLevelIn: number;
  incomingMileageIn: number;
  incomingBranchInId: number;
  outgoingVehicleId: number;
  outgoingDateTimeOut: string;
  outgoingFuelLevelOut: number;
  outgoingMileageOut: number;
  outgoingBranchOutId: number;
  permanentVehicle: boolean;
  isReplacementForService: boolean;
  isReplacementForCollection: boolean;
  collectionCountryId: number | null;
  collectionAddress: string | null;
  replacementReasonId: number;
  notes: string;
}

```

### void.ts
```ts
export interface LeaseAgreementVoidRequestDTO {
  reason: string;
}

```
