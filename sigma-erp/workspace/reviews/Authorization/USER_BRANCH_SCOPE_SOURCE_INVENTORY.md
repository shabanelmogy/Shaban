# USER_BRANCH_SCOPE_SOURCE_INVENTORY

| Status | Owner verification pending |
|---|---|
| Draft | yes |

## Scope and evidence

This is a source-only inventory for the frozen branch-access contract. I read
`AGENTS.md`, `.agents/SIGMA_WORKFLOW_RULES.md`, and
`reviews/Authorization/USER_BRANCH_ACCESS_IMPLEMENTATION_CONTRACT_FREEZE.md`.
The scoped source is `SigmaBackend/SiGma.Helpers/Models`, the matching EF
configuration under `SiGma.DataAccess/Configuration`, and directly related
service/query code under `SiGma.Business`, `SiGma.Repos`, and `SiGma.DataAccess`.
No build, test, database, migration, browser, commit, or source-code write was
run. The inventory is evidence for the root agent; it does not freeze a new
business exception.

## Immediate implementation findings

* `SiGmaDbContext.OnModelCreating` has no branch `HasQueryFilter`; only tenant
  concurrency is configured there. `Repository.Query`/`Find*` add tenant and
  soft-delete predicates, while `QueryReport<T>` builds those predicates with
  `EF.Property` and has no branch predicate. A branch registry must therefore be
  explicit and must cover report/direct-context paths as well as the repository.
* `JournalVoucher.BranchId` is a header dimension and
  `JournalVoucherDetail.BranchId` is a line dimension. The resolver only fills a
  null line from the header (`JournalVoucherResolver.cs:316-316, 384-384`); it
  does not force equality. `JournalVoucherService` and settlement/report code
  repeatedly use `detail.BranchId ?? detail.JournalVoucher.BranchId`. Header and
  detail can therefore be different branches; a header-only filter/guard is
  insufficient.
* `StockTransfer.BranchId` is the destination branch. Each
  `StockTransferItem.BranchId` is the source branch. `StockTransferService` checks
  both sets of IDs and rejects source == destination
  (`StockTransferService.cs:283-297`). A transfer write needs transaction access
  to every source branch and to the destination. Existing void-removal balance
  code groups by the header destination (`:272-276`), unlike `SourceShortage`
  (`:262-267`), so this is an existing semantic risk rather than permission
  evidence.
* `Booking` and `TransportationAgreementItem` each have two branch FKs
  (`PickUpLocationId`/`DropOffLocationId`) and no owning `BranchId`. Lease vehicle
  replacement has `IncomingBranchOutId?`, `IncomingBranchInId`, and
  `OutgoingBranchOutId`; the service writes incoming/outgoing vehicle branch
  ownership and creates collection/delivery movements in one transaction. These
  are multi-edge operations, not ordinary single-branch rows.
* `QueryReport` and several report/list services read the context directly. The
  most important examples are `DashboardService`, `BusinessReportsService`,
  `CollectionMovementService`, `DeliveryMovementService`, `CustodyMovementService`,
  `NRMService`, and `VehicleReportsService`. They currently carry tenant and
  soft-delete predicates but no user branch scope. Dashboard groups vehicles and
  open agreements by `Vehicle.BranchId`; BusinessReports groups `Invoice.BranchId`
  and `PaymentDetail.Payment.BranchId`.
* There is no SQLite provider or `UseSqlite` in the backend; `SiGmaDbContext`
  configures SQL Server. No branch implementation should rely on SQL Server-only
  functions if a lightweight/SQLite verification context is later added.

## Direct branch-bearing roots

The following are the explicit model properties found under
`SiGma.Helpers/Models` (or the same namespace root) and the real EF ownership
path. “Branch-attributed” means the source uses the value to select or validate
operational/financial data. Nullable data is not treated as an implicit grant.

