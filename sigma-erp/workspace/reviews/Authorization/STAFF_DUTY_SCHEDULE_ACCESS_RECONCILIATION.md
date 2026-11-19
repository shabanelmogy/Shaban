# مطابقة صلاحيات جدول دوام الموظفين — البند ١٥٧

| البند | القيمة |
|---|---|
| Status | اكتمل التنفيذ والبناء المحلي، وطُبّق مخطط فرع التنفيذ على هوست التجربة |
| Owner verification pending | yes |
| التاريخ | 2026-11-13 |
| النطاق | `/StaffDutySchedule` (`StaffDutySchedule`)، وكيان `Attendance` المشترك، و`AttendanceService` و`PayrollRunService` |
| المراجع | [الاكتشاف](STAFF_DUTY_SCHEDULE_ACCESS_DISCOVERY.md) · [العقد المجمد](STAFF_DUTY_SCHEDULE_ACCESS_CONTRACT_FREEZE.md) |

## مقارنة Speed وOdoo مقابل Sigma

| المحور | Speed المرجعي | Odoo المرجعي | تبني Sigma الحالي |
|---|---|---|---|
| الوصول والصفحة | `Pages.Tenant.Staff.EmployeeDutySchedule` (`HRM.EmployeeDutySchedule`) بلا قيد فرع أو كشف منفصل للصلاحية | غير موجود في النواة المرجعية | مسار `/StaffDutySchedule` مقيد بسياسة `staffDutyScheduleAccess.read` (`Staff.GetStaffDutySchedule` + `Staff.Lookup`) و`RouteAccessPolicyRegistry` و`firstAllowedRoute` |
| وضع القراءة مقابل التعديل | لم يفصل تحميل الورديات عن القراءة | غير مطبق | القراءة لا تطلب `Shift/GetSelect` إلا لحاملي منح الحفظ (`Staff.SaveStaffDutySchedule` + `Shift.Lookup`) مع فرع قابل للتسجيل واحد على الأقل (`canLoadShiftLookup`)؛ في وضع العرض فقط تظهر القيم نصًا وتُقفل أدوات التعديل والحفظ |
| نطاق الفرع والتعارض | بلا عزل فرع تنفيذ على الحضور | عزل شركة أساسي | `Attendance.BranchId` إلزامي ثابت تاريخيًا (`BranchScopeRegistry.Direct<Attendance>` و`CK_Attendance_BranchId`)؛ القراءة تعرض فرع التنفيذ المحدد فقط بينما يرفض الحفظ تعارض اليوم عبر الفروع (`409 AttendanceDuplicateDay`) أو تغيّر `AttendanceId` (`409 StaffDutyRowChanged`) أو ما بعد نهاية الخدمة (`409 PayrollExitCutoff`) |

## مطابقة المسارات والصلاحيات

| السطح | الدليل من المصدر | الحالة |
|---|---|---|
| المسار والبحث والقراءة | `staffDutyScheduleAccess.read` في `route-access-policy.ts` و`firstAllowedRoute` و`tsconfig.app.json`؛ `GET Staff/DutySchedule` مصنف ضمن `BranchOperationRules.WholeDocumentReads` مع اشتراط `Staff.Lookup` | مؤكد مصدرّيًا |
| الفلاتر المعتمدة | `GetStaffDutyScheduleAsync` يقبل فقط `month` و`staffId` و`branchId` (مباشرة أو داخل `Filters`) ويرفض أي مفتاح إضافي بمفتاح `StaffDutyInvalidFilter` | مؤكد مصدرّيًا |
| الحفظ والتعديل | `POST Staff/DutySchedule` يشترط `Staff.SaveStaffDutySchedule` + `Staff.GetStaffDutySchedule` + `Staff.Lookup` + `Shift.Lookup` و`DemandExecutionBranchAsync(request.BranchId, forWrite: true)` وفحوص `StaffDutyInvalidBatch` و`PayrollExitCutoff` والتعارض عبر الفروع | مؤكد مصدرّيًا |
| نطاق `Attendance` | `Attendance.BranchId` غير فارغ، FK `DeleteBehavior.Restrict`، قيد `[BranchId] > 0`، نطاق `BranchScopeRegistry.Direct<Attendance>` وحارس `ValidateExecutionBranchInvariantAsync<Attendance>` في `SiGmaDbContext` مع بقاء `IsAbsent` محفوظًا دون تغيير | طُبّق المخطط على هوست التجربة |
| المنفذ الموروث `Attendance.StaffDutySchedule` | مضاف إلى `WholeDocumentReads` مع اشتراط `Staff.Lookup` في `PermissionPrerequisites` دون فتح شاشة `Attendance` | مؤكد مصدرّيًا |
| الكتابة والقراءة المباشرة لـ`Attendance` و`PayrollRunService` | `AttendanceService` يفرض فرع العمل الحالي عند الإنشاء و`AllowsWrite` عند التعديل ويفحص الازدواج عبر الفروع (`IgnoreQueryFilters`)؛ `PayrollRunService` يستدعي `DemandCompleteAttendanceScopeAsync` لحماية خصومات الغياب والتسوية النهائية | مطابقة تبعية مشتركة |
| شاشة الأدوار والترجمة والدليل ومواصفات المصدر | مفاتيح `Staff.GetStaffDutySchedule` و`Staff.SaveStaffDutySchedule` مترجمة في `authorization.ts`، ونصوص الواجهة في `en.ts`/`ar.ts`، وتحديث `staff-guide.ts`، وكتابة مواصفات `xUnit` و`Jasmine` | مؤكد مصدرّيًا |

