# مطابقة الصلاحيات — مرتجعات الأصناف ورابط البنود وتحويل المخزون (١٦٣–١٦٥)

| البيان | الحالة |
|---|---|
| التاريخ | ١٣ نوفمبر ٢٠٢٦ |
| النطاق | `/ItemReturn`، `/ItemReturnItem`، `/StockTransfer` |
| العقد المعتمد | [تجميد البنود ١٦٣–١٦٥](ITEM_RETURN_STOCK_TRANSFER_ACCESS_CONTRACT_FREEZE.md)، [رصيد الفروع](../STOCK_BRANCH_BALANCE_CONTRACT_FREEZE.md)، [دورة النوافذ](../STOCK_FRONTEND_LIFECYCLE_CONTRACT_FREEZE.md) |
| التحقق | تنفيذ المصدر ومراجعة مستقلة؛ بناء .NET وAngular ناجحان بعد التعديلات، والاختبارات المحددة `54/54` خضراء |
| قبول المالك/SQL والمتصفح | معلّق |

أعيدت مراجعة المصدر بعد سجل التنفيذ الأول وعولجت ملاحظات أهلية المسودات،
وقراءة المراجع، وتغيّر الصلاحيات أثناء الاعتماد والطباعة، ونشاط فروع
المستند. نتيجة الاختبارات في هذا الملف تخص التحقق السابق.
راجع [سجل الإصلاح والبناء الأحدث](AUTHORIZATION_163_165_REVIEW_REMEDIATION_20261113.md).

## مصدر السلوك

راجع دليل Speed في دورة ٢٨ أكتوبر ٢٠٢٦، فصل `15-stock/screens/06-item-returns.md` وفصل `07-stock-transfer.md`، وملفات المتحكمات المؤرخة `C1681/C1682/C1711/C1712`. عقد المخزون في Sigma يحدد أثر الاعتماد والإبطال، ويحتفظ بالمستندات المسودة دون أي حركة حتى الاعتماد. أولوية قيد العمليات والفرع والكمية للخادم، بينما تُستعمل Speed مرجعًا وظيفيًا للشاشة.

## مسارات العمليات وطبقات الرفض

| الشاشة والفعل | الطلب الحقيقي | مفتاح الواجهة والخادم | موضع الحماية |
|---|---|---|---|
| مرتجعات: القائمة والتفاصيل والتقرير/Excel | `GET /ItemReturn`، `GET /ItemReturn/GetById/{id}`، `GET /ItemReturn/GetByWithNavigationsId/{id}` | `ItemReturn.View` + `Job.Lookup` فقط عند فلتر/فرز/grid خاص بالشغل | `PermissionAuthorizationFilter`، `ItemReturnService`، مرشح الفرع `BranchScopeRegistry` |
| مرتجعات: إضافة / تعديل / حذف | `POST /ItemReturn`، `PUT /ItemReturn`، `DELETE /ItemReturn?id=...` | `Create` + `Job.Lookup/Branch.Lookup/Item.Lookup`، `Update+View` + الثلاث، `Delete+View` | حارس المنح، الخادم، صلاحية فرع المستند المحفوظ والجديد |
| مرتجعات: حالة / قرار / إبطال | `GET /ItemReturn/{id}/approval`، `POST /ItemReturn/{id}/approval`، `POST /ItemReturn/{id}/void` | `View`، `ManageApproval+View`، `Void+View` | رفض `403` عند نقص المنحة، `404` عند مصدر مخفي، `409` لتعارض الحالة/الرصيد |
| تحويل: قائمة وتفاصيل | `GET /StockTransfer`، `GET /StockTransfer/GetById/{id}`، `GET /StockTransfer/GetByWithNavigationsId/{id}` | `StockTransfer.View` وكل فروع المصدر والوجهة | مرشح ملكية المستند الكامل |
| تحويل: إضافة / تعديل / حذف | `POST /StockTransfer`، `PUT /StockTransfer`، `DELETE /StockTransfer?id=...` | `Create` + `Branch.Lookup/Item.Lookup`؛ `Update+View` + المرجعين؛ `Delete+View` | صحة الفرع القديم والجديد والنشاط، مصدر كل سطر |
| تحويل: حالة / قرار / إبطال | `GET /StockTransfer/{id}/approval`، `POST /StockTransfer/{id}/approval`، `POST /StockTransfer/{id}/void` | `View`، `ManageApproval+View`، `Void+View` | قفل `ItemRequisition`، حساب الرصيد متعدد الفروع |
| الرابط القديم للبنود | `/ItemReturnItem/**` في Angular؛ `/ItemReturnItem` HTTP | تحويل إلى قائمة `ItemReturn`، بلا منحة مستقلة | حارس وجهة `View`، و`403` للمستخدم العادي عند طلب API، و`405` من خدمة البنود للمدير |