| Entity (file) | Property/FK and nullability | EF evidence / classification |
|---|---|---|
| `Branch` | n/a (tenant-owned branch root) | `BranchConfig` maps `Branch`; this is the authorization/reference root, not a current-branch-filtered operational row. |
| `DeliveryNote` | `BranchId?`, `Branch` | `DeliveryNoteConfig` explicit restrict FK; operational document, branch-attributed. |
| `Equipment` | `BranchId?`, `Branch` | No explicit branch config (convention FK); `EquipmentService`, invoice and sale-preparation paths read/write it; branch-attributed, null = unassigned/unknown. |
| `Partner` | `BranchId?`, `Branch` | `PartnerConfig` explicit restrict FK. Branch is inherited by `Contact`, `Company`, `MemberPartner`, `Staff`, `Driver`, `IndividualPartner`, `PersonBase`, `Customer`, and `Supplier` through TPT tables. Customer service exposes `branchId` filtering. Treat as branch-attributed; source does not prove that null is shared. |
| `PaymentMethod` | `BranchId?`, `Branch` | Convention FK; a null branch is explicitly accepted as shared in payment/refund validation, while non-null methods must match the document branch (`CustomerDepositService` refund check; `PaymentService.Approval`). |
| `Quotation` (`SiGma.DataAccess.Models`) | `BranchId?`, `Branch` | `QuotationConfig` explicit restrict FK; DbSet property is commented but assembly configuration maps the type and services use it. Branch-attributed. |
| `User` | `CurrentBranchId?`, `CurrentBranch` | `UserConfig` makes `CurrentBranchId` a concurrency token; this is a preference/default pointer, not the grant source. |
| `UserBranchPreference` | `BranchId` required, `Branch` | `UserBranchPreferenceConfig` restrict FK and unique tenant/user index; current top-bar preference only. Existing `CurrentBranchService` reads any active branch and writes the preference without grant validation. |
| `UserBranchAccess` | `BranchId` required, `Branch`; `UserId` | `UserBranchAccessConfig` composite tenant FKs, active unique tenant/user/branch index, `CanTransact ⇒ CanView`; this is the grant table and must remain available to the authorization evaluator. |
| `CurrencyRevaluation` | `BranchId?` | `CurrencyRevaluationConfig` explicit restrict FK; source session dimension and immutable/cutoff owner. |
| `CurrencyRevaluationLine` | `BranchId?`, `Branch` | Explicit restrict FK; persisted contribution snapshot. `SiGmaDbContext.Revaluation` uses line branch, falling back to the JV header branch for cutoff checks. |
| `OpeningBalanceAccount` | `BranchId?`, `Branch` | Convention FK; opening-balance source row. |
| `OpeningBalanceCostCenter` | `BranchId` required, `Branch` | Explicit restrict FK and composite uniqueness includes `BranchId`; branch-attributed source row. |
| `RentalQuotation` | `BranchId` required, `Branch` | `[ForeignKey("Branch")]`; conventional FK (no explicit config); branch-attributed. |
| `CardTransactionBankTransfer` | `BranchId?`, `Branch` | Convention FK; service validates branch/payment method and writes generated JV. |
| `CashDeposit` | `BranchId?`, `Branch` | Convention FK; cash-deposit service validates the header and child source lines. |
| `CustomerDepositUsage` | `BranchId?`, `Branch` | `CustomerDepositUsageConfig` explicit restrict FK; usage can be separately attributed from its deposit/receipt. |
| `PDCPayable` / `PDCReceivable` | `BranchId?`, `Branch` | Configurations explicitly map restrict FKs; branch is part of the PDC financial document. |
| `TripBooking` | `BranchId?`, `Branch` | Convention FK; limousines operational document. Its pickup/drop-off are `Location`, not `Branch`. |
| `CollectionMovement` | `BranchInId?`, `BranchIn` | Convention FK (config only calls `ToTable`); incoming endpoint. |
| `DeliveryMovement` | `BranchOutId?`, `BranchOut` | Convention FK; outgoing endpoint. |
| `CustodyMovement` | `BranchId` required, `Branch` | Convention FK; vehicle custody movement. |
| `NRM` | `BranchId?`, `Branch` | Convention FK; non-rental movement. |
| `GoodsReceivedNote` | `BranchId?`, `Branch` | Convention FK; purchasing document. |
| `PurchaseOrder` | `BranchId?`, `Branch` | Convention FK; purchasing document. |
| `PurchaseRequest` | `BranchId?`, `Branch` | `PurchaseRequestConfig` explicit restrict FK; purchasing document. |
| `PurchaseReturn` | `BranchId?`, `Branch` | Convention FK; supplier return document. |
| `TariffSetting` | `BranchId` required, `Branch` | `TariffSettingConfig` required restrict FK and tenant/branch index; branch policy/configuration, not global reference. |
| `Item` | `StockBranchId?`, `StockBranch` | Convention FK; stock ownership dimension. Do not confuse with transaction line `BranchId`. |
| `ItemIssue` / `ItemReturn` | `BranchId?`, `Branch` | Explicit restrict FK plus tenant/branch indexes; stock transaction. |
| `StockTransfer` | `BranchId?`, `Branch` | Explicit restrict FK; header destination branch. |
| `StockTransferItem` | `BranchId?`, `Branch` | Convention FK; line source branch. |
| `Vehicle` | `BranchId?`, `Branch` | Convention FK; `VehicleService` and rental/lease/report queries filter/order by vehicle branch and replacement writes mutate it. Operationally branch-attributed, not a shared catalogue. |
| `VehicleQRLabel` | `BranchId?`, `Branch` | Convention FK; service loads branch options and labels a vehicle. |
| `AccrualRunLine` | `BranchId?`, `Branch` | Explicit restrict FK; persisted accrual branch. |
| `AmortizationSchedule` | `BranchId` required, `Branch` | Explicit restrict FK; branch is part of schedule source. |
| `AmortizationRunLine` | `BranchId` required; **no Branch navigation/FK config** | Scalar branch snapshot only. The owning path is `AmortizationRunLine.Schedule.BranchId`; services also project `Bill.BranchId`/`JournalVoucher.BranchId`. Do not use a generic navigation-based rule without this explicit scalar entry. |
| `Bill` / `CreditNote` / `DebitNote` | `BranchId?`, `Branch` | Convention FKs; financial document roots. Their detail/allocation children inherit the document branch through explicit parent paths below. |
| `InvoiceBase` | `BranchId?`, `Branch` | TPT base table (`InvoiceBaseConfig`); derived `Invoice`, `LimousineInvoice`, `EquipmentRentalInvoice`, `MiscellaneousInvoice`, `TaxAdvanceInvoice`, and `TransportationInvoice` inherit the branch column. |
| `JournalVoucher` | `BranchId?`, `Branch` | Header branch; details can override per line. `JournalVoucherConfig` does not add a branch FK explicitly (convention). |
| `JournalVoucherDetail` | `BranchId?`, `Branch` | Line branch; `JournalVoucherDetailConfig` does not add a branch FK explicitly (convention). |
| `Payment` / `Receipt` | `BranchId?`, `Branch` | Convention FKs; payment/receipt financial roots and generated JV owners. |
| `RentalInvoiceItem` | `BranchId?`, `Branch` | Explicit restrict FK; persisted invoice-line branch snapshot can differ from current vehicle/parent state. |
| `SaleOrder` | `BranchId?`, `Branch` | Convention FK; sales/equipment-rental document root. |
| `WorkOrder` | `BranchId?`, `Branch` | Convention FK; workshop order. |

