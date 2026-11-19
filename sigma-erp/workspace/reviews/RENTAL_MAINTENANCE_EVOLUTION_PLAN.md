# Rental maintenance and evolution — 2026-10-06

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

## Scope and authority

User: review `src/app/modules/Rental` and apply documentation-confirmed changes. Application source owner: `F:/My Work/Sigma/SiGmaAngularFrontEnd`; backend inspected only for the consuming contracts. Master blocks 1/4/5/7 and applicable UI/backend blocks govern. Recipe `-Check` reports all packets stale except Phase 01; canonical books prevail. Regeneration and semantic packet review remain pending. No screenshots supplied for this task; earlier contracts are historical evidence and their explicit feature exceptions remain valid.

Existing changes in Assets, Vouchers, Loan, shared dates, translations, toolbar, LayoutModule and pages/routing belong to previous work and must be preserved. Rental itself was clean at entry. No builds, tests, lint, runtime/browser, database, migration, commit, push or deployment execution.

## Impact map and disposition

| Owner | Existing behavior/evidence | Disposition |
|---|---|---|
| Agreement / Booking | Typed aggregate documents; lists + create/view/edit routes; backend owns charges and transitions | Refactor canonical presentation/async/export adapters; retain domain/API |
| RentalQuotation / MasterAgreement | Approval aggregates and totals; earlier quotation review predates UI13 D4-2 | Refactor editors to current routed document rule where confirmed; preserve action/creation contracts |
| RentalTariff / TariffCard | Vehicle-type tariff workspace and independent tariff card editor | Refactor shared shells, paging, confirmation and recovery |
| DriverTimeSheet | Operational log owned by existing agreement/driver API | Refactor list/modal; retain time-entry rules |
| RentalPlanner | Frozen specialized operational matrix; historical `RENTAL_PLANNER_DISCOVERY_CONTRACT_FREEZE.md` explicitly approves grouped timeline exception | Keep matrix; refactor shared shell/filter/date/error adapters |
| BookingCharge root | No sidebar menu or application consumer except root wiring; copied list columns (`name`, `sku`, `categoryName`) do not exist in API. Actual charges owned by Booking/Agreement/RentalTariff and their server calculations | Remove unused frontend CRUD root and exact route/provider/spec references; preserve backend/entities/data and live charge consumers |
| BookingNotificationFlags root | No menu/application consumer except root wiring; child type of legacy RentalNotificationEvents | Remove unused frontend CRUD root; preserve backend/data |
| RentalBookingNotification root | No menu/application consumer except root wiring; authoritative UI `Administration/Settings/components/notifications`, backend `NotificationsSettingsModelService.UpsertByKeyAsync` uses Action | Remove duplicate frontend root; retain canonical settings owner |
| RentalNotificationEvents root | No menu/application consumer except root wiring; empty Add/Update VM, copied fake list, singular entity navigations conflict with collection-shaped detail VM | Remove unused frontend root; preserve legacy backend/data rather than inventing a workflow |
| RentalQuotationSettings root | No menu/application consumer except provider wiring; legacy DTO has 16 options absent from entity. Actual entity fields (`QuotaionValidity`, EnquiryRef, ProjectName, ProjectLocation, EnquiryDate, OnHireDate, OffHireDate) owned by Fields settings | Remove duplicate unused frontend root; retain Fields settings owner |

Source evidence: `sidebar-menu-data.ts` Rental menu links are RentalQuotation, MasterAgreement, RentalBooking, RentalPlanner, RentalAgreement, DriverTimeSheet; pricing is under settings. Settings' similarly named interfaces belong to their canonical models, not the retired services. Source retirement is reversible, has no database/schema effect, and implements Master5's dead-root/shared-owner boundary. Rebuilding the copied CRUD was rejected because it duplicates live owners and would invent contracts.

Contract amendment before handoff: final exact-symbol search finds a compatibility import of BookingChargeService in `Lease/closedLeaseAgreements/components/details`. Retain that root-provided service at its existing import path; retire its screens/models/routes/specs only. The four other retired services have no live consumer. Do not change the unrelated legacy Lease request or redirect it to an API with different semantics. Its old response-shape mismatch is outside this frontend screen retirement.

## Frozen boundary

Live API filter keys, response wrappers, editable fields, saved child IDs/full snapshots, calculation ownership, permissions and action states remain the source-supported contracts. The root freezes each bounded implementation handoff after discovery and before delegating source edits. Any genuinely missing domain/API decision blocks only that affected slice. No new business transition, deletion of stored rows, accounting effect, permission or persisted field is authorized by this plan.

Approved references: Workshop/Job list and editor; Fleet/VehicleService modal; Workshop/Job/close-job action dialog; shared DataTable, FilterPanel, EditorDialog, FieldError, StateMessage, SummaryCards, EditableRows, date/list/error/export utilities. Backend reference selection: aggregate pattern2/3 according to existing persistence, operational read-only planner pattern5; no standalone CRUD for settings owned by pattern4.

Implementation record and final reconciliations belong to `RENTAL_FEATURE_REVIEW.md` (pending).
