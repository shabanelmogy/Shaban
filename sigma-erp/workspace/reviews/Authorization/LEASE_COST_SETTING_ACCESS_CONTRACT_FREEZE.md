# عقد صلاحيات إعدادات تكلفة التأجير

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | Lease/LeaseCostSetting الفعلية: القائمة وmodal Create/View/Edit والبنود والحذف والخروج، مع API الأب ومسار الطفل القديم |
| التفويض | استكمال الصلاحيات دون أسئلة واختيار الأنسب، مع تجربة المالك مجمعة للنهاية |
| الحدود | Source-only؛ لا builds/tests/typecheck/lint/browser/DB/migration/snapshot/commit/push/deploy |

## المصدر والشكل والقرار

تُستهلك عقود LEASE_COST_SETTING_DISCOVERY_CONTRACT_FREEZE وLEASE_CONFIRMED_FIXES
المعتمدة بدل إعادة تصميم التكلفة والحسابات. المسار الوحيد يستورد
LeaseCostSetting/leasecostsetting.routes.ts وقائمة تملك modal بطفل واحد؛
لا /create أو /details/:id حيتان ولا route للطفل. الشكل UI01 controlled
modal + BE14 master-detail غير مرحِّل. المرجع المعتمد Job list وEditorDialog/
EditableCollectionTable، لا إعادة تصميم أو شاشة إعدادات keyed عامة.

قُرئ Speed S242، الأصل pages/7aed58652854e623.html بتاريخ٢٧أكتوبر؛ ثم
sidebar/10-lease/screens/03-cost-setting.md وC0864/C0863 من لقطة٢٨أكتوبر
(raw/application.js:236210–236501). يثبت القائمة make/model+markup،
Create/View/Edit/Delete، الرأس vehicle cost/markup والطراز، والصفوف من
عناصر التكلفة ونطاق السنوات ونوع المعدل وقيمته. تطابق الوظائف المعتمدة
الموجودة؛ إضافة صف يدوي بدل التوليد المسبق من كل العناصر مقصودة بالعقد
السابق، ولا تغييرها في شريحة الصلاحيات. لا export/print/domain action
أخرى فعلية تُختلق من اسم الشاشة. الكود المرجعي يعلن ManageVehicleCost
داخل UI؛ لا API Sigma أو فصل DTO/write معتمد لهذا الحقل. الاختيار الأنسب
لهذه الشريحة هو عقد Sigma الحالي: View يقرأ التفاصيل كلها وCreate/Update
يكتبان مدخلاتها، بلا ادعاء سرية حقل من إخفاء UI. الفصل الدقيق لحقل تكلفة
المركبة فجوة مرجعية مستقلة تحتاج عقد field-level ومستهلكي quotation، لا
تُضاف grant شكلية. Odoo المكمل لا يحدد عقد هذا الحقل أو معدلات Sigma،
ولا قرار ماديًا غامضًا يمنع استكمال الصلاحيات التشغيلية هنا.

## المنح والعزل

| السطح | المتطلب |
|---|---|
| route/menu/firstAllowedRoute | View أو متطلب Create الكامل أدناه |
| list/grid/paging/filter/View details | LeaseCostSetting.View |
| Create modal/POST | LeaseCostSetting.Create + CarModel.GetMakeAndModelDropdown + LeaseCostParameter.Lookup |
| Edit/PUT | View+Update مع مصدري الإنشاء |
| Delete | View+Delete، على exact current row object وبعد إعادة فحص القرار |
| child Add/Remove/edit | نفس متطلب كتابة الأب، لا grants للطفل |
| MockData | متطلب المحرر الفعلي بالإضافة إلى منح مالكه المشترك |

التعريف مشترك داخل الشركة؛ لا BranchId أو قيد مالي. Repository يفرض
tenant/live على الأب والأطفال والـFKs؛ لا اشتراط تسجيل فرع لمجرد اختيار
تعريف. يبقى no-branch guard العام، وتبقى generic API grants الفعلية مالكة
الطلبات؛ احتياج View والمصادر في UI لا يصنع استدعاءها داخل POST. Create-only
يفتح المدخل دون list GET أو grid/labels محجوبة. Update وحدها لا تفتح
واجهة بلا تفاصيل. مدير الشركة يمر بمنحته الموقعة وقواعد العملية المعتادة.

