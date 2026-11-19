# عقد صلاحيات جدول دوام الموظفين — البند ١٥٧

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | 2026-11-13 |
| الاكتشاف | [اكتشاف جدول دوام الموظفين](STAFF_DUTY_SCHEDULE_ACCESS_DISCOVERY.md) |
| النطاق | `/StaffDutySchedule` (`StaffDutySchedule`)، ومالك بيانات `Attendance` المشترك، و`AttendanceService` و`PayrollRunService` مباشرةً |

## منح الواجهة والخادم والمتطلبات المسبقة

| السطح | المفتاح والمنفذ | المتطلبات والنطاق |
|---|---|---|
| المسار والقراءة الشهرية | `Staff.GetStaffDutySchedule`، `GET Staff/DutySchedule` | يشترط `Staff.Lookup`؛ يقرأ الشهر والموظف وفرع التنفيذ (`AllowsRead`) ويعيد صفوف `Attendance` للفرع المحدد فقط. |
| الحفظ الجزئي للشهر | `Staff.SaveStaffDutySchedule`، `POST Staff/DutySchedule` | يشترط `Staff.GetStaffDutySchedule` و`Staff.Lookup` و`Shift.Lookup`؛ يتطلب فرعًا نشطًا وصلاحية تسجيل (`AllowsWrite`) وفحوص الموظف والورديات والتاريخ ونهاية الخدمة وتطابق `AttendanceId`. |
| قائمة الموظفين والورديات | `GET Staff/GetSelect`، `GET Shift/GetSelect` | مراجع مباشرة بلا كاش؛ `Staff/GetSelect` للقراءة والحفظ (`Staff.Lookup`)؛ `Shift/GetSelect` يُطلب فقط لحاملي منح الحفظ مع فرع `canTransact` واحد على الأقل، ولا يُطلب في وضع الاستعراض فقط. |
| الفرع | خيارات `CurrentBranchService` القائمة | لا طلب HTTP إضافي ولا `Branch.Lookup`؛ القائمة تعرض فروع العرض، والتحرير والحفظ يشترطان `canTransact: true` على الفرع المحمّل. |
| المنفذ الموروث غير المستهلك | `Attendance.StaffDutySchedule`، `GET Attendance/StaffDutySchedule` | يبقى قراءة وثيقة كاملة (`BranchOperationRules.WholeDocumentReads`) بمستوى `BranchScopeRegistry.Direct<Attendance>` واشتراط `Staff.Lookup` في `PermissionPrerequisites` دون فتح تبني شاشة `Attendance`. |
| القارئ/الكاتب المباشر لـ`Attendance` | مفاتيح `Attendance` و`PayrollRuns` القائمة | `AttendanceService.SaveBatchAsync` يثبت الفرع العامل للإنشاء ويفحص `AllowsWrite` على المحفوظ ويكتشف تعارض اليوم عبر الفروع؛ `PayrollRunService` يفرض `DemandCompleteAttendanceScopeAsync` قبل استخدام `Attendance` في الغياب أو التسوية النهائية. |

## قواعد البيانات والتعارض والمخطط والواجهة

- يملك كيان `Attendance` عمود `BranchId` (`int` غير فارغ) مع علاقة `Branch` (`DeleteBehavior.Restrict`) وقيد `CK_Attendance_BranchId` (`[BranchId] > 0`) وتسجيل `BranchScopeRegistry.Direct<Attendance>(nameof(Attendance.BranchId))` وفحص `ValidateExecutionBranchInvariantAsync<Attendance>(row => row.BranchId)` في `SiGmaDbContext`. الفرع ثابت تاريخيًا لا يتغير بتعديل `Attendance` أو نقل الموظف لاحقًا.
- يبقى المفتاح الفريد الفعلي للجدول هو `("SubscriptionId", "StaffId", "AttendanceDay", "AttendanceDeletedKey")` (`[StaffId] IS NOT NULL`) أي سجل حي واحد للموظف في اليوم الميلادي على مستوى الشركة: القراءة تعرض صفوف الفرع المطلوب فقط (وتظهر أيام الفروع الأخرى فارغة)، بينما يرفض الحفظ بحالة `409 Conflict` ومفتاح `AttendanceDuplicateDay` إذا وُجد عبر `IgnoreQueryFilters()` سجل حي لنفس الموظف واليوم في فرع آخر، أو تكرار لليوم نفسه.
- `GetStaffDutyScheduleAsync` يقبل فقط `month` و`staffId` و`branchId` (مباشرةً أو داخل `Filters`) ويرفض أي مفتاح إضافي بمفتاح `StaffDutyInvalidFilter`؛ ولا يقبل ديناميكيات `grid` أو فرز.
- `SaveStaffDutyScheduleCoreAsync` يفرض `DemandDutyScheduleBranchAsync(request.BranchId, forWrite: true)` و`PayrollExitCutoff` (`409 Conflict` / `PayrollStaffExitDateExceeded`) وتطابق `row.AttendanceId` مع السجل الحي للفرع (`409 Conflict` / `StaffDutyRowChanged`) قبل أي تعديل، ويمرر `BranchId` عند إعادة قراءة الجدول بعد الحفظ؛ ويحافظ على `IsAbsent` المحفوظ دون تغييره ويحفظ الأوقات المستقلة (`In`/`Out`/`In2`/`Out2`) وفق `ClockTimePolicy` دون إقران إجباري أو تقليص دقة الثواني غير المعدلة.
- الواجهة تستخدم `staffDutyScheduleAccess` (`read` و`save`) وتسجيل `/staffdutyschedule` في `RouteAccessPolicyRegistry` و`firstAllowedRoute` وتصحيح `tsconfig.app.json` و`i18n/vocabs/{en,ar,authorization}.ts` و`UserGuide/content/staff-guide.ts` ومواصفات مصدرية (`xUnit` + `Jasmine`).
- المخطط يستلزم هجرة مالك مقترحة `AddAttendanceExecutionBranchAccess` وبيانات بداية نظيفة؛ لا تُنشأ أو تُشغّل أي هجرة أو لقطة نموذج في هذه الشريحة المصدرية.
