# مراجعة ومعالجة الصلاحيات للبنود ٢٤١–٢٥٠ — ١٥ نوفمبر ٢٠٢٦

| الحقل | الحالة |
|---|---|
| Status | Implemented — local build and targeted tests passed |
| Owner verification pending | yes |
| النطاق | StaffRole، FiscalYear، MonthClose، asset، assetType، depreciation، depreciationSummary، depreciationDetail، depreciationReportFy، وحاوية Reports |
| المرجع | العقود المجمدة للبنود 241–249، ومطابقات هذه الشاشات، وجرد route والعمليات، وملفات Speed ذات الصلة |
| القبول التشغيلي | معلّق؛ لا تشغيل SQL/HTTP حي أو اختبار متصفح التطبيق أو تنفيذ هجرة |

## حدود المصدر والعقود

قُرئ مدخل `AGENTS.md` وقواعد العمل الحية ومهارة `sigma-screen-refactor`، وفهرس المراجعات والكتب ذات الصلة. نجح فحص الوصفات `Generate-SigmaRecipes.ps1 -Check` بنتيجة **8/8**. فُصلت مراجع Speed (دليل التحليل وشرح الشاشات وحزمة 28 أكتوبر) عن التنفيذ الفعلي؛ المرجع الوظيفي لا يثبت منح Sigma أو سياسة فروع الخادم. لا تتطلب مطابقة صلاحيات هذه المجموعة قواعد جديدة من Odoo ما دامت العقود المعتمدة تحسم العمليات الحالية. جميع الحالات التالية مصدرية؛ نجاح البناء أو الاختبارات يذكر لاحقًا بجانب أمره الفعلي.

| البند | المسار الفعلي | المدخل والعمليات المعتمدة | حدّ التنفيذ |
|---|---|---|---|
| ٢٤١ | `/StaffRole` | `StaffRole.View/Create/Update/Delete` | تعريف مشترك داخل الشركة، وعمليات القائمة والمحرر/الحذف مستقلة |
| ٢٤٢ | `/FiscalYear` | `FiscalYear.GetList/GetById/GetSelect/Add/Update`، والفحوص/الإقفال للمدير فقط | إقفال السنة وفحوصها لا تنفّذ من فرع ناقص؛ حالة السنة وفحص الشركة الكاملة ملزمان |
| ٢٤٣ | `/MonthClose` | `FiscalYear.GetList` و`MonthClose.GetByFiscalYear` للقراءة، و`Verify*`/`CloseMonth`/`ReopenMonth` للمدير فقط | القراءة العادية لا تنشئ الشهور؛ المدير يجهز الناقص وفق العقد |
| ٢٤٤ | `/asset` | `Asset.View/Create/Update/Delete`؛ `AssetType.Lookup` و`CostCenter.Lookup` للمحرر | فرع الأصل المحفوظ والجديد وحق التسجيل والمعاملة يفرضها الخادم |
| ٢٤٥ | `/assetType` | `AssetType.View/Create/Update/Delete`؛ `Account.GetPostingSelect` عند التحرير | حسابات الترحيل اختيار كتابة، والعرض يعتمد الأسماء المحفوظة |
| ٢٤٦ | `/depreciation` | `Depreciation.Prepare` للعرض، `Depreciation.Save` مع Prepare للحفظ | تسجيل الإهلاك يعيد فحص الفروع والبيانات داخل معاملة الحفظ |
| ٢٤٧ | `/depreciationSummary` | `DepreciationSummary.Get` و`Asset.Lookup` و`AssetType.Lookup` | تقرير مستقل بقراءة نتائج النطاق المسموح |
| ٢٤٨ | `/depreciationDetail` | `Asset.GetDepreciationDetailReport` و`Asset.Lookup` و`AssetType.Lookup` | مصدر تفاصيل مستقل؛ لا استنتاج `Asset.View` بديلًا للمنحة المحددة |
| ٢٤٩ | `/depreciationReportFy` | `DepreciationReportFy.Get` | مدخل تقرير مستقل |
| ٢٥٠ | `/Reports` | حاوية ذات **١٧ طفلًا**؛ لا منحة عامة | الخمسة المعتمدة تحتها لها سياسات مسار حرفية، و١٢ طفلًا تظل fail-closed للمستخدم العادي |

## طلبات HTTP وطبقة الرفض

