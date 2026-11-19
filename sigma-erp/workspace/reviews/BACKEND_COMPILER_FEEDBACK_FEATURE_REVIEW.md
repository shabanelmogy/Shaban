| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-05 |
| Scope | Reported Ledger/Leave/Approvals compiler diagnostics only |

متابعة محدودة بتاريخ ٦ نوفمبر ٢٠٢٦: أُضيف خطأ بصمة معاينة تقييم العملات
والواجهة التابعة له إلى نطاق هذا السجل؛ لا مراجعة جديدة لدورة العملات كاملة.

# معالجة أخطاء الترجمة المرسلة

متابعة CS9135 في DependencyResolver: استُخدمت Uri.UriSchemeHttp وUri.UriSchemeHttps داخل constant pattern، لكنهما ليسا ثوابت C# من نوعconst. استُبدل الشرط بمقارنتين عاديتين باستخدام != و&& مع بقاء التحقق من عنوانHTTP/HTTPS كما هو. أصلح ذلك المالك نفسه فيسطرشرطالعنوان؛ فُحصالفرقوالنمطالمماثلمصدرّيًا، ولمينفذبناء.

## السبب والإصلاح

تأكد خطأCS0103 في `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/LeaveService.cs:335`: استُخدم dateTo فيDashboardAsync دون تعريف داخل نطاقها. وجود متغير بنفس الاسم فيApplyListFilters لا يتيحه للدالة الأخرى.

أُصلح السطر بقراءة `FilterHelper.GetDate(filters, "dateTo")` وتحويله إلىDateOnly، مع الرجوع ليوم اليوم عند غياب التاريخ. هذا يحافظ على عقد `HRM_BUSINESS_CYCLE_CONTRACT.md`: الرصيد اليدوي حتى تاريخ نهاية الفلتر، وعلى طلبواجهة لوحةالإجازات التي ترسلdateFrom/dateTo. لا تعديل حقول أو نموذج أو صلاحية أو سياسة رصيد، ولا تغيير معادلة أو استعلام آخر.

## بقية الأخطاء وسلسلة الاعتماد

| الخطأ المرسل | الدليل الحالي |
|---|---|
| النوعLedgerCurrencySectionVm غير موجود | المصدر موجود في ViewModels/AccountReports بنفس namespace الخاص بـLedgerVm؛ لا استبعادCompile بالمشروع؛ القارئ الحالي ومرجع Helpers صحيحان |
| النوعLeaveDashboardBalanceVM وعضوBalances غير موجودين | كلاهما موجود بمصادرViewModels/Leave، وusing المالك موجود بـLeaveService؛ لا داعي لتكرار النوع أو حذف العقد |
| namespaceApprovals وIDocumentApprovalService/Source غير موجودة | الواجهتان موجودتان تحتSiGma.Business.IServices.Approvals، وServerAPI يحملusing مطابقًا وProjectReference إلىBusiness، وهو يعتمد علىViewModels |

قُرئت بيانات PE metadata فقط دون تحميل التطبيق أو تشغيله: مرجع ViewModels الحالي يحوي LedgerCurrencySectionVm وLeaveDashboardBalanceVM وعضو Balances، بينما النسخة المنسوخة داخل bin الخاص بـServerAPI قديمة ولا تحوي تلك الإضافات. مرجع Business الحالي لا يحوي واجهتي الموافقات، ومصادرهما أحدث منه. يتفق ذلك مع اعتماد المستهلكين على نواتج قديمة بعد توقف ترجمة المنتج؛ ولا يثبت نجاح بناء جديد أو انعدام أخطاء أخرى غير مرسلة.

لم يُعدل csproj أو تُنسخ DTOs إلى ServerAPI. يتطلب تحديث نواتج الاعتماد بناء المنتجين ثم المستهلك عند المالك: ViewModels ثم Business ثم ServerAPI، أو Rebuild لفلتر SiGma.ServerAPI.slnf. لم تُحذف ملفات أو ذاكرة IDE المؤقتة. إذا استمرت الأخطاء بعد إعادة البناء، تُراجع أول رسالة بناء فعلية مع حالة المصدر الحالية.