### Scalars that look like branches but are not FK ownership

* `QrLabel.Branch` is an `int` scalar with no navigation and no FK mapping in
  `QrLabelConfig`; the generic `QrLabelService` CRUD treats it as an opaque
  field. Its branch-ID semantics are **Unknown**, so no registry rule may infer
  that it is the same as `BranchId`.
* `LeaseAgreementPaymentInstruction.Branch` and
  `StaffBankAccount.Branch` are nullable strings plus optional branch-code/text;
  they are payment/bank display snapshots, not branch foreign keys.

## Child and inherited owner paths

These children have no own branch FK and must be filtered/guarded through the
listed owning path. Children with their own branch FK remain direct roots above,
even when they also have a parent.

| Child | Owning branch path(s) |
|---|---|
| `Contact`, `Company`, `MemberPartner`, `Staff`, `Driver`, `IndividualPartner`, `PersonBase`, `Customer`, `Supplier` | inherited `Partner.BranchId` (TPT; tenant/live columns are on `Partner`, as noted in `CompanyConfig`/`SupplierConfig`). |
| `RentalQuotationItem` | `RentalQuotation.BranchId`. |
| `PurchaseRequestDetail` | `PurchaseRequest.BranchId`; item-requisition source is a separate upstream document and must not be guessed as a branch. |
| `PurchaseOrderDetail` | `PurchaseOrder.BranchId` **or** `PurchaseRequestDetail → PurchaseRequest.BranchId` depending on the populated source FK; service provenance is per-line. |
| `GoodsReceivedNoteDetail` | `GoodsReceivedNote.BranchId` and, when sourced, `PurchaseOrderDetail → PurchaseOrder.BranchId`; both source paths are present in the model. |
| `BillDetail` | `Bill.BranchId`; source links (`GoodsReceivedNote`, `PurchaseOrderDetail`) are additional provenance, not a replacement for the bill owner. |
| `BillInstallmentPayment`, `BillLoanDownPayment`, `BillApprovalLog`, `LoanPaymentPlan`, `LoanScheduleRevision` | `Bill.BranchId` through their `Bill` navigation. |
| `CreditNoteDetail`, `CreditNoteAccountDetail`, `CreditNoteAllocationDetail`, `CreditNoteApprovalLog` | `CreditNote.BranchId`; `CreditNoteDetail` may also link an `InvoiceBase`/`DeliveryNote`, which is source provenance. |
| `DebitNoteDetail`, `DebitNoteAllocationDetail`, `DebitNoteApprovalLog` | `DebitNote.BranchId`; linked `Bill` is provenance. |
| `PaymentDetail`, `PaymentApprovalLog`, `BillInstallmentPayment.Payment`, `BillLoanDownPayment.Payment` | `Payment.BranchId` through `Payment`. |
| `ReceiptAllocationDetail`, `ReceiptApprovalLog`, `CashDepositDetail.SourceReceipt`, `CustomerDeposit.Receipt`, `PDCReceivable.Receipt` | `Receipt.BranchId` through the receipt navigation. `CustomerDepositUsage` also has its own nullable `BranchId` and must use it when present. |
| `JournalVoucherApprovalLog`, `JournalVoucherAllocation` and other JV-owned children | `JournalVoucher.BranchId`; `JournalVoucherDetail` is an exception with its own effective branch (`detail.BranchId ?? JournalVoucher.BranchId`). |
| `RentalInvoiceItem` | Has direct `RentalInvoiceItem.BranchId`; do not substitute `Invoice.BranchId`. |
| `StockTransferApprovalLog` | `StockTransfer.BranchId` (destination) and the transfer's line source branches for movement authorization. |
| `ItemIssueItem`, `ItemReturnItem`, stock requisition lines | owning transaction branch (`ItemIssue.BranchId` / `ItemReturn.BranchId` / requisition branch); `Item.StockBranchId` is a separate stock-owner reference. |
| `TripBookingHistory` | `TripBooking.BranchId`; `Vehicle.BranchId` is an additional operational resource dimension. |
| `BookingHistory`, `BookingCharge`, `CustomerDeposit` children of `Booking` | Booking has no own branch; use both `Booking.PickUpLocationId` and `Booking.DropOffLocationId` for a movement/read decision, and do not infer a single branch. |
| `AmortizationRunLine` | direct scalar `BranchId`; fallback/consistency path `Schedule.BranchId` is explicit and must be checked, not reflection-discovered. |

