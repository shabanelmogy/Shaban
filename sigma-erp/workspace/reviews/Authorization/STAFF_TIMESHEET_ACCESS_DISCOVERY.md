# اكتشاف سجل ساعات الموظفين ومساراته

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | 2026-11-12 |
| العقد | [عقد تبني الساعات والفروع](STAFF_TIMESHEET_ACCESS_CONTRACT_FREEZE.md) |
| التحقق | المصدر فقط؛ المخطط والـSQL والتشغيل بانتظار المالك |

## المسارات والمرجع

يستورد `/StaffTimesheet` و`/StaffTimesheets` نفس stafftimesheet.routes.ts، وتفتح /create و/view/:id و/details/:id و/edit/:id مكوّن StaffTimesheetsComponent الذي يركب DetailsComponent داخل حوار. تتبع الخدمة AttendanceTimesheetService مصدر StaffTimesheet الحقيقي، وتقرأ GetByWithNavigationsId وتكتب POST/PUT/DELETE المصدر نفسه. ملاحظة دليل الموظفين القديمة «لا Excel» مخالفة للمصدر: القائمة تنفذ getAllList/exportExcel بالفعل، فتُصحح مع الدليل ولا يحذف الإجراء.

قُرئ Speed_Analysis_Guide.md في الموارد البشرية، ثم `17-hrm/screens/12-attendance-time-sheet.md` وR0142 وC1617/C1618 بتاريخ ٢٨ أكتوبر. يثبت المصدر تقسيم منح View/AddNew/Edit/Delete ووظائف موظف/وردية وتعديل ساعات شهرية، وأفعال استيراد بصمة وتسوية حضور لا يوفرها API Sigma الحالي. توثّق الأخيرة فجوة وظيفية مستقلة؛ لا حارس أو زر وهمي ولا endpoint مستحدث في تبني المنح. لم تُقدم صور لهذه الشريحة ولا توجد نتيجة تشغيل حية للمرجع. لا غموض إذن API متبقٍ يحتاج مكمّل Odoo.

## مصفوفة الطلبات والمالكين

| المستهلك | الطلب/المالك | الشرط/التحميل |
|---|---|---|
| القائمة والفلتر/الصفحات | AttendanceTimesheetService.getList؛ GET StaffTimesheet مع ListSmBase | StaffTimesheet.View؛ page progress ومشكلة/Retry؛ لا GET من direct Create بلا View |
| Excel الكامل | getAllList/fetchAllPages | View؛ نفس filters/sort وأقصى 100 بالطلب؛ export ليس الصفحة الحالية |
| التفاصيل في الحوار | getDetails؛ GetByWithNavigationsId | View؛ StateMessage محلي مع id/session/revision cancellation |
| الحفظ | createTimesheet/updateTimesheet | Create أو View+Update مع Staff.Lookup/Shift.Lookup؛ global write progress، sent lifetime مستقل |
| الحذف | deleteTimesheet | View+Delete وتأكيد صف حالي وفرعه المحفوظ؛ sent DELETE مستقل |
| خيارات الموظف | Staff/GetSelect | مصدر مباشر بلا cache opt-in؛ فلتر اختياري بمنحته وdialog إلزامي لمنشئ/معدل؛ لا جلب في View فقط |
| خيارات الوردية | Shift/GetSelect | مصدر مباشر بلا cache opt-in؛ dialog Create/Edit فقط، local error/loading/Retry |
| خيارات فرع الإنشاء | CurrentBranch.options/shell bootstrap | سياق الجلسة القائم، فلترة canTransact/defaultBranchId؛ لا Bootstrap HTTP منافس |

الأعمدة قبل التبني: staffName/code/designation/shiftName/date/workingHours/overtimeHours/month. بعد تثبيت الفرع يزيد branch المعروض فقط، مع id لأفعال الصف. Detail يزيد branchId/branch؛ Create يزيد branchId؛ Update لا يقبل نقل الفرع. تبقى الموظف والوردية واليوم والشهر والساعات والرمز والمسمى تحت التحقق الحالي؛ لا تجميع رواتب أو تغيير معنى Month المستقل عن Date. الساعات decimal بالمقياس الحالي، لا حقول كميات جديدة تقتضي سياسة رقمية محلية.

## ملاك التنفيذ والفروع والأداء

القائمة تستخدم DataTable وFilterPanel، والحوار EditorDialog وFormSection وFieldError وConfirmationDialog. التصنيف UI01 قائمة بمحرر modal؛ المرجع المعياري Workshop/Job، دون تعديل المرجع أو تقليد مكون خاص. العقد يوسع المستخدمين الحاليين بAccessViewPolicy/AuthSession ومعترض النتائج الموجود، لا owner صلاحيات جديد.

كان StaffTimesheet بلا BranchId ولا BranchScopeRegistry، فيكشف ويكتب ساعات الشركة كلها رغم قرار المالك تقييد الحركات. اخترنا فرع تنفيذ إلزاميًا ثابتًا عند Create وفق هذا القرار، مع CurrentBranch كمالك الخيارات وBranchScopeRegistry كمالك scope المركزي؛ لا نتبع فرع Staff الحالي لأنه تعريف قابل للنقل. يستلزم المالك migration `AddStaffTimesheetExecutionBranchAccess` قبل القبول؛ لا migration/snapshot أو تخمين فرع بيانات قديمة في التنفيذ.

Backend Pattern1: إبقاء hooks القائمة للفلتر الشهري والإسقاط المحدود، وbase paging/count/order حيث ينطبق. فحص العلاقات/الفرع/الساعات يسبق mapping، والتعديل يبقي الفرع، والمنافذ generic غير المستهلكة تغلق 405. لا صفوف أطفال ولا مبرر لمعاملة multi-save جديدة؛ قيد branch query/write تحت المالك المركزي ووحدة العمل القائمة.

الفلتر الحالي Month مع حد أعلى حصري، وStaffId/Code/Designation من generic predicate وgrid المعروض. MaterializeListAsync يستعمل ProjectTo ولا تحميل موظف/وردية لكل صف. اقتراح الفهرس المبدئي `(SubscriptionId,BranchId,Month,Date,Id)` يحتاج SQL plan/cardinality وتداخل الفهارس قبل إقراره؛ لا تطبيق schema إضافي ضمن المصدر. قياس التوقيت/الحجم/DI/EF والتزامن والتحميل المرئي متروك للمالك.

جمّد الجذر كل العقود المشتركة أولًا ثم أعاد استخدام عامل terra للقائمة وعامل terra للحوار وعامل sol للخادم تحت ملكيات غير متقاطعة. يملك الجذر key/service/models/routes/registry/prerequisites/resources/guide والتكامل والجرد. لا ترقية لأي من اسمي المسار قبل مطابقة استهلاكه؛ السيناريو الواحد لا ينشئ تلقائيًا وظيفتين مختلفتين.