تستمد واجهات التعريفات العامة طلباتها من `SiGmaControllerBase.cs:26-64` (`GET` و`POST` و`PUT` و`DELETE` و`GetById/{id}` بحسب الحالة)، ويحدد الكنترولر الخاص الاستثناءات أدناه. ينفذ `PermissionAuthorizationFilter.cs:91-142` رفض 403 عند غياب المنحة أو اعتماديتها، ويسجل `BranchAccessContext` نمط قراءة التقرير أو الكتابة قبل دخول الخدمة. رفض المرجع غير المسموح أو الفروع/الحالة بعد ذلك هو قرار **الخدمة**، وليس مجرد اختفاء زر من الواجهة.

| البند | المسار/الطريقة الفعلية من الواجهة | نقطة السلطة/رفض النطاق |
|---|---|---|
| ٢٤١ | `GET /StaffRole` و`GET /StaffRole/GetById/{id}` و`POST/PUT/DELETE /StaffRole` | `StaffRoleController.cs:6-11` يرث الأفعال؛ فلتر HTTP يفحص View/Create/Update/Delete، والخدمة تحمي تفرد الاسم وعلاقة السجل بالشركة. لا فرع حيازة مستقل لدور الموظف. |
| ٢٤٢ | `GET /FiscalYear` و`GetById/{id}` و`GetSelect` و`POST/PUT /FiscalYear`؛ `POST /FiscalYear/VerfiyValidFiscalYear` و`VerfiyVoucherApprovals` و`VerfiyDataInconsistency` و`CloseFiscalYear` | `FiscalYearController.cs:15-67` يحرس إجراءات التحقق والإقفال بـ`TenantAdminOnly` قبل الخدمة؛ الخدمة تعيد فحص الأقدمية والقيود وفروع الشركة داخل الكتابة. |
| ٢٤٣ | `GET /FiscalYear` ثم `GET /MonthClose/GetByFiscalYear/{fiscalYearId}`؛ فحوص `GET /MonthClose/VerifyValidMonth/{id}` و`VerifyVoucherApprovals/{id}` و`VerifyDataInconsistency/{id}`؛ `POST /MonthClose/CloseMonth/{id}` و`ReopenMonth/{id}` | `MonthCloseController.cs:19-66` يقيّد التعديل والفحص والإقفال وإعادة الفتح بـ`TenantAdminOnly`؛ تفحص الخدمة حالة الشهر والشركة الكاملة. |
| ٢٤٤ | `GET /Asset` و`GetById/{id}` و`POST/PUT/DELETE /Asset` | `AssetController.cs:9-21` مع base CRUD؛ منحة HTTP مستقلة لكل فعل، والخدمة تعيد تقييم فرع الأصل المحفوظ والجديد ونشاط الفرع/حق التسجيل وسجل الإهلاك. |
| ٢٤٥ | `GET/POST/PUT/DELETE /AssetType` مع `GET /Account/GetPostingSelect` لمحرر الحسابات | `AssetTypeController.cs:7-11` مع base؛ منحة Account مستقلة عن View وتتحقق الخدمة من صلاحية حسابات الترحيل عند الحفظ. |
| ٢٤٦ | `GET /Depreciation/prepare` ثم `POST /Depreciation/save` | `DepreciationController.cs:11-27` يفصل Prepare عن Save؛ تتحقق الخدمة من توكن التجهيز وبيانات الإهلاك وحق التسجيل في فروع الأصول وقت الحفظ. |
| ٢٤٧ | `GET /DepreciationSummary` مع `Asset.Lookup` و`AssetType.Lookup` | `DepreciationSummaryController.cs:12-19` يصرّح `PermissionCatalogAction("Get")`؛ التقرير والفلاتر تتقيد بفروع `QueryReport` ولا يُستنتج كشف أصل محجوب من اختيار مرشح. |
| ٢٤٨ | `GET /Asset/detail-report` مع `Asset.Lookup` و`AssetType.Lookup` | `AssetController.cs:55-61` يمر إلى `GenerateDepreciationDetailReport` بمفتاح العملية المستقل؛ ترشيح الفروع وتفاصيل السجل تحت خدمة التقرير. |
| ٢٤٩ | `GET /DepreciationReportFy` | `DepreciationReportFyController.cs:19-29` ثم خدمة التقرير؛ نتيجة القراءة مقيدة بالاشتراك/الفروع وليست طريقًا لتجاوز تفاصيل المستند الأصلي. |

ليس في تعريف دور الموظف أو أنواع الأصول عدّ كميات مخزون. شرط **الحركات المؤثرة على مستوى الشركة وتحت قفل الكتابة** ينطبق على قيود إقفال السنة/الشهر وتجهيز/حفظ الإهلاك حيث تعاد قراءة الحالة المالية والسجلات المؤثرة؛ لا يُعاد اشتقاق رصيد من صفوف فرع المستخدم وحدها. مصدر القيود المحاسبية يظل مستقلًا عن مجرد عرض تقرير أو نوع أصل. التحقق من أقفال SQL وتزامن مستخدمين حقيقيين ما زال ضمن قبول التشغيل المعلّق.

