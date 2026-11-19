# تأجيل تقرير رسوم الطرق (Tolls Report — سالك)

| البند | القيمة |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| التاريخ | 2026-11-19 |
| النطاق | Reports → Fines & Tolls (المجموعة كاملةً بجميع بنودها الستة) · تعطيل وعلامة `Soon` في القائمة الجانبية |
| المرجع المرتبط | [خطة تطوير المخالفات وسالك ودرب](../FINES_TOLLS_INTEGRATION_MAINTENANCE_EVOLUTION_PLAN.md) |

## قرار المالك

وجّه المالك بتاريخ `2026-11-19` بتعطيل قائمة `Fines & Tolls` كاملةً في التقارير (`Tolls Report`، `Darb Tolls Report`، `Update Fine Time AUH`، `Fines Report`، `Reconcile Tolls`، `Reconcile Darb Tolls`) وتمييزها بعلامة `Soon` وتوثيقها في سجل الأعمال المؤجلة بدل تنفيذها على مصدر جزئي أو إبقاء روابطها المضلّلة إلى `/TrafficFine` قبل حسم دورة سالك ودرب والمخالفات الكاملة.

## الإفصاح المرجعي وما أثبته الفحص المصدري

- **دليل Speed (2026-10-27)**: فصل المخالفات والرسوم (`Speed_Analysis_Guide.md`، الفصل ١٢) يغطي المفهوم العام دون شرح شاشة منفصل للتقرير.
- **كود Speed (2026-10-28)**: قُرئ ملف الشاشة `sidebar/23-reports/screens/36-tolls-report.md` والمتحكمان `C1078--tenant.views.crs.reports.tollReport.index.js` و`C1079--tenant.views.crs.reports.tollReport.report.js`.
- **Odoo 19.0 (2026-11-02)**: غير منطبق لعدم تغطية تقارير سالك ودرب.
- **الصورتان المرفقتان (`media_1795112648780_2774ec74.png` و`media_1795112648780_3e391327.png`)**:
  - **المرشحات الظاهرة (١٥ مرشحًا + خيارا نطاق)**: من تاريخ/وقت، إلى تاريخ/وقت، نوع التاريخ (`Tolls Date` / `Download Date` / `Post Date`)، `Enable Date Range`، `Plate No(s)`، `Tag No(s)`، `Transaction No`، `Agreement No`، `Branch` (موقع البوابة في كود Speed `location`)، `Direction`، `Account`، `Customer`، `Invoice Status`، `Agreement Status`، `Debit Jv Status`، `Invoice No`، و`Charged Trips Only`، وأزرار `Report` و`Export to Excel` و`Refresh`.
  - **الأعمدة الظاهرة (١٩ عمودًا)**: `Transaction No`، `Plate No`، `Chasis No`، `Tag No`، `Toll Date`، `Post Date`، `Salik Account`، `Branch`، `Direction`، `Debit Jv No`، `Customer`، `Agreement No`، `Movement Type`، `Movement No`، `Invoice No`، `Amount`، `Surcharge`، `Total`، `Download Date`.

## الفجوات التي تستدعي التأجيل

1. لا يوجد في `SiGmaDbContext` كيان أو جدول لحركات رسوم سالك المنزّلة أو المستوردة (`TollTransaction` مقترح في القسم ٩ من [خطة سالك ودرب](../FINES_TOLLS_INTEGRATION_MAINTENANCE_EVOLUTION_PLAN.md) دون حسم قراراتها `D1–D10`).
2. لا توجد نقاط خلفية لاستيراد سالك (`ImportSalik` يستدعي مسارًا غير موجود في الخادم) أو للتنزيل والمعالجة (`DownloadProcessTolls`) أو للترحيل الشهري لرسوم الطرق (`Debit Jv No` / `Debit Jv Status`).
3. المصدر الوحيد المحفوظ حاليًا هو `RentalBillingCharge (Kind = Salik)` المرتبط دائمًا بـ`RentalAgreement`، ولا يغطي تاريخ الترحيل أو التنزيل أو حساب سالك أو الاتجاه أو قيد اليومية المدين أو الحركات غير الإيجارية/غير المعروفة أو الرحلات غير المحمّلة.

## الإجراء المُنفّذ في هذه الشريحة

- أُضيفت خاصية `soon?: boolean` إلى `MenuItem` مع دعمها للمجموعات والبنود في `MenuCatalogService` و`SidebarMenuComponent` (شارة `Soon` / `قريبًا`، عنصر غير نشط وغير قابل للنقر أو التثبيت في الاختصارات، ولا يفتح مجموعة رئيسية محظورة لغير المصرح لهم).
- عُطّلت مجموعة `sideMenu.reportss.groups.finesTolls` وبنودها الستة كلها في `sidebar-menu-data.ts` (`soon: true` وحذف روابط `/TrafficFine` المضلّلة منها جميعًا).

## شرط الاستئناف

حسم قرارات المالك في [خطة تطوير المخالفات وسالك ودرب](../FINES_TOLLS_INTEGRATION_MAINTENANCE_EVOLUTION_PLAN.md) (`D1–D10`)، ثم تنفيذ شرائح التخزين والاستيراد والمعالجة والترحيل الشهري (ش١–ش٥) قبل بناء شاشة وخدمة تقرير رسوم الطرق (`ش٦`).
