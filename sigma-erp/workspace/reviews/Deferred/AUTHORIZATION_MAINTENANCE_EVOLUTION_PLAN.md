# Authorization (permissions) — Maintenance / Evolution Plan (deferred)

| | |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Decision | Owner: keep authorization with the deferred work for now ("خلى الصلاحيات مع المؤجلات حاليا") |
| Origin | Audit 4 finding A4-10 and decision D4-1; foundation plan slice F6 (`reviews/Archive/SIGMA_FOUNDATION_MAINTENANCE_EVOLUTION_PLAN.md`) |
| Book | UI block 26 (Transitional), UI backlog 20; Master block 5 *Security and authorization* |

## متابعة البنود ٢٥٠–٢٦٣ — ١٥ نوفمبر ٢٠٢٦

ينتهي [جرد المسارات](../Authorization/ROUTE_PERMISSION_ADOPTION_INVENTORY.json) عند البند ٢٦٣. تسجل هذه الدفعة سبعة بنود مؤكدة من المصدر وخمسة قيد التحقق وبندين محددي المورد. توضح الملاحظات الفجوات الحالية في ربط العمليات والتحقق، بما فيها ما يظل مفتوحًا في البنود المؤكدة من المصدر.

| البند | ما ثبت من المصدر | الملاحظة والمتابعة |
|---|---|---|
| ٢٥٠ — `Reports` | الجذر حاوية تضم ١٧ مسارًا فرعيًا في `reports.routes.ts`. سجل الواجهة يعرّف خمس سياسات محددة: `TrialBalance` و`VehicleRentalDetails` و`VehiclesRevenue` و`VehiclePriceBasedOnTariffGroup` و`VehicleProfitAndLoss`. | **تصحيح وصف الجرد:** سبب الحالة يذكر ميزان المراجعة وحده. وثّق السياسات الخمس كمسارات فرعية مستقلة، مع إبقاء الجذر وبقية الأطفال خارج التبني حتى مطابقة كل تقرير مع طلبه ومنح فلاتره ومخرجاته. لا تمنح الحاوية صلاحية عرض لبقية التقارير. |
| ٢٥١ — `openingBalances` | ثمانية مصادر تحت مالك مشترك. العرض بمنح كل تبويب، والحفظ بـ`AddList` للمصدر، وتهيئة التاريخ لمدير الشركة. الحسابات ومراكز التكلفة تستندان إلى فرع السجل، والمصادر الستة الأخرى تتبع فرع القيد المرتبط. | **القبول المعلق:** تحقق من أن استبدال مجموعة كاملة `AddList` يحافظ على حدود المصدر والفروع عند وجود صفوف محجوبة، وأن صلاحية كتابة تبويب لا تمتد إلى تبويب آخر. طابق نتيجة الحفظ مع التحقق من النسخة والقيد الناتج. |
| ٢٥٢ — `Designations` | المسار يستخدم `StaffDesignation.View` وتفصل جلسة التعريفات العرض عن الإنشاء والتعديل والحذف. التصدير يقرأ الصفحات المطابقة. | **مدخلات القائمة:** `StaffDesignation` غائب عن `ReviewedListFields`، والخدمة ترث مطابقة الحقول والفرز العامين. احصر مدخلات التصفية والفرز في الحقول التي يستهلكها العقد، وطابق حدود العرض والعد مع تصدير كل الصفحات. |
| ٢٥٣ — `auditTrail` | القائمة والتصدير يقرآن `AuditTrail.Get`، ومصدر المستخدمين يقرأ `AuditTrail.GetUsers`. الاستعلام يعيد اسم المستخدم وتغييرات السجل من نطاق المستأجر. كلا المفتاحين مسجّل في كتالوج الخادم. | **تبنّي العرض ونطاق السجل:** اربط المسار وقراءة الصفحات والتصدير بالمنحة المناسبة، وحدد من يمكنه الاطلاع على تغييرات السجلات على مستوى الشركة. طابق عرض مرشح المستخدم وشرط قبوله في HTTP مع سياسة `GetUsers`. تحقق من توقف القراءات والمخرجات عند انتهاء الوصول. |
| ٢٥٤ — `closedLeaseAgreements` | القائمة المشتركة تفرض `closedOnly` و`isClosed=true`. المسار يستخدم `LeaseAgreement.View`؛ وتقتصر مسارات التفاصيل على وضع العرض وتخضع لنطاق العقد في الخادم. | **القبول المعلق:** تحقق من استمرار قيد المغلق في التصفح والبحث والمخرجات المتاحة، ومن رفض تفاصيل عقد خارج فروع العرض. حالة الإغلاق قيد القائمة الحالية، وتستخدم التفاصيل منحة العقد المشتركة. |
| ٢٥٥ — `messageLogs` | مفتاح الخادم `MessageLogs.Get` يطابق طلب القائمة وصفحات التصدير والطباعة. الإسقاط يتضمن أطراف الرسالة وعنوانها ومعلومة الخطأ. | **تبنّي السجل وحماية مخرجاته:** ثبّت من يقرأ سجل رسائل الشركة. اربط فتح المسار والنتائج والتصدير وإطار الطباعة بالمنحة الحالية، مع إلغاء ما لم يُنشر عند سحبها. |
| ٢٥٦ — `errorLogs` | الخادم يراجع `ErrorLogs.Get` للقائمة و`ErrorLogs.GetById` للتفاصيل. نافذة التفاصيل تعرض حقول التشخيص، وتقرأ القائمة والتصدير الملخص. | **فصل الاطلاع على التفاصيل:** اربط المسار والنتائج بمنحة القائمة، وطابق إتاحة نافذة التشخيص مع منحتها. تحقق من صلاحية القائمة وحدها ومن إغلاق التفاصيل وإبطال تصدير معلق عند سحب الوصول، واعتمد نطاق إتاحة بيانات التشخيص. |
| ٢٥٧ — `staffAlerts` | الشاشة تخص تنبيهات وثائق الموظفين. تقرأ القائمة والتصدير بـ`Staff.Alerts`، ويقرأ اختيار الموظف من `Staff/GetSelect`. الخدمة تقبل مرشح الموظف بالاسمين المدعومين. | **تبنّي الشاشة ومرشح الموظف:** طابق سياسة المسار والمخرجات مع `Staff.Alerts`، وشرط `Staff.Lookup` عند استخدام أي اسم لمرشح الموظف. احسم نطاق ظهور تنبيهات الوثائق داخل الشركة، واختبر العرض دون اختيار، والفلتر بمنحته، وسحب المنحة خلال التصدير. |
| ٢٥٨ — `BankReconciliation` | الواجهة تشترط منحة قراءة الجلسة واختيار البنك وطريقة الدفع؛ الإتمام له منحة مستقلة. يتحقق الخادم من تغطية التسجيل على فروع الحساب داخل معاملة الإتمام. | **اعتماديات HTTP:** الخادم يستهلك `bankId` و`paymentMethodId` في طلب الجلسة دون قواعد تمنح هذه الاختيارات في `PermissionPrerequisites.For`. طابق اعتمادي القراءة الإلزاميين مع العقد، وثبّت ما إذا كانت حزمة شاشة الإتمام شرطًا للطلب المباشر أيضًا. اختبر حسابًا مشتركًا مع تغطية تسجيل كاملة وجزئية. |
| ٢٥٩ — `reconciliationReport` | قراءة التاريخ مستقلة، ومرشح البنك في الواجهة اختياري، والإلغاء يتطلب منحة العملية وفروع التسجيل، ويعيد الخادم فحص نطاق الحساب. | **مرشح البنك في HTTP:** يطبق `GetReconciliationReportAsync` معرّف البنك عند إرساله، بينما لا تتحقق قواعد الاعتماد من `Bank.Lookup` لهذا التقرير. طابق الشرط الاختياري، وتحقق من قراءة التاريخ دون مرشح ومن رفض الإلغاء عند نقص نطاق التسجيل. |
| ٢٦٠ — `Budget` | محرّر الموازنة يحرس القراءة بالسنة المالية وخيارات مجموعة الحساب، ويضيف `AccountReports.SaveBudget` للتعديل والحفظ. يتحقق الخادم من السنة والأشهر وأهلية الحساب قبل حفظ الخلايا. | **حزمة القراءة والحفظ في HTTP:** تسجل نقاط الخدمة صلاحيات القراءة والحفظ منفصلة دون الاعتماديات التي تطبقها الواجهة. ثبّت شروط طلب القراءة والكتابة المباشرين، وراجع أثر غياب منحة السنة أو المجموعة على كل طلب. اختبر العرض وحده وحفظ الخلايا بعد استيفاء المنح. |
| ٢٦١ — `BudgetVariance` | الواجهة تشترط `FiscalYear.GetSelect` وتعرض مرشحي نوع الحساب وحسابه بمنحهما. يستخدم التقرير المالك المشترك لتقييد سياق النتيجة والطباعة. | **مرشحات التقرير في HTTP:** الخدمة تستهلك السنة الإلزامية ونوع الحساب وحسابه الاختياريين، ولا تطبق `PermissionPrerequisites.For` قواعدها. طابق `FiscalYear.GetSelect` وشرطي `AccountGroupDefinition.GetReportOptions` و`Account.GetPostingSelect` عند استخدام المرشحين وفق العقد. تحقق من القراءة دون المرشحات الاختيارية ومن رفض إرسال مرشح بلا منحته. |
| ٢٦٢ — `SupportRequest` | الواجهة تستدعي القائمة والتفاصيل والتصدير والإنشاء بطريقتيه والتعديل والإغلاق. الإنشاءان يتشاركان `SupportRequest.Create`، والإغلاق له `SupportRequest.Close`. المحرر يقرأ الاتفاقات المتاحة عند الإسناد. | **أولوية مرتفعة لمرفقات الدعم:** ينتهي رفع المرفق في `FileStore` إلى جذر ملفات الويب، ويعرضه المحرر كرابط ملف عام. اربط قراءة المرفق بمنحة عرض الطلب وملكيته المعتمدة عبر التخزين الخاص، وحدد معالجة المرفقات القديمة. وثّق أيضًا نطاق الطلب (الشركة أو صاحب الطلب/المكلّف) وربط الإسناد والإغلاق بالمنح والحالة الحالية. تحقق من رفض قراءة المرفق عند سقوط حق عرض الطلب. |
| ٢٦٣ — `SupportSlaAgreement` | القائمة والمحرر يستهلكان العرض والإنشاء والتعديل والتصدير. `SupportSlaAgreement.Available` اختيار مستقل لمحرر طلب الدعم، والخدمة تستبعد المعطّل والمنتهي. يمنع الخادم حذف اتفاق مرتبط بطلب. | **فصل الاختيار من الإدارة:** اربط صفحة الإدارة ومحررها بمفاتيح العرض والكتابة الفعلية، وامنح الخيار التشغيلي وفق عقد طلب الدعم دون منح إدارة الاتفاقات. احسم قابلية إسناد الحذف الموروث في غياب زر حذف. تحقق من اختيار اتفاق متاح بحساب إنشاء طلب فقط ومن رفض أعمال الإدارة لهذا الحساب. |