## حاوية التقارير ٢٥٠ — مطابقة مستقلة للمسار والفعل والرفض

`SiGmaAngularFrontEnd/src/app/pages/routing.ts:1667-1672` يحمّل `Reports_Routes`، وتعرّف `modules/Reports/reports.routes.ts:20-43` الأطفال السبعة عشر. يستهلك الحارس `current-access.guard.ts:7-28` سياسة `route-access-policy.ts:523-569,610-616`. تُرفض الحاوية وسائر الأطفال غير المعتمدين محليًا عند `policyFor` الفارغ، ثم يستمر الخادم في فرض صلاحية HTTP لكل مستهلك معتمد. مراجع عمليات التقارير في `ReviewedPermissionOperations.cs:592-598` و`VehicleReportsController.cs:26-125` و`PermissionPrerequisites.cs:717-726`. تصنيف `BranchOperationRules.cs:25-31` يعامل قراءات النتائج على أنها **ReportEffects**؛ عمليات التقرير لا تمنح حق عرض تفاصيل المستندات الأصلية تلقائيًا.

| الطفل المسموح بمساره الحرفي | شرط فتح التقرير | عمليات التصدير/التفاصيل المنفصلة | دليل المطابقة السابق |
|---|---|---|---|
| `/Reports/TrialBalance` | `AccountReports.GetTrialBalance` | `Branch.Lookup` و`CostCenterGroup.Lookup` اختياريتان حسب استخدام المرشح | `LEDGER_TRIAL_BALANCE_ACCESS_ADOPTION_FINAL_RECONCILIATION.md` |
| `/Reports/VehicleProfitAndLoss` | `VehicleReports.VehicleProfitAndLoss` + `VehicleReports.VehicleProfitAndLossOptions` | `VehicleProfitAndLossExport` و`VehicleProfitAndLossDetail` و`VehicleProfitAndLossWithSellingDetail` مع اعتماد المصدر | `reviews/VEHICLE_PROFIT_LOSS_FEATURE_REVIEW.md` |
| `/Reports/VehiclePriceBasedOnTariffGroup` | `VehicleReports.VehiclePriceBasedOnTariffGroup` + `VehicleReports.VehiclePriceBasedOnTariffGroupOptions` | `VehiclePriceBasedOnTariffGroupExport` مع اعتماد المصدر | `reviews/VEHICLE_PRICE_BASED_ON_TARIFF_GROUP_FEATURE_REVIEW.md` |
| `/Reports/VehiclesRevenue` | `VehicleReports.VehiclesRevenue` + `VehicleReports.VehiclesRevenueOptions` | `VehiclesRevenueExport` مع اعتماد المصدر | `reviews/VEHICLES_REVENUE_FEATURE_REVIEW.md` |
| `/Reports/VehicleRentalDetails` | `VehicleReports.CreateVehicleRentalDetailsReport` | `VehicleRentalDetailsExport` و`VehicleRentalDetailsEmail` مع اعتماد المصدر | `reviews/VEHICLE_RENTAL_DETAILS_FEATURE_REVIEW.md` |

**تصحيح الجرد:** كان `ROUTE_PERMISSION_ADOPTION_INVENTORY.json` يوثّق طفل TrialBalance وحده، رغم وجود أربع سياسات دقيقة إضافية في `route-access-policy.ts:433-437`، مع تأكيد HTTP واعتماديات خيارات التقرير والتصدير. وُثقت الخمسة في `childAdoptions` وعدّهم، وأبقيت **Reports = unknown** والعداد العام **190/263** بلا تغيير لأن الأطفال لا يحوّلون الحاوية إلى مورد مصرح. لا تُفتح بقية التقارير من منح الأطفال الخمسة. جرى تحديث شرح حاوية دليل التقارير ثنائي اللغة دون إضافة رابط شامل مضلل.

## الملاحظات والمعالجة

