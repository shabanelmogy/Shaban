# تبني صلاحيات إعدادات التقارير المالية

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | Accounts/FinancialReportSettings workspace، نوافذ الصفوف، statement workspaces، service/controller، السجل والدليل |
| التحقق | source-only؛ لا builds/tests/lint/browser/DB/migrations/commits |

## المفاتيح والأحداث

المسار الفعلي /FinancialReportSettings إلى workspace.component والمالكين
StatementWorkspace/RowDialogs. الخدمة تستخدم FinancialReportSettings exact:

| الحدث | المفتاح |
|---|---|
| قراءة الخيارات | FinancialReportSettings.GetOptions |
| قراءة الإعداد النقدي | FinancialReportSettings.Get |
| قراءة خيارات القوائم | FinancialReportSettings.GetStatementOptions |
| قراءة قائمة دخل/ميزانية | FinancialReportSettings.GetStatement |
| Initialize | FinancialReportSettings.Initialize |
| حفظ الإعداد النقدي | FinancialReportSettings.Save |
| حفظ قائمة دخل/ميزانية | FinancialReportSettings.SaveStatement |
| حذف صف نقدي | FinancialReportSettings.DeleteRow |
| حذف صف قائمة | FinancialReportSettings.DeleteStatementRow |

لا CRUD generic أو aliases. القراءة الأساسية تحتاج GetOptions + Get + GetStatementOptions
للـworkspace mounted؛ كل statement child يحتاج GetStatementOptions + GetStatement.
Initialize/Save/Delete وSaveStatement/DeleteStatementRow writes مستقلة. لا يظهر
زر الحذف أو الحفظ عند غياب write المناسب، ولا يكفي Get.

## العمر والسياق

المحرر مركب وم mounted؛ access/context/actor/auth/token snapshot يملك workspace
والنوافذ. أي سحب يوقف options/settings/statement reads ويغلق portals، ويحجب
الصفحات والنوافذ مع حفظ dirty drafts في نفس السياق. إعادة المنحة تستعيد القراءة
المنقطعة مرة دون overwrite لمسودة dirty أو GET بسبب revision غير متعلق. تغيير
المستخدم/token/tenant/branch context ينهي الجلسة ويمنع callbacks القديمة.

كل HTTP read والكتابات المنفصلة لها revision/context guard؛ POST/PUT/DELETE
المرسل لا يُلغى، لكن نتيجته لا تطبق على سياق جديد. Confirmation discard/delete
lazy؛ revoke/context يلغي القرار ويعيد false، مع local discard بدأ أثناء denial
كاستثناء UI28. Save/Initialize/delete لا يعيد تلقائيًا إرسال mutation. statement
child active tab يملك loader المحلي/المشترك المناسب، ولا يكرر global loader.

## الأداء والبيانات

GetOptions/Get/GetStatementOptions/GetStatement قراءات مباشرة بلا cache opt-in
مثبت؛ لا watch جديد. CRUD rows كاملة محلية مع source-owned totals/warnings؛
لا حسابات مالية أو DTO/AutoMapper/EF/schema جديدة. Validation/rules الحالية
للتصنيف واختيارات الحساب تظل backend authoritative. لا index أو migration.

## الأدلة والملكية

قُرئ مصدر Sigma الفعلي وFinancialReportSettingsController وReviewedPermissionOperations
ومسارات Speed06/09، مع UI06/10/13/22/26/28/29 وBE8/16/17. Speed يثبت شاشة
إعدادات التدفق والقوائم وإجراءاتها، ولا يثبت صلاحيات خادم. لا شرح أصلي مطابق
في البحث المحدد؛ Odoo غير لازم. دليل الحسابات الحالي يصف إعدادات التقارير.

العامل الأول يملك workspace + row-dialogs + service specs فقط، والعامل الثاني
يملك statement-workspace + statement-row-dialog specs فقط؛ الجذر يملك shared
authorization/registry/docs/inventory/backend والتكامل. لا ملكية متداخلة.
أضف specs سلوكية قبل implementation، واحفظ العرض الحالي والـforms والحسابات.
الهدف العام active.

## تصحيحات التكامل المثبتة

قراءة statement الأولية تستخدم LoadingService القائم، بlease واحد لكل finite
read وبـfinalize متناظر، لأن DataTable لا يوجد أصلًا قبل detail. لا يكفي busy
بدون host مرئي، ولا يضاف spinner مكرر. يبدأ bootstrap بعد التقاط token في
ngOnInit مع حارس منع التكرار؛ الفشل/EMPTY له Retry ظاهر. فحوص بيانات الحوارات
مستقلة عن تأخر input الأب، وSave مختلف عن قراءة view؛ enableEditing يعيد
فحص write المستهدف. تحديث eligibility arrays لا يعيد form.reset لمسودة قائمة.

تأكيد الحذف لا يفحص busy الذي يتضمن تأكيده نفسه؛ يستثني القرار الحالي فقط
مع إبقاء بقية حراس grant/session/row/read/write. confirmDiscard/Delete يُنشأ
داخل defer داخلي بعد اشتراك notifier؛ تسحب المنحة القرار حتى لو عادت قبل
الإجابة. خروج workspace يراقب متطلبات الكتابة للمسودات المتسخة أيضًا، مع
إتاحة قرار تجاهل محلي جديد بدأ بعد الرفض. expiry يصفر baseline وeditor وkeys
كي لا ينشأ prompt لمسودة قديمة مُفرغة.
