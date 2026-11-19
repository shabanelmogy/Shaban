| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-25 |

# عقد قيود اليومية — خط أساس المراجعة وفجوات التسليم

السجل الأصلي أدناه يصف مراجعة القراءة فقط بتاريخ ٢٠٢٦-١٠-٢٥ وما كان ناقصًا حينها. طلب المالك اللاحق «طبق التعديلات المطلوبة» يأذن بالتنفيذ؛ ملحق التنفيذ في آخر الوثيقة يحسم الفجوات من المصدر والسياسة القائمة ويجمّد التسليم. لا يُحذف وصف المراجعة التاريخي ولا يُتعامل معه كمنع جديد.

## الجزء المؤكد

| العقد | المؤكد من المصدر/السلطة | المنتج والمستهلك |
|---|---|---|
| الهوية | Id رقمي، المستأجر والمنفذ والتدقيق والرقم خادمية | EntityBase وRepository → DTO/API/Angular |
| ملكية القيد | الافتتاحي وIsGenerated لا يعدّلان/يعتمدان/يلغيان من JVs؛ المصدر مالكهما | JournalVoucherService → تفاصيل JVs ومصدر المستند |
| الحفظ اليدوي | SaveJVAsync لمسودة؛ سطور بجهة موجبة واحدة واتزان ودقة وحساب ترحيل وفترة مفتوحة | JournalVoucherService/Resolver → Angular؛ إثبات مصدر لا تشغيل |
| العملة | الأساسية مقروءة؛ لا صرف أجنبي حر بلا منظومة أسعار | Resolver + FinancialNumberPolicy → DocumentCurrency |
| التعديل | لقطة كاملة لكل السطور والمرفقات؛ IDs للمحفوظ، والمفقود يزال | UpdateVM/ReconcileDetails/ReconcileDocuments → المحرر؛ المستهلك الحالي غير مطابق |
| الترقيم | الخادم يطبّق PageNo/PageSize ويحسب Count؛ يجب إعادة TotalCount وتقييد الحجم | GetManyAsync → DataTable؛ التكامل الحالي غير مطابق |
| الاعتماد المستهدف | Pending=NotApproved1 → Approved0 أو Rejected2، وApproved0 → Pending1 بضوابط الأثر؛ Rejected نهائي | Master4/BE18/UI7؛ التطبيق الحالي يسمح بحالات أوسع ولا يملك Reject |
| سبب التصحيح | Reject وUnApprove بسبب غير فارغ≤500، حفظ السابق/الجديد/المنفذ/الوقت؛ لا اختراع تاريخ قديم | Master4/BE18 → سياق خادمي ولوحة مشتركة؛ عقود JV الحالية ناقصة |
| الأثر المالي | Approve ينشر الحقيقي، UnApprove يزيل أثره بضوابطه، Void يحتفظ بالقيد ويلغيه دون عكسي | Resolver + period/allocation owner → ledger/readers |
| المصادقة | Authorize + AuthGuard؛ لا API صلاحيات يختلقها المراجع | المتحكم الأساسي/root router → JVs |

## نقاط لا تُجمّد بالافتراض

