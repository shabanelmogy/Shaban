# عقد تبني صلاحيات قيد اليومية وسجل اليومية

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠٧ |
| التفويض | هدف المالك تفعيل الصلاحيات في كل الشاشات والأحداث؛ استمرار CURRENT_ACCESS_IMPLEMENTATION_CONTRACT_FREEZE |
| النطاق | Vouchers/JVs list/details/allocation وAccounts/Journal report، ثم المسارات والروابط والجرد والدليل |
| الحدود | مصدر فقط؛ ممنوع build/tests/lint/browser/DB/migrations/snapshots/commit/push/deploy |

## المفاتيح الفعلية والعقود المستهلكة

| المستهلك | المتطلب |
|---|---|
| قائمة القيود وصفحاتها وتصديرها العادي/المفصل وتقريرها | JournalVoucher.View؛ التصدير المفصل يقرأ GetById الذي يحله resolver إلى View |
| فلاتر القائمة | Branch.Lookup وAsset.Lookup اختياريان؛ عند غيابهما لا قراءة/فلتر مرسل، ودون إيقاف بقية البحث |
| تفاصيل/طباعة القيد | JournalVoucher.View مع Currency.GetFinancialNumberPolicy لقراءة سياسة الدقة المستخدمة حاليًا في المحرر/الطباعة؛ لا تغيير قاعدة مالية أو منح ضمنية |
| تهيئة إنشاء/تعديل القيد | Branch.Lookup، Job.Lookup، Customer.Lookup، Supplier.Lookup، Account.GetPostingSelect، CostCenter.Lookup، Asset.Lookup، Currency.Lookup، Currency.GetFinancialNumberPolicy؛ هذه دفعة bootstrap الحالية التي يشترط نجاحها الحفظ |
| إنشاء/تعديل القيد | Create أو View+Update مع تهيئة المحرر أعلاه؛ route والزر والـhandler والحفظ متطابقة |
| معاينة تغيير العملة | متطلب المحرر مع JournalVoucher.PreviewCurrency؛ يلغى read وقرار قبوله عند السحب، دون تطبيق preview محجوبة |
| الاعتماد | GET approval يحل إلى JournalVoucher.View؛ POST approval/Approve/UnApprove يحل إلى ManageApproval، والقرار يحتاج View أيضًا |
| سجل الأحداث/قراءة القيد المالي | View+Log أو View+Journal؛ لا اختراع input غير موجود لمالك مشترك |
| الإبطال والحذف | View+Void أو View+Delete؛ مع canVoid/canDelete والسبب/التأكيد وإعادة فحص الهوية والحالة والمنحة |
| التخصيص | View+AllocationLines+AllocationSources+Currency.GetFinancialNumberPolicy للقراءات، وإضافة Allocate للإرسال؛ لا Create ضمني |
| استيراد CSV المحلي وتنزيل قالبه | متطلب المحرر؛ القراءة محلية ثم تتحقق الخيارات الموجودة وتُرسل بالحفظ المعتاد. لا ImportData endpoint جديد أو مفتاح مخترع |
| مرفقات القيد | متطلب المحرر في FileField/collection؛ Upload+Delete للرفع وDelete للتنظيف في tracker القائم، وإزالة مستند ذي ملف تحتاج Delete |
| تقرير سجل اليومية | AccountReports.GetJournals من AccountReportsController.GetJournals؛ صفحات/بحث/تحديث/تصدير كل النتائج تحت المفتاح نفسه |
| فلتر حساب التقرير | Account.Lookup اختياري من GET Account/GetSelect، ويُعقم الطلب عند السحب |
| روابط المصدر | منح وسياسة RouteAccessPolicyRegistry للوجهة الفعلية أيضًا؛ المسار غير المتبنى يظل مغلقًا للعادي، ولا تُفتح prefixes عامة |

لا حقول أو حسابات أو مخطط أو آلية ترحيل جديدة. تُحفظ القيم المالية النصية،
دقة اللقطة وversion وحراس canEdit/الفترة/التسويات الحالية. لا تُغيّر هذه
المهمة القرارات المالية الأقدم أو تتبنى رأيًا تاريخيًا مخالفًا للكتاب الحالي.
الشكل المالي08 للقيد، وتقرير07 لسجل اليومية مع الحفاظ على transport paging.

## عمر الوصول والعمليات

كل finite read/watch/export/قراءة ملف محلية مؤجلة/طباعة تحرس بمتطلبها
وسياقها. لا تُطبق denied$ على outer triggers أو كتابة/تنظيف أُرسل بالفعل.
لا revision غير متعلق يكرر operational GET؛ إعادة المنح تستعيد القراءة
الناقصة مرة واحدة، بما فيها lookups عند إعادة المنح أثناء Save ثم فشلها.

