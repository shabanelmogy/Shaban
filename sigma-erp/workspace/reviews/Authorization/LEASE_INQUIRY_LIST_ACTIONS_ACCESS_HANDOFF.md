# تسليم صلاحيات قائمة استفسارات التأجير والمرحلة والسجل

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | LEASE_INQUIRY_ACCESS_CONTRACT_FREEZE.md المجمد |
| النطاق | components/list وstage-dialog وlogs-dialog وleaseinquiry.routes.ts فقط |
| المالك | العامل fleet_alerts_final_audit؛ التفاصيل والخدمة والخلفية والدليل والترجمات والتكامل بملكية أخرى |

## المنح والإجراءات

تقرأ القائمة والبحث والصفحات والفرز والتصفية وExcel بمنحة View. دخول
create-only يعرض مدخل الإنشاء وحده دون GET للقائمة أو العملاء. تتطلب
الإضافة مجموعة Create المجمدة دون إضافة View. تتطلب أفعال View/Edit/
Delete/Stage/Logs مجموعاتها الصريحة من helper المشترك؛ Stage مستقل عن
Update وLogs مستقل عنهما. كل إجراء يعيد فحص grant وعضوية نفس كائن الصف
المحمل، ومعرّف موجب صحيح وحالة busy؛ clone بمعرّف مطابق لا يكفي.

تلتقط القائمة مالك كل modal، وتمنع closed/refresh لجلسة ممثل سابق من
تحديث سياق جديد. تظل التفاصيل وحوار المرحلة مركبين عند expiry؛ لا تمسح
القائمة selectedRow أو تدمر modal لإخفائه. الطفل يملك مسودته وdirty exit.
حارس route يستدعي public canDeactivate للطفل الفعال، ويمنع مغادرة قرار
الحذف أو Excel الجاري؛ يسمح بخروج كتابة delete أو stage بعد dispatch
دون إلغاء طلبها. logs قابل للإغلاق أثناء القراءة ويلغيها ويمسح الناتج.

## عمر الطلب والمسودة

القراءات القائمة وExcel تعمل بمالك page loading ومؤشر واحد، مع sequence
وactor context وdenied$/destroy على كل read. trigger الخارجي يبقى حيًا
لـRetry/regrant، وwatch مستقل يبقى بعد completion ويُعاد تسليحه بعد
دورات revoke/regrant السريعة. recoveryPending تنتظر busy tail للـmodal
أو delete/confirmation/export، ولا تكرر HTTP/business failure تلقائيًا.
تغيير actor يمسح raw/applied filters/grid/count/data والترتيب والصفحة،
ويحتفظ بالطفل القديم محجوبًا حتى close/discard وفق مالكه.

الحذف المرسل وChangeStage يستعملان trackWrite وHttpContext وCAN_PRESENT_API_OUTCOME
من المالك المشترك. لا takeUntilDenied أو destroy على write المرسلة.
الحذف الناجح يثبت actor/id tombstone قبل mayPublish؛ تمنع إعادة استخدام
الصف القديم حتى لو لم تُنشر نتيجة الجلسة المنتهية. نجاح stage يثبت
committed ويجعل النموذج pristine قبل فحص النشر، فلا إعادة إرسال بعد
regrant وتظل المغادرة المحلية ممكنة. الفشل يحفظ المسودة ويظهر خطأ محليًا؛
success toast يبقى interceptor وحده.

حوار المرحلة يحتفظ stage/notes لنفس الممثل، ويمنع الممثل الجديد أو تغيير
record من استخدام المسودة القديمة. discard lazy/cancellable ومشترك
مع X/Cancel/Escape/route؛ expiry يلغي القرار المفتوح بنتيجة false، ويمكن
بدء local discard جديد أثناء denial. selected portals تُغلق فور expiry،
والتركيز المؤجل مرتبط grant/context/session/DestroyRef. الحقول تستخدم
نفس stage integer وnotes≤1000 دون workflow جديد.

السجل read-only داخل EditorDialog بمؤشر محلي StateMessage، وwatch مستقل
بعد نجاح القراءة يغلق ويمسح النتائج عند expiry أو تبديل actor. local
close يلغي الطلب المعلق، ولا regrant يعيد فتحه أو يكرر قراءته تلقائيًا.

## مصادر العملاء والكاش

العميل في فلتر القائمة optional مع View+Customer.Lookup. bootstrap finite
ناجحة تسبق ReferenceLookupBindings watch من CustomerService الحالي عبر
خدمة الميزة؛ لا cache جديد. الانتهاء يلغي finite read/watch ويزيل الخيارات
المحمية ويغلق picker، ويبقي customerId الخام والمطبق. label المحددة
تحتفظ بها نفس الجلسة لاستعادتها عند regrant ولو غابت عن القائمة الجديدة؛
تُمسح عند تبديل السياق. bootstrap failure يملك Retry مستقلًا ولا يمنع
القائمة؛ retained refresh صامت عبر المالك المشترك، وcontext/grant watcher
مستقل يلتقط السحب السريع بعد completion.

القائمة وExcel direct operational reads. لا CarModel/Staff/VehicleType/
Contact requests ضمن هذه الملكية؛ يملكها محرر التفاصيل وفق عقده. لا
مصدر خلفي أو branch/schema/AutoMapper/calculation جديد.

