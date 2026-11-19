# ربط حالة الموافقات في الموظفين والمخزون والأصول والخدمات

| البيان | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-11-15 |
| العقد | ملحق «استكمال الدورة من الإعدادات إلى إجراء كل شاشة» في ERP_APPROVAL_IMPLEMENTATION_CONTRACT_FREEZE.md |
| التحقق | فحص المصدر وفروق الملفات. تجميع التكامل عند الجذر. قبول المتصفح والاختبارات وقاعدة البيانات معلق |

## تغطية الأنواع والشاشات

المسارات أدناه نسبة إلى `SiGmaAngularFrontEnd/src/app/modules`. أُضيفت الإجراءات إلى `ActionList<Row>` الحالي باستعمال `injectApprovalStatusAction` الذي يفتح نافذة المراحل المشتركة. يعيد التنفيذ فحص صلاحية قراءة المستند وعضوية الصف في النتيجة الحالية والانشغال. يحدد الخادم صلاحية بدء المحاولة وقرار المرحلة الحالية.

| نوع الكتالوج | الشاشة الإنجليزية والمسار | مالك الإجراء | صلاحية العرض | النتيجة المصدرية |
|---|---|---|---|---|
| `Attendance` | Attendance، `/Attendance` | `HRM/Attendances/Attendance/components/list/list.component.ts`، `actions` | `Attendance.View` | أُضيف الإجراء للصف المحفوظ مع سياق جلسة القائمة |
| `StaffTimesheet` | Staff Timesheet، `/StaffTimesheet` | `HRM/Attendances/StaffTimesheet/components/list/list.component.ts`، `actions` | `StaffTimesheet.View` | أُضيف الإجراء لسجل الساعات المحفوظ |
| `Overtime` | Overtime records، `/Overtime` | `HRM/Overtimes/Overtime/components/list/list.component.ts`، `actions` | `Overtime.View` | أُضيف لصفوف تبويب السجلات اليومية. صف تشغيل معالجة الإضافي يخص مورداً آخر وهو خارج صفوف هذا النوع |
| `Leave` | Leaves، `/Leave` | `HRM/Leaves/Leave/components/list/list.component.ts`، `actions` | `Leave.View` | أُضيف بجانب إجراءات الإجازة الأصلية. يقرأ المراحل دون تغيير دفتر الإجازات عند العرض |
| `Deduction` | Deductions، `/Deduction` | `HRM/Deductions/Deduction/components/list/list.component.ts`، `actions` | `Deduction.View` | أُضيف لصف المستند في القائمة الحالية |
| `PayrollRuns` | Processed Payrolls، `/ProcessedPayrolls` وواجهة `/SalaryVoucher` الحالية | `HRM/Payroll/Payrolls/components/list/list.component.ts`، `actions` | `PayrollRuns.Get` مع `PayrollRuns.List` للشاشة | أُضيف لمعرف مسير الرواتب الحقيقي، مع استمرار إجراء الصرف عند مالكه |
| `ItemRequisition` | Item Requisitions، `/ItemRequisition` | `Stock/ItemRequisition/components/list/list.component.ts`، `actions` | `ItemRequisition.View` | أُضيف بجانب إنشاء طلب الشراء والصرف، ويعيد فحص سياق الشاشة |
| `ItemIssue` | Item Issues، `/ItemIssue` | `Stock/ItemIssue/components/approval-cycle/approval-cycle.component.ts` و`.html` | `ItemIssue.View` | النافذة الأصلية موجودة. أُدرج `DocumentApprovalWorkflowPanelComponent` داخلها لعرض المراحل واتخاذ قرارها |
| `ItemReturn` | Item Returns، `/ItemReturn` | `Stock/ItemReturn/components/approval-cycle/approval-cycle.component.ts` و`.html` | `ItemReturn.View` | النافذة الأصلية موجودة وأُضيفت لوحة المراحل داخلها |
| `StockTransfer` | Stock Transfers، `/StockTransfer` | `Stock/StockTransfer/components/approval-cycle/approval-cycle.component.ts` و`.html` | `StockTransfer.View` | النافذة الأصلية موجودة وأُضيفت لوحة المراحل داخلها |
| `Asset` | Assets، `/asset` | `Assets/asset/components/list/list.component.ts`، `actions` | `Asset.View` | أُضيف الإجراء مع شرط ملكية نتيجة القائمة والجلسة |
| `DepreciationEntry` | Depreciation، `/depreciation` | `Assets/depreciation/components/list/list.component.ts`، `approvalActions` | `Depreciation.Prepare` | أُضيف للسطر المحفوظ بواسطة `depreciationEntryId`. تستخدم القراءة المركزية إذن صفحة تجهيز الإهلاك التي أثبتت ظهور هذا السطر |
| `VehicleServiceBooking` | Service Bookings، `/FleetServiceBookings` | `Fleet/ServiceBookings/components/list/list.component.ts`، `actions` | `VehicleServiceBooking.View` | أُضيف مع `isCurrentRow` وحالة الانشغال الحالية |
| `Accident` | Accidents، `/FleetAccidents` | `Fleet/Accidents/components/list/list.component.ts`، `actions` | `Accident.View` | أُضيف مع `isCurrentRow` وحالة الانشغال الحالية |
| `CustomerRequest` | Customer Requests، `/CustomerRequest` | `Administration/CustomerRequests/components/list/list.component.ts`، `actions` | `CustomerRequest.View` | أُضيف مع صلاحية قائمة الطلبات وعضوية الصف في البيانات |
| `SupportRequest` | Support Requests، `/SupportRequest` | `Support/SupportRequest/components/list/list.component.ts`، `actions` | `SupportRequest.View` | أُضيف إلى صف الطلب المحفوظ |
| `DataEntryCorrection` | Correction Requests، `/DataEntryCorrection` | `Data Entry Corrections/shared/correction-workspace.component.ts`، `actions` | `DataEntryCorrection.View` | أُضيف في وضع طلب التصحيح. وضع تعريف نموذج التصحيح يحتفظ بإجراءاته الحالية |
| `DriverTimeSheet` | Driver Time Sheet، `/DriverTimeSheet` | `Rental/DriverTimeSheet/components/list/list.component.ts`، `approvalActions` وعمود الإجراءات في `.html` | `DriverTimeSheet.View` | أُضيف لكل سجل يوم محفوظ بمعرفه الحقيقي. تظهر الإضافة قبل خلايا اليوم والسائق، ويُمنع فتح الإجراء أثناء مسودة ساعات معدلة |
| `VehicleExpense` | لم يثبت مستهلك واجهة مستقل | البحث المحصور في `Fleet` ثم مرجع الاسم في وحدات التطبيق | `VehicleExpense.View` | وجد اسم النوع في ترجمة الكتالوج فقط. العرض المركزي متاح. يلزم إثبات شاشة المستند الفعلية قبل إضافة زر يحمل هوية صحيحة |
| `ChangeRequestModel` | لم يثبت مستهلك واجهة مستقل | البحث المحصور في وحدات التطبيق ومسارات الصفحات | `ChangeRequestModel.View` | وجد اسم النوع في ترجمة الكتالوج فقط. العرض المركزي متاح. لا يُنسب إلى شاشة نماذج التصحيح التي تستهلك نوعاً آخر |