## Sensitive/shared references requested by the contract

* `Vehicle` and `Equipment`: service filters, reports, agreement projections,
  and replacement/sale writes use their branch values. Source supports
  confidentiality/operational attribution; nullable values are unassigned and
  have no implicit ordinary-user access.
* `Partner`: branch is a real FK and customer list filters expose it. The source
  does not define a global/shared-null exception; keep null as an explicit
  unresolved/unattributed case until the owner decides.
* `PaymentMethod`: source explicitly permits null `BranchId` as shared and only
  constrains a non-null method to match the current document branch. Registry
  should encode this narrow shared-reference exception, not make all nullable
  branch fields shared.

## Read/write and bypass inventory

* Generic `Service<T>` CRUD uses `Repository.Query`, `Add/Update`, and
  `SaveChangesAsync`. It validates tenant ownership but has no branch guard.
  Aggregate child reconciliation uses reflection for collections; branch policy
  must be typed/registry-driven rather than inferred from arbitrary property
  names.
* Direct context reads with explicit tenant/soft-delete predicates include the
  movement services (`CollectionMovementService`, `DeliveryMovementService`,
  `CustodyMovementService`, `NRMService`), `BusinessReportsService`,
  `VehicleReportsService`, and `DashboardService`. They need the request branch
  predicate at their query boundary; a repository-only filter will not protect
  these reads.