| الشدة | البند ومسار المصدر | سبب العائق المثبت | العلاج وحالة المصدر |
|---|---|---|---|
| **HIGH — عولج** | ٢٤١ `HRM/Administration/Staff Roles/StaffRole/components/list/list.component.html:2-80` | وجود محرر `StaffRole` داخل شرط ظهور القائمة كان يدمره مع مسودته عند سحب `StaffRole.View` | أُبقي محرر الدور خارج القائمة وأصبحت القائمة `hidden/inert` عند عدم العرض، من دون حذف المكون أو المسودة المفتوحة. |
| **MED — عولج** | ٢٤١ `StaffRole/components/list/list.component.ts:210-230` و`StaffRole/components/details/details.component.ts:155-179` | تأكيد حذف بدأ قبل اشتراك إبطال المنحة، وتأكيد تجاهل مسودة قديمة يستطيع إكمال القرار بعد revoke/regrant | أصبحت التأكيدات مؤجلة إلى الاشتراك وتلغى عند فقد المنحة أو تغير عمر القرار، مع إبقاء مسار تجاهل المسودة محليًا بعد تأكيد جديد حتى لو سُحب العرض. |
| **HIGH — عولج** | ٢٤٤ `Assets/asset/components/list/list.component.ts:303-356` و`asset/components/details/details.component.ts:257-410` و`asset/services/asset.service.ts:48-61` | كان رد Save/Delete المرسل يستطيع نشر الصفوف أو رسالة نجاح بعد سحب `Asset.Create/Update/Delete` أو تغيير سياق المستخدم، مع سباق حوار تأكيد الحذف | أُضيف مالك إرسال بمعرّف السياق و`CAN_PRESENT_API_OUTCOME` مع منع النشر بعد revoke، مع استمرار تسوية كتابة HTTP المرسلة ومنع إعادة إرسال حفظ سبق نجاحه؛ تأكيد الحذف والإتلاف يلغى عند تغير المنحة. |
| **HIGH — عولج** | ٢٤٦ `Assets/depreciation/components/list/list.component.ts:137-202` و`depreciation/services/depreciation.service.ts:23-28` | إرسال Save ثم سحب Prepare/Save كان قد يعيد نشر تقرير الإهلاك المحفوظ إلى جلسة لم تعد مخولة | فُصل عمر POST المرسل عن صلاحية نشر الرد، واستخدم `Assets/access-write-owner.ts:9-21` مع منع إعادة العرض والطباعة بعد فقد المنحة. |
| **MED — عولج** | ٢٤٥ `Assets/assetType/components/details/details.component.ts:201`، و٢٤٧–٢٤٩ `depreciationSummary/components/list/list.component.ts:156,199,244` و`depreciationDetail/components/list/list.component.ts:173,213,261` و`depreciationReportFy/components/list/list.component.ts:136,189` | تأكيد تجاهل المسودة أو طباعة التقرير/قراءة المرشحات قد يستمر بعد تغيير revision أو عند انتهاء حق التقرير | ألغي التأكيد المعلّق، وربط `canPrint` بإصدار الوصول والصفوف والمرشحات، وألغيت القراءة القديمة عند تغيّر السياق. |

أثبتت إعادة المراجعة أن عمليات الشهور العامة الموروثة تحتاج إغلاقًا مستقلًا عن حراسة الإقفال. أما مرشح فروع استعلامات الأصول فيظل تحت مالكه الحالي. تنفيذ إقفال السنة والشهر وفحوصهما يظل لمدير الشركة وفق عقديهما المعتمدين.

| البند | ما اكتمل في إعادة المراجعة |
|---|---|
| ٢٤١ | رُبطت القائمة والمحرر وتأكيداتهما بجلسة الدخول، حتى عند بدء جلسة جديدة لنفس الحساب. فُرض اعتماد العرض مع الإنشاء والتعديل والحذف، ووُضح في الدليل الفرق بين الدور الوظيفي ومنح الدخول. |
| ٢٤٢ | تستمر طلبات حفظ السنة وإقفالها المرسلة بعد إزالة المكوّن مع حجب نتيجتها عن السياق المنتهي. نُشرت وفُرضت اعتماديات القائمة والتفاصيل التي يحتاجها محرر السنة. |
| ٢٤٣ | أُخرجت مسارات الشهور العامة، ومنها الإضافة والحذف والتفعيل، من الكتالوج القابل للإسناد ويرفضها الخادم برمز 405. يظل المستخدم المصرح يقرأ الشهور المخزنة، ويجهّز المدير الشهور الناقصة بالمسار المخصص. |
| ٢٤٤ | لا يظهر التعديل والحذف إلا مع حق التسجيل على فرع الأصل المحفوظ. يراجع الحفظ أيضًا الفرع المختار وحق التحويل من المصدر عند تغييره. يشترط الخادم منح محرر الأصل ومنحة محدد النوع عند استعمال مرشح نوع الأصل. يحجب المحرر المسودة عن الجلسة المنتهية ويعيد تحميل المطلوب عند استعادة المنحة في الجلسة نفسها. يرجع مستخدم الإنشاء المستقل إلى مسار مسموح. |
| ٢٤٥ | تشترك أنواع الأصول وأدوار الموظفين في حراسة جلسة محررات التعريف. يشترط الخادم العرض واختيار حساب الترحيل للإنشاء والتعديل، والعرض للحذف. |
| ٢٤٦ | يتحقق تأكيد الترحيل من المعاينة والمرشح والجلسة قبل إرسال الحفظ، ويشترط الخادم منحة التجهيز مع الحفظ. يستكمل الطلب المرسل وتُحجب مخرجاته بعد انتهاء صلاحية النشر. |
| ٢٤٧–٢٤٩ | تتبع نتائج العرض والطباعة والتصدير الجلسة ونطاق الفروع وإصدار الصلاحيات ونتيجة البحث. صار الخادم يفرض اعتماد محددَي الأصل ونوعه للتفاصيل والملخص. يحتفظ التقرير السنوي بمنحة قراءة مستقلة. |
| ٢٥٠ | طابق الدليل والجرد مسارات التقارير الخمسة المعتمدة. تظل بقية المسارات الاثني عشر غير متاحة للمستخدم العادي حتى تُراجع بصورة مستقلة. |

