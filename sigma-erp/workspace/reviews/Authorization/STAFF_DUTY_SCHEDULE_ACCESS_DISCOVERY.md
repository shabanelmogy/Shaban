# اكتشاف صلاحيات جدول دوام الموظفين — البند ١٥٧ (`StaffDutySchedule`)

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | 2026-11-13 |
| العقد المجمد | [عقد تبني جدول دوام الموظفين](STAFF_DUTY_SCHEDULE_ACCESS_CONTRACT_FREEZE.md) |
| النطاق | `/StaffDutySchedule`، ومنافذ `Staff/DutySchedule`، ومالك بيانات `Attendance`، و`AttendanceService` و`PayrollRunService` مباشرةً |
| التحقق | المصدر فقط؛ لا بناء أو اختبارات أو هجرات أو SQL أو تجربة متصفح |

## الإفصاح والمرجع المقارن (Speed مقابل Sigma وOdoo)

| المصدر | المرجع الفعلي المقروء | ما يثبته | المقارنة مع Sigma في البند ١٥٧ |
|---|---|---|---|
| المسار والقائمة | `SiGmaAngularFrontEnd/src/app/pages/routing.ts:555-558`، `sidebar-menu-data.ts:139` | المسار `/StaffDutySchedule` والمكوّن `StaffDutyScheduleComponent`، استدعاءات `Staff/DutySchedule` و`Staff/GetSelect` و`Shift/GetSelect`. | لا يوجد مسار رديف أو عنصر قائمة مكرر؛ وحدة شاشة واحدة بنمط `UI05` (مجموعة إدخال شهرية). |
| Speed UI & Route | `04-staff-duty-schedule.md` (`R0512`, `C1584`)، `data/routes.json:11150-11165` | مسار `/hrm/employeeDutySchedule` بميزة `HRM.EmployeeDutySchedule` ومنحة وحيدة `Pages.Tenant.Staff.EmployeeDutySchedule` ومرشح الشهر والموظف وحوار بحث `C0708` وحفظ `SaveSchedule` مع شرط إقران `in1->out1` و`in2->out2` في الواجهة. | تفصل Sigma العرض عن الحفظ بمنحتي `Staff.GetStaffDutySchedule` و`Staff.SaveStaffDutySchedule` + فرع التنفيذ على `Attendance`. منتقي الموظف البسيط (`Staff/GetSelect`) بدل حوار `C0708` هو فجوة وظيفية قائمة كنظيره في البند ١٥٦؛ وتُبقى Sigma فترات الدخول/الخروج المستقلة وحقول الوردية المعتمدة حاليًا (`staff-guide.ts:110`، `list.component.spec.ts`). |
| Odoo 19.0 | اللقطة المثبتة `0cc05c25b7614d4d448982fa7d12754ce6462c88` (راجع `reviews/HRM_CURRENT_FEATURE_REVIEW.md:54-60`) | لا يغطي الفهرس الملتقط شاشات الموارد البشرية والحضور هنا، ولا يدّعى عجز المنتج. | لا غموض صلاحيات في البند ١٥٧ يتطلب مكمّل Odoo بعد مراجعة Speed والمصدر. |

ملاحظة المنفذ الموروث `Attendance/StaffDutySchedule`: يوجد في `AttendanceController.cs:14-23` منفذ قديم للقراءة (`Attendance.StaffDutySchedule`) يستدعي `AttendanceService.GetStaffDutyScheduleAsync(month, staffId)` دون أي مستهلك في الواجهة. يبقى تحت `BranchOperationRules.WholeDocumentReads` مع اشتراط `Staff.Lookup` في `PermissionPrerequisites` وتصفية `BranchScopeRegistry.Direct<Attendance>` تلقائيًا، دون فتح تبني شاشة `Attendance` العامة المصنفة `resource-only`.

## جرد الكود الخلفي وأثر المخطط

أثبت البحث المصدري الشامل أن كل استخدامات الكيان `Attendance` في `SigmaBackend` محصورة في أربعة مواضع فقط:

