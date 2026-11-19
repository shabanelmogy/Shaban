# عقد صلاحيات سجل ساعات الموظفين — استكمال بعد البند ١٥٣

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | 2026-11-12 |
| النطاق | StaffTimesheet وStaffTimesheets يشيران إلى نفس القائمة وحوار التفاصيل وخدمة StaffTimesheet |
| التفويض | الاستمرار حتى جميع البنود؛ تبني المنح ونطاق فروع الحركات وفق قرارات المالك السابقة؛ المصدر فقط |

## الأدلة والشكل

قُرئ دليل Speed المحلي عن الموارد البشرية، ثم شاشة `17-hrm/screens/12-attendance-time-sheet.md` بتاريخ ٢٨ أكتوبر وR0142 وC1617/C1618. يثبت سجلًا للعرض والتعديل والحذف بمصادر موظف ووردية، مع استيراد بصمة وتسوية حضور في المنتج المرجعي. Sigma الحالية تحفظ سطر ساعات مستقلًا بلا API لهذين الإجراءين؛ لا يُخترعان ضمن تبني الصلاحيات، وتُسجل الفجوة. لا حساب رواتب أو ترحيل أو إذن اعتماد مستحدث. لا غموض متبقٍ يحتاج Odoo المكمل في عقد المنح نفسه.

الشكل UI01: قائمة DataTable وخيارات شهر/موظف/رمز/مسمى وحوار EditorDialog واحد، مع منافذ مباشرة تفتح الحوار. تُطبق UI1/2/6/7/10/13/15/22/26/28، وBE5/7/8/13. المرجع المعياري القائمة Workshop/Job ومالكو EditorDialog/ConfirmationDialog القائمون، مع عدم تعديل المرجع نفسه. الفصل إلى ملفات مستقلة للقائمة/التفاصيل موجود، ولا يستدعي إعادة تصميم.

## المنح والطرق

| السطح | الشرط |
|---|---|
| القائمة والتفاصيل المباشرة وExcel الكامل والمرشحات النصية/الشهر | StaffTimesheet.View |
| الإنشاء المباشر والحوار | StaffTimesheet.Create + Staff.Lookup + Shift.Lookup؛ مستقل عن View |
| التعديل | StaffTimesheet.View + StaffTimesheet.Update + Staff.Lookup + Shift.Lookup |
| الحذف | StaffTimesheet.View + StaffTimesheet.Delete وتأكيد صف حالي ونطاق الكتابة |
| اختيار موظف في فلتر القائمة أو إرسال staffId | Staff.Lookup اختيارية/شرطية فوق View؛ فقدها يمسح الفلتر المطبّق والقراءة القديمة |
| فرع الإنشاء | اختيار صريح من CurrentBranch.options حيث canTransact مع default الفرع الحالي؛ هذا سياق موجود لا يستلزم Branch.Lookup إضافية |

ينشر PermissionPrerequisites الثابت والشرطي، وسجل المسارات يستهلك staffTimesheetAccess نفسه للقائمة والحوار ومنافذ /create و/view و/details و/edit تحت الاسمين. Create-only لا يقرأ قائمة ولا خيارات فلتر محجوبة، ولا يُحبس عند الإغلاق في وجهة غير مسموحة. View لا يحمل اختيارات التحرير بلا داعٍ. لا شرط Staff.View لمجرد اختيار موظف؛ المنحة الفعلية Staff.Lookup. تغلق العمليات الموروثة بلا مستهلك مؤكد (Activate/Validate/GetSelect/GetAllWithNavigations/bulk) 405 وغير قابلة للإسناد؛ يبقى GET القائمة وبديلا التفاصيل الحقيقيان.

## فرع التنفيذ والملكية

طبّق قرار المالك العام: التعريفات مشتركة، والحركات والتقارير مقيدة بالفروع، والفرع التاريخي للحركة محفوظ وقت تسجيلها؛ البيانات الحالية تجريبية وتبدأ بالنموذج الصحيح دون حفظ روابط تجريبية عارضة. StaffTimesheet حركة ساعات، وStaff تعريف مشترك لا يصلح فرعه المتغير مالكًا تاريخيًا للحركة.

يضاف StaffTimesheet.BranchId مطلوبًا (int موجب مع علاقة Branch) ويثبت عند Create، مع تحقق فرع حي في نفس الاشتراك وBranchAccessSnapshot.AllowsWrite. لا يُشتق من فرع الموظف الحالي ولا ينتقل عند نقله. يتطلب read استعراض فرع السجل، وUpdate/Delete التسجيل على الفرع المحفوظ. يبقى BranchId خارج UpdateVM ويعرضه المحرر للقراءة فقط في Edit/View؛ لا تحويل خفي لفرع الحركة. يسجل BranchScopeRegistry.Direct<StaffTimesheet>(BranchId) الحراسة المركزية، ولا ينشأ فلتر موازٍ.

