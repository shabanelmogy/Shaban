# مراجعة ومطابقة تقرير الاستخدام التفصيلي للمركبات (`/Reports/DetailedVehicleUtilizationReport`)

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-11-19 |
| العقد المجمد | [العقد المجمد](DETAILED_VEHICLE_UTILIZATION_REPORT_CONTRACT_FREEZE.md) |
| النطاق والنمط | Reports/DetailedVehicleUtilizationReport · UI07 Report · BE17 Pattern 5 Report · Tier M |

---

## الإفصاح الافتتاحي وتسلسل المراجع (Master 1 / Master 2)

- **الوضع والنطاق**: مراجعة وتنفيذ كامل لتقرير الاستخدام التفصيلي للمركبات بناءً على طلب المالك والصورتين المرفقتين، واستبدال رابط القائمة الخاطئ (`/Vehicle`) بالمسار المخصص `/Reports/DetailedVehicleUtilizationReport`.
- **الكتب والحزم**: `SIGMA_FEATURE_REVIEW_MASTER.md` (الكتل 1/2/4/5/7)، `SIGMA_UI_PATTERNS.md` (الكتل 1/3/6/17/20/21/22/23/24/25/26/27/28/29)، `SIGMA_BACKEND_PATTERNS.md` (الكتل 2/3/6/8/9/17/18). فُحصت الحزم الثماني بالأمر `Generate-SigmaRecipes.ps1 -Check` -> `8/8 OK`.
- **دليل Speed وشروحه (2026-10-27)**: فُحص `library/catalog.csv` و`Speed_Analysis_Guide.md`؛ لا يوجد شرح شاشة مستقل لهذا التقرير (`S020` صفحة عامة فقط).
- **كود Speed المؤرخ (2026-10-28 — خطوة منفصلة)**: قُرئت شاشة `sidebar/23-reports/screens/35-detailed-vehicle-utilization-report.md` والمتحكمان `C0990--tenant.views.crs.reports.detailedVehicleUtilizationReport.index.js` و`C0991--tenant.views.crs.reports.detailedVehicleUtilizationReport.vehicleUtilizationDetail.js` ومطابقة `index.cshtml` في `data/template-bindings.json` (القالب الثانوي `vehicleUtilizationDetail.cshtml` غير ملتقط).
- **وثائق Odoo 19.0 (2026-11-02)**: فُحص `references/odoo-rental/README.md` و`COMPARISON_MATRIX.md:27`؛ لا يغطي Odoo مصفوفة الاستخدام اليومي ذات الأقسام الستة (`Not applicable`).
- **المهارات**: طُبقت `.agents/skills/sigma-screen-refactor/SKILL.md`؛ فُحص توفر Superpowers محليًا وثبت عدم تثبيته (`Test-Path` = `False`).
- **حدود التحقق**: نُفّذت البناءات المحصورة وفحص الأنواع وفحص الفروق والحزم فقط؛ تبقى اختبارات التشغيل (`dotnet test`، `ng test`، `ng lint`) وخطة SQL وتجربة المتصفح الحي معلّقة للمالك، ولم تُنفّذ أي أوامر محظورة أو هجرات أو حفظ Git.

---

## جدول أدلة الصورتين ومقارنة المرجع (Master 2 / Master 4)

| الدليل | التصنيف | المتطلب الوظيفي | المالك والتنفيذ في Sigma |
|---|---|---|---|
| `media_1795108586554_0127c8b1.jpg` | Explicit | العنوان + مرشح `Month` + أزرار `Search`/`Print`/`Export to Excel` | `DetailedVehicleUtilizationReportComponent` عبر `appReportPage` و`app-feature-title` و`p-datepicker[view="month"]` و`appReportActions` و`createReportReadState` |
| `media_1795108586554_0127c8b1.jpg` | Explicit | أقسام `Overall` و`Service and Maintenance` و`Accident Repair` و`Rented` بأعمدة `Fleet` و`Average` والأيام `01`..`30` والأيام المستقبلية بشرطات | `DetailedVehicleUtilizationReportService` + 4 جداول `app-data-table` مع وضع `Total` في `footerRows` والأيام المستقبلية `null` (`—`) |
| `media_1795108586554_f2a3b584.jpg` | Explicit | قسم `Average Values` بثلاث نسب استخدام وقسم `Branch Wise Rented` لكل فرع بما في ذلك الفروع الصفرية | حساب الخادم للنسب الثلاث يوميًا وللفترة الكاملة + جدول فرعي لكل فرع نشط مسموح بصفوف `Short Term`/`Long Term`/`Leasing` و`Subtotal` في `footerRows` |
| `C0990` / `C0991` (Speed) | Partial / Gap | نافذة `vehicleUtilizationDetail` عند النقر على اليوم | مستبعدة كفجوة موثقة لعدم ظهورها في الصورتين وعدم التقاط قالبها في حزمة Speed (الأعمدة غير مثبتة) |
| `FleetType` في Sigma مقابل Speed | Reviewer decision (Master 2 Rule 6) | صف `Lease Fleet` في الأقسام 2 و3 و4 | لا يوجد `FleetType.Lease` في `SiGma.Helpers/Enum/FleetType.cs`؛ يعرض `Rental Fleet` مركبات `FleetType.Rental`، ويعرض `Total` إجمالي القسم كله، ويبقى `Lease Fleet` غير متاح (`—`) مع ملاحظة توضيحية دون اختراع صفر كاذب |
| عمود `Average` في الأقسام 2–6 | Correction over Speed | كان Speed يعرض `0.00` في كل الأقسام عدا `Overall` | يحسب الخادم في Sigma متوسطًا حقيقيًا لكل صف (متوسط عدّ منزلتين، ونسبة مئوية للمجموع الكلي في `Average Values`) |