**أدلة المصدر.** تمت مطابقة استيرادات `routing.ts` مع `route-access-policy.ts` وخدمات الواجهة. في السجلات والتنبيهات قورنت عمليات المتحكمات وخدماتها مع `ReviewedPermissionOperations.cs` وإسقاطات النتائج. في الحسابات قورنت مفاتيح الواجهة مع `PermissionPrerequisites.cs` وقراءات `AccountReportsService` وفحص التسجيل داخل معاملتي التسوية. في الدعم تمت مطابقة `SupportRequestController` و`SupportSlaAgreementController` وخدمتيهما مع الرفع وعرض المرفقات. العقود القائمة هي [الأرصدة الافتتاحية](../Authorization/OPENING_BALANCES_ACCESS_ADOPTION_CONTRACT_FREEZE.md)، [تعريفات الموظفين](../Authorization/STAFF_DEFINITIONS_CUSTOMER_REQUESTS_ACCESS_CONTRACT_FREEZE.md)، [عقود التأجير](../Authorization/LEASE_AGREEMENT_ACCESS_CONTRACT_FREEZE.md)، [التسوية البنكية](../Authorization/BANK_RECONCILIATION_ACCESS_ADOPTION_CONTRACT_FREEZE.md)، [الموازنة](../Authorization/BUDGET_ACCESS_ADOPTION_CONTRACT_FREEZE.md)، [تقارير القوائم المالية](../Authorization/ACCOUNT_STATEMENTS_ACCESS_ADOPTION_CONTRACT_FREEZE.md) و[عقد الدعم](../Archive/Completed/2026-10-23/SUPPORT_FULL_STACK_CONTRACT_FREEZE.md).

