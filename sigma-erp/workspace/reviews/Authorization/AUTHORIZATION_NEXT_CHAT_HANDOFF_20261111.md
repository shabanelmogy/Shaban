# تسليم استكمال صلاحيات Sigma إلى شات جديد

[مراجعة وإصلاح البنود ٢٤١–٢٥٠](AUTHORIZATION_241_250_REVIEW_REMEDIATION_20261115.md) توثّق حراسة إقفال الفترات وكتابة الأصول ومخرجات الإهلاك حسب الجلسة. نجح فحص Angular واجتاز ٤١ اختبارًا للخادم و٨١ للواجهة. قبول قاعدة الاختبار معلّق.

[مراجعة وإصلاح البنود ٢٢١–٢٣٠](AUTHORIZATION_221_230_REVIEW_REMEDIATION_20261114.md) توثق صلاحيات سند القبض والرواتب والمخالفات ومرشحات التقارير المالية. القبول التشغيلي معلّق.

[استكمال البنود ٢٠٥ و٢٠٦ و٢٠٨ و٢١٠](NOTES_CORE_MISC_ACCESS_COMPLETION_RECONCILIATION.md) يحدّث حالة البنود الأربعة إلى مؤكدة من المصدر، مع نموذج الفاتورة المتنوعة وقائمة المقدم الضريبي. الجرد الحالي **185/263** والقبول التشغيلي معلّق.

[إعادة مراجعة ومعالجة البنود ٢٠١–٢١٠](AUTHORIZATION_201_210_REREVIEW_FIXES_20261114.md) توثق مطابقة متطلبات Bill وGRN للمعاينة والعملات، وحماية مصادر الإشعارات والجلسة والطباعة، وقصر عمليات الفواتير العامة المثبتة على المدير. الجرد **181/263**، والفاتورة المتنوعة وعقود التبني الباقية والقبول التشغيلي موضحة بالسجل. نجح ٣٦ اختبارًا للخادم و١٣ للواجهة وفحص تجميع Angular.

حُسم البندان ١٩٢ و١٩٤ بفرع محفوظ وقت الإنشاء. تطبّق الواجهة والخادم منح القراءة والتسجيل والقرار على الفرع المحفوظ. الجرد **179/263**، والهجرة معدّة والتطبيق والقبول معلقان. [سجل المطابقة](LEAVE_DEDUCTION_BRANCH_ACCESS_RECONCILIATION.md).

عولجت الملاحظات التسع لطلبات الأصناف — البند ١٦١ — في [سجل ١٣ نوفمبر](AUTHORIZATION_161_SOURCE_REVIEW_20261113.md). نجح بناء مشروع اختبارات الخادم (0 أخطاء/37 تحذيرًا)، وبناء الواجهة (152.868 ثانية)، وفحص تجميع مواصفات طلبات الأصناف الستة. لا إعادة تنفيذ لهذه الإصلاحات قبل مراجعة المصدر الحالي. المتبقي: تشغيل المواصفات وتجربة المتصفح وتكامل SQL لدورة الإنشاء ثم الاعتماد والحفظ والأقفال؛ أربع حالات حفظ موثقة بمعزل عن مزود InMemory. الجرد ثابت 160/263. تعارض ترقيم السجلات القديمة محفوظ كتاريخ؛ الاسم الحالي للبند ١٦١ هو ItemRequisition.

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | 2026-11-11 |
| الغرض | تسليم الحالة؛ لا يعني تجميد عقد حركات العهدة أو قبول التشغيل |
| حالة الاستكمال | اكتملت [المطابقة المصدرية للبند ١٥٩ `ItemIssue`](ITEM_ISSUE_ACCESS_RECONCILIATION.md) وفق [العقد المجمد](ITEM_ISSUE_ACCESS_CONTRACT_FREEZE.md) و[الاكتشاف](ITEM_ISSUE_ACCESS_DISCOVERY.md). ارتفع الجرد إلى **159/263** من العمليات المؤكدة (`159` `operation-confirmed`، `48` `resource-only`، `51` `unknown`، `2` `context-only`، `3` `alias`). البند ١٦٠ رابط `ItemIssueItem` موثق كتحويل إلى `/ItemIssue`، والبند ١٦١ `ItemTypes` مؤكد سابقًا، والتالي في ترتيب العمل `ItemRequisition` (البند ١٦٢). القبول التشغيلي معلّق |

[برومبت متابعة الصلاحيات لأي بند](AUTHORIZATION_AGENT_PROMPT.md). حدّد رقم البند ونوع المهمة والعقد أو تقرير المراجعة قبل نسخه للوكيل.

## مراجعة صرف الأصناف — البند ١٥٩، ١٣ نوفمبر ٢٠٢٦

عولجت [ملاحظات المراجعة المصدرية](AUTHORIZATION_159_SOURCE_REVIEW_20261113.md) في الرصيد وكميات الطلب عند الاعتماد، ونشاط الفرع والمراجع، ودورة النوافذ والتقرير، ومواصفات الاختبارات. القبول التشغيلي معلّق والجرد 159/263. عند تنفيذ البند ١٦٢، راجع توافق عرض المتبقي ومؤشرات الأهلية مع التحقق من الكميات عبر الفروع.

## صرف الأصناف — البند ١٥٩، ١٣ نوفمبر ٢٠٢٦

اكتملت [المطابقة المصدرية للبند ١٥٩](ITEM_ISSUE_ACCESS_RECONCILIATION.md) وفق [العقد المجمد](ITEM_ISSUE_ACCESS_CONTRACT_FREEZE.md) و[الاكتشاف](ITEM_ISSUE_ACCESS_DISCOVERY.md). ارتفع الجرد إلى **159/263** (`159` `operation-confirmed`، `48` `resource-only`، `51` `unknown`، `2` `context-only`، `3` `alias`). تشمل `ItemIssue.View` القائمة والتفاصيل وحالة الموافقات والتقرير وتصدير Excel، مع شرط `itemIssueJobFilterSpecified` (`Job.Lookup`) عند التصفية أو الفرز حسب أمر الشغل؛ ويفتح `/ItemIssue/create` محرر الإنشاء مباشرة بـ`ItemIssue.Create` و`Job.Lookup` و`Branch.Lookup` و`Item.Lookup` دون اشتراط `ItemIssue.View`؛ ويزيد التعديل `ItemIssue.View` و`ItemIssue.Update` مع السماح بتغيير الفرع على المسودة المستقلة غير المعتمدة وفحص قابلية التسجيل (`canTransact` / `DemandBranchWrite`) والنشاط على الفرع المحفوظ والفرع الجديد معًا؛ وينفصل الحذف (`ItemIssue.Delete`) عن قرار الاعتماد/الرفض (`ItemIssue.ManageApproval`) وعن إلغاء الإذن المعتمد (`ItemIssue.Void`)؛ وحُصرت فلاتر وفرز القائمة وأعمدة `grid`، وأُغلقت المنافذ الموروثة غير المدعومة بـ`405`. لا هجرة مطلوبة. التالي في الجرد `ItemRequisition`.

## رابط بنود إذن الصرف — البند ١٦٠، ١٣ نوفمبر ٢٠٢٦

يحوّل الرابط القديم `/ItemIssueItem` وفروعه إلى قائمة `/ItemIssue`، وتُطبق عليها سياسة الوجهة. أصبح الجرد ٣ روابط تحويل و٥١ بندًا غير محسوم، وعدد العمليات المؤكدة ١٥٨ من ٢٦٣. إتاحة القائمة للمستخدم العادي تتبع استكمال البند ١٥٩. [مطابقة الرابط القديم](ITEM_ISSUE_ITEM_ALIAS_RECONCILIATION.md)

## الأصناف — البند ١٥٨، ١٣ نوفمبر ٢٠٢٦