| البند | الحالة | القرار/الدليل اللازم للتسليم |
|---|---|---|
| نوع اليدوي والأنواع الفرعية | Conflicting | الواجهة لا ترسل النوع فيصبح Receipt؛ يلزم تعيين خادمي JournalVoucher وجرد الأنواع الفرعية اليدوية مقابل المولدة قبل قبول payload |
| تلخيص أمر العمل في القائمة | Missing | تفاصيل القيد متعددة ولكل سطر JobId؛ يلزم اختيار مصدر موثق لعرض واحد/متعدد دون إسقاط الربط أو اختراع رأس JobId |
| مبلغ القائمة/دلالة البحث | Derived / Uncertain | مجموع Debit مبلغ مستند مدين متوازن قابل للاشتقاق؛ المصدر الحالي يثبت minAmount≥ فقط، والصورة لا تحسم هل المطلوب مساواة؛ يُعرض هذا الفرق قبل تغيير الدلالة |
| سياق الاعتماد والقرار | Missing | تحديد VM/route/استجابة التاريخ وcan* وحالات الخطأ والlegacy، مع السبب والمنفذ الخادمي وحماية Rejected لجميع writers؛ اللوحة المشتركة جاهزة ولا تنشئ عقد الخادم |
| سجل قرارات JV التاريخي | Missing | اختيار مالك history/persistence واستمرار الصفوف القديمة كبيانات غير مثبتة؛ لا backfill لأسباب أو منفذين لم يُحفظوا |
| الفترة الأصلية | Conflicting | المصدر يحل السنة بالتاريخ فقط؛ التبني يحتاج مطابقة FiscalYearId الأصلي والشهر وحماية البيانات التاريخية المتعارضة |
| التخصيص من JVs | Missing | internal service موجود بلا routes في Controller؛ يلزم عقد السطر/الطرف/الوجهة/السعة والعملة/الفرع والحفظ/الفشل/التحديث، ومراجعة نفس شروط الأهلية قبل عرضه |
| التقرير والطباعة والتصدير التفصيلي | Missing | تحديد مخرجات الرأس/السطور والإجماليات/الفلاتر والصفوف الكاملة من المصدر؛ الصور تثبت الإجراء لا payload/layout الخاص بالمخرجات |
| استيراد السطور | Uncertain | قالب ملف وحقول ومطابقة الحساب/الطرف/العمل وصلاحية الصفوف ومعالجة فشل جزئي؛ لا endpoint أو قالب مثبت في النطاق |
| ملفات المرفقات | Confirmed جزئيًا | Documents موجودة على الكيان/VM، لكن مسار FileField/Tracker وحقول الملف والتحقق/cleanup غير موصول في JVs؛ تتبع مالك Media قبل التنفيذ |
| بيانات مصنفة Receipt سابقًا | Uncertain | جرد مصدر/بيانات عند المالك قبل تصحيح تاريخي؛ لا تعديل جماعي من هذا التقرير |

## حدود التنفيذ اللاحق

يُعتمد الجزء المؤكد أساسًا للمقارنة، ويُحسم الجزء الناقص من أقرب مصدر صحيح والمالك عند القرار التجاري الجوهري. لا تمنع هذه الوثيقة قراءة المصدر أو إعداد الإصلاحات المأذونة لاحقًا، ولا تحول قرارًا محاسبيًا محسومًا إلى سؤال جديد. لا تمكّن أزرار رفض/إلغاء اعتماد جديدة قبل اكتمال عمودها الخادمي/الواجهـي وضوابطه. توسيع schema/history أو أثر السياسة وتوافق البيانات يحتاج خطة تناسب نطاقه قبل التنفيذ، مع المحافظة على حد الترحيلات الخاص بالمالك.

الحزم: نجح فحص جميع الحزم قبل الاستخدام؛ المراحل 0–6 مستخدمة للتدقيق، لا تنفيذ. لم تتغير كتب أو قوالب أو manifest فلا إعادة توليد لازمة. لا تغيير مصدر ولا ملف ترحيل ولا snapshot ولا تشغيل؛ التحقق العملي عند المالك.

## ملحق التنفيذ المعتمد بعد طلب التطبيق

السلطة: طلب المالك تطبيق ملاحظات التقرير؛ الخطة `JVS_MAINTENANCE_EVOLUTION_PLAN.md`؛ Master4/BE15/BE18/UI7/13. البنود Missing أعلاه تاريخية؛ يحلها هذا الملحق ضمن النطاق، مع بقاء تصحيح البيانات التاريخية الجماعي خارج النطاق.

### عقود الواجهة والخادم

