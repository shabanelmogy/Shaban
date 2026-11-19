# عقد صلاحيات عقود التأجير العامة وتوابعها

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| التفويض | استكمال صلاحيات التطبيق دون أسئلة؛ قبول التشغيل مجمع للنهاية |
| الحدود | مصدر فقط؛ لا بناء أو اختبارات أو lint أو فحص أنواع أو متصفح أو قاعدة بيانات أو هجرات أو حفظ إصدار |

## النطاق والمرجع

شريحة M لتبني الصلاحيات في الوحدة القائمة: القائمة النشطة والمغلقة، محرر
Create/View/Edit، وكل الحوارات الفعلية التابعة. تبقى المعادلات والحالات
والعقود المالية الحالية عند مالكها، ومسار المصدر المقفل من الماستر محفوظًا.
الأشكال UI02 للمحرر وUI09 للإجراءات؛ backend2 للعقد وbackend3 للمسارات
التي تولد حركة مالية. لا تضاف دورات أعمال جديدة أثناء تبني الصلاحيات.

قُرئت مداخل الوثائق وSpeed بتاريخ٢٧/٢٨أكتوبر، فصل الدورة01 وشاشة
10-lease/screens/07-agreements وC0849. شرح S268 بعنوان Lease Agreements
يخص استيراد البيانات في نصه، فلا يُستشهد به كشرح محرر العقود. الكود يثبت
منحًا مستقلة واستبدالًا وتمديدًا وإغلاقًا ومستندات وخصومات وتحصيلًا وسجلًا،
وليس صلاحيات خادم Sigma. مداخل Odoo19 محفوظة ومتاحة؛ لا تحسم مفاتيح
منح Sigma أو عزل فروعها، فلا نضيف منها سياسة أمنية أو مالية.
المراجع الوظيفية للحقول والحالات القائمة تُطابق في التسليم؛ الفجوات مثل
PreClose/Unclose/online payments/detailed export ليست endpoints Sigma
موجودة، وتسجل مستقلة دون الادعاء بتنفيذها ضمن صلاحيات العمليات القائمة.

## المنح المجمدة

كل الأسماء أدناه من PermissionEndpointResolver/ReviewedPermissionOperations
والمتحكم الفعلي. أي تعديل حفظ قائم يحتاج View إلى جانب منحة الإجراء، بينما
Create مستقل عن View. Activate الموروث غير مدعوم ويُرفض405 ولا يُسند.

| السطح | القراءة/الدخول | التنفيذ |
|---|---|---|
| القائمة والتفاصيل والطباعة والتصدير الحالي | LeaseAgreement.View | — |
| إنشاء عادي | LeaseAgreement.Create + Vehicle.Lookup + CarModel.GetMakeAndModelDropdown + Customer.Lookup + Driver.Lookup + Staff.Lookup + ClauseType.Lookup + SettingsCommonModel.GetMySetting + LeaseTariff.GetBookingCharges | LeaseAgreement.Create |
| تعديل | View + Update + لوكات Vehicle/CarModel/Customer/Driver/Staff/ClauseType | LeaseAgreement.Update |
| حذف | View | LeaseAgreement.Delete |
| الوثائق | View + GetDocuments | UploadDocument |
| الخصومات | View + GetDiscounts | UpdateDiscounts |
| الرسوم الإضافية | View + GetAdditionalCharges | UpdateAdditionalCharges |
| سجل الفوترة | View + GetBillingHistory | — |
| تعليمات الدفع | View + GetPaymentInstructions | UpdatePaymentInstructions |
| سجل الإجراءات | View + GetLogs | — |
| تاريخ التسليم | View + GetDeliveryDateContext | UpdateDeliveryDate |
| استبدال سائق | View + GetDriverReplacementContext | ReplaceDriver |
| استبدال مركبة | View + GetVehicleReplacementContext + Branch.Lookup + Country.Lookup + ReplacementReason.Lookup | ReplaceVehicle |
| تمديد الفترة | View + GetExtendContext + SettingsCommonModel.GetMySetting | Extend |
| تمديد فترة السعر | View + GetExtendRatePeriodContext + Staff.Lookup + ClauseType.Lookup + SettingsCommonModel.GetMySetting | ExtendRatePeriod |
| إغلاق | View + GetCloseContext + Branch.Lookup | Close |
| إبطال | View + Void | Void |
| تأمين | View + AddDeposit + Branch.Lookup + PaymentMethod.Lookup + Bank.Lookup | AddDeposit؛ رفع/تنظيف المرفق بمنح Media القائمة |
| إيصال | View + Receipt.Create | محرر Receipt القائم يملك منح قراءاته الشرطية وحفظه |

كل suffix في الجدول يعود لمورد LeaseAgreement ما لم يذكر مورد صراحة.
منح الكتابة لا تفتح قراءة السياق ضمنيًا؛ العرض read-only متاح دون الكتابة.
لوكات مرشحات القائمة Branch/Customer/Staff اختيارية حسب المنحة، ولا تُطلب
عند غيابها. View لا يطلب لوكات التحرير أو إعداد الضرائب. خادم كل عملية
يعيد حراسة الحالة والملكية والشركة والفروع؛ can* ليست تفويضًا.