منافذ التوافق الموروثة للوالدين (`handleActivate`، `CheckUnique`، `GetSelect`، `GetAllWithNavigations`) لا تظهر كمنح قابلة للإسناد، وتُغلق نتيجة الخدمة `405`. سطور المرتجع لا تُدار إلا عبر محرر المستند؛ ترفض خدمة `ItemReturnItem` القراءات والكتابات المباشرة كلها بنتيجة `405`.

## فروع وأرصدة وحالات النقل

يحمي `StockBranchBalanceReader` أرصدة الفرع في السياق المحاسبي من بتر الحركات: `QueryReport<T>().IgnoreQueryFilters()` يتضمن شرط الشركة والصف الساري، ويجمع الافتتاحيات والاستلامات ومرتجعات المورد والصرف والمرتجعات والتحويلات الواردة والصادرة. يستهلكه اعتماد التحويل وإبطاله، واعتماد المرتجع وإبطاله في معاملات القفل المتسلسلة `ExecuteUniqueWriteAsync<ItemRequisition>`. تمنع قاعدة `BranchScopeRegistry` قراءة المستند إذا كان أحد طرفي التحويل خارج نطاق المستخدم، مع إبقاء أثره في تقارير الفرع المسموح دون تفاصيل المستند.

يقارن تحقق EF فروع التحويل المحفوظة والجديدة، ويطلب تحقق نشاط كل فرع بما في ذلك مدير الشركة، ولا يقبل طرفًا مفقودًا أو أن يتطابق المصدر والوجهة. يُراجع تباعًا أن الاستثناء للمراجع غير النشطة في المسودة مرتبط بمعرف السطر المحفوظ وبقاء الصنف نفسه، وأن الرفض لا يكشف اسم مستند آخر.

## قائمة التقرير والطباعة والنوافذ

تستخدم مرتجعات الأصناف نطاق `View` للقائمة والتقرير وExcel، مع `Job.Lookup` المشروط. الفلاتر والفرز والشبكة محصورة بقائمة حقول واضحة في الخادم قبل `Count`، وتستعمل الواجهة استعلامًا مطبقًا مع إصدار الصفوف للطباعة. سحب `View` لا يمكّن مرجعًا محظورًا من قراءة صفوف جديدة، وسحب صلاحية الفعل يعطل إرسال أمر جديد مع السماح بتأكيد محلي لتجاهل المسودة وتسوية طلب HTTP سبق إرساله. تحويل المخزون لا يملك تقرير/Excel مستقلين في شاشة المستند؛ تقارير أثر المخزون منفصلة تحت `StockReports`.

حدد التدقيق المستقل تسريبًا في عنواني حوارَي تحويل المخزون، وأُغلق في المصدر: `StockTransfer/components/details/details.component.html:2` لا يعرض `No/ID` إلا مع `canViewDocument()` وسياق/وصول صالحين، و`StockTransfer/components/list/list.component.html:53` يحجب `record.no/id` فور فقد `canView()`. لم يُمحَ `details` أو `approvalRecord` عند سحب المنحة؛ تظل المسودة وتسوية الطلب المرسل وعودة القراءة ضمن عمر مكوناتها، ويحجب النص المنشور فقط. هذا **إغلاق مصدري** ولا يغني عن تجربة revoke/regrant الحية.

## ترتيب الملاحظات المصدرية المكتشفة