- القائمة: `id:number, no:string|null, date:string, branchName:string|null, voucherSubType:number, jobNos:string[], amount:number, approvalStatus:0|1|2, isPosted:boolean, isVoided:boolean, isGenerated:boolean, canEdit:boolean, canDelete:boolean, canVoid:boolean, canAllocate:boolean`. لا تفاصيل أو مرفقات أو fiscal/audit في الصف. الأعمدة: رقم، تاريخ، نوع فرعي، أوامر العمل، مبلغ، فرع، اعتماد، إلغاء؛ Actions أولًا بمالك الجدول. jobNos قائمة مشتقة غير sortable/filterable؛ باقي scalar grid filters بالحقول الحقيقية.
- البحث: `no,branchId,fromDate,toDate,postingGroup,approvalStatus,minAmount,voucherSubType,assetId,voidedOnly,grid`؛ الغياب/null/فارغ لا يرسل، 0 وfalse محفوظان؛ PageNo/PageSize أعلى الطلب، clamp1..100 وCountAsync/TotalCount؛ فرز whitelist بالحقول المعروضة مع tie Id. التقرير/التصدير يستخدمان نفس applied snapshot وكل الصفحات، والفشل يلغي المخرج كله.
- تفاصيل: عقد الرأس الحالي + `canEdit/canDelete/canVoid/canAllocate`، سطور كاملة بـ id/accountId/accountName/partnerId/partnerName/subLookUp/description/debit/credit/jobId/jobNo/branchId/branchName/costCenterId/costCenterName ومرفقات CustomerDocument الحالية؛ إجماليا debit/credit من السطور المحفوظة ومعاينة فقط للمسودة. النوع/الحالة/العملة/الرقم خادمية.
- Add: `date,branchId,assetId,postingGroup,journalVoucherDetails,documents` فقط. Update يضيف id، وكل سطر محفوظ/مرفق محفوظ يحمل id، والجديد id0؛ لا حذف ضمني لحقل غير ممثل. السطر: accountId مطلوب، partnerId/jobId/branchId/costCenterId اختياري، subLookUp≤150 وdescription≤1000، debit/credit غير سالبين بجهة موجبة واحدة ودقة السياسة؛ balance خادمي. Documents بنفس CustomerDocument VM والتحقق الحالي، لا تغيير سياستها.
- المسارات: `/JournalVoucher` و`create` و`view/:id` و`edit/:id`، مع `details/:id` alias read-only للروابط الموجودة. mode data واضح وCanDeactivate/dirty cleanup؛ reload عند تغير id، مع إلغاء stale read، وعدم تمكين mutation إلا لمعرف محمل مطابق وcan* حقيقية.
- الخدمات typed، skip-error interceptor عند feedback محلي، نجاح القياسي global once، لا client tenant/audit/status writes.

### الاعتماد والإلغاء

- `GET JournalVoucher/{id:int}/approval` → Result بسياق مطابق لـ DocumentApprovalContext: recordId,no,amount,approvalStatus,isVoided,isLegacyUnproven,canApprove,canUnapprove,canReject,history. التاريخ: id,approvalStatus,previousStatus,reason,statusDate,user؛ لا اختراع القديم. كلا السطحين يستخدم اللوحة المشتركة نفسها؛ saved View قرارات، Edit قراءة فقط، Create بلا تبويب اعتماد.
- `POST JournalVoucher/{id:int}/approval` بمدخل `{approvalStatus:0|1|2,reason?:string}`. Pending متسق وغير مولد/افتتاحي وغير ملغى ودون استخدام محمي فقط → Approved عبر PostAsync أو Rejected دون ترحيل. Approved متسق فقط → Pending عبر UnpostAsync بعد فحص الفترة الأصلية والتخصيص والمراجع الفعلية. Rejected نهائي ويُحظر عليه Save/Delete/Approve/UnApprove/Allocate. كتابة الحالة/التاريخ/الأثر ذرية تحت قفل التخصيص الحالي. السبب1..500 بعد Trim للتراجع/الرفض؛ التعارض409، validation400، missing404.
- التاريخ كيان `JournalVoucherApprovalLog` وconfig، FK وجميع الحالات السابقة محفوظة. لا سجل بتاريخ مزيف؛ actor/time من مالك التدقيق الحالي. DELETE فقط pending unposted manual بلا history أو references ويشمل الأطفال المملوكين.
- القديم `Approve/{id}` يوجّه لنفس القرار؛ `UnApprove/{id}` يتطلب reason typed أو يفشل400، ولا reasonless bypass. رفض الحالة2 عبر كل writer، وحماية مصدر مولد تشمل handleActive؛ لا تعديل لقواعد المصدر الآخر.
- `POST JournalVoucher/Void` بمدخل `{id,reason}` فقط؛ source manual Approved+posted+nonvoid، لا allocation/downstream reference، stored FiscalYearId والسنة/الشهر الأصليان مفتوحان؛ actor خادمي. يحفظ IsVoided وreason/date/actor ويحتفظ IsPosted/رقم/سطور، بلا reversal. canVoid يستخدم guard نفسه؛ legacy inconsistent غير مؤهل.