## التحميل والمراجع

يحمّل محرر الأصل محددات النوع ومركز التكلفة وخيارات الفرع بالتوازي. تظهر اختيارات حسابات الترحيل في محرر نوع الأصل، وقراءات الفحص داخل حوار إقفال الفترة. يحمّل الملخص والتفاصيل محددي الأصل والنوع بالتوازي ثم يقرآن التقرير مباشرة. يظل مؤشر الخيارات المحلي في التقريرين نقطة مطابقة للتحميل. لم تُغيّر سياسة كاش المراجع أو حساب الإهلاك. فهرس الأصل الحالي يغطي الاشتراك والفرع، وفهرس حركة الإهلاك يغطي الاشتراك والأصل والفترة. تظل قياسات التوقيت وخطط SQL معلّقة.

تؤكد مراجع Speed بتاريخ ٢٨ أكتوبر موضع الشاشات والفحوص والمخرجات. أدوار الموظفين والسنة وإقفال الشهور موثقة في R0138 وR0498 وR0495، والأصول ونوعها والإهلاك وتقاريره في R0467 وR0470–R0474. مادة S217 في دليل اليوم السابق تخص رقم الإهلاك في التأجير طويل الأجل. تستند سياسة التسجيل والإقفال والفروع إلى عقود Sigma.

## التحقق وحدوده

حالات المراجعة الموجهة: منحة طفل تقرير وحيد مع غياب الأصل؛ فقد منحة options مع بقاء منح التقرير والتصدير؛ فتح رابط طفل غير معتمد مباشرة؛ تغيير فلتر اختياري قبل إخراج التقرير؛ سحب View وسحب Action مستقلين أثناء حوار؛ سحب المنحة أثناء كتابة أُرسلت؛ مدير شركة مقابل مستخدم محدود الفروع عند إقفال السنة أو الشهر؛ أصل محفوظ يُنقل إلى فرع جديد أو فرع غير نشط؛ ورفض المستند عبر طبقة المنح مقابل رفض الحالة/الفرع عبر طبقة الخدمة. الاختبار يجب أن يصل إلى الحارس المراد ولا يتوقف قبل ذلك على فشل تحميل/مفتاح مفقود أقدم.

تظل تجارب SQL ذات الفروع المتعددة، تنفيذ HTTP الحقيقي على tenant حي، مشاهدات فتح/إغلاق النوافذ والطباعة/Excel في المتصفح، ومقاييس الأداء/الاستعلامات معلّقة. لم تتطلب هذه المصالحة هجرة قاعدة بيانات.

**نتائج التحقق المحلي النهائية**

- نجح بناء مشروع اختبارات الخادم مع المشاريع التابعة، ونجحت **٤١ من ٤١** حالة موجهة في الإقفال والأصول وملخص الإهلاك واعتماديات الكتالوج.
- نجح فحص Angular لقوالب التطبيق والأنواع باستخدام `ngc -p tsconfig.app.json --noEmit`.
- نجحت **٨١ من ٨١** حالة في Karma/Chrome Headless. شملت أدوار الموظفين والسنة وإقفال الشهر والأصول والإهلاك وفصل مسارات التقارير. عولجت تهيئة محمل حوار السنة وعزل اختبار قائمة الأصول قبل الإعادة.
- نجح فحص فروق الكود في النطاق. استُخدمت مراجعتان متوازيتان بأدوار مستقلة، ثم دُمجت إصلاحات المكونات مع حراسة الخادم والسياسات المشتركة.