**المراجع والقبول.** استُخدمت كتل الدليل الرئيسي المعنية وعقد صلاحيات الواجهة (UI26) وقاعدة مدخلات القوائم المحمية (BE9). روجع دليل سبيد في المالية والإدارة، ثم ملفات الشاشات وأكوادها المؤرخة في ٢٨ أكتوبر، ومنها `C0517/C0359/C0004/C0849/C0019/C0003/C1111/C0603/C0648/C0476/C0477/C0436/C0434`. تثبت أمثلة الواجهة وظائف البحث والإخراج والتسوية والدعم، أما قرارات الصلاحيات والملكية فمرجعها عقود Sigma. فهرس أودو المحلي متاح، وفجوات هذه الجولة تخص سياسة الوصول في Sigma. التحقق مصدري، وقبول HTTP والمتصفح وSQL معلّق.

## متابعة البنود ٢٣١–٢٤٠ — ١٥ نوفمبر ٢٠٢٦

في [جرد المسارات](../Authorization/ROUTE_PERMISSION_ADOPTION_INVENTORY.json)، سبعة بنود من هذه الدفعة مؤكدة من المصدر، وبندان محددا المورد، وبند واحد رابط تحويل. «مؤكد من المصدر» يصف ربط العمليات القائمة في الجرد. تبقى الملاحظات أدناه مفتوحة حتى تتطابق الواجهة وطلبات الخادم المباشرة ويُستكمل القبول التشغيلي.

| البند | ما ثبت من المصدر | الملاحظة المفتوحة ومعيار التحقق |
|---|---|---|
| ٢٣١ — `IncomeStatementYtd` | يقرأ التقرير بمنحة `AccountReports.GetIncomeStatementYtd`، ويحرس مكوّن التقرير مرشحي الفرع ومجموعة مراكز التكلفة. | **٢٣١–٢٣٤ / مرشحات قوائم الدخل:** خدمة التقرير تقرأ قيم المرشحات المرسلة، لكن `PermissionPrerequisites.For` لا يطبق شروطها على العمليات الأربع. طابق شروط HTTP مع كل صف، وتحقق من نجاح التقرير بلا مرشحات اختيارية ورفض المرشح عند غياب منحته. في ٢٣١ يلزم `Branch.Lookup` و`CostCenterGroup.Lookup` عند استخدام كل مرشح. |
| ٢٣٢ — `IncomeStatementYtd2` | منحة `AccountReports.GetIncomeStatementYtd2` ومرشح فرع محروس في الواجهة. | تطبق ملاحظة ٢٣١–٢٣٤ على `Branch.Lookup` عند استخدام مرشح الفرع. |
| ٢٣٣ — `IncomeStatementFy` | منحة `AccountReports.GetIncomeStatementFy` ومرشحا الفرع ومجموعة مراكز التكلفة محروسان في الواجهة. | تطبق ملاحظة ٢٣١–٢٣٤ على منحتي الفرع ومجموعة مراكز التكلفة عند استخدام كل مرشح. |
| ٢٣٤ — `IncomeStatementFy2` | منحة `AccountReports.GetIncomeStatementFy2` ومرشح فرع محروس في الواجهة. | تطبق ملاحظة ٢٣١–٢٣٤ على `Branch.Lookup` عند استخدام مرشح الفرع. |
| ٢٣٥ — `Ledger` | المسار ومكوّن التقرير يشترطان `AccountReports.GetLedger` و`Account.Lookup`. يظل دفتر الأستاذ قراءة أثر محاسبي بحسب تصنيف الخادم، وتستخدم الطباعة المؤجلة تحقق المالك المشترك. | **اعتماديات طلب الأستاذ:** `GetLedgerAsync` يقرأ الحساب الإلزامي ومرشحي الفرع ومجموعة التكلفة الاختياريين، بينما تفتقد العملية قواعد الاعتماد في `PermissionPrerequisites.For`. طابق `Account.Lookup` الإلزامية والمنحتين الشرطيتين مع حارس HTTP. تحقق من نطاق الحركات والأرصدة الافتتاحية عند تطبيق المرشحات وغيابها. |
| ٢٣٦ — `Department` | القائمة والمحرر يستهلكان مالك جلسة التعريفات ومفاتيح `Department`، ويعرضان الاسم والوصف. | **حدود مدخلات القائمة:** `DepartmentService` يرث تطبيق المرشحات المباشرة وفرز حقول الكيان في `Service.cs`، والمورد غائب عن `ReviewedListFields`. ثبّت قائمة البحث والمرشحات وفرز الحقول المستخدمة فعليًا، وتحقق من رفض الحقول خارجها قبل العد والترقيم مع بقاء البحث بالاسم. |
| ٢٣٧ — `LeaveOpeningBalance` | القائمة النشطة تستدعي عرض الأرصدة والتفاصيل والتصدير المرقم والإنشاء والتعديل والحذف. تحمل القائمة والمحرر اختيارات الموظف ونوع الإجازة. | **تبنّي وصول الشاشة ونطاق السجل:** لا سياسة للمسار أو دورة للجلسة في القائمة والمحرر. محلّل HTTP يعطي العمليات العامة منحها، لكن شروط `Staff.Lookup` و`LeaveType.Lookup` غائبة عند استخدام المرشحات المعنية. الرصيد لا يحمل فرعًا تاريخيًا ولا يملك تعريف نطاق في `BranchScopeRegistry`. احسم هل الرصيد تعريف على مستوى الشركة أم سجل يتبع فرعًا تاريخيًا قبل اعتماد حد القراءة والكتابة. اختبر العرض وحده، حماية المخرجات، وإبطال القراءات أو التأكيد عند تبدل الوصول. |
| ٢٣٨ — `AccountLinking` | يتطلب المسار `LinkAccounts.GetHrm`. تفصل الواجهة الحفظ والمعاينة والتطبيق، ويمنع الحفظ العام نطاق الرواتب لغير المدير. | **تطابق اعتماديات HTTP:** تشترط الواجهة القراءة قبل الحفظ والمعاينة، والقراءة والمعاينة قبل التطبيق. الخادم يراجع المفاتيح الأربعة كعمليات مستقلة، دون تلك الشروط في `PermissionPrerequisites.For`. يلزم حسم تطبيق الاعتماديات نفسها على الطلب المباشر أو اعتماد تفويض مستقل له صراحةً، والتحقق من حالات كل منحة على حدة. |
| ٢٣٩ — `Setting` | يحوّل المسار `/Setting` بالكامل إلى `/HrmSetting`. | تتبع حالة الوجهة في ٢٤٠. تحقق عند قبولها من مساواة فتح الرابطين للحسابات المسموح لها والمرفوضة. |
| ٢٤٠ — `HrmSetting` | شاشة الموارد البشرية تقرأ `GET HrmSetting/Mine` و`GET HrmSetting/options` وتحفظ عبر `PUT HrmSetting/Mine`. للمنافذ مفاتيح مراجَعة في الخادم. | **سياسة الشاشة والمنافذ المشتركة:** لا سياسة وصول للشاشة المستقلة، والتحميل والتحرير والحفظ يرتبط كل منها بحالة النموذج دون منح الجلسة. تبويب `/Settings/hrmSetting` الإداري يستهلك أيضًا `Mine` نفسه، و`SettingsWorkspaceAdminEndpointRules` يستثني المورد عن قصد بسبب المستهلك المستقل. ثبّت منح القراءة والخيارات والحفظ، وبيّن هل يحتاج مستهلك الإدارة منفذًا إداريًا مستقلًا. احصر منافذ CRUD الموروثة المستعملة قبل اعتمادها أو إغلاقها. تحقق من العرض دون الحفظ ومن سحب القراءة أثناء التحميل والحفظ. |