اكتملت [المطابقة المصدرية للبند ١٥٨](ITEM_ACCESS_RECONCILIATION.md) وفق [العقد المجمد](ITEM_ACCESS_CONTRACT_FREEZE.md) و[الاكتشاف](ITEM_ACCESS_DISCOVERY.md). ارتفع الجرد إلى **158/263** (`158` `operation-confirmed`، `49` `resource-only`، `52` `unknown`، `2` `context-only`، `2` `alias`). تشمل صلاحية `Item.View` القائمة وتفاصيل الصنف والتقرير وتصدير Excel ومنافذ `GetById`/`GetByWithNavigationsId`، بينما يفتح `/Item/create` محرر إنشاء مباشرًا بـ `Item.Create` و`Branch.Lookup` دون اشتراط `Item.View`، ويزيد التعديل `Item.View` و`Item.Update` و`Branch.Lookup`، وتُشترط `UnitsOfMeasures.Lookup` فقط عند إسناد وحدة في الإنشاء (`itemUnitSpecified`) أو إسنادها/تغييرها في التعديل (`itemUnitChanged`) مع إبقاء الوحدة المحفوظة غير معدّلة عند غيابها، ويُحصر فحص التكرار الفوري بـ `Item.Validate` دون تعطيل الحفظ، ويرتبط الحذف بـ `Item.View` و`Item.Delete`؛ كما حُصرت فلاتر وفرز `ItemService`، واستُبعد المنفذان الموروثان غير المدعومين من كتالوج الإسناد. لا هجرة مطلوبة. التالي في الجرد `ItemIssue`.

## مخطط فروع تنفيذ حركات الموظفين — ١٣ نوفمبر ٢٠٢٦