## الحدود والتحقق

الملف التطبيقي المعدل لهذا الإصلاح هو LeaveService.cs فقط، مع حفظ كتلة دفتر الرصيد والتعديلات الجارية. نُفذت قراءة المصدر ومطابقة namespaces وProjectReferences وتحليل XML ومقارنة تواريخ وبيانات النواتج القديمة، ونجح git diff --check للنطاق. هذه ليست مراجعة شاملة للموافقات أو العملات أو حسابات الإجازة.

المراجع قواعد Sigma وMaster5/7 وBE3 وFilterHelper والعقد الحالي لدفتر الإجازات، مع مهارتي systematic-debugging وreceiving-code-review لتثبيت السبب قبل الإصلاح. دليل Speed وأكواده وOdoo غير منطبقة على تصحيح متغير محلي ومراجع أنواع دون تغيير عقد شاشة. لا حاجة لوكلاء لهذا الإصلاح الصغير المترابط، ولا schema أو migration أو AutoMapper أو UI أو دليل شاشة جديد.

التحقق المتبقي عند المالك بناء حديث وقبول لوحة الإجازات مع dateTo وبدونه. لم تنفذ أوامر build/tests/lint/database/browser/migrations/commits/push/deploy أو Graphify/Sigma MCP. رسالة commit مقترحة فقط: `fix(hrm): resolve leave dashboard balance cutoff from request filters`.

## متابعة أخطاء تقييم العملات — ٦ نوفمبر ٢٠٢٦

أُرسل CS0833 في `CurrencyRevaluationService.Preview.cs:195` وCS0246 في
`CurrencyRevaluationController.cs:10`. ثبت من المصدر أن عنصر بصمة المعاينة
المجهول يتضمن `source.Id` ثم `usage.Id` دون أسماء صريحة؛ يستنتج C# اسم
الخاصية `Id` لكليهما. أُصلحت الثانية إلى `UsageId = usage.Id` فقط، مع بقاء
معرف المصدر ومعرف لقطة السعر وقيم البصمة وحساب التقييم كما هي.

قُرئت `Business/IServices/ICurrencyRevaluationService.cs`: التعريف موجود
بالـnamespace `SiGma.Business.IServices` المطابق لاستيراد controller، وSDK
مشروع Business يدرجه دون استبعاد. مشروع ServerAPI يحمل ProjectReference
إلى Business. لذلك لا دليل على ضرورة تغيير الاستيراد أو نسخ الواجهة؛ فشل
Business المؤكد قد يمنع تحديث metadata التي يستهلكها ServerAPI. لا يثبت
الفحص المصدري أن CS0246 زال؛ يتأكد ذلك بإعادة البناء بعد تصحيح أول خطأ.

الإصلاح Tier S وفق Master5/7 وBE6 وعقد التقييم المجمع القائم، بمهارة
systematic-debugging. مراجع Speed ودليلها وكودها وOdoo غير منطبقة على
تسمية خاصية محلية ومراجع نوع، دون تغيير مالي أو عقد شاشة. لا مخطط أو هجرة
أو AutoMapper أو UI أو دليل مستخدم جديد، ولا حاجة لوكيل لهذا التعديل الواحد.
لم يُستخدم packet مولد في الإصلاح، ولم يُشغّل build أو tests أو lint أو DB
أو browser أو migration أو commit/push/deploy.

تسمية UsageId تغير تمثيل JSON الداخلي الذي تُحسب منه PreviewToken؛ يلزم
إعادة المعاينة بعد تحديث الخادم قبل حفظ جلسة جديدة، بدل استخدام token من
نسخة أقدم. ليست هناك إعادة كتابة لجلسات محفوظة. رسالة commit مقترحة فقط:
`fix: disambiguate currency revaluation fingerprint identifiers`.