### التخصيص والمخرجات

- `GET JournalVoucher/{id}/allocation-lines` يعيد Result<JournalVoucherAllocationLineVM[]> من الخدمة القائمة، رأس مؤهل posted+Approved+nonvoid وغير افتتاحي؛ فقط سطور partner-linked ذات available>0. `GET JournalVoucher/{id}/allocation-sources/{detailId}` يتحقق ملكية السطر ثم يعيد مصادر الخدمة القائمة مقيدة بالطرف والحساب والفرع والعملة والاتجاه والسعة؛ لا source selector عام يتجاوز الرأس. `POST JournalVoucher/Allocate` نفس JournalVoucherAllocateVM والخوارزمية القائمة، مع إعادة تحقق العملة/الحالة/السعة تحت القفل، وعدم تغيير دلالة التسوية أو إنشاء قيد جديد.
- Report واجهة مشتركة لنتائج البحث الكاملة؛ Print/Journal من Saved Detail/سطوره الأصلية، مع التاريخ والرقم والحساب والطرف والنوع والوصف والمدين/الدائن والإجماليين. Excel عادي أعمدة القائمة، تفصيلي صف لكل سطر من detail لعناصر النتائج الكاملة (كلها أو فشل الكل)، مع الأبعاد؛ لا حذف صفوف أو أثر محاسبي.
- Import CSV UTF-8 بالحقول السطرية المذكورة في الخطة، قالب قابل للتنزيل، parse آمن واقتباسات وUnicode؛ فحص كامل ثم Apply إلى المسودة عبر EditableRows، إلغاء بلا أثر؛ عدم حفظ تلقائي أو مطابقة طرف من نص حر.

### الملكية المتوازية والمطابقة

الجذر يملك قائمة JVs، نماذج وخدمة Angular، components/allocation، الترجمات والدليل وroutes/tsconfig integration والتقارير. عامل الخلفية يملك ملفات JournalVoucher ذات الصلة في Backend فقط، بما فيها history/config/VM/controller/service/profile وأثر original period المحدود؛ لا migrations/snapshot/resource مشتركة إلا بتنسيق. عامل المحرر يملك components/details وutils/editor-form في JVs فقط. لا تداخل ملفات، ويبلغ أي تعارض قبل تغيير العقد. أسماء مفاتيح النص الجديدة تحت `journalVoucher.*` وتُرسل للجذر قبل انتهاء العامل.

المطابقة المرجعية الملزمة: UI1/3/13/14/15/18/19 وWorkshop/Job editor للـ shell/fields/footer، PurchaseOrder وDocumentApprovalCycle للعرض والأسباب، UI2/4/6 وJob list للقراءة، BE8/15/18 وResolver/القفل للأثر. لا markup/table/palette منافسة. المنطق المالي الخاص بالمستند عند مالكه. يلزم guide ومراجعة scoped diff قبل handoff، وbuild/runtime/migration عند المالك فقط.

### توضيح المالك أثناء التنفيذ — القيود التلقائية

قال المالك إن قيود المستندات التلقائية تتعدل من مستنداتها، وطلب تحديد الإجراءات الممكنة عليها من هنا. تبقى Edit/Delete/Approve/UnApprove/Reject/Void/Activate ممنوعة من JVs على القيد المملوك لمصدر فعلي، حتى لو نقص IsGenerated في بيانات قديمة. تتاح القراءة واليومية والطباعة والتصدير، وفتح المصدر عندما تثبته FK وحيدة وآمنة، والسجل المقروء من المالك المركزي. يعاد استخدام JournalReportSourceResolver وjournalOriginalSourcePath الموجودين دون نسخ parser للأرقام/الروابط؛ sourceKind/sourceId حقول ملاحة مقروءة مستهلكة في القائمة والتفاصيل، غير قابلة لمرشح scalar.

