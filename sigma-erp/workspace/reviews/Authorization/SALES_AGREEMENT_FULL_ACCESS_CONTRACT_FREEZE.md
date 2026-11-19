# عقد تبني وصول قائمة ومحرر عقد البيع

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠٧ |
| النطاق | `/SalesAgreement` القائمة وcreate/edit/view، إجراءاتها وأحداث المحرر التابعة |
| المستثنى | Receipt/SalesQuotation standalone، قواعد مالية جديدة، الترحيل/التحصيل، schema، route فتح قبل تبني كل الأحداث |

## المتطلبات المثبتة

| السطح | المتطلب |
|---|---|
| list/view/print/export | SalesAgreement.View؛ الطباعة لا تطلب HTTP إضافيًا، والتصدير قراءة كاملة بنفس View |
| create | SalesAgreement.Create + Customer.Lookup + Bank.Lookup + SalesAgreement.GetAvailableUnits |
| edit | SalesAgreement.View + SalesAgreement.Update + Customer.Lookup + Bank.Lookup + SalesAgreement.GetAvailableUnits؛ لا Create |
| view | SalesAgreement.View؛ labels محفوظة، ولا bootstrap اختيارات التحرير |
| source quotation | SalesQuotation.View فقط عند salesQuotationId/query context |
| row invoice/deliver/receipt | الحوار/الإيصال بعقودهما المجمدة؛ لا زر لمجرد View |
| close/cancel/delete | View مع مفتاح العملية الفعلي وحارس الحالة والتأكيد/السبب الحالي |
| editor save | متطلب create أو view+update داخل الزر والhandler وقبل HTTP |
| attachments | المحرر: Media.UploadMedia + Media.DeleteMedia؛ cleanup: Media.DeleteMedia؛ MockData اختياري |
| schedule/preview/totals | محلية مشتقة؛ لا مفتاح جديد أو API مالي؛ tax/settings preview لا يفتح FX/posting |

## دورة القراءة والكتابة

كل detail/quotation/lookup/watch finite read يربط `denied$` بمتطلب الأب
والـendpoint، ويلتقط actor/record/dataContext. تغير السياق يمسح agreement/
quotation/units/lookups/form output، يغلق overlays، ويلغي pending confirmations؛
لا ينقل IDs أو draft إلى سياق جديد. سحب permission فقط يحجب السطح ويحتفظ
بمسودة نفس الجلسة، ثم يعيد bootstrap الناقص عند regrant بلا duplicate GET.

لا يلغى أي create/update/close/cancel/delete أو upload/cleanup أو callback
إيصال أُرسل بالفعل. بعد confirmation يُعاد فحص الصلاحية والسياق والحالة وقيد
المستأجر قبل HTTP. callback قديم لا يجعل النموذج pristine، لا يغلق dialog
جديدًا، ولا يعيد list أو navigation في سياق أحدث. فشل cleanup يبقي المحرر
مفتوحًا وRetry ينفذ cleanup فقط؛ لا Save ثانٍ.

القائمة تحفظ switchMap/paging/filter route والحالة الحالية، وتعيد القراءة بعد
success واحدة. export/print يلغيان القراءة القديمة عند revoke/context. watch
Customer لا يُركب إلا بعد نجاح lookup وبصلاحية حالية. العرض لا يحتاج اختيارات.

## المراجع والحدود

المرجع Speed SalesAgreement C0786 والبصمة المثبتة في مصالحة الدفعة؛ كتب
Master4/5/7 وUI2/7/13/22/26/28. عقود حوار الفوترة/التسليم وReceipt context
وDocumentCurrency قائمة ومستهلكة ولا يعاد تجميدها هنا. لا API أو keys مخترعة؛
المفاتيح من PermissionEndpointResolver/ReviewedPermissionOperations ومصادر
Sigma الحالية. لا تغيير DTO/EF/AutoMapper/query/index أو حسابات الفاتورة.

الجذر يملك العقد، route registry، services، الدليل، التشغيل والمصالحة. عامل
القائمة يملك list.ts/html/spec فقط، وعامل المحرر يملك details.ts/html/spec فقط؛
لا يلمس أي منهما shared/Receipt/action-dialog/Currency أو guide. يبدأ كل عامل
RED ثم ينتظر نتيجة الجذر قبل production. لا build/test/DB/migration/commit عند
العاملين. القبول المرئي والمالي والبيانات يبقى owner verification.