تُراجع الأنواع `SalaryVoucher` و`TrafficFine` و`Provision` ضمن عمل الماليات، والنوع `TimeSheet` ضمن الشاشة القائمة لتأجير المعدات. مالك التحضير للبيع `EquipmentSalePreparation` داخل Sales/Fleet في عمل العمليات. لا تكرر شاشة مسير الرواتب نوع سند الرواتب التاريخي.

## هوية قيد الإهلاك

يثبت `SigmaBackend/SiGma.Business/Services/AssetsServices/DepreciationService.cs` في `BuildReportAsync` تطابق كل سطر مع أصل وفترة محددين. يرفض تكرار اللقطات لنفس الأصل، ويقرأ `savedByAsset.TryGetValue(asset.Id, out saved)`. أضاف الجذر المعرف `DepreciationEntryId = saved?.Id` إلى إسقاط السطر. يستهلك محول الإجراء المعرف المحفوظ ويحتفظ بـ`assetId` لعرض الأصل. الصف التحضيري غير المحفوظ ينتظر حفظه وقراءة هويته من الخادم.

## التحميل والصلاحيات ودورة النوافذ

تستخدم الإجراءات الجديدة نافذة المراحل المركزية التي يملكها الجذر، وقراءةً مباشرة عند فتح السجل. لا تطلب القائمة سياق اعتماد لكل صف عند البحث. لا يوجد كاش جديد أو مقترح فهرس ناتج عن إضافات هذه الواجهة.

