# مصالحة تبني صلاحيات الأرصدة الافتتاحية — ٧ نوفمبر ٢٠٢٦

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| العقد | OPENING_BALANCES_ACCESS_ADOPTION_CONTRACT_FREEZE.md |
| الهدف العام | active؛ بقية مسارات التطبيق والقبول التشغيلي معلق |

## المطابقة المصدرية

| الجزء | التنفيذ |
|---|---|
| المسار | `/openingBalances` exact policy؛ يتطلب مفاتيح القراءة المشتركة ومفتاح View لأي مصدر، ولا يفتح بالـAddList وحده |
| التبويبات | Accounts، Cost Center، Customers، Suppliers، Staff، Stock، Prepaid، Deposit؛ لكل واحد متطلب قراءة وكتابة مصدرّي exact |
| القراءة | Batch.Get + State.Get + Currency.GetFinancialNumberPolicy، ومصادر الاختيارات وGET rows/state الخاصة بالتبويب؛ readInSession يلغي ويستعيد القراءة دون overwrite لمسودة |
| الكتابة | المصدر.AddList فقط؛ POST المرسل مستقل، ثم refresh rows/state منفصل قابل للفشل وإعادة المحاولة، ولا replay تلقائي |
| الصفوف | Add/Remove وEditableRows تحت write grant وdecisionsCancelled؛ draft/context/row checks محفوظة |
| Cost Center | `CostCenter.GetSelectByGroup` مصنف قراءة؛ dependent lookup محروس بالسياق والصف والمجموعة ويمنع النتيجة المتأخرة |
| المضيف | النماذج mounted مع hidden/inert/aria-hidden، StateMessage رفض، وMockDataAccessRequirement للكتابة؛ buttons والhandlers exact |
| parent | batch GET تحت route requirement؛ لا يهيئ التاريخ تلقائيًا من GET. عند batch غير configured تظهر حالة configurationRequired ولا تبدأ التبويبات. زر Configure يظهر لمدير الشركة فقط، وPUT محروس بـtenantAdmin في الواجهة وفلتر الصلاحيات وخدمة الأعمال؛ بعد نجاحه تُفتح التبويبات دون إعادة إرسال أو تخمين للتاريخ |
| backend | ReviewedPermissionOperations الموجودة طابقت الأحداث؛ Batch/State/Financial policy/CostCenter dependent reads صنفت WholeDocument reads؛ لا DTO/EF/AutoMapper/migration |

## المراجع والدليل

قُرئ `references/speed-analysis/2026-10-28/sidebar/21-accounts/screens/04-opening-balances.md`
ثم مصدر C0517 المؤرخ، والكتلة UI05/14/10/26/28. سبيد يثبت تبويبات ووظائف
مرجعية أوسع من عقد Sigma الحالي؛ import/export/loan/allocation المستبعدة سجلت
كفجوات لا كأحداث مخترعة. أضيف موضوع ثنائي اللغة إلى
`SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/accounts-guide.ts`
على `/UserGuide/accounts` ويشرح التبويبات والمفاتيح وحالة المسودة والكتابة.

## الملكيات والتغييرات

امتد المالك المشترك `opening-balance-editor.base.ts` بمالك access/session/read
وsent mutation/refresh و409 decisions، وأضيف `opening-balance-access.ts`.
تعدلت المحررات الثمانية وspecs المفاتيح الموجودة، وحدثت RouteAccessPolicy
ليدعم composite allOf/anyOf المتداخل ويقفل route. أضيفت مصادقة branch rules
لقراءات Batch/State/Currency/CostCenter. لم تُشغّل specs أو build أو lint أو
browser أو DB؛ `diff --check` ومراجعة العلامات المصدرية فقط.