سحب المنحة في السياق نفسه يحجب/inert المحتوى وbody portals مع حفظ
المسودة والسبب والتخصيص والمعاينة؛ تغيّر actor/token/tenant/working context
ينهي الجلسة القديمة ويزيل outputs. لا تُهدم حوارات stateful ذات كتابة مرسلة.
تظل قراءات المصادر المباشرة والكاش عند مالكها الفعلي دون opt-in جديد.

التأكيدات كسولة، والإلغاء يصدر false، ويعاد فحص grant/state/row/context قبل
الإرسال. قرار discard محلي جديد بعد denial/انتهاء السياق ممكن دون تنظيف
ملفات السياق القديم؛ لا يبقى pending flag محبوسًا. لا تنشر sent callbacks
أو cleanup نتائجها في سياق جديد ولا تعيد إرسال write تلقائيًا.

القراءة المشتركة عديمة المسودة يجوز هدمها عند denial مع إبقاء حوار الأب
وسجله واستعادة القراءة عند regrant. DocumentApprovalCycle stateful يتلقى
accessRequirement/decisionRequirement؛ accessBlocked لانتهاء السياق فقط.
التخصيص يكشف canDeactivate(): boolean|Observable<boolean> لوالده، وتضيف
قائمة القيود نفس الحارس لمسارها. الطباعة المؤجلة تُلغى حتى بعد اكتمال GET.

## المراجع والتناسب والأدلة

العقد جزء من خطة الوصول المشتركة القائمة، وليس تصميم مجال جديدًا. قرئت
نقطة Speed، screen12 JVs من قسم18 وscreen19 Journal من قسم21 بتاريخ
٢٨أكتوبر، ثم منفصلًا أوائل C1364 وC1362 وC0498. يثبت المرجع الفصل بين
العرض والتحرير والحذف والإبطال والطباعة والتخصيص وروابط اليومية، ولا يثبت
قواعد Sigma أو خادمها. الأصل S219 يشرح إعداد رقم JV فقط؛ استُبعد من تعديل
الترقيم، ولم يوجد شرح أصلي مباشر أدق ضمن catalog بالعنوان المقابل.

العرض/البحث والتصدير والمصادر/الاعتماد/الإبطال/التخصيص والمرفقات مطابقة
كأحداث موجودة في Sigma. clone وapproveAll وروابط تخصصية إضافية في Speed
فجوات مرجعية، دون endpoint/عقد Sigma معتمد لهذه الدفعة؛ لا تُخترع صلاحياتها.
Odoo المحلي متاح كمكمل؛ لا غموض وظيفي يتطلبه لربط مفاتيح Sigma الحالية.
دليل التطبيق والحسابات يُحدثان بعد المصالحة؛ لا ادعاء تساوٍ وظيفي شامل.

## الملكية المجمدة والتسليم

العامل الأول: JVs/components/details/** وspecs الخاصة به فقط. العامل الثاني:
JVs/components/list/** وJVs/components/allocation/** وspecs فقط. لا تعديلات
shared/routes/backend/docs/guides من العاملين، ولا تعديل ملفات الآخر.
الجذر: Accounts/Journal/**، routes/registry، الخلفية إذا ثبت mismatch مباشر،
العقد والجرد والمصالحة والدليل والتكامل ومراجعة scoped diff في كل مستودع.
يجب الحفاظ على تعديلات العملات والمصادر السابقة في الملفات المعدلة بالفعل.

تسليم كل عامل: مصدر مكتمل في ملكيته، mapping الطلب والمفتاح، behavioral
specs غير منفذة، ومخاطر دقيقة إن وجدت. لا يدعي أي عامل اكتمال الهدف العام.
توقيت/SQL plans/رؤية التحميل وDOM والاتجاه والثيمان والموبايل معلقة للمالك؛
لا فهرس أو migration دون تغيير source/query مبرر. فحص الوصفات الثماني OK.

## توضيح رابط مصدر ذي إجراء داخل query — ٧ نوفمبر

أثبت عقد Fleet الجاري أن فتح تجهيز البيع المحفوظ يحتاج
EquipmentSalePreparation.Get بالإضافة إلى مسار Fleet المتبنى. رابط مصدر
القيد له query prepareEquipmentId، فلا تكفي سياسة مسار Fleet العامة وحدها.
يمتد helper الحالي journal-source-navigation بدالة
journalSourceAccessRequirement(row)، وتستهلكها الروابط في التقرير وقائمة
القيد ومحرره مع سياسة الوجهة؛ لا صلاحية جديدة أو تعديل لقواعد تجهيز البيع.
لا تُفرض هذه المنحة على fallback يفتح القيد نفسه عند غياب مصدر محفوظ.