**أدلة المصدر.** في التقارير، تتطابق الإعدادات مع عمليات `AccountReportsController`، وتُقرأ قيم المرشحات في `AccountReportsService.cs` داخل `GetIncomeStatementYtdAsync` و`GetIncomeStatementYtd2Async` و`GetIncomeStatementFyAsync` و`GetIncomeStatementFy2Async` و`GetLedgerAsync`. تمت مقارنة ذلك بقواعد المنح وتصنيف حركة التقارير، وبحارس الطباعة في `AccountReportPageComponent`. في الموارد البشرية، تمت المطابقة من `routing.ts` إلى خدمات كل شاشة ومتحكمها، وإلى `DepartmentService` و`LeaveOpeningBalanceService` و`LinkAccountsController` و`HrmSettingService`. العقود القائمة في [القوائم المالية](../Authorization/ACCOUNT_STATEMENTS_ACCESS_ADOPTION_CONTRACT_FREEZE.md)، [الأستاذ](../Authorization/LEDGER_TRIAL_BALANCE_ACCESS_ADOPTION_CONTRACT_FREEZE.md)، [تعريفات الموظفين](../Authorization/STAFF_DEFINITIONS_CUSTOMER_REQUESTS_ACCESS_CONTRACT_FREEZE.md)، [رصيد افتتاح الإجازات](../LEAVE_OPENING_BALANCE_FULL_STACK_CONTRACT_FREEZE.md)، و[ربط حسابات الموارد البشرية](../Authorization/HRM_ACCOUNT_LINKING_ACCESS_ADOPTION_CONTRACT_FREEZE.md).

**المراجع والقبول.** استُخدمت قواعد الدليل الرئيسي وكتلة صلاحيات الواجهة (UI26) ومدخلات القوائم المحمية (BE9). روجع دليل سبيد وملفات الشرح للأقسام المعنية من الحسابات وإدارة الموارد البشرية، ثم كود لقطة ٢٨ أكتوبر للمتحكمات `C0494/C0495/C0491/C0492/C0500` و`C1583/C1582/C0376/C0368/C0395`. تقابل هذه الأدلة التقارير والمرشحات والإخراج وإجراءات القوائم والحفظ القائمة. القرارات المفتوحة تتعلق بمنح Sigma ونطاق الفروع فيها، فلا يلزم الرجوع إلى أودو لحسمها. التحقق في هذه الجولة مصدري، وقبول HTTP والمتصفح وSQL معلّق.

## متابعة البنود ٢١١–٢٢٠ — ١٤ نوفمبر ٢٠٢٦

