# عقد تبني وصول شاشة ودائع العملاء

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠٧ |
| النطاق | `/CustomerDeposit` القائمة، البحث والتقارير والتصدير وحوارات التمديد والتحويل |
| المستثنى | مسارات إنشاء الوديعة أو الاستخدام أو الرد غير الموجودة في واجهة Sigma الحالية، وعمليات التخصيص المستقبلية |

## متطلبات الوصول

| السطح | المتطلب |
|---|---|
| فتح القائمة والبحث والتقرير والتصدير | `CustomerDeposit.View + CustomerDeposit.SearchDeposits` |
| فلتر العميل | `Customer.Lookup`؛ بدونه يختفي الفلتر وتُمسح قيمته |
| أنواع طرق الإيداع | `CustomerDeposit.GetTypes`؛ بدونه يختفي الفلتر |
| فتح حوار التمديد | `CustomerDeposit.View + CustomerDeposit.SearchDeposits + CustomerDeposit.GetActionContext + CustomerDeposit.ExtendDeposit` |
| حفظ التمديد | `CustomerDeposit.ExtendDeposit` مع تحقق الحالة في الخادم |
| فتح/حفظ التحويل | `CustomerDeposit.View + CustomerDeposit.SearchDeposits + CustomerDeposit.GetActionContext + CustomerDeposit.GetTransferAgreements + CustomerDeposit.TransferDeposit` |

## دورة القراءة والكتابة

قراءة البحث والأنواع والعملاء والتقارير تُلغى عند سحب المنحة أو تبديل actor أو
المستأجر أو سياق الفرع، ويعاد bootstrap عند إعادة المنح. التأكيدات وقرارات
الإغلاق داخل حوار الإجراء تُلغى عند انتهاء السياق. الكتابة المرسلة للتمديد أو
التحويل لا تُلغى تلقائيًا، ويُقارن سياقها قبل تطبيق الاستجابة أو إغلاق الحوار.

حالة الوديعة `canExtend` و`canTransfer` تظل قرارًا خلفيًا؛ إخفاء زر الإجراء
في الواجهة لا يستبدل فحص الخادم.

## الأدلة

مرجع Speed Deposits بتاريخ ٢٨ أكتوبر (`18-vouchers/screens/05-deposits.md`)
يثبت البحث والتقارير والتصدير والتمديد والتحويل والاستخدام والرد في المنتج
المرجعي. المصدر الحالي في Sigma يستهلك فقط Search وTypes وActionContext
وTransferAgreements وExtend وTransfer من شاشة CustomerDeposit؛ أما Use وRefund
فلا يملك لهما مستهلك واجهة حاليًا.

## إضافة التدقيق في الدفعة نفسها

تستلزم حوارات الصف استمرار حق قراءة القائمة التي أتت منها؛ لذلك أضيف
`SearchDeposits` أيضًا إلى حد الحوار، فلا يبقى portal مفتوحًا بعد منع أصل
القراءة. يُحتفظ بالمسودة أثناء منع منحة فقط، وتُراجع الأهلية من جديد عند
استعادتها، بينما ينهي تبديل سياق البيانات جلسة الحوار نهائيًا. يستمر إرسال
التمديد/التحويل المستقل حتى نتيجته دون إلغائه أو تكراره بسحب المنحة.

صُحح تصنيف SearchDeposits/GetTypes/GetActionContext/GetTransferAgreements
في `BranchOperationRules` إلى WholeDocument read؛ كانت custom operation names
تعامل خطأ كتسجيل حركات. تبقى ExtendDeposit/TransferDeposit تحت التسجيل؛
ولا يتغير نطاق مالي أو مخطط أو مفتاح قابل للإسناد.