1. **تعريف الكيان والمخطط**: `Attendance.cs:3-17` و`AttendanceConfig.cs:3-18` (لا يملكان `BranchId` حاليًا؛ المفتاح الفريد الفعلي هو `("SubscriptionId", "StaffId", "AttendanceDay", "AttendanceDeletedKey")` بفلتر `[StaffId] IS NOT NULL`).
2. **خدمة جدول الدوام**: `StaffService.GetStaffDutyScheduleAsync` (`1653-1774`) و`SaveStaffDutyScheduleCoreAsync` (`1790-1964`): تفتقر حاليًا لقائمة بيضاء للمرشحات، ولا تشترط `BranchId` أو تفحص `AllowsRead`/`AllowsWrite`، ولا تستبعد أيام الفروع الأخرى في العرض، ولا تتحقق من التعارض عبر الفروع (`IgnoreQueryFilters()`), أو تطابق `AttendanceId`, أو حد نهاية الخدمة `PayrollExitCutoff`, كما تغفل تمرير `BranchId` عند إعادة القراءة بعد الحفظ (`1936-1942`).
3. **خدمة الحضور العامة CRUD**: `AttendanceService.cs` (`SaveBatchAsync:138-227` و`GetStaffDutyScheduleAsync:30-95`): تحتاج إضافة `BranchId` إلزاميًا عند الإنشاء من فرع العمل الحي للمستخدم (`DemandWorkingBranchAsync`), والتحقق من `AllowsWrite` على الفرع المحفوظ عند التعديل، وفحص تكرار `(SubscriptionId, StaffId, Date)` عبر الفروع باستخدام `IgnoreQueryFilters()`.
4. **خدمة الرواتب**: `PayrollRunService.cs` (`CalculateCoreAsync:570-571` للغياب، و`599-600` لفحص وجود حضور بعد آخر يوم عمل في التسوية النهائية): يلزم إضافة حارس اكتمال النطاق `DemandCompleteAttendanceScopeAsync` (على غرار `DemandCompleteOvertimeScopeAsync` في البند ١٥٦) لمنع حساب رواتب ناقص أو تجاوز قيد نهاية الخدمة بسبب صفوف حضور مخفية في فروع لا يملك المستخدم قراءتها.

قرار المالك المعتمد: `Attendance` سجل حركة له `BranchId` إلزامي وثابت تاريخيًا (مثل `Overtime` و`StaffTimesheet`)، يستلزم هجرة مالك مقترحة `AddAttendanceExecutionBranchAccess` مع افتراض بيانات بداية نظيفة.

## مصفوفة المصادر والكاش والتزامن (`UI2`)

| المصدر | التصنيف | مالك التحميل والإلغاء والعرض |
|---|---|---|
| `GET Staff/DutySchedule` | قراءة تشغيلية مباشرة بلا كاش | `loadingSchedule` (مؤشر الصفحة) + `errorMessage` محلي؛ تلغى القراءة عند فقد `read` أو تغير `dataContext` أو بحث أحدث أو انتهاء الجلسة (`sessionEnded` / `searchCancelled` / `access.denied$`). |
| `POST Staff/DutySchedule` | كتابة تشغيلية مباشرة بلا كاش | مؤشر التحميل العام `loading.startLoading()/endLoading()` + `saving`؛ ترسل مع `X-Skip-Success-Toast: 'true'` و`CAN_PRESENT_API_OUTCOME`؛ رسالة نجاح واحدة عبر `MessageService` عند `mayPresent()`. لا تُلغى عند سحب المنحة بعد الإرسال؛ استهلاك المسودة الأصلية مقيد بتطابق `ownsSession()`, `loadedFilter()`, و`draftVersion`. |
| `GET Staff/GetSelect` | مرجع مباشر غير مخزّن (`StaffService.cacheSelect = false`) | `loadingLookups` + `ReferenceLookupStatus` + Retry؛ يُجلب مع منحة القراءة (`Staff.Lookup` مشترطة)، ويُفرَّغ فور سحب القراءة. |
| `GET Shift/GetSelect` | مرجع مباشر غير مخزّن (`ShiftService.cacheSelect = false`) | يُجلب **فقط** عند توفر منح الحفظ الكاملة (`Staff.SaveStaffDutySchedule` + `Shift.Lookup`) ووجود فرع واحد على الأقل قابل للتسجيل (`canTransact: true`)؛ لا يُطلب نهائيًا في وضع الاستعراض فقط (UI15)، ويُفرّغ فور سحب حق الكتابة، ويعاد جلبه عند الترقية أو تغير `semanticRevision`. |
| `CurrentBranch.options()` | سياق الجلسة القائم | من `CurrentBranchService` القائم؛ لا طلب HTTP موازٍ ولا اشتراط `Branch.Lookup`؛ الفروع غير القابلة للتسجيل قابلة للقراءة فقط (`canWrite = false`). |

## مصفوفة التحميل والهوية والعرض الكامل (`UI22`, `UI1`, `UI26`, `UI28`)

- **UI22**: غلاف التصفية يعرض مؤشرات الموظف والفرع وحالة المراجع في `ReferenceLookupStatus` بدون إزالة منتقي الشهر/الموظف/الفرع، والجدول الداخلي يملك حالة تحميله/خطئه عبر الصفحة؛ وضع الاستعراض فقط يعرض اسم الوردية (`savedShifts`/`row.shiftName`) وأوقات الدوام بنص صريح غير قابل للتعديل مع إخفاء زر الحفظ.
- **UI1**: تمدد اللوحة `.sigma-editor-panel--workspace` بعرض كامل داخل `sigma-route-host`، وشريط الفلاتر يتسع إلى `[mainColumns]="3"` (الشهر، الموظف، فرع التنفيذ) + أزرار البحث وإعادة التعيين المضمّنة ضمن عرض الصفحة دون تجاوز أفقي.
- **UI26 & UI28**: إغلاق الحرس عبر `route-access-policy.ts`، حجب محتوى الصفحة بـ`[hidden]="!canRead()" [attr.inert]` مع رسالة `authorization.currentAccess.denied`، وتنبيه `retainedDraft` مع زر تجاهل صريح عند سحب التحرير على مسودة متسخة.