## الطلبات والمخرجات ودورة الجلسة والمسودة

| المحور | التنفيذ المصدرّي | الحراسة |
|---|---|---|
| خيارات الفرع | `CurrentBranchService.options` و`defaultBranchId` دون طلب إضافي أو `Branch.Lookup` | استعراض الفرع لا يمنح الكتابة (`canTransact: false`)؛ يتوقف البحث إذا تعطل تحميل الفروع وتتوفر إعادة المحاولة |
| قوائم الموظفين والورديات | `Staff/GetSelect` لـ`canRead()`، و`Shift/GetSelect` فقط عند `canLoadShiftLookup()` | إغلاق `Shift/GetSelect` تمامًا في وضع القراءة فقط، وإلغاؤه عبر `shiftCancelled`/`denied$` عند فقد منح الكتابة دون إبقاء خطأ ورديات عالقًا |
| التحميل والحفظ وإعادة القراءة | `GetSchedule` يمرر `BranchId` مع إلغاء القراءة عبر `sessionEnded` و`searchCancelled` و`denied$`؛ `SaveSchedule` يمرر `HttpContext(CAN_PRESENT_API_OUTCOME, mayPresent)` و`X-Skip-Success-Toast` ويتحقق من `draftVersion` | الحفظ المرسل يكمل على الخادم؛ إن استُبدلت الجلسة أو سُحب الحفظ تبقى النتائج محجوبة عن التنبيهات (`mayPresent`)، وإن سُحبت القراءة تُفرّغ الصفوف فورًا (`clearResult`) |
| سحب الصلاحية والمسودة | احتساب `retainedDraft = hasChanges() && !canWrite()` مع `discardRetainedDraft()` و`canDeactivate()` | لا تُمسح مدخلات المستخدم الصامتة قسرًا عند فقد الكتابة، مع إتاحة التجاهل الصريح وفك حظر المغادرة |

## البناء والقبول التشغيلي

- نجح البناء المحلي للخادم والواجهة بعد [معالجة ملاحظات المراجعة](AUTHORIZATION_157_SOURCE_REVIEW_20261113.md). شمل التحقق اللاحق بناء مشروع البيانات بإعداد Release وتوليد SQL للهجرة وتطبيقها على هوست التجربة. تظل اختبارات التطبيق وتجربة الشاشات معلّقة.
- قبول التشغيل الفعلي والمرئي معلّق لدى المالك لاختبار: وضع العرض فقط (عدم استدعاء `Shift/GetSelect`)، وفرع استعراض فقط (`canTransact: false`)، وتعارض اليوم عبر الفروع (`409 AttendanceDuplicateDay`)، وتعديل صف محفوظ بعد السحب الجزئي للصلاحيات، ومنع حساب الرواتب عند وجود غياب أو دوام بعد نهاية الخدمة في فرع محجوب.

## هجرة فروع تنفيذ حركات الموظفين

طُبّقت الهجرة **`20261113070842_AddStaffExecutionBranchAccess`** في ١٣ نوفمبر ٢٠٢٦ على قاعدة العمليات التجريبية `db_a82a9c_sigmaoperations1` على `SQL5106.site4now.net`، بدءًا من `20261111203606_CollectionMovementReceivingBranchIndex20261111`. جمعت متطلبات المخطط للبنود ١٥٤–١٥٧ في هجرة واحدة لفرع التنفيذ. [ملف الهجرة](../../SigmaBackend/SiGma.DataAccess/Migrations/20261113070842_AddStaffExecutionBranchAccess.cs) · [لقطة EF](../../SigmaBackend/SiGma.DataAccess/Migrations/SiGmaDbContextModelSnapshot.cs)

أُضيف `BranchId` مؤقتًا كحقل يقبل الفراغ ثم أُسندت السجلات التجريبية إلى فرع الموظف الحالي إذا كان نشطًا ومن نفس الشركة. استخدمت خمسة سجلات إضافي الفرع النشط صاحب أقل معرّف داخل شركتها لعدم توفر فرع الموظف الحالي. يتوقف التطبيق داخل المعاملة إذا تعذر إيجاد فرع صالح. بعد الإسناد أصبح الحقل إلزاميًا في الجداول الثلاثة، وأضيفت فهارس الفرع ومفاتيحه الخارجية، وقيدا الفرع الموجب للحضور والإضافي.

| الجدول | السجلات قبل وبعد | بلا فرع صالح بعد التطبيق |
|---|---:|---:|
| `Attendance` | ١٤ | ٠ |
| `Overtime` | ١٦ | ٠ |
| `StaffTimesheet` | ٢ | ٠ |

راجعنا SQL المولّد بين معرّفي الهجرتين قبل تنفيذ `dotnet ef database update 20261113070842_AddStaffExecutionBranchAccess`. أكد فحص SQL بعد التطبيق تسجيل الهجرة في `__EFMigrationsHistory`، وإلزامية أعمدة الفروع الثلاثة، وتفعيل المفاتيح الخارجية وقيود التحقق، وبقاء فهارس التفرد السابقة للحضور والإضافي. أي قاعدة أخرى تحتاج الهجرة نفسها قبل تشغيل النسخة التي تستخدم هذه الحقول.

آخر بند مؤكد في الجرد هو ١٥٧. التالي `Item`.