التخصيص منفصل عن تعديل السطور/الحالة. الكاتب الداخلي الحالي يدعم القيود المرحّلة المولدة وغير المولدة عبر Staff/CustomerDeposit وغيرهما؛ لا يجوز كسر مستهلكيه بإضافة حظر manual-only شامل. يحتفظ بعقده القائم: Approved+posted+nonvoid+nonopening، طرف وسطر ذو سعة، مصدر معاكس متوافق في الطرف/الحساب/الفرع/العملة، وإعادة تحقق تحت القفل. تعرض الشاشة التخصيص فقط حيث يثبت هذا العقد والسعة، مع أي استثناء مملوك للمصدر يثبته التحقيق؛ لا إنشاء قيد جديد ولا تغيير دفتر المصدر أو تاريخ اعتماده.

سياق اعتماد القيد التلقائي يعرض حالة ترحيله الفعلية والتاريخ المتاح فقط دون أزرار mutation؛ قرارات المصدر تُجرى من المصدر ولا يُفبرك له تاريخ قرار JV. إضافة `GET JournalVoucher/{id}/log` تعيد Result<DocumentActionLogEntry[]> من القارئ المشترك بعد تحقق root tenant والطفل المملوك (سطور/مرفقات/تاريخ قرارات)، وليس سجل المستند الأصلي أو مصادر أخرى. لا تغير مالي أو schema إضافي للسجل المقروء.

### ملحق مجمّد — مطابقة الكاش وتوضيح الوثائق، 2026-10-25

تعديل أداء لاحق مجمد بطلب المالك في اليوم نفسه: تنفيذ batch للأهلية وفحوص المصدر فقط وفق شريحة الخطة، دون تغيير مسارات/حقول JSON أو دلالة أي flag/transition. تبقى جميع فحوص الكاتب الفعلية authoritative وتنفذ تحت القفل كما هي، وتظل المراجع التاريخية مانعة. تحسين الاستعلام لا يمنح صلاحية جديدة أو يوسع مصدر كاش.

طلب المالك مراجعة الكاش وفق الوثائق وتحسين وضوحها لمنع إغفالها. المرجع UI2 وMaster5. مصادر الخيارات المطبقة من خدماتها الحالية: الفرع وأمر العمل والمورد والعميل. يبقى الحساب التشغيلي والأصل ومركز التكلفة وبيانات القيد والاعتماد والتخصيص مباشرة؛ لا توسيع لأهلية الكاش اعتمادًا على اسم المسار. سياسة دقة العملة تُقرأ بطلب مباشر مؤكد عند تحميل JVs/Retry مع feedback محلي، دون تغيير الدقة أو الحسابات أو إضافة cache owner.

تبدأ المراقبة بعد نجاح القراءة المحدودة لكل مصدر، وتحتفظ بالتسميات المختارة داخل مصفوفات الربط التي تُمسح عند تبديل السياق، دون تعديل IDs أو المسودة. خدمتا العميل والكاش وموضوعه موجودة مسبقًا وتُحفظ؛ أثبت CustomerService.SelectAsync أن العميل تجميع لهويات Company/IndividualPartner وليس رصيدًا تشغيليًا. كتابة هذين المنتجين واستيرادهما يجب أن تبطل مصدر Customer قبل callbacks بعد النجاح أو savedRows موجب. يسمح operator الإبطال المشترك بالاعتماد الصريح حتى إذا لم يخزن الكاتب قائمته الخاصة؛ لا يفعّل كاش Company/IndividualPartner ولا غيرهما. هذه مصالحة للاعتماد القائم وليست إضافة مصدر جديد. تفاصيل الجدول والأدلة والحدود في ملحق المطابقة النهائية.

## ملحق تنفيذ تحسين فتح المحرر — Frozen — 2026-10-25