| الخطورة | الملاحظة قبل الإصلاح | دليل المصدر |
|---|---|---|
| P1 | وسم إبطال المرتجع والتحويل بـ`Update` أتاح قرارًا دون `Void` المستقلة | `SiGma.ServerAPI/Controller/ItemReturnController.cs:25–29` و`StockTransferController.cs:25–29` |
| P1 | إتاحة مفاتيح بحث عامة عاكسة إلى مسارات علاقات أمر الشغل سمحت بفحص عضوية وعدد السجلات دون منحة المرجع الشرطية | `SiGma.Business/Services/Bases/Service.cs:521–568` و`ItemReturnService.cs:13–20` قبل التصحيح |
| P1 | حساب المبلغ الممكن إرجاعه باستخدام مرشح عرض المستندات فقط، بما قد يحجب حركات داخل الشركة عن حساب الرصيد | `ItemReturnService.cs` في `ReturnCapacityErrorAsync` و`EffectiveIssuedLines` |
| P1 | اعتماد مسؤول الشركة للتحويل مع فرع غير نشط أو مصدر يطابق الوجهة | `SiGma.DataAccess/SiGmaDbContext.BranchAccess.cs:1944–2029` قبل التصحيح |
| P1 | ظهور رقم/معرّف تحويل سبق تحميله في عنوان نافذتي التفاصيل والاعتماد بعد سحب `StockTransfer.View`؛ حُجب نص العنوان دون حذف مسودة المستخدم أو تفكيك مكون الاعتماد | `Stock/StockTransfer/components/details/details.component.html:2` و`Stock/StockTransfer/components/list/list.component.html:53` بعد التصحيح |
| P2 | عمليات فرعية موروثة مكشوفة، وعدم اشتراط عرض المستند في `ManageApproval/Void`، وغياب حراس الإنشاء المباشر | `ItemReturnItemService.cs`، `PermissionPrerequisites.cs`، `PermissionEndpointResolver.cs`، مسارات Angular للقائمتين |
| P2 | بقاء حالة التقرير/الفلاتر/الحوارات بعد سحب المنحة أو تجديدها، وعدم ربط الطباعة بإصدار الصفوف | `Stock/ItemReturn/components/report` و`Stock/ItemReturn/components/list` و`Stock/StockTransfer/components/details` قبل التصحيح |

## سجل التحقق والقبول

| البوابة | الدليل المنفّذ والنتيجة | الحد الذي تثبته |
|---|---|---|
| مراجعة مستقلة للمصدر | `worker-1` راجع مرتجعات الأصناف ورابط البنود (طبقات HTTP والفرع والرصيد والقائمة والواجهة) ولم يجد عائقًا مؤكدًا؛ `worker-2` حدد تسريب عنوانَي التحويل ثم أُصلح في المصدر | لا تعني قبول HTTP أو SQL أو المتصفح |
| بناء .NET | `dotnet build tests/SiGma.BranchAccess.Tests/SiGma.BranchAccess.Tests.csproj --no-restore -m:1 --disable-build-servers --verbosity quiet` — نجح، **0 أخطاء، 22 تحذيرًا** | صلاحية تجميع المشروع بعد إصلاح تجهيز الاختبارات، لا تنفيذ معاملات المخزون |
| اختبارات الخادم المحددة | `dotnet test tests/SiGma.BranchAccess.Tests/SiGma.BranchAccess.Tests.csproj --no-build --no-restore --filter 'FullyQualifiedName~StockMovementPermission\|FullyQualifiedName~ItemReturnItemRetiredEndpoint' --logger 'console;verbosity=minimal'` — **54 نجح، 0 فشل، 0 متجاهل** | كتالوج وشرطيات وصحة حدود الفلاتر المباشرة ورفض البنود القديمة؛ الاختبارات التي تستخدم reflection تفحص sanitizer ولا تختبر قاعدة البيانات |
| بناء Angular | `npm run build` بعد حجب عناوين التحويل — **نجح**؛ 0 أخطاء قوالب/أنواع، مع تحذيرات ميزانية حزم وSCSS فقط | لا قبول لدورة حوار فعلية بمجرد نجاح التجميع |
| فحص التغييرات | `git diff --check` في المسارات المعنية للخادم والواجهة: نجح؛ وصفة `Generate-SigmaRecipes.ps1 -Check`: **8/8**؛ الجرد **263** مطابق لمجاميع حالاته (`162/45/49/5/2`) | فحوص مستودع واتساق إحصائي ومصدر |
| قبول التشغيل | لم تُشغّل سيناريوهات HTTP حي أو SQL Server التنافسية أو تنقل المتصفح الفعلي أو طباعة التقرير | **معلّق**، لا موافقة تشغيل مدّعاة |

إخفاق التشغيل الأول (`31/54` نجاحًا) كان قبل تصحيح تجهيز اختبار الكتالوج وافتراض وجود repository في اختبار فلتر القائمة؛ نتيجة `54/54` أعلاه هي **إعادة التشغيل اللاحقة** بعد بناء ناجح. تبقى حالات رصيد الفرع تحت القفل، فرع غير نشط للمدير، المرجع المحفوظ، عمليات revoke/regrant مع HTTP مرسل، ونسخ التقرير والطباعة اختبارات قبول تشغيلية منفصلة. البند `166` (`StockTransferItem`) خارج هذا النطاق ويحتاج معالجة واجهات child في بند مستقل، ولا تدخل حالته في اعتماد البنود `163–165`.
