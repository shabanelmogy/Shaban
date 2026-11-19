# تسليم صلاحيات قائمة إعدادات تكلفة التأجير

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | LEASE_COST_SETTING_ACCESS_CONTRACT_FREEZE.md المجمد |
| النطاق | components/list/** وleasecostsetting.routes.ts فقط |
| مسؤولية التكامل | الجذر؛ المحرر والخدمة والـhelper والخلفية والدليل بملكية أخرى |

## النتيجة المصدرية

تستهلك القائمة helper الصلاحيات الحقيقي. تُفتح القائمة والجدول والـgrid
filters والصفحات وView بمنحة LeaseCostSetting.View فقط. يظهر مدخل Create
بمجموعة Create ومصدريها الكاملين، دون اشتراط View أو طلب القائمة أو
اختيارات المحرر مسبقًا. لا filter bar أو export أو print جديدة.

التعديل والحذف يستهلكان مجموعتي Edit/Delete المجمدتين. كل callback يعيد
فحص المنحة وهوية الممثل وعضوية نفس object من القائمة الحالية ومعرّف موجب
صحيح وحالة busy؛ clone بمعرّف مطابق أو صف من قراءة قديمة لا يكفي. شريط
القائمة والجدول disposable عند فقد View؛ مضيف الصفحة يبقى mounted
hidden/inert وفق entry، فيسمح بمدخل Create-only دون بيانات محجوبة.

قراءة القائمة تحت switchMap/sequence/actor context/denied$/destroy، مع
page loading start/finalize وerror/Retry. يظل trigger الخارجي حيًا بعد
denial، ويبقى watcher مستقل بعد completion ثم يعاد تسليحه عند rapid
revoke/regrant المتكرر. recoveryPending تنتظر modal أوconfirmation أو
delete busy tail؛ لا تعيد business/HTTP failure تلقائيًا. سياق ممثل جديد
يمسح الصفوف والCount والgrid والصفحة وحجمها قبل استرداد قراءة جديدة،
ويحتفظ بالـmodal القديمة حتى تغلق وفق مالكها ولا يعيد تركيب مسودتها.

الصفحات الجديدة أثناء قراءة معلقة تلغيها عبر switchMap. تغير grid يعيد
الصفحة الأولى ويحفظ false filter serialized بعقد withGridFilters. حجم
الطلب ≤200، وCount وpage metadata من الخادم، دون فرز أو filter bar مخترع.
نجاح حذف الصف الوحيد في صفحة لاحقة يعيد الصفحة السابقة مع نفس grid.

## الكتابة والقرار والخروج

تأكيد الحذف lazy/cancellable من ConfirmationDialogService القائم، مع
سياق ملتقط وإعادة فحص grant/object بعد قبوله قبل dispatch. expiry يلغي
القرار ويفرج confirmationPending دون إرسال. DELETE المرسلة مستقلة عن
destroy/denied، تستخدم trackWrite وHttpContext وCAN_PRESENT_API_OUTCOME
مع نفس mayPublish المحلي والعالمي. نجاح envelope يثبت actor/id tombstone
قبل mayPublish، فلا يعاد حذف الصف بعد سحب/إعادة المنحة ولو مُنع نشر
النجاح القديم. الفشل يحتفظ بالقائمة ويعرض inline error؛ success toast
من interceptor وحده ولا toast محلي مكرر.

حارس route يستهلك public canDeactivate للطفل القائم بقرار boolean أو
Observable نفسه، فلا يفتح قرارًا ثانيًا. يمنع مغادرة تأكيد الحذف المعلق،
ويسمح بالخروج بعد dispatch مع استمرار الكتابة. closed boolean من المحرر
يحدّث قائمة نفس الممثل فقط؛ callback من modal actor قديم لا يطبّق refresh
على actor جديد. عقد Close/dirty/discard والقراءات داخل الطفل بملكية عامل
المحرر؛ القائمة لا تتدخل فيها. التحقق النوعي النهائي لوجود هذا API
بعد تسليم عامل التفاصيل جزء من تكامل الجذر، وليس نجاح build مدعى هنا.

## الملفات والمواصفات

الملفات المعدلة داخل
`SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseCostSetting/`:

- ملف القائمة: components/list/list.component.ts.
- قالب القائمة: components/list/list.component.html.
- مواصفة القالب: components/list/list.component.spec.ts.
- ملف المسار: leasecostsetting.routes.ts، مع showPageLoading=true وCanDeactivateFn.

الملف المضاف:
`components/list/list-access.spec.ts`.

المجموع ١٨ مواصفة مصدرية غير منفذة: ١٧ لعمر القائمة والإجراءات وواحدة
للقالب الحقيقي المحجوب. تغطي Create-only وdenied وView-only، وexact row
object، وإلغاء القراءة والاسترداد المتكرر بعدcompletion/busy modal،
وعدم حلقات الفشل، paging replacement وfalse grid filter وCount/page
metadata، وإلغاء التأكيد وإعادة فحص صفه، وindependent sent delete/latch/
stale outcome/no replay/destroy، وآخر صف بصفحة لاحقة، وتبديل actor، وتمرير
قرار child exit نفسه دون confirmation آخر.

## المرجع والمصادر والتحميل والكاش

قُرئ العقد كاملًا ومهارة Sigma والقواعد الحية المستهلكة لهذا الهدف، ونجح
recipe Check للحزم الثماني قبل العمل. استُهلكت قرارات الشكل والمرجع
المجمدة: Speed S242 وصفحة الأصل ودورة C0864/C0863 مسجلة عند الجذر؛ لا
إعادة اختراع تكلفة المركبة أو ManageVehicleCost أو derived calculations
أو Odoo financial contract. الأعمدة القائمة MakeAndModelName وMarkUpPercent
مع Id للهوية تطابق ListVM؛ لا DTO أو payload جديدة ضمن ملكية القائمة.

قراءة القائمة direct operational بلا cache/lookup/watch بيانات جديد؛
watch الوصول المحلي يبقى ملكه AccessViewPolicyService. مصدرا المحرر
CarModel/LeaseCostParameter خارج هذه الملكية ويظلان direct كما العقد.
route/page loader وStateMessage وDataTable تبقى مالكة التحميل والخطأ
والجدول المشتركة؛ المصدر لا يثبت ظهور progress الفعلي أو theme/RTL.

لا backend أو calculation أو AutoMapper أو schema/index جديد، ولا migration
مطلوبة لهذه الشريحة. لا query إضافية للصفوف؛ page GET والCount الحاليان
في الخادم، مع request cancellation فقط. قياس الزمن وخطة SQL وتغطية
الفهارس قيد قبول الجذر/المالك؛ لم يُدع قياس سرعة أو SQL plan هنا.

## فحوص المصدر وحدود التسليم

كانت ملفات list/routes pristine قبل التعديل؛ حُفظت تغييرات الزملاء في
details/helper/service/backend ولم يعدلها العامل. رُوجع scoped diff لكل
الملفات المتتبعة في ملكية القائمة والمسار، وقُرئت المواصفة المضافة مباشرة.
نجح parsing لأربعة TS ملفات وparseTemplate لقالب واحد، وحل imports
المحلية بلا مفقود أو اسم مرشح غير مستخدم، وفحص merge markers/trailing
whitespace بلا مشاكل، وgit diff --check بلا أخطاء (تحذيرات LF→CRLF فقط).
هذا parsing وليس typecheck أو build أو نتائج تشغيل tests.

لم يُنفذ build/test/typecheck/lint/browser/DB/migrations/snapshots/commit/
push/deploy، ولم يجر تعديل shared أو خدمة أو helper أو محرر أو backend
أو دليل أو vocab أو canonical/generated documentation. لم يُنشأ وكلاء
إضافيون. قبول المالك المعلق يشمل compile/spec execution والمنح الحقيقية
وrapid revoke/regrant وإلغاء/مغادرة القراءة وتأثير writes والمقاسات
والـportals والثيمين وRTL والدليل النهائي.

الجذر يملك topic إعدادات تكلفة التأجير القائم في lease-guide.ts تحت
/UserGuide/lease، ويطابقه مع Create-only ومنح Edit/Delete ودورة المسودة
والخروج والكتابة المستقلة قبل ترقية الجرد. لا تعني هذه الشريحة إقفال
المحرر أو الوحدة أو هدف الصلاحيات كاملًا.

رسالة commit مقترحة للواجهة دون تنفيذ:
`fix(lease): scope cost setting list actions and request lifetimes`