---

## بوابات المطابقة (UI20 / UI22 / UI2 / Master 5 / BE17)

- **مطابقة الواجهة (`UI07 Report` — تابات وتقسيم فروع داخلي بلا تكرار عنوان بقرار المالك 2026-11-19)**: استُخدمت المكونات المشتركة فقط (`ReportPageComponent`، `ReportActionsComponent`، `FeatureTitleComponent`، `PrimaryActionButtonComponent`، `EditorTabsComponent` بمظهر `workspace`، `FormSectionComponent` للطباعة فقط، `DataTableComponent` مع `footerRows`، `FieldErrorComponent`، `StateMessageComponent`، `DatePickerDirective`، `ListboxModule`، `BadgeModule`، `createReportReadState`). أُضيفت الأداة المشتركة `.sigma-print-only` في `src/styles.scss` بدلًا من `d-none d-print-block` المتقاعدة وغير المحمّلة في التطبيق؛ فلا يتكرر عنوان أي تاب من التابات الستة ولا عنوان الفرع المختار داخل اللوحة على الشاشة وتظهر العناوين في الطباعة فقط مع الحفاظ على `aria-labelledby`/`aria-label`. وُثّقت القاعدة في `ui/20-report-page.md` و`ui/21-report-print.md` ومهارة `sigma-screen-refactor` مع إعادة توليد الحزم المشتقة وفحصها. تُطبع الأقسام الستة وكل الفروع كاملة عبر `ReportPrintService` و`sigma-print-flow`، ويصدّر Excel التقرير كاملًا.
- **بوابة التحميل (`UI22`)**: يملك `createReportReadState` قراءات `Options` و`Read` و`Print` و`Export` عبر مؤشر تحميل الصفحة الواحد (`LoadingService`) مع إلغاء عند تغيير الجلسة أو الصلاحية أو الشهر المختار وإغلاق منبثق اختيار الشهر (`monthPicker.overlayVisible = false`).
- **بوابة التخزين المؤقت (`UI2`)**: يستدعي التقرير مساري `DetailedVehicleUtilizationReports/Options` و`Read|Print|Export` كقراءات تشغيلية مباشرة؛ لا توجد قوائم مرجعية مشتركة تتطلب تسجيل كاش مرجعي.
- **بوابة الأداء والاستعلامات والفهارس (`Master 5` / `BE2` / `BE7` / `BE17`)**:
  - لا توجد حلقات `N+1` على الأيام أو المركبات: يُقرأ خط الأساس قبل بداية الشهر في استعلام واحد + أحداث `VehicleStatus` داخل الشهر في استعلام واحد، وتُقرأ العقود وحركات `WorkshopMovement` و`NRM` بشرطية عند وجود مركبات في تلك الحالات فقط، مع سقف أمان (`10,000` مركبة، `2,000` فرع، `200,000` حدث).
  - تستخدم الاستعلامات `QueryReport<T>()` المقيّدة بالمستأجر والفرع (`WholeDocumentReads`) والحذف المنطقي، وتستفيد من فهارس `VehicleStatuses(SubscriptionId, VehicleId, CreatedAt, Id)` القائمة دون طلب هجرة أو تعديل مخطط جديد. تبقى قياسات زمن التنفيذ وخطط SQL الفعلية معلّقة لقبول المالك.
- **AutoMapper والهجرات**: لا حاجة لملف AutoMapper (إسقاطات يدوية محكمة إلى ViewModels) ولا هجرة قاعدة بيانات (`BE17`).

