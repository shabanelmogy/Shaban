# عقد تقاعد صفحات بنود الفواتير المنفردة القديمة

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | جذرا BillDetail المكرران في Billing وVouchers/Bills؛ لا تغيير محرر Bill أو كيان بنوده |
| الحدود | Source-only؛ لا تنفيذ/build/tests/typecheck/lint/browser/DB/migration/snapshot/commit/push/deploy |

ثبت بقراءة routing.ts وجود root أول من Billing وآخر shadow من Vouchers؛
لا menu لكليهما. الخدمتان BaseService('BillDetail')، ولا Controller أو
IService/implementation باسم BillDetail بالخادم. نماذج المحررين ترسل
audit/tenant/calculated amounts، والقائمة تعرض حقول name/sku/category
ومسارات منتجات غير مرتبطة بفواتير Sigma. لا grant مورد حقيقية مثبتة؛
الصفان unknown في الجرد وتظلان مغلقتين للعادي.

مالك البنود الحقيقي هو Bill aggregate: Bill.BillDetails وBillService
والـDTOs تحت ViewModels/BillDetail وBill، بعقود Bills الحالية ومراجعة
BILL_DETAIL_SOURCE_PROVENANCE_FEATURE_REVIEW المغلقة. الـcreate/update
الفعليان في Bill/models/create.ts يحفظان المصدر والكمية والمدخلات عبر
رأس الفاتورة؛ لا إعادة إحياء endpoint مستقل لتجاوز قواعد رأس الفاتورة.

قُرئت Speed sidebar18-vouchers/09-bills ومواضع line داخل C1229؛ يربط
المرجع بنود الفاتورة بالمحرر الأب، ولا يثبت API منفردة لبنود Sigma. لا
يتغير عقد Bill أو تحويله المالي في هذا النطاق. لا شاشة أصلية مستقلة
مثبتة باسم BillDetail في فهرس القائمة، ولا حاجة Odoo لقاعدة تقاعد
scaffold لا endpoint لها. المرجع وظيفي فقط ولا ينشئ صلاحية أو redirect.

يتقاعد الجذران والمجلدان وتسجيل الخدمة المتوافقة وموضوعا الدليل الوهميان
وترجماتهما الخاصة فقط، وفق Master5 G12 ومصير كل route في الهدف المسجل.
قبل حذف أي ملف يُتحقق من كونه pristine ومن عدم وجود مستهلك حي خارج
المجلدين؛ تتوقف إزالة الملف المتغير أو المستهلك ويُبلغ root دون عكسه.
لا alias يحول child id إلى parent id. تبقى entity/config/DTOs/mapping
الخلفية وبنود Bill الحية دون تعديل، ولا schema أو حذف بيانات.

ملكية العامل: المجلدان فقط مع تقرير التسليم. ملكية root: routing.ts
وlayout.module.ts وguide/vocabs والجرد والتكامل. يُوسم صفا الجرد
retired-source-only مع evidence دون تحويل unknown إلى operation-confirmed
أو تغيير routeCount التاريخي. لا تعني هذه الشريحة إقفال صلاحيات Bill
الأب أو تكافؤه المرجعي؛ يتبناه مساره المستقل لاحقًا.

قبول المالك مجمع للنهاية: الروابط القديمة لا تفتح سجلًا آخر، ومحرر Bill
وبنوده الفعلية باقيان. فحوص المصدر/imports/diff كافية للمصالحة المصدرية
فقط؛ لا إثبات بناء أو متصفح أو معاملات مالية من هذا التقاعد.
