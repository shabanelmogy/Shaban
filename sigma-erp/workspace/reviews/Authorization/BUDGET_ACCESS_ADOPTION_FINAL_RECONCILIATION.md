# مصالحة تبني صلاحيات محرر الموازنة — ٧ نوفمبر ٢٠٢٦

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| العقد | BUDGET_ACCESS_ADOPTION_CONTRACT_FREEZE.md |
| الهدف العام | active؛ بقية الشاشات وإقفال السنة لم تُغلق |

## المطابقة

| الجزء | النتيجة المصدرية |
|---|---|
| المسار والطلب | /Budget exact؛ GET/POST AccountReports/Budget؛ GetBudget للقراءة وSaveBudget للحفظ |
| مصادر القراءة | FiscalYear.GetSelect وAccountGroupDefinition.GetReportOptions ضمن متطلب القراءة؛ لا cache/watch جديد |
| الحفظ | allOf القراءة + AccountReports.SaveBudget؛ الخلايا وزر Save والحارس البرمجي يطلبون الكتابة |
| القراءة المعلقة | deny/context/actor/token يوقف options/report/refresh ويفرغ busy؛ flags تسبق finalize وتستعيد report/options/refresh مرة عند regrant حتى مع rapid coalescing |
| المسودة | dirty rows تبقى mounted في نفس السياق، والخروج المحلي يؤكد التجاهل حتى عند الرفض؛ القراءة المستعادة لا تستبدل مسودة dirty |
| POST المرسل | لا takeUntil للوصول؛ النتيجة مستقلة، ولا duplicate POST أثناء refreshPending؛ تحديث ما بعد الحفظ منفصل قابل للإلغاء/Retry |
| المخرجات | host hidden+inert+aria-hidden عند غياب القراءة، portals Select تغلق، Export تحت القراءة والتحميل |
| الخلفية والمال | لا تغيير API/DTO/EF/AutoMapper/schema/حسابات؛ AccountBudget index الموجود محفوظ |
| الدليل | UserGuide/accounts يشرح read/write والخلية والتحديث وسياق الجلسة |

## التحقق

المراجع المستقلة لم تجد عيبًا بعد إصلاح P1 الخاص بترتيب finalize/effect؛ أضيفت
مواصفات للاستعادة السريعة، lookup الفارغ، التدمير، refresh بعد POST ومنع تكرار
الحفظ. لم تُشغّل المواصفات أو البناء أو lint أو browser أو DB. فحص المصدر
والفروق/العلامات/المسافات عند الجذر أُنجز في التكامل اللاحق؛ لا قبول تشغيل.

العداد٣٥ عند التسليم الأول تاريخي. القرار اللاحق قصر إقفال السنة والشهور
على مدير الشركة، واعتمد تلقائية تجهيز الشهور له فقط؛ الجرد والـcheckpoint
هما مصدر العدادات الحالية. لا يعني تبني المصدر قبولًا تشغيليًا.

الرسالة المقترحة:

`feat(accounts): enforce budget read and save permissions`