راجع [عقد الدفعة](../Authorization/AUTHORIZATION_211_220_ACCESS_CONTRACT_FREEZE.md) و[المطابقة وملاحظات إعادة المراجعة](../Authorization/AUTHORIZATION_211_220_REVIEW_REMEDIATION_20261114.md#إعادة-مراجعة-تعديلات-المالك--١٤-نوفمبر-٢٠٢٦). تصف أقسام الخطة المؤرخة أدناه مراحل التصميم السابقة. حالة التبني الحالية في [مرجع الوحدات](../Authorization/MODULE_PERMISSIONS_COVERAGE.md) و[جرد المسارات](../Authorization/ROUTE_PERMISSION_ADOPTION_INVENTORY.json)، وفيه **١٨٨/٢٦٣** صفًا بربط عمليات مؤكد من المصدر.

| البنود | حالة المراجعة | المتابعة |
|---|---|---|
| ٢١١، ٢١٣، ٢١٨، ٢٢٠ | روابط قديمة تحوّل إلى قوائم المستندات الأم دون تمرير معرّف البند. في ٢١١ ترفض الخدمة والفلتر العمليات المستقلة بـ`405`. | قبول فتح الروابط المباشرة بمنح الوجهة والتحقق من استجابة HTTP للبند ٢١١. |
| ٢١٢، ٢١٤، ٢١٥ | سند الدفع يتبع عقده السابق. البند ٢١٤ هو صف جذر المخصصات المكرر، والبند ٢١٥ صف بنود المخصصات المتقاعد. | يبقى قرار فرع تعريف المخصصات في [عقد المخصصات](../Authorization/PROVISIONS_ACCESS_CONTRACT_FREEZE.md). |
| ٢١٦ — أوامر الشراء | ربط العمليات قائم. تهيئة أمر من أمر شغل تحتاج مطابقة `Job.View` مع دورة تحميل المصدر وسحب المنحة. | متابعة الملاحظة ٢١٦-١. |
| ٢١٧ — طلبات الشراء | ربط العمليات قائم بالمورد `PurchaseRequests`. بقيت اعتماديات محرر التحويل، إلغاء الطباعة المعلّقة، وتصنيف فرع قراءة المسودة. | متابعة الملاحظات ٢١٧-١ إلى ٢١٧-٣. |
| ٢١٩ — مرتجعات الشراء | ربط العمليات المالية والعينية ومصادرها قائم من المصدر. | قبول عزل الفروع والأرصدة والتزامن معلّق. مخرجات الطباعة وExcel والتقرير تحتاج عقدًا مستقلًا. |

التحقق في هذه الجولة مصدري. قبول HTTP والمتصفح وSQL Server معلّق.

## Current state (2026-10-01, re-check before implementation)

| Where | What exists |
|---|---|
| `SiGma.Security` (login server) | Issues JWTs with `ClaimTypes.Role` claims from the user's roles, and defines the policies `SuperAdmin`, `Admin`, `DashboardUser` and `Customer` (`Program.cs` 147–170). They are used on its own `AuthenticateController` endpoints |
| `SiGma.ServerAPI` | `AddAuthorization` sets only a default "authenticated user" policy; the role policies are commented out (`DependencyResolver.cs` 75–90). `SiGmaControllerBase` has `[Authorize]` with a commented `Policy = "DashboardUser"`. No `[AllowAnonymous]` endpoints |
| Tenant | Resolved from `ClaimTypes.NameIdentifier` (BE backlog 11) — tenant isolation works independently of permissions |
| Angular | `AuthGuard` is authentication only. No permission service, directive or route data. Row actions use `ActionList.visible/disabled` for **business state** only |

So every signed-in user of a tenant can read and change everything in that tenant.

## Why it is deferred, and what that means meanwhile

- Screen reviews go on without a permission model. They must not invent permission APIs or describe a hidden control as secured (AGENTS, UI 26).
- When a screen review finds an action that clearly needs a restriction (delete posted data, close a period, change settings), it is recorded in that screen's review under **"Authorization candidates"**. That builds the permission inventory for this plan instead of losing it.
- Accepted cost: screens reviewed before this plan is implemented get a second, smaller pass (route data + action visibility) afterwards.

## Options to decide when the plan is resumed

| Option | Shape | Pros | Cons |
|---|---|---|---|
| A. Roles only | Use the existing role claims; API policies per controller group; Angular hides routes/actions by role | Uses what the login server already issues; smallest change | Coarse; every new need becomes a new role |
| B. Permission claims | Roles map to permissions (`Invoice.Post`, `Settings.Edit`, …) issued in the token; `[Authorize(Policy = "Invoice.Post")]`; Angular `hasPermission` directive + route data | Fine-grained, auditable, one vocabulary for API and UI | Needs a permission catalogue, role editor, and token size care |
| C. Server-side permission lookup | Permissions stored per role in the Sigma DB and checked by a policy handler per request | Changes apply without re-login | Extra lookup per request (cache); more moving parts |

## Open owner decisions

1. Model: A, B or C (recommendation at the time of Audit 4: B).
2. Who administers roles/permissions (tenant admin vs platform admin).
3. Granularity for the first release: per screen (view/edit) or per action (post, void, approve, close period).
4. Behaviour of the Angular UI for a missing permission: hide vs disable with a reason.

## Resume checklist

- Re-verify the current state table against source.
- Collect the "Authorization candidates" recorded in screen reviews so far.
- Freeze the decisions above, then run PLAN-00 for the implementation slices (API policies, token/lookup, Angular guard + directive, UI 26 and 7 book updates, backlog 20).

## Design discussion resumed — 2026-10-16

| Item | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Current request | Propose roles/permissions architecture supporting role and/or direct user assignments in the generic-repository project |
| Authorization | Design/source-read-only; no implementation, access restriction or data migration approved |

This appendix preserves the historical deferral above. It resumes design discussion only; none of the recommendations below is an implemented or frozen access policy. Initial recipe -Check passed all eight before PLAN-00 use. No subagents: unresolved shared identity/access contracts and one architecture proposal. No application/instruction source changes, builds/tests/lint/browser/database/migrations/commits/pushes/deployment.

### Rechecked source and uncertainty

| Owner | Source fact | Consequence |
|---|---|---|
| Main API | SiGma.ServerAPI/Controller/SiGmaControllerBase.cs has authenticated-only Authorize; shared Add/Update/Delete/List/Detail/Deep/GetAll/GetSelect/CheckUnique/Activate endpoints | Existing inheritance is the right central mapping point; every endpoint still needs explicit business operation metadata |
| Startup | SiGma.ServerAPI/Extensions/DependencyResolver.cs default policy requires authentication; role policies remain commented | No demonstrated tenant ERP permission enforcement in these owners |
| Role | Helpers/Models/Role.cs has Name/IsDefault; User.cs has Roles | Extend existing tenant role owner, do not create another parallel role table by default |
| Permission | Helpers/Models/Permission.cs has Name/ParentId/Children | Existing display hierarchy can be evaluated for stable catalogue keys; current names are not a frozen permission vocabulary |
| RolePermission | Helpers/Models/RolePermission.cs contains Module/Action/Label, no RoleId/PermissionId | It is not presently a usable role-to-permission assignment; existing data/consumers need inventory before repurposing |
| UserRole | Helpers/Models/UserRole.cs is commented out; ApplicationUser roles property is commented; User has its own Roles collection | Do not assume a new join type without inspecting actual EF mapping/existing User-Roles join |
| Account identities | Helpers/Models/User.cs and ApplicationUser.cs coexist; Security AuthenticateController uses Identity user.Id claims | Define which business user is the authenticated actor and map it explicitly; no ID equality by assumption |
| Tenant claims | Repository constructor treats ClaimTypes.NameIdentifier as integer subscription; Security AuthenticateController issues NameIdentifier=user.Id and Surname=SubscriptionId | Concrete producer/consumer ambiguity. Preserve current tenant isolation and establish an explicit actor/tenant contract before changing claim parsing |
| Actual Angular login | AuthService POSTs baseLoginUrl/auth/consolelogin; Login model has id/subscriptionId/token | The issuer for this exact configured login path is not established by the reviewed Security controller; it must be traced before implementation, without logging live tokens |
| Existing console stub | Business/Services/Security/SecurityService.LoginConsoleAsync returns authentication failure | Not proof of the production issuer or actor relationship |
| Existing platform vocabulary | Helpers/Helpers/SubscriptionPlatformPermissions.cs defines separate subscription platform keys | Keep platform administration and tenant ERP permissions separate; never reuse platform role names as implicit ERP bypass |
| UI | Role details page is legacy scaffold; AuthService/guard does authentication and stored-login state | Role/user assignment UI must be completed against actual APIs; no secured-control claim from hiding alone |

Identity findings are source observations, not a declaration that production tenant filtering is broken: the actual token path/mapping is still Uncertain. The existing frontend Login.id, local User.Id and security Identity user.Id must not be conflated.

### Recommended target (proposal)

Use tenant-scoped roles plus direct user permission overrides, enforced by ASP.NET Core policy handlers with server-side permission lookup and explicit cache invalidation. Prefer server lookup over placing the full effective catalogue in JWTs for this evolving ERP; retain authenticated actor/tenant/session claims and validate them on the server. No new password/identity system is proposed.

Proposed relationships, subject to proven actor mapping and EF/data inventory:

- Permission definition: stable key such as PurchaseRequests.View/Create/Update/Delete/Export, module/group and translated display metadata; code-owned/versioned catalogue, assignment-only tenant administration.
- Role: existing tenant entity extended as needed; no arbitrary platform/system role creation by ordinary tenant admins.
- UserRole: actual tenant actor-to-role association, unique per tenant/user/role; allow multiple roles structurally even if initial UI chooses one.
- RolePermission: tenant role-to-catalogue grant, unique per tenant/role/permission. Refactor existing misleading shape only after its data/consumers are reconciled.
- UserPermission: tenant actor/permission plus Allow or Deny, unique per tenant/user/permission. Inherit is absence of an override, not a contradictory second row.

Recommended evaluation (owner decision pending): union of all role grants plus direct user Allows, minus direct user Denies; no grant means denied. Deny wins over all tenant role grants, including privileged tenant roles, with no hidden bypass. An Allow-only first release is a valid simpler alternative if subtracting inherited grants is not needed; choose explicitly before implementation.

Explain effective access with its sources (role names/direct Allow/direct Deny) in user administration. Example: role grants View/Create/Update, user gets direct Export and direct Deny Update; resulting permissions View/Create/Export. Do not manufacture Approve behavior where the feature has no approval workflow.

### Responsibility and generic integration

| Layer | Proposed responsibility |
|---|---|
| Identity/current actor context | Resolve validated stable actor, tenant membership, active status and session; reject unresolved/disabled accounts |
| Permission catalogue | Known stable screen/business-action keys; reject unknown keys; menu parents are display groups, not grants |
| Permission checker/ASP.NET policy handler | One evaluation authority for HTTP policies and application operations; request-scoped reuse; no dependency recursion through protected generic CRUD services |
| Generic controller operation mapping | Explicit resource key plus operation descriptors: List/Detail/Deep/GetAll/Search View; Add Create; Update Update; Remove Delete; Activate separate state permission; select/unique routes explicitly mapped to minimum capabilities |
| Application service/use-case boundary | Authorize operations reachable outside HTTP and sensitive business commands, using the same evaluator; internal child repository writes do not each require a separate public CRUD permission |
| Resource-aware policy | After tenant-scoped load, check branch/ownership/assigned-workflow constraints when applicable. State locks remain additional domain invariants |
| Generic repository | Preserve tenant and soft-delete/data access; do not infer business permissions from entity table/CLR names or HTTP verbs, and do not inject UI action checks into Query/SaveChanges |
| Angular | Read proposed /me/access effective keys; shared permission guard/directive/service for route/menu/action UX. Server remains authoritative; 401 unauthenticated/403 forbidden retained |

Model permission metadata centrally for inherited base endpoints using MVC conventions/a policy filter or equivalent explicit operation descriptors. Standard Authorize policies can express custom endpoints; do not attempt to infer everything from GET/POST because Search may be POST and approval/export/import are distinct operations. Every new/custom/override endpoint must have permission metadata or a reviewed explicit classification; unclassified ERP endpoints fail closed in final rollout. Audit inherited deep/full/select/bulk routes, reports, uploads/downloads and indirect callers before activating enforcement.

Select/lookup access needs deliberate mapping: creating a request may need minimal Supplier/UOM lookup labels without granting supplier full-record View. CheckUnique should only expose the allowed minimal validation outcome to Create/Update users. Child rows are owned by the parent command, not a separately exposed child mutation. Same-list paginated export cannot be secured independently merely by hiding Export; a distinct protected export endpoint is needed if data-export permission is meant to govern that operation.

Branch/record scope is distinct from permission keys. A user may have PurchaseRequests.View but only for allowed branches; scope must be applied consistently to lists/counts/details/reports/export/lookups and writes, not just hidden rows in Angular. Current User.BranchAccess is evidence of an existing concept, not proof that every query enforces it. Keep tenant scope always; never make a generic Repository flag that silently disables it.

### Administration and lifecycle

- Roles page: module/feature/action matrix with only existing operations, Select All for known visible group entries, description and assigned user count; protected built-in roles if approved.
- Users page: Roles tab, Direct Exceptions tab (Inherit/Allow/Deny if chosen), Effective Access tab including origin; optional Data Scope tab governed separately. A user may use roles, direct grants, or both.
- Catalogue/manage-role/manage-user-permission endpoints are themselves restricted, tenant-scoped and audited. Reject cross-tenant IDs, arbitrary keys and role-name impersonation. Decide whether delegates may grant only their own delegable permissions; never allow an ordinary user to self-promote.
- Bootstrap first tenant administrator and protect last active administrator through an explicit owner policy/transaction boundary. No retroactive automatic grant to all users or default-role IsDefault field without a reviewed migration decision.
- Cache key includes tenant + actor and role/user versions. Assignment/role/status changes invalidate effective access across all application instances; if server-side cache may lag, record the permitted revocation delay explicitly. Sensitive checks fail closed on unresolved state/cache failure; no fallback to old JWT permission grants.
- Append audit events for grant/revoke/direct override/role membership and denied sensitive management actions, including actor/tenant/target/old-new/time; no passwords/tokens. Concurrency checks prevent lost assignment edits.

### Impact and classification

| Area | Decision | Impact / phase |
|---|---|---|
| Repository tenant/soft delete and existing business state locks | Keep | Phase1 identity contract then unchanged invariants |
| User identity/claim parsing | Refactor after producer mapping | Security issuer, repository actor/tenant consumers, audit/current-user |
| Existing Role/User relationship | Extend | EF constraints, tenant validation and typed assignment DTOs |
| Permission and RolePermission storage | Refactor | Stable catalogue/actual join; preserve historical data until mapped |
| Direct user overrides | Create | New owner/keys/indexes with explicit conflict policy |
| Policy evaluation/cache/audit | Create or extend proven owners | Phase1/4/5 cross-layer service wiring |
| Base endpoint integration | Extend | Phase2/3 mapping, no duplicated controller CRUD methods |
| Custom operations/lookups/files/reports | Extend | Explicit Phase4 metadata and resource/scope checks |
| Angular Role/User scaffold and shared access UX | Refactor/Create | Phase3/5 typed shared owners; UI26/7 documentation updated with implementation |
| UI26 transitional/no-fabrication rule | Keep until implementation | Design does not authorize changing live behavior or claiming secured UI |

Options: roles-only is too coarse for the user's direct-permission requirement; token permission claims are simple but stale until reissue and grow with the catalogue; server lookup with cache/version invalidation is the recommendation here. Direct Allow-only is simpler, while Allow/Deny supports subtracting a role grant with extra conflict-management UI; owner selects the semantics.

### Open decisions and implementation gates

1. Confirm account authority: exact console-login issuer and stable actor-to-local-user association, explicit tenant claim, tenant membership and active-account behavior. Technical source evidence required; do not ask owner to guess database IDs.
2. User override semantics: grants only, or direct Deny winning over role/Allow (recommended). Multiple roles recommendation is not frozen by the current request.
3. Who manages tenant permissions and delegation boundaries; platform/tenant admin separation, first-admin bootstrap and last-admin protection.
4. Permission catalogue/action granularity, minimal lookup rights, actual branch/own-record scopes, UI hidden versus disabled UX.
5. Existing-user rollout: preserve via explicit reviewed role mapping or deny-by-default enrollment; no silent mass grant or lockout. Inventory data/consumers before defining unique constraints/backfill.
6. Revocation SLA/cache deployment topology, session/token compatibility and concurrent edits.

Dependency order: prove identity and catalogue/semantics → freeze schema/API/admin rules → build evaluator/role-user assignment/cache/audit → wire base/custom/server boundaries in a complete pilot module → Angular effective access → enumerate/migrate remaining endpoints → activate fail-closed coverage and update UI26/backlog. Main API bare Authorize already uses DefaultPolicy, so FallbackPolicy alone will not enforce per-operation permissions.

Schema implementation would require owner-run migration after model design is frozen; none was created/run and no migration name is committed at this proposal stage. Verification must cover role-only/direct-only/combined/deny precedence, unknown/unclassified access, cross-tenant and record scope, disabled users, revocation across nodes, all inherited/custom/bulk/report/file routes, privilege escalation/last-admin/concurrency and Angular direct URL/API requests. Source checks alone cannot establish these security guarantees; tests/runtime remain pending under current project execution boundaries.

Official technical references consulted for the proposal: ASP.NET Core .NET10 policy-based authorization (https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-10.0) and MVC resource-based authorization (https://learn.microsoft.com/en-us/aspnet/core/mvc/security/authorization/resource-based?view=aspnetcore-10.0). They support policy/handler and resource checks, not the unapproved business decisions above.

### Owner clarification — external subscriber token and tenant users (2026-10-16)

Confirmed by owner: the subscriber obtains its token from an external API; business users belong to a tenant. This corrects the framing of the preceding identity finding. SiGma.Security's local AuthenticateController is not established as the issuer for the actual external console-login token; its claim meanings cannot prove a live mismatch with Repository.NameIdentifier. Do not alter repository claim parsing on that evidence alone. Verify the external issuer's documented tenant/subject claims and existing validation contract before making a migration.

Separate responsibilities: external subscriber authentication/entitlement establishes the tenant context; a uniquely authenticated tenant user is still needed for per-user permissions and audit. A tenant token shared among users, without a separately verified user/session identity, cannot distinguish their role/direct grants. A submitted local userId or Angular localStorage selection does not establish that identity.

Current missing fact: does each tenant user already authenticate with personal credentials/session, or do users share subscriber authentication? A single concise clarification was requested. Do not assume the answer or implement a new identity flow without it.

Recommended direction, conditional on that answer: retain the external subscriber integration and existing tenant-owned user records. Establish a server-verified tenant-user session by validating the external tenant context plus the individual local user's authentication/membership/active state, or map an existing externally verified individual subject if the issuer supports it. Issue/use an API-valid session/token with distinct stable tenant and user identities. Tenant context is derived from validated server-side identity, not an arbitrary tenantId submitted by the client; userId is derived from the authenticated local account. Read role/direct-permission assignments by the pair tenantId/userId. Keep subscriber/platform administration separate from tenant-user administration; no automatic subscriber-superuser bypass is approved.

External token validation, audience/issuer/signature/lifetime and entitlement/user-session refresh/revocation must have an explicit contract. The local user session must not silently turn an expired/suspended external entitlement into continuing access; exact expiry/revalidation policy remains a design decision. Local JWT issuance is a recommendation only, not a requirement to replace an existing suitable user session. No application code, token parsing, users, passwords, permissions, schema or migration changed for this clarification.

### Owner confirms current login — 2026-10-16

Owner answer: currently logs in only with the tenant account token, entering subscription number, email and password. There is no confirmed separate tenant-user login/session in this flow. Treat the current flow as subscriber authentication, not proof of an independently authenticated business user. Per-user grants/audits therefore need an added individually authenticated tenant-user context before enforcement.

Updated proposed sequence:

1. Keep the subscriber/external API integration and prove its validated subscription/account identity. Establish which verified subscriber principal may bootstrap the initial local tenant administrator; this is an explicit policy to freeze, not an automatic grant to every tenant-token holder.
2. Use the tenant user domain owner for employee accounts, with a secure credential/session owner and stable mapping. Freeze the User/ApplicationUser/identity storage decision from actual consumers; do not create another unrelated user table or copy subscriber credentials into User.Password.
3. Provide tenant-user login using subscription code plus that user's own email/password. It may reuse the screen's three fields, but the backend verifies the individual account and active membership within the resolved tenant. Do not require/distribute the subscriber's password to staff. The employee login does not assume the external API knows local employees.
4. Business API sessions identify both validated tenant and individual user. Keep external subscriber token/refresh lifecycle server-owned as required by the actual provider contract; it is not the individual employee identity and should not be shared as their business session.
5. Tenant roles, role grants and direct exceptions attach to that individual tenant account. Effective evaluation and actor audit use tenantId/userId; Repository continues enforcing tenant scope. Validate active subscription/entitlement through an explicit server-side lifecycle contract; do not trust a typed subscription code alone or retain an expired entitlement indefinitely.

No decision yet on whether the existing external subscriber account is exposed as a separate owner-login path, mapped to a local owner identity on successful login, or linked to an existing local identity provider. Choose the least disruptive supported option after tracing external API capabilities. The user request authorizes design discussion only; no bootstrap, credentials, token or permission behavior has been changed.

### Concrete tenant-user association — source confirmed, 2026-10-16

User inherits EntityBaseWithName, which inherits EntityBase.SubscriptionId (int); its tenant-scoping column already exists. Reuse this field as the user-to-tenant association, not a second TenantId field. This confirms scalar tenant ownership, not an existing EF foreign key to an external tenant database. Map a validated external tenant identity/code to the correct internal SubscriptionId; if external/internal identifiers differ, freeze an explicit server-owned mapping rather than assuming equality.

Proposed creation: an authorized administrator's validated tenant context supplies SubscriptionId server-side; never trust the create payload to move the user to another tenant. Proposed login: subscription code is a tenant selector resolved/validated by the server, then user email/username and secure credential verification are scoped to that SubscriptionId, with active-user/tenant membership checks. Code alone is not authentication. Use a tenant+normalized-login unique constraint according to the selected account policy; no schema/index implementation approved yet.

Roles/direct grants and all user-role assignments must be tenant-consistent; a supplied role ID from another tenant is rejected. Effective permissions use stable individual UserId plus validated SubscriptionId. When introducing a local user token/session, explicitly migrate the tenant-claim consumer contract: Repository currently reads NameIdentifier as tenant, so changing that claim to user ID without adjusting the repository would mis-scope data. Prefer distinct named user/tenant identities through a shared validated current-context owner; preserve compatibility only through a reviewed explicit contract, not fallback guesses. No source or migration changes were made for this design clarification.

### Design started and owner decisions clarified — 2026-10-16

The current detailed design is recorded in [Tenant identity and authorization design](../Authorization/TENANT_IDENTITY_AND_AUTHORIZATION_DESIGN.md). This is a PLAN-00 design deliverable, not source implementation. Its implementation handoff is Blocked on the precise external verification/binding and lifecycle contracts and the proposed security/session policies listed there; unavailable provider documentation is not replaced by trusting browser data.

Owner decisions now confirmed:

- A user can receive multiple roles **and** multiple direct permissions together. Earlier one-role/either-or readings are superseded. The owner did not approve the earlier direct-Deny proposal; the current scope proposes grants-only union, without adding Deny/override conflict behavior.
- Only the tenant administrator manages roles and permission assignments initially; delegation is excluded.
- After subscriber verification, create the first local administrator using the subscriber's login details. This authorizes secure initialization from verified credentials, not plaintext copying to User.Password, repeated password reset through bootstrap, or automatic later credential synchronization.
- The frontend may submit the subscriber's login data. The backend verifies it against a trusted source before using the subscription identity or creating the administrator. A frontend success flag, supplied subscription ID or unvalidated token is insufficient.
- Roles must expand/collapse to show their entities, with each entity exposing its own permission checkboxes. Opening is separate from granting; the proposed entity select-all has checked/unchecked/indeterminate states. The interactive design uses local example data only.

Source correction: actual Role/User routes are owned by `modules/Administration/Roles` and `modules/Administration/Users`, not the unrelated `pages/role` scaffold. The Role editor currently logs intended create/update payloads instead of saving; User sends `roleIds` while the current backend Add VM contains nested Roles. The new design records this integration gap explicitly. Tenant-claim migration also includes DbContext, FileStore and ErrorLogsMiddleware, plus stable actor/branch-preference handling, rather than Repository alone.

Existing source, DTOs, permissions, credentials, endpoints and database schema remain unchanged by this design task. The design does not mark the UI26 transitional backlog resolved or revive deferred PO creation/approval workflows.

## Topbar Profile and account lifecycle follow-up — owner deferral (2026-10-18)

Owner instruction during the Profile review: **"طبق المتاح واجلها مع نقطة الصلاحيات"**. Deliver the currently supported menu behavior now; keep the following screenshot workflows with this deferred identity/authorization work. This is explicit deferral, not implementation approval or an instruction to resume permissions now.

| Deferred behavior | Required contract when resumed |
|---|---|
| Linked accounts management and new-account linking | Verified target-account authentication, stable link owner, allowed same/cross-tenant association, duplicate/self-link handling and minimal typed list/add contracts |
| Switching a linked account | Server-issued valid session for the selected identity/tenant; discard previous actor/tenant caches and working context; preserve each account's own permissions; never a browser-supplied user/tenant ID or stored-password account switch |
| Unlinking | Confirm removal of the association only, with ownership/state/session rules; do not delete the underlying user or tenant |
| Change password | Authoritative secure credential owner, current-password validation, confirmed new-password policy and refresh/session revocation behavior |
| Login attempts | Authoritative producer capturing successful and failed authentication, current-actor visibility, IP/browser/time/status fields, paging and retention/privacy contract |
| Change profile picture | Stable signed-in actor-to-profile mapping plus supported image types/size, upload/cleanup and per-user ownership checks; screenshot shows JPG/JPEG/PNG maximum1MB, to be reconciled with the actual storage contract |
| My Settings | Name, Surname, Email Address and User Name; unique/validated updates through the authoritative owner and agreed identity synchronization/session behavior |

Carry forward the owner's2026-10-16 confirmed current subscriber-only login. Establish an individually authenticated tenant-user context and distinct stable tenant/user identities before presenting these as self-service employee operations. The existing administrative User editor is for an explicitly chosen local record; its image/name/password properties do not prove a current-user mapping. Do not select that record by assuming the external account ID or display name equals a local User ID/name. No new permissions, bootstrap bypass, credential policy, data rewrite or token-claim change is approved by this deferral.

Resume within the existing [tenant identity and authorization design](../Authorization/TENANT_IDENTITY_AND_AUTHORIZATION_DESIGN.md): verify the real external subscriber contract and stable individual actor; freeze API/storage/security/session decisions; then implement the screenshot account lifecycle together with effective permissions and audit. Linking an account must not merge company data or aggregate its permissions into another account. The action labels and screenshot inputs remain evidence; exact transitions and lifecycle policies must be frozen before implementation.

Delivered available behavior: fixed current Profile menu, shared read-only current sign-in details, translated labels/branch, removed static count/presence, disabled unavailable placeholders, existing help reader and logout. Source-only review; no runtime acceptance claimed. Records: [Profile review](<../Archive/Completed/2026-10-23/TOPBAR_PROFILE_FEATURE_REVIEW.md>), [menu freeze](<../Archive/Completed/2026-10-23/TOPBAR_PROFILE_MENU_CONTRACT_FREEZE.md>), [maintenance plan](../TOPBAR_PROFILE_MAINTENANCE_EVOLUTION_PLAN.md). The in-app Administration guide records this deferral in both languages. No backend/schema/migration/security enforcement changed for this entry.

## Working branch — owner decision 2026-10-18

During the topbar branch review, the owner initially selected server-enforced allowed-branch scope, then explicitly deferred it until comprehensive permissions are ready: «أجل نقطة الصلاحيات اما نظبطها وتكون شاملة للنقطة ديه طبق المتاح حاليا». Final clarification: current branch is a default in any eligible screen; View/Save/Update restrictions remain with permissions. Implementation is recorded in `../CURRENT_BRANCH_DEFAULTS_MAINTENANCE_EVOLUTION_PLAN.md` and its feature review, without activating authorization.

The comprehensive authorization work must therefore cover allowed branch selection plus lists/counts/details/reports/exports/lookups, Create/Update/Delete/domain actions, source/destination and cross-branch operations, permission administration and stable individually authenticated tenant-user identity together. A remembered preference, an Angular default, `User.BranchAccess`, or a hidden option is not enforcement. Existing tenant/soft-delete isolation remains required independently. Exact allowed-branch relation, identity binding and policy semantics remain deferred; do not silently promote default filtering into a security rule.
