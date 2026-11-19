# Lease user-guide content — 2026-10-09

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Scope and ownership

Bounded guide workstream under `LEASE_FRONTEND_FOLLOWUP_CONTRACT_FREEZE.md`. Created only `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/lease-guide.ts` and this review fragment. Root owns reader, menu, translations, explicit application entries and final scoped diff. Other agents' source changes and existing Fleet registration remain preserved. No backend edit, migration, build, test, lint, application/browser/database verification, commit, push or deployment.

## Conformance evidence

| Concern | Owner | Reference / shared contract | Target result |
|---|---|---|---|
| Typed bilingual module content | Master 7 screen guide gate | `UserGuide/models/user-guide.model.ts`: GuideSection, GuideTopic; `UserGuide/content/staff-guide.ts`: STAFF_GUIDE | LEASE_GUIDE has id `lease`, purpose/prerequisite overview, six journey steps, ten parent topics and eight questions in English/Arabic. |
| Reuse current guide reader | Master 7 | `UserGuide/components/reader/guide-reader.component.ts`: guides array; `UserGuide/user-guide.routes.ts` | No new viewer/UI/styles. Root adds LEASE_GUIDE import and array registration without replacing Fleet or other guides. |
| One module menu link | Master 7 | `sidebar-menu-data.ts`: Lease children, existing guide link shape | Root's link `/UserGuide/lease` with `userGuide.leaseMenuEntry`; operational topics use actual route casing. |
| User-facing explanation | Master 7 | Final Lease list/editor/dialog components and owning service rules below | No DTO/API internals or permissions promised. Child dialogs stay within Agreement, Inquiry, Quotation and Clause topics. |

## Route and topic coverage

| Topic identity | Operational route | Source evidence |
|---|---|---|
| sideMenu.leases.leaseTariff | /LeaseTariff | `pages/routing.ts`; LeaseTariff routes; list/detail components; LeaseTariffService month and overlap validation |
| sideMenu.leases.leaseCostParameters | /LeaseCostParameter | list/detail components; LeaseCostParameterService duplicate name, order and referenced-delete rules |
| sideMenu.leases.leaseCostSetting | /LeaseCostSetting | list/detail components; LeaseCostSettingService unique model, required children and year-range validation |
| sideMenu.leases.ClauseAndClauseTypes | /LeaseClause | list/details/clauses components; ClauseTypeService exactly one default and length rules |
| sideMenu.leases.leaseInquiry | /LeaseInquiry | list/detail/stage/log dialogs; LeaseInquiryService ValidateInputAsync and ChangeStageAsync |
| sideMenu.leases.leaseQuotation | /LeaseQuotation | list/detail/rejection/master-agreement dialogs; LeaseQuotationService state transitions and IsEditable; LeaseMasterAgreementService AddAsync |
| sideMenu.leases.masterAgreement | /LeaseMasterAgreement | list and View HTML (dates/customer/quotation/status/notes only); LeaseMasterAgreementService ApproveAsync |
| sideMenu.leases.leaseagreements | /LeaseAgreement | list/main editor and all owned dialogs; LeaseAgreementService methods and validators below |
| closedLeaseAgreements.title | /closedLeaseAgreements | closed routes closedOnly + View modes; shared Agreement list filtered read; not a separate writer |
| sideMenu.leases.sendSmsToLeaseCustomer | /LeaseCustomerSms | list/components; LeaseCustomerSmsService BuildRecipientQuery and SimulateAsync; selectionPageOnly and clearSimulationContext |

All topic title keys exist in both `i18n/vocabs/en.ts` and `ar.ts`. The ten operational module paths exist in `pages/routing.ts`; child create/edit/view paths are owned by the parent topics. Guide import has no presentation dependencies.

## Material content decisions

- Quotation's one-to-five-year fields remain dates under the frozen contract. The guide accurately tells users to use the displayed date controls and does not invent financial pricing.
- Inquiry stage changes support New/Cold/Hot with optional notes; there is no inquiry-to-quotation conversion action. The guide explains their separate ownership.
- Master Agreement View displays no linked agreement collection. Text is restricted to its actual dates, customer, quotation reference, approval status and notes. Create belongs to an eligible quotation; no Edit/Delete/Unapprove action is promised on Master.
- Agreement expected advance/deposit is separate from money received. Deposit saving records a receipt and accounting entries, requires at least 0.01 after rounding and enforces the remaining expected deposit when it is positive (`LeaseAgreementService.AddDepositAsync`, lines2270+). No deposit refund is promised. Add Receipt uses the shared Receipt editor, whose own validation remains authoritative. The ordinary Agreement list may offer related-record actions under its existing flags, including with a closed-state filter; the dedicated closed list offers View only.
- Agreement ordinary Create rejects provision creation; ordinary Update rejects new provision rows (`AddAsync`/`UpdateAsync`, lines144–255). ExtendRatePeriod permits new schedules, requires a voucher subtype and NumberOfMonths>=1 (`ValidateExtendProvisions`, lines4346+). Its title is optional, limited to200 (`extend-rate-period.component.ts` createProvisionRow); day is1–31 when present. `ValidateProvisionRemoval`, lines3616+, refuses removal of rows with recorded financial history. No scheduled journal posting is promised.
- Agreement closing records collection, updates vehicle mileage/branch and available status, and recalculates totals (`CloseAsync`, lines1477–1608); no invoice/payment/refund is created by that action. Driver and vehicle replacement enforce current identity, different active replacement, chronological/mileage bounds and vehicle availability (`ReplaceDriverAsync`, lines2690+; `ReplaceVehicleAsync`, lines2980+).
- Documents select-and-upload supports PDF/JPEG/PNG. Discounts require dates, ordered range, nonnegative amount and no duplicate date pair (`ValidateDiscounts`, lines4396+). Additional charges require date/type/rate type and nonnegative two-decimal amount (`ValidateAdditionalCharges`, lines4610+). Payment instructions are saved instructions, not collection; filled cheque rows require positive amount and the existing required fields (`ValidatePaymentInstructionsRequest`, lines4415+).
- Delete and Void preserve linked-record restrictions; Void also checks positive expected advance/deposit (`RemoveAsync`, lines334+; `VoidAsync`, lines393+). Email sending is explicitly unavailable. The guide uses existing action states without representing them as authorization.
- SMS recipient list uses customers with a nonvoided lease agreement, and simulation counts only recipients with mobile numbers. It sends no real SMS. Paging/search/sort clears selection and prior result; success clears message and selection.

## Verification and integration handoff

Root reconciliation correction: `LeaseAgreementsComponent` line455 restricts
`closedOnly` actions to the first View action. Closed-list text now describes
View, the viewer's own Print, Excel and readonly editor tabs; no receipt or
child-dialog action is promised on this list. Related-record actions remain in
the ordinary Agreement list. Arabic terminology is reconciled to the current
LeaseTariff labels (`التأجير طويل الأجل`), without implying a financing product.

Root also reconciled the cost-setting topic to its paged list without a Search
control, removed an absent Quotation date filter and replacement-history claim,
and described Billing history as totals/received/due rather than receipt rows.

Source inspection only: content reviewed against the enumerated final route/actions and direct backend rules. Root must review this newly added untracked file as part of complete scoped source reconciliation and retain the registered `/UserGuide/lease` menu/reader linkage. Reading/navigation/EN/AR/RTL/theme/print and compilation remain owner acceptance. Suggested frontend commit scope is covered by root's Lease fix message; no standalone commit created.
