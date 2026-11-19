# Authorization 201–210 — operation-access handoffs (2026-11-14)

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Freeze scope | Item 201 route adoption; item 202 Bill and item 207 GRN existing-operation adoption; item 209 direct-write containment; source-read prerequisites in 205/206. Remaining 205/206/208/210 route/editor flows are pending independent handoffs; 203/204 use earlier contracts. |
| Scope | Route-specific authorization adoption for inventory entries 201–210, preserving all prior financial/business decisions |
| Boundary | No new posting, quantity, account, payment, approval, schema, migration, or synthetic permission keys |

## Frozen handoff — 201 `/LoanDetails`

The existing `reviews/LOAN_READ_CONTRACT_FREEZE.md` freezes this route's read-only report, filter and result semantics. The Angular route declaration at `pages/routing.ts:1348–1351` resolves `LoanDetails_Routes` to `LoanEMIsComponent` with `loanReportMode='details'` (`loanemi.routes.ts:16–18`). The consumer's `loanReportAccess.details` is **`LoanReport.GetDetails`** and its only report read is `LoanEMIService.getLoans('details', filters)` → `GET LoanReport/details` → `LoanReportController.GetDetailsAsync` → `LoanReportService.GetDetailsAsync` → `GetSummaryAsync(..., includeFinanceBankFilter:false)`; `BranchOperationRules` classifies this operation as a whole-document read and `QueryReport` joins through a visible Bill and plan. Do **not** require `LoanReport.GetLoans` or `LoanReport.GetFinanceBanks` for this screen: its bank selector/read is absent. The server resolver/filter is authoritative for the grant and branch denial, the Angular route guard handles navigation, and the mounted component handles revoke/output and print invalidation.

Adopt only `/LoanDetails` with its exact `loanReportAccess.details` requirement, and offer that route via `firstAllowedRoute` when it is the user's first available page. Preserve read-only local pagination, complete-result totals, all-row Excel and print tied to generation; no Pay action or write. Bill numbers become links only when the independently adopted Bill detail route **and** `Bill.View` allow them. Add a guide topic for this existing third mode and an exact grant-positive/grant-negative route check.

Reference evidence: Speed sidebar snapshot 2026-10-28 `sidebar/20-loan/screens/03-loan-details.md` and controller `C0944--tenant.views.crs.loan.loanDetails.index.js:71–88` confirm a read/report/export workflow. Speed's optional date-range control and alternate `paymentPlan/GetLoanDetails` transport are reference differences; the previously frozen Sigma read contract owns its required date range and actual API. No matching original explanation was found by scoped title search in the 2026-10-27 source catalog. Odoo is not required for this route-grant reconciliation.

## Previously frozen or pending handoffs

| Item | Existing authority and current classification | Current boundary |
|---|---|---|
| 202 `/Bill` | Financial document 08, real Bill aggregate; inventory `resource-only` pending verified implementation | Existing operations are frozen below; route/revoke conformance required before inventory promotion |
| 203 `/JournalVoucher` | `JOURNAL_ACCESS_ADOPTION_CONTRACT_FREEZE.md`; inventory `operation-confirmed` | Maintain existing complete route/action grant coverage, audit for regressions |
| 204 `/BillDetail` | `BILL_DETAIL_RETIREMENT_CONTRACT_FREEZE.md`; retired-source-only | Do not restore a separate child route, endpoint or implicit parent redirect |
| 205 `/CreditNote` | Financial document 08; inventory `resource-only` | Pending explicit route/action to endpoint map |
| 206 `/DebitNote` | Financial document 08; inventory `resource-only` | Pending explicit route/action to endpoint map |
| 207 `/GoodsReceivedNote` | Document/stock receipt; inventory `resource-only` pending verified implementation | Existing operations are frozen below; branch/source/stock effects stay server-owned |
| 208 `/Invoice` | Financial document 08, multiple source-specialized invoice flows; inventory `resource-only` | Pending independently confirmed operation and subtype contracts |
| 209 `/InvoiceBase` | Inventory `resource-only` | Pending proof of an actual assignable independent operation; fail closed meanwhile |
| 210 `/MiscellaneousInvoice` | Financial document 08; inventory `resource-only` | Pending explicit route/action to endpoint map |

## Existing-operation adoption — 202 `Bill` and 207 `GoodsReceivedNote`