أصلحت مراجعة التكامل تنظيف موردين كان يشير إلى filter controls/signals غير
موجودة، وربطت قرارات إزالة الصفوف بالتنبيه في التبويبات الأربعة الباقية.
صارت فلاترها مخفية/inert مع المحرر عند الرفض، وisBusy في الثمانية يعبر عن
الطلب/القرار الجاري فقط؛ حالة فشل refresh قابلة للمغادرة دون تكرار الحفظ.
يحفظ المالك المشترك كتابة مرسلة حتى مع destroy، وينقل saving/loader إلى
refresh ثم يحرره مرة. أضيف قفل discard في المالك نفسه للأب، وصُححت استعادة
قراءة409 بعد قبول تجاهل المسودة. تهيئة أولى مصرح بها بزر واضح للمدير، ولا
يُلغى PUT المرسل بسبب سحب الصلاحية أو destroy؛ النتيجة القديمة لا تنشر.

لم تعد state memo تحتفظ بـEMPTY/إلغاء/فشل؛ تنتهي مع actor/token/dataContext
وتلغي طلباتها المعلقة حتى في تبديل سريع بعيدًا ثم عودة. اختيارات direct
لا تتحول إلى كاش مرجعي جديد، وسياسة العملة singleton القائمة محفوظة.

| بوابة الحمل/المصدر | المطابقة النهائية المصدرية |
|---|---|
| parent GET وConfigure | LoadingService.startLoading/finalize؛ المسار يرث showPageLoading الافتراضي وLayout يملك sigma-shell__loading |
| ثمانية bootstrap وrefresh بعد الحفظ | المالك القائم begin/endEditorLoad أو commitEditor؛ spinner الصفحة وحده، ومكوّن الحالة يحتفظ aria-busy/errors/Retry دون loader مكرر |
| CostCenter.GetSelectByGroup | start/finalize بالصفحة مع pendingGroups/errors/Retry وحراس group/row/session؛ النتيجة المتأخرة لا تدخل الاختيارات |
| Batch/rows/lookups | direct operational/reference بلا opt-in جديد؛ state memo feature-owned وصالح فقط في سياقه؛ FinancialNumberPolicy singleton صريح |

أضيفت مواصفات سلوكية للأب والـbase/state، ومواصفات خلفية لرفض العادي ولو
منح Configure والسياق غير المحلول أو مدير شركة أخرى قبل المعاملة. أضيفت
حالات lifecycle وتعارض409 وقفل discard، ولم تُنفذ أي منها. القراءة المصدرية
مستقلة من العامل الثاني أكدت إصلاحات consumers وراجعت الجزء الجذري؛ الجذر
أتم التكامل والمراجعة. استُخدم عاملان موجودان بملكيات منفصلة لتقليل إعادة
المسح؛ لم يُنشأ عامل جديد أو يتغير scope خارج هذه الشاشة.

## الأداء والحدود

الطلبات المطلوبة initial finite تحت owner الحالي، وstate cache feature-owned
يُبطل عند السياق/الحفظ. لا قياس سرعة أو SQL plan أو index جديد؛ أي اقتراح schema
يحتاج قياسًا ومالك migration لاحقًا. لا ادعاء اكتمال كل أحداث المرجع أو تشغيل
تجريبي. حُسم القرار: تهيئة تاريخ batch لمدير الشركة فقط؛ المنح المستقلة
للتبويبات لا تمنح صلاحية التهيئة. يظل القبول التشغيلي والبناء والاختبارات
وقبول السباقات عند المالك.

رسالة مقترحة:

`feat(accounts): adopt opening-balance source permissions`

رسالة خلفية مقترحة: `fix(accounts): restrict opening balance setup to company administrators`

لا حاجة لهجرة أو تغيير AutoMapper/DTO/حساب مالي في هذه الدفعة. القبول عند
المالك: build/tests؛ مدير مقابل عادي بمنحةConfigure؛ بداية شركة غير مهيأة؛
revoke/regrant وdirty discard و409؛ حفظ مع refresh فاشل ثمRetry؛ انتهاء الجلسة
أثناء طلب مرسل؛ الثيمين/RTL/موبايل وظهور loader؛ SQL timing/plan. أُنجز الجرد
إلى٣٩operation-confirmed و١٣٣resource-only و٨٦unknown و٢context-only و٢alias
من٢٦٢بندًا/٢٥٩اسم مسار؛ هذه ليست نسبة قبول كل الأحداث، والهدف العام active.