تحتفظ نوافذ المخزون الثلاثة بقراءة الحالة الأصلية وتضيف قراءة لوحة المراحل في نفس النافذة. تجمع `workflowPending` مع انشغال القراءة والقرار الأصلي، وتتوقف إجراءات المصدر أثناء قراءة أو كتابة اللوحة. تضبط إشارة `changed` إعادة قراءة المصدر بعد كتابة مرحلة ناجحة فقط. يحمل `refreshKey` سجل المصدر الفعلي لتحديث اللوحة بعد تغير قراره، ويحرر انتظار اللوحة الانشغال دون إطلاق تحديث دوري. تظل النافذة مشغولة حتى انتهاء المالكين. توقيت الظهور والإغلاق والتزامن يحتاج قبول المتصفح.

يمرر حوار القائمة في `ItemIssue` و`ItemReturn` و`StockTransfer` القيمة `localReadProgress=true` إلى دورة الموافقة الأصلية. تعرض الدورة `StateMessage` محلياً طوال قراءة الحالة، وتمرر الخيار نفسه إلى لوحة المراحل المركزية. تحتفظ تبويبات العرض المحفوظ بالقيمة الافتراضية `false`. يلتقط الاشتراك `globalProgress` عند بدء القراءة، ويحرر `LoadingService` في `finalize` فقط إذا كان قد بدأ العداد العام. تتبع الكتابات مالكها الحالي. ملفات قوالب القائمة الثلاثة جزء من نطاق تجميع التكامل.

## أدلة المرجع الوظيفي

قُرئت شروحات Speed المؤرخة في ٢٨ أكتوبر ٢٠٢٦ أولاً، ثم شريحة الكود المقابلة من `references/speed-analysis/2026-10-28/readable/controllers`. تشمل المصادر الحضور `C1577`، دوام الموظفين `C1617`، الإضافي `C1598`، الخصومات `C0373`، الإجازات `C1589`، المسيرات `C0383`، طلبات المخزون `C1707`، الصرف `C1679`، المرتجع `C1682`، التحويل `C1712`، حجز الخدمة `C1206`، الحوادث `C0468`، الأصول `C0584`، الإهلاك `C0596`، ساعات السائق `C0780`، طلب العميل `C0328`، والتصحيح `C0338`. مصدر كل رمز هو الملف الوحيد الذي يبدأ به تحت المجلد المذكور. تثبت هذه المصادر أفعال الشاشة الأصلية، ويحدد عقد Sigma الحالي عرض المراحل المركزية وصلاحياتها. لم يتطلب ربط العرض الحالي حسم قاعدة أعمال إضافية من مرجع Odoo.

## دليل الاستخدام والتحقق

أضيفت خطوة عربية وإنجليزية لفتح حالة الاعتماد ومشاهدة المراحل وبدء المحاولة واتخاذ قرار المرحلة عند الأهلية في ملفات أدلة `hrm-guide.ts` و`hrm-leaves-topics.ts` و`stock-guide.ts` و`assets-guide.ts` و`fleet-guide.ts` و`administration-guide.ts` و`support-guide.ts` و`data-entry-corrections-guide.ts`. يتابع مالك العمليات خطوة Driver Time Sheet في `rental-guide.ts` لتفادي تداخل الكتابة.

اجتاز فحص فروق الملفات `git diff --check` دون خطأ مسافات. البناء المحصور عند الجذر. القبول المطلوب يشمل قارئاً فقط ومعتمداً معيناً باسمه أو بدوره، وصلاحية فرع العرض، وسحب المنحة أثناء النافذة، وقرارين متزامنين، ومعرف قيد إهلاك محفوظ مقابل سطر تحضيري.