---

## الملفات المُنشأة والمعدّلة

### الخادم (`SigmaBackend`)
- `SiGma.ViewModels/ViewModels/DetailedVehicleUtilizationReport/{DetailedVehicleUtilizationFilterVm,DetailedVehicleUtilizationOptionsVm,DetailedVehicleUtilizationRowVm,DetailedVehicleUtilizationBranchVm,DetailedVehicleUtilizationReportVm}.cs`
- `SiGma.Business/IServices/IDetailedVehicleUtilizationReportService.cs`
- `SiGma.Business/Services/DetailedVehicleUtilizationReportService.cs`
- `SiGma.ServerAPI/Controller/DetailedVehicleUtilizationReportsController.cs`
- `SiGma.ServerAPI/Authorization/BranchOperationRules.cs` و`PermissionPrerequisites.cs`
- `SiGma.Helpers/Localization/Shared/{GeneralMessage.resx,GeneralMessage.ar-SA.resx}`
- `tests/SiGma.BranchAccess.Tests/DetailedVehicleUtilizationReportTests.cs`

### الواجهة (`SiGmaAngularFrontEnd`)
- `src/app/modules/Reports/DetailedVehicleUtilizationReport/detailed-vehicle-utilization-report.{service,format,format.spec,component}.ts` و`.component.{html,scss}`
- `src/app/modules/i18n/vocabs/detailed-vehicle-utilization-report.ts` وتحديث `en.ts` و`ar.ts`
- `src/app/modules/UserGuide/content/detailed-vehicle-utilization-report-topic.ts` وتحديث `reports-guide.ts`
- `src/app/modules/Reports/reports.routes.ts`
- `src/app/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts` (تصحيح رابط البند من `/Vehicle` إلى `/Reports/DetailedVehicleUtilizationReport`)
- `src/app/modules/shared/authorization/route-access-policy.ts`
- `tsconfig.app.json`

---

## نتائج التحقق المصرّح بها والمعلّق (`Pending Verification`)

- **بناء الخادم والاختبارات (Release)**:
  - `dotnet build "F:\My Work\Sigma\SigmaBackend\SiGma.ServerAPI\SiGma.ServerAPI.csproj" -c Release --no-restore -m:1 --disable-build-servers`: نجح (`API_REL_BUILD=0`، `0` أخطاء، `0` تحذيرات في الملفات الجديدة/المعدلة).
  - `dotnet build "F:\My Work\Sigma\SigmaBackend\tests\SiGma.BranchAccess.Tests\SiGma.BranchAccess.Tests.csproj" -c Release --no-restore -m:1 --disable-build-servers`: نجح (`TESTS_REL_BUILD=0`، `26 Warning(s)` مسبقة في اختبارات أخرى، `0 Error(s)`).
  - *ملاحظة بيئة*: تعذّر نسخ مخرجات `Debug` لأن عملية `SiGma.ServerAPI (PID 26308)` قيد التشغيل حاليًا وتقفل ملفات `bin\Debug\net10.0\`؛ يلزم إعادة بناء/إعادة تشغيل الخادم لتفعيل المسارات الجديدة.
- **بناء الواجهة وفحص المواصفات**:
  - `npx tsc --noEmit -p tsconfig.spec.json`: `DETAILED_SPEC_ERRS=0` (`0` أخطاء في ملفات ومواصفات التقرير والملفات المرتبطة، مع `TOTAL_SPEC_ERRS=57` مسبقة في وحدات غير مرتبطة).
  - `npm run build`: نجح (`NG_BUILD=0`، `Application bundle generation complete. [125.885 seconds]`، المخرجات `F:\My Work\Sigma\SiGmaAngularFrontEnd\dist\sigma`).
- **الفروق والوثائق**: `git diff --check` (`BE_DIFF=0 FE_DIFF=0`) و`Generate-SigmaRecipes.ps1 -Check` (`8/8 OK`, `RECIPE_CHECK=0`).
- **معلّق خارج حدود التحقق**: تشغيل `dotnet test` و`ng test` و`ng lint`، واختبار SQL Server الحي وخطط التنفيذ، وتجربة المتصفح والطباعة وملف Excel الناتج بعد إعادة تشغيل `SiGma.ServerAPI`.

## رسائل Commit مقترحة (للاقتراح فقط)

- **SigmaBackend**: `feat(reports): add detailed vehicle utilization monthly report API and access tests`
- **SiGmaAngularFrontEnd**: `feat(reports): implement Detailed Vehicle Utilization Report screen, export, print and guide`