المرحلة السابقة رفضت كتابة الطفل المستقلة لكن activation الموروثة بقيت
تغيّر علمًا غير مملوك في الأب والطفل. لا IsActive ضمن form/payload أو
workflow للشاشة؛ تُرفض HandleActiveAsync للأب والطفل ب405. تُزال
assignability لهاتين activation ولـCreate/Update/Delete الطفل المرفوضة
فعليًا، دون إلغاء قراءاته القديمة أو اختراع parent-id في عقده. تبقى
الكتابة من parent snapshot، وفحص child ids/الملكية/التكرار/النطاق كما هو.

## البيانات والعمر والمالكون

الأعمدة MakeAndModelName وMarkUpPercent، وId للهوية فقط، تطابق ListVM.
لا filter bar أو export جديدة؛ grid filters تستخدم المصدر الحالي، paging
بCount ثم Id ثابت وclamp<=200. parent التفاصيل والطفل تستعمل LeanDetailBaseVm
بدل audit/tenant/GUID غير المستهلكة، مع بقاء Id وكل الحقول المعروضة. Add/
Update inputs لا calculated/audit، ولا mapping أو calculation جديدة.
سنوات from/to أعداد صحيحة؛ markup نسبة، vehicleCost مال وrate قيمة
بحسب ChargeRateType الحالي. تبقى precision/zero-boundary/validation
المجمدة؛ لا تغييرها أو backfill لحفظ البيانات التجريبية.

القائمة direct operational بpage owner، وdialog detail/lookup مباشرة
بlocal owner وRetry/finalize. CarModel/GetMakeAndModel إسقاط custom بلا
cache opt-in؛ LeaseCostParameter/GetSelect خدمته الحالية cacheSelect=false
وليس مصدر cache معتمدًا. يبقى المصدران direct finite reads مطلوبين
للكتابة؛ لا كاش أو watch جديدان بلا مالك. expiry/context/rapid regrant
يعيد القراءات المقيدة عبر المالك الحالي دون حلقة إعادة HTTP failure.
يحفظ الاختيارات الحالية وlabels لنفس actor لو ردت bootstrap فارغة.

المحرر يحفظ المسودة mounted hidden/inert عند denial، وينهي جلسته عند
تبديل actor أو استبدال mode/id، ولا يعيد hydrate مسودة dirty إلى سجل آخر.
يرفض detail id المخالف قبل patch. subtitle/portals/MockData/deferred focus
والـEditableRows تأخذ المتطلب وهوية الجلسة نفسها. قرار discard lazy
وقابل للإلغاء؛ discard المحلي متاح بعد denial وaccepted discard terminal
حتى لو تعثرت المغادرة. public canDeactivate يخدم Close وroute نفسه.

Create/Update/Delete المرسلة مستقلة عن destroy/denied، تمرر trackWrite
وسياق CAN_PRESENT_API_OUTCOME إلى الخدمة؛ terminal success قبل mayPublish
يمنع replay، فلا toast/output قديمة أو refresh لقائمة actor جديد. لا
إعادة كتابة آلية أو إعادة فتح حوار انتهى. نجاح أو failure له مالك عرض
واحد مع busy/finalize؛ لا toast محلي بجانب interceptor. route يعلن
showPageLoading=true، ولا صفحة/overlay loader منافسان.

## الملكية والإقفال

الجذر يملك helper/service/registry/backend/DTOs/catalog/guide/vocabs/docs/
الجرد والتكامل. ملكية list/**+routes مستقلة عن details/**؛ بعد تجميد هذا
العقد يمكن إسنادهما لعاملين دون overlap، مع تدقيق مستقل read-only لاحق.
يُحافظ على تغييرات المستخدم والزملاء، ولا تعديل shared/reference أو
migrations/snapshots. كل ملف untracked يُقرأ مباشرة في المصالحة.

الإقفال بعد كل الأفعال وsource specs والدليل والتدقيق المستقل وفحوص
parser/imports/translations/XML/scoped diff. لا ترقية LeaseCostSetting
في الجرد قبل ذلك؛ الجرد١٢٤/٧٧/٥٨/٢/٢=٢٦٣ وretired=5 عند البدء.
لا schema جديدة لهذه الشريحة. يلزم قياس المالك للـpage/detail/lookups/
SQL والـRTL/theme/portals وسحب المنح والكتابة المرسلة بالنهاية؛ المصدر
لا يثبت سرعة أو تنفيذًا أو نجاح build. الفهارس تُراجع وفق predicates
الحقيقية؛ لا unique/index جديد دون دليل وخطوة مالك منفصلة.
