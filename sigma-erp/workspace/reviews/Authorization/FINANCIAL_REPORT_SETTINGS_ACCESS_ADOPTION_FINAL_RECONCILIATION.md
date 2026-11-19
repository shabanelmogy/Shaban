# مصالحة صلاحيات إعدادات التقارير المالية — ٧ نوفمبر ٢٠٢٦

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| العقد | FINANCIAL_REPORT_SETTINGS_ACCESS_ADOPTION_CONTRACT_FREEZE.md |
| الهدف العام | active؛ بقية المسارات والقبول التشغيلي معلق |

## المطابقة

| الجزء | النتيجة المصدرية |
|---|---|
| المسار | /FinancialReportSettings exact policy يحتاج GetOptions + Get + GetStatementOptions؛ لا prefix عام |
| workspace | options/settings reads guarded؛ Initialize/Save/DeleteRow exact write grants؛ mounted host hidden+inert، dirty draft محفوظ، actor/auth/token/context fences |
| statement children | GetStatementOptions + GetStatement لكل kind؛ SaveStatement/DeleteStatementRow exact؛ active child يوقف reads/actions عند الحجب ويستعيدها دون overwrite dirty |
| dialogs | view/edit requirements ديناميكية، actions/portal/multiselect guards، discard/delete confirmations ملغاة عند revoke وتعيد false، local denied discard متاح |
| mutations | Initialize/Save/Delete/SaveStatement/DeleteStatementRow لا تُلغى بعد الإرسال ولا تُعاد تلقائيًا؛ نتائج السياق القديم لا تطبق |
| loading/cache | direct reads بلا cache opt-in؛ parent والـstatement finite reads تحت LoadingService القائم، والـDataTable يحتفظ busy. bootstrap بعد token، وEMPTY/failure له Retry ظاهر. لا watch أو مالية جديدة |
| الخلفية | Controller وReviewedPermissionOperations keys طابقت المصدر؛ لا DTO/EF/AutoMapper/schema/migration |
| الدليل | دليل الحسابات يصف إعدادات التقارير؛ حُفظت الحسابات وقواعد الاختيارات الحالية |

## التحقق والحدود

تسليم العاملين scoped diff-check وmerge-marker/trailing-whitespace نجحا؛
أضيفت مواصفات workspace/row/statement workspace/statement row. لم تُشغّل
المواصفات أو build/lint/browser/DB. أُعيدت مراجعة التكامل بعد التصحيحات، بما
فيها dynamic mode في نافذتي الصفوف وإغلاق Select/MultiSelect portals وexact
row/session وحفظ draft مع تغير eligibility وحذف confirmed فعلي وrevoke/regrant
السريع وsent outcomes وتصفير baseline عندexpiry. استُخدمت قوالب حقيقية في
مواصفات row/statement؛ بعض parent unit specs ما زالت تعزل القالب، فلا تثبت
تكامل كل الصفحة أو الرؤية. العدادات الحالية في الجرد والـcheckpoint؛ لا
يعني تأكيد المصدر قبولًا تشغيليًا أو اكتمال الهدف العام.

الاستعلامات وعقود DTO والمال لم تتغير، ولا توجد توصية index مثبتة تستدعي
schema. القياس والـSQL plans عند المالك. أُعيد توليد الحزم الثمانية بالمولد
بعد توسيع قاعدة الحجب المشتركة لمنطقة الجدول، ونجح فحص٨/٨.

يلزم تشغيل اختبارات workspace وstatement، وتجربة user بلا Save/Initialize/Delete
ومدير بصلاحيات كاملة، سحب الصلاحية أثناء خيارات/إعداد/حوار/حفظ، حفظ مسودة
ثم إعادة المنح، فشل النقل، RTL والثيمين، وتبديل tabs مع الحفاظ على loader.

رسالة مقترحة:

`feat(accounts): protect financial report settings lifecycle`
