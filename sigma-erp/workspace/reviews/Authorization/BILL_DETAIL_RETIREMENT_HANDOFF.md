# تسليم تقاعد صفحات بنود الفواتير المنفردة

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-١٠ |
| النطاق | حذف scaffold المكرر داخل مجلدي Billing/BillDetail وVouchers/Bills/BillDetail فقط |
| العقد | BILL_DETAIL_RETIREMENT_CONTRACT_FREEZE.md المجمد |
| المالك | العامل fleet_alerts_final_audit؛ التكامل والجرد والدليل النهائي لدى root |

## القرار وحدود الملكية

نُفذ تقاعد المجلدين وفق العقد المجمد وMaster5 G12، دون إعادة إحياء
endpoint أو صلاحية أو alias يفسر معرّف البند كمعرّف رأس الفاتورة. مالك
البنود الفعلي يظل Bill aggregate بعقوده ونماذجه وخدمته الحالية. لم يُعدل
العامل Bill أو backend entity/config/DTOs/mapping أو أي migration/snapshot.

## فحص ما قبل الحذف

أرجع git status --short المقيّد بالمجلدين نتيجة فارغة مباشرة قبل الحذف؛
جميع الملفات السبعة والعشرين pristine، ولم يُعكس عمل مستخدم أو عامل آخر.
فحص المراجع الموجّه بالرموز والمسارات أثبت أولًا وجود استهلاك في جذري
routing.ts وتسجيل BillDetailService داخل layout.module.ts، وموضوعي
record-list-topics.ts ومرجع invoice-guide.ts والترجمات الخاصة. توقف
الحذف حتى أزال root هذه الاتصالات ضمن ملكيته، ثم أعيد الفحص فلم يبق
import أو route أو رابط حي إلى scaffold.

الرموز المتشابهة داخل Bill/models وBill/components تنتمي إلى نماذج رأس
الفاتورة نفسه، وليست مستوردات من المجلدين المتقاعدين. بقيت دون تعديل.
فحص ملفات JSON الموجّه لم يثبت source entry صريحًا يشير إلى المجلدين.

## الملفات المحذوفة

الجذر الأول:
`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Billing/BillDetail/`

- ملف المسارات: `billdetail.routes.ts`.
- ملف الخدمة: `services/billdetail.service.ts`.
- ملفات النماذج: `models/create.ts` و`models/details.ts` و`models/list.ts`.
- ملفات القائمة: `components/list/list.component.ts` و`.html` و`.scss` و`.spec.ts`.
- ملفات المحرر: `components/details/details.component.ts` و`.html` و`.scss` و`.spec.ts`.

الجذر الثاني:
`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/Bills/BillDetail/`

- ملف المسارات: `billdetail.routes.ts`.
- ملف الخدمة: `services/billdetail.service.ts`.
- ملفات النماذج: `models/create.ts` و`models/details.ts` و`models/list.ts` و`models/grid-row.ts`.
- ملفات القائمة: `components/list/list.component.ts` و`.html` و`.scss` و`.spec.ts`.
- ملفات المحرر: `components/details/details.component.ts` و`.html` و`.scss` و`.spec.ts`.

المجموع: ١٣ ملفًا في الجذر الأول و١٤ في الثاني. نُفذ الحذف بالـapply_patch
بأسماء الملفات الصريحة، دون recursive delete. لا ملفات أخرى ضمن ملكية
العامل التطبيقية تغيرت.

## المصدر والمرجع والدليل

العقد المجمد يسجل قراءة Speed sidebar18-vouchers/09-bills وC1229، حيث
البنود جزء من محرر الفاتورة الأب؛ لا شاشة مستقلة مثبتة ولا endpoint
منفردة. استُهلكت هذه النتيجة المجمدة دون إعادة تفسير محاسبي. لا حاجة
لمرجع Odoo لحسم تقاعد scaffold غير المالك، ولا screenshots جديدة ضمن
هذه الشريحة. root يملك إزالة موضوعي الدليل الوهميين وإضافة توضيح دليل
الفاتورة الأب، ثم مطابقة الجرد؛ لم يغير العامل ملفات الدليل أو الترجمة.

## التحقق والتكلفة

- تحقق المصدر: فحص المراجع الخارجية الموجّه قبل الحذف وبعد تكامل root وبعد الحذف، دون نتائج متبقية للرموز/مسارات scaffold أو الرابط `/BillDetail` في ملفات التطبيق TS/HTML.
- تحقق الملفات: لم يعثر rg --files على ملفات متبقية داخل المجلدين بعد الحذف.
- تحقق الفرق: git diff --numstat المقيّد يسجل ٢٧ حذفًا فقط، وgit diff --check المقيّد بلا أخطاء whitespace.
- تحقق الحدود: لا تغيير عقد DTO أو حساب مالي أو AutoMapper أو مصدر خلفي؛ لا schema ولا هجرة مطلوبة لهذه الشريحة.
- تكلفة التحميل والكاش: لم يُضف request أو loading owner أو cache/watch أو SQL/index؛ أزيلت شاشتا scaffold وخدمتاهما فقط. لا ادعاء قياس أداء أو تحقق SQL أو شبكة.
- قبول التشغيل: البناء والاختبارات والمتصفح وقبول الروابط القديمة وبقاء محرر Bill وبنوده الفعلية معلقون للمالك؛ لم تُنفذ هذه الأوامر.

لم يُنفذ build/test/typecheck/lint/browser/DB/migration/commit/push/deploy،
ولم ينشئ العامل وكلاء إضافيين. لم تعدل الحزم المولدة. يظل التكامل النهائي
وتسجيل الصفين retired-source-only عند root، ولا يمثل هذا التسليم إقفال
صلاحيات Bill الأب أو هدف الصلاحيات العام.

رسالة commit مقترحة لواجهة Angular فقط، يدمجها root مع تكامله:
`refactor(billing): retire duplicate standalone bill detail scaffolds`

## تكامل الجذر والمصالحة

راجع root حذف٢٧ملفًا فقط من المجلدين، وأزال جذري routing وتسجيل الخدمة
المكرر وموضوعي الدليل وtopic keys الخاصة بهما ومرجع دليل الفواتير. بقيت
حقول الترجمة العامة تحت تعليق BillDetail لأنها ليست ملكًا حصريًا للشاشتين.
أضيف توضيح في bills-topic.ts أن البنود داخل الفاتورة المالكة، دون إعلان
اكتمال صلاحيات Bill الأب. بقيت entity/config/DTOs/mapping وأطفال Bill
الفعلية دون تعديل من هذه الشريحة، ولا migration مطلوبة.

وُسم صفا الجرد retired-source-only مع هذا الدليل؛ routeCount=263 يظل
baseline تاريخيًا، وretiredSourceOnlyCount=4 يشمل الجذرين السابقين
ProvisionDetail. لا تحويل unknown إلى عملية مؤكدة. مصدر runtime/DB ليس
جزءًا من الإقفال. فحص parsing/import existence لتسعة ملفات تكامل سليم،
وفحص الفرق المقيّد بلا whitespace findings. راجع root الفروق مع الحفاظ
على currentAccessGuard والعملات وتعديلات الدليل السابقة في الملفات نفسها.