## الأعمار والفروع والملكية

إعادة منح نفس الممثل تستعيد القراءة المطلوبة دون مسح مسودة موجودة أو
تكرار كتابة نجحت. تغيير الممثل أو هوية المستند ينهي الجلسة نهائيًا حتى
لو عاد الممثل الأول. القراءة/التصدير/الطباعة/التركيز/التوليد والبوابات
تُلغى بانتهاء السياق أو سحب الوصول. الحفظ المرسل مستقل عن destroy/denial؛
تُحرس نتيجته المحلية والعامة بـCAN_PRESENT_API_OUTCOME، ويثبت نجاحه قبل
النشر حتى لا يتكرر. تأكيدات lazy قابلة للإلغاء وإعادة الفحص قبل الفعل،
وتجاهل المسودة محليًا يبقى متاحًا بعد المنع. إبقاء الحوار مثبتًا مع
EditorDialog.accessBlocked؛ لا appAuthorize حول مالك مسودة أو كتابة مرسلة.

الفروع تتبع مالك Agreement الحالي وكل حواف الاستبدال: استعراض كل فروع
المستند، وتسجيل كل فروع العملية، والتحويل إضافة إلى تسجيل المصدر والوجهة.
لا اختراع فرع تاريخي أو fallback لحفظ بيانات تجريبية. يراجع الخلفي النطاق
القائم وملكيات الأبناء والمراجع الحية، ويوثق أي حاجة مخطط للمالك فقط.

## التوزيع والتحقق

الجذر يملك ملف المنح والخدمة الأمامية والقائمة/registry والدليل والجرد
والدمج النهائي. عامل الخلفية يملك خدمة العقد ومتحكمه/DTO/profile وحراسة
المنح/الملفات الخلفية المرتبطة فقط. عامل المحرر يملك details/** وroutes
النشطة والمغلقة فقط. عامل الحوارات يملك بقية components/** وأي helper
خاص داخل الوحدة فقط. لا تعديل متداخل أو ملفات shared دون إعادة تنسيق.

التحقق المخطط: مراجعة scoped diff لكل repo، parsing/import existence/XML
وترجمات وربط routes/grants، ومواصفات مصدرية غير منفذة للأعمار والحالات.
تُراجع UI2 cache/UI22 loading/UI29 وBE7 query/index بأدلة المصدر؛ لا قياس
سرعة أو ادعاء runtime. الجرد يبقى١٢٧/٧٤/٥٨/٢/٢=٢٦٣ حتى اكتمال كل
التوابع وتدقيقها. لا يعلن العامل اكتمال الوحدة أو التطبيق كله.

## ملحق الأدلة الأصلية المقروءة

قُرئ الفصل٦ من Speed_Analysis_Guide.md وشرح S206 الأصلي
pages/335c15e9155b8f39.html: تفاصيل العقد والمخصصات والبنود وتعليمات
الإنهاء ثم الحفظ وقائمة الإجراءات والطباعة وإكسل. تطابق الأسطح القائمة؛
لا يثبت الشرح منحة خادم أو حسابًا ماليًا. وقُرئ S188 للمستندات المطلوبة
وS189 لإعداد الرسوم: كلاهما إعداد مشترك من Administration/Settings،
فلا يُضم تغيير تعريفاتهما إلى صلاحية رفع وثيقة عقد أو رسومه الإضافية.
الكود المنفصل C0849 يثبت فصل منح الإجراءات ودورة نوافذها؛ واجهة Sigma
تتبع مفاتيح endpoints الفعلية وعقد الفروع القائم بدل نسخ مفاتيح Speed.

## تصحيح مصدر التعريفة في التعديل

أظهر تدقيق المحرر أن تغيير المركبة أو تاريخَي العقد في Edit يطلق
LeaseTariff/GetBookingCharges أيضًا، مع أن bootstrap لا يطلبه. لذلك
يُضاف LeaseTariff.GetBookingCharges إلى متطلب Edit المجمد ومصادره؛ لا
تُضاف قراءة Settings لإنها لا تُطلب في Edit، ولا تتغير منحة View.
هذا تصحيح جرد استهلاك مصدر موجود، لا إنشاء صلاحية أو سياسة تسعير جديدة.

## تصحيح مصادر التأمين وحماية المرفقات

قراءة تفاصيل طريقة الدفع مطلوبة بعد اختيارها، وسياسة العملة الأساسية
مطلوبة دائمًا للحفظ القائم. أضيف PaymentMethod.View و
Currency.GetFinancialNumberPolicy إلى متطلب التأمين، مع تمرير المتطلب
إلى DocumentCurrency القائم. مرفقات ReceiptDocuments اختيارية وتحتاج
Media.UploadMedia وMedia.DeleteMedia مع متطلب النموذج قبل رفع جديد؛
التنظيف المرسل يبقى مستقلًا ويعيد فحص منحة Media عند بدئه.
يحفظ نجاح التأمين مجموعة الملفات المحفوظة قبل حراسة النشر، فلا يحذف
إغلاق محلي لاحق ملفات طالب بها سند نجح أثناء سحب الوصول. لا يتكرر السند.
