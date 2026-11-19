# مطابقة صلاحيات سجل ساعات الموظفين

| البند | القيمة |
|---|---|
| Status | اكتمل التنفيذ المصدرّي، وطُبّق مخطط فرع التنفيذ على هوست التجربة |
| Owner verification pending | yes |
| التاريخ | 2026-11-12 |
| العقد | [العقد المجمد](STAFF_TIMESHEET_ACCESS_CONTRACT_FREEZE.md) |
| الاكتشاف | [تتبع المصدر والشكل](STAFF_TIMESHEET_ACCESS_DISCOVERY.md) |
| النطاق | StaffTimesheet وStaffTimesheets، القائمة والمنافذ المباشرة وحوار Create/View/Edit وExcel والحذف |
| الحالة الحالية | اكتمل الدمج والتدقيق المصدري وترقية الجرد وقت التسليم (155/263). مخطط BranchId مطبّق على هوست التجربة، والقبول التشغيلي معلّق |

## العقد والمنح

يشير الاسمان الفعليان في pages/routing.ts إلى ملف stafftimesheet.routes.ts نفسه؛ لا API ثانٍ ولا حساب ساعات بديل. يستهلك سجل المسارات والقائمة والحوار مصدر staff-timesheet-access.ts الواحد. Create مستقل عن View مع Staff.Lookup وShift.Lookup، وEdit يزيد View/Update، وDelete يحتاج View/Delete. القائمة والتفاصيل والمرشحات النصية/الشهر وExcel بمنحة StaffTimesheet.View.

اختيار الموظف في فلتر القائمة مشروط بـStaff.Lookup وينشر الخادم شرط staffTimesheetStaffFilterSpecified من المالك نفسه للكتالوج والمرشح على حقل الفلتر الفعلي `staffId` فقط، بينما تحصر `StaffTimesheetService.SanitizeListSearchModel` و`ApplyListOrder` و`ApplyGridFilters` جميع فلاتر القائمة والفرز في الحقول المعتمدة للشاشة (`monthFilter`, `staffId`, `code`, `designation`, `grid`, `sortField`, `sortOrder`) مع استبعاد أي مسارات علاقات (`Staff.*`) من المرشح العام واستبعاد `Id` و`BranchId` من `GridFilter`؛ لا يحتاج staffName المعروض Lookup إضافية. لا تستخدم Create-only قائمة أو فلتر الموظف؛ مصادر التحرير إلزامية داخل حوارها، وView لا يجلبها بلا حاجة. سياق خيارات فرع الإنشاء وأهلية التسجيل على فرع كل صف (`canTransact`) يأتيان من CurrentBranch الموجود، بلا منحة Branch.Lookup أو GET مكرر.

المنافذ generic غير المستهلكة Activate/Validate/Lookup/GetAllWithNavigations/bulk مغلقة 405 وغير قابلة للإسناد؛ لا عمليات تفعيل أو استيراد أو طباعة وهمية. أعمدة القائمة: staffName/branch/code/designation/shiftName/date/workingHours/overtimeHours/month، وid وbranchId لأفعال الصف وفحص أهلية التسجيل على الفرع (`canTransact`). يطابقها ListVM بنفس الخصائص، دون graph موظف/وردية أو راتب. Detail يزيد branchId، ويعيد التسميات اللازمة للحوار؛ Create يقبل branchId مطلوبًا، وUpdate يستبعده نهائيًا. لا إعادة حساب ساعات أو تغيير date/month أو إضافة قواعد أجور ضمن هذه الشريحة.

## فرع التنفيذ والمخطط

StaffTimesheet حركة لها BranchId إلزامي وعلاقة Branch. فرعها ثابت وقت Create ومستقل عن فرع الموظف الحالي؛ لا تنقل حركة عند نقل الموظف ولا تقبل BranchId كمدخل Update. BranchScopeRegistry.Direct هو مالك استعراض/تسجيل هذا السجل، مع تحقق الفرع الحي في الاشتراك وإذن التسجيل قبل Create وUpdate/Delete. يبقى الموظف تعريفًا مشتركًا داخل الاشتراك، وتفحص مراجع Staff/Shift من الشركة نفسها قبل mapping. لا `IgnoreQueryFilters` في قراءة الأعمال كحل للتاريخ.