* `AccountService` uses `IgnoreQueryFilters().ExecuteUpdateAsync` for account
  reparenting of `JournalVoucherDetail`, `OpeningBalanceAccount`,
  `OpeningBalanceCostCenter`, `BillDetail`, and other child tables. The current
  operation is account-only, but it is a set-based write outside ChangeTracker;
  any branch guard relying only on `SaveChanges` cannot see it.
* `OpeningBalanceResetService` uses `Repository.Query(..., includeDeleted:true)
  .ExecuteDeleteAsync` over opening-balance, deposit, JV and allocation tables in
  a development reset. This is an intentional all-tenant-scope service path that
  needs an explicit system/admin policy or a typed branch authorization before
  branch filtering is enabled; it cannot be silently treated as a normal user
  write.
* `RentalQuotationService` and `LeaseQuotationService` use
  `Repository.Query(...).ExecuteUpdateAsync` for approval transitions. These
  preserve repository predicates but still bypass ChangeTracker write guards;
  the owner must apply an explicit branch write check before invoking them or
  provide a guarded set-based wrapper.
* `CodeCreateService` uses `IgnoreQueryFilters()` for document-number counters;
  this is a number-allocation path, not a branch-data read, but generated numbers
  receive branch inputs from their owning document. `LocalizationService` has a
  SQL Server `FromSqlInterpolated` lock with no branch field.

## Explicit guidance for the root registry/guard

1. Register direct scalar selectors (`BranchId`, `StockBranchId`,
   `BranchInId`/`BranchOutId`, JV effective line selector) explicitly. Register
   child selectors as concrete paths (`BillDetail.Bill.BranchId`, etc.); do not
   use reflection to turn every property containing “Branch” into a policy.
2. Keep `Branch` itself, `UserBranchAccess`, and authorization/default pointers
   outside the ordinary operational filter so the evaluator can resolve the
   tenant's current grants. Do not use `UserBranchPreference` as authorization.
3. For null branch data, fail closed for ordinary users unless the registry
   records a source-backed shared-reference exception (`PaymentMethod.BranchId ==
   null` only). Historical snapshots and free-text branch labels remain
   unresolved, not shared.
4. For writes, validate every changed branch edge before `SaveChanges`: direct
   root branch, inherited/TPT owner, every child owner path, both endpoints of
   movement/transfer/replacement operations, and each JV line's effective branch.
   Also cover set-based `ExecuteUpdate/Delete` entry points because they do not
   enter the ChangeTracker.
5. Do not make the header-only JV or destination-only StockTransfer predicates
   the sole policy. The source proves both are aggregate/multi-branch cases.

## Unresolved/unknown items

* The source does not define whether nullable `Partner.BranchId` denotes a
  shared customer or an unassigned customer. The implementation contract says
  null must not grant ordinary access; owner confirmation is still needed for
  any shared-reference exception.
* `QrLabel.Branch` has no FK/navigation and no service-level branch validation;
  its intended ID/string semantics are unknown.
* `AmortizationRunLine.BranchId` has no navigation/FK while its schedule has a
  required branch. Whether the scalar is a historical snapshot that may diverge
  or must equal `Schedule.BranchId` is not declared in the source.
* `Booking`/`TransportationAgreementItem` branch endpoints and the nullable
  `LeaseAgreementVehicleReplacement.IncomingBranchOutId` have no single-owner
  branch semantics. The operation-specific two-endpoint rules above are the
  evidence-backed minimum; a different historical/null policy needs owner input.

