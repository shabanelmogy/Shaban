# Vehicle Profit/Loss — shared handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-11 |

## Financial and persistence contract

Owner explicitly selected posted vehicle-related accounting movements, then authorized permissions. Add nullable int VehicleId and Vehicle navigation to JournalVoucherDetail; tenant-valid live FK, restrictive deletion. Never allocate an unlinked line by plate or shared cost-center group. Preserve VehicleId through reversals and currency normalization/clones. Producers with exact source identities carry them on their accounting lines without changing financial totals; report counts only explicit persisted attribution. Any producer lacking a certain per-line vehicle is an adoption gap, never an invented allocation.

Report query uses Repository.QueryReport for lines, journals, vehicles, accounts, partners and branches, including actual allowed branch effects. Journal posted=true, voided=false, live parent/line/account/vehicle, same tenant. Accounting date inclusive local calendar dates using half-open next-day bound. Only AccountCategory Revenue/Expense; Revenue = Credit-Debit; Expense = Debit-Credit; profit=Revenue-Expense. Base amounts only, exact monetary strings with shared financial policy/precision. No financial read cache.

## Frontend / HTTP contract

Route `/Reports/VehicleProfitAndLoss`. Existing backend owner `VehicleReportsController` / `IVehicleReportsService` / `VehicleReportsService` retained. GET `VehicleReports/VehicleProfitAndLoss`, `VehicleProfitAndLossDetail`, `VehicleProfitAndLossWithSellingDetail` return Result<T> (`isSuccess,message,entity`). New GET `VehicleProfitAndLossExport` returns the summary report under its own permission; detail/selling exports use their respective data endpoints with independently granted keys. Summary read key `VehicleReports.VehicleProfitAndLoss`; detail key `VehicleReports.VehicleProfitAndLossDetail`; selling output key `VehicleReports.VehicleProfitAndLossWithSellingDetail`; summary export key `VehicleReports.VehicleProfitAndLossExport`. Details/selling/export require summary read in server prerequisites. Filter options from dedicated GET `VehicleReports.VehicleProfitAndLossOptions` under summary prerequisite and own permission; route requires read + options. No full Vehicle/Account/Journal permission required merely to consume this report. No new grants assigned automatically.

Query: fromDate/toDate required ISO local dates; ownership/FleetType nullable numeric enum; vehicleId/carModelId/vehicleTypeId/supplierId nullable positive ints; chassisNo/trafficFileId nullable strings. All vehicle identities are real ids. Supplier restricts associated ledger partner, not the vehicle master. Filter changes cancel old reads and invalidate output; capture applied snapshot for details/exports; session/access expiry clears output and cancels reads. Required options bootstrap owns page loading; detail dialog reads own local progress; operational reads not cached.

Report entity: fromDate:string,toDate:string,rows:T[],totalRevenue:string,totalExpense:string,totalProfitLoss:string,currencyCode:string,decimalPlaces:number. Summary rows: vehicleId:number,plateNo:string,makeAndModel:string,chassisNo:string,branch:string,revenue:string,expense:string,profitLoss:string. Exact displayed column order: plateNo,makeAndModel,revenue,expense,profitLoss; vehicleId is row detail identity; chassisNo/branch appear in full Excel. Detail rows: journalLineId:number,date:string,voucherNo:string,type:string,vehicleId:number,plateNo:string,contact:string,branch:string,expenseType:string,paymentMethod:string,description:string,revenue:string,expense:string. paymentMethod is empty unless source-supported persisted data exists, never guessed. Source record links are not fabricated. Selling rows add agreementNo/masterAgreementNo/agreementType/agreementStatus/rate/startDate/period/invoicingRule/saleOrigin/jobNo nullable source metadata only; empty metadata is explicit unavailable and does not change ledger amounts.

Options entity: vehicles/carModels/vehicleTypes/suppliers arrays of `{id:number,name:string}`, trafficFileIds:string[]. Ownership and fleet enum values use actual Sigma enums. Option endpoint is a direct noncached report-specific read, tenant/branch protected. Complete response arrays are unpaged; local grid paginator and export all rows. Backend-owned totals for summary/detail/selling. No client financial sums. All outputs use same basis/filter; fetching exports is separately guarded and never exports only current page.