These two actual parent-document routes have existing source-owned approvals, document accounting and quantity conservation. **Do not alter** financial posting, branch identity, approval enums, stock balance formulas, allocation priority, reference-active exceptions, or the existing `GoodsReceivedNote.VoidAsync` HTTP grant (currently `GoodsReceivedNote.Update`). Preserve the respective `BILLS_LIST_*`, `BILLS_ACTIONS_*`, `GRN_CONTRACT_FREEZE`, `GRN_MULTI_SOURCE_*` and `PURCHASING_PARTIAL_GRN_BILLING_*` feature freezes. The server owns write and branch refusal under its existing locks; an Angular `canEdit` hint is not a substitute for an HTTP check.

Adopt these **exact routes and grants** for an ordinary connected ERP user:

| Route and action | Bill (202) | GRN (207) |
|---|---|---|
| List | `/Bill` → `Bill.View` | `/GoodsReceivedNote` → `GoodsReceivedNote.View` |
| View details | `/Bill/details/:id` → `Bill.View` | `/GoodsReceivedNote/view/:id` → `GoodsReceivedNote.View`; `/GoodsReceivedNote/details/:id` is an existing redirect to the same view |
| Create details | `/Bill/create` → `Bill.Create` plus required editor reference lookups | `/GoodsReceivedNote/create` → `GoodsReceivedNote.Create` plus required editor reference lookups |
| Edit details | `/Bill/edit/:id` → `Bill.View`, `Bill.Update` and editor lookups | `/GoodsReceivedNote/edit/:id` → `GoodsReceivedNote.View`, `GoodsReceivedNote.Update` and editor lookups |
| Bill-specific action | `Bill.ManageApproval`, `Bill.Void`, `Bill.Allocate`, `Bill.AllocateSupplierDebit`, `Bill.GetJournal`, `Bill.LoanPaymentPlanDetail` and related loan/payment/preview/PO operations are **independent grants**, gated by the action's actual HTTP key | None implied by a Bill grant |
| GRN-specific action | None implied by GRN View | `GoodsReceivedNote.ManageApproval` for decision, `GoodsReceivedNote.View` for read approval/log, `GoodsReceivedNote.Delete` for deletion, `GoodsReceivedNote.Update` for `POST /{id}/void`, and `GoodsReceivedNote.GetTaxReport` / `GetPurchaseOrders` / `GetPurchaseOrderDraft` for custom reads |

The current Bill editor unconditionally loads `Supplier.Lookup`, `Branch.Lookup`, `Job.Lookup`, `Item.Lookup`, `Asset.Lookup`, `UnitsOfMeasures.Lookup`, `Account.Lookup`, `Vehicle.Lookup`; the GRN editor loads the first six except `Account`/`Vehicle`. The general settings read `SettingsCommonModel.GetMySetting` is also needed for currency initialization. These are **editor bootstrap prerequisites**, not evidence to invent a financial resource grant. If the editor still loads them unconditionally, require the complete matching set in its Angular create/edit route and in its HTTP create/update contract, so a direct POST cannot bypass a displayed editor's reference rights. Alternative lazy optional lookup loading is valid only with a separately reviewed branch-specific request contract. A list read itself needs only its own `View`; selector filter grants such as `Supplier.Lookup`, `Branch.Lookup`, `Vehicle.Lookup` (Bill) and `Supplier.Lookup`, `Branch.Lookup`, `Job.Lookup` (GRN) are conditional only when that filter is applied. No automatic lookup grant from the parent View.

The mounted lists and editors must monitor `AccessViewPolicyService` revision **and** actor/branch context rather than only `ReferenceLookupCacheService.contextChanges`, clear previously published rows/reports/print/export when View or applied-filter grant disappears, cancel unowned reads, hide independent action buttons when their grant is revoked, and let locally confirmed dirty-draft discard release navigation. Sent writes may settle without recreating stale dialog output. Independently classify permission-revision updates vs real session/branch replacement. Query snapshots must tie print and Excel to the result version. Branch selection is permitted only if the existing branch owner permits the read/write and persisted document branch rules. No live acceptance is asserted until tests and source review pass.

## Restrictive security handoff — 209 `InvoiceBase`

`InvoiceBase` is the abstract TPT root for **all** invoice types, not an independent, source-validated posting workflow (`INVOICE_SERVICE_BACKEND_CONTRACT_FREEZE.md:14,23,44`). The historical `InvoiceBaseController` still inherits generic `POST`, `PUT`, `DELETE`, `POST handleActivate` from `SiGmaControllerBase`; its service does not run the source-specific document/period/JV/allocation/settlement validations supplied by the concrete invoice services. The inherited generic resolver currently advertises assignable `InvoiceBase.Create/Update/Delete/Activate`. Preserve the controller and all historical GET endpoints pending a consumer audit, but make **all four inherited direct writes** return a deterministic HTTP refusal even for a tenant administrator and stop advertising their assignable grants. The source-specific `Invoice`, `MiscellaneousInvoice`, `LimousineInvoice` and other verified workflows retain their own routes and contracts. This is a restrictive containment of a cross-type bypass, not a decision to remove the TPT model, break readers, regenerate permissions or delegate invoice posting to the generic root. Direct UI create/edit on this legacy root remains unadopted pending a typed owner contract.