طُبّقت `20261113070842_AddStaffExecutionBranchAccess` على هوست التجربة. غطّت الهجرة الحضور والإضافي وسجل الساعات. تحققنا من بقاء الـ٣٢ سجلًا ومن إسنادها كلها إلى فروع نشطة داخل شركاتها. جاهزية المخطط مؤكدة لهذا الهوست، وتجربة الشاشات والاختبارات معلّقة. [نتيجة تطبيق الهجرة](STAFF_DUTY_SCHEDULE_ACCESS_RECONCILIATION.md#هجرة-فروع-تنفيذ-حركات-الموظفين)

## جدول دوام الموظفين — البند ١٥٧، ١٣ نوفمبر ٢٠٢٦

اكتملت [المطابقة المصدرية](STAFF_DUTY_SCHEDULE_ACCESS_RECONCILIATION.md) وفق [العقد المجمد](STAFF_DUTY_SCHEDULE_ACCESS_CONTRACT_FREEZE.md) و[الاكتشاف](STAFF_DUTY_SCHEDULE_ACCESS_DISCOVERY.md). ارتفع الجرد إلى **157/263** (`157` `operation-confirmed`، `50` `resource-only`، `52` `unknown`، `2` `context-only`، `2` `alias`). قراءة الجدول تحتاج `Staff.GetStaffDutySchedule` و`Staff.Lookup` دون استدعاء `Shift/GetSelect`، بينما يزيد الحفظ `Staff.SaveStaffDutySchedule` و`Shift.Lookup` والتسجيل على الفرع المختار؛ ويبقى `Attendance.BranchId` ثابتًا تاريخيًا مع حماية `AttendanceService` و`PayrollRunService` ورفض تكرار اليوم عبر الفروع. أصبح مخطط فرع التنفيذ جاهزًا على هوست التجربة. التالي في الجرد `Item`.

## إضافي الموظفين — البند ١٥٦، ١٣ نوفمبر ٢٠٢٦

اكتملت [المطابقة المصدرية](STAFF_OVERTIME_ACCESS_RECONCILIATION.md) وفق [العقد](STAFF_OVERTIME_ACCESS_CONTRACT_FREEZE.md). ارتفع الجرد إلى **156/263**، مع ٥٠ موردًا مرشحًا و٥٣ مسارًا غير محسوم. عرض كشف الشهر والحفظ لهما منح منفصلة، وفرع تنفيذ السطر ثابت. طُبّق مخطط فرع التنفيذ لاحقًا ضمن الهجرة الموحّدة. التالي `StaffDutySchedule` بعقد مستقل.

## تحديث الاستكمال — سجل ساعات الموظفين StaffTimesheet وإغلاق فجوات 151، 12 نوفمبر 2026

اكتملت [مطابقة سجل ساعات الموظفين](STAFF_TIMESHEET_ACCESS_RECONCILIATION.md) وفق [العقد المجمد](STAFF_TIMESHEET_ACCESS_CONTRACT_FREEZE.md) و[الاكتشاف](STAFF_TIMESHEET_ACCESS_DISCOVERY.md)، كما أُغلقت فجوتا `R1` و`R2` المتبقيتان في [معالجة البند ١٥١](AUTHORIZATION_151_P2_REMEDIATION_20261112.md)، وعُولجت الملاحظات الثلاث (`P1` و`P2` و`P2`) المسجلة في [مراجعة البندين ١٥٤ و١٥٥](AUTHORIZATION_154_155_SOURCE_REVIEW_20261112.md). رُقي صفا `StaffTimesheet` و`StaffTimesheets` من `resource-only` إلى `operation-confirmed`: **155/263 operation-confirmed، 50 resource-only، 54 unknown، 2 context-only، 2 alias**.

في `StaffTimesheet`، أصبحت الحركة مرتبطة بفرع تنفيذ إلزامي ثابت وقت الإنشاء (`BranchScopeRegistry.Direct<StaffTimesheet>("BranchId")`)، وطُبّق مخططه لاحقًا ضمن الهجرة الموحّدة. يحتاج العرض `StaffTimesheet.View` وفلتر الموظف `Staff.Lookup` شرطية على حقل `staffId` وحده مع حصر جميع فلاتر القائمة والفرز في الحقول المعتمدة للشاشة، والإنشاء مستقل بـ `StaffTimesheet.Create` و`Staff.Lookup` و`Shift.Lookup`، والتعديل يزيد `View` و`Update`، والحذف يحتاج `View` و`Delete` مع ربط أفعال الصف وزر التعديل والحفظ بقابلية التسجيل (`canTransact`) على فرع الصف وفصل تحديث القائمة بعد الحذف الناجح عن شرط عرض الرسالة؛ والعمليات الموروثة غير المدعومة ترجع 405 وغير قابلة للإسناد. التالي حسب ترتيب الجرد هو `StaffOverTime` ثم `StaffDutySchedule`.

## تحديث الاستكمال الأحدث — تنبيهات العملاء Alerts، 12 نوفمبر 2026

انتهت [مطابقة البند ١٥٣](CUSTOMER_ALERTS_ACCESS_RECONCILIATION.md) وفق [عقده](CUSTOMER_ALERTS_ACCESS_CONTRACT_FREEZE.md). رُقي صف `/Alerts` وحده من unknown: **153/263 operation-confirmed، 52 resource-only، 54 unknown، 2 context-only، 2 alias**. يقرأ المسار Customer/Alerts وليس تنبيهات الموظفين؛ يحتاج Customer.Alerts فقط للقراءة والمخرجات، وCustomer.Lookup شرطية عند إرسال فلتر العميل. نُشر الشرط بنفس مالك حارس الخادم والكتالوج، ووُصفت العملية كقراءة WholeDocument بدل طلب تسجيل فروع. بقية استعلامات الاتفاقيات والاشتراك والحذف بقيت كما هي.

في الواجهة يُحجب الناتج والتصدير والـportals عند السحب، وتُلغى القراءات والمراقبات تحت session/context/revision. سحب Lookup يصفر form/applied customerId ويصدر قراءة عامة واحدة؛ snapshot مطابق لا يعيد تحميل المسودة، وإعادة المنحة تعيد bootstrap/watch بمالك الكاش القائم. الجذر راجع وأصلح رسالة HTTP وحارس التجديد الصامت وتمكين control بعد bootstrap. حدث الدليل العربي والإنجليزي، وكتبت مواصفات route/catalog/filter/lifecycle دون تنفيذ.

الفحوص المصدرية: صياغة 3 ملفات C# و10 ملفات TS/Angular واستيراداتها، وفحص whitespace منفصل للمستودعين برمز 0 والحزم 8/8 OK. لا build/tests/typecheck/lint/browser/HTTP/DB/migration/snapshot/commit/push/deploy؛ لا schema أو Add-Migration مطلوب. قبول التشغيل وEF/SQL والفروع والأداء والمظهر عند المالك. التالي حسب الجرد StaffTimesheet؛ اكتشف الجذر مبدئيًا أنه يستهلك مكوّن قائمة وحوار Details نفسه عبر /StaffTimesheet و/StaffTimesheets، وأن نموذج StaffTimesheet لا يحفظ BranchId حتى الآن؛ هذه نقطة يجب تسويتها بعقد مستقل قبل اعتماد وحدة معاملات بلا نطاق فروع. لا تُرقِّ كلا الصفين تلقائيًا ولا تبدأ هجرة.

## تحديث الاستكمال الأحدث — الموظفون Staff، 12 نوفمبر 2026

انتهت [المطابقة المصدرية للبند ١٥٢](STAFF_ACCESS_RECONCILIATION.md) بعد [العقد](STAFF_ACCESS_CONTRACT_FREEZE.md) و[الاكتشاف](STAFF_ACCESS_DISCOVERY.md). رُقي صف Staff وحده: **152/263 operation-confirmed، 52 resource-only، 55 unknown، 2 context-only، 2 alias**. الأمر النشط هو الاستمرار حتى جميع البنود؛ لا يُتخذ تسليم هذه الوحدة سببًا لإيقاف العمل. التالي بحسب ترتيب الجرد `/Alerts`، وهو تنبيهات **العملاء**؛ لا StaffStatement المؤكد سابقًا ولا `/staffAlerts` المستقل.

العرض للقائمة والتفاصيل وExcel بمنحة Staff.View، وCreate مباشر مستقل مع Branch.Lookup؛ Edit يزيد View/Update. قراءة الراتب وتعديله مستقلان، وإرسال الحزمة الأولية فقط يحتاج ReviseSalary. المراجع الاختيارية تحتاج Lookup عند الإسناد/التغيير لا عند إبقاء معرف محفوظ؛ Staff.GetRoleOptions يوفر مرجع الدور الحالي دون فتح RoleController أو منح أي دور لحساب المستخدم. جذر Staff مشترك داخل الاشتراك تحت النموذج القائم، وحركاته وتقاريره مستقلة. رابط التقرير يستهلك Staff.GetStaffBalancesSummary من وجهته المثبتة.

وثائق الموظف الجديدة في staff-documents الخاص خارج wwwroot، تقرأ عبر Media.ReadStaffDocument مع Staff.View وملكية CustomerDocument.PartnerId. يمنع اشتراك المسار مع مالك آخر وحذف ملف سبق إسناده؛ يحتفظ الاستبدال بالمطالبة التاريخية. حُجب static للمسار الخاص وللوثائق القديمة المثبت إسنادها في مجلدي staff وCustomerDocuments. لا ترحيل/حذف ملفات أو fallback عام. أعمار الجلسة وrevision وإلغاء القراءات وقرارات التجاهل وحفظ المسودات واستقلال الكتابات وتنظيف المرسل مطبقة؛ Create-only لا يُحبس في وجهة قائمة غير مسموحة. حدث دليل الموظفين العربي والإنجليزي.

الفحوص: صياغة 19 ملف C# و16 ملف TS/Angular، JSONC وXML/resources والـnamespaces/project references، وفحص فرق whitespace لكل مستودع برمز 0، والحزم 8/8 OK. المواصفات مكتوبة دون تشغيل. لا build/tests/typecheck/lint/browser/HTTP/DB/migration/snapshot/commit/push/deploy أو Sigma MCP/Graphify. لا حاجة migration؛ قبول DI وEF/SQL والتزامن والمظهر والتخزين وخطة الفهارس باقٍ للمالك. لم تُصلح ملاحظتا P2 الباقيتان في إعادة مراجعة 151 ضمن هذا البند؛ احتُفظ بعمل المالك كما هو.

## تحديث الاستكمال الأحدث — SalesQuotation، 12 نوفمبر 2026

تطابق [العقد المجمد](SALES_QUOTATION_ACCESS_CONTRACT_FREEZE.md) مع [الاكتشاف](SALES_QUOTATION_ACCESS_DISCOVERY.md) و[المطابقة](SALES_QUOTATION_ACCESS_RECONCILIATION.md)، ورُقّي صف `SalesQuotation` فقط إلى **151/263 operation-confirmed، 53 resource-only، 55 unknown، 2 context-only، 2 alias**. موارد Create/View/Update، والقرارات الست، والحذف وسند المقدم وفتح اتفاقية البيع محفوظة كل بحسب منحها، ولا يشترط الإنشاء عرض القائمة. فلتر العميل/grid/فرز أعمدته يحتاج `Customer.Lookup`؛ أسماء العملاء والارتباطات مرهونة بنطاق استعراض العميل والمستند المقترن. المعاينة الضريبية اختيارية وتحميها منحة الإعدادات؛ الواجهة تحجب GET/Excel/Print والسياق السابق بعد سحب الوصول، وتترك الكتابة المرسلة تكمل دون نشر نتيجة قديمة. سجّل دليل المستخدم باللغتين.

التحقق في هذه الدفعة مصدرّي فقط: فحص حزم الوثائق الثمانية OK، وفروق العمل المحصورة بدون أخطاء whitespace. لم تُشغّل build/tests/typecheck/lint/browser/HTTP/DB/migrations/snapshots/commit/push/deploy. اختبارات ومواصفات المصدر موجودة دون تنفيذ؛ قبول EF/SQL وخطة الأداء والفروع وواجهة الطباعة والتزامن المالي باقٍ للمالك. التالي حسب الجرد `Staff`، ولا ينسخ عقد `SalesQuotation` تلقائيًا.

## تحديث الاستكمال الأحدث — SalesAgreement، 12 نوفمبر 2026

قبل هذه الدفعة كانت قائمة/محرر عقد البيع وحوارات Invoice/Deliver والإيصال المدمج والعملة قد تَبَنّت منحها في المصدر واختبارات سابقة؛ [المطابقة الأصلية](SALES_AGREEMENT_ACCESS_ADOPTION_FINAL_RECONCILIATION.md) و[العقد](SALES_AGREEMENT_FULL_ACCESS_CONTRACT_FREEZE.md) يوثقان ذلك، ولم تعاد كتابتها. العائق المتبقي كان بدء `Currency.GetFinancialNumberPolicy` و`SettingsCommonModel.GetMySetting` كقراءات معاينة دون فحص منحهما. صار محرر التفاصيل يختبر grant كل واحدة قبل GET، ويلغي قراءة مؤجلة بعد سحب grant أو فقد وصول الأب أو تغير actor/branch context، ولا يعرض دقة/ضريبة قديمة بعد السحب؛ عند غيابها يستخدم fallback المعاينة (`2` decimals و`5%` defaults)، بينما حساب الخادم هو الأصل. إعادة المنحة تبدأ قراءة واحدة بلا duplicated GET. أُضيفت source-only specs وحدث دليل المبيعات، ولم تُشغل الاختبارات مجددًا في هذه الدفعة.

رُقّي صف `SalesAgreement` وحده إلى operation-confirmed: **150/263؛ 54 resource-only و55 unknown و2 context-only و2 alias**. View للقائمة/الطباعة/Excel، Create مستقل مع Customer.Lookup/Bank.Lookup/GetAvailableUnits، Edit مع View+Update، وClose/Cancel/Delete/Invoice/Deliver/Receipt بالمفاتيح الفعلية؛ Quotation.View عند مصدر العرض، وعزل قراءات settings/currency الاختيارية. دون build/tests/lint/typecheck/browser/DB/migration/snapshot/commit/push/deploy. القبول التشغيلي للمالية وفروع الوحدات والبيانات باقٍ للمالك، والتالي `SalesQuotation`؛ لا تنسخ الصلاحيات من عقد البيع تلقائيًا.

## تحديث الاستكمال الأحدث — EquipmentMasterAgreement، 12 نوفمبر 2026

اعتمدت [الاكتشاف](EQUIPMENT_MASTER_AGREEMENT_ACCESS_DISCOVERY.md) و[العقد المجمد](EQUIPMENT_MASTER_AGREEMENT_ACCESS_CONTRACT_FREEZE.md) و[المطابقة](EQUIPMENT_MASTER_AGREEMENT_ACCESS_RECONCILIATION.md)، ثم رُقي صف `EquipmentMasterAgreement` فقط إلى **operation-confirmed**؛ أصبح الجرد **149/263 مؤكّدًا، 55 resource-only، 55 unknown، 2 context-only، 2 alias**. الوحدة التالية تُحدد بترتيب الصفوف لا بتوقع اسمها. هذا Source-only، لا build/tests/lint/typecheck/browser/HTTP/SQL/DB/migration/snapshot/commit/push/deploy.

`EquipmentMasterAgreement.View` للقائمة والـExcel وdirect View. `Create` مستقل مع `Customer.Lookup` و`Equipment.Lookup`؛ `Update` يضيف View وUpdate. `Quotation.View` مشروط بالربط/الإرسال والبحث في مرجع العرض؛ أصلحت الخدمة بعد إغلاق `Quotation/GetSelect` 405 لتقرأ approved list مصرحًا. للعميل/العرض فلاتر grid مشروطة في الواجهة والخادم. `Approve` له metadata صريح كي لا يتحول إلى `ManageApproval` المجمّع؛ `Delete`, `FinancialStatus`, `Close`, `Reopen`, `GetSaleOrders`, `UpdateSaleOrders` مستقلة بالاعتماديات المناسبة. `DeliveryNote.View/Create` تبقى مستقلة.

Backend يفحص فروع كل معدة قديمة/جديدة قبل الكتابة، ويفحص فروع كل SaleOrder مرتبط/مضاف ولا يترك روابط حية مخفية عند تغيير المجموعة. إسقاطات القائمة والتفاصيل لا تُظهر أسماء ومراجع Partner/Quotation/Equipment التي خرجت عن نطاق القراءة، و404 عند غياب الأصل، و405 للموروث غير المدعوم. Angular يحمي actor/session/context، ويسقط reads/Excel القديمة؛ الكتابة المرسلة لا تُلغى عند unmount وتعرض نتائجها فقط لنفس grant/session. حوارات المالية وأوامر البيع لها شروط مستقلة، ودليل المستخدم والمواصفات source-only أُضيفت دون تشغيل. قبول ترجمة SQL/EF وسلوك المتصفح والاختبارات الحية يظل للمالك.

## تحديث الاستكمال الأحدث — EquipmentRentalOrder التاريخي، 12 نوفمبر 2026

اعتمد [العقد](EQUIPMENT_RENTAL_ORDER_ACCESS_CONTRACT_FREEZE.md) و[الاكتشاف](EQUIPMENT_RENTAL_ORDER_ACCESS_DISCOVERY.md) و[المطابقة](EQUIPMENT_RENTAL_ORDER_ACCESS_RECONCILIATION.md) للصف التالي. الآن **148/263 operation-confirmed و56 resource-only و55 unknown و2 context-only و2 alias**. تميّز `SaleOrder.EquipmentRentalOrders` للقائمة/Excel عن `SaleOrder.EquipmentRentalOrder` للتفاصيل المباشرة. الوحدة التاريخية **read-only**؛ Create/Edit redirects إلى `/DeliveryNote` وكتابات typed الأربع ترجع HTTP 405، وهي غير قابلة للإسناد حتى لو بقيت أسماء endpoint في المصدر. `SaleOrder.EquipmentRentalSources` تتطلب `EquipmentMasterAgreement.View`. رابط DeliveryNote يحتاج `DeliveryNote.View` مستقلًا. تدفق Speed القديم لأوامر البيع في الاتفاقيات ليس تصريحًا لإعادة فتح الكتابة في الوحدة المتقاعدة.

أكدت المطابقة المصدرية أن `SaleOrder.BranchId` هو مالك المستند؛ حُجبت أسماء عميل/اتفاقية/معدّل غير مقروءة، ولم تُعرض أرقام إشعارات التسليم خارج scope. عزل تغير الجلسة والصلاحية يلغى القراءات والتصدير المعلق. أُضيفت specs للواجهة وBackend **دون تشغيلها**، وفحص scoped `git diff --check` نظيف باستثناء التحذير الاعتيادي CRLF. لا build/tests/lint/typecheck/browser/DB/migration/snapshot/commit/push/deploy؛ ترجمة EF/SQL والقبول التشغيلي لاحق للمالك. التالي رسميًا `EquipmentMasterAgreement`، ويحتاج عقدًا جديدًا لا ينسخ صلاحيات SaleOrder التاريخي.

## تحديث الاستكمال الأحدث — عروض أسعار تأجير المعدات EquipmentQuotation، 12 نوفمبر 2026

أُغلقت وحدة `EquipmentQuotation` مصدرّيًا وفق [العقد المجمد المصحّح](EQUIPMENT_QUOTATION_ACCESS_CONTRACT_FREEZE.md) و[الاكتشاف](EQUIPMENT_QUOTATION_ACCESS_DISCOVERY.md) و[المطابقة](EQUIPMENT_QUOTATION_ACCESS_RECONCILIATION.md). رُقّي صفها **الوحيد** إلى operation-confirmed؛ أصبح الجرد **147/263 مؤكدًا و57 resource-only و55 unknown و2 context-only و2 alias**. الوحدة التالية بحسب الجرد هي `EquipmentRentalOrder`؛ ليست جزءًا من عقد هذه الوحدة. الأعداد القديمة في التحديثات أدناه تاريخية فقط.

الـroute `/EquipmentQuotation` يستخدم مورد API `Quotation`. `Quotation.View` للقائمة/التفاصيل والطباعة وExcel؛ الإنشاء المباشر مستقل بـ`Quotation.Create` و`Customer.Lookup` و`Equipment.Lookup` و`CarModel.Lookup`، والتعديل يزيد View وUpdate. صحح العقد الأولي `Fleet.Lookup` إلى `Equipment.Lookup` لأنه الـAPI الفعلي لـ`FleetService.getSelectList`. `Staff.Lookup` و`Contact.GetSelectByCompany` مشروطتان فقط بإرسال المراجع الاختيارية؛ فلتر العميل/grid يحتاج `Customer.Lookup` مشروطًا. Delete وكل من ستة أفعال اعتماد/رفض/مراجعة/إلغاء اعتماد مفاتيح `Quotation.*` مستقلة مع View وقيود الحالة. فتح وإنشاء مستندات PurchaseOrder وEquipmentMasterAgreement يتطلبان منح المورد الآخر المستقلة.

يحكم `Quotation.BranchId` المحفوظ نطاق القراءة والكتابة؛ لا يسمح Update بنقل فرع المستند. رابط PurchaseOrder/EquipmentMasterAgreement حي—even if hidden in another branch—يمنع تغيير المصدر وإلغاء اعتماده، دون كشف هويته. المراجع التي فقدت فرع قراءتها تحجب أسماؤها من الإسقاطات، والعمليات الموروثة غير المدعومة ترجع 405 وغير قابلة للإسناد. Angular يعزل قائمة العرض عن إنشاء مستقل ويمنع نشر نتائج GET/Excel/Print أو آثار كتابة من جلسة أخرى؛ الكتابة المرسلة لا تُلغى بسبب تدمير المكون. كتب source specs من دون تشغيل، وفحص source-only whitespace محصور. لا build/tests/lint/typecheck/browser/HTTP/SQL/DB/migration/snapshot/commit/push/deploy. تنفيذ EF translation وSQL plans وتحقق branch/media/runtime والقبول التشغيلي مؤجلة لصاحب النظام؛ لا دليل مؤكد يستلزم هجرة مخطط لهذه الوحدة.

## تحديث الاستكمال الأحدث — سجل الحركات logsMovement، 11 نوفمبر 2026

أُغلق سجل الحركات الموحّد [source-only](LOGS_MOVEMENT_ACCESS_RECONCILIATION.md) بعد [الاكتشاف](LOGS_MOVEMENT_ACCESS_DISCOVERY.md) و[تجميد العقد](LOGS_MOVEMENT_ACCESS_CONTRACT_FREEZE.md). رُقي **صف `logsMovement` وحده** من resource-only إلى operation-confirmed؛ الأعداد **146/263 مؤكدًا، 58 resource-only، 55 unknown، 2 context-only، 2 alias**. التالي حسب الجرد **`EquipmentQuotation`**، وهو نطاق جديد لا ينسخ grants الحركات. كل الأعداد الأقدم لاحقًا في الملف حالات تاريخية وليست حالة العمل الحالية.

`CollectionMovement.GetMovements` منحة مستقلة للقائمة/التقرير/Excel دون CollectionMovement.View. عند اختيار عميل أو مرشح grid على Contact/ContactCode يحتاج `Customer.Lookup` شرطًا في الواجهة والخادم. عرض/CheckCard صف فعلي يحتاج منحة مصدره View لاتفاقية إيجار/حركة استلام/تسليم/ورشة، أو `NRM.GetMovementLogDetails` الخاصة. مستندات اتفاقية الإيجار تحتاج `RentalAgreement.GetDocuments` ورفعها يحتاج `RentalAgreement.UploadDocument` إضافة إلى حق عرض الاتفاقية؛ `ChecklistItem.View` للـGET الاختياري، وإلا تستخدم labels محلية بلا بيانات إجابات. التصحيح الخادمي أضاف `MovementFiltersDto.grid` وسماح `GridFilter` فقط على حقول `MovementDto` المعروضة بعد التجميع وقبل Count/Paging، دون البحث على IDs داخلية. تأمين الوصول والجلسة وسحب المنحة يمنع إعادة نشر بيانات وPrint/Excel قديمة؛ upload مستند أُرسل يُكمل بعد unmount ولا ينشر نجاح حساب آخر.

دليل الشاشة العربي/الإنجليزي ومواصفات source-only `MovementLogAccessContractTests.cs` وامتداد `PermissionPrerequisiteTests.cs` و`list-access.spec.ts` تمت كتابتها **دون تشغيل**. فحص `git diff --check` للمسارات المحصورة في المستودعين نظيف عدا LF→CRLF. **لا هجرة مخطط جديدة للوحدة**؛ هجرات NRM وCollectionMovement المطبقة مدونة سابقًا. لا يُدّعى نجاح SQL translation/HTTP أو اختبارات/TypeCheck/Browser/Commit/Push/Deploy؛ قبول تشغيل حقيقي باقٍ للمالك.

## تحديث الاستكمال الأحدث — حركات الاستلام CollectionMovement، 11 نوفمبر 2026

**أحدث تعليمات المستخدم المباشرة هي الاستمرار حتى نهاية الطلب**، لذا تُعدّ ملاحظة التوقف التاريخية عند البند 144 منتهية ولا تمنع متابعة الصفوف. أُغلقت `collectionMovement` بعد [الاكتشاف](COLLECTION_MOVEMENT_ACCESS_DISCOVERY.md)، [العقد المجمد](COLLECTION_MOVEMENT_ACCESS_CONTRACT_FREEZE.md) و[المطابقة](COLLECTION_MOVEMENT_ACCESS_RECONCILIATION.md). رُقي صف الجرد هذا فقط إلى **operation-confirmed**، فصار **145/263 مؤكدًا، 59 resource-only، 55 unknown، 2 context-only و2 alias**. **الصف التالي `logsMovement`**، ويستهلك `CollectionMovement.GetMovements` المستقل، وليس صلاحية View الاستلام تلقائيًا.

`CollectionMovement.View` للقائمة/التفاصيل/Excel؛ `CollectionMovement.Create` مستقل مع فرع استلام تاريخي فعلي/تاريخ مطلوبين، وتبعية `RentalAgreement.Lookup`+`RentalAgreement.View` عند اختيار اتفاقية، أو `Vehicle.Lookup` للمركبة المباشرة، و`Driver.Lookup` عند إرسال السائق. `CollectionMovement.Delete` مع View على الصف المؤكد وفرع `AllowsWrite`، والحذف الحقيقي محفوظ؛ `CollectionMovement.GetMovements` للمستهلك الموحد مستقل. العمليات الموروثة Update/Activate/CheckUnique/GetSelect/GetAll/bulk غير مدعومة وتعيد 405. رقم الحركة والاشتراك والعميل من الخادم؛ لا انتقال Close/Return متخيل من Speed ولا Status مصطنعة، وتُحجب أسماء/أرقام المراجع التي انتقلت خارج فرع القراءة مع إبقاء الجذر التاريخي.

**نُفذت الهجرة فعلًا:** `20261111203606_CollectionMovementReceivingBranchIndex20261111` بعد تأكيد تغير فهرس المركّب `(SubscriptionId,BranchInId,DateAndTime,Id)` مع تضمين Type/IsDeleted فقط، وتسوية قيم `BranchInId` القديمة الخالية لفرع موجود ونشط من **نفس الاشتراك** في بيانات التجربة. `dotnet ef database update` نجح و`dotnet ef migrations list` أكد إدراج الهجرة بعد هجرة NRM. مشروع DataAccess بُني تلقائيًا لإنشاء/تطبيق الهجرة، دون ادعاء بناء Business/API. بقية المواصفات/Angular والخادم والدليل العربي والإنجليزي مصدرية ولم تُشغل اختبارات/lint/typecheck/browser/HTTP أو تُنفذ commit/push/deploy. أداء SQL وخطة query والتفاصيل الأمنية التشغيلية قبول لاحق.

## تحديث الاستكمال الأحدث — حركات الورشة WorkshopMovement، 11 نوفمبر 2026

أُغلقت شاشة **حركات الورشة** مصدرّيًا بعد [عقد منفصل مجمد](WORKSHOP_MOVEMENT_ACCESS_CONTRACT_FREEZE.md) و[اكتشاف Speed/Sigma](WORKSHOP_MOVEMENT_ACCESS_DISCOVERY.md) و[المطابقة النهائية](WORKSHOP_MOVEMENT_ACCESS_RECONCILIATION.md). كان الجرد حينها **144/263 operation-confirmed، 60 resource-only، 55 unknown، 2 context-only، 2 alias**. هذه حالة تاريخية سبقت استئناف المستخدم الأحدث؛ الجرد الحالي ونقطة البدء في التحديث الأعلى.

المنح المعتمدة: `WorkshopMovement.View` للقائمة/التفاصيل والطباعة وExcel مع `Supplier.Lookup` شرطًا عند اختيار فلتر المورد أو grid على حقوله؛ `WorkshopMovement.Create` مع `Vehicle.Lookup` مستقلًا عن View، و`Driver.Lookup` و`Supplier.Lookup` مشروطتان عند إرسال المراجع الاختيارية. `PurchaseOrder.Lookup` للاقتراحات، ويمكن كتابة مرجع PO بدونها. خيارات فرع التنفيذ تأتي من `CurrentBranch/Options` ولا تشترط `Branch.Lookup` آليًا. حارس `DbContext` المركزي يطبق `AllowsWrite`؛ أضيف تحقق خادمي مبكر. `WorkshopMovementNo` يولده الخادم، وتبقى حركة الفرع التاريخي قابلة للعرض ولو نُقلت المركبة مع حجب بيانات المرجع الذي فقد فرعه. لا يتم اختلاق Status مكتمل أو تاريخ إغلاق/عودة؛ العمليات الموروثة Update/Remove/Activate/CheckUnique/GetSelect/GetAll/bulk ترجع 405 والمنح غير قابلة للإسناد. يظل `logsMovement` مستهلكًا لتفاصيل الحركة تحت View.

اكتملت تغييرات القائمة والمحرر والخادم والدليل العربي والإنجليزي ومواصفات مصدرية للاختبارات دون تشغيل. فحص فروق source-only للحركة في المستودعين خرج نظيفًا، ولم يجر build/tests/lint/typecheck/browser/HTTP/SQL/DB/migration/snapshot/commit/push/deploy لهذه الوحدة؛ لا يثبت الإقفال نجاح ترجمة EF أو سلوك HTTP أو منظومة الوسائط في التشغيل. **لا تغيير مخطط مؤكد يحتاج هجرة جديدة هنا**: علاقة BranchId المطلوبة وفهارسها موجودة؛ الهجرة السابقة للحركات مسجلة في مراجعة NRM. قبل الإطلاق يلزم قبول المالك لبيئة SQL والحقوق ورفع/تنظيف الملفات، والاستقرار تحت تبديل الحساب.

## تحديث الاستكمال الأحدث — تعريف الورش Workshop، 11 نوفمبر 2026

أُغلق **تعريف الورش** Workshop (الاسم المشترك بين فروع الاشتراك، وليس WorkshopMovement) مصدرّيًا، وفق [العقد المجمد](WORKSHOP_ACCESS_CONTRACT_FREEZE.md)، [الاكتشاف](WORKSHOP_ACCESS_DISCOVERY.md)، و[المطابقة النهائية](WORKSHOP_ACCESS_RECONCILIATION.md). بعد تنفيذ Angular/Backend ومراجعة عامل مستقل، رُقي صف Workshop **وحده** إلى operation-confirmed. الجرد **143 من 263 مؤكدًا** و61 resource-only و55 unknown و2 context-only و2 alias.

المنح: Workshop.View للقائمة/التفاصيل/Excel، وWorkshop.Create منفصلة للإنشاء بالاسم فقط (250 حرفًا كحد أقصى)، وWorkshop.Update مع Workshop.View للتعديل (50 حرفًا). Workshop.Lookup مستقل لمستهلكات ServiceLog وJob؛ Workshop.GetVehicleDetails وWorkshop.SearchVehicles عمليات متخصصة مستقلة وليست قائمة التعريف. لا حذف/تفعيل/إغلاق أو عمليات موروثة غير مدعومة؛ الخدمات ترجع 405 ومفاتيحها غير قابلة للإسناد. لا BranchId في سجل التعريف، خلافًا لحركة الورشة التاريخية. عولج إغلاق create-only بلا قائمة، وعدم ضياع مسودة edit عند تحديث cache أو سحب مؤقت للمنحة.

تمت مراجعة diff --check للمستودعين exit 0 وتحذير LF→CRLF فقط في مسارات Angular المشتركة؛ أضيفت source-only specs دون تشغيل. لا build/tests/lint/typecheck/browser/DB/migration/snapshot/commit/push/deploy. قبول الخادم/الواجهة/التصفية الفعلية للمالك. **التالي WorkshopMovement** مباشرة حسب الجرد؛ شاشة Speed 2026-10-28/13-movements/02-workshop-movements، وتحتاج عقدًا منفصلًا لأن API generic يسمح حاليًا بعمليات Update/Delete/Activate رغم غيابها من واجهة Sigma.

## تحديث الاستكمال الأحدث — NRM، 11 نوفمبر 2026

أُغلقت **حركات NRM** مصدرّيًا بالاستناد إلى [العقد المجمد](NRM_ACCESS_CONTRACT_FREEZE.md)، [الاكتشاف](NRM_ACCESS_DISCOVERY.md)، و[المطابقة النهائية](NRM_ACCESS_RECONCILIATION.md) بعد تسليم عاملي الخلفية وقائمة Angular ومراجعة الربط بالمحرر. صف الجرد `NRM` وحده انتقل من `resource-only` إلى `operation-confirmed`؛ **142 من 263** مؤكدة مقابل **62 resource-only** و55 unknown و2 context-only و2 alias. لا تعد نقطة البدء `NRM` أو الأعداد القديمة الواردة في التحديثات التاريخية أدناه حالة حالية.

`NRM.View` لقراءة القائمة والتفاصيل والطباعة وExcel، وفلتر الموظف يحتاج `Staff.Lookup` عند استعماله فقط. الإنشاء مستقل بـ`NRM.Create` و`Vehicle.Lookup` و`Branch.Lookup`، ويحتاج `Staff.Lookup` إضافة **فقط** إذا أُرسل `StaffId` اختياري. فرع التنفيذ `BranchId` إلزامي في الحركة الجديدة ويحدد نطاق ملكيتها التاريخي ولا يُستنتج من موقع المركبة الحالي. `NRM.GetMovementLogDetails` منحة مستقلة لمستهلك `logsMovement`، ولا توسع `NRM.View` إليها. عمليات الإغلاق/التعديل/الحذف والتفعيل وواجهات API الموروثة غير المدعومة ليست منحًا قابلة للإسناد وترد 405. المصدر الموقّع للاشتراك `ClaimTypes.NameIdentifier` و`Repository.SubscriptionId` لم يتغير.

`git diff --check` المحصور بالواجهة والخلفية exit 0، تنبيه نهايات أسطر فقط. كُتبت source specs ولم تُشغّل، ولم يحدث build أو tests أو lint أو typecheck أو browser أو DB أو migration أو snapshot أو commit أو push. على المالك لاحقًا مراجعة فهرس/FK `NRM` وهجرة محتملة `AddNRMHistoricalBranchScopeIndex` واختبار ترجمة EF وقبول SQL والحقوق الفعلية، مع المحافظة على السجلات القديمة التي بلا فرع حتى تحديد فرع التنفيذ الحقيقي لها.

**التالي حسب ترتيب الجرد:** `Workshop` يلي `NRM` مباشرة؛ ابدأ بمراجع Speed (الدليل، شرح الشاشة، controllers) ثم قارن Sigma، ولا تعمم اختيارات NRM عليه. أي تعليمات أقدم أدناه تبدأ من NRM/DeliveryMovement/CustodyMovement هي سجل تاريخي فقط.

## تحديث الاستكمال الأحدث — حركات التسليم 11 نوفمبر 2026

أُنجزت **حركات التسليم** `DeliveryMovement` مصدرّيًا بعد إغلاق `CustodyMovement`: قرئ Speed (دليل 2026-10-27 ثم شرح 2026-10-28 ثم controllers C0770/C0771/C0769/C0772)، وجُمّد [عقد التسليم](DELIVERY_MOVEMENT_ACCESS_CONTRACT_FREEZE.md) ثم طُبقت الصلاحيات في Angular والخادم ووثّقت [المطابقة](DELIVERY_MOVEMENT_ACCESS_RECONCILIATION.md) و[الاكتشاف](DELIVERY_MOVEMENT_ACCESS_DISCOVERY.md). صف الجرد `DeliveryMovement` رُقّي وحده من `resource-only` إلى `operation-confirmed`، فصار **141 من 263**، منها 63 محددة المورد و55 مجهولة وبندان للسياق وبندان بديلان. هذه الفقرة تلغي نقطة استكمال `DeliveryMovement` الواردة في تحديث حركات العهدة التاريخي أسفلها؛ لا تُعد تعليمات البدء القديمة أعمالًا مفتوحة.

القرارات: `DeliveryMovement.View` للقائمة/التفاصيل/Excel؛ الإنشاء المباشر `DeliveryMovement.Create` + `Branch.Lookup` + `RentalAgreement.Lookup` + `RentalAgreement.View`، مع `Driver.Lookup` شرطًا إضافيًا **فقط عند إرسال** `DriverId`. نوع الحركة 0/1 في Sigma، واتفاقية وإثبات فرع تنفيذ تاريخي وتاريخ ووقت إلزامية؛ المركبة والعميل يُشتقان من اتفاقية RentalAgreement الحقيقية في خدمة الخادم ولا يرسلهما POST. `ClaimTypes.NameIdentifier` يبقى مصدر الاشتراك الموقّع، وفرع الحركة التاريخي هو `BranchOutId`. Speed يثبت إغلاق/إرجاع غير منفذين في Sigma الحالية؛ لا منح وهمية لهما، وتعيد العمليات الموروثة غير المدعومة `405`.

سُلّم عمل الوكيلين `worker-1` للخلفية و`worker-2` للقائمة والمسارات والمواصفات المصدرية غير المنفذة، وأكمل الوكيل الأساسي التفاصيل وخدمة Angular ودليل المستخدم واعتماديات `PermissionPrerequisites`. فُحصت الفروق داخل كل Git repo على حدة؛ `git diff --check` لكل منهما exit 0 (تحذير CRLF للخدمة فقط). لم يُجر build/test/lint/typecheck/browser/db/migration/snapshot/commit/push. على المالك: إنشاء هجرة EF لفهارس/FK/طول KMs المقترحة (اسم مقترح `AddDeliveryMovementScopeIndexesAndRelations`)، معالجة السجلات التاريخية التي بلا `BranchOutId` **بمعلومة صحيحة لا افتراض عشوائي**، وتقييم EF translation وSQL plan والقبول التشغيلي.

**التالي:** وحدة `NRM` هي صف الجرد التالي بعد DeliveryMovement؛ ابدأ باكتشافها ودليل Speed قبل تجميد العقد. لا تنقل افتراضات الموظف الإلزامي من العهدة أو الاتفاقية الإلزامية من التسليم إلى NRM. حافظ على ملفات الأعمال الأخرى والمتغيرات غير المرتبطة وعدم تشغيل أي مرحلة محظورة.

## تحديث الاستكمال الأحدث — 11 نوفمبر 2026 (يلغي نقطة البدء التاريخية أدناه)

أُنجزت **حركات العهدة** في المصدر للواجهة والخادم والعقد والدليل والمراجعة، وتمت ترقية صفها الوحيد في الجرد من `resource-only` إلى `operation-confirmed`. العدد أصبح **140 من 263**، موزعًا إلى 140 مؤكدًا و64 محدد المورد و55 مجهولًا وبندين للسياق وبندين لمسارات بديلة. يظل القبول التشغيلي وهجرة مخطط الموظف/الاتفاقية للمالك، ولا تعني الترقية وجود مخطط حديث في قاعدة البيانات أو نجاح البناء. لا تُعد بنود حركات العهدة المكتوبة أدناه بعنوان «ابدأ من حركات العهدة» أعمالًا متبقية؛ هي سجل لحالة التسليم القديمة.

القرار النهائي: `EmployeeId` إلزامي وFK إلى `Staff`، موظف واحد مسؤول عن العهدة لا سائق تلقائي ولا حقلا تسليم واستلام؛ امتداد مقصود عن Speed. `AgreementId` اختياري nullable وليس صفرًا. فرع الحركة التاريخي هو مالك القراءة والكتابة. الاشتراك مصدره `ClaimTypes.NameIdentifier` الموقّع عمدًا، و`Repository` لم يتغير. `CustodyMovement.Create` يحتاج `Branch.Lookup` و`Vehicle.Lookup` و`Staff.Lookup` على الخادم والواجهة، و`RentalAgreement.Lookup` شرطيًا عند إرسال اتفاقية؛ الإنشاء لا يحتاج منحة عرض القائمة. لا توجد عمليات تعديل/حذف/تفعيل مدعومة حاليًا.

المطابقة: [عقد العهدة](CUSTODY_MOVEMENT_ACCESS_CONTRACT_FREEZE.md) و[المراجعة](CUSTODY_MOVEMENT_ACCESS_RECONCILIATION.md) و[الاكتشاف](CUSTODY_MOVEMENT_ACCESS_DISCOVERY.md). كتب العاملان مواصفات مصدر غير منفذة؛ لم يتم بناء أو اختبار أو تشغيل متصفح أو قاعدة بيانات أو هجرة أو commit. المالك مسؤول عن مراجعة مخطط وتجهيز بيانات التجربة الحقيقية في هجرته، ثم قبول تشغيل الصلاحيات والفروع والتصدير. اسم مقترح للهجرة: `CustodyMovementEmployeeAndOptionalAgreement`.

**الخطوة التالية:** اكتشاف وحدة `DeliveryMovement` من صف الجرد التالي في القائمة نفسها. يجب قراءة Speed وتجميد عقد هذه الوحدة قبل تنفيذها، وعدم نقل افتراض «موظف مسؤول واحد» إليها تلقائيًا. حافظ على تغييرات المستخدم والزملاء في المستودعين؛ أي ملفات مواصفات جديدة موجودة لكنها غير متتبعة لا تُحذف.

## الطلب المستمر

إتمام تطبيق الصلاحيات على باقي الشاشات وكل الأحداث الموجودة فعليًا، وحدة
كاملة في كل مرة: الخلفية والقائمة والمحرر والنوافذ والإخراج والمداخل
المتصلة ودليل المستخدم والتوثيق. توجيه المالك: «كمل بدون أسئلة واختار
الأنسب»، مع تجميع مراجعته التشغيلية للنهاية. لا تتوقف عند خطة إن كانت
العقود محسومة، ولا ترقي وحدة في الجرد بسبب تبعية صغيرة اكتملت منها.

## مساحة العمل والتعليمات

المجلد العام:
`F:\My Work\Sigma`

مستودع الخلفية:
`F:\My Work\Sigma\SigmaBackend`

مستودع الواجهة:
`F:\My Work\Sigma\SiGmaAngularFrontEnd`

الكتب المرجعية:
`F:\My Work\Shaban Documents\Shaban\sigma-erp`

ابدأ بقراءة AGENTS.md في مساحة العمل، ثم .agents/SIGMA_WORKFLOW_RULES.md
كاملًا ومهارة .agents/skills/sigma-screen-refactor/SKILL.md. اختر الكتل
والحزم المناسبة من الكتب الحالية، وتحقق من الحزم قبل استعمالها. Superpowers
متاحة في بيئة هذا الشات واستُخدمت مهاراتها المناسبة؛ تحقق من توفرها في
الشات الجديد ولا تفترض التحميل. اقرأ مرجع سبيد وشرحه ثم دورة الكود المؤرخة
للوحدة؛ أودو مكمل فقط لما يبقى غامضًا وذا صلة.

الحد الحالي مصدر فقط: لا build أو tests أو typecheck أو lint أو متصفح
أو أوامر قاعدة بيانات أو هجرات أو snapshots أو commits/push/deploy ضمن
الاستكمال الحالي. لا تنقل التفويض القديم الخاص بتجارب وهجرات سابقة إلى
الشريحة الجديدة. الفحص النحوي وقراءة المصدر ومطابقة imports وJSON/XML
والفروق المحصورة مسموحة، ولا تعني نجاح البناء أو التشغيل.

المستودعان بهما تغييرات سابقة كثيرة وملفات جديدة غير متتبعة. حافظ عليها،
ولا تنظف الشجرة أو تسترجع ملفات أو تنسب كل فرق Git إلى عملك. استخدم
workdir صريحًا. لا Sigma MCP أو Graphify أو مسح شامل للحل. لا تقرأ الملفات
ذات الاسمين المتقاعدين المذكورين في التعليمات. التفويض إلى وكلاء يخضع
للتعليمات السارية والعقد المشترك وحدود ملكية الملفات؛ لا توجد مهمة وكيل
جارية تحتاج انتظارًا لهذه الشريحة. محاولتان سابقتان فشلتا بحد الاستخدام.

## آخر ما أُنجز

آخر وحدة مكتملة في المصدر: عروض أسعار الليموزين، بالقائمة والمحرر والإخراج
والاعتماد/الرفض الداخليين واعتماد/رفض العميل وإعادة المراجعة والحذف.
الإنشاء مستقل عن العرض بمصادره الستة، والتعديل يحتاج العرض والمصادر.
الفلاتر الاختيارية لا تمنع قراءة القائمة. الخادم يعلن اعتماديات View من
PermissionPrerequisites ويصنف العمليات الخمس في الكتالوج ويمنع التفعيل405.
فحص الحالة والكتابة مشاركان في قفل الشركة/الكيان عبر ExecuteUniqueWriteAsync.
العرض التجاري مشترك داخل الشركة؛ Location ليس BranchId.

قُيدت القراءات والتأكيدات والطباعة ونتائج الكتابة بمالك السياق والجلسة.
المسودة تُحفظ عند سحب المنحة مؤقتًا، والكتابة المرسلة تستقر مرة واحدة
دون نشر نتيجتها لسياق آخر. تجديد التوكن لا ينهي الجلسة، لكن الدخول الجديد
ينهي الشاشة السابقة ولو للحساب نفسه. دليل الليموزين محدث باللغتين.

المراجع الحاكمة للحالة:

- اقرأ [مطابقة عروض أسعار الليموزين](LIMO_QUOTATION_ACCESS_RECONCILIATION.md).
- اقرأ [عقدها المجمد](LIMO_QUOTATION_ACCESS_CONTRACT_FREEZE.md).
- اقرأ [نقطة الاستكمال العامة](AUTHORIZATION_IMPLEMENTATION_CHECKPOINT_20261107.md).
- اقرأ [مرجع الوحدات](MODULE_PERMISSIONS_COVERAGE.md) و[الجرد](ROUTE_PERMISSION_ADOPTION_INVENTORY.json).

الجرد الحالي263 بندًا تاريخيًا:139 مؤكد العمليات،65 محدد المورد،55 مجهولًا،
وبندان للسياق وبندان لمسارات بديلة. توجد7 بنود متقاعدة ضمن baseline؛
الأعداد ليست نسبة اكتمال كل أحداث كل شاشة. لم يكتمل التطبيق كله.

آخر تحقق منفذ: نحو15 ملفًا/قالبًا للواجهة،189 مسار استيراد محلي و241 اسمًا
مستوردًا بلا findings؛ نحو6 ملفات C#؛ XML لثلاثة مشاريع؛ JSONC لإدراج
helper التطبيق؛ الحزم8/8؛ فحص فروق محصور وJSON وروابط الوثائق وعد الجرد.
المواصفات أُضيفت ولم تُنفذ. البناء والقبول التشغيلي ما زالا مطلوبين.

ملفات المصدر الأساسية للوحدة المنتهية، للرجوع عند الحاجة فقط:

- الواجهة: مجلد Limousine/LimoQuotation؛ helper والمناظر والخدمة والمواصفات،
  وroute-access-policy.ts/spec.ts وtsconfig.app.json ودليل limousine-guide.ts.
- الخلفية: LimoQuotationService.cs وPermissionPrerequisites.cs
  وReviewedPermissionOperations.cs وPermissionEndpointResolver.cs
  وLimoQuotationAccessContractTests.cs. المتحكم استُخدم كدليل ولم يتغير.

## ابدأ من حركات العهدة

اقرأ أولًا [اكتشاف حركات العهدة](CUSTODY_MOVEMENT_ACCESS_DISCOVERY.md).
حالتها Draft: اكتشاف أولي فقط، لم يبدأ تعديل مصدرها ولم يُجمد عقدها،
وصفها لا يزال resource-only.

المصدر الأمامي تحت:
`F:\My Work\Sigma\SiGmaAngularFrontEnd\src\app\modules\Movements\CustodyMovement`

المصدر الخلفي:
`F:\My Work\Sigma\SigmaBackend\SiGma.Business\Services\CustodyMovementService.cs`

المتحكم:
`F:\My Work\Sigma\SigmaBackend\SiGma.ServerAPI\Controller\CustodyMovementController.cs`

المسار الفعلي في routing.ts:380. القائمة تستضيف نافذة إنشاء/عرض؛ توجد
مسارات قائمة وcreate وdetails/:id. لا دليل على تعديل نشط حتى الآن، فلا
تفترض دعم Update من مرشح الجرد. القراءة GET تستخدم GetManyWithNavigationsAsync،
والتفاصيل GetByWithNavigationsId، والإنشاء POST. الطباعة من نافذة العرض،
وإكسل يجلب الصفحات كاملة.

الأولوية عند التتبع:

1. أكمل قراءة الخدمة وDTOs والخرائط والمنافذ الموروثة. تحقق من الاشتراك
   الفعلي والصفوف الحية ونطاق Repository.Query؛ الخدمة القديمة تستخرج
   الاشتراك من ClaimTypes.NameIdentifier وتقرأ DbSet مباشرة. لا تدّعِ
   تسريبًا أو سبب رفض تشغيلي قبل إثباته.
2. افحص BranchId المحفوظ وBranchScopeRegistry، وعلاقة المركبة والعقد
   وفرع الحركة. العرض والاستعلامات والكتابة يجب أن تتفق على النطاق الفعلي.
3. افصل مصادر العقود والفروع والمركبات الإلزامية عن الاختيارية، ثم جمّد
   حزمة الإنشاء ومنح العرض والإخراج وأي فعل مدعوم فعلًا. راجع سبيد للقسم
   13-movements قبل تجميد القرار، وأكمل أدلة UI2/UI22 والأداء.
4. أصلح عمر القائمة والنافذة والتأكيدات والقراءات والإخراج. الحفظ الحالي
   يستخدم takeUntilDestroyed؛ يلزم استقرار مستقل للكتابة المرسلة وختم
   النجاح. الطباعة من finalize تحتاج ربطها بنجاح القراءة الحالية وملكيتها.
5. أكمل التنفيذ المتوافق والمواصفات المصدرية وفحص الفروق ودليل الوحدة،
   ثم وثق المطابقة وحدّث الجرد والعدادات ونقطة الاستكمال. لا ترقِّ الوحدة
   قبل اكتمال كل مساراتها الحالية.

## قرارات سابقة تُراعى دون إعادة السؤال

المستخدم العادي يحتاج منحة العملية وإسناد الفرع المناسب. صلاحيات الفروع
عرض وتسجيل وتحويل؛ التحويل إضافة إلى صلاحيات الفرعين. المستند الكامل متعدد
الفروع يحتاج استعراض جميع فروعه؛ التقارير المصنفة لعرض الأثر تُقيد بالسطور
المسموحة. التعريفات مشتركة داخل الشركة. الفرع التاريخي للحركة يظل محفوظًا
ولا يتبع انتقال المركبة لاحقًا. لا تمنح مستخدمًا بلا فروع وصولًا افتراضيًا.

إقفال السنة والشهر وإعادة الفتح وتهيئة الأرصدة الافتتاحية لمدير الشركة فقط،
مع المصدر الموحد للقيود الإدارية والاعتماديات المعلنة في الكتالوج. لا تضف
شروط أسماء متناثرة داخل المرشح. منح الأزرار والمسار والخادم تُراجع معًا.
راجع حالات H1/M2/M4 وباقات الشاشات الأوسع في ملفاتها الحالية؛ لا تعتبر
اكتمال وحدة الليموزين إغلاقًا لتلك الملاحظات أو تفترض تنفيذها من هذا التسليم.

البيانات الحالية تجريبية؛ صمّم النموذج الصحيح ولا تضف حلول توافق للحفاظ
على سجلات تجريبية فقط. ذلك لا يجيز تلقائيًا حذف البيانات أو تشغيل الهجرات.
أي schema لازم يُسجل باقتراح هجرة للمالك وفق الحدود السارية.