طُبّقت `20261113070842_AddStaffExecutionBranchAccess` على هوست التجربة. أُسند كل سجل تجريبي إلى فرع موظفه الحالي داخل الشركة التي يتبعها السجل. تبقى صلاحية قراءة السجل والتسجيل عليه مرتبطة بفرع التنفيذ المحفوظ عند تغيير مرجع الموظف أو الوردية. [نتيجة تطبيق الهجرة](STAFF_DUTY_SCHEDULE_ACCESS_RECONCILIATION.md#هجرة-فروع-تنفيذ-حركات-الموظفين)

## المرجع والمكونات

مصادر الوظيفة المقروءة: شرح Speed المحلي بتاريخ ٢٧ أكتوبر في الموارد البشرية، ثم `17-hrm/screens/12-attendance-time-sheet.md` وR0142 وC1617/C1618 بتاريخ ٢٨ أكتوبر. إثبات المصدر ليس تجربة حية؛ لا صور جديدة قُدمت. منح العرض/الإنشاء/التعديل/الحذف ومراجع الموظف/الوردية متطابقة في نطاق التبني. استيراد البصمة وتسوية الحضور المذكوران في المرجع لا يملكهما API Sigma الحالي، وهما فجوة وظيفة خارج عقد الصلاحيات لا زران جديدان. لم يبق غموض في هذه الشريحة يحتاج Odoo المكمل.

الشكل UI01 قائمة بمحرر modal، والمالكون DataTable/FilterPanel/EditorDialog/FormSection/FieldError/ConfirmationDialog القائمون. لا stylesheet أو wrapper جديد ولا تعديل للمرجع Workshop/Job. يحافظ محول الخرائط StaffTimesheetProfiler على خرائط الكتابة الحالية ويزيد إسقاط اسم Branch للقراءة فقط؛ غياب BranchId عن Update يحفظ مالك الخادم بدل Ignore/ReverseMap غير لازمين. لا أطفال ومعاملة متعددة الحفظ جديدة.

## مصفوفة التحميل والكاش

| المصدر | التصنيف والتحميل |
|---|---|
| GET StaffTimesheet | قراءة تشغيلية مباشرة؛ ترقيم وعدّ وفلاتر من الخدمة الأساسية وProjectTo محدود؛ page loader وerror/Retry |
| getAllList/fetchAllPages | نفس query/sort مع قراءة كاملة لـExcel، لا تصدير الصفحة الحالية فقط؛ page progress وإلغاء/ختم نتيجة |
| GetByWithNavigationsId | قراءة record واحدة بحوار محلي StateMessage وRetry؛ تسميات محفوظة دون lookup في View |
| Staff/GetSelect للفلتر | مباشر بلا cache opt-in في StaffService؛ page lookup loading/error/Retry بمنحته الاختيارية |
| Staff/GetSelect وShift/GetSelect للحوار | مصادر مباشرة بلا opt-in؛ dialog loading/error/Retry فقط عند Create/Edit؛ لا تسريب مصدر View بلا منحة |
| CurrentBranch.options | استثناء سياق الجلسة القائم في shell؛ خيارات writable/default ثابتة دون HTTP منافس |
| POST/PUT/DELETE | write progress العام ونتائج العملية القائمة؛ لا كاش أعمال أو إعادة إرسال تلقائية |

تستعمل شاشة المصدر الحالي triggers حية مع إلغاء القراءات والقرارات القديمة وختم session/dataContext/revision؛ لا ينفذ takeUntil على mutation مرسلة. في الحذف، يفصل المعالج بين عرض رسالة النتيجة (`mayPresent`) ومصالحة القائمة (`canReconcileList`) بحيث تتحدّث القائمة بعد نجاح الحذف داخل الجلسة والسياق نفسيهما ما دام `canView()` مسموحًا حتى لو تغيّر الإصدار أثناء الطلب، وترتبط أفعال التعديل والحذف في القائمة وزر «تعديل» في حوار العرض وتمكين الحفظ بقابلية التسجيل (`canTransact`) على فرع الصف. تحفظ مسودة الحوار تحت سحب الوصول وتخفي مخرجاته والـportals، ويظل تجاهل محلي جديد ممكنًا. لا تُعاد تعبئة مسودة سبق تحميلها فوق قيمها عند regrant، ويُغلق الحوار تلقائيًا عند استعادة الصلاحية إذا كانت عملية الحفظ المرسلة قد استُهلكت بنجاح أثناء السحب. جرى توحيد مفاتيح رسائل رفض الصلاحية (`authorization.currentAccess.denied`) وتبديل السياق (`general.screenContextChanged`) والتحديث الهادئ لخيارات الحوار المحمّلة عند تغير الإصدار الدلالي مع بقاء المنحة.

## الأداء والتحقق المعلق

Filter الشهر يظل حدًا أدنى وشهرًا تاليًا حصريًا، مع paging/order/count القائمين وإسقاط names للموظف/الوردية/الفرع بلا استعلام لكل صف. المراجع مباشرة لا كاش جديد؛ إعادة تحميلها بعد semantic revision لها مالك محدد دون تكرار في dialog المفتوح. لا قياس زمن أو SQL/EF مدعى من فحص المصدر.

الفهرس `(SubscriptionId,BranchId,Month,Date,Id)` اقتراح تقييم فقط بعد cardinality/SQL plan وفحص التداخل والمقياس الفعلي؛ فائدته المحتملة تقييد فرع/شهر وترتيب، وكلفته مساحة/كتابة. لا إضافة index مفروضة ضمن entity/config بلا دليل أداء، ولا تعديل migration بسبب هذا الاقتراح.

دليل التطبيق هو موضوع StaffTimesheet في staff-guide.ts، من /UserGuide/staff ومدخل الموظفين الحالي. حدث باللغتين لفرع التنفيذ الثابت والمنح واختيار الموظف والمسودة واستقلال الحفظ وExcel الكامل الموجود فعليًا. رُقي صفا `StaffTimesheet` و`StaffTimesheets` في `ROUTE_PERMISSION_ADOPTION_INVENTORY.json` إلى `operation-confirmed` ليصبح الجرد `155` `operation-confirmed` و`50` `resource-only` و`54` `unknown` و`2` `context-only` و`2` `alias` (`263` baseline).

كان التحقق وقت التسليم الأول مصدرّيًا. فُحص المخطط لاحقًا بعد تطبيق الهجرة على هوست التجربة. تظل اختبارات التشغيل والفروع والجلسات والواجهة المرئية معلّقة.

رسالة commit مقترحة للواجهة:
`feat(staff-timesheet): adopt operation permissions and execution branch dialog lifecycle`

رسالة commit مقترحة للخلفية:
`feat(staff-timesheet): enforce execution branch scope and lookup prerequisites`
