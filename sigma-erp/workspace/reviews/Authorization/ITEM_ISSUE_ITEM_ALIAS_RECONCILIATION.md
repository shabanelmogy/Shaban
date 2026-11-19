# صلاحيات رابط بنود إذن الصرف القديم — البند ١٦٠

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٣ نوفمبر ٢٠٢٦ |
| النطاق | `/ItemIssueItem` وفروعه كتحويل إلى `/ItemIssue` |
| عقد السلوك | [ملحق ملكية بنود المخزون](../Archive/Completed/2026-10-23/STOCK_CHILD_WORKFLOW_CONTRACT_FREEZE.md) |
| حالة قائمة الصرف | [البند ١٥٩](ITEM_ISSUE_ACCESS_CONTRACT_FREEZE.md) معلّق بقراري صلاحية الإلغاء وفرع المسودة |

يُستخدم الرقم ١٦٠ لترتيب الاستكمال بعد `ItemIssue` مع تجاوز `ItemTypes` المؤكد سابقًا. صف الرابط في جرد المسارات كان `unknown` رغم أن مصدره يحوّله إلى قائمة إذن الصرف.

## السلوك المنفّذ

| المسار الوارد | الوجهة | قرار الوصول |
|---|---|---|
| `/ItemIssueItem` | `/ItemIssue` | سياسة قائمة أذون الصرف |
| `/ItemIssueItem/create` | `/ItemIssue` | سياسة القائمة |
| `/ItemIssueItem/details/:id` وأي امتداد قديم | `/ItemIssue` | سياسة القائمة |

يُرجع `redirectTo` مسارًا نظيفًا في مرحلة مطابقة الرابط. يتعامل `currentAccessGuard` مع الوجهة النهائية. يفتح مدير الشركة القائمة الحالية، ويُرفض المستخدم العادي حاليًا لأن سياسة القائمة تنتظر البند ١٥٩. الرابط القديم لا يحمل معه معرّف البند أو نية تحرير أو معاملات الاستعلام أو الجزء اللاحق للرمز `#`. لا تضاف منحة لمسار التحويل، ويظل محرر إذن الصرف مالك بنود المستند. [ملف التحويل](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemIssueItem/itemissueitem.routes.ts:4>) · [حارس الوجهة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/layout/layout.module.ts:218>)

يظل نطاق هذا البند رابط الواجهة وفق عقد ملكية البنود. منافذ API القديمة وخدماتها لها حدود توافقها الحالية. لا تُرسل عملية قراءة أو كتابة أو طلب قوائم اختيار من رابط التحويل نفسه. تملك قائمة الوجهة تحميلها حسب صلاحياتها. لا تغيير مخطط أو هجرة أو فهرس.

## الأدلة والتحقق

- يثبت شرح سبيد لواجهة الصرف ودورة أكتوبر المؤرّخة `R0568` و`C1679` و`C1678` أن عرض وتحرير الصفوف يمران عبر مستند الصرف. رابط التوافق قرار داخلي في Sigma. مرجع أودو المحفوظ للتأجير والأسطول. [مرجع أذون الصرف في سبيد](<F:/My Work/Shaban Documents/Shaban/sigma-erp/references/speed-analysis/2026-10-28/sidebar/15-stock/screens/05-item-issues.md>)
- أُضيفت مواصفات للموجّه وحارس الوجهة تغطي الروابط الثلاثة، وإسقاط المعرف وبيانات المحرر، ورفض المستخدم العادي حتى لو عنده منحة قديمة على بنود الصرف. نجح بناء Angular بإعداد `development` وفحص الأنواع المستهدف. تشغيل المواصفات وتجربة التنقل في التطبيق معلقان. [مواصفة الرابط](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemIssueItem/itemissueitem.routes.spec.ts:53>)
- حُدث دليل المخزون باللغتين لتوضيح وجهة الرابط وملكية تبويب الأصناف للبنود. مرّ فحص الفروق وحزم الوثائق الثماني. [دليل أذون الصرف](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/stock-guide.ts:192>)

صُنّف صف `ItemIssueItem` وحده كـ`alias`. الجرد الحالي ١٥٨ عملية مؤكدة، و٤٩ محدد المورد، و٥١ غير محسومًا، وبندان للسياق، و٣ روابط تحويل من أصل ٢٦٣. التالي في ترتيب الاستكمال بعد هذا الرابط هو `ItemRequisition`. [جرد المسارات](ROUTE_PERMISSION_ADOPTION_INVENTORY.json)