طلب المالك تنفيذ التشخيص وإضافة قواعد عامة. الشكل محرر مالي موجّه بتبويبات UI1/UI13 وقراءة تفاصيل/سياق اعتماد BE7/18. عقد العرض: حذف تكرار :host والاعتماد على sigma-route-host؛ تحميل لوحة الاعتماد عند أول اختيار للتبويب فقط مع الاحتفاظ بها عند التبديل، وإعادة التهيئة لكل هوية قيد/قراءة جديدة، وحفظ pending/dirty/print/route/error/Retry. عقد القراءة: نفس DTO ومفاتيح المصادر وأهلية الإجراءات والتاريخ والمستأجر والفترات والحراس عند الكتابة؛ تقليل فحوص القراءة التي لا تؤثر في أي can* بحسب حالة القيد، وعدم إعادة تحميل رأس موجودة بياناته في الإسقاط. يمكن تحسين جمع مرشحي المصدر داخل مالكه المشترك مباشرة مع حفظ جميع الأنواع العشرة والغموض (عدد المرشحين بالضبط واحد) وسياسة الحذف والمستأجر، دون افتراض مصدر بحسب الرقم أو النوع وحده؛ الترجمة SQL والتوقيت معلّقان. لا كاش أهلية/سياسة ولا توازٍ EF على DbContext واحد ولا migration أو فهرس مطبق. الجذر يملك الواجهة والدليل والحزم والتكامل؛ عامل خلفية يملك ملفات خدمة JV ومحلل المصدر فقط؛ عامل وثائق يملك UI1/UI13/BE7 وCHANGELOG والمهارة فقط. لا تداخل ملفات، ولا تعديل حراس الكتابة أو API أو reference modules أخرى.

## ملحق اليومية كنافذة قراءة — Frozen — 2026-10-25

طلب المالك صراحة أن إجراء Journal يفتح مثل إجراء اليومية في Bill، لا View. لا يمتد إذن التنفيذ إلى نتائج مراجعة Allocation الحالية. عقد اليومية: GET JournalVoucher/{id:int}/journal يعيد Result<VoucherJournalLineDto[]> بالهوية الحالية وتحت tenant/live repository scoping، لكل حالات القيد القابلة للقراءة بما فيها draft/void (كما كان View)، دون حراس mutation أو تخمين مستند المصدر. إسقاط تاريخ/رقم/نوع القيد وaccountCode/accountName/contact/description/debit/credit للسطور المحفوظة بترتيب Id، مع2 مواقع materialization كحد مصدرّي (رأس + سطور) و404 للقيد الغائب، بلا policy/lookup/details-enrichment. Type=VoucherSubType.ToString حتى يطابق نوع القيد في الصورة، ويترجمه مستهلك JVs من الخيارات الحالية.

الواجهة: إجراء Journal يفتح نافذة في القائمة؛ View ورقم القيد والطباعة تحتفظ بمساراتها. يُنشأ المالك المشترك DocumentJournalComponent لعرض قراءة مستقلة محايدة: recordId/title/subtitle/loadJournal/typeLabel، جدول Date/Account/Contact/Type/VoucherNo/Description/Debit/Credit وإجماليا المدين والدائن، close وRetry وإلغاء القراءة وfences لكل هوية، StateMessage محلي واحد فوق body mask وفق UI22، والتصدير/تعديل القيد خارج هذا العقد. يستهلكه JVs في المهمة الحالية؛ Bill يبقى مرجعًا غير معدل، والنسخ خارج النطاق تسجل ضمن UI30#39 وفق Master5. لا business rules مشتركة داخل العارض. التمدد/التمرير/focus/RTL/theme من EditorDialog/DataTable/SummaryCards الموجودة، بلا CSS أو dialog shell جديد. المالك الجذر لواجهة JVs/المكوّن/دليلها/الكتب والحزم؛ العامل الخلفي يملك فقط IJournalVoucherService وJournalVoucherController وملف JournalVoucherService.Journal.cs الجديد. لا allocation source edits أو migration أو تغيير mapping/DTO/schema/financial lifecycle. اختبارات التشغيل والبناء عند المالك.