يظهر اسم الفرع في القائمة والتفاصيل ويضاف إلى ListVM بالقدر المعروض فقط. يتحقق الخادم من Staff/Shift الحيين في الاشتراك، ومن scalar/date/hours القائمين قبل mutation؛ لا يُقبل FK من شركة أخرى، ولا يضيف التبني قيد عمل/شهر جديدًا أو حساب overtime غير موجود. لا وثائق أو أطفال في هذا الأصل، وAutoMapper الحالي هو المالك مع حفظ الفرع من Update لغيابه عن مدخلاته.

هذا تغيير مخطط يستلزم هجرة مالك مقترحة `AddStaffTimesheetExecutionBranchAccess` لعلاقة BranchId الإلزامية. لا إنشاء/تعديل/تشغيل migrations أو snapshots. لا backfill أو إسناد فروع للبيانات التجريبية القديمة؛ المالك يجهز clean start أو بياناته خارج هذه الشريحة. لا يفتح API قبل تطبيق المخطط. يُقترح تقييم فهرس (SubscriptionId,BranchId,Month,Date,Id) بعد plan/cardinality؛ لا فرض فهرس بلا قياس أو تعديل schema إضافي.

## الأعمار والتحميل والعقود

حرس ثابت للجلسة dataContext وreadAuthSessionKey/observeAuthSession، وإبطال دلالي revision دون إعادة تحميل snapshot مطابق. outer trigger حي، takeUntil على القراءات/القرارات فقط؛ لا إلغاء للكتابة المرسلة. يحتفظ حوار dirty بمسودته عند سحب المنحة ويخفي مخرجاته/portals، ويتيح تجاهلًا محليًا صريحًا بعد انتهاء السياق. إعادة المنح تعيد المصادر المطلوبة دون fill فوق draft. نجاح Save تحت سحب المنحة يستهلك المسودة ولا يعيد إرسالها بعد regrant. CAN_PRESENT_API_OUTCOME يقيّد عرض النجاح/الخطأ بالختم الأصلي، ويظل التنظيف النهائي independent.

الموظف Staff/GetSelect والوردية Shift/GetSelect مصدران مباشران بلا opt-in مثبت في خدمتيهما. القائمة تحتاج الموظف فقط عند منحة فلتره، وShift يخص dialog Create/Edit. تهيئة page filter uses ReferenceLookupStatus، وحوار مصادره local loading/error/Retry؛ تجديد محتفظ صامت، ولا إدخال كاش جديد. بيانات القائمة/Excel/التفاصيل تشغيلية مباشرة مع marker كامل النتائج وfinalize/cancellation. لا POST أثناء نقص المصادر أو validation. فرع الإنشاء يستعمل owner سياق CurrentBranch الحالي ولا يكرر bootstrap HTTP.

عقود frontend: CreateDTO يزيد branchId، وUpdateDTO يستبعده ويضيف id؛ DetailDTO يزيد branchId/branch؛ ListDTO يزيد branch. لا تغيير للقيم الحالية للساعات (decimal scale الحالية) أو الشهر/التاريخ المستقلين أو الكود/المسمى. يراجع الدليل الواقع الحالي: Excel موجود فعلًا، فلا يبقى النص القديم الذي ينفيه.

## الملكيات

- الجذر: source key والمسارات وservice/models frontend، وBranchScopeRegistry وPermissionPrerequisites/Resolver وresx والترجمة والدليل والجرد والتوثيق والتكامل.
- عامل الواجهة الأول: components/list TS/HTML/spec فقط؛ يدير list/action/dialog lookup providers تحت العقد دون تعديل تفاصيل الحوار.
- عامل الواجهة الثاني: components/details TS/HTML/spec فقط؛ inputs الحالية للموظف/الوردية من القائمة، والفرع من CurrentBranch مباشرة. لا تعديل models/service/routing.
- عامل الخادم: entity وconfig وVMs وStaffTimesheetService/Profiler/Controller واختبارات تخصه فقط، دون ملفات root authorization أو migrations/resources.

لا build/tests/typecheck/lint/browser/HTTP/DB/migration/snapshot/commit/push/deploy أو Sigma MCP/Graphify. تكتب مواصفات سلوكية دون تنفيذ، وتراجع namespaces/project references والفروق لكل مستودع، ثم guide والمصالحة قبل ترقية كل صف يثبت استهلاكه (الاسمان مستهلكان لنفس الوحدة؛ لا يُحسبان منفذين مختلفين دون دليل).