## الأعمدة والفلاتر والعقد

الأعمدة: No وDate وCustomerName وCustomerCode وSalePersonName وStage؛
DTO المقابل يحتوي Id للهوية وهذه الحقول وstage text القائمة الموجودة.
لم تضف هذه الشريحة DTO أو audit field. query الخام لا يطبق حتى Search؛
paging/sort/export/refresh يستعمل lastQuery المطَبقة. stage=0 محفوظ في
query وURL، وfalse grid filter محفوظ بتسلسل filters المشترك. الترتيب
والمرشحات الجديدة يعيدان الصفحة الأولى، والصفحات الجديدة أثناء loading
تلغي السابقة عبر switchMap. Count من الخادم، وصفحة أخيرة فارغة تضبط
نفس applied query. Excel fetchAllPages على query المطَبقة وبنفس الأعمدة.

## الملفات والمواصفات

الملفات المعدلة داخل `SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseInquiry/`:

- ملفات القائمة: components/list/list.component.ts و.html و.spec.ts.
- ملفات المرحلة: components/stage-dialog/stage-dialog.component.ts و.html.
- ملفات السجل: components/logs-dialog/logs-dialog.component.ts و.html.
- ملف المسار: leaseinquiry.routes.ts، بshowPageLoading وCanDeactivateFn.

الملفات المضافة:

- مواصفات القائمة: components/list/list-access.spec.ts، عددها ١٨.
- مواصفات المرحلة: components/stage-dialog/stage-dialog-access.spec.ts، عددها ١١.
- مواصفات السجل: components/logs-dialog/logs-dialog-access.spec.ts، عددها ٦.

أُعيدت smoke القائمة إلى rendered denied shell spec واحدة. المجموع ٣٦
مواصفة مصدرية غير منفذة. تشمل create-only/denied/View-only وexact row/
Stage+Logs بلا Update، list read recovery بعد completion وبusy tail،
optional customer bootstrap/watch/recovery/failure/label retention،
applied query/stage0/false/sort/count/URL، confirmation expiry وindependent
delete+stale-success/no replay، composed export cancellation، actor reset،
stage draft/actor/reuse/discard/sent write/destroy/failure/focus، وlogs close/
expiry/late actor result/Retry. لم يُشغّل test runner أو compileComponents؛
وجودها في ملفات specs لا يمثل قبولًا تنفيذيًا.

## المصدر والمرجع والتحقق

قُرئ العقد كاملًا والمهارة Sigma المطبقة، ونجح recipe Check للحزم الثماني.
قُرئت حزم Phase02/04 والأجزاء المصدرية المتعلقة بالحماية والقرارات من
UI26/28/9/10، ومالكو EditorDialog وConfirmationDialog وReferenceLookupBindings
وlist-route-state الفعليون. عقد root يسجل Speed S248/S220 ودورة
C0868/C0866/C0865/C0869؛ استُهلك frozen contract بدل إعادة فتح قرارات
مراجع المصدر أو اختراع تحويل quotation/referral. لا Odoo decision مادية
مطلوبة هنا، ولا screenshot جديدة، ولا تغيير precision quantities/period.

نجح التحليل النحوي فقط لثمانية TS ملفات، وparseTemplate لثلاثة HTML
ملفات. فحص imports المحلية بلا مفقود؛ فحص الأسماء المرشحة غير المستخدمة
بلا نتائج، وفحص duplicate class members/merge markers/trailing whitespace
بلا مشاكل. رُوجع scoped diff لملكية القائمة/المرحلة/السجل/routes، وgit
diff --check نظيف؛ تحذيرات LF→CRLF مستقبلية فقط. لم ينفذ formatter أو
typecheck أو lint أو builds/tests/browser/DB/migrations/snapshots/commit/
push/deploy. لم يُنشئ العامل وكلاء إضافيين ولم يعدل shared/service/details/
registry/backend/guide/vocabs أو الحزم المولدة.

## الدليل والأداء وقبول المالك

الجذر يملك topic Lease inquiries القائم في lease-guide.ts ومساره
/UserGuide/lease وترجماته والجرد. يلزم أن يوضح منح View/Create المطلوبة،
استقلال Stage/Logs، بقاء المسودة عند سحب المنحة، حدود export، وإغلاق
logs وإلغاء القراءات دون إرسال أو تحويل مالي/quotation جديد.

لا API أو SQL/index جديد. عدد المصادر التشغيلية ونطاق paging/export
باقيان؛ لا قياس سرعة أو SQL plan مدعى. Page/local loading source wiring
متسق مع المالك المشترك، بينما ظهور progress تحت overlay وRTL/theme/
viewport والفعلية بقيت pending owner verification مع البناء وتشغيل
المواصفات. تفاصيل التطبيق والخلفية وتكامل المالك تُدقق مستقلًا قبل إقفال
الوحدة أو الهدف؛ لا يدعي هذا التسليم إقفال هدف الصلاحيات.

رسالة commit مقترحة دون تنفيذ:
`fix(lease): enforce inquiry list stage and log access lifetimes`
