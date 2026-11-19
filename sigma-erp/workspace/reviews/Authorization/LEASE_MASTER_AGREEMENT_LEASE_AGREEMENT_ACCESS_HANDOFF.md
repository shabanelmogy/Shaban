# تسليم صلاحيات عقد التأجير المضمّن من الاتفاقية الرئيسية

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | `LeaseAgreement Details` في وضع `embedded + masterAgreementSource + accessRequirement` وخدمة الإنشاء فقط |
| العقد | `LEASE_MASTER_AGREEMENT_ACCESS_CONTRACT_FREEZE.md` |
| مسؤولية التكامل | الجذر؛ لا يثبت هذا التسليم تبني شاشات LeaseAgreement العامة |

## الملفات والحدود

عُدلت الملفات:

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseAgreement/components/details/details.component.ts`

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseAgreement/components/details/details.component.html`

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseAgreement/services/leaseagreement.service.ts`

وأضيفت المواصفتان المصدريتان:

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseAgreement/components/details/master-agreement-source-access.spec.ts`

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseAgreement/services/leaseagreement-source-access.spec.ts`

لم تُعدل shared أو parent أو routes أو backend أو DTOs أو الحسابات المالية أو
المخطط أو الهجرات أو snapshots. بقيت أوضاع LeaseAgreement غير المصدرية على
مسارها القائم؛ التبني محصور في اجتماع المدخلات الثلاثة أعلاه. مصدر embedded
بلا `accessRequirement` يفشل مغلقًا ولا يعود إلى bootstrap العام.

## المطابقة المصدرية

| الجانب | النتيجة في المصدر |
|---|---|
| المتطلب | يستهلك المتطلب الممرر من الأب: `LeaseMasterAgreement.View` + `GetOpeningSource` + `LeaseAgreement.Create` + Driver/Staff/ClauseType/Common settings/Tariff، دون اختراع `LeaseAgreement.View` أو Vehicle/Customer/CarModel lookup |
| المصدر | `GetOpeningSource` قراءة مباشرة مقيدة بالممثل وهوية master/item والمنحة؛ mismatch في master/item أو تغير customer/model/vehicle type بعد mount ينهي الجلسة نهائيًا، بينما HTTP/false envelope يبقى Retry صريحًا |
| bootstrap | Driver وStaff وClauseType مباشرة، وCommon settings عبر المالك singleton القائم؛ Vehicle/Customer/CarModel broad bootstrap/watch متخطاة، والمركبات تأتي من opening source |
| الاحتفاظ بالمسودة | same-actor regrant يعيد القراءات المطلوبة دون patch ثانٍ لحقول المسودة؛ يحتفظ بالمركبة المختارة وlabelها حتى لو غابت من fresh source، بينما يحسم الخادم صلاحية الحفظ |
| التعريفة | قراءة مباشرة قابلة للإلغاء ومقيدة بالممثل/source/grant؛ queued/in-flight فقط يعاد بعد regrant، أما completed tariff فلا يعاد تلقائيًا كي لا يمسح rate/included في المسودة؛ تغير المركبة/التواريخ يبقى مشغل القراءة القائم |
| سحب المنحة | يوقف lookups/source/tariff، يعطل ويخفي/inert النموذج، يغلق Select/DatePicker/print portals ويحافظ على mounted draft؛ same-actor regrant يعيد فقط القراءات الناجحة/الجارية ولا يعمل retry loop لفشل HTTP |
| expiry | تغير actor أو source أو `embedded/accessRequirement` أو notifier الأب نهائي حتى A→B→A؛ مراقب actor يبقى مسلحًا حتى إذا بدأ المصدر denied |
| parent identity | أضيف المدخلان الاختياريان `sourcePublicationAllowed` و`sourceCancelled$`; الأول يُفحص داخل بوابة كل read/write/publication والثاني ينهي الجلسة نهائيًا، دون ربطهما بحالة busy متقلبة |
| MockData والتركيز | MockData يستهلك requirement/predicate/cancel notifier؛ deferred focus والportals تُلغى أو ترفض عند نهاية الجلسة، ولا تبقى preview بعد expiry أو regrant |
| الجداول | callbacks وEditableRows للـclauses/pre-termination تعيد فحص بوابة المصدر؛ قرارات الحذف والـfocus المرتبط بها تُلغى عند denial/expiry ولا تحيا بعد regrant؛ provisions لا تقبل Add/Remove يدويًا في المصدر |
| provisions | backend يمنع source provision creation؛ لذلك source payload يرسل دائمًا `provisions: []` ولا تُضاف grant مصطنعة لفتحها |
| POST | `create` يقبل `HttpContext` اختياريًا؛ source POST يحمل `CAN_PRESENT_API_OUTCOME` وعمره مستقل عن denied/destroy، مع success latch قبل publication |
| النتيجة القديمة | failure/success القديم لا ينشر error أو close أو navigation؛ success المرسل terminal فلا يعاد POST عند regrant |
| الخروج | public `canDeactivate` يخدم الأب وClose؛ dirty discard يبقى متاحًا بعد denial، cancellation يعيد `false`، والقبول ينهي المصدر وMockData نهائيًا |

## تكامل الأب المطلوب

يجب على consumer الاتفاقية الرئيسية تمرير المتطلب الكامل نفسه إلى:

`[accessRequirement]`

وتمرير حجب الحوار إلى:

`[accessBlocked]`

كما يمرر هوية جلسة المصدر الحالية عبر:

`[sourcePublicationAllowed]`

وإشعار تغير route/source/actor النهائي عبر:

`[sourceCancelled$]`

لا ينبغي أن يستخدم callback حالة loading/ready متقلبة؛ denial لنفس الممثل
قابل للاستعادة داخل الطفل، أما notifier الأب فهو expiry نهائي. يجب ألا يستخدم
الأب structural destroy للمحرر لمجرد denial حتى تبقى المسودة وقرار discard.

## مصادر البيانات والتحميل

| المصدر | التصنيف والعمر |
|---|---|
| `LeaseMasterAgreement/{id}/items/{quotationItemId}/opening-source` | قراءة dialog تشغيلية fresh؛ cancellable ومقيدة بالممثل وsource identity |
| Driver/Staff/ClauseType | lookups تشغيلية مباشرة؛ finite request لكل recovery مطلوب، مع retained selected labels |
| `SettingsCommonModel/GetMySetting` | singleton المشترك الحالي عبر `TaxSettingsService` |
| `LeaseTariff/GetBookingCharges` | قراءة تشغيلية مباشرة مقيدة بالمركبة والتواريخ والجلسة |
| `POST LeaseAgreement` | كتابة مستقلة بسياق نشر نتيجة محروس؛ source provisions فارغة ولا `LeaseAgreement.View` |

لا توجد broad vehicle/customer/model requests في وضع المصدر ولا طلبات لكل صف.
هذا دليل مطابقة مصدرية فقط؛ لا يدعي قياس سرعة شبكة أو SQL أو ظهور loader في
التشغيل.

## المواصفات والفحوص

أضيفت **٢٠ مواصفة مصدرية غير منفذة** تغطي bootstrap المحدود، غياب grants
المختلقة، source fencing، revoke/regrant، منع patch ثانٍ، تغير vehicle type،
input/actor/parent expiry، MockData وA→B→A، stale tariff، منع provisions،
استقلال POST وسياق النشر وterminal success، dirty discard وإلغاء القرار،
وإلغاء قرار حذف صف معلق دون mutation أو revival، وmount يبدأ denied ثم A→B→A،
وتمرير `HttpContext` في الخدمة.

كُتبت المواصفات قبل إكمال كود الإنتاج، لكن حدود المشروع منعت تشغيلها؛ لذلك
لا يُدعى RED/GREEN أو نجاح test runner. أُجريت فحوص مصدرية فقط كما يسجل تقرير
التسليم النهائي؛ ولا تعادل typecheck أو build أو tests.

لم تُنفذ builds/tests/typecheck/lint/browser/DB/migrations/snapshots/commit/
push أو deploy، ولم يُستخدم أي وكيل فرعي.

## المتبقي عند الجذر والمالك

على الجذر مصالحة parent consumer والhelper/registry والخلفية والدليل والrecipes
والجرد، ثم scoped diff review بعد دمج التغييرات المتوازية. يلزم قبول المالك
التشغيلي للمنح وrapid revoke/regrant، actor/source/route expiry، بقاء discard،
استقلال POST، loader/Retry، portals، MockData، RTL والثيمين والمقاسات. تشغيل
build/tests/typecheck يبقى فقط عند تفويض المالك.

رسالة commit مقترحة عند دمج الواجهة بواسطة المالك:

`fix(lease): fence embedded agreement source access`