## Reference and source evidence

Images1-3 demonstrate 8 filters, summary5 columns, detail action, 3 export choices, detail11 columns and totals. Colors/layout/pagination sizes are reference only. Speed2026-10-28 screen23/01, state tenant.crs_vehiclesProfitAndLoss, routeR0390, controllers C1095/C1096 source application.js289590-290167 were read. Speed2026-10-27 S107 explains vehicle profitability but supplies no ledger attribution contract. Odoo19 pinned fleet/cost_analysis.rst documents cost comparison, not Sigma journal attribution or permission; no imported accounting rule. Existing Sigma JournalVoucherDetail lacks VehicleId; CostCenterGroup is shared, JobId alone cannot represent all vehicle activity. User's ledger choice overrides the invoice/bill implementation.

## Applicable phases

0 evidence,1 domain/read freeze,2 report/grid/output,3 read-only detail dialog,5 wiring/access,6 reconciliation. Phase4 not applicable (no report domain mutation). Ledger attribution is a directly required producer prerequisite, not permission to alter posting math or historical data.

## ملحق قرارات لاحقة — 2026-11-11

- قرار المالك عن معنى الاستبعاد: «مش فاهم اوى شوف الانسب». اعتُمد كود الحساب الظاهر، مطابقًا للحساب نفسه دون الأبناء؛ أكواد غير موجودة أو تعدد سجلات الإعدادات يوقف القراءة برسالة إصلاح. التكرار النصي لنفس الكود يطبع إلى مجموعة واحدة. قراءة الإعدادات مباشرة على الخادم بلا صلاحية إدارة إضافية للمستخدم وبلا كاش مالي.
- احتُفظ بعقد المورد السابق كفلتر مصروف فقط؛ الإيراد يتبع بقية المرشحات. جهة الاتصال عرض من PartnerId السطر أو رابط Invoice/Bill المحفوظ الوحيد، دون إعادة كتابة طرف السطر أو مطابقة نص الوصف.
- أضيف snapshot VehicleId على RentalInvoiceItem أيضًا؛ يحفظ هوية فترة الإيجار وقت التوليد ولا يعاد اشتقاقها عند إعادة بناء القيد. أحداث fine تستعمل TrafficFine.VehicleId؛ toll بلا هوية حدث محفوظة يبقى غير مسند. لا إسناد آلي تخميني لباقي مصادر Invoice/Provision/Receipt. الربط اليدوي والـBill والفترات والمخالفات المعلومة والعكس موصولة؛ بقية تبني المنتجين فجوة معلنة في الدليل والشاشة، لا ادعاء اكتمال مرجعي مالي شامل.
- الموديل يعيد isDefleeted من آخر VehicleStatus بترتيب CreatedAt ثم Id؛ يُعرض بجانب اللوحة دون عمود إضافي. النوع عددي boolean وليس حقل مال.
- بنود البيع تعيد rateCurrencyCode إلى جانب rate الدقيق؛ المعدل معلومة أصلية وليست مبلغًا بعملة الأساس. العرض/التصدير لا ينسقانه بدقة عملة الأساس ولا يحولانه.
- اختلاف مبرر عن شريط UI20 المسطح: المرشحات التسعة تستخدم FilterPanel المشترك وMore filters، كما يتيح تطبيق BalancesSummary، لحفظ ارتفاع التقرير؛ لا مكونات طي محلية أو CRUD. ثلاثة مرشحات أساسية والبقية إضافية، والجدول داخلي التمرير.
- يضاف شرط journalVehicleChanged في metadata والصلاحية الخلفية عند إنشاء/تغيير ربط المركبة باليدوي فقط؛ يحتاج Vehicle.Lookup، ويقارن التعديل بالسطور المملوكة للمستند. الاحتفاظ بالربط المحفوظ لا يحتاج grant جديدة. لا تعيين منح تلقائيًا.