## Narrow cross-resource read handoff — 205/206

`GET CreditNote/GetInvoices/{customerId}` builds posted outstanding invoice candidates from `Query<InvoiceBase>` and exposes their number, linked agreement number, amounts and due balances. Require its existing grant `CreditNote.GetInvoices` **and** `Invoice.View` at HTTP; `CreditNote.GetInvoices` alone must not reveal invoice source details. `GET DebitNote/GetBills/{supplierId}` likewise builds posted supplier Bill candidates and discloses number, supplier bill reference, currency and balances: require `DebitNote.GetBillsBySupplier` **and** `Bill.View`. These are restrictive, source-supported prerequisites; they do **not** give `CreditNote.View` authority over specialised invoice subtypes nor decide whether an aggregate Invoice.View may encompass them. Any finer per-invoice-type filter/selection remains blocked by the explicit Invoice hub owner decision. Source documents still obey their independently scoped company/branch query. List/editor/approval route adoption for notes is pending.

Source-only confirmation is separate from scoped application builds, focused behavioral tests, SQL/HTTP verification and browser acceptance. Generated recipe drift check on 2026-11-14 returned OK for the eight packets. Do not edit retired frontend/backend review guides.

## قرارات إعادة المراجعة والمعالجة — ١٤ نوفمبر ٢٠٢٦

يُحدّث هذا القسم حدود المصدر السابقة وفق طلب المالك مراجعة البنود ومعالجة الملاحظات. تُقرأ النتيجة والتحقق من [سجل المعالجة](AUTHORIZATION_201_210_REREVIEW_FIXES_20261114.md).

- يصبح تجهيز محرر Bill بحاجة إلى Bill.Preview ومنح Currency.Lookup وCurrency.GetFinancialNumberPolicy وCurrency.PreviewConversion وSupplier.View، إضافة إلى مصادره السابقة. تظل قراءة الفاتورة المحفوظة مستقلة. يحذف طلب Supplier.GetTaxRate الزائد من Bill لأن نتيجته لم تدخل أي حساب، وتبقى معاينة الخادم مالكة الضريبة.
- يتطلب محرر GoodsReceivedNote مصادر العملة نفسها وSupplier.GetTaxRate المستعمل في معاينته. يحتاج Update هذه المتطلبات عند مدخلات التحرير الفعلية فقط، وتبقى عملية Void تحت View وUpdate. تعتمد إجراءات المستندات المحفوظة على View، وتفحص الواجهة التسجيل في فرع السطر عند إظهار وإرسال عمليات الكتابة.
- تتطلب قائمة مصادر CreditNote.GetInvoices عرض كل الأنواع التي تعيدها بالفعل، عبر Invoice.View وInvoice.GetTaxAdvance وMiscellaneousInvoice.View وLimousineInvoice.View وEquipmentRentalInvoice.View وTransportationInvoice.View. يتطلب طلب مصادر التسليم وحده عرض فاتورة المعدات وإذن التسليم، وتبقى قراءة قائمة الإشعارات مستقلة. يُشترط مرجع المورد أو جهة الاتصال عند طلب عملة الطرف المحدد في DebitNote.
- يُقصر الوصول إلى عمليات Invoice العامة التي تقرأ أو تغير أكثر من نوع على مدير الشركة لحين استكمال عقد الواجهة الجامعة. يشمل ذلك القائمة العامة والتعديل والحذف والخلاف وقراءة القيد والمقبوضات والإبطال وإلغاء الاعتماد. تُقصر قراءات InvoiceBase القديمة على مدير الشركة، وتظل كتاباته الأربع مغلقة. يعكس الكتالوج هذا الحد.
- تتحول واجهة InvoiceBase القديمة إلى قراءة فقط، ويعود مدخل الإنشاء إلى قائمتها. تبقى صلاحيات المستخدم العادي لهذا المسار وواجهات CreditNote وDebitNote وInvoice وMiscellaneousInvoice بحاجة إلى تسليمات التبني المستقلة المسجلة في العقود.
- يُغلق النقل غير المستخدم GetAllWithNavigations للفواتير وأذونات الاستلام. تستخدم القوائم والتقارير الفعلية مالك الصفحات والتصدير الحالي.
