# عقد قراءات الإيصال المدمج بعقد البيع

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠٧ |
| النطاق | قراءات bootstrap غير المستخدمة في Receipt embedded عندما fromSalesAgreement، وتبويب التخصيصات المحجوب أصلًا |
| المستثنى | standalone Receipt أو الإيجار/العرض؛ تغيير العملة أو الحسابات أو التحصيل عبر الفروع؛ فتح route البيع قبل اكتمال التبني |

هذه خطوة إزالة تبعيات غير مستخدمة قبل تبني صلاحيات الإيصال. مصدر العميل
الحالي Receipt/sales-agreement-context يعيد العميل وعملة المصدر وأقساطه؛
يُقفل نوع السند على العميل ورقم اتفاقية الإيجار. لا تغير هذه الخطوة API
أو payload أو قواعد التحصيل أو تتبنى صلاحيات المسار بمفردها.

## القراءات والعرض المجمدان

في الإيصال المدمج بعقد البيع فقط:

- تُتخطى RentalAgreement.Lookup وAccount.GetPostingSelect من bootstrap؛
  agreementId مقفول وخالٍ لهذا المصدر، وreceiptType=0 لا يستخدم creditAccountId.
- لا يبدأ Receipt.Parties ولا RetryParties؛ العميل والـlabel من Context فقط.
- لا يبدأ Receipt.Receivables ولا يتاح تبويب allocations؛ setCurrentTab الحالي
  يحظر هذا التبويب أصلًا في fromSalesAgreement. لا تغير تخصيصًا خلفيًا أو تربط
  الإيصال تلقائيًا بفواتير؛ قرار التحصيل ما زال معلقًا.
- تبقى قراءات Branch.Lookup وPaymentMethod.Lookup/View وBank.Lookup والسياسة
  والإعدادات والعملات على عقدها الحالي في هذه الخطوة. تصنيف bank/settings
  ومصادر DocumentCurrency للصلاحيات يأتي بعقد تبنٍّ مستقل بعد الدليل الفعلي.
- لا يُمس باقي المستهلكين: standalone ولو في query سياق بيع، وembedded invoice/
  quotation/rental/lease تظل بالقراءات الحالية حتى تبني عقودها.

لا قراءة API جديدة أو cache أو schema أو مال/تقريب/DTO/AutoMapper. يقل عدد
القراءات في هذا السياق بأربع جهات غير مستخدمة فقط؛ لا ادعاء قياس سرعة فعلي.
Branch/PaymentMethod يحتفظان watch الحالي بعد bootstrap، والقراءة السياقية
المباشرة تبقى مع contextReads/finalize ومالك الحوار الحالي.

## الدليل والمرجع والتحقق

الجذر راجع init/loadDropdown/configureParties/configureAllocationLookup/
loadSalesAgreementContext وبناء payload وقوالب الإيصال الحالية، وخدمات
القراءات وأوصافها. مصدر غير مستخدم لا يصبح شرط صلاحية لمجرد أنه يُطلب.
المرجع Speed Sales Agreement بتاريخ٢٨أكتوبر يربط create receipt كإجراء،
والكود C0786 فُحص مستقلًا؛ لا دليل مرجعي يفرض قراءة قائمة عملاء/إيجارات
حين السياق مقفول. شرح٢٧أكتوبر لا يثبت تفاصيل إيصال بيع المعدات؛ لا تُخمن
منه قاعدة مالية. مدخل Odoo19 متاح ولا حاجة لقاعدة أعمال مكملة في حذف طلب
لا يستخدمه هذا السياق. تتبع الكتب Master4/5/7 وUI2/13/22/26/28، وCheck الحزم
الثماني كلهاOK. التطبيق الحالي يستخدم محرر سند UI08 داخل EditorDialog.

اختبارات RED/GREEN مصدرية السلوك مع mocks عند حدود HTTP/services: إيصال
عقد البيع لا يقرأ المصادر الأربع، ويبقي Context/Branch/PaymentMethod/Policy؛
تغيير مبلغ/فرع أو Retry لا يستدعي receivables أو parties، والـlabel المقفول
يأتي من العقد؛ standalone يبقى يقرأ مصادره. لا بناء أو DB للعاملين؛ الجذر
يشغّل الاختبارات والبناء المفوضين متسلسلًا ويحدّث دليل التطبيق والمصالحة.

## تصحيح هوية الإنشاء المدمج — اكتشاف المسار الفعلي، ٧ نوفمبر

المحرر يضبط isCreateMode=true لكل embedded، لكنه كان يقرأ paramMap.id من
route الأب ويخزنه بوصفه Receipt.id. عند فتح الإيصال من عقد محفوظ، يتسرب id
العقد إلى تبويب approval وشروط recordId لإيصال غير مرتبط. المصدر الفعلي
SalesAgreement view/edit يحمل id للأب؛ لا يجوز استخدامه لهوية سند جديد.
يُصحح init لكل embedded create ليبدأ id=null؛ يحتفظ salesAgreementId أو
مصدره الآخر بهويته المستقلة، وتظل هوية standalone من مسار الإيصال كما هي.
هذه مطابقة هوية إنشاء موجودة في init، لا workflow أو منع أعمال جديد.
يلزم regression من parent route id موجبة: create=true وReceipt.id=null
وغياب تبويبapproval مع بقاء Context الصحيح؛ لا GET approval/قراءة سند أب.
