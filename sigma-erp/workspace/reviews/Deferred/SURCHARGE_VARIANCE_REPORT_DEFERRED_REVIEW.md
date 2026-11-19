# تأجيل تقرير فروق الرسوم الإضافية (Surcharge Variance Report)

| البند | القيمة |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| التاريخ | 2026-11-19 |
| النطاق | Reports → Finance & Expenses → Surcharge Variance Report · تعطيل البند وتمييزه بعلامة `Soon` في القائمة الجانبية |
| المرجع المرتبط | [خطة تطوير المخالفات وسالك ودرب](../FINES_TOLLS_INTEGRATION_MAINTENANCE_EVOLUTION_PLAN.md) |

## قرار المالك

وجّه المالك بتاريخ `2026-11-19` بتعليم بند تقرير فروق الرسوم الإضافية (`Surcharge Variance Report`) بعلامة `Soon` كعنصر غير نشط في القائمة الجانبية وإزالة الرابط المؤقت `/Account` عنه، وتوثيق تأجيله لحين حسم مصدر الرسم الإضافي القياسي للمخالفات ضمن توحيد إعدادات المخالفات والرسوم.

## الإفصاح المرجعي وما أثبته الفحص المصدري

- **دليل Speed (2026-10-27)**: لم يرد شرح منفصل للتقرير.
- **كود Speed (2026-10-28)**: قُرئ ملف الشاشة `sidebar/23-reports/screens/41-surcharge-variance-report.md` والمتحكم `C1072--tenant.views.crs.reports.surchargeVarianceReport.index.js` وتعريف المسار `R0406--tenant-crs-surchargevariancereport.js` (نقطة `api/services/app/surchargeVarianceReport/GetSurchargeVarianceReport` بصلاحية `Pages.Tenant.SurchargeVarianceReport` دون فلاتر إدخال).
- **Odoo 19.0 (2026-11-02)**: غير منطبق لعدم تغطية فروق الرسوم الإضافية لسالك والمخالفات.
- **الصورة المرفقة (`media_1795113372363_e193e3ef.png`)**:
  - زر تحديث واحد (`REFRESH`) دون شريط فلاتر.
  - قسمان متماثلان في الأعمدة: **Toll Surcharge Variance** و**Fine Surcharge Variance**.
  - الأعمدة الستة في كل قسم: `CODE`، `CUSTOMER NAME`، `EMAIL`، `STANDARD SURCHARGE`، `SURCHARGE`، `SURCHARGE LEASE`.

## الفجوات والقرارات المفتوحة التي تستدعي التأجيل

1. **غياب مالك حي للرسم الإضافي القياسي للمخالفات**:
   - بيانات العملاء مفعّلة بالكامل في `Partner` (`No`، `Name`، `Email`، `BranchId`) و`PartnerBillingInfo` (`RentalSalikSurcharge`، `LeaseSalikSurcharge`، `RentalFineSurcharge`، `LeaseFineSurcharge`، `RentalDarbSurcharge`، `LeaseDarbSurcharge`).
   - الرسم القياسي لسالك ودرب مفعّل في `/Settings/eSalik` (`MasterSalikSettings.SurchargeValue`) و`/Settings/eDarb` (`MasterDarbSettings.Surcharge`).
   - في المقابل، توجد ثلاث كيانات متداخلة لإعدادات المخالفات في الخلفية (`FineSettings` بلا حقل رسم إضافي، و`SettingsFinesModel.Surcharge` و`FineDownloadSettings.SurchargeAmount` غير مربوطين بأي صفحة إعدادات حيّة؛ صفحة `/Settings/finesSettings` الحالية تدير ملفات المرور فقط).
2. **قرارات مطلوبة عند الاستئناف**:
   - توحيد مالك الرسم الإضافي القياسي للمخالفات في الإعدادات (ضمن الشريحة الأولى من [خطة تطوير المخالفات وسالك ودرب](../FINES_TOLLS_INTEGRATION_MAINTENANCE_EVOLUTION_PLAN.md)).
   - حسم تفسير القيمة الفارغة (`null`) في بطاقة العميل مقارنةً بـ `0.00` (في عملاء الشركات القيمة الافتراضية `null` بينما في الأفراد `0`).
   - حسم هل يُضاف قسم/تبويب ثالث لدرب (`MasterDarbSettings.Surcharge`) أم يُكتفى بقسمي سالك والمخالفات كما في Speed.

## الإجراء المُنفّذ في هذه الشريحة

- حُدّث بند `sideMenu.reportss.surchargeVarianceReport` تحت `sideMenu.reportss.groups.financeExpenses` في `sidebar-menu-data.ts` بحذف الرابط المؤقت `/Account` وتعيين `soon: true` (يظهر غير نشط بشارة `Soon` / `قريبًا`، وغير قابل للنقر أو التثبيت في الاختصارات، ويُخفى عند عدم التصريح للمجموعة الأب).
- أُضيفت تغطية هذا البند في اختبارات القائمة الجانبية (`sidebar-menu.component.spec.ts` و`menu-catalog-access.spec.ts`).
- لم يُجرَ بناء أو اختبار تنفيذًا لتوجيه المالك الصريح.

## شرط الاستئناف

توحيد إعدادات المخالفات وإتاحة الرسم الإضافي القياسي للمخالفات عبر مالك حي في الإعدادات، مع حسم قاعدتي `null` و`Darb` أعلاه.
